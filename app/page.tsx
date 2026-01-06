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

// Animation variants
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

// Actions for the first box (links)
const actions = [
  { label: "Visit Our Map", href: "/map" },
  { label: "Contact Us", href: "/contact" },
];

export default function QuickActions() {
  return (
    <motion.section
      layout
      variants={fadeUp}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-4"
    >
      {/* Box 1: with links */}
      <motion.div
        layout
        variants={cardPop}
        className="w-full sm:w-1/2 p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-1 text-blue-900">
          Quick Actions
        </h3>
        <p className="text-sm text-blue-700">
          <b>Welcome to Cross Creek!</b>
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200 cursor-pointer"
            >
              <span className="text-sm">{label}</span>
              <span className="text-xs font-semibold text-blue-700">Go</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Box 2: identical visual box, no links */}
      <motion.div
        layout
        variants={cardPop}
        className="w-full sm:w-1/2 p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-1 text-blue-900">
          Quick Actions
        </h3>
        <p className="text-sm text-blue-700">
          <b>Welcome to Cross Creek!</b>
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map(({ label }) => (
            <div
              key={label + "-copy"}
              className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200 cursor-pointer"
            >
              <span className="text-sm">{label}</span>
              <span className="text-xs font-semibold text-blue-700">Go</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

export default function Home() {
  const year = new Date().getFullYear();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollRange(document.body.scrollHeight - window.innerHeight);
  }, []);

  // Click outside to close calendar popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll-based background and header colors
  const background = useTransform(scrollY, [0, scrollRange], ["#ffffff", "#EEF4FA"]);
  const headerColor = useTransform(scrollY, [0, scrollRange], ["#1E3A8A", "#1E3F8A"]);

  // Texas today
  const now = new Date();
  const texasToday = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Chicago" })
  );
  texasToday.setHours(0, 0, 0, 0);

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
      details: "Meet local residents and join community discussions.",
    },
    {
      title: "Community Dinner",
      dateString: "2025-12-21T18:00:00",
      location: "Downtown Church",
      details: "Enjoy a free meal and fellowship with neighbors.",
    },
    {
      title: "Clothing Drive",
      dateString: "2025-12-22T10:00:00",
      location: "Westside Center",
      details: "Donate clothes for those in need and volunteer.",
    },
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i);
      d.setHours(0, 0, 0, 0);
      days.push(d);
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  return (
    <motion.div
      layoutRoot
      initial="hidden"
      animate="show"
      variants={container}
      style={{ background }}
      className="min-h-screen overflow-x-hidden text-slate-950"
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
            x: [20, 0, 20],
            y: [0, -6, 0],
            transition: { duration: 2.5, ease: "easeInOut" },
          }}
          style={{ color: headerColor, fontFamily: "TAN Buster, sans-serif" }}
          className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none text-center lg:text-left"
        >
          GATHERLY
        </motion.h1>
      </motion.header>

      {/* MAIN GRID */}
      <motion.main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
        {/* LEFT COLUMN */}
        <motion.section className="space-y-8 lg:col-span-1">
          <QuickActions />

          {/* Volunteer Opportunities */}
          <motion.div
            variants={cardPop}
            className="h-[350px] p-4 overflow-y-auto bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
          >
            <h3 className="text-lg font-semibold mb-3 text-blue-900">
              Incredible Eats Near You!
            </h3>
            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
                { title: "Neighborhood cleanup — Sun 10am", meta: "Riverside Park" },
                { title: "Food pantry helpers — Wed 4pm", meta: "Community Hall" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-3"
                >
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-blue-700">{item.meta}</div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>

        {/* RIGHT COLUMN - Calendar */}
        <motion.section className="lg:col-span-2">
          <motion.div
            ref={calendarRef}
            layout
            variants={cardPop}
            className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-4 sm:p-6 relative max-w-md ml-auto"
          >
            {/* Calendar Header */}
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

            {/* Days of the Week */}
            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} />;

                const isToday = date.getTime() === texasToday.getTime();
                const isSelected = date.getTime() === selectedDate?.getTime();

                const hasEvent = events.some((event) => {
                  const eDate = new Date(event.dateString);
                  return (
                    eDate.getFullYear() === date.getFullYear() &&
                    eDate.getMonth() === date.getMonth() &&
                    eDate.getDate() === date.getDate()
                  );
                });

                return (
                  <div
                    key={idx}
                    className={`relative flex flex-col items-center justify-start h-12 w-full rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-400 text-white"
                        : isToday
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-900"
                    }`}
                    onClick={() =>
                      setSelectedDate((prev) =>
                        prev && prev.getTime() === date.getTime() ? null : date
                      )
                    }
                  >
                    <span className="block">{date.getDate()}</span>
                    {hasEvent && (
                      <span className="block mt-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Events Popup */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 bg-white border border-blue-200 rounded-2xl shadow p-4 overflow-y-auto max-h-96"
                >
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Events on {selectedDate.toLocaleDateString()}
                  </h3>

                  {events.filter((event) => {
                    const eDate = new Date(event.dateString);
                    return (
                      eDate.getFullYear() === selectedDate.getFullYear() &&
                      eDate.getMonth() === selectedDate.getMonth() &&
                      eDate.getDate() === selectedDate.getDate()
                    );
                  }).length > 0 ? (
                    <ul className="space-y-3">
                      {events
                        .filter((event) => {
                          const eDate = new Date(event.dateString);
                          return (
                            eDate.getFullYear() === selectedDate.getFullYear() &&
                            eDate.getMonth() === selectedDate.getMonth() &&
                            eDate.getDate() === selectedDate.getDate()
                          );
                        })
                        .map((event, i) => (
                          <li key={i} className="border-l-4 border-blue-500 pl-3">
                            <p className="font-semibold text-blue-800">{event.title}</p>
                            <p className="text-xs text-blue-700">{event.location}</p>
                            <p className="text-xs text-blue-700">{event.details}</p>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <p className="text-blue-700 text-sm">No events for this day</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* IMAGE + TEXT SECTIONS */}
      <motion.section
        initial="hidden"
        variants={container}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-32 space-y-16"
      >
        {[
          {
            title: "Community Stories",
            text: "See how neighbors are making a difference together.",
            href: "/stories",
            align: "left",
          },
          {
            title: "Local Neighborhoods",
            text: "Explore different neighborhoods and what they offer.",
            href: "/neighborhoods",
            align: "right",
          },
          {
            title: "Get Involved",
            text: "Find ways to volunteer and support your community.",
            href: "/volunteer",
            align: "left",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className={`flex ${item.align === "right" ? "justify-end" : "justify-start"}`}
          >
            <Link href={item.href} className="block w-full md:w-[48%]">
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm overflow-hidden cursor-pointer"
              >
                <div className="h-52 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold">
                  Image Here
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold text-blue-900">{item.title}</h3>
                  <p className="text-sm text-blue-700">{item.text}</p>
                  <span className="inline-block mt-2 text-sm font-semibold text-blue-600">
                    Learn more →
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* OUR STORY */}
      <section className="w-full mt-40 mb-40 px-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 text-center mb-12">
          Our Story!
        </h2>

        <div className="w-full max-w-4xl mx-auto p-10 rounded-2xl shadow-lg text-blue-900 
                        bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border border-blue-200">
          <p className="mb-6">
            <span className="font-bold text-blue-700">2023 – The Idea:</span> The initial concept for Gatherly was formed to give communities a single place to connect.
          </p>
          <p className="mb-6">
            <span className="font-bold text-blue-700">2024 – Building the Platform:</span> Core layouts, animations, and interactive features were developed.
          </p>
          <p className="mb-6">
            <span className="font-bold text-blue-700">2025 – Public Launch:</span> Gatherly launched with events, calendars, and community tools.
          </p>
          <p>
            <span className="font-bold text-blue-700">Looking Ahead:</span> Expanding neighborhoods, stories, and ways for people to get involved.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-200 bg-white">
        <div className="text-center text-sm text-blue-700 py-4 bg-blue-50">
          © {year} Gatherly. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
}



