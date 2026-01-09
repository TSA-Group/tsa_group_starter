"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  Variants,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { QuickActions } from "./QuickActions";

/* ------------------ MOTION VARIANTS ------------------ */

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

/* ------------------ PAGE ------------------ */

export default function Home() {
  const year = new Date().getFullYear();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    setScrollRange(document.body.scrollHeight - window.innerHeight);
  }, []);

  /* ------------------ PARALLAX + COLOR DEPTH ------------------ */

  const slowY = useTransform(scrollY, [0, scrollRange], [0, -120]);
  const fastY = useTransform(scrollY, [0, scrollRange], [0, -280]);

  // MULTI-LAYER COLOR ATMOSPHERE
  const bgMain = useTransform(
    scrollY,
    [0, scrollRange * 0.4, scrollRange],
    [
      "linear-gradient(180deg, #FFFFFF 0%, #F3F6FB 60%)",
      "linear-gradient(180deg, #EEF3F9 0%, #E4EBF4 70%)",
      "linear-gradient(180deg, #E6EDF5 0%, #D9E3EF 80%)",
    ]
  );

  /* ------------------ CALENDAR DATA ------------------ */

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const events = [
    {
      title: "Neighborhood Meetup",
      dateString: "2025-12-21T14:00:00",
      location: "Community Park",
      details: "Meet local residents and join discussions.",
    },
    {
      title: "Community Dinner",
      dateString: "2025-12-21T18:00:00",
      location: "Downtown Church",
      details: "Free meal and fellowship.",
    },
    {
      title: "Clothing Drive",
      dateString: "2025-12-22T10:00:00",
      location: "Westside Center",
      details: "Donate clothes and volunteer.",
    },
  ];

  const generateCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(calYear, calMonth, i));
    return days;
  };

  const calendarDays = generateCalendarDays();

  /* ------------------ JSX ------------------ */

  return (
    <motion.div
      style={{ background: bgMain }}
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen overflow-x-hidden text-slate-900"
    >

      {/* ------------------ HERO ------------------ */}
      <motion.header
        style={{ y: slowY }}
        className="relative min-h-[95vh] flex flex-col justify-center max-w-7xl mx-auto px-6"
      >
        {/* soft glow layer */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,#E6EEFA,transparent_60%)]" />

        <motion.h1
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          className="text-7xl sm:text-8xl lg:text-9xl font-extrabold tracking-tight
                     text-transparent bg-clip-text
                     bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600"
          style={{ fontFamily: "TAN Buster, sans-serif" }}
        >
          GATHERLY
        </motion.h1>

        <p className="mt-10 text-xl max-w-xl text-blue-700/90">
          A calm, beautifully layered space for real communities.
        </p>
      </motion.header>

      {/* ------------------ CALENDAR + ACTIONS ------------------ */}
      <motion.main className="relative max-w-7xl mx-auto px-6 pb-72 flex flex-col lg:flex-row gap-20">
        <motion.section style={{ y: fastY }} className="lg:w-1/3">
          <QuickActions />
        </motion.section>

        <motion.section className="lg:w-2/3">
          <motion.div
            ref={calendarRef}
            variants={cardPop}
            className="
              bg-gradient-to-br from-white via-blue-50 to-blue-100
              rounded-2xl border border-blue-200/70
              shadow-[0_30px_60px_-20px_rgba(30,64,175,0.25)]
              p-6
            "
          >
            <div className="flex justify-between mb-4">
              <button className="text-blue-700" onClick={() => setCalendarDate(new Date(calYear, calMonth - 1))}>❮</button>
              <h3 className="font-semibold text-blue-900">
                {monthNames[calMonth]} {calYear}
              </h3>
              <button className="text-blue-700" onClick={() => setCalendarDate(new Date(calYear, calMonth + 1))}>❯</button>
            </div>

            <div className="grid grid-cols-7 text-sm mb-2">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center text-blue-800">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, i) =>
                date ? (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className="
                      h-12 flex items-center justify-center rounded-lg
                      bg-gradient-to-br from-blue-50 to-blue-100
                      hover:from-blue-100 hover:to-blue-200
                      text-blue-900 cursor-pointer
                    "
                  >
                    {date.getDate()}
                  </div>
                ) : (
                  <div key={i} />
                )
              )}
            </div>

            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="
                    mt-4 p-4 rounded-xl
                    bg-gradient-to-br from-blue-100 via-blue-50 to-white
                    text-blue-900
                  "
                >
                  Events on {selectedDate.toDateString()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* ------------------ STATEMENT ------------------ */}
      <section className="min-h-[120vh] flex items-center justify-center px-6 bg-gradient-to-b from-transparent to-blue-100/40">
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-6xl sm:text-7xl font-extrabold text-blue-950 text-center max-w-4xl"
        >
          Depth isn’t decoration — it’s intention.
        </motion.h2>
      </section>

      {/* ------------------ FLOATING INFO ------------------ */}
      <section className="relative py-80 overflow-hidden">
        <motion.div
          style={{ y: slowY }}
          className="
            absolute left-10 top-40 w-72 p-6 rounded-2xl
            bg-gradient-to-br from-white via-blue-50 to-blue-100
            shadow-[0_25px_50px_-20px_rgba(37,99,235,0.4)]
          "
        >
          <h4 className="font-semibold text-blue-900 mb-2">Layered Design</h4>
          <p className="text-sm text-blue-700">
            Multiple tones create emotional depth.
          </p>
        </motion.div>

        <motion.div
          style={{ y: fastY }}
          className="
            absolute right-10 top-96 w-72 p-6 rounded-2xl
            bg-gradient-to-br from-blue-100 via-blue-50 to-white
            shadow-[0_25px_50px_-20px_rgba(30,64,175,0.45)]
          "
        >
          <h4 className="font-semibold text-blue-900 mb-2">Motion with Purpose</h4>
          <p className="text-sm text-blue-700">
            Depth comes from restraint.
          </p>
        </motion.div>
      </section>

      {/* ------------------ STORY ------------------ */}
      <section className="py-64 px-6 bg-gradient-to-b from-blue-100/30 to-blue-200/40">
        <h2 className="text-5xl font-extrabold text-center text-blue-950 mb-16">
          Our Story
        </h2>
        <div className="
          max-w-4xl mx-auto p-12 rounded-2xl
          bg-gradient-to-br from-white via-blue-50 to-blue-100
          shadow-[0_40px_80px_-30px_rgba(30,64,175,0.35)]
        ">
          <p><strong>2023:</strong> The idea was born.</p>
          <p className="mt-4"><strong>2024:</strong> The platform took shape.</p>
          <p className="mt-4"><strong>2025:</strong> Gatherly launched.</p>
        </div>
      </section>

      {/* ------------------ FOOTER ------------------ */}
      <footer className="border-t border-blue-200 bg-gradient-to-b from-blue-50 to-blue-100 py-6 text-center text-sm text-blue-800">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}


