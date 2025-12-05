// Updated theme colors to neutral (white, off‑white, gray, black)

"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants, easeInOut } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";

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
      className="min-h-screen bg-gray-100 text-gray-900 pb-20 transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={container}
    >
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Main content */}
      <main className="w-full max-w-7xl mx-auto px-6 pt-32 pb-[150rem] mt-0 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <motion.section variants={fadeUp} className="space-y-8">
          <motion.div
            variants={cardPop}
            className="p-6 bg-white rounded-2xl shadow-lg border border-gray-300 transition-colors duration-300"
            whileHover={{ y: -6 }}
          >
            <h2 className="text-xl font-semibold mb-2 text-black">
              Your Personal Geolocation Data Assembler
            </h2>
            <p className="text-sm text-gray-600">
              Automatically gathers and organizes nearby community resources —
              neighborhood centers, food pantries, and local support events.
            </p>
            <div className="mt-4">
              <Link href="/map" legacyBehavior>
                <a className="inline-block px-5 py-2 rounded-lg bg-black text-white font-medium shadow-md hover:shadow-xl transition">
                  Launch Maps
                </a>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={cardPop}
            className="p-5 bg-white rounded-2xl shadow border border-gray-300 hover:shadow-xl transition-colors duration-300"
            whileHover={{ y: -4 }}
          >
            <h3 className="text-lg font-semibold mb-1 text-black">Quick Actions</h3>
            <p className="text-sm text-gray-500">Brendan add something here.</p>
          </motion.div>
        </motion.section>

        {/* CENTER COLUMN */}
        <motion.section
          variants={fadeUp}
          className="flex flex-col items-center space-y-8"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-black"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
            variants={cardPop}
            animate={{
              y: [0, -6, 0],
              transition: { duration: 4.5, ease: easeInOut, repeat: Infinity },
            }}
          >
            GATHERLY
          </motion.h1>

          <motion.div
            variants={cardPop}
            className="w-full md:w-[88%] h-[350px] bg-white rounded-2xl border border-gray-300 shadow-lg p-6 relative overflow-hidden transition-colors duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg font-semibold text-black">Bulletin Board</h3>
            <p className="text-sm text-gray-600 mt-2">
              Community posts, neighborhood updates, and shared resources.
            </p>

            <motion.ul className="mt-6 grid gap-3">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={cardPop}
                  className="bg-gray-50 border border-gray-300 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold text-black">{item.title}</div>
                      <div className="text-xs text-gray-600">{item.meta}</div>
                    </div>
                    <div className="text-xs text-black font-medium">Details</div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.section>

        {/* RIGHT COLUMN */}
        <motion.section variants={fadeUp} className="space-y-8">
          <motion.div
            variants={cardPop}
            className="p-4 bg-white rounded-2xl shadow-lg border border-gray-300 transition-colors duration-300"
            whileHover={{ y: -4 }}
          >
            <h2 className="text-xl font-semibold text-black">Upcoming Events</h2>
            <p className="text-xs text-gray-500 mt-1">
              Local gatherings & volunteer opportunities
            </p>
          </motion.div>

          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={cardPop}
              className="h-28 bg-white rounded-xl border border-gray-300 shadow-md flex items-center gap-4 p-4 hover:shadow-xl transition"
              whileHover={{ translateY: -6 }}
            >
              <div className="flex-none w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-black font-semibold">
                IMG
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-black">Neighborhood Meetup</div>
                <div className="text-xs text-gray-600">
                  Sat • 2:00 PM • Community Park
                </div>
              </div>
              <div className="text-xs text-black font-semibold">RSVP</div>
            </motion.div>
          ))}
        </motion.section>
      </main>

      {/* FOOTER CONTACT */}
      <motion.footer
        variants={fadeUp}
        className="w-full p-6 bg-white border-t border-gray-300 mt-12 text-gray-800 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold underline mb-2 text-black">
            Contact Our Community Staff:
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm">
            <a href="mailto:Gatherly@gmail.com" className="text-black">Gatherly@gmail.com</a>
            <a href="tel:012-345-6789" className="text-black">012-345-6789</a>
            <span className="text-gray-600">[enter info]</span>
          </div>
        </div>
      </motion.footer>

      {/* COPYRIGHT FOOTER */}
      <footer className="w-full p-4 text-center text-sm text-gray-600 bg-white border-t border-gray-300 transition-colors duration-300">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}
