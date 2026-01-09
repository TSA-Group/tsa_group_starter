"use client";


import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion";
import Link from "next/link";
import { QuickActions } from "./QuickActions";

/* ---------------- ORB CONFIG ---------------- */
const ORBS = [
  { size: 120, color: "rgba(59,130,246,0.35)", top: 10, left: 15, speed: 0.2 },
  { size: 180, color: "rgba(147,197,253,0.25)", top: 40, left: 70, speed: 0.35 },
  { size: 80, color: "rgba(15,23,42,0.25)", top: 70, left: 25, speed: 0.15 },
  { size: 150, color: "rgba(147,197,253,0.15)", top: 20, left: 80, speed: 0.3 },
  { size: 100, color: "rgba(59,130,246,0.2)", top: 60, left: 50, speed: 0.25 },
];

/* ---------------- VARIANTS ---------------- */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
};

const cardPop = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

/* ---------------- MAIN PAGE ---------------- */
export default function Home() {
  const year = new Date().getFullYear();
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const orbX = ORBS.map(() => useMotionValue(0));
  const orbY = ORBS.map(() => useMotionValue(0));

  /* ---------------- MOUSE ---------------- */
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  /* ---------------- SCROLL RANGE ---------------- */
  useEffect(() => {
    setScrollRange(document.body.scrollHeight - window.innerHeight);
    return scrollY.onChange((y) => {
      ORBS.forEach((orb, i) => {
        orbY[i].set(
          -200 * orb.speed * (y / (document.body.scrollHeight - window.innerHeight)) +
          ((mousePos.y / window.innerHeight - 0.5) * 200 * orb.speed)
        );
        orbX[i].set((mousePos.x / window.innerWidth - 0.5) * 200 * orb.speed);
      });
    });
  }, [scrollY, mousePos]);

  /* ---------------- CLICK OUTSIDE CALENDAR ---------------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setSelectedDate(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- BACKGROUND ---------------- */
  const background = useTransform(scrollY, [0, scrollRange * 0.3, scrollRange], ["#ffffff", "#EEF4FA", "#E5E9EF"]);
  const greyOverlay = useTransform(scrollY, [scrollRange * 0.3, scrollRange * 0.6], ["rgba(226,232,240,0)", "rgba(203,213,225,0.65)"]);
  const blueOverlay = useTransform(scrollY, [scrollRange * 0.6, scrollRange], ["rgba(15,23,42,0)", "rgba(15,23,42,0.15)"]);

  /* ---------------- HERO PARALLAX ---------------- */
  const heroY = useTransform(scrollY, [0, scrollRange * 0.5], [0, -120]);
  const heroTextY = useTransform(scrollY, [0, scrollRange * 0.5], [0, -60]);
  const heroScale = useTransform(scrollY, [0, scrollRange * 0.5], [1, 1.05]);

  /* ---------------- CALENDAR ---------------- */
  const now = new Date();
  const texasToday = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  texasToday.setHours(0, 0, 0, 0);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const events = [
    { title:"Neighborhood Meetup", dateString:"2025-12-21T14:00:00", location:"Community Park", details:"Meet local residents and join community discussions." },
    { title:"Community Dinner", dateString:"2025-12-21T18:00:00", location:"Downtown Church", details:"Enjoy a free meal and fellowship with neighbors." },
    { title:"Clothing Drive", dateString:"2025-12-22T10:00:00", location:"Westside Center", details:"Donate clothes for those in need and volunteer." },
  ];

  const generateCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days:(Date|null)[] = [];
    for(let i=0;i<firstDay;i++) days.push(null);
    for(let i=1;i<=daysInMonth;i++){
      const d = new Date(calYear, calMonth, i);
      d.setHours(0,0,0,0);
      days.push(d);
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  return (
    <motion.div layoutRoot initial="hidden" animate="show" variants={container} style={{background}} className="min-h-screen overflow-x-hidden text-slate-950">

      {/* FLOATING ORBS */}
      {ORBS.map((orb,i)=>(
        <motion.div key={i} style={{x: orbX[i], y: orbY[i], width:orb.size, height:orb.size, top:`${orb.top}%`, left:`${orb.left}%`, backgroundColor:orb.color}} className="absolute rounded-full pointer-events-none -z-10 blur-xl"/>
      ))}

      {/* OVERLAYS */}
      <motion.div style={{backgroundColor:greyOverlay}} className="fixed inset-0 pointer-events-none -z-20"/>
      <motion.div style={{backgroundColor:blueOverlay}} className="fixed inset-0 pointer-events-none -z-20"/>

      {/* HERO */}
      <motion.header style={{y:heroY, scale:heroScale}} className="min-h-[95vh] relative flex flex-col justify-center max-w-7xl mx-auto px-6">
        <div className="absolute -top-20 left-0 w-full h-[70vh] bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 rounded-b-[80px] shadow-lg -z-10"/>
        <motion.h1 style={{y:heroTextY}} animate={{scale:[1,1.03,1]}} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}} className="text-8xl sm:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600 text-center">
          GATHERLY
        </motion.h1>
        <motion.p style={{y:heroTextY}} className="mt-10 max-w-xl text-xl text-blue-800 text-center mx-auto">
          Discover, connect, and engage with your real community — without the noise.
        </motion.p>
      </motion.header>

      {/* QUICKACTIONS + CALENDAR */}
      <motion.main className="max-w-7xl mx-auto px-6 pb-32 flex flex-col lg:flex-row gap-10 lg:gap-14 mt-24">
        <motion.section initial={{opacity:0,x:-50}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.8}} className="lg:w-1/3 flex flex-col justify-end">
          <QuickActions/>
        </motion.section>

        <motion.section initial={{opacity:0,x:50}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{duration:0.8}} className="lg:w-2/3 flex flex-col justify-end">
          <motion.div ref={calendarRef} layout variants={cardPop} className="bg-white rounded-3xl border border-blue-200 shadow-lg p-6">
            {/* CALENDAR HEADER */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={()=>setCalendarDate(new Date(calYear, calMonth-1,1))} className="text-blue-700 text-2xl font-bold">❮</button>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900">{monthNames[calMonth]} {calYear}</h3>
              <button onClick={()=>setCalendarDate(new Date(calYear, calMonth+1,1))} className="text-blue-700 text-2xl font-bold">❯</button>
            </div>

            {/* DAYS OF WEEK */}
            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-1">
              {daysOfWeek.map((d)=> <div key={d} className="text-center">{d}</div>)}
            </div>

            {/* CALENDAR GRID WITH ANIMATED DAYS */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date,idx)=>{
                if(!date) return <div key={idx}/>;
                const isToday = date.getTime()===texasToday.getTime();
                const isSelected = date.getTime()===selectedDate?.getTime();
                const hasEvent = events.some(event=>{
                  const eDate = new Date(event.dateString);
                  return eDate.getFullYear()===date.getFullYear() && eDate.getMonth()===date.getMonth() && eDate.getDate()===date.getDate();
                });
                return (
                  <motion.div key={idx} initial={{opacity:0, y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.3,delay:(idx%7)*0.05}} className={`relative flex flex-col items-center justify-start h-12 w-full rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-400 text-white" : isToday ? "bg-blue-600 text-white" : "bg-blue-50 hover:bg-blue-100 text-blue-900"
                  }`} onClick={()=>setSelectedDate(prev=>prev && prev.getTime()===date.getTime()?null:date)}>
                    <span className="block">{date.getDate()}</span>
                    {hasEvent && <motion.span layoutId={`dot-${idx}`} className="block mt-1 w-2 h-2 bg-blue-500 rounded-full"/>}
                  </motion.div>
                );
              })}
            </div>

            {/* EVENTS POPUP */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}} className="mt-4 bg-white border border-blue-200 rounded-2xl shadow p-4 overflow-y-auto max-h-96">
                  <h3 className="font-semibold text-blue-900 mb-2">Events on {selectedDate.toLocaleDateString()}</h3>
                  {events.filter(event=>{
                    const eDate = new Date(event.dateString);
                    return eDate.getFullYear()===selectedDate.getFullYear() && eDate.getMonth()===selectedDate.getMonth() && eDate.getDate()===selectedDate.getDate();
                  }).length>0 ? (
                    <ul className="space-y-3">
                      {events.filter(event=>{
                        const eDate = new Date(event.dateString);
                        return eDate.getFullYear()===selectedDate.getFullYear() && eDate.getMonth()===selectedDate.getMonth() && eDate.getDate()===selectedDate.getDate();
                      }).map((event,i)=>(
                        <motion.li key={i} whileHover={{scale:1.02}} className="border-l-4 border-blue-500 pl-3 cursor-pointer transition-transform">
                          <p className="font-semibold text-blue-800">{event.title}</p>
                          <p className="text-xs text-blue-700">{event.location}</p>
                          <p className="text-xs text-blue-700">{event.details}</p>
                        </motion.li>
                      ))}
                    </ul>
                  ) : <p className="text-blue-700 text-sm">No events for this day</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* ---------- CONTENT SECTIONS + CURVED DIVIDERS ---------- */}
      {[...Array(8)].map((_,i)=>{
        const align = i%2===0?"left":"right";
        return (
          <React.Fragment key={i}>
            <motion.section initial="hidden" variants={container} className={`max-w-7xl mx-auto px-6 my-24`}>
              <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{once:true,margin:"-100px"}} className={`flex ${align==="right"?"justify-end":"justify-start"}`}>
                <Link href="#" className="block w-full md:w-[48%]">
                  <motion.div whileHover={{y:-8,scale:1.02}} transition={{type:"spring",stiffness:260,damping:18}} className="bg-white rounded-3xl border border-blue-200 shadow-lg overflow-hidden cursor-pointer">
                    <div className="h-52 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-semibold">Image {i+1}</div>
                    <div className="p-5 space-y-2">
                      <h3 className="text-lg font-semibold text-blue-900">Section Title {i+1}</h3>
                      <p className="text-sm text-blue-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti.</p>
                      <span className="inline-block mt-2 text-sm font-semibold text-blue-600">Learn more →</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.section>
            {/* SVG CURVED DIVIDER */}
            <div className="-mt-16">
              <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-20">
                <path d="M0,0 C480,120 960,0 1440,120 L1440,0 L0,0 Z" fill="rgba(229,233,239,0.3)"/>
              </svg>
            </div>
          </React.Fragment>
        );
      })}

      {/* OUR STORY */}
      <section className="w-full mt-40 mb-40 px-6">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-blue-900 text-center mb-12">Our Story!</h2>
        <div className="w-full max-w-4xl mx-auto p-10 rounded-3xl shadow-lg text-blue-900 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border border-blue-200">
          <p className="mb-6"><span className="font-bold text-blue-700">2023 – The Idea:</span> The initial concept for Gatherly was formed to give communities a single place to connect.</p>
          <p className="mb-6"><span className="font-bold text-blue-700">2024 – Building the Platform:</span> Core layouts, animations, and interactive features were developed.</p>
          <p className="mb-6"><span className="font-bold text-blue-700">2025 – Public Launch:</span> Gatherly launched with events, calendars, and community tools.</p>
          <p><span className="font-bold text-blue-700">Looking Ahead:</span> Expanding neighborhoods, stories, and ways for people to get involved.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-blue-200 bg-white py-4 text-center text-sm text-blue-700 bg-blue-50 rounded-t-3xl">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}





