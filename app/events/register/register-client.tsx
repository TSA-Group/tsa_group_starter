"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

const EVENTS: Event[] = [
  {
    id: 1,
    title: "Community Dinner Night",
    category: "community",
    activities: ["food", "family"],
    date: "Dec 28, 2025",
    time: "6:00 PM – 8:00 PM",
    location: "Highland Park Community Center",
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
    location: "Westbury Library",
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
    location: "Houston Food Bank",
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
    location: "Brazos River Park",
    attendees: 31,
    spots: 50,
    description:
      "Protect local wildlife by helping clean up river trails and banks.",
  },
  {
    id: 5,
    title: "Holiday Clothing Drive",
    category: "clothing",
    activities: ["donations", "family"],
    date: "Dec 27, 2025",
    time: "10:00 AM – 4:00 PM",
    location: "Richmond Community Hub",
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
    location: "Meadowbrook Park",
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
    location: "Main St. Alley",
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
    location: "Fulshear Senior Services",
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
    location: "Riverbend Community Garden",
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
    location: "Sugar Land Makerspace",
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
    location: "Lakeside Middle School",
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
    location: "Sugar Land Police Substation",
    attendees: 34,
    spots: 60,
    description:
      "Community safety meeting with local officers and block captains.",
  },
];

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
      <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white flex items-center justify-center px-6">
        <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-2xl p-6">
          <h1 className="text-2xl font-semibold text-indigo-300">
            Event not found
          </h1>
          <p className="text-slate-400 mt-2">
            That registration link is missing a valid event id.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="mt-5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600"
          >
            Back to Events
          </button>
        </div>
      </div>
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
    <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white antialiased">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-indigo-300">
              Register for {event.title}
            </h1>
            <p className="mt-2 text-slate-400">
              {event.date} • {event.time} • {event.location}
            </p>
          </div>

          <Link
            href="/events"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15"
          >
            Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left summary */}
          <section className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Event details</h2>
            <p className="text-slate-300 text-sm">{event.description}</p>

            <div className="mt-5">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{percent}% filled</span>
                <span>{spotsLeft} spots left</span>
              </div>
            </div>
          </section>

          {/* Right form */}
          <section className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6">
            {!submitted ? (
              <>
                <h2 className="text-lg font-semibold mb-2">Your info</h2>
                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300">First name</label>
                      <input
                        required
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        className="mt-1 w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Jane"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-300">Last name</label>
                      <input
                        required
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        className="mt-1 w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                      placeholder="Anything we should know?"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1"
                      required
                    />
                    <span>I agree to follow the event rules and code of conduct.</span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
                  >
                    Confirm Registration
                  </button>
                </form>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="text-xl font-semibold text-indigo-300">
                  You’re registered ✅
                </h2>
                <p className="text-slate-300 mt-2">
                  Thanks, {first}! Your spot is saved.
                </p>

                <div className="mt-4 text-sm text-slate-300 space-y-1">
                  <p>
                    <span className="text-slate-400">Event:</span> {event.title}
                  </p>
                  <p>
                    <span className="text-slate-400">When:</span> {event.date} • {event.time}
                  </p>
                  <p>
                    <span className="text-slate-400">Where:</span> {event.location}
                  </p>
                  <p>
                    <span className="text-slate-400">Email:</span> {email}
                  </p>
                </div>

                <Link
                  href="/events"
                  className="mt-6 block text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
                >
                  Back to Events
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
