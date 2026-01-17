// app/page.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  motion,
  AnimatePresence,
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

import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query as fsQuery,
  type Timestamp,
} from "firebase/firestore";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.985, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const shimmerIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

/* ---------------- Helpers ---------------- */
function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

/** Smooth scrolling fallback (NO external libraries needed). */
function useSmoothScrollFallback(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev || "";
    };
  }, [enabled]);
}

/** Safe Timestamp/FieldValue-ish to ms */
function tsToMs(v: any): number {
  if (!v) return 0;
  if (typeof v?.toMillis === "function") return v.toMillis();
  if (typeof v?.seconds === "number") return v.seconds * 1000;
  return 0;
}

/** "YYYY-MM-DD" for America/Chicago (stable grouping) */
function dayKeyFromMs(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString("en-CA", {
      timeZone: "America/Chicago",
    });
  } catch {
    const d = new Date(ms);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const da = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
  }
}

function formatTime(ms: number): string {
  if (!ms) return "";
  try {
    return new Date(ms).toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return new Date(ms).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
}

function safeStr(v: unknown, fb = "") {
  return typeof v === "string" ? v : fb;
}

/** Parse "8:06 AM – 8:07 PM" or "8:06 AM-8:07 PM" */
function splitTimeRange(s: string): { start?: string; end?: string } {
  const raw = (s || "").replace(/\s+/g, " ").trim();
  const parts = raw.split("–").map((x) => x.trim());
  if (parts.length === 2) return { start: parts[0], end: parts[1] };
  const parts2 = raw.split("-").map((x) => x.trim());
  if (parts2.length === 2) return { start: parts2[0], end: parts2[1] };
  return {};
}

/** Parse "8:06 AM" into {h24, m} */
function parse12hTime(t: string): { h: number; m: number } | null {
  const s = (t || "").trim();
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  let hh = parseInt(m[1], 10);
  const mm = m[2] ? parseInt(m[2], 10) : 0;
  const ap = m[3].toUpperCase();
  if (ap === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }
  return { h: hh, m: mm };
}

/**
 * Build ms from date string "YYYY-MM-DD" and a time like "8:06 AM"
 * Uses local Date construction; grouping uses America/Chicago for consistent dots.
 */
function msFromDateAndTime(dateStr: string, timeStr?: string): number {
  if (!dateStr) return 0;
  const base = dateStr.trim();
  const parsed = timeStr ? parse12hTime(timeStr.trim()) : null;

  const hh = parsed?.h ?? 0;
  const mm = parsed?.m ?? 0;

  const d = new Date(`${base}T00:00:00`);
  if (Number.isNaN(d.getTime())) return 0;
  d.setHours(hh, mm, 0, 0);
  return d.getTime();
}

/* ---------------- Orbs ---------------- */
const ORBS = [
  { size: 220, color: "rgba(59,130,246,0.18)", top: 12, left: 8, speed: 0.22 },
  { size: 320, color: "rgba(147,197,253,0.16)", top: 45, left: 75, speed: 0.35 },
  { size: 180, color: "rgba(15,23,42,0.12)", top: 70, left: 18, speed: 0.15 },
  { size: 260, color: "rgba(147,197,253,0.10)", top: 18, left: 82, speed: 0.3 },
  { size: 200, color: "rgba(59,130,246,0.14)", top: 62, left: 52, speed: 0.25 },
];

/* ---------------- Feature Data ---------------- */
const FEATURES = [
  {
    title: "Resources",
    shortDesc: "Find trusted local services and support in seconds.",
    longDesc:
      "Browse a curated directory of community resources — food support, fitness, libraries, and more. Search quickly and find what matters without the noise.",
    imageLabel: "Resource Directory Preview",
  },
  {
    title: "Events",
    shortDesc: "See what’s happening in Cross Creek this week.",
    longDesc:
      "Discover meetups, drives, and neighborhood gatherings. Save dates, share with friends, and stay connected to what’s going on near you.",
    imageLabel: "Events & Calendar Preview",
  }, 
];

/* ---------------- Firestore Event Types ---------------- */
type EventDoc = {
  title?: string;
  name?: string;

  date?: string; // "YYYY-MM-DD"
  startTime?: string; // "8:06 AM"
  endTime?: string; // "8:07 PM"
  time?: string; // "8:06 AM – 8:07 PM"

  startAt?: Timestamp | any;
  endAt?: Timestamp | any;
  start?: Timestamp | any;
  end?: Timestamp | any;
  createdAt?: Timestamp | any;

  location?: string;
  address?: string;
  description?: string;

  category?: string;
  activities?: string[];
  community?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  location: string;
  description: string;

  startMs: number;
  endMs: number;

  dayKey: string;
  startLabel: string;
  endLabel: string;
};

/* ---------------- MAIN PAGE ---------------- */
export default function Home() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const reduceBool = !!reduce; // ✅ force boolean

  // Smooth scroll fallback (no Lenis)
  useSmoothScrollFallback(!reduceBool);

  const year = new Date().getFullYear();

  /* ---- Scroll ---- */
  const { scrollY, scrollYProgress } = useScroll();
  const scrollProgSmooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  // velocity reactive micro-tilt (subtle)
  const vel = useVelocity(scrollY);
  const velSmooth = useSpring(vel, { stiffness: 80, damping: 30 });
  const tilt = useTransform(velSmooth, [-1800, 0, 1800], [-1.2, 0, 1.2]);

  /* ---- Cursor ---- */
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  /* ---- Background palette transitions ---- */
  const bg = useTransform(
    scrollProgSmooth,
    [0, 0.35, 0.7, 1],
    ["#ffffff", "#F3F7FF", "#EEF4FA", "#E5E9EF"],
  );
  const softGrey = useTransform(
    scrollProgSmooth,
    [0.25, 0.55],
    ["rgba(226,232,240,0)", "rgba(203,213,225,0.60)"],
  );
  const navyWash = useTransform(
    scrollProgSmooth,
    [0.62, 1],
    ["rgba(15,23,42,0)", "rgba(15,23,42,0.14)"],
  );

  /* ---- Cursor spotlight ---- */
  const glowX = useTransform(mx, (v) => `${v}px`);
  const glowY = useTransform(my, (v) => `${v}px`);

  /* ---- Orbs ---- */
  const orbX: MotionValue<number>[] = ORBS.map(() => useMotionValue(0));
  const orbY: MotionValue<number>[] = ORBS.map(() => useMotionValue(0));

  useMotionValueEvent(scrollY, "change", (y) => {
    const h = window.innerHeight || 1;
    const w = window.innerWidth || 1;
    const scrollRange = document.body.scrollHeight - h || 1;

    ORBS.forEach((orb, i) => {
      const mouseFx = (mouse.x / w - 0.5) * 220 * orb.speed;
      const mouseFy = (mouse.y / h - 0.5) * 220 * orb.speed;
      const scrollFy = -260 * orb.speed * (y / scrollRange);

      orbX[i].set(mouseFx);
      orbY[i].set(scrollFy + mouseFy);
    });
  });

  /* ---- Hero parallax ---- */
  const heroY = useTransform(scrollProgSmooth, [0, 0.4], [0, -120]);
  const heroScale = useTransform(scrollProgSmooth, [0, 0.4], [1, 1.04]);
  const heroTextY = useTransform(scrollProgSmooth, [0, 0.35], [0, -64]);
  const heroBlur = useTransform(scrollProgSmooth, [0, 0.28], [
    "blur(0px)",
    "blur(1.5px)",
  ]);

  /* ---- Intro overlay (0.5s) ---- */
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), 500);
    return () => window.clearTimeout(t);
  }, []);

  /* ---- Calendar ---- */
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const now = new Date();
  const texasToday = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" }),
  );
  texasToday.setHours(0, 0, 0, 0);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = useMemo(
    () => [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    [],
  );

  /* ============================================================
      FIRESTORE EVENTS
     ============================================================ */
  const [dbEvents, setDbEvents] = useState<CalendarEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    setEventsLoading(true);

    const ref = collection(db, "events");
    const qy = fsQuery(ref, orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      qy,
      (snap) => {
        const next: CalendarEvent[] = snap.docs
          .map((d) => {
            const data = d.data() as EventDoc;

            const title = safeStr(data.title || data.name, "Untitled event");
            const location = safeStr(data.location || data.address, "");
            const description = safeStr(data.description, "");

            const startMs =
              tsToMs((data as any).startAt) ||
              tsToMs((data as any).start) ||
              (() => {
                const dateStr = safeStr((data as any).date, "");
                const range = splitTimeRange(safeStr((data as any).time, ""));
                const startT =
                  safeStr((data as any).startTime, "") || range.start || "";
                return msFromDateAndTime(dateStr, startT);
              })();

            const endMs =
              tsToMs((data as any).endAt) ||
              tsToMs((data as any).end) ||
              (() => {
                const dateStr = safeStr((data as any).date, "");
                const range = splitTimeRange(safeStr((data as any).time, ""));
                const endT =
                  safeStr((data as any).endTime, "") || range.end || "";
                const ms = endT ? msFromDateAndTime(dateStr, endT) : 0;
                return ms || startMs;
              })();

            const sLabel = formatTime(startMs);
            const eLabel =
              endMs && endMs !== startMs ? formatTime(endMs) : "";

            if (!startMs) return null;

            return {
              id: d.id,
              title,
              location,
              description,
              startMs,
              endMs: endMs || startMs,
              dayKey: dayKeyFromMs(startMs),
              startLabel: sLabel,
              endLabel: eLabel,
            };
          })
          .filter(Boolean) as CalendarEvent[];

        next.sort((a, b) => a.startMs - b.startMs);

        setDbEvents(next);
        setEventsLoading(false);
      },
      (err) => {
        console.error("Failed to read events:", err);
        setDbEvents([]);
        setEventsLoading(false);
      },
    );

    return () => unsub();
  }, []);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of dbEvents) {
      const list = map.get(e.dayKey) || [];
      list.push(e);
      map.set(e.dayKey, list);
    }
    for (const [k, list] of map.entries()) {
      list.sort((a, b) => a.startMs - b.startMs);
      map.set(k, list);
    }
    return map;
  }, [dbEvents]);

  const totalEventsThisMonth = useMemo(() => {
    const monthStart = new Date(calYear, calMonth, 1);
    const monthEnd = new Date(calYear, calMonth + 1, 1);
    const startMs = monthStart.getTime();
    const endMs = monthEnd.getTime();
    return dbEvents.filter((e) => e.startMs >= startMs && e.startMs < endMs)
      .length;
  }, [dbEvents, calYear, calMonth]);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    return days;
  }, [calYear, calMonth]);

  const selectedDayKey = useMemo(() => {
    if (!selectedDate) return null;
    return dayKeyFromMs(selectedDate.getTime());
  }, [selectedDate]);

  const selectedEvents = useMemo(() => {
    if (!selectedDayKey) return [];
    return eventsByDay.get(selectedDayKey) || [];
  }, [eventsByDay, selectedDayKey]);

  /* ---- Scroll progress bar ---- */
  const progScaleX = useTransform(scrollProgSmooth, [0, 1], [0.06, 1]);

  /* ---- Grain drift ---- */
  const grainX = useTransform(scrollY, [0, 1200], [0, -120]);
  const grainY = useTransform(scrollY, [0, 1200], [0, -90]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      style={{ background: bg }}
      className="min-h-screen overflow-x-hidden text-slate-950 relative"
    >
      {/* Progress bar */}
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
        style={{ x: grainX, y: grainY, opacity: reduceBool ? 0.06 : 0.09 }}
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

      {/* Floating orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            x: reduceBool ? 0 : orbX[i],
            y: reduceBool ? 0 : orbY[i],
            width: orb.size,
            height: orb.size,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            backgroundColor: orb.color,
          }}
          className="absolute rounded-full pointer-events-none -z-20 blur-2xl"
        />
      ))}

      {/* Overlays */}
      <motion.div
        style={{ backgroundColor: softGrey }}
        className="fixed inset-0 pointer-events-none -z-20"
      />
      <motion.div
        style={{ backgroundColor: navyWash }}
        className="fixed inset-0 pointer-events-none -z-20"
      />

      {/* Intro */}
      <AnimatePresence>
        {intro && !reduceBool && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            style={{
              background:
                "radial-gradient(900px circle at 50% 40%, rgba(147,197,253,0.35), rgba(255,255,255,1) 55%, rgba(238,244,250,1) 100%)",
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
                y: 16,
                filter: "blur(10px)",
              }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 py-7 rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl shadow-xl"
            >
              <div className="text-xs font-semibold text-blue-700 text-center tracking-[0.2em]">
                COMMUNITY • RESOURCES • EVENTS
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-center">
                GATHERLY
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <motion.span
                  className="h-2 w-2 rounded-full bg-blue-700"
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="h-2 w-2 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.15,
                  }}
                />
                <motion.span
                  className="h-2 w-2 rounded-full bg-blue-300"
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <motion.header
        style={{
          y: heroY,
          scale: heroScale,
          rotate: reduceBool ? 0 : tilt,
          filter: heroBlur,
        }}
        className="min-h-[96vh] relative flex flex-col justify-center max-w-7xl mx-auto px-6"
      >
        <div className="absolute -top-20 left-0 w-full h-[72vh] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-b-[80px] shadow-lg -z-10" />

        <motion.div
          variants={shimmerIn}
          className="mx-auto w-full max-w-3xl rounded-[28px] border border-blue-200 bg-white/55 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] px-6 sm:px-10 py-8"
        >
          <div className="text-xs sm:text-sm font-semibold text-blue-700 text-center tracking-[0.25em]">
            DISCOVER • CONNECT • ENGAGE
          </div>

          <motion.h1
            style={{ y: heroTextY }}
            className="mt-3 text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-center"
          >
            GATHERLY
          </motion.h1>

          <motion.p
            style={{ y: heroTextY }}
            className="mt-5 max-w-2xl text-base sm:text-lg text-blue-800 text-center mx-auto"
          >
            Explore Cross Creek and all it has to offer! Sign up for local community
            events and explore new parts of our community.
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-10 flex items-center justify-center text-blue-700/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-2"
            animate={reduceBool ? undefined : { y: [0, 6, 0] }}
            transition={
              reduceBool ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <span className="font-semibold">Scroll</span>
            <span className="opacity-80">to explore</span>
            <span aria-hidden>↓</span>
          </motion.span>
        </motion.div>
      </motion.header>

      {/* Banner */}
      <CrossCreekBanner
        reduce={reduceBool}
        scrollProgSmooth={scrollProgSmooth}
        onExplore={() => router.push("/map")}
        onEvents={() => router.push("/events")}
      />

      {/* ✅ Calendar section now full width (QuickActions removed) */}
      <motion.main className="max-w-7xl mx-auto px-6 pb-28 mt-16">
        <motion.section
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            ref={calendarRef}
            variants={cardPop}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-blue-200 shadow-[0_18px_60px_rgba(15,23,42,0.10)] p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                className="text-blue-700 text-2xl font-bold px-2"
              >
                ❮
              </motion.button>

              <div className="text-center">
                <div className="text-[11px] text-blue-700 font-semibold tracking-[0.18em]">
                  Cross Creek Calendar
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900">
                  {monthNames[calMonth]} {calYear}
                </h3>

                <div className="mt-1 text-xs text-blue-700/80">
                  {eventsLoading
                    ? "Loading events…"
                    : `${totalEventsThisMonth} event${totalEventsThisMonth === 1 ? "" : "s"}`}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                className="text-blue-700 text-2xl font-bold px-2"
              >
                ❯
              </motion.button>
            </div>

            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-2">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} />;
                const isToday = date.getTime() === texasToday.getTime();
                const isSelected = date.getTime() === selectedDate?.getTime();

                const key = dayKeyFromMs(date.getTime());
                const hasEvent = (eventsByDay.get(key)?.length || 0) > 0;

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.45,
                      delay: (idx % 7) * 0.04,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={reduceBool ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      "relative flex flex-col items-center justify-start h-14 sm:h-16 w-full rounded-2xl text-sm sm:text-base font-semibold cursor-pointer transition-colors",
                      isSelected
                        ? "bg-blue-400 text-white"
                        : isToday
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-900",
                      "outline-none",
                    ].join(" ")}
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev && prev.getTime() === date.getTime() ? null : date,
                      )
                    }
                  >
                    <span className="block">{date.getDate()}</span>

                    {hasEvent && (
                      <motion.span
                        layoutId={`dot-${key}`}
                        className="block mt-1 w-2.5 h-2.5 bg-blue-500 rounded-full"
                        animate={reduceBool ? undefined : { scale: [1, 1.35, 1] }}
                        transition={
                          reduceBool
                            ? undefined
                            : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        }
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-5 bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl shadow p-4 overflow-y-auto max-h-96"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-blue-900">
                      Events on{" "}
                      {selectedDate.toLocaleDateString("en-US", {
                        timeZone: "America/Chicago",
                      })}
                    </h3>
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.98 }}
                      className="text-blue-700 font-bold"
                      onClick={() => setSelectedDate(null)}
                    >
                      ✕
                    </motion.button>
                  </div>

                  {selectedEvents.length > 0 ? (
                    <ul className="mt-3 space-y-3">
                      {selectedEvents.map((event, i) => (
                        <motion.li
                          key={`${event.id}-${i}`}
                          whileHover={reduceBool ? undefined : { scale: 1.02, x: 2 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          className="border-l-4 border-blue-500 pl-3 cursor-pointer"
                          onClick={() => router.push(`/events?focus=${event.id}`)}
                        >
                          <p className="font-semibold text-blue-800">
                            {event.startLabel}
                            {event.endLabel ? ` – ${event.endLabel}` : ""} • {event.title}
                          </p>
                          {event.location ? (
                            <p className="text-xs text-blue-700">{event.location}</p>
                          ) : null}
                          {event.description ? (
                            <p className="text-xs text-blue-700">{event.description}</p>
                          ) : null}
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-blue-700 text-sm">No events for this day</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* Feature strip */}
      <motion.section className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[34px] border border-blue-200 bg-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FeatureStat title="Curated resources" value="Local-first" desc="Support services, food, fitness, and more." />
            <FeatureStat title="Community events" value="Real-time" desc="Find what’s happening near you." />
            <FeatureStat title="Trust & clarity" value="No noise" desc="Just what helps your neighborhood thrive." />
          </div>
        </motion.div>
      </motion.section>

      {/* Content sections + curved dividers */}
      {FEATURES.map((f, i) => (
        <React.Fragment key={`${f.title}-${i}`}>
          <motion.section initial="hidden" variants={container} className="max-w-7xl mx-auto px-6 my-20">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="flex justify-center"
            >
              <FlipFeatureRow
                title={f.title}
                shortDesc={f.shortDesc}
                longDesc={f.longDesc}
                imageLabel={f.imageLabel}
              />
            </motion.div>
          </motion.section>

          <div className="-mt-14">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-20">
              <path
                d="M0,0 C480,120 960,0 1440,120 L1440,0 L0,0 Z"
                fill="rgba(229,233,239,0.28)"
              />
            </svg>
          </div>
        </React.Fragment>
      ))}
      
      
    </motion.div>
  );
}

/* ---------------- Banner ---------------- */

function CrossCreekBanner({
  reduce,
  scrollProgSmooth,
  onExplore,
  onEvents,
}: {
  reduce: boolean;
  scrollProgSmooth: MotionValue<number>;
  onExplore: () => void;
  onEvents: () => void;
}) {
  const lift = useTransform(scrollProgSmooth, [0, 0.35, 0.7], [0, -10, -16]);
  const glow = useTransform(scrollProgSmooth, [0.18, 0.42, 0.7], [0.18, 0.26, 0.18]);
  const shimmerX = useTransform(scrollProgSmooth, [0, 1], ["-35%", "135%"]);
  const badgeFloat = reduce ? 0 : 1;

  return (
    <section className="relative">
      <motion.div style={reduce ? undefined : { y: lift }} className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-10 mb-14 rounded-[36px] border border-blue-200 bg-white/60 backdrop-blur-xl shadow-[0_30px_90px_rgba(15,23,42,0.12)] overflow-hidden"
        >
          <motion.div
            aria-hidden
            className="absolute -top-24 -left-28 w-[520px] h-[520px] rounded-full blur-3xl pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 35% 35%, rgba(59,130,246,0.26), rgba(59,130,246,0) 60%)",
              opacity: glow,
            }}
            animate={reduce ? undefined : { x: [0, 22, 0], y: [0, 14, 0] }}
            transition={reduce ? undefined : { duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute -bottom-28 -right-28 w-[560px] h-[560px] rounded-full blur-3xl opacity-60 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 45% 45%, rgba(147,197,253,0.28), rgba(147,197,253,0) 60%)",
            }}
            animate={reduce ? undefined : { x: [0, -20, 0], y: [0, -16, 0] }}
            transition={reduce ? undefined : { duration: 12.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {!reduce && (
            <motion.div
              aria-hidden
              className="absolute -top-24 left-0 h-[240px] w-[260px] rotate-12 opacity-40 pointer-events-none"
              style={{
                x: shimmerX,
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.75), rgba(255,255,255,0))",
              }}
            />
          )}

          <div className="absolute inset-x-0 -top-1 h-24 pointer-events-none">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,64 C240,120 480,16 720,64 C960,112 1200,24 1440,64 L1440,0 L0,0 Z"
                fill="rgba(147,197,253,0.35)"
              />
            </svg>
          </div>

          <div className="relative p-7 sm:p-10">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start lg:items-center justify-between">
              <div className="w-full">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="h-10 w-10 rounded-2xl border border-blue-200 bg-white/70 backdrop-blur flex items-center justify-center shadow-sm"
                    animate={reduce ? undefined : { y: [0, -4, 0], rotate: [-1, 1, -1] }}
                    transition={reduce ? undefined : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <span className="text-blue-800 font-extrabold">CC</span>
                  </motion.div>

                  <div className="text-[11px] font-semibold tracking-[0.28em] text-blue-700">
                    CROSS CREEK RANCH • FULSHEAR, TX
                  </div>
                </div>

                <motion.h3
                  className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600"
                  animate={reduce ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={reduce ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  style={reduce ? undefined : { backgroundSize: "200% 200%" }}
                >
                  Welcome to Cross Creek Ranch
                </motion.h3>

                <p className="mt-3 max-w-2xl text-blue-800/90">
                  A community built for neighbors — parks, trails, events, and local resources all in one calm, easy place.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <PulsePill reduce={reduce} text="Parks & Trails" />
                  <PulsePill reduce={reduce} text="Community Events" />
                  <PulsePill reduce={reduce} text="Local Resources" />
                  <PulsePill reduce={reduce} text="Family Friendly" />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <motion.button
                    type="button"
                    onClick={onExplore}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold border border-blue-700 bg-blue-700 text-white shadow-sm hover:bg-blue-800"
                  >
                    Explore Resources <span aria-hidden>→</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={onEvents}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold border border-blue-200 bg-white/70 text-blue-900 shadow-sm hover:bg-white"
                  >
                    Browse Events <span aria-hidden>→</span>
                  </motion.button>
                </div>
              </div>

              <div className="w-full lg:w-[420px]">
                <div className="grid grid-cols-1 gap-3">
                  <motion.div
                    className="rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl p-5 shadow-[0_18px_60px_rgba(15,23,42,0.10)]"
                    whileHover={reduce ? undefined : { y: -3 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                  >
                    <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
                      COMMUNITY FEEL
                    </div>
                    <div className="mt-2 text-xl font-extrabold text-blue-900">
                      Calm, clear, local
                    </div>
                    <div className="mt-2 text-sm text-blue-700">
                      Designed to help you find what you need without the noise.
                    </div>
                  </motion.div>

                  <motion.div
                    className="rounded-3xl border border-blue-200 bg-white/65 backdrop-blur-xl p-5 shadow-[0_18px_60px_rgba(15,23,42,0.10)]"
                    whileHover={reduce ? undefined : { y: -3 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
                          WHAT’S NEW
                        </div>
                        <div className="mt-2 text-sm text-blue-700">
                          Tap an event on the calendar to jump right in.
                        </div>
                      </div>

                      <motion.div
                        className="h-10 w-10 rounded-2xl border border-blue-200 bg-blue-50 flex items-center justify-center"
                        animate={reduce ? undefined : { scale: [1, 1.08, 1], rotate: [0, 3, 0] }}
                        transition={reduce ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <span className="text-blue-700 font-extrabold">★</span>
                      </motion.div>
                    </div>

                    <div className="mt-4 h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-700 to-sky-400"
                        initial={{ width: "40%" }}
                        animate={reduce ? undefined : { width: ["35%", "78%", "48%", "85%"] }}
                        transition={reduce ? undefined : { duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </motion.div>
                </div>

                {!reduce && (
                  <div className="relative mt-4 h-10">
                    <motion.div
                      className="absolute left-2 top-0 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-white/70 text-blue-800"
                      animate={{ y: [0, -6, 0], x: [0, 6, 0] }}
                      transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
                      style={{ opacity: 0.95 * badgeFloat }}
                    >
                      Trails
                    </motion.div>
                    <motion.div
                      className="absolute left-[40%] top-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-white/70 text-blue-800"
                      animate={{ y: [0, -5, 0], x: [0, -5, 0] }}
                      transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                      style={{ opacity: 0.95 * badgeFloat }}
                    >
                      Meetups
                    </motion.div>
                    <motion.div
                      className="absolute right-2 top-0 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-white/70 text-blue-800"
                      animate={{ y: [0, -6, 0], x: [0, 5, 0] }}
                      transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                      style={{ opacity: 0.95 * badgeFloat }}
                    >
                      Resources
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 -bottom-1 h-20 pointer-events-none opacity-90">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-full">
              <path
                d="M0,64 C260,24 520,110 720,64 C940,12 1180,112 1440,64 L1440,120 L0,120 Z"
                fill="rgba(229,233,239,0.55)"
              />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PulsePill({ text, reduce }: { text: string; reduce: boolean }) {
  return (
    <motion.span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-white/70 text-blue-800 shadow-sm"
      animate={reduce ? undefined : { y: [0, -2, 0] }}
      transition={reduce ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="h-2 w-2 rounded-full bg-blue-600" />
      {text}
    </motion.span>
  );
}

/* ---------------- Subcomponents ---------------- */

function FeatureStat({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduce ? undefined : { y: -3 }}
      className="rounded-3xl border border-blue-200 bg-white/60 backdrop-blur-xl p-6"
    >
      <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
        {title.toUpperCase()}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-blue-900">{value}</div>
      <div className="mt-2 text-sm text-blue-700">{desc}</div>
    </motion.div>
  );
}

function FlipFeatureRow({
  title,
  shortDesc,
  longDesc,
  imageLabel,
  imageSrc,
}: {
  title: string;
  shortDesc: string;
  longDesc: string;
  imageLabel: string;
  imageSrc: string;
}) {
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-[minmax(320px,520px)_1fr] gap-6 lg:gap-8"
      >
        <FlipInfoCard
          title={title}
          shortDesc={shortDesc}
          longDesc={longDesc}
          flipped={flipped}
          setFlipped={setFlipped}
        />

        <motion.div
          whileHover={reduce ? undefined : { y: -3 }}
          transition={{ type: "spring", stiffness: 220, damping: 20 }}
          className="rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] overflow-hidden"
        >
          <div className="relative h-[280px] w-full">
            <Image
              src={imageSrc}
              alt={imageLabel}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FlipFeatureRow({
  title,
  shortDesc,
  longDesc,
  imageLabel,
  imageSrc,
}: {
  title: string;
  shortDesc: string;
  longDesc: string;
  longDesc: string;
  imageLabel: string;
  imageSrc: string;
}) {
  const reduce = useReducedMotion();

  return (
    <button type="button" onClick={() => setFlipped((v) => !v)} className="text-left w-full" aria-pressed={flipped}>
      <motion.div className="relative w-full" style={{ perspective: 1200 }}>
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div className="rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl shadow-lg overflow-hidden" style={{ backfaceVisibility: "hidden" }}>
            <div className="h-44 bg-gradient-to-br from-blue-200 to-blue-100 p-6">
              <div className="text-3xl font-medium text-black/80">{title}</div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
              <p className="mt-2 text-sm text-blue-700">{shortDesc}</p>
              <div className="mt-4 text-sm font-semibold text-blue-600">Learn more →</div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-3xl border border-blue-200 bg-blue-50 p-6"
            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <h3 className="text-xl font-extrabold text-blue-900">{title}</h3>
            <p className="mt-3 text-sm text-blue-800">{longDesc}</p>
            <div className="mt-6 text-sm font-semibold text-blue-700">Click to flip back ↺</div>
          </div>
        </motion.div>
      </motion.div>
    </button>
  );
}
