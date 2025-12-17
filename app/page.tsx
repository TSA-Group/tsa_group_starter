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
      layoutRoot
      initial="hidden"
      animate="show"
      variants={container}
      className="
        min-h-screen overflow-x-hidden text-slate-950
        bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(56,189,248,0.35),transparent_60%),
            radial-gradient(900px_500px_at_80%_10%,rgba(14,165,233,0.25),transparent_55%),
            linear-gradient(to_bottom,rgba(239,246,255,1),rgba(219,234,254,1))]
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
          className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-center lg:text-left text-sky-900 drop-shadow-sm"
          style={{ fontFamily: "TAN Buster, sans-serif" }}
        >
          GATHERLY
        </motion.h1>
      </motion.header>

      {/* MAIN */}
      <motion.main
        layout
        className="
          max-w-7xl mx-auto
          px-4 sm:px-6 lg:px-8
          pb-32
          grid grid-cols-1
          lg:grid-cols-3
          gap-8 lg:gap-10
        "
      >
        {/* LEFT COLUMN */}
        <motion.section layout variants={fadeUp} className="space-y-8">
          {/* QUICK ACTIONS */}
          <motion.div
            layout
            variants={cardPop}
            className="p-5 bg-gradient-to-br from-white to-sky-50 rounded-2xl border border-sky-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-1 text-sky-900">
              Quick Actions
            </h3>
            <p className="text-sm text-sky-700">
              Easy Access To Our Valuable Community Resources
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Visit Our Map", "Share an Event"].map((action) => (
                <div
                  key={action}
                  className="flex items-center justify-between rounded-xl bg-sky-100 px-4 py-3 border border-sky-200 hover:bg-sky-200 transition"
                >
                  <span className="text-sm">{action}</span>
                  <span className="text-xs font-semibold text-sky-800">
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
            className="h-[350px] p-4 overflow-y-auto bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
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
                  className="bg-blue-100 border border-blue-200 rounded-xl p-3 shadow-sm"
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* EVENTS */}
            <motion.div layout className="xl:col-span-2 space-y-8">
              <motion.div
                layout
                variants={cardPop}
                className="p-6 bg-gradient-to-br from-sky-100 to-white rounded-2xl border-l-4 border-sky-500 border border-sky-200 shadow-sm text-center"
              >
                <h2 className="text-3xl font-semibold text-sky-900">
                  Upcoming Events
                </h2>
                <p className="text-sm text-sky-700 mt-1">
                  Local gatherings & volunteer opportunities
                </p>
              </motion.div>

              {[1, 2, 3].map((i) => (
                <motion.div
                  layout
                  key={i}
                  variants={cardPop}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 p-6"
                >
                  <div className="w-full sm:w-28 aspect-square bg-gradient-to-br from-blue-200 to-blue-300 border border-blue-300 rounded-xl flex items-center justify-center text-blue-900 font-semibold">
                    IMG
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-medium">
                      Neighborhood Meetup
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      Sat • 2:00 PM • Community Park
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-blue-800 self-start sm:self-center">
                    RSVP
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CALENDAR */}
            <motion.div
              layout
              variants={cardPop}
              className="bg-gradient-to-br from-white to-sky-50 rounded-2xl border border-sky-200 shadow-sm p-6 sm:p-8 w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-sky-700"
                >
                  ❮
                </button>

                <h3 className="text-lg sm:text-xl font-semibold text-sky-900">
                  {calendarDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <button
                  onClick={() => changeMonth(1)}
                  className="text-sky-700"
                >
                  ❯
                </button>
              </div>

              <div className="grid grid-cols-7 text-xs sm:text-sm text-sky-700 mb-2">
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
                      className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer border transition ${
                        isToday
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-100 border-blue-200 hover:bg-blue-200"
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
      <footer className="border-t border-blue-200 bg-gradient-to-r from-blue-100 via-sky-50 to-blue-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="font-semibold underline mb-2 text-blue-900">
            Contact Our Community Staff:
          </p>
          <div className="flex flex-col sm:flex-row sm:gap-8 text-sm">
            <a className="text-blue-700 hover:text-blue-900" href="mailto:Gatherly@gmail.com">
              Gatherly@gmail.com
            </a>
            <a className="text-blue-700 hover:text-blue-900" href="tel:012-345-6789">
              012-345-6789
            </a>
            <span className="text-blue-700">[enter info]</span>
          </div>
        </div>

        <div className="text-center text-sm text-blue-700 py-4 bg-white/70">
          © {year} Gatherly. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
}
