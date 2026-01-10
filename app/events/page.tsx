"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";

/* =====================
   Types
===================== */
type Category = { id: string; name: string };
type Activity = { id: string; name: string };

type EventDoc = {
  id: string;

  title: string;
  category: string;
  activities: string[];

  // display strings
  date: string;
  time: string;

  venue: string;
  addressLine1: string;
  cityStateZip: string;

  attendees: number;
  spots: number;
  description: string;

  // for sorting
  startAt?: Timestamp;

  createdAt?: Timestamp;
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
  const q = `${ev.venue}, ${ev.addressLine1}, ${ev.cityStateZip}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
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

  // seed button state
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [queryText, setQueryText] = useState("");
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

  // ✅ live read from Firestore
  useEffect(() => {
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
      () => setLoading(false),
    );

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();

    let list =
      selectedCategory === "all"
        ? events
        : events.filter((e) => e.category === selectedCategory);

    if (selectedActivities.length > 0) {
      list = list.filter((e) =>
        selectedActivities.every((a) => (e.activities || []).includes(a)),
      );
    }

    if (q) {
      list = list.filter((e) =>
        `${e.title} ${e.description} ${e.venue} ${e.addressLine1} ${e.cityStateZip}`
          .toLowerCase()
          .includes(q),
      );
    }

    if (sortBy === "popular") {
      list = [...list].sort((a, b) => (b.attendees || 0) - (a.attendees || 0));
    } else {
      // upcoming: prefer startAt timestamp, fallback to date string
      list = [...list].sort((a, b) => {
        const ta = a.startAt?.toMillis?.() ?? new Date(a.date).getTime();
        const tb = b.startAt?.toMillis?.() ?? new Date(b.date).getTime();
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

  // ✅ SEED BUTTON HANDLER (click once)
  const seedOnce = async () => {
    try {
      setSeedMsg(null);
      setSeeding(true);

      // if any doc exists, don't seed again
      const existing = await getDocs(query(collection(db, "events"), limit(1)));
      if (!existing.empty) {
        setSeedMsg("Events already exist — seeding skipped.");
        setSeeding(false);
        return;
      }

      const batch = writeBatch(db);
      const colRef = collection(db, "events");

      for (const ev of SEED_EVENTS) {
        const docRef = (await import("firebase/firestore")).doc(colRef);
        batch.set(docRef, {
          ...ev,
          createdAt: serverTimestamp(),
        });
      }

      await batch.commit();
      setSeedMsg("✅ Seeded events successfully. Delete the seed code now.");
    } catch (err: any) {
      setSeedMsg(err?.message ?? "Seeding failed.");
    } finally {
      setSeeding(false);
    }
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
            Discover local volunteering opportunities and community events in Cross Creek.
          </p>
        </motion.header>

        <motion.div
          variants={panelUp}
          className="bg-white/80 backdrop-blur border border-blue-200 rounded-2xl p-5 mb-10 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-[#143B8C]">Filter</h2>
              <p className="text-sm text-slate-600">
                Choose what you want to see.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* ✅ one-time seed button */}
              <motion.button
                onClick={seedOnce}
                disabled={seeding}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl text-sm border border-blue-200 bg-white hover:bg-blue-50 transition disabled:opacity-60"
              >
                {seeding ? "Seeding..." : "Seed Events (one time)"}
              </motion.button>

              <motion.button
                onClick={clearFilters}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-xl text-sm border border-blue-200 bg-white hover:bg-blue-50 transition"
              >
                Clear
              </motion.button>
            </div>
          </div>

          {seedMsg && (
            <div className="mb-4 text-sm rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-700">
              {seedMsg}
            </div>
          )}

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
                const percent =
                  ev.spots > 0 ? Math.round((ev.attendees / ev.spots) * 100) : 0;
                const spotsLeft = (ev.spots || 0) - (ev.attendees || 0);

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
                      {ev.title}
                    </h3>

                    <p className="text-slate-700 text-sm font-medium">
                      {ev.venue}
                    </p>
                    <p className="text-slate-600 text-sm">
                      {ev.addressLine1}, {ev.cityStateZip}
                    </p>

                    <p className="text-slate-700 text-sm mt-1">
                      {ev.date} • {ev.time}
                    </p>

                    <p className="text-slate-700 text-sm mt-3">
                      {ev.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {(ev.activities || []).map((a) => (
                        <Chip key={a}>{a}</Chip>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
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
