"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  Variants,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { QuickActions } from "./QuickActions";

/* ---------------- ANIMATIONS ---------------- */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ---------------- PAGE ---------------- */

export default function Home() {
  const year = new Date().getFullYear();
  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(1);

  useEffect(() => {
    setScrollRange(document.body.scrollHeight - window.innerHeight);
  }, []);

  /* -------- MULTI-ZONE COLOR SYSTEM -------- */

  const baseBg = useTransform(
    scrollY,
    [0, scrollRange * 0.25, scrollRange],
    ["#ffffff", "#EEF3F9", "#E5E9EF"]
  );

  const greyChapter = useTransform(
    scrollY,
    [scrollRange * 0.35, scrollRange * 0.6],
    ["rgba(226,232,240,0)", "rgba(203,213,225,0.65)"]
  );

  const deepBlueChapter = useTransform(
    scrollY,
    [scrollRange * 0.6, scrollRange],
    ["rgba(15,23,42,0)", "rgba(15,23,42,0.15)"]
  );

  const slowY = useTransform(scrollY, [0, scrollRange], [0, -140]);
  const fastY = useTransform(scrollY, [0, scrollRange], [0, -320]);

  /* ---------------- JSX ---------------- */

  return (
    <motion.div
      style={{ background: baseBg }}
      variants={container}
      initial="hidden"
      animate="show"
      className="relative min-h-screen overflow-x-hidden text-slate-900"
    >
      {/* COLOR OVERLAYS */}
      <motion.div
        style={{ backgroundColor: greyChapter }}
        className="fixed inset-0 -z-10 pointer-events-none"
      />
      <motion.div
        style={{ backgroundColor: deepBlueChapter }}
        className="fixed inset-0 -z-10 pointer-events-none"
      />

      {/* HERO */}
      <motion.header
        style={{ y: slowY }}
        className="min-h-[95vh] flex flex-col justify-center max-w-7xl mx-auto px-6"
      >
        <motion.h1
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl sm:text-9xl font-extrabold tracking-tight
                     text-transparent bg-clip-text
                     bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600"
        >
          GATHERLY
        </motion.h1>

        <p className="mt-12 max-w-xl text-xl text-blue-800">
          A calmer way to discover events, connect locally, and exist online
          without noise.
        </p>
      </motion.header>

      {/* TOOLS SECTION */}
      <motion.section className="max-w-7xl mx-auto px-6 pb-72 grid lg:grid-cols-3 gap-20">
        <motion.div style={{ y: fastY }}>
          <QuickActions />
        </motion.div>

        <motion.div variants={fadeUp} className="lg:col-span-2 space-y-10">
          {[
            "Discover events without algorithmic chaos.",
            "Everything is location-aware and intentional.",
            "Designed for clarity, not addiction.",
          ].map((text, i) => (
            <motion.div
              key={i}
              variants={cardPop}
              className="p-8 rounded-2xl bg-white/70 backdrop-blur-xl
                         border border-white/40
                         shadow-[0_40px_80px_-30px_rgba(30,64,175,0.4)]"
            >
              <p className="text-xl font-medium text-blue-900">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* IMAGE CHAPTER */}
      <section className="relative min-h-[120vh] flex items-center">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/40 to-transparent" />

        <motion.div
          variants={fadeUp}
          viewport={{ once: true }}
          className="relative max-w-3xl mx-auto p-14 bg-white/80 backdrop-blur-xl
                     rounded-3xl shadow-2xl"
        >
          <h2 className="text-4xl font-extrabold text-blue-950 mb-6">
            Designed around real places
          </h2>
          <p className="text-lg text-blue-800 leading-relaxed">
            Gatherly focuses on physical proximity and real-world presence,
            turning digital discovery into real human connection.
          </p>
        </motion.div>
      </section>

      {/* GREY PHILOSOPHY CHAPTER */}
      <section className="py-72 px-6 bg-gradient-to-b from-slate-100 via-slate-200/70 to-slate-300/60">
        <h2 className="text-5xl font-extrabold text-center mb-24 text-slate-900">
          A slower digital experience
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          {[
            "No infinite feeds",
            "No engagement manipulation",
            "No artificial urgency",
            "Intentional design",
            "Local-first discovery",
            "Human pacing",
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={cardPop}
              className="p-10 rounded-2xl bg-white/70 backdrop-blur-xl shadow-lg"
            >
              <p className="text-lg font-semibold text-slate-800">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FINAL IMAGE + STATEMENT */}
      <section className="relative min-h-[100vh] flex items-center justify-center px-6">
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          className="absolute inset-0 w-full h-full object-cover"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 to-slate-900/20" />

        <motion.div
          variants={fadeUp}
          className="relative max-w-2xl text-center text-white"
        >
          <h2 className="text-5xl font-extrabold mb-8">
            Technology should feel human again
          </h2>
          <p className="text-xl text-slate-200">
            Gatherly is built to support real communities — not extract attention.
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-slate-700 bg-slate-100">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}


