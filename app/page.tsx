"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants, easeInOut } from "framer-motion";

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

  return (
    <motion.div
      className="min-h-screen bg-accent text-base-content pb-20 transition-colors duration-300"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={container}
    >


      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl mx-auto px-6 pt-12 pb-[80vh] mt-0 grid grid-cols-1 md:grid-cols-3 gap-10">


        {/* LEFT COLUMN — (NO “LAUNCH MAPS” ANYMORE) */}
        <motion.section variants={fadeUp} className="space-y-8">
          <motion.div
            variants={cardPop}
            whileHover={{ y: -6 }}
          >
            
          </motion.div>
        </motion.section>



        {/* CENTER COLUMN — GATHERLY + QUICK ACTIONS BELOW */}
        <motion.section
          variants={fadeUp}
          className="flex flex-col items-center space-y-8"
        >
          {/* BIG TITLE */}
          <motion.h1
            className="text-8xl md:text-9xl font-extrabold tracking-tight leading-none text-primary"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
            variants={cardPop}
            animate={{
              x: [-380, -420, -380],
              y: [0, -6, 0],
              transition: { duration: 2.5, ease: easeInOut },
            }}
          >
            GATHERLY
          </motion.h1>

          {/* QUICK ACTIONS BELOW THE TITLE */}
          <motion.div
            variants={cardPop}
            className="p-5 w-full md:w-[88%] bg-info rounded-2xl shadow border border-success hover:shadow-xl transition-colors duration-300"
            whileHover={{ y: -4 }}
          >
            <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
            <p className="text-sm text-warning/70">
              Brendan add something here.
            </p>
          </motion.div>

          {/* BULLETIN BOARD (STAYS IN CENTER) */}
          <motion.div
            variants={cardPop}
            className="w-full md:w-[88%] h-[350px] bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-2xl 
            border border-gray-400 dark:border-gray-600 shadow-2xl p-4 relative 
            overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 
            dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 transition-colors duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
              Bulletin Board
            </h3>

            <ul className="space-y-4">
              {[
                { title: "Free community dinner — Sat 6pm", meta: "Downtown Church" },
                { title: "Warm clothing drive", meta: "Westside Center" },
                { title: "Volunteer literacy tutors needed", meta: "Library Annex" },
                { title: "Brendan make something up", meta: "Some place" },
              ].map((item, i) => (
                <li
                  key={i}
                  className="bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-xl 
                  border border-gray-300 dark:border-gray-600 rounded-lg p-3 shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        {item.meta}
                      </div>
                    </div>
                    <div className="text-xs text-black dark:text-white font-medium">Details</div>
                  </div>

                  <div className="h-1 w-full bg-gray-300 dark:bg-gray-700 rounded-full">
                    <div className="h-1 bg-gray-600 dark:bg-gray-300 rounded-full w-2/3"></div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.section>



        {/* RIGHT COLUMN — NOW A **BIG** UPCOMING EVENTS SECTION */}
        <motion.section variants={fadeUp} className="space-y-8 flex flex-col">
          
          {/* BIGGER HEADER */}
          <motion.div
            variants={cardPop}
            className="p-6 bg-info rounded-2xl shadow-lg border-l-4 border-neutral transition-colors duration-300 text-center"
            whileHover={{ y: -4 }}
          >
            <h2 className="text-3xl font-semibold">Upcoming Events</h2>
            <p className="text-sm text-warning/70 mt-1">
              Local gatherings & volunteer opportunities
            </p>
          </motion.div>

          {/* BIGGER EVENT CARDS */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={cardPop}
              className="h-36 bg-info rounded-xl border border-success shadow-md 
              flex items-center gap-4 p-5 hover:shadow-xl transition-colors duration-300"
              whileHover={{ translateY: -6 }}
            >
              <div className="flex-none w-24 h-24 bg-success-content rounded-md flex items-center justify-center text-neutral font-semibold">
                IMG
              </div>

              <div className="flex-1">
                <div className="text-lg font-medium">Neighborhood Meetup</div>
                <div className="text-sm text-accent-content/70">
                  Sat • 2:00 PM • Community Park
                </div>
              </div>

              <div className="text-sm text-neutral font-semibold">RSVP</div>
            </motion.div>
          ))}
        </motion.section>
      </main>


      {/* FOOTER CONTACT */}
      <motion.footer
        variants={fadeUp}
        className="w-full p-6 bg-info border-t border-warning-content mt-12 text-base-content transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-semibold underline mb-2">
            Contact Our Community Staff:
          </p>
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 text-sm">
            <a href="mailto:Gatherly@gmail.com">Gatherly@gmail.com</a>
            <a href="tel:012-345-6789">012-345-6789</a>
            <span className="text-accent-content/70">[enter info]</span>
          </div>
        </div>
      </motion.footer>

      {/* COPYRIGHT FOOTER */}
      <footer className="w-full p-4 text-center text-sm text-warning/70 bg-info border-t border-warning-content transition-colors duration-300">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}
