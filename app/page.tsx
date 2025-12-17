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
  const [openMenu, setOpenMenu] = React.useState<number | null>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-btn") && !target.closest(".dropdown-menu")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

      {/* MAIN */}
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* EVENTS */}
            <motion.div layout className="xl:col-span-2 space-y-8">
              <motion.div
                layout
                variants={cardPop}
                className="p-6 bg-white rounded-2xl border-l-4 border-blue-600 border border-blue-200 ring-1 ring-blue-100 shadow-sm text-center"
              >
                <h2 className="text-3xl font-semibold text-blue-900">
                  Upcoming Events
                </h2>
                <p className="text-sm text-blue-700 mt-1">
                  Local gatherings & volunteer opportunities
                </p>
              </motion.div>

              {[1, 2, 3].map((i) => (
                <motion.div
                  layout
                  key={i}
                  variants={cardPop}
                  className="relative bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm flex flex-col sm:flex-row gap-4 p-6"
                >
                  {/* IMAGE */}
                  <div className="w-full sm:w-28 aspect-square bg-blue-100 border border-blue-200 rounded-xl flex items-center justify-center text-blue-900 font-semibold">
                    IMG
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-xl font-medium text-blue-900">
                          Neighborhood Meetup
                        </div>
                        <div className="text-sm text-blue-700 mt-1">
                          Sat • 2:00 PM • Community Park
                        </div>
                      </div>

                      {/* DROPDOWN BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent document click
                          setOpenMenu(openMenu === i ? null : i);
                        }}
                        className="dropdown-btn text-blue-700 hover:text-blue-900 px-2"
                      >
                        ⋮
                      </button>
                    </div>
                  </div>

                  {/* RSVP */}
                  <span className="text-sm font-semibold text-blue-800 self-start sm:self-center">
                    RSVP
                  </span>

                  {/* DROPDOWN MENU */}
                  {openMenu === i && (
                    <div className="dropdown-menu absolute top-14 right-6 z-20 w-44 rounded-xl bg-white border border-blue-200 shadow-lg">
                      {["View Details", "Add to Calendar", "Share Event"].map(
                        (item) => (
                          <button
                            key={item}
                            className="w-full text-left px-4 py-2 text-sm text-blue-900 hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => setOpenMenu(null)}
                          >
                            {item}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* CALENDAR */}
            <motion.div
              layout
              variants={cardPop}
              className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-6 sm:p-8"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => changeMonth(-1)}
                  className="text-blue-700"
                >
                  ❮
                </button>

                <h3 className="text-lg sm:text-xl font-semibold text-blue-900">
                  {calendarDate.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <button
                  onClick={() => changeMonth(1)}
                  className="text-blue-700"
                >
                  ❯
                </button>
              </div>

              <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 mb-2">
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
                      className={`aspect-square rounded-xl flex items-center justify-center cursor-pointer border ${
                        isToday
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-blue-50 border-blue-200 hover:bg-blue-100"
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
