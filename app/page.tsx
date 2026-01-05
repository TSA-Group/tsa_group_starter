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

/* ---------------- ANIMATIONS ---------------- */
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

/* ---------------- QUICK ACTIONS ---------------- */
const actions = [
  { label: "Visit Our Map", href: "/map" },
  { label: "Contact Us", href: "/contact" },
];

function QuickActions() {
  return (
    <motion.section variants={fadeUp}>
      <motion.div
        variants={cardPop}
        className="p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-1 text-blue-900">
          Quick Actions
        </h3>
        <p className="text-sm text-blue-700">
          <b>Welcome to Cross Creek!</b>
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map(({ label, href }) => (
            <Link key={label} href={href}>
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

/* ======================= HOME ======================= */
export default function Home() {
  const year = new Date().getFullYear();

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [openEvent, setOpenEvent] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const calendarRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    setScrollRange(document.body.scrollHeight - window.innerHeight);
  }, []);

  /* ---- Click outside calendar ---- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const background = useTransform(scrollY, [0, scrollRange], ["#ffffff", "#EEF4FA"]);
  const headerColor = useTransform(scrollY, [0, scrollRange], ["#1E3A8A", "#1E3F8A"]);

  /* ---- Today ---- */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ---- Events (single source of truth) ---- */
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

  /* ---- Synced Event Logic ---- */
  const filteredEvents = selectedDate
    ? events.filter(e => {
        const d = new Date(e.dateString);
        return d.toDateString() === selectedDate.toDateString();
      })
    : events
        .filter(e => new Date(e.dateString) >= today)
        .sort(
          (a, b) =>
            new Date(a.dateString).getTime() -
            new Date(b.dateString).getTime()
        );

  /* ---- Calendar Setup ---- */
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

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
      initial="hidden"
      animate="show"
      variants={container}
      style={{ background }}
      className="min-h-screen"
    >
      {/* HEADER */}
      <motion.header variants={fadeUp} className="max-w-7xl mx-auto px-6 pt-12">
        <motion.h1
          variants={cardPop}
          style={{ color: headerColor, fontFamily: "TAN Buster, sans-serif" }}
          className="text-7xl font-extrabold"
        >
          GATHERLY
        </motion.h1>
      </motion.header>

      {/* MAIN */}
      <motion.main className="max-w-7xl mx-auto px-6 pb-32 grid lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <QuickActions />
        </div>

        <div className="lg:col-span-2 flex gap-6 flex-col lg:flex-row">
          {/* EVENTS */}
          <div ref={eventsRef} className="lg:w-1/2 space-y-4">
            <motion.div variants={cardPop} className="p-6 bg-white rounded-2xl border">
              <h2 className="text-2xl font-semibold text-blue-900">
                {selectedDate
                  ? `Events on ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`
                  : "Upcoming Events"}
              </h2>
            </motion.div>

            {filteredEvents.length === 0 ? (
              <p className="text-center text-blue-700 py-6">
                No events for this day
              </p>
            ) : (
              filteredEvents.map((event, i) => (
                <motion.div
                  key={i}
                  variants={cardPop}
                  className="bg-white rounded-2xl border p-4 cursor-pointer"
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
                        className="text-sm mt-2 text-blue-800"
                      >
                        {event.details}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>

          {/* CALENDAR */}
          <motion.div
            ref={calendarRef}
            variants={cardPop}
            className="lg:w-1/2 bg-white rounded-2xl border p-6"
          >
            <div className="flex justify-between mb-4">
              <button onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}>❮</button>
              <h3 className="font-semibold">
                {monthNames[calMonth]} {calYear}
              </h3>
              <button onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}>❯</button>
            </div>

            <div className="grid grid-cols-7 text-sm mb-2">
              {daysOfWeek.map(d => (
                <div key={d} className="text-center">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date, i) => {
                if (!date) return <div key={i} />;

                const dayEvents = events.filter(e =>
                  new Date(e.dateString).toDateString() === date.toDateString()
                );

                return (
                  <div
                    key={i}
                    onClick={() => {
                      setSelectedDate(prev =>
                        prev?.getTime() === date.getTime() ? null : date
                      );
                      eventsRef.current?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`relative h-12 flex items-center justify-center rounded-lg cursor-pointer ${
                      selectedDate?.getTime() === date.getTime()
                        ? "bg-blue-500 text-white"
                        : "bg-blue-50"
                    }`}
                  >
                    {date.getDate()}
                    {dayEvents.length > 0 && (
                      <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* IMAGE + TEXT SECTIONS */}
      <motion.section className="max-w-7xl mx-auto px-6 mt-24 space-y-16">
        {[
          { title: "Community Stories", text: "See how neighbors make a difference.", href: "/stories" },
          { title: "Local Neighborhoods", text: "Explore nearby communities.", href: "/neighborhoods" },
          { title: "Get Involved", text: "Volunteer and support locally.", href: "/volunteer" },
        ].map((item, i) => (
          <motion.div key={i} variants={fadeUp}>
            <Link href={item.href}>
              <div className="bg-white rounded-2xl border p-6 cursor-pointer">
                <h3 className="text-lg font-semibold text-blue-900">{item.title}</h3>
                <p className="text-sm text-blue-700">{item.text}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.section>

      {/* OUR STORY */}
      <section className="max-w-4xl mx-auto my-32 p-10 bg-blue-50 rounded-2xl border">
        <h2 className="text-4xl font-bold text-blue-900 mb-6 text-center">
          Our Story
        </h2>
        <p className="mb-4"><b>2023:</b> Idea formed</p>
        <p className="mb-4"><b>2024:</b> Platform built</p>
        <p><b>2025:</b> Public launch</p>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-4 bg-blue-50 text-blue-700">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}

