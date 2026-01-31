"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "framer-motion";
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const page: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
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
      "The earliest families move in and the community begins to take shape new streets, neighbors, and shared spaces.",
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
      "Events and neighborhood traditions become more common bringing residents together and strengthening community identity.",
    tags: ["Events", "Traditions", "Connection"],
  },
  {
    year: "2020",
    title: "Community supports each other",
    blurb:
      "Neighbors find new ways to stay connected and help one another proving community is more than just a place.",
    tags: ["Support", "Resilience", "Care"],
  },
  {
    year: "2024",
    title: "Cross Creek Ranch today",
    blurb:
      "A growing, vibrant community with more resources, activities, and resident life than ever before.",
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

export default function HistoryPage() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>("");

  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const years = useMemo(() => HISTORY.map((h) => h.year), []);

  const scrollToYear = (year: string) => {
    setActive(year);
    const el = refs.current[year];
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <motion.div variants={fadeUp}>
          <div className="text-xs font-semibold tracking-[0.22em] text-blue-700">
            CROSS CREEK RANCH • HISTORY
          </div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-950">
            Our Story
          </h1>
          <p className="mt-3 max-w-2xl text-blue-800/90">
            A simple timeline of key moments in Cross Creek Ranch — built to match the
            Gatherly style.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold border border-blue-700 bg-blue-700 text-white hover:bg-blue-800 transition"
            >
              Explore Resources →
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold border border-blue-200 bg-white/70 text-blue-900 hover:bg-white transition"
            >
              Browse Events →
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        <aside className="lg:sticky lg:top-24 h-fit">
          <motion.div
            variants={fadeUp}
            className="rounded-3xl border border-blue-200 bg-white/70 backdrop-blur p-5 shadow-sm"
          >
            <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
              QUICK JUMP
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => scrollToYear(y)}
                  className={[
                    "rounded-2xl px-3 py-2 text-sm font-semibold border transition",
                    active === y
                      ? "bg-blue-700 text-white border-blue-700"
                      : "bg-white text-blue-900 border-blue-200 hover:bg-blue-50",
                  ].join(" ")}
                >
                  {y}
                </button>
              ))}
            </div>

            <div className="mt-4 text-xs text-blue-700/80">
              Tip: click a year to jump to that section.
            </div>
          </motion.div>
        </aside>

        <section className="relative">
          <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-blue-200" />

          <div className="space-y-5">
            {HISTORY.map((h) => (
              <motion.div
                key={h.year}
                variants={card}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-120px" }}
                ref={(el) => {
                  refs.current[h.year] = el;
                }}
                className="relative pl-10 sm:pl-12"
              >
                <div
                  className={[
                    "absolute left-[9px] sm:left-[13px] top-7 h-3 w-3 rounded-full border",
                    h.highlight
                      ? "bg-blue-700 border-blue-700"
                      : "bg-white border-blue-300",
                  ].join(" ")}
                />
                <div
                  className={[
                    "rounded-3xl border bg-white/75 backdrop-blur p-6 shadow-sm",
                    h.highlight ? "border-blue-300 ring-2 ring-blue-200/60" : "border-blue-200",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[11px] font-semibold tracking-[0.22em] text-blue-700">
                        {h.highlight ? "HIGHLIGHT" : "MILESTONE"}
                      </div>
                      <h3 className="mt-2 text-2xl font-extrabold text-blue-950">
                        {h.title}
                      </h3>
                    </div>

                    <div className="shrink-0 rounded-2xl border border-blue-200 bg-white px-3 py-2 text-blue-900 font-extrabold">
                      {h.year}
                    </div>
                  </div>

                  <p className="mt-3 text-blue-800/90">{h.blurb}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {h.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-800"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/events"
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold border border-blue-200 bg-white text-blue-900 hover:bg-blue-50 transition"
                    >
                      See events →
                    </Link>
                    <Link
                      href="/map"
                      className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold border border-blue-200 bg-white text-blue-900 hover:bg-blue-50 transition"
                    >
                      Explore resources →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
