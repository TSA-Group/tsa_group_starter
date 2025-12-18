"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [openEvent, setOpenEvent] = useState<number | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  // Get today's date in Texas (Central Time)
  const now = new Date();
  const texasToday = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  texasToday.setHours(0, 0, 0, 0); // normalize to midnight

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
      date: "Sat • 2:00 PM",
      location: "Community Park",
      details: "Meet local residents and join community discussions.",
    },
    {
      title: "Community Dinner",
      date: "Sat • 6:00 PM",
      location: "Downtown Church",
      details: "Enjoy a free meal and fellowship with neighbors.",
    },
    {
      title: "Clothing Drive",
      date: "Sun • 10:00 AM",
      location: "Westside Center",
      details: "Donate clothes for those in need and volunteer.",
    },
  ];

  const changeMonth = (dir: number) => {
    setCalendarDate(new Date(calYear, calMonth + dir, 1));
  };

  // Build calendar days with empty slots at start
  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysArray: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i);
      d.setHours(0,0,0,0);
      daysArray.push(d);
    }
    return daysArray;
  };

  const calendarDays = generateCalendarDays();

  return (
    <motion.div
      layoutRoot
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen overflow-x-hidden text-slate-950 bg-[linear-gradient(to_bottom,rgba(219,234,254,0.55)_0%,rgba(255,255,255,1)_180px)]"
    >
      {/* HEADER */}
      <motion.header
        layout
        variants={fadeUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10"
      >
        <motion.h1
          layout
          variants={cardPop}
          animate={{
            x: [-20, 0, -20],
            y: [0, -6, 0],
            transition: { duration: 2.5, ease: "easeInOut" },
          }}
          className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-center lg:text-left text-blue-900"
          style={{ fontFamily: "TAN Buster, sans-serif" }}
        >
          GATHERLY
        </motion.h1>
      </motion.header>

      {/* MAIN GRID */}
      <motion.main
        layout
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10"
      >
        {/* LEFT COLUMN */}
        <motion.section layout variants={fadeUp} className="space-y-8">
          {/* QUICK ACTIONS */}
          <motion.div
            layout
            variants={cardPop}
            className="p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-1 text-blue-900">
              Quick Actions
            </h3>
            <p className="text-sm text-blue-700">
              Easy Access To Our Valuable Community Resources
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Visit Our Map"].map((action) => (
                <Link key={action} href="/map" className="block">
                  <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200 cursor-pointer">
                    <span className="text-sm">{action}</span>
                    <span className="text-xs font-semibold text-blue-700">
                      Go
                    </span>
                  </div>
                </Link>
                ))}
            </div>
          </motion.div>

          {/* VOLUNTEER */}
          <motion.div
            layout
            variants={cardPop}
            className="h-[350px] p-4 overflow-y-auto bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-3 text-blue-900">
              Volunteer Opportunities
            </h3>

            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
                { title: "Neighborhood cleanup — Sun 10am", meta: "Riverside Park" },
                { title: "Food pantry helpers — Wed 4pm", meta: "Community Hall" },
              ].map((item, i) => (
                <motion.li
                  layout
                  key={i}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-3 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-blue-700">{item.meta}</div>
                    </div>
                    <span className="text-xs font-medium text-blue-800">Details</span>
                  </div>

                  <div className="h-1 w-full bg-blue-200 rounded-full">
                    <div className="h-1 w-2/3 bg-blue-500 rounded-full" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* RIGHT COLUMN - events and calendar */}
        <motion.section
          layout
          variants={fadeUp}
          className="lg:col-span-2 flex flex-col lg:flex-row gap-6"
        >
          {/* Left: Events */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            {/* Upcoming Events Box */}
            <motion.div
              layout
              variants={cardPop}
              className="p-6 bg-white rounded-2xl border-l-4 border-blue-500 border border-blue-200 ring-1 ring-blue-100 shadow-sm text-center"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold text-blue-900">
                Upcoming Events
              </h2>
              <p className="text-sm text-blue-700 mt-1">
                Local gatherings & volunteer opportunities
              </p>
            </motion.div>

            {/* Event Cards */}
            {events.map((event, i) => (
              <motion.div
                key={i}
                layout
                variants={cardPop}
                className="relative bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-4 cursor-pointer hover:bg-blue-50"
                onClick={() => setOpenEvent(openEvent === i ? null : i)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">{event.title}</h3>
                    <p className="text-sm text-blue-700">{event.date} • {event.location}</p>
                  </div>

                  {/* Three-dot menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenIndex(menuOpenIndex === i ? null : i);
                      }}
                      className="text-blue-700 text-xl font-bold px-2 py-1"
                    >
                      ⋮
                    </button>

                    <AnimatePresence>
                      {menuOpenIndex === i && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-32 bg-white border border-blue-200 rounded-xl shadow-lg z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ul className="flex flex-col">
                            {["Save Event", "Share Event"].map((option) => (
                              <li
                                key={option}
                                className="px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 cursor-pointer"
                                onClick={() => setMenuOpenIndex(null)}
                              >
                                {option}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Expandable details inside same card */}
                <AnimatePresence>
                  {openEvent === i && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: "0.5rem" }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="text-blue-800 text-sm"
                    >
                      {event.details}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Right: Calendar */}
          <motion.div
            layout
            variants={cardPop}
            className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-4 sm:p-6 lg:w-1/2"
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}
                className="text-blue-700 text-2xl font-bold"
              >
                ❮
              </button>

              <h3 className="text-lg sm:text-xl font-semibold text-blue-900">
                {monthNames[calMonth]} {calYear}
              </h3>

              <button
                onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}
                className="text-blue-700 text-2xl font-bold"
              >
                ❯
              </button>
            </div>

            {/* Weekday labels */}
            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((date, idx) => {
                if (!date) return <div key={idx}></div>;

                const isToday = date.getTime() === texasToday.getTime();

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-center h-12 sm:h-14 w-full rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition ${
                      isToday
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-900"
                    }`}
                  >
                    {date.getDate()}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* FOOTER */}
      <footer className="border-t border-blue-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="font-semibold underline mb-2 text-blue-900">
            Contact Our Community Staff:
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-8 text-sm">
            <a className="text-blue-700" href="mailto:Gatherly@gmail.com">
              Gatherly@gmail.com
            </a>
            <a className="text-blue-700" href="tel:012-345-6789">
              012-345-6789
            </a>
            <span className="text-blue-700">[enter info]</span>
          </div>
        </div>

        <div className="text-center text-sm text-blue-700 py-4 bg-blue-50">
          © {year} Gatherly. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
}

