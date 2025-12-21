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
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: "easeOut" } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

// QuickActions component
const actions = [
  { label: "Visit Our Map", href: "/map" },
  { label: "Contact Us", href: "/contact" },
];

function QuickActions() {
  return (
    <motion.section layout variants={fadeUp} className="space-y-8">
      <motion.div layout variants={cardPop} className="p-5 bg-white rounded-2xl border border-blue-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-1 text-blue-900">Quick Actions</h3>
        <p className="text-sm text-blue-700">Easy Access To Our Valuable Community Resources</p>
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const [scrollRange, setScrollRange] = useState(0);

  // Scroll background
  const background = useTransform(scrollY, [0, scrollRange], ["#ffffff", "#EEF4FA"]);
  const headerColor = useTransform(scrollY, [0, scrollRange], ["#1E3A8A", "#1E3F8A"]);

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

  const now = new Date();
  const texasToday = new Date(now.toLocaleString("en-US", { timeZone: "America/Chicago" }));
  texasToday.setHours(0, 0, 0, 0);

  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  // Upcoming Events
  const upcomingEvents = [
    { title: "Neighborhood Meetup", dateString: "2025-12-21T14:00:00", location: "Community Park", details: "Meet local residents and join community discussions." },
    { title: "Community Dinner", dateString: "2025-12-21T18:00:00", location: "Downtown Church", details: "Enjoy a free meal and fellowship with neighbors." },
    { title: "Clothing Drive", dateString: "2025-12-22T10:00:00", location: "Westside Center", details: "Donate clothes for those in need and volunteer." },
  ];

  // Calendar-only events
  const calendarEvents = [
    { title: "Holiday Market", dateString: "2025-12-23T12:00:00", location: "Main Street Plaza", details: "Shop local vendors and enjoy festive treats." },
    { title: "Special Workshop", dateString: "2025-12-24T10:00:00", location: "Library Hall", details: "Learn crafts with the community." },
  ];

  const generateCalendarDays = () => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysArray: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) daysArray.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(calYear, calMonth, i);
      d.setHours(0,0,0,0);
      daysArray.push(d);
    }
    return daysArray;
  };
  const calendarDays = generateCalendarDays();

  const pictureBoxes = [
    { image: "/images/pic1.jpg", text: "Community Gathering" },
    { image: "/images/pic2.jpg", text: "Volunteer Day" },
    { image: "/images/pic3.jpg", text: "Neighborhood Event" },
  ];

  return (
    <motion.div layoutRoot initial="hidden" animate="show" variants={container} style={{ background }} className="min-h-screen overflow-x-hidden text-slate-950">
      {/* HEADER */}
      <motion.header layout variants={fadeUp} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
        <motion.h1 layout variants={cardPop} animate={{ x: [-20,0,-20], y:[0,-6,0], transition:{duration:2.5, ease:"easeInOut"} }} style={{ color: headerColor, fontFamily:"TAN Buster, sans-serif" }} className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-center lg:text-left">GATHERLY</motion.h1>
      </motion.header>

      {/* MAIN GRID */}
      <motion.main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

        {/* LEFT COLUMN */}
        <motion.section className="space-y-8 lg:col-span-1">
          <QuickActions />

          {/* Volunteer Opportunities */}
          <motion.div variants={cardPop} className="h-[350px] p-4 overflow-y-auto bg-white rounded-2xl border border-blue-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Volunteer Opportunities</h3>
            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
                { title: "Neighborhood cleanup — Sun 10am", meta: "Riverside Park" },
                { title: "Food pantry helpers — Wed 4pm", meta: "Community Hall" },
              ].map((item,i)=>(
                <li key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                  <div className="text-sm font-semibold">{item.title}</div>
                  <div className="text-xs text-blue-700">{item.meta}</div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Picture Boxes */}
          <div className="flex flex-col gap-8 mt-8">
            {pictureBoxes.map((box,i)=>(
              <motion.div key={i} initial={{opacity:0,x:i%2===0?-100:100}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:0.3}} transition={{duration:0.8}} className={`bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden flex flex-col ${i%2===0?"lg:flex-row":"lg:flex-row-reverse"}`}>
                <img src={box.image} alt={box.text} className="w-full lg:w-1/2 h-48 object-cover"/>
                <div className="p-4 flex items-center justify-center text-blue-900 font-semibold text-lg">{box.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* RIGHT COLUMN */}
        <motion.section className="lg:col-span-2 flex flex-col lg:flex-row gap-6">

          {/* Upcoming Events */}
          <div className="lg:w-1/2 flex flex-col gap-4">
            <motion.div variants={cardPop} className="p-6 bg-white rounded-2xl border-l-4 border-blue-500 border-blue-200 shadow-sm text-center">
              <h2 className="text-2xl font-semibold text-blue-900">Upcoming Events</h2>
            </motion.div>

            {upcomingEvents.map((event,i)=>(
              <motion.div key={i} variants={cardPop} className="bg-white rounded-2xl border border-blue-200 p-4 cursor-pointer" onClick={()=>setOpenEvent(openEvent===i?null:i)}>
                <h3 className="font-semibold text-blue-900">{event.title}</h3>
                <p className="text-sm text-blue-700">{new Date(event.dateString).toLocaleString()} • {event.location}</p>
                <AnimatePresence>
                  {openEvent===i && (
                    <motion.p initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="text-sm text-blue-800 mt-2">{event.details}</motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Calendar */}
          <motion.div ref={calendarRef} layout variants={cardPop} className="bg-white rounded-2xl border border-blue-200 shadow-sm p-4 sm:p-6 lg:w-1/2 relative">
            <div className="flex items-center justify-between mb-4">
              <button onClick={()=>setCalendarDate(new Date(calYear, calMonth-1,1))} className="text-blue-700 text-2xl font-bold">❮</button>
              <h3 className="text-lg sm:text-xl font-semibold text-blue-900">{monthNames[calMonth]} {calYear}</h3>
              <button onClick={()=>setCalendarDate(new Date(calYear, calMonth+1,1))} className="text-blue-700 text-2xl font-bold">❯</button>
            </div>

            <div className="grid grid-cols-7 text-xs sm:text-sm text-blue-700 font-medium mb-1">
              {daysOfWeek.map(d=><div key={d} className="text-center">{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((date,idx)=>{
                if(!date) return <div key={idx}/>;
                const isToday = date.getTime()===texasToday.getTime();
                const isSelected = date.getTime()===selectedDate?.getTime();
                const dayEvents = calendarEvents.filter(event=>{
                  const eDate=new Date(event.dateString);
                  return eDate.getFullYear()===date.getFullYear() && eDate.getMonth()===date.getMonth() && eDate.getDate()===date.getDate();
                });
                return (
                  <div key={idx} className={`relative flex items-center justify-center h-12 sm:h-14 w-full rounded-lg text-sm sm:text-base font-semibold cursor-pointer transition-colors ${isSelected?"bg-blue-400 text-white":isToday?"bg-blue-600 text-white":"bg-blue-50 hover:bg-blue-100 text-blue-900"}`} onClick={()=>setSelectedDate(prev=>prev?.getTime()===date.getTime()?null:date)}>
                    {date.getDate()}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}} className="absolute top-14 left-1/2 transform -translate-x-1/2 z-10 w-60 bg-white border border-blue-200 rounded-lg shadow-lg p-3 text-sm text-blue-900">
                          <p className="font-semibold mb-1">{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
                          {dayEvents.length>0 ? <ul className="space-y-2">{dayEvents.map((ev,i)=><li key={i} className="border-l-4 border-blue-500 pl-2"><p className="font-semibold text-blue-800">{ev.title}</p><p className="text-xs text-blue-700">{ev.location}</p><p className="text-xs text-blue-700">{ev.details}</p></li>)}</ul>:<p className="text-xs text-blue-700">No events for this day</p>}
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

      {/* FOOTER */}
      <footer className="border-t border-blue-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="font-semibold underline mb-2 text-blue-900">Contact Our Community Staff:</p>
          <div className="flex flex-col sm:flex-row sm:gap-8 text-sm">
            <a className="text-blue-700" href="mailto:Gatherly@gmail.com">Gatherly@gmail.com</a>
            <a className="text-blue-700" href="tel:012-345-6789">012-345-6789</a>
            <span className="text-blue-700">[enter info]</span>
          </div>
        </div>
        <div className="text-center text-sm text-blue-700 py-4 bg-blue-50">© {year} Gatherly. All rights reserved.</div>
      </footer>
    </motion.div>
  );
}
