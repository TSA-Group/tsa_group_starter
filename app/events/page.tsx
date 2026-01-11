"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

// ✅ FIXED: your firebase file is here
import { db } from "@/lib/firebase";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";

/* =====================
   Types
===================== */
type Category = { id: string; name: string };
type Activity = { id: string; name: string };

type EventDoc = {
  id: string;

  title?: string;
  community?: string;

  // from your admin form
  activities?: string[];
  types?: string[];

  date?: string; // "2026-01-17"
  startTime?: string; // "10:13"
  endTime?: string; // "22:14"

  startAt?: Timestamp;
  endAt?: Timestamp;

  venue?: string;
  address?: string;

  attendees?: number;
  spots?: number;
  description?: string;
};

/* =====================
   UI Bits
===================== */
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
    {children}
  </span>
);

function mapsHref(ev: EventDoc) {
  const q = `${ev.venue ?? ""}, ${ev.address ?? ""}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    q,
  )}`;
}

function formatDateLabel(ev: EventDoc) {
  if (ev.startAt) {
    return ev.startAt.toDate().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (ev.date) {
    const d = new Date(`${ev.date}T00:00:00`);
    return Number.isNaN(d.getTime())
      ? ev.date
      : d.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  return "";
}

function formatTimeRange(ev: EventDoc) {
  // Prefer Firestore timestamps if present
  if (ev.startAt && ev.endAt) {
    const s = ev.startAt
      .toDate()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const e = ev.endAt
      .toDate()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `${s} – ${e}`;
  }

  // Fallback to time strings saved by form
  if (ev.startTime && ev.endTime) {
    const s = new Date(`1970-01-01T${ev.startTime}:00`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    const e = new Date(`1970-01-01T${ev.endTime}:00`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${s} – ${e}`;
  }

  return "";
}

/* =====================
   Motion
===================== */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageWrap: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const headerUp: Variants = {
  hidden: { opacity: 0, y: 12, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const panelUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

const gridWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.985, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT },
  },
  exit: { opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.18 } },
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [queryText, setQueryText] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "popular">("upcoming");

  // These IDs MUST match what you store in Firestore `types`
  const categories: Category[] = [
    { id: "all", name: "All" },
    { id: "Community", name: "Community" },
    { id: "Meetup", name: "Meetups" },
    { id: "Clothing", name: "Clothing" },
    { id: "Tutoring", name: "Tutoring" },
    { id: "Food Pantry", name: "Food Pantry" },
    { id: "Cleanup", name: "Cleanup" },
    { id: "Workshop", name: "Workshop" },
    { id: "Other", name: "Other" },
  ];

  // These IDs MUST match what you store in Firestore `activities`
  const activities: Activity[] = [
    { id: "Food", name: "Food" },
    { id: "Volunteering", name: "Volunteering" },
    { id: "Education", name: "Education" },
    { id: "Donations", name: "Donations" },
    { id: "Outdoors", name: "Outdoors" },
    { id: "Family", name: "Family" },
  ];

  // ✅ live read from Firestore
  useEffect(() => {
    // orderBy startAt if it exists on docs, otherwise Firestore will error.
    // Your screenshot shows startAt exists, so this is correct.
    const qy = query(collection(db, "events"), orderBy("startAt", "asc"));

    const unsub = onSnapshot(
      qy,
      (snap) => {
        const list: EventDoc[] = snap.docs.map((d) => {
          const data = d.data() as Omit<EventDoc, "id">;
          return { id: d.id, ...data };
        });
        setEvents(list);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore read error:", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();

    // ✅ category filter now uses Firestore `types` (array)
    let list =
      selectedCategory === "all"
        ? events
        : events.filter((e) => (e.types || []).includes(selectedCategory));

    // ✅ activities filter matches Firestore `activities` (array)
    if (selectedActivities.length > 0) {
      list = list.filter((e) =>
        selectedActivities.every((a) => (e.activities || []).includes(a)),
      );
    }

    // ✅ search uses the fields you actually store
    if (q) {
      list = list.filter((e) =>
        `${e.title ?? ""} ${e.description ?? ""} ${e.venue ?? ""} ${
          e.address ?? ""
        }`
          .toLowerCase()
          .includes(q),
      );
    }

    if (sortBy === "popular") {
      list = [...list].sort(
        (a, b) => (b.attendees ?? 0) - (a.attendees ?? 0),
      );
    } else {
      // upcoming: prefer startAt timestamp, fallback to date string
      list = [...list].sort((a, b) => {
        const ta = a.startAt?.toMillis?.() ?? new Date(a.date || "").getTime();
        const tb = b.startAt?.toMillis?.() ?? new Date(b.date || "").getTime();
        return ta - tb;
      });
    }

    return list;
  }, [events, selectedCategory, selectedActivities, queryText, sortBy]);

  const toggleActivity = (id: string) =>
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedActivities([]);
    setQueryText("");
    setSortBy("upcoming");
  };

  return (
    <motion.div
      variants={pageWrap}
      initial="hidden"
      animate="show"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 antialiased"
    >
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(20,59,140,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,59,140,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />

        <motion.div
          aria-hidden
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-45"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(37,99,235,0.35), rgba(37,99,235,0) 60%)",
          }}
          animate={{ x: [0, 28, 0], y: [0, 18, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: EASE_OUT }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-48 -right-48 h-[620px] w-[620px] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(14,165,233,0.30), rgba(14,165,233,0) 62%)",
          }}
          animate={{ x: [0, -24, 0], y: [0, -16, 0] }}
          transition={{ duration: 11.5, repeat: Infinity, ease: EASE_OUT }}
        />
        <motion.div
          aria-hidden
          className="absolute top-[30%] left-[55%] h-[420px] w-[420px] rounded-full blur-3xl opacity-35"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.25), rgba(99,102,241,0) 60%)",
          }}
          animate={{ x: [0, 18, 0], y: [0, -22, 0] }}
          transition={{ duration: 12.2, repeat: Infinity, ease: EASE_OUT }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <motion.header variants={headerUp} className="mb-8">
          <h1 className="text-4xl font-semibold text-[#143B8C]">
            Gatherly — Community Events
          </h1>
          <p className="mt-2 text-slate-600 max-w-2xl">
            Discover local volunteering opportunities and community events in
            Cross Creek.
          </p>
        </motion.header>

        <motion.div
          variants={panelUp}
          className="bg-white/80 backdrop-blur border border-blue-200 rounded-2xl p-5 mb-10 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#143B8C]">Filter</h2>
              <p className="text-sm text-slate-600">
                Choose what you want to see.
              </p>
            </div>

            <motion.button
              onClick={clearFilters}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl text-sm border border-blue-200 bg-white hover:bg-blue-50 transition"
            >
              Clear
            </motion.button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                  selectedCategory === c.id
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white text-slate-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                {c.name}
              </motion.button>
            ))}
          </div>

          {/* Activities */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activities.map((a) => (
              <motion.button
                key={a.id}
                onClick={() => toggleActivity(a.id)}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                  selectedActivities.includes(a.id)
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white text-slate-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                {a.name}
              </motion.button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder="Search events..."
              className="flex-1 bg-white placeholder:text-slate-400 text-slate-800 px-4 py-2 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort:</span>
              <div className="inline-flex rounded-full bg-white border border-blue-200 p-1">
                {["upcoming", "popular"].map((option) => (
                  <button
                    key={option}
                    onClick={() =>
                      setSortBy(option as "upcoming" | "popular")
                    }
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

        {/* Cards */}
        <motion.div
          variants={gridWrap}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full rounded-2xl border border-blue-200 bg-white/90 p-6 text-slate-700"
              >
                Loading events...
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full rounded-2xl border border-blue-200 bg-white/90 p-6 text-slate-700"
              >
                No events found.
              </motion.div>
            ) : (
              filtered.map((ev) => {
                const attendees = ev.attendees ?? 0;
                const spots = ev.spots ?? 0;
                const percent = spots > 0 ? Math.round((attendees / spots) * 100) : 0;
                const spotsLeft = Math.max(0, spots - attendees);

                const dateLabel = formatDateLabel(ev);
                const timeLabel = formatTimeRange(ev);

                return (
                  <motion.article
                    key={ev.id}
                    layout
                    variants={cardPop}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="bg-white/90 backdrop-blur border border-blue-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-300"
                  >
                    <h3 className="text-xl font-semibold mb-1 text-slate-900">
                      {ev.title ?? "Untitled Event"}
                    </h3>

                    <p className="text-slate-700 text-sm font-medium">
                      {ev.venue ?? ""}
                    </p>

                    {ev.address ? (
                      <p className="text-slate-600 text-sm">{ev.address}</p>
                    ) : null}

                    {(dateLabel || timeLabel) && (
                      <p className="text-slate-700 text-sm mt-1">
                        {dateLabel}
                        {timeLabel ? ` • ${timeLabel}` : ""}
                      </p>
                    )}

                    {ev.description ? (
                      <p className="text-slate-700 text-sm mt-3">
                        {ev.description}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {(ev.activities || []).map((a) => (
                        <Chip key={a}>{a}</Chip>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              100,
                              Math.max(0, percent),
                            )}%`,
                          }}
                          transition={{ duration: 0.7, ease: EASE_OUT }}
                          className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-600 mt-1">
                        <span>{percent}% filled</span>
                        <span>{spotsLeft} spots left</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <Link
                        href={`/events/register?id=${ev.id}`}
                        className="text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99]"
                      >
                        Register
                      </Link>

                      <a
                        href={mapsHref(ev)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-center bg-white border border-blue-200 text-slate-800 py-2 rounded-xl hover:bg-blue-50 transition active:scale-[0.99]"
                      >
                        Open in Maps
                      </a>
                    </div>
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
