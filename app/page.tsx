```tsx
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
      className="min-h-screen bg-gray-50 text-gray-950 pb-20 transition-colors duration-300"
      initial="hidden"
      animate="show"
      variants={container}
    >
      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl mx-auto px-6 pt-12 pb-[80vh] mt-0 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* CENTER COLUMN — GATHERLY + QUICK ACTIONS BELOW */}
        <motion.section
          variants={fadeUp}
          className="flex flex-col items-center space-y-8"
        >
          {/* BIG TITLE */}
          <motion.h1
            className="text-7xl md:text-8xl font-extrabold tracking-tight leading-none text-gray-950"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
            variants={cardPop}
            animate={{
              x: [-60, -40, -60],
              y: [0, -6, 0],
              transition: { duration: 2.5, ease: "easeInOut", repeat: Infinity },
            }}
          >
            GATHERLY
          </motion.h1>

          {/* QUICK ACTIONS */}
          <motion.div
            variants={cardPop}
            className="p-5 w-full md:w-[88%] bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition"
            whileHover={{ y: -3 }}
          >
            <h3 className="text-lg font-semibold mb-1 text-gray-950">
              Quick Actions
            </h3>
            <p className="text-sm text-blue-600/80">
              Easy Access To Our Valuable Community Resources
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Visit Our Map", "Share an event"].map((action) => (
                <div
                  key={action}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-200"
                >
                  <span className="text-sm text-gray-900">{action}</span>
                  <span className="text-xs font-semibold text-blue-600">Go</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VOLUNTEER OPPORTUNITIES */}
          <motion.div
            variants={cardPop}
            className="w-full md:w-[88%] h-[350px] bg-white rounded-2xl border border-gray-200 shadow-sm p-4 relative overflow-y-auto"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg font-semibold text-gray-950 mb-2">
              Volunteer Opportunities
            </h3>

            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
                { title: "Brendan make something up also add date+time", meta: "Some place" },
                { title: "Brendan make something up also add date+time", meta: "Some place" },
                { title: "Brendan make something up also add date+time", meta: "Some place" },
                { title: "Brendan make something up also add date+time", meta: "Some place" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-950">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">{item.meta}</div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Details
                    </div>
                  </div>

                  <div className="h-1 w-full bg-gray-200 rounded-full">
                    <div className="h-1 bg-blue-500 rounded-full w-2/3" />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* RIGHT SIDE — UPCOMING EVENTS (LEFT) + CALENDAR (RIGHT) */}
        <motion.section variants={fadeUp} className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Upcoming Events (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                variants={cardPop}
                className="p-6 bg-white rounded-2xl shadow-sm border-l-4 border-blue-500 border border-gray-200 text-center"
                whileHover={{ y: -3 }}
              >
                <h2 className="text-3xl font-semibold text-gray-950">
                  Upcoming Events
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Local gatherings & volunteer opportunities
                </p>
              </motion.div>

              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  variants={cardPop}
                  className="h-36 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4 p-5 hover:shadow-md transition"
                  whileHover={{ translateY: -4 }}
                >
                  <div className="flex-none w-24 h-24 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-blue-600 font-semibold">
                    IMG
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-medium text-gray-950">
                      Neighborhood Meetup
                    </div>
                    <div className="text-sm text-gray-500">
                      Sat • 2:00 PM • Community Park
                    </div>
                  </div>

                  <div className="text-sm text-blue-600 font-semibold">RSVP</div>
                </motion.div>
              ))}
            </div>

            {/* Calendar (fills remaining right side) */}
            <motion.div
              variants={cardPop}
              className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 w-full"
              whileHover={{ y: -3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-blue-600"
                >
                  ❮
                </button>
                <h3 className="text-lg font-semibold text-gray-950">
                  {calendarDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button
                  onClick={() => changeMonth(1)}
                  className="text-blue-600"
                >
                  ❯
                </button>
              </div>

              <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                {days.map((day) => (
                  <div key={day} className="text-center font-medium">
                    {day}
                  </div>
                ))}
              </div>

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

  const dayClass = isToday
    ? "bg-blue-500 text-white border-blue-500 shadow-sm"
    : "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100";

  return (
    <motion.div
      key={day}
      whileHover={{ y: -3 }}
      className={`h-10 rounded-xl flex items-center justify-center text-sm cursor-pointer border transition ${dayClass}`}
    >
      {day}
    </motion.div>
  );
})}

              </div>
            </motion.div>
          </div>
        </motion.section>
      </main>

      {/* FOOTER CONTACT */}
      <motion.footer
        variants={fadeUp}
        className="w-full p-6 bg-white border-t border-gray-200 mt-12 text-gray-700"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold underline mb-2 text-gray-950">
            Contact Our Community Staff:
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm">
            <a className="text-blue-600" href="mailto:Gatherly@gmail.com">
              Gatherly@gmail.com
            </a>
            <a className="text-blue-600" href="tel:012-345-6789">
              012-345-6789
            </a>
            <span className="text-gray-500">[enter info]</span>
          </div>
        </div>
      </motion.footer>

      {/* COPYRIGHT FOOTER */}
      <footer className="w-full p-4 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-200">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}
```
