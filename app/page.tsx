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

// QuickActions component
const actions = [
  { label: "Visit Our Map", href: "/map" },
  { label: "Contact Us", href: "/contact" },
];

function QuickActions() {
  return (
    <motion.section layout variants={fadeUp} className="space-y-8">
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
          {actions.map(({ label, href }) => (
            <Link key={label} href={href} className="block">
              <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200 cursor-pointer">
                <span className="text-sm">{label}</span>
                <span className="text-xs font-semibold text-blue-700">Go</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}

export default function Home() {
  const year = new Date().getFullYear();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [openEvent, setOpenEvent] = useState<number | null>(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setScrollRange(document.body.scrollHeight - window.innerHeight);
  }, []);

  // Click outside to close calendar popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Subtle scroll background & header color
  const background = useTransform(scrollY, [0, scrollRange], ["#ffffff", "#EEF4FA"]);
  const headerColor = useTransform(scrollY, [0, scrollRange], ["#1E3A8A", "#1E3F8A"]);

  // Texas time today
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

  // Events with dateString for calendar
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
    const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysArray: (Date | null)[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i);
      d.setHours(0, 0, 0, 0);
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
            x: [-20, 0, -20],
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

        {/* RIGHT COLUMN */}
        <motion.section className="lg:col-span-2 flex flex-col lg:flex-row gap-6">
          {/* EVENTS */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <motion.div
              variants={cardPop}
              className="p-6 bg-white rounded-2xl border-l-4 border-blue-500 border-blue-200 shadow-sm text-center"
            >
              <h2 className="text-2xl font-semibold text-blue-900">
                Upcoming Events
              </h2>
            </motion.div>

            {events.map((event, i) => (
              <motion.div
                key={i}
                variants={cardPop}
                className="bg-white rounded-2xl border border-blue-200 p-4 cursor-pointer"
                onClick={() => setOpenEvent(openEvent === i ? null : i)}
              >
                <h3 className="font-semibold text-blue-900">{event.title}</h3>
                <p className="text-sm text-blue-700">
                  {new Date(event.dateString).toLocaleString()} • {event.location}
                </p>

                <AnimatePresence>
                  {openEvent === i && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-blue-800 mt-2"
                    >
                      {event.details}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CALENDAR WITH TOGGLE + CLICK-OUTSIDE */}
          <motion.div
            ref={calendarRef}
            layout
            variants={cardPop}
            className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-4 sm:p-6 lg:w-1/2 relative"
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

            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-1">
              {daysOfWeek.map((d) => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, idx) => {
                if (!date) return <div key={idx} />;

                const isToday = date.getTime() === texasToday.getTime();
                const isSelected = date.getTime() === selectedDate?.getTime();

                const dayEvents = events.filter(event => {
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
                    className={`relative flex items-center justify-center h-12 sm:h-14 w-full rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-400 text-white"
                        : isToday
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-900"
                    }`}
                    onClick={() =>
                      setSelectedDate(prev =>
                        prev && prev.getTime() === date.getTime() ? null : date
                      )
                    }
                  >
                    {date.getDate()}

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 w-60 bg-white border border-blue-200 rounded-lg shadow-lg p-3 text-sm text-blue-900"
                        >
                          <p className="font-semibold mb-1">
                            {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
                          </p>

                          {dayEvents.length > 0 ? (
                            <ul className="space-y-2">
                              {dayEvents.map((event, i) => (
                                <li key={i} className="border-l-4 border-blue-500 pl-2">
                                  <p className="font-semibold text-blue-800">{event.title}</p>
                                  <p className="text-xs text-blue-700">{event.location}</p>
                                  <p className="text-xs text-blue-700">{event.details}</p>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-blue-700">No events for this day</p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* IMAGE + TEXT BOXES (ALTERNATING + SCROLL ANIMATION) */}
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
      {/* WEBSITE HISTORY SECTION */}
      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={container}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40 mb-56 space-y-16"
      >
        {/* History Boxes */}
        <div className="grid grid-cols-2 gap-8">
          {[
            {
              year: "2023",
              title: "Concept & Vision",
              text: "Gatherly was envisioned as a digital space to help neighbors connect, share events, and build stronger communities."
            },
            {
              year: "2024",
              title: "Design & Prototyping",
              text: "Layouts, animations, and core components were designed with accessibility and clarity in mind."
            },
            {
              year: "Early 2025",
              title: "Feature Expansion",
              text: "Calendars, events, volunteer listings, and interactive elements were added."
            },
            {
              year: "Present",
              title: "Community Growth",
              text: "Gatherly continues to evolve based on real community needs and feedback."
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={cardPop}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm p-6"
            >
              <p className="text-sm font-semibold text-blue-700">{item.year}</p>
              <h3 className="text-xl font-semibold text-blue-900 mt-1">
                {item.title}
              </h3>
              <p className="text-sm text-blue-700 mt-3">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      
        {/* Extra Length Spacer */}
        <div className="h-40" />
      </motion.section>

      {/* FOOTER */}
      <footer className="border-t border-blue-200 bg-white">
        <div className="text-center text-sm text-blue-700 py-4 bg-blue-50">
          © {year} Gatherly. All rights reserved.
        </div>
      </footer>
    </motion.div>
  );
}

