
"use client";

import Head from "next/head";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* =====================
   Types
===================== */
type Category = { id: string; name: string };
type Activity = { id: string; name: string };

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

/* =====================
   Data (single source of truth)
   ✅ Locations updated to match your 2nd attachment
===================== */
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
    location: "After-School Study & Tutoring Meetup (Nearby study room / community study space)",
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
    location: "Neighborhood Meetup — Community Pavilion (Cross Creek Ranch Pavilion / Gathering Spot)",
    attendees: 34,
    spots: 60,
    description:
      "Community safety meeting with local officers and block captains.",
  },
];

/* =====================
   Small UI piece
===================== */
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
    {children}
  </span>
);

/* =====================
   Motion helpers
===================== */
const pageFade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

const headerUp = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55 } },
};

const panelUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardPop = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: "easeOut" } },
  exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.22 } },
};

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "popular">("upcoming");

  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "community", name: "Community" },
    { id: "meetup", name: "Meetups" },
    { id: "clothing", name: "Clothing" },
    { id: "tutoring", name: "Tutoring" },
    { id: "pantry", name: "Food Pantry" },
    { id: "cleanup", name: "Cleanup" },
  ];

  const activities: Activity[] = [
    { id: "food", name: "Food" },
    { id: "volunteering", name: "Volunteering" },
    { id: "education", name: "Education" },
    { id: "donations", name: "Donations" },
    { id: "outdoors", name: "Outdoors" },
    { id: "family", name: "Family" },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list =
      selectedCategory === "all"
        ? EVENTS
        : EVENTS.filter((e) => e.category === selectedCategory);

    if (selectedActivities.length > 0) {
      list = list.filter((e) =>
        selectedActivities.every((a) => e.activities.includes(a)),
      );
    }

    if (q) {
      list = list.filter((e) =>
        `${e.title} ${e.description} ${e.location}`.toLowerCase().includes(q),
      );
    }

    if (sortBy === "popular") {
      list = [...list].sort((a, b) => b.attendees - a.attendees);
    } else {
      list = [...list].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    }

    return list;
  }, [selectedCategory, selectedActivities, query, sortBy]);

  const toggleActivity = (id: string) =>
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedActivities([]);
    setQuery("");
    setSortBy("upcoming");
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ✅ Theme updated to match your light-blue UI */}
      <motion.div
        variants={pageFade}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 antialiased"
      >
        <style jsx>{`
          :global(body) {
            font-family: "Inter", sans-serif;
          }
          :global(h1, h2, h3, h4, h5, h6) {
            font-family: "Poppins", sans-serif;
          }
        `}</style>

        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.header variants={headerUp} initial="hidden" animate="show" className="mb-8">
            <h1 className="text-4xl font-semibold text-[#143B8C]">
              Gatherly — Community Events
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Discover local volunteering opportunities and community events in Cross Creek.
            </p>
          </motion.header>

          {/* Filters */}
          <motion.div
            variants={panelUp}
            initial="hidden"
            animate="show"
            className="bg-white/80 backdrop-blur border border-blue-200 rounded-2xl p-5 mb-10 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#143B8C]">Filter</h2>
                <p className="text-sm text-slate-600">Choose what you want to see.</p>
              </div>

              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-sm border border-blue-200 bg-white hover:bg-blue-50 transition"
              >
                Clear
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                    selectedCategory === c.id
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "bg-white text-slate-700 border border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Activities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {activities.map((a) => (
                <button
                  key={a.id}
                  onClick={() => toggleActivity(a.id)}
                  className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                    selectedActivities.includes(a.id)
                      ? "bg-blue-600 text-white border border-blue-600"
                      : "bg-white text-slate-700 border border-blue-200 hover:bg-blue-50"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events..."
                  className="w-full bg-white placeholder:text-slate-400 text-slate-800 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Sort:</span>
                <div className="inline-flex rounded-full bg-white border border-blue-200 p-1">
                  {["upcoming", "popular"].map((option) => (
                    <button
                      key={option}
                      onClick={() => setSortBy(option as "upcoming" | "popular")}
                      className={`px-4 py-1 text-sm rounded-full transition ${
                        sortBy === option
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      {option === "upcoming" ? "Upcoming" : "Popular"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Events */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((ev) => {
                const percent = Math.round((ev.attendees / ev.spots) * 100);
                const spotsLeft = ev.spots - ev.attendees;

                return (
                  <motion.article
                    key={ev.id}
                    layout
                    variants={cardPop}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300"
                  >
                    <h3 className="text-xl font-semibold mb-1 text-slate-900">
                      {ev.title}
                    </h3>

                    <p className="text-slate-600 text-sm">{ev.location}</p>
                    <p className="text-slate-700 text-sm mt-1">
                      {ev.date} • {ev.time}
                    </p>

                    <p className="text-slate-700 text-sm mt-3">
                      {ev.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {ev.activities.map((a) => (
                        <Chip key={a}>{a}</Chip>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>{percent}% filled</span>
                        <span>{spotsLeft} spots left</span>
                      </div>
                    </div>

                    {/* Register */}
                    <div className="flex gap-2 mt-5">
                      <Link
                        href={`/events/register?id=${ev.id}`}
                        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99]"
                      >
                        Register
                      </Link>
                      <button className="flex-1 bg-white border border-blue-200 text-slate-800 py-2 rounded-xl hover:bg-blue-50 transition active:scale-[0.99]">
                        Details
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
