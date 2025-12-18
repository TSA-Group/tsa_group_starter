"use client";

import React, { useState, useEffect } from "react";
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
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [openEvent, setOpenEvent] = useState<number | null>(null);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const lastDate = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const events = [
    {
      title: "Neighborhood Meetup",
      date: "Sat • 2:00 PM",
      location: "Community Park",
      details: "Meet local residents and join community discussions."
    },
    {
      title: "Community Dinner",
      date: "Sat • 6:00 PM",
      location: "Downtown Church",
      details: "Enjoy a free meal and fellowship with neighbors."
    },
    {
      title: "Clothing Drive",
      date: "Sun • 10:00 AM",
      location: "Westside Center",
      details: "Donate clothes for those in need and volunteer."
    },
  ];

  const changeMonth = (dir: number) => {
    setCalendarDate(new Date(calYear, calMonth + dir, 1));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".event-card") && !target.closest(".event-dropdown")) {
        setOpenEvent(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <motion.div
      layoutRoot
      initial="hidden"
      animate="show"
      variants={container}
      className="
        min-h-screen overflow-x-hidden text-slate-950
        bg-[linear-gradient(to_bottom,rgba(219,234,254,0.55)_0%,rgba(255,255,255,1)_180px)]
      "
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
              {["Visit Our Map", "Share an Event"].map((action) => (
                <div
                  key={action}
                  className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200"
                >
                  <span className="text-sm">{action}</span>
                  <span className="text-xs font-semibold text-blue-700">
                    Go
                  </span>
                </div>
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
                    <span className="text-xs font-medium text-blue-800">
                      Details
                    </span>
                  </div>

                  <div className="h-1 w-full bg-blue-200 rounded-full">
                    <div className="h-1 w-2/3 bg-blue-500 rounded-full" />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* RIGHT COLUMN */}
        <motion.section
          layout
          variants={fadeUp}
          className="lg:col-span-2 space-y-8"
        >
          <div className="grid grid-cols-1 gap-6">
            {/* EVENT CARDS */}
            {events.map((event, i) => (
              <motion.div
                key={i}
                layout
                variants={cardPop}
                className="relative"
              >
                <div
                  className="event-card cursor-pointer bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-6 hover:bg-blue-50"
                  onClick={() => setOpenEvent(openEvent === i ? null : i)}
                >
                  <h3 className="text-xl font-semibold text-blue-900">{event.title}</h3>
                  <p className="text-sm text-blue-700">{event.date} • {event.location}</p>
                </div>

                {/* Dropdown Box */}
                {openEvent === i && (
                  <motion.div
                    className="event-dropdown absolute top-full mt-2 left-0 w-full bg-white border border-blue-200 rounded-xl shadow-lg p-4 text-blue-800 z-20"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <p>{event.details}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}

            {/* CALENDAR */}
            <motion.div
              layout
              variants={cardPop}
              className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-blue-700 text-2xl font-bold"
                >
                  ❮
                </button>

                <h3 className="text-lg sm:text-2xl font-semibold text-blue-900">
                  {calendarDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <button
                  onClick={() => changeMonth(1)}
                  className="text-blue-700 text-2xl font-bold"
                >
                  ❯
                </button>
              </div>

              <div className="grid grid-cols-7 text-sm text-blue-700 mb-2">
                {days.map((d) => (
                  <div key={d} className="text-center font-medium">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2 sm:gap-3">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: lastDate }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday =
                    dayNum === today.getDate() &&
                    calMonth === today.getMonth() &&
                    calYear === today.getFullYear();

                  return (
                    <motion.div
                      layout
                      key={dayNum}
                      className={`h-[60px] w-[60px] flex items-center justify-center rounded-xl cursor-pointer border text-lg font-semibold transition ${
                        isToday
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-900"
                      }`}
                    >
                      {dayNum}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
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
