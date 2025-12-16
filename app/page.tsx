"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function Home() {
  const year = new Date().getFullYear();

  /* 📅 CALENDAR STATE */
  const [calendarDate, setCalendarDate] = React.useState(new Date());

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const changeMonth = (dir: number) => {
    setCalendarDate(new Date(calYear, calMonth + dir, 1));
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 text-gray-950 pb-20"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <main className="w-full max-w-7xl mx-auto px-6 pt-12 pb-[80vh] grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* CENTER COLUMN */}
        <motion.section variants={fadeUp} className="flex flex-col items-center space-y-8">
          <motion.h1
            className="text-7xl md:text-8xl font-extrabold tracking-tight"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
            variants={cardPop}
            animate={{
              x: [-60, -40, -60],
              y: [0, -6, 0],
              transition: { duration: 2.5, ease: "easeInOut" },
            }}
          >
            GATHERLY
          </motion.h1>

          {/* QUICK ACTIONS */}
          <motion.div
            variants={cardPop}
            className="p-5 w-full md:w-[88%] bg-white rounded-2xl border border-gray-200"
            whileHover={{ y: -3 }}
          >
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-blue-600/80">
              Easy Access To Our Valuable Community Resources
            </p>
          </motion.div>

          {/* BULLETIN BOARD */}
          <motion.div
            variants={cardPop}
            className="w-full md:w-[88%] h-[350px] bg-white rounded-2xl border border-gray-200 p-4 overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-3">Bulletin Board</h3>

            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3"
                >
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.meta}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* RIGHT COLUMN */}
        <motion.section variants={fadeUp} className="space-y-8">

          {/* UPCOMING EVENTS HEADER */}
          <motion.div
            variants={cardPop}
            className="p-6 bg-white rounded-2xl border-l-4 border-blue-500 border border-gray-200 text-center"
          >
            <h2 className="text-3xl font-semibold">Upcoming Events</h2>
            <p className="text-sm text-gray-500">
              Local gatherings & volunteer opportunities
            </p>
          </motion.div>

          {/* 📅 CALENDAR CARD */}
          <motion.div
            variants={cardPop}
            className="bg-white rounded-2xl border border-gray-200 p-5"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => changeMonth(-1)} className="text-blue-600">❮</button>
              <h3 className="font-semibold">
                {calendarDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button onClick={() => changeMonth(1)} className="text-blue-600">❯</button>
            </div>

            {/* DAYS */}
            <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
              {days.map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            {/* DATES */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={i} />
              ))}

              {Array.from({ length: lastDate }).map((_, i) => {
                const day = i + 1;
                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();

                return (
                  <motion.div
                    key={day}
                    whileHover={{ y: -3 }}
                    className={`h-10 rounded-xl flex items-center justify-center text-sm border cursor-pointer
                      ${
                        isToday
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                  >
                    {day}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-sm text-gray-500 mt-12">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}
