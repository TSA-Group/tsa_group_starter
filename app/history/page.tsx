// app/history/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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

/* =======================
   Motion + Theme Helpers
======================= */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.42, 0, 0.58, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.985, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
};

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

/* =======================
   Content (edit anytime)
======================= */
const HISTORY = [
  {
    year: "2006",
    title: "A new community is planned",
    blurb:
      "Cross Creek Ranch is established in the Fulshear area, designed around parks, trails, and a neighborhood-first lifestyle.",
    tags: ["Planning", "Vision", "Fulshear"],
  },
  {
    year: "2008",
    title: "First residents arrive",
    blurb:
      "The earliest families move in and the community begins to take shape — new streets, neighbors, and shared spaces.",
    tags: ["First Homes", "Neighbors", "Growth"],
  },
  {
    year: "2012",
    title: "Amenities expand",
    blurb:
      "More shared spaces and community features grow, supporting an active, connected, family-friendly environment.",
    tags: ["Amenities", "Trails", "Community"],
  },
  {
    year: "2016",
    title: "A stronger sense of belonging",
    blurb:
      "Events and neighborhood traditions become more common — bringing residents together and strengthening community identity.",
    tags: ["Events", "Traditions", "Connection"],
  },
  {
    year: "2020",
    title: "Community adapts & supports",
    blurb:
      "Neighbors find new ways to stay connected and help one another, proving that community is more than just a place.",
    tags: ["Support", "Resilience", "Care"],
  },
  {
    year: "2024",
    title: "Cross Creek Ranch today",
    blurb:
      "A large, vibrant community built across thousands of acres — with growing resources, activities, and resident life.",
    tags: ["Today", "Active", "Vibrant"],
  },
  {
    year: "2026",
    title: "Gatherly launches",
    blurb:
      "A new hub for residents: discover events, find local resources, and explore everything Cross Creek Ranch has to offer.",
    tags: ["Gatherly", "Resources", "Events"],
    highlight: true,
  },
];

const STATS = [
  { label: "Community first", value: "Neighbor-led" },
  { label: "Local resources", value: "Curated" },
  { label: "Events", value: "Real-time" },
  { label: "Experience", value: "Calm + clear" },
];

const ORBS = [
  { size: 240, color: "rgba(59,130,246,0.18)", top: 12, left: 8, speed: 0.22 },
  { size: 340, color: "rgba(147,197,253,0.16)", top: 42, left: 78, speed: 0.35 },
  { size: 200, color: "rgba(15,23,42,0.12)", top: 70, left: 16, speed: 0.16 },
  { size: 260, color: "rgba(147,197,253,0.10)", top: 18, left: 85, speed: 0.28 },
  { size: 220, color: "rgba(59,130,246,0.14)", top: 60, left: 52, speed: 0.24 },
];

export default function HistoryPage() {
  const reduce = useReducedMotion();
  useSmoothScrollFallback(!reduce);

  const { scrollY, scrollYProgress } = useScroll();
  const prog = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const vel = useVelocity(scrollY);
  const velSmooth = useSpring(vel, { stiffness: 80, damping: 30 });
  const tilt = useTransform(velSmooth, [-1800, 0, 1800], [-1.2, 0, 1.2]);

  const bg = useTransform(
    prog,
    [0, 0.35, 0.7, 1],
    ["#ffffff", "#F3F7FF", "#EEF4FA", "#E5E9EF"],
  );
  const softGrey = useTransform(
    prog,
    [0.25, 0.55],
    ["rgba(226,232,240,0)", "rgba(203,213,225,0.60)"],
  );
  const navyWash = useTransform(
    prog,
    [0.62, 1],
    ["rgba(15,23,42,0)", "rgba(15,23,42,0.14)"],
  );

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

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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

  const progScaleX = useTransform(prog, [0, 1], [0.06, 1]);

  const grainX = useTransform(scrollY, [0, 1200], [0, -120]);
  const grainY = useTransform(scrollY, [0, 1200], [0, -90]);

  const [intro, setIntro] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setIntro(false), reduce ? 220 : 900);
    return () => window.clearTimeout(t);
  }, [reduce]);

  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      style={{ background: bg }}
      className="min-h-screen overflow-x-hidden text-slate-950 relative"
    >
      <motion.div
        style={{ scaleX: progScaleX }}
        className="fixed left-0 top-0 h-1 w-full origin-left bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 z-[60]"
      />

      <motion.div
        aria-hidden
        style={{
          background: useTransform([glowX, glowY], ([x, y]) => {
            return `radial-gradient(420px circle at ${x} ${y}, rgba(59,130,246,0.18), rgba(59,130,246,0.06) 35%, rgba(255,255,255,0) 70%)`;
          }),
        }}
        className="fixed inset-0 pointer-events-none -z-30"
      />

      <motion.div
        aria-hidden
        style={{ x: grainX, y: grainY, opacity: !!reduce ? 0.06 : 0.09 }}
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

      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          style={{
            x: !!reduce ? 0 : orbX[i],
            y: !!reduce ? 0 : orbY[i],
            width: orb.size,
            height: orb.size,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            backgroundColor: orb.color,
          }}
          className="absolute rounded-full pointer-events-none -z-20 blur-2xl"
        />
      ))}

      <motion.div style={{ backgroundColor: softGrey }} className="fixed inset-0 pointer-events-none -z-20" />
      <motion.div style={{ backgroundColor: navyWash }} className="fixed inset-0 pointer-events-none -z-20" />

      <AnimatePresence>
        {intro && !reduce && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.55 } }}
            style={{
              background:
                "radial-gradient(900px circle at 50% 40%, rgba(147,197,253,0.35), rgba(255,255,255,1) 55%, rgba(238,244,250,1) 100%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.985, y: 16, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, ease: EASE }}
              className="px-8 py-7 rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl shadow-xl"
            >
              <div className="text-xs font-semibold text-blue-700 text-center tracking-[0.22em]">
                CROSS CREEK RANCH • HISTORY
              </div>
              <div className="mt-2 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-center">
                Timeline
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header
        style={{ rotate: !!reduce ? 0 : tilt }}
        className="min-h-[78vh]
        relative flex flex-col justify-center max-w-7xl mx-auto px-6"
      >
        <div className="absolute -top-20 left-0 w-full h-[58vh] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-b-[80px] shadow-lg -z-10" />

        <motion.div
          variants={cardPop}
          className="mx-auto w-full max-w-4xl rounded-[28px] border border-blue-200 bg-white/55 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] px-6 sm:px-10 py-9"
        >
          <div className="text-xs sm:text-sm font-semibold text-blue-700 text-center tracking-[0.25em]">
            WHERE IT STARTED • HOW IT GREW • WHERE IT’S GOING
          </div>

          <motion.h1
            variants={fadeUp}
            className="mt-3 text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-center"
          >
            Cross Creek Ranch History
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-3xl text-base sm:text-lg text-blue-800 text-center mx-auto"
          >
            A calm, interactive timeline of key moments — in the same fluid Gatherly style.
          </motion.p>

          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <SoftLink href="/map" primary>
              Explore Resources →
            </SoftLink>
            <SoftLink href="/events">Browse Events →</SoftLink>
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
            animate={!!reduce ? undefined : { y: [0, 6, 0] }}
            transition={!!reduce ? undefined : { duration: 1.8, repeat: Infinity, ease: EASE_IN_OUT }}
          >
            <span className="font-semibold">Scroll</span>
            <span className="opacity-80">through the timeline</span>
            <span aria-hidden>↓</span>
          </motion.span>
        </motion.div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-6 pb-28 mt-10">
        <motion.section
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="rounded-[34px] border border-blue-200 bg-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] p-6 sm:p-10"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                whileHover={!!reduce ? undefined : { y: -3 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className="rounded-3xl border border-blue-200 bg-white/60 backdrop-blur-xl p-6"
              >
                <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
                  {s.label.toUpperCase()}
                </div>
                <div className="mt-2 text-2xl font-extrabold text-blue-900">{s.value}</div>
                <div className="mt-2 text-sm text-blue-700">Modern, friendly, easy to explore.</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.75, ease: EASE }}
              className="rounded-3xl border border-blue-200 bg-white/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] p-5"
            >
              <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
                QUICK JUMP
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {HISTORY.map((h, idx) => {
                  const active = activeIdx === idx;
                  return (
                    <motion.button
                      key={`${h.year}-${idx}`}
                      type="button"
                      onClick={() => setActiveIdx((p) => (p === idx ? null : idx))}
                      whileTap={{ scale: 0.985 }}
                      whileHover={!!reduce ? undefined : { y: -2 }}
                      className={[
                        "rounded-2xl px-3 py-2 text-sm font-semibold border transition",
                        active
                          ? "bg-blue-700 text-white border-blue-700"
                          : "bg-white/70 text-blue-900 border-blue-200 hover:bg-white",
                        h.highlight ? "ring-2 ring-blue-300/60" : "",
                      ].join(" ")}
                    >
                      {h.year}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </aside>

          <section className="relative">
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300/70 to-transparent" />
            <div className="space-y-5">
              {HISTORY.map((h, idx) => (
                <TimelineCard
                  key={`${h.year}-${idx}`}
                  idx={idx}
                  active={activeIdx === idx}
                  reduce={!!reduce}
                  year={h.year}
                  title={h.title}
                  blurb={h.blurb}
                  tags={h.tags}
                  highlight={!!h.highlight}
                />
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-14 text-center text-sm text-blue-800/70">
          © {new Date().getFullYear()} Gatherly • Cross Creek Ranch History
        </footer>
      </main>
    </motion.div>
  );
}

function SoftLink({
  href,
  children,
  primary,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-semibold border transition-colors shadow-sm",
        primary
          ? "bg-blue-700 text-white border-blue-700 hover:bg-blue-800"
          : "bg-white/70 text-blue-900 border-blue-200 hover:bg-white",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}

function TimelineCard({
  idx,
  active,
  reduce,
  year,
  title,
  blurb,
  tags,
  highlight,
}: {
  idx: number;
  active: boolean;
  reduce: boolean;
  year: string;
  title: string;
  blurb: string;
  tags: string[];
  highlight: boolean;
}) {
  const bounce = reduce ? undefined : { y: [0, -3, 0] };
  const bounceT = reduce
    ? undefined
    : { duration: 4.8, repeat: Infinity, ease: EASE_IN_OUT, delay: idx * 0.05 };

  return (
    <motion.article
      variants={cardPop}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-140px" }}
      className="relative pl-10 sm:pl-14"
    >
      <motion.div
        aria-hidden
        className={[
          "absolute left-[10px] sm:left-[16px] top-7 h-3 w-3 rounded-full border",
          active || highlight ? "bg-blue-700 border-blue-700" : "bg-white border-blue-300",
        ].join(" ")}
        animate={bounce}
        transition={bounceT}
      />

      <motion.div
        whileHover={reduce ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className={[
          "rounded-[30px] border backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] overflow-hidden",
          active ? "border-blue-300 bg-white/75" : "border-blue-200 bg-white/60",
          highlight ? "ring-2 ring-blue-300/50" : "",
        ].join(" ")}
      >
        <div className="p-6 sm:p-7 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-b border-blue-200 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
                {highlight ? "HIGHLIGHT" : "MILESTONE"}
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-blue-950">
                {title}
              </div>
            </div>

            <motion.div
              className="shrink-0 rounded-2xl border border-blue-200 bg-white/70 px-3 py-2 text-blue-900 font-extrabold"
              animate={reduce ? undefined : { scale: active ? [1, 1.05, 1] : [1, 1.02, 1] }}
              transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: EASE_IN_OUT }}
            >
              {year}
            </motion.div>
          </div>

          <p className="mt-3 text-blue-800/90">{blurb}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-white/70 text-blue-800 shadow-sm"
              >
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="text-sm text-blue-800/90">
            Add more milestones anytime by editing the <code className="px-1 rounded bg-blue-50 border border-blue-200">HISTORY</code> array at the top.
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold border border-blue-200 bg-white/70 text-blue-900 hover:bg-white transition"
            >
              See events →
            </Link>
            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold border border-blue-200 bg-white/70 text-blue-900 hover:bg-white transition"
            >
              Explore resources →
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

