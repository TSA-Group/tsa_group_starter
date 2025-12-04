"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants, easeInOut } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
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
  hidden: { opacity: 0, y: 10, scale: 0.995 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <motion.div
      className="min-h-screen bg-[#F4F6F7] text-[#37474F] pb-20"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={container}
    >
      {/* Main content */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 mt-28 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
        >
          <motion.div
            variants={cardPop}
            className="p-6 bg-white rounded-2xl shadow-lg border-l-4 border-[#26A69A] transform-gpu"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <h2 className="text-xl font-semibold mb-2">Your Personal Geolocation Data Assembler</h2>
            <p className="text-sm text-[#546E7A]">
              Automatically gathers and organizes nearby community resources — neighborhood centers, food
              pantries, and local support events.
            </p>
            <div className="mt-4">
              <Link href="/map" legacyBehavior>
                <a
                  className="inline-block px-5 py-2 rounded-lg bg-[#26A69A] text-white font-medium shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#bfeee7] transition"
                  aria-label="Launch Maps"
                >
                  Launch Maps
                </a>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={cardPop}
            className="p-5 bg-white rounded-2xl shadow border border-[#e6eef0] hover:shadow-xl transition transform-gpu"
            whileHover={{ y: -4, boxShadow: "0 18px 30px rgba(38,166,154,0.08)" }}
          >
            <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
            <p className="text-sm text-[#607D8B]">
              Add a resource, suggest an event, or report an update to your community board.
            </p>
          </motion.div>
        </motion.section>

        {/* CENTER COLUMN */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.18 }}
          className="flex flex-col items-center space-y-8"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
            variants={cardPop}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            animate={{
              y: [0, -6, 0],
              transition: { duration: 4.5, ease: easeInOut, repeat: Infinity },
            }}
          >
            GATHERLY
          </motion.h1>

          <motion.div
            variants={cardPop}
            className="w-full md:w-[88%] h-[350px] bg-white rounded-2xl border border-[#90A4AE] shadow-lg p-6 relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="absolute -left-24 -top-12 w-72 h-72 rounded-full bg-[#e8f8f5] opacity-60 blur-lg pointer-events-none" />
            <div className="absolute right-0 -bottom-12 w-56 h-56 rounded-full bg-[#f1fbfa] opacity-60 blur-lg pointer-events-none" />
            <h3 className="text-lg font-semibold">Bulletin Board</h3>
            <p className="text-sm text-[#607D8B] mt-2">
              Community posts, neighborhood updates, and shared resources. Pin important notices to the top so everyone sees them.
            </p>

            <motion.ul
              className="mt-6 grid gap-3"
              variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            >
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={cardPop}
                  className="bg-[#FBFFFE] border border-[#e8f3f1] rounded-lg p-3 shadow-sm hover:shadow-md transition transform-gpu"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-[#78909C]">{item.meta}</div>
                    </div>
                    <div className="text-xs text-[#26A69A] font-medium">Details</div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.section>

        {/* RIGHT COLUMN */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="space-y-8"
        >
          <motion.div
            variants={cardPop}
            className="p-4 bg-white rounded-2xl shadow-lg border-l-4 border-[#26A69A]"
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <p className="text-xs text-[#607D8B] mt-1">Local gatherings & volunteer opportunities</p>
          </motion.div>

          <motion.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
            className="space-y-5"
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                variants={cardPop}
                className="h-28 bg-white rounded-xl border border-[#E6EEF0] shadow-md flex items-center gap-4 p-4 hover:shadow-xl transition transform-gpu"
                whileHover={{ translateY: -6, boxShadow: "0 18px 30px rgba(38,166,154,0.08)" }}
              >
                <div className="flex-none w-20 h-20 bg-[#F0F8F6] rounded-md flex items-center justify-center text-[#26A69A] font-semibold">
                  IMG
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Neighborhood Meetup</div>
                  <div className="text-xs text-[#78909C]">Sat • 2:00 PM • Community Park</div>
                </div>
                <div className="text-xs text-[#26A69A] font-semibold">RSVP</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </main>

      {/* FOOTER CONTACT */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="w-full p-6 bg-white border-t border-[#CFD8DC] mt-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold underline mb-2">Contact Our Community Staff:</p>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm">
            <a href="mailto:Gatherly@gmail.com" className="text-[#37474F]">Gatherly@gmail.com</a>
            <a href="tel:012-345-6789" className="text-[#37474F]">012-345-6789</a>
            <span className="text-[#78909C]">[enter info]</span>
          </div>
        </div>
      </motion.footer>

      {/* COPYRIGHT FOOTER */}
      <footer className="w-full p-4 text-center text-sm text-[#607D8B] bg-white border-t">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}
