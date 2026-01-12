"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QuickActions } from "./QuickActions";
import {
  motion,
  AnimatePresence,
  MotionValue,
  Variants,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/* ---------------- Variants ---------------- */
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

/**
 * Smooth scrolling fallback (NO external libraries needed).
 */
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

/* ---------------- Orbs ---------------- */
const ORBS = [
  { size: 220, color: "rgba(59,130,246,0.18)", top: 12, left: 8, speed: 0.22 },
  { size: 320, color: "rgba(147,197,253,0.16)", top: 45, left: 75, speed: 0.35 },
  { size: 180, color: "rgba(15,23,42,0.12)", top: 70, left: 18, speed: 0.15 },
  { size: 260, color: "rgba(147,197,253,0.10)", top: 18, left: 82, speed: 0.3 },
  { size: 200, color: "rgba(59,130,246,0.14)", top: 62, left: 52, speed: 0.25 },
];

/* ---------------- MAIN PAGE ---------------- */
export default function Home() {
  const reduce = useReducedMotion();

  // Smooth scroll fallback (no Lenis)
  useSmoothScrollFallback(!reduce);

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
  const heroBlur = useTransform(scrollProgSmooth, [0, 0.28], ["blur(0px)", "blur(1.5px)"]);

  /* ---- Intro overlay ---- */
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), reduce ? 350 : 1200);
    return () => window.clearTimeout(t);
  }, [reduce]);

  /* ---- Calendar ---- */
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const now = new Date();
  const texasToday = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
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

  const events = useMemo(
    () => [
      {
        title: "Neighborhood Meetup",
        dateString: "2025-12-21T14:00:00",
        location: "Community Park",
        details: "Meet local residents and join community discussions.",
      },
      {
        title: "Community Dinner",
        dateString: "2025-12-21T18:00:00",
        location: "Downtown Church",
        details: "Enjoy a free meal and fellowship with neighbors.",
      },
      {
        title: "Clothing Drive",
        dateString: "2025-12-22T10:00:00",
        location: "Westside Center",
        details: "Donate clothes for those in need and volunteer.",
      },
    ],
    [],
  );

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

  const selectedEvents = useMemo(() => {
    if (!selectedDate) return [];
    return events.filter((event) => {
      const e = new Date(event.dateString);
      return (
        e.getFullYear() === selectedDate.getFullYear() &&
        e.getMonth() === selectedDate.getMonth() &&
        e.getDate() === selectedDate.getDate()
      );
    });
  }, [events, selectedDate]);

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
        style={{ x: grainX, y: grainY, opacity: reduce ? 0.06 : 0.09 }}
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
            x: reduce ? 0 : orbX[i],
            y: reduce ? 0 : orbY[i],
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
      <motion.div style={{ backgroundColor: softGrey }} className="fixed inset-0 pointer-events-none -z-20" />
      <motion.div style={{ backgroundColor: navyWash }} className="fixed inset-0 pointer-events-none -z-20" />

      {/* Intro */}
      <AnimatePresence>
        {intro && !reduce && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            style={{
              background:
                "radial-gradient(900px circle at 50% 40%, rgba(147,197,253,0.35), rgba(255,255,255,1) 55%, rgba(238,244,250,1) 100%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="px-8 py-7 rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl shadow-xl"
            >
              <motion.div
                initial={{ letterSpacing: "0.2em", opacity: 0.7 }}
                animate={{ letterSpacing: "0.08em", opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-xs font-semibold text-blue-700 text-center"
              >
                COMMUNITY • RESOURCES • EVENTS
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="mt-2 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-center"
              >
                GATHERLY
              </motion.div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <motion.span
                  className="h-2 w-2 rounded-full bg-blue-700"
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.span
                  className="h-2 w-2 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.15 }}
                />
                <motion.span
                  className="h-2 w-2 rounded-full bg-blue-300"
                  animate={{ scale: [1, 1.8, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
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
          rotate: reduce ? 0 : tilt,
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

          <motion.p style={{ y: heroTextY }} className="mt-5 max-w-2xl text-base sm:text-lg text-blue-800 text-center mx-auto">
            Explore Cross Creek and all it has to offer! Sign up for local community events and explore new parts of our community.
          </motion.p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <MagneticButton href="/resources" label="Explore Resources" primary />
            <MagneticButton href="/events" label="Browse Events" />
          </div>
        </motion.div>

        <motion.div
          className="mt-10 flex items-center justify-center text-blue-700/80 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7 }}
        >
          <motion.span
            className="inline-flex items-center gap-2"
            animate={reduce ? undefined : { y: [0, 6, 0] }}
            transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="font-semibold">Scroll</span>
            <span className="opacity-80">to explore</span>
            <span aria-hidden>↓</span>
          </motion.span>
        </motion.div>
      </motion.header>

      {/* MAIN */}
      <motion.main className="max-w-7xl mx-auto px-6 pb-28 flex flex-col lg:flex-row gap-10 lg:gap-14 mt-16">
        <motion.section
          initial={{ opacity: 0, x: -30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-1/3 flex flex-col justify-end"
        >
          <QuickActions />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-2/3 flex flex-col justify-end"
        >
          <motion.div
            ref={calendarRef}
            variants={cardPop}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl border border-blue-200 shadow-[0_18px_60px_rgba(15,23,42,0.10)] p-6"
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
                  Cross Creek Calender
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900">
                  {monthNames[calMonth]} {calYear}
                </h3>
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

            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} />;
                const isToday = date.getTime() === texasToday.getTime();
                const isSelected = date.getTime() === selectedDate?.getTime();

                const hasEvent = events.some((event) => {
                  const eDate = new Date(event.dateString);
                  return (
                    eDate.getFullYear() === date.getFullYear() &&
                    eDate.getMonth() === date.getMonth() &&
                    eDate.getDate() === date.getDate()
                  );
                });

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: (idx % 7) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={[
                      "relative flex flex-col items-center justify-start h-12 w-full rounded-xl text-sm sm:text-base font-semibold cursor-pointer transition-colors",
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
                        layoutId={`dot-${idx}`}
                        className="block mt-1 w-2 h-2 bg-blue-500 rounded-full"
                        animate={reduce ? undefined : { scale: [1, 1.35, 1] }}
                        transition={reduce ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
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
                  className="mt-4 bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl shadow p-4 overflow-y-auto max-h-96"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-blue-900">
                      Events on {selectedDate.toLocaleDateString()}
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
                          key={i}
                          whileHover={reduce ? undefined : { scale: 1.02, x: 2 }}
                          transition={{ type: "spring", stiffness: 260, damping: 18 }}
                          className="border-l-4 border-blue-500 pl-3 cursor-pointer"
                        >
                          <p className="font-semibold text-blue-800">{event.title}</p>
                          <p className="text-xs text-blue-700">{event.location}</p>
                          <p className="text-xs text-blue-700">{event.details}</p>
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
      {[...Array(8)].map((_, i) => (
        <React.Fragment key={i}>
          <motion.section initial="hidden" variants={container} className="max-w-7xl mx-auto px-6 my-20">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="flex justify-center"
            >
              <FlipFeatureRow index={i} />
            </motion.div>
          </motion.section>

          <div className="-mt-14">
            <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-20">
              <path d="M0,0 C480,120 960,0 1440,120 L1440,0 L0,0 Z" fill="rgba(229,233,239,0.28)" />
            </svg>
          </div>
        </React.Fragment>
      ))}

      {/* Our story */}
      <motion.section
        className="w-full mt-32 mb-40 px-6"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-blue-900 text-center mb-10"
          animate={reduce ? undefined : { y: [0, -3, 0] }}
          transition={reduce ? undefined : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          Our Story!
        </motion.h2>

        <motion.div
          className="w-full max-w-4xl mx-auto p-10 rounded-3xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] text-blue-900 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border border-blue-200 relative overflow-hidden"
          whileHover={reduce ? undefined : { y: -4 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <div className="absolute -top-20 -left-16 w-[380px] h-[380px] rounded-full bg-blue-300/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl" />

          <p className="mb-6 relative">
            <span className="font-bold text-blue-700">2023 – Starting Out:</span>{" "}
            Cross Creek is founded in the beautiful town of Fulshear in 2006 but our first residents did not arrive until 2008.
          </p>
          <p className="mb-6 relative">
            <span className="font-bold text-blue-700">2024 – A little to know about us:</span>{" "}
            Our community is massive and sits on 3,200 acres and is home to around 20,000 residents! We pride ourselves in always giving our residents the best.
          </p>
          <p className="mb-6 relative">
            <span className="font-bold text-blue-700">2025 – Present Day:</span>{" "}
            Now in 2026, our staff is proud to announce our new website, Gatherly, with its main focus being to help you! We have specially made it to guide you around the area and to help participate in our community.
          </p>

        <footer className="mt-14 text-center text-sm text-blue-800/70">
          © {year} Gatherly • Built for community
        </footer>
      </motion.section>
    </motion.div>
  );
}

/* ---------------- Subcomponents ---------------- */

/**
 * Smoother (less “shaky”) magnetic button:
 * - only reacts while hovered
 * - smaller clamp + smaller multipliers
 * - uses springs to smooth motion
 */
function MagneticButton({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 220, damping: 28, mass: 0.7 });
  const y = useSpring(rawY, { stiffness: 220, damping: 28, mass: 0.7 });

  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      if (!hovered) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);

      rawX.set(clamp(dx * 0.06, -8, 8));
      rawY.set(clamp(dy * 0.08, -6, 6));
    };

    const onLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, hovered, rawX, rawY]);

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={reduce ? undefined : { scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold border transition-colors shadow-sm",
        primary
          ? "bg-blue-700 text-white border-blue-700 hover:bg-blue-800"
          : "bg-white/70 text-blue-900 border-blue-200 hover:bg-white",
      ].join(" ")}
    >
      <span>{label}</span>
      <motion.span
        aria-hidden
        animate={reduce ? undefined : { x: [0, 3, 0] }}
        transition={reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        →
      </motion.span>
    </motion.a>
  );
}

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

/* ---------------- Box Row (LEFT flip card + RIGHT image) ---------------- */

const FEATURES = [
  {
    title: "Community Events",
    shortDesc: "Discover upcoming events happening near you.",
    longDesc:
      "Find festivals, meetups, workshops, and local gatherings. RSVP, share events, and stay connected with your community.",
    imageLabel: "Events Preview",
  },
  {
    title: "Local Resources",
    shortDesc: "Access tools and services offered in your area.",
    longDesc:
      "Explore food banks, health services, shelters, and local programs curated specifically for your neighborhood.",
    imageLabel: "Resources Preview",
  },
  {
    title: "Volunteer Programs",
    shortDesc: "Give back and make a difference locally.",
    longDesc:
      "Browse volunteer opportunities, sign up for causes you care about, and track your community impact.",
    imageLabel: "Volunteer Preview",
  },
];

function FeatureSectionInline() {
  return (
    <div className="space-y-24">
      {FEATURES.map((feature) => (
        <FlipFeatureRow
          key={feature.title}
          title={feature.title}
          shortDesc={feature.shortDesc}
          longDesc={feature.longDesc}
          imageLabel={feature.imageLabel}
        />
      ))}
    </div>
  );
}

function FlipFeatureRow({
  title,
  shortDesc,
  longDesc,
  imageLabel,
}: {
  title: string;
  shortDesc: string;
  longDesc: string;
  imageLabel: string;
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
        className="grid grid-cols-1 lg:grid-cols-[minmax(320px,520px)_1fr] gap-6 lg:gap-8 items-stretch"
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
          <div className="h-[280px] lg:h-full min-h-[280px] bg-[#8e8e8e] flex items-center justify-center">
            <span className="text-xl md:text-2xl font-semibold text-black/70">
              {imageLabel}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FlipInfoCard({
  title,
  shortDesc,
  longDesc,
  flipped,
  setFlipped,
}: {
  title: string;
  shortDesc: string;
  longDesc: string;
  flipped: boolean;
  setFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.75;

  return (
    <button
      type="button"
      onClick={() => setFlipped((v) => !v)}
      className="text-left w-full"
      aria-pressed={flipped}
    >
      <motion.div
        whileHover={reduce ? undefined : { y: -3 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
        className="relative w-full"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div
            className="rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="h-44 bg-gradient-to-br from-blue-200 to-blue-100 relative">
              <div className="absolute inset-0 opacity-60 blur-2xl bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.35),rgba(255,255,255,0)_60%)]" />
              <div className="relative p-6">
                <div className="text-3xl font-medium text-black/80">
                  {title}
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-blue-900">
                {title}
              </h3>
              <p className="mt-2 text-sm text-blue-700">
                {shortDesc}
              </p>

              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                Learn more <span aria-hidden>→</span>
              </div>

              <div className="mt-2 text-xs text-blue-700/70">
                (Click anywhere on this card to flip)
              </div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-3xl border border-blue-200 bg-white/80 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] p-6"
            style={{
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <h3 className="text-lg font-semibold text-blue-900">
              {title}
            </h3>
            <p className="mt-3 text-sm text-blue-700">
              {longDesc}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </button>
  );
}
    
