"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants, easeInOut } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle"; // 👈 import toggle

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
      className="min-h-screen bg-accent text-base-content pb-20 transition-colors duration-300"
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
      <main className="w-full max-w-7xl mx-auto px-6 pt-30 pb-[80rem] mt-0 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <motion.section variants={fadeUp} className="space-y-8">
          <motion.div
            variants={cardPop}
            className="p-6 bg-info rounded-2xl shadow-lg border-l-4 border-neutral transition-colors duration-300"
            whileHover={{ y: -6 }}
          >
            <h2 className="text-xl font-semibold mb-2">
              Your Personal Geolocation Data Assembler
            </h2>
            <p className="text-sm text-base-content/70">
              Automatically gathers and organizes nearby community resources —
              neighborhood centers, food pantries, and local support events.
            </p>
            <div className="mt-4">
              <Link href="/map" legacyBehavior>
                <a className="inline-block px-5 py-2 rounded-lg bg-neutral text-info font-medium shadow-md hover:shadow-xl transition">
                  Launch Maps
                </a>
              </Link>
            </div>
          </motion.div>

          <motion.div
            variants={cardPop}
            className="p-5 bg-info rounded-2xl shadow border border-success hover:shadow-xl transition-colors duration-300"
            whileHover={{ y: -4 }}
          >
            <h3 className="text-lg font-semibold mb-1">Quick Actions</h3>
            <p className="text-sm text-warning/70">
              Brendan add something here.
            </p>
          </motion.div>
        </motion.section>

        {/* CENTER COLUMN */}
        <motion.section
          variants={fadeUp}
          className="flex flex-col items-center space-y-8"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold tracking-tight leading-none text-primary"
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
            className="w-full md:w-[88%] h-[350px] bg-info rounded-2xl border border-error shadow-lg p-6 relative overflow-hidden transition-colors duration-300"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-lg font-semibold">Bulletin Board</h3>
            <p className="text-sm text-secondary/70 mt-2">
              Community posts, neighborhood updates, and shared resources.
            </p>

            <motion.ul className="mt-6 grid gap-3">
              {[
                {
                  title: "Free community dinner — Sat 6pm",
                  meta: "Downtown Church",
                },
                { title: "Warm clothing drive", meta: "Westside Center" },
                {
                  title: "Volunteer literacy tutors needed",
                  meta: "Library Annex",
                },
              ].map((item, i) => (
                <motion.li
                  key={i}
                  variants={cardPop}
                  className="bg-primary border border-primary-content rounded-lg p-3 shadow-sm hover:shadow-md transition-colors duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-semibold">{item.title}</div>
                      <div className="text-xs text-accent-content/60">
                        {item.meta}
                      </div>
                    </div>
                    <div className="text-xs text-neutral font-medium">
                      Details
                    </div>
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
            className="p-4 bg-info rounded-2xl shadow-lg border-l-4 border-neutral transition-colors duration-300"
            whileHover={{ y: -4 }}
          >
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <p className="text-xs text-warning/70 mt-1">
              Local gatherings & volunteer opportunities
            </p>
          </motion.div>

          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              variants={cardPop}
              className="h-28 bg-info rounded-xl border border-success shadow-md flex items-center gap-4 p-4 hover:shadow-xl transition-colors duration-300"
              whileHover={{ translateY: -6 }}
            >
              <div className="flex-none w-20 h-20 bg-	success-content rounded-md flex items-center justify-center text-neutral font-semibold">
                IMG
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Neighborhood Meetup</div>
                <div className="text-xs text-accent-content/70">
                  Sat • 2:00 PM • Community Park
                </div>
              </div>
              <div className="text-xs text-neutral font-semibold">RSVP</div>
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
