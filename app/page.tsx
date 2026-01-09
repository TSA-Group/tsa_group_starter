"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { QuickActions } from "./QuickActions";

/* ---------------- ANIMATIONS ---------------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ---------------- FLOATING ORBS ---------------- */
const ORBS = [
  { size: 120, color: "rgba(59,130,246,0.35)", top: 10, left: 15, speed: 0.2 },
  { size: 180, color: "rgba(147,197,253,0.25)", top: 40, left: 70, speed: 0.35 },
  { size: 80, color: "rgba(15,23,42,0.25)", top: 70, left: 25, speed: 0.15 },
  { size: 150, color: "rgba(147,197,253,0.15)", top: 20, left: 80, speed: 0.3 },
  { size: 100, color: "rgba(59,130,246,0.2)", top: 60, left: 50, speed: 0.25 },
];

/* ---------------- PAGE ---------------- */
export default function Home() {
  const year = new Date().getFullYear();
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  // Scroll-based colors
  const scrollRange = 2500; // adjust to your page length
  const baseBg = useTransform(scrollY, [0, scrollRange * 0.25, scrollRange], ["#ffffff", "#EEF3F9", "#E5E9EF"]);
  const greyOverlay = useTransform(scrollY, [scrollRange * 0.35, scrollRange * 0.6], ["rgba(226,232,240,0)", "rgba(203,213,225,0.65)"]);
  const blueOverlay = useTransform(scrollY, [scrollRange * 0.6, scrollRange], ["rgba(15,23,42,0)", "rgba(15,23,42,0.15)"]);

  // Hero parallax
  const heroY = useTransform(scrollY, [0, scrollRange * 0.5], [0, -120]);
  const heroTextY = useTransform(scrollY, [0, scrollRange * 0.5], [0, -60]);

  // Calendar helpers
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysOfWeek = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const generateCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i); d.setHours(0,0,0,0);
      days.push(d);
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  const events = [
    { title: "Neighborhood Meetup", dateString: "2025-12-21T14:00:00", location: "Community Park", details: "Meet local residents and join discussions." },
    { title: "Community Dinner", dateString: "2025-12-21T18:00:00", location: "Downtown Church", details: "Enjoy a free meal and fellowship." },
    { title: "Clothing Drive", dateString: "2025-12-22T10:00:00", location: "Westside Center", details: "Donate clothes for those in need." },
  ];

  return (
    <motion.div style={{ background: baseBg }} className="relative min-h-screen overflow-x-hidden text-slate-900">

      {/* FLOATING ORBS */}
      {ORBS.map((orb, i) => {
        const orbY = useTransform(scrollY, [0, scrollRange], [0, -200 * orb.speed]);
        const orbX = ((mousePos.x / window.innerWidth) - 0.5) * orb.speed * 200;
        const orbOffsetY = ((mousePos.y / window.innerHeight) - 0.5) * orb.speed * 200;
        return (
          <motion.div
            key={i}
            style={{
              top: `${orb.top}%`,
              left: `${orb.left}%`,
              y: orbY + orbOffsetY,
              x: orbX,
              width: orb.size,
              height: orb.size,
              backgroundColor: orb.color
            }}
            className="absolute rounded-full pointer-events-none -z-10"
          />
        )
      })}

      {/* COLOR OVERLAYS */}
      <motion.div style={{ backgroundColor: greyOverlay }} className="fixed inset-0 pointer-events-none -z-20"/>
      <motion.div style={{ backgroundColor: blueOverlay }} className="fixed inset-0 pointer-events-none -z-20"/>

      {/* HERO */}
      <motion.header style={{ y: heroY }} className="min-h-[95vh] flex flex-col justify-center max-w-7xl mx-auto px-6">
        <motion.h1 style={{ y: heroTextY }} animate={{ scale: [1,1.03,1] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="text-8xl sm:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600">
          GATHERLY
        </motion.h1>
        <motion.p style={{ y: heroTextY }} className="mt-10 max-w-xl text-xl text-blue-800">
          Discover, connect, and engage with your real community — without the noise.
        </motion.p>
      </motion.header>

      {/* CALENDAR + QUICK ACTIONS */}
      <motion.main className="max-w-7xl mx-auto px-6 pb-72 flex flex-col lg:flex-row gap-20">
        <motion.section style={{ y: heroTextY }} className="lg:w-1/3">
          <QuickActions />
        </motion.section>

        <motion.section className="lg:w-2/3">
          <motion.div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_40px_80px_-30px_rgba(30,64,175,0.45)] p-6">
            <div className="flex justify-between mb-4">
              <button onClick={() => setCalendarDate(new Date(calYear, calMonth - 1, 1))}>❮</button>
              <h3 className="font-semibold">{monthNames[calMonth]} {calYear}</h3>
              <button onClick={() => setCalendarDate(new Date(calYear, calMonth + 1, 1))}>❯</button>
            </div>

            <div className="grid grid-cols-7 text-center text-sm font-medium text-blue-700 mb-2">
              {daysOfWeek.map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date,i)=>{
                if(!date) return <div key={i}/>;
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.getTime() === selectedDate?.getTime();
                const hasEvent = events.some(e => new Date(e.dateString).toDateString() === date.toDateString());
                return (
                  <div key={i} className={`relative flex flex-col items-center justify-start h-12 w-full rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-colors ${isSelected?"bg-blue-400 text-white":isToday?"bg-blue-600 text-white":"bg-blue-50 hover:bg-blue-100 text-blue-900"}`} onClick={()=>setSelectedDate(prev => (prev?.getTime() === date.getTime()?null:date))}>
                    <span>{date.getDate()}</span>
                    {hasEvent && <span className="block mt-1 w-2 h-2 bg-blue-500 rounded-full"/>}
                  </div>
                )
              })}
            </div>

            <AnimatePresence>
              {selectedDate && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="mt-4 bg-white border border-blue-200 rounded-2xl shadow p-4 overflow-y-auto max-h-96">
                  <h3 className="font-semibold text-blue-900 mb-2">Events on {selectedDate.toLocaleDateString()}</h3>
                  {events.filter(e=>new Date(e.dateString).toDateString()===selectedDate.toDateString()).map((event,i)=>(
                    <div key={i} className="border-l-4 border-blue-500 pl-3 mb-2">
                      <p className="font-semibold text-blue-800">{event.title}</p>
                      <p className="text-xs text-blue-700">{event.location}</p>
                      <p className="text-xs text-blue-700">{event.details}</p>
                    </div>
                  ))}
                  {events.filter(e=>new Date(e.dateString).toDateString()===selectedDate.toDateString()).length===0 && <p className="text-blue-700 text-sm">No events for this day</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* SECTIONS, CARDS & IMAGES */}
      <section className="py-24 px-6 space-y-24">
        {Array.from({length:6}).map((_,i)=>(
          <motion.div key={i} variants={fadeUp} viewport={{once:true}} className="max-w-4xl mx-auto p-10 bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-1/2 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center text-blue-700 font-semibold">
              Image {i+1}
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">Section Title {i+1}</h3>
              <p className="text-blue-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imperdiet, nulla et dictum interdum, nisi lorem egestas odio.</p>
            </div>
          </motion.div>
        ))}
      </section>

      <footer className="py-8 text-center text-sm text-slate-700 bg-slate-100">© {year} Gatherly. All rights reserved.</footer>

    </motion.div>
  );
}




