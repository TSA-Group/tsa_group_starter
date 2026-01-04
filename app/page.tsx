"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Variants, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

// Full Calendar Component
const CommunityCalendar = () => {
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const scrollRange = 300;
  const background = useTransform(scrollY, [0, scrollRange], ["#ffffff", "#EEF4FA"]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  const events = [
    { title: "Neighborhood Meetup", dateString: "2025-12-21T14:00:00", category: "meetup", location: "Downtown Park", details: "Bring snacks and games!" },
    { title: "Community Dinner", dateString: "2025-12-21T18:00:00", category: "community", location: "Community Hall", details: "Potluck style, all welcome." },
    { title: "Clothing Drive", dateString: "2025-12-22T10:00:00", category: "clothing", location: "Westside Center", details: "Drop off donations 9am-3pm." },
  ];

  const categoryGradients: Record<string, string> = {
    meetup: "bg-gradient-to-tr from-green-400 to-green-600",
    community: "bg-gradient-to-tr from-blue-400 to-blue-600",
    clothing: "bg-gradient-to-tr from-orange-400 to-orange-600",
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const generateCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i);
      d.setHours(0,0,0,0);
      days.push(d);
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  const today = new Date();
  today.setHours(0,0,0,0);

  return (
    <motion.div ref={calendarRef} style={{ background }} className="p-6 rounded-2xl border border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Community Calendar</h2>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">◀</button>
        <span className="font-semibold text-lg">{monthNames[calMonth]} {calYear}</span>
        <button onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">▶</button>
      </div>

      <div className="grid grid-cols-7 text-center font-semibold text-gray-700 mb-1">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx} className="h-12 sm:h-14" />;

          const isToday = day.getTime() === today.getTime();
          const isSelected = day.getTime() === selectedDate?.getTime();
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;
          const dayEvents = events.filter(e => new Date(e.dateString).toDateString() === day.toDateString());

          const bgClass = isSelected
            ? "bg-blue-400 text-white font-bold"
            : isToday
            ? "bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 text-white font-bold shadow-lg"
            : isWeekend
            ? "bg-purple-100 hover:bg-purple-200 text-purple-900"
            : "bg-blue-50 hover:bg-blue-100 text-blue-900";

          return (
            <div
              key={idx}
              className={`relative flex flex-col items-center justify-center h-12 sm:h-14 w-full rounded-lg cursor-pointer font-semibold transition-all ${bgClass}`}
              onClick={() => setSelectedDate(prev => prev && prev.getTime() === day.getTime() ? null : day)}
            >
              <span>{day.getDate()}</span>
              <div className="flex flex-col -mt-1">
                {dayEvents.map((e,i) => (
                  <span key={i} className={`w-2 h-2 rounded-full mx-auto mt-0.5 ${categoryGradients[e.category]}`}></span>
                ))}
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 w-64 bg-white border rounded-lg shadow-lg p-3 text-sm text-blue-900"
                  >
                    <p className="font-semibold mb-1">
                      {monthNames[day.getMonth()]} {day.getDate()}, {day.getFullYear()}
                    </p>

                    {dayEvents.length > 0 ? (
                      <ul className="space-y-2">
                        {dayEvents.map((event,i) => (
                          <li key={i} className={`border-l-4 pl-2 ${categoryGradients[event.category]} border-opacity-50`}>
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
  );
};

// MAIN HOME COMPONENT
export default function Home() {
  const [openEvent, setOpenEvent] = useState<number | null>(null);
  const year = new Date().getFullYear();
  const headerColor = "#1E3A8A";

  const events = [
    { title: "Neighborhood Meetup", dateString: "2025-12-21T14:00:00", location: "Downtown Park", details: "Bring snacks and games!" },
    { title: "Community Dinner", dateString: "2025-12-21T18:00:00", location: "Community Hall", details: "Potluck style, all welcome." },
    { title: "Clothing Drive", dateString: "2025-12-22T10:00:00", location: "Westside Center", details: "Drop off donations 9am-3pm." },
  ];

  return (
    <motion.div initial="hidden" animate="show" className="bg-white">
      {/* HEADER */}
      <motion.header layout variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
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
          <motion.div variants={cardPop} className="h-[350px] p-4 overflow-y-auto bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Volunteer Opportunities</h3>
            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
                { title: "Neighborhood cleanup — Sun 10am", meta: "Riverside Park" },
                { title: "Food pantry helpers — Wed 4pm", meta: "Community Hall" },
              ].map((item, i) => (
                <li key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
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
            <motion.div variants={cardPop} className="p-6 bg-white rounded-2xl border-l-4 border-blue-500 border-blue-200 shadow-sm text-center">
              <h2 className="text-2xl font-semibold text-blue-900">Upcoming Events</h2>
            </motion.div>

            {events.map((event, i) => (
              <motion.div
                key={i}
                variants={cardPop}
                className="bg-white rounded-2xl border border-blue-200 p-4 cursor-pointer"
                onClick={() => setOpenEvent(openEvent === i ? null : i)}
              >
                <h3 className="font-semibold text-blue-900">{event.title}</h3>
                <p className="text-sm text-blue-700">{new Date(event.dateString).toLocaleString()} • {event.location}</p>

                <AnimatePresence>
                  {openEvent === i && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-blue-800 mt-2">
                      {event.details}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* CALENDAR */}
          <div className="lg:w-1/2">
            <CommunityCalendar />
          </div>
        </motion.section>
      </motion.main>

      {/* IMAGE + TEXT BOXES */}
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
      <section className="relative w-full mt-40 mb-32 px-6">
        {/* Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 text-center mb-16">
          Our Story
        </h2>

        <div className="w-full max-w-4xl mx-auto p-10 rounded-2xl shadow-xl
                        bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50
                        border border-blue-200">

          {/* Timeline Items */}
          <div className="relative pl-8 border-l-2 border-blue-300 mb-10">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500" />
            <p className="text-lg text-blue-900">
              <span className="font-bold text-blue-700">2023 — The Idea:</span>{" "}
              Gatherly began as a simple idea to give communities one shared place to connect.
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-blue-300 mb-10">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500" />
            <p className="text-lg text-blue-900">
              <span className="font-bold text-blue-700">2024 — Building the Platform:</span>{" "}
              Layouts, animations, and interactive tools were designed to feel modern and welcoming.
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-blue-300 mb-10">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500" />
            <p className="text-lg text-blue-900">
              <span className="font-bold text-blue-700">2025 — Public Launch:</span>{" "}
              Gatherly launched with events, calendars, and community-driven features.
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-blue-300">
            <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-500" />
            <p className="text-lg text-blue-900">
              <span className="font-bold text-indigo-700">Looking Ahead:</span>{" "}
              We’re expanding neighborhoods, stories, and opportunities for people to get involved.
            </p>
          </div>
        </div>
      </section>

      {/* SPACER */}
      <div className="flex justify-center my-28">
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
      </div>

      {/* OUR MISSION SECTION */}
      <section className="relative w-full mb-40 px-6">
        {/* Glow */}
        <div className="absolute inset-0 -z-10 flex justify-center">
          <div className="h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 text-center mb-16">
          Our Mission
        </h2>

        <div className="w-full max-w-4xl mx-auto p-10 rounded-2xl shadow-xl
                        bg-gradient-to-br from-indigo-50 via-indigo-100 to-indigo-50
                        border border-indigo-200">

          <p className="text-lg text-center text-slate-700 mb-12 max-w-3xl mx-auto">
            Our mission is to strengthen communities by making it easy for people to
            connect, discover local events, and feel a true sense of belonging.
          </p>

          <div className="grid gap-10 sm:grid-cols-3 text-center">
            <div>
              <h3 className="text-xl font-bold text-indigo-700 mb-2">Connect</h3>
              <p className="text-slate-700">Bringing neighbors together through shared experiences.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-indigo-700 mb-2">Discover</h3>
              <p className="text-slate-700">Making local events simple to find and join.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-indigo-700 mb-2">Belong</h3>
              <p className="text-slate-700">Creating welcoming spaces where everyone feels included.</p>
            </div>
          </div>
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


