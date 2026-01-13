"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  type Variants,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

// ✅ your firebase file
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";

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
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
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
  if (ev.startAt && ev.endAt) {
    const s = ev.startAt
      .toDate()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const e = ev.endAt
      .toDate()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `${s} – ${e}`;
  }

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
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const headerUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

const panelUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

const gridWrap: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE_OUT },
  },
  exit: { opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.18 } },
};

const shimmerIn: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

export default function EventsPage() {
  const reduce = useReducedMotion();

  /* ======== DO NOT CHANGE FUNCTIONALITY ======== */
  const [events, setEvents] = useState<EventDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [queryText, setQueryText] = useState("");
  const [sortBy, setSortBy] = useState<"upcoming" | "popular">("upcoming");

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

  const activities: Activity[] = [
    { id: "Food", name: "Food" },
    { id: "Volunteering", name: "Volunteering" },
    { id: "Education", name: "Education" },
    { id: "Donations", name: "Donations" },
    { id: "Outdoors", name: "Outdoors" },
    { id: "Family", name: "Family" },
  ];

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
      (err) => {
        console.error("Firestore read error:", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();

    let list =
      selectedCategory === "all"
        ? events
        : events.filter((e) => (e.types || []).includes(selectedCategory));

    if (selectedActivities.length > 0) {
      list = list.filter((e) =>
        selectedActivities.every((a) => (e.activities || []).includes(a)),
      );
    }

    if (q) {
      list = list.filter((e) =>
        `${e.title ?? ""} ${e.description ?? ""} ${e.venue ?? ""} ${e.address ?? ""}`
          .toLowerCase()
          .includes(q),
      );
    }

    if (sortBy === "popular") {
      list = [...list].sort((a, b) => (b.attendees ?? 0) - (a.attendees ?? 0));
    } else {
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

  /* =====================
     Visual Motion (ONLY)
  ===================== */
  const { scrollY, scrollYProgress } = useScroll();
  const scrollProgSmooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const vel = useVelocity(scrollY);
  const velSmooth = useSpring(vel, { stiffness: 80, damping: 30 });
  const tilt = useTransform(velSmooth, [-1600, 0, 1600], [-1.0, 0, 1.0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const glowX = useTransform(mx, (v) => `${v}px`);
  const glowY = useTransform(my, (v) => `${v}px`);

  const bg = useTransform(
    scrollProgSmooth,
    [0, 0.35, 0.7, 1],
    ["#F6FAFF", "#F2F7FF", "#EEF5FF", "#EAF0FF"],
  );

  const softGrey = useTransform(
    scrollProgSmooth,
    [0.25, 0.55],
    ["rgba(226,232,240,0)", "rgba(203,213,225,0.55)"],
  );

  const navyWash = useTransform(
    scrollProgSmooth,
    [0.62, 1],
    ["rgba(15,23,42,0)", "rgba(15,23,42,0.12)"],
  );

  const progScaleX = useTransform(scrollProgSmooth, [0, 1], [0.06, 1]);

  const grainX = useTransform(scrollY, [0, 1200], [0, -110]);
  const grainY = useTransform(scrollY, [0, 1200], [0, -80]);

  const ORBS = useMemo(
    () => [
      { size: 360, color: "rgba(59,130,246,0.16)", top: 12, left: 6, speed: 0.22 },
      { size: 520, color: "rgba(147,197,253,0.14)", top: 48, left: 76, speed: 0.33 },
      { size: 260, color: "rgba(15,23,42,0.10)", top: 72, left: 18, speed: 0.15 },
      { size: 420, color: "rgba(147,197,253,0.10)", top: 20, left: 86, speed: 0.26 },
      { size: 320, color: "rgba(59,130,246,0.12)", top: 62, left: 52, speed: 0.21 },
    ],
    [],
  );

  const orbX: MotionValue<number>[] = ORBS.map(() => useMotionValue(0));
  const orbY: MotionValue<number>[] = ORBS.map(() => useMotionValue(0));

  const mouseRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const h = window.innerHeight || 1;
    const w = window.innerWidth || 1;
    const scrollRange = document.body.scrollHeight - h || 1;

    const m = mouseRef.current;

    ORBS.forEach((orb, i) => {
      const mouseFx = (m.x / w - 0.5) * 180 * orb.speed;
      const mouseFy = (m.y / h - 0.5) * 180 * orb.speed;
      const scrollFy = -240 * orb.speed * (y / scrollRange);

      orbX[i].set(mouseFx);
      orbY[i].set(scrollFy + mouseFy);
    });
  });

  return (
    <motion.div
      variants={pageWrap}
      initial="hidden"
      animate="show"
      style={{ background: bg }}
      className="relative min-h-screen overflow-hidden text-slate-900 antialiased"
    >
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progScaleX }}
        className="fixed left-0 top-0 h-1 w-full origin-left bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 z-[60]"
      />

      {/* Cursor spotlight */}
      <motion.div
        aria-hidden
        style={{
          background: useTransform([glowX, glowY], ([x, y]) => {
            return `radial-gradient(420px circle at ${x} ${y}, rgba(59,130,246,0.18), rgba(59,130,246,0.06) 35%, rgba(255,255,255,0) 70%)`;
          }),
        }}
        className="fixed inset-0 pointer-events-none -z-30"
      />

      {/* Grain */}
      <motion.div
        aria-hidden
        style={{ x: grainX, y: grainY, opacity: reduce ? 0.05 : 0.085 }}
        className="fixed inset-0 pointer-events-none -z-30"
      >
        <div
          className="w-[140%] h-[140%]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
      </motion.div>

      {/* Floating Orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            x: reduce ? 0 : orbX[i],
            y: reduce ? 0 : orbY[i],
            width: orb.size,
            height: orb.size,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            backgroundColor: orb.color,
          }}
          className="absolute rounded-full pointer-events-none -z-20 blur-3xl"
        />
      ))}

      {/* Soft overlays */}
      <motion.div
        style={{ backgroundColor: softGrey }}
        className="fixed inset-0 pointer-events-none -z-20"
      />
      <motion.div
        style={{ backgroundColor: navyWash }}
        className="fixed inset-0 pointer-events-none -z-20"
      />

      {/* Background grid */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.20] [background-image:linear-gradient(to_right,rgba(20,59,140,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,59,140,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <motion.header variants={headerUp} style={{ rotate: reduce ? 0 : tilt }} className="mb-8">
          <motion.div
            variants={shimmerIn}
            className="rounded-[28px] border border-blue-200 bg-white/65 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] px-6 sm:px-10 py-8 relative overflow-hidden"
          >
            {/* ✅ FIX: pointer-events-none so it NEVER blocks clicks */}
            <div className="pointer-events-none absolute -top-20 -left-16 w-[420px] h-[420px] rounded-full bg-blue-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 w-[460px] h-[460px] rounded-full bg-blue-500/10 blur-3xl" />

            <div className="text-xs sm:text-sm font-semibold text-blue-700 tracking-[0.22em]">
              DISCOVER • VOLUNTEER • CONNECT
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600">
              Gatherly — Community Events
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Discover local volunteering opportunities and community events in Cross Creek.
            </p>

            <motion.div
              className="mt-5 text-blue-700/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <motion.span
                className="inline-flex items-center gap-2"
                animate={reduce ? undefined : { y: [0, 4, 0] }}
                transition={reduce ? undefined : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-semibold">Scroll</span>
                <span className="opacity-80">to explore</span>
                <span aria-hidden>↓</span>
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.header>

        {/* Filter panel */}
        <motion.div
          variants={panelUp}
          className="bg-white/70 backdrop-blur-xl border border-blue-200 rounded-3xl p-5 mb-10 shadow-[0_18px_60px_rgba(15,23,42,0.08)] relative overflow-hidden"
        >
          {/* ✅ FIX: pointer-events-none so the blobs NEVER block filter clicks */}
          <div className="pointer-events-none absolute -top-16 -right-20 w-[360px] h-[360px] rounded-full bg-blue-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-24 w-[420px] h-[420px] rounded-full bg-sky-300/10 blur-3xl" />

          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#143B8C]">Filter</h2>
              <p className="text-sm text-slate-600">Choose what you want to see.</p>
            </div>

            <motion.button
              onClick={clearFilters}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl text-sm border border-blue-200 bg-white/80 hover:bg-blue-50 transition shadow-sm"
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
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                  selectedCategory === c.id
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white/80 text-slate-700 border border-blue-200 hover:bg-blue-50"
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
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                  selectedActivities.includes(a.id)
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white/80 text-slate-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                {a.name}
              </motion.button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-blue-700/60">
                🔎
              </div>
              <input
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="Search events..."
                className="w-full bg-white/85 placeholder:text-slate-400 text-slate-800 pl-10 pr-4 py-2.5 rounded-2xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort:</span>
              <div className="inline-flex rounded-full bg-white/85 border border-blue-200 p-1 shadow-sm">
                {["upcoming", "popular"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option as "upcoming" | "popular")}
                    className={`px-4 py-1 text-sm rounded-full transition ${
                      sortBy === option ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"
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
        <motion.div variants={gridWrap} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="col-span-full rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl p-6 text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                Loading events...
              </motion.div>
            ) : filtered.length === 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="col-span-full rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl p-6 text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
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
                    className="bg-white/75 backdrop-blur-xl border border-blue-200 rounded-3xl p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)] hover:border-blue-300 relative overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -top-16 -left-16 w-[240px] h-[240px] rounded-full bg-blue-300/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -right-16 w-[280px] h-[280px] rounded-full bg-sky-300/10 blur-3xl" />

                    <div className="relative">
                      <h3 className="text-xl font-semibold mb-1 text-slate-900">
                        {ev.title ?? "Untitled Event"}
                      </h3>

                      <p className="text-slate-700 text-sm font-medium">{ev.venue ?? ""}</p>

                      {ev.address ? <p className="text-slate-600 text-sm">{ev.address}</p> : null}

                      {(dateLabel || timeLabel) && (
                        <p className="text-slate-700 text-sm mt-1">
                          {dateLabel}
                          {timeLabel ? ` • ${timeLabel}` : ""}
                        </p>
                      )}

                      {ev.description ? <p className="text-slate-700 text-sm mt-3">{ev.description}</p> : null}

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
                          className="col-span-2 w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99] shadow-sm"
                        >
                          Register
                        </Link>
                      </div>

                      {(ev.venue || ev.address) && (
                        <a
                          href={mapsHref(ev)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
                        >
                          View on Maps <span aria-hidden>↗</span>
                        </a>
                      )}
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
