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
  const [calendarDate, setCalendarDate] = React.useState(new Date());
  const [openEventIndex, setOpenEventIndex] = React.useState<number | null>(null);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const changeMonth = (dir: number) => {
    setCalendarDate(new Date(calYear, calMonth + dir, 1));
  };

  const events = [
    {
      title: "Neighborhood Meetup",
      whenWhere: "Sat • 2:00 PM • Community Park",
      details:
        "Bring a friend and meet neighbors. Share resources and get connected.",
    },
    {
      title: "Community Clean-Up",
      whenWhere: "Sun • 10:00 AM • Riverwalk Entrance",
      details:
        "Gloves provided. Small groups, kid-friendly with supervision.",
    },
    {
      title: "Job & Skills Workshop",
      whenWhere: "Wed • 6:30 PM • Library Annex",
      details:
        "Resume tips, mock interviews, and networking opportunities.",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-950 pb-20"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <main className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CENTER COLUMN */}
        <motion.section variants={fadeUp} className="space-y-8">
          <motion.h1
            className="text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
            variants={cardPop}
          >
            GATHERLY
          </motion.h1>

          {/* QUICK ACTIONS */}
          <motion.div
            variants={cardPop}
            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm"
            whileHover={{ y: -3 }}
          >
            <h3 className="font-semibold text-lg text-indigo-900">
              Quick Actions
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Easy access to community resources
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Visit Our Map", "Share an Event"].map((action) => (
                <div
                  key={action}
                  className="rounded-xl bg-white hover:bg-blue-100 border border-blue-200 px-4 py-3 flex justify-between transition"
                >
                  <span className="text-sm font-medium text-gray-900">
                    {action}
                  </span>
                  <span className="text-sm text-blue-700 font-semibold">
                    Go →
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VOLUNTEER */}
          <motion.div
            variants={cardPop}
            className="p-5 bg-white rounded-2xl border border-emerald-200 shadow-sm"
          >
            <h3 className="font-semibold text-lg text-emerald-700 mb-4">
              Volunteer Opportunities
            </h3>

            <ul className="space-y-4">
              {[
                "Free community dinner",
                "Warm clothing drive",
                "Literacy tutoring",
              ].map((title, i) => (
                <li
                  key={i}
                  className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  <div className="font-medium text-gray-900">{title}</div>
                  <div className="h-1 mt-3 bg-emerald-200 rounded-full">
                    <div className="h-1 w-2/3 bg-emerald-500 rounded-full" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* RIGHT SIDE */}
        <motion.section variants={fadeUp} className="md:col-span-2 space-y-8">
          {/* EVENTS HEADER */}
          <motion.div
            variants={cardPop}
            className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-50 border-l-4 border-indigo-500"
          >
            <h2 className="text-3xl font-semibold text-indigo-900">
              Upcoming Events
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Local gatherings & opportunities
            </p>
          </motion.div>

          {/* EVENTS */}
          {events.map((ev, i) => {
            const isOpen = openEventIndex === i;

            return (
              <motion.div
                key={ev.title}
                variants={cardPop}
                className="bg-white rounded-2xl border border-indigo-200 shadow-sm"
              >
                <button
                  onClick={() =>
                    setOpenEventIndex(isOpen ? null : i)
                  }
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div>
                    <div className="text-xl font-medium text-gray-950">
                      {ev.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ev.whenWhere}
                    </div>
                  </div>
                  <span className="text-indigo-600 font-semibold">
                    {isOpen ? "Hide" : "Details"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="p-4 rounded-xl bg-indigo-50 text-sm text-gray-700">
                      {ev.details}
                    </div>

                    <div className="mt-3 flex gap-2">
                      {["Free", "Family Friendly"].map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* CALENDAR */}
          <motion.div
            variants={cardPop}
            className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => changeMonth(-1)} className="text-indigo-600">
                ❮
              </button>
              <h3 className="font-semibold text-lg text-indigo-900">
                {calendarDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button onClick={() => changeMonth(1)} className="text-indigo-600">
                ❯
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: lastDate }).map((_, i) => {
                const day = i + 1;
                const isToday =
                  day === today.getDate() &&
                  calMonth === today.getMonth() &&
                  calYear === today.getFullYear();

                return (
                  <div
                    key={day}
                    className={`h-10 flex items-center justify-center rounded-xl border transition
                      ${
                        isToday
                          ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-indigo-500"
                          : "bg-gray-50 hover:bg-indigo-50 border-gray-200"
                      }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-sm text-gray-500">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}

