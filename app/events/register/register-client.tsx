// app/events/register/register-client.tsx
"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";

type Event = {
  id: number;
  title: string;
  category: string;
  activities: string[];
  date: string;
  time: string;
  location: string;
  attendees: number;
  spots: number;
  description: string;
};

/* ✅ Locations + vibe updated to match your light-blue theme */
const EVENTS: Event[] = [
  {
    id: 1,
    title: "Community Dinner Night",
    category: "community",
    activities: ["food", "family"],
    date: "Dec 28, 2025",
    time: "6:00 PM – 8:00 PM",
    location: "Cross Creek Ranch Welcome Center (Fulshear, TX)",
    attendees: 42,
    spots: 60,
    description:
      "A welcoming dinner bringing neighbors together for conversation and connection.",
  },
  {
    id: 2,
    title: "Literacy Tutoring Session",
    category: "tutoring",
    activities: ["education"],
    date: "Dec 25, 2025",
    time: "4:00 PM – 6:00 PM",
    location: "Fulshear Branch Library (Nearby) (Fulshear, TX)",
    attendees: 14,
    spots: 20,
    description:
      "Volunteer to help young students improve reading and writing skills.",
  },
  {
    id: 3,
    title: "Food Pantry Distribution",
    category: "pantry",
    activities: ["food", "donations"],
    date: "Dec 26, 2025",
    time: "9:00 AM – 1:00 PM",
    location: "Community Food Pantry Support (Nearby) (Fulshear/Katy area)",
    attendees: 88,
    spots: 110,
    description: "Help organize and distribute food to families in need.",
  },
  {
    id: 4,
    title: "River Cleanup Day",
    category: "cleanup",
    activities: ["outdoors", "volunteering"],
    date: "Dec 29, 2025",
    time: "8:00 AM – 12:00 PM",
    location: "Cross Creek Trails (meet near main trailhead)",
    attendees: 31,
    spots: 50,
    description:
      "Protect local wildlife by helping clean up trails and public spaces.",
  },
  {
    id: 5,
    title: "Holiday Clothing Drive",
    category: "clothing",
    activities: ["donations", "family"],
    date: "Dec 27, 2025",
    time: "10:00 AM – 4:00 PM",
    location: "Cross Creek Ranch Welcome Center (Fulshear, TX)",
    attendees: 27,
    spots: 40,
    description:
      "Sort and organize donated winter clothing for families in need.",
  },
  {
    id: 6,
    title: "Park Tree Planting",
    category: "cleanup",
    activities: ["outdoors", "volunteering"],
    date: "Jan 04, 2026",
    time: "9:00 AM – 12:00 PM",
    location: "Flewellen Creek Park & Trails (Fulshear, TX)",
    attendees: 22,
    spots: 40,
    description: "Plant native trees and learn about local ecology.",
  },
  {
    id: 7,
    title: "Neighborhood Mural Project",
    category: "meetup",
    activities: ["volunteering", "family"],
    date: "Jan 12, 2026",
    time: "9:00 AM – 5:00 PM",
    location: "Cross Creek Ranch Community Pool (Fulshear, TX)",
    attendees: 16,
    spots: 30,
    description:
      "Assist local artists in painting a community mural; no experience required.",
  },
  {
    id: 8,
    title: "Senior Meal Delivery",
    category: "community",
    activities: ["food", "volunteering"],
    date: "Jan 08, 2026",
    time: "10:00 AM – 1:00 PM",
    location: "HEB (Nearby Grocery) (Fulshear, TX area)",
    attendees: 12,
    spots: 20,
    description: "Deliver warm meals and check in with homebound seniors.",
  },
  {
    id: 9,
    title: "Community Garden Workshop",
    category: "meetup",
    activities: ["outdoors", "education"],
    date: "Jan 15, 2026",
    time: "9:00 AM – 11:30 AM",
    location: "Flewellen Creek Park & Trails (Fulshear, TX)",
    attendees: 18,
    spots: 30,
    description: "Hands-on workshop about seasonal planting and composting.",
  },
  {
    id: 10,
    title: "Clothing Repair Pop-up",
    category: "clothing",
    activities: ["donations", "education"],
    date: "Jan 18, 2026",
    time: "11:00 AM – 3:00 PM",
    location: "Cross Creek Ranch Welcome Center (Fulshear, TX)",
    attendees: 9,
    spots: 20,
    description:
      "Learn basic mending skills and repair donated garments for reuse.",
  },
  {
    id: 11,
    title: "After-school STEM Club",
    category: "tutoring",
    activities: ["education", "family"],
    date: "Jan 20, 2026",
    time: "3:30 PM – 5:30 PM",
    location:
      "After-School Study & Tutoring Meetup (Nearby study room / community study space)",
    attendees: 26,
    spots: 30,
    description:
      "Volunteer mentors lead hands-on STEM projects for middle schoolers.",
  },
  {
    id: 12,
    title: "Neighborhood Watch Meeting",
    category: "meetup",
    activities: ["volunteering", "family"],
    date: "Jan 22, 2026",
    time: "7:00 PM – 8:30 PM",
    location:
      "Neighborhood Meetup — Community Pavilion (Cross Creek Ranch Pavilion / Gathering Spot)",
    attendees: 34,
    spots: 60,
    description:
      "Community safety meeting with local officers and block captains.",
  },
];

/* ===== Motion (TS-safe easing) ===== */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } },
};

const cardUp: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const eventId = Number(idParam);

  const event = useMemo(() => {
    if (!idParam || Number.isNaN(eventId)) return null;
    return EVENTS.find((e) => e.id === eventId) ?? null;
  }, [idParam, eventId]);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!event) {
    return (
      <motion.div
        variants={pageFade}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 flex items-center justify-center px-6"
      >
        <motion.div
          variants={cardUp}
          className="max-w-xl w-full bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
        >
          <h1 className="text-2xl font-semibold text-[#143B8C]">
            Event not found
          </h1>
          <p className="text-slate-600 mt-2">
            That registration link is missing a valid event id.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="mt-5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition active:scale-[0.99]"
          >
            Back to Events
          </button>
        </motion.div>
      </motion.div>
    );
  }

  const percent = Math.round((event.attendees / event.spots) * 100);
  const spotsLeft = event.spots - event.attendees;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setSubmitted(true);
  };

  return (
    <motion.div
      variants={pageFade}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 antialiased"
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div variants={cardUp} className="mb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold text-[#143B8C]">
                Register for {event.title}
              </h1>
              <p className="mt-2 text-slate-600">
                {event.date} • {event.time} • {event.location}
              </p>
            </div>

            <Link
              href="/events"
              className="px-4 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 transition"
            >
              Back to Events
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left summary */}
          <motion.section
            variants={cardUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-2 text-[#143B8C]">
              Event details
            </h2>
            <p className="text-slate-700 text-sm">{event.description}</p>

            <div className="mt-5">
              <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>{percent}% filled</span>
                <span>{spotsLeft} spots left</span>
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-600">
              <p>
                <span className="font-medium text-slate-700">Location:</span>{" "}
                {event.location}
              </p>
            </div>
          </motion.section>

          {/* Right form */}
          <motion.section
            variants={cardUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
          >
            {!submitted ? (
              <>
                <h2 className="text-lg font-semibold mb-2 text-[#143B8C]">
                  Your info
                </h2>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700">
                        First name
                      </label>
                      <input
                        required
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700">Last name</label>
                      <input
                        required
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-700">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700">
                      Notes (optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
                      placeholder="Anything we should know?"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1 accent-blue-600"
                      required
                    />
                    <span>I agree to follow the event rules and code of conduct.</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99]"
                  >
                    Confirm Registration
                  </button>

                  <p className="text-xs text-slate-600">
                    By registering, you’ll receive updates about this event.
                  </p>
                </form>
              </>
            ) : (
              <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-[#143B8C]">
                  You’re registered ✅
                </h2>
                <p className="text-slate-700 mt-2">
                  Thanks, {first}! Your spot is saved.
                </p>

                <div className="mt-4 text-sm text-slate-700 space-y-1">
                  <p>
                    <span className="text-slate-500">Event:</span> {event.title}
                  </p>
                  <p>
                    <span className="text-slate-500">When:</span> {event.date} •{" "}
                    {event.time}
                  </p>
                  <p>
                    <span className="text-slate-500">Where:</span>{" "}
                    {event.location}
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span> {email}
                  </p>
                  {notes.trim() ? (
                    <p>
                      <span className="text-slate-500">Notes:</span> {notes}
                    </p>
                  ) : null}
                </div>

                <Link
                  href="/events"
                  className="mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99]"
                >
                  Back to Events
                </Link>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
