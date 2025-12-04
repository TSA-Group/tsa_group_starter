"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function Home() {
  const year = new Date().getFullYear();

  // typed as Variants to avoid TS complaints about `variants` prop
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  const fade: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#F4F6F7] text-[#37474F]"
      initial="hidden"
      animate="show"
      variants={fade}
    >
      {/* HEADER */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-md sticky top-0 z-20"
      >
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ fontFamily: "Momo Signature" }}
        >
          Gatherly
        </h1>

        <nav className="hidden md:flex gap-10 text-lg font-medium">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/">Home</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/resources">Resources</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/events">Events</Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/contact">Contact</Link>
          </motion.div>
        </nav>

        <div className="md:hidden text-3xl">☰</div>
      </motion.header>

      {/* MAIN GRID */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT COLUMN */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-6 bg-white border-l-4 border-[#26A69A] rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">
              Your Personal Geolocation Data Assembler
            </h2>

            <p className="text-sm text-[#546E7A]">
              Automatically gathers and organizes nearby community resources.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="mt-4 px-5 py-2 bg-[#26A69A] text-white rounded-lg shadow-md hover:bg-[#1F8D81]"
            >
              Calendar Dept
            </motion.button>
          </motion.div>
        </motion.div>

        {/* CENTER COLUMN */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-7xl font-bold tracking-wide"
            style={{ fontFamily: "TAN Buster, sans-serif" }}
          >
            GATHERLY
          </motion.h1>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="w-full h-[350px] bg-white rounded-2xl border border-[#90A4AE] shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold">Bulletin Board</h3>
            <p className="text-sm text-[#607D8B] mt-2">
              Posts, updates, and shared community info will appear here.
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN */}
        <motion.div variants={fadeUp} initial="hidden" animate="show" className="space-y-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-white border-l-4 border-[#26A69A] rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
          </motion.div>

          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="h-28 bg-white rounded-xl border border-[#B0BEC5] shadow-md flex items-center justify-center text-[#607D8B] text-lg"
              >
                Image
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* FOOTER CONTACT */}
      <motion.footer
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="w-full p-6 bg-white border-t border-[#CFD8DC]"
      >
        <p className="font-semibold underline mb-2">Contact Our Community Staff:</p>
        <p>Gatherly@gmail.com</p>
        <p>012-345-6789</p>
      </motion.footer>

      {/* COPYRIGHT FOOTER */}
      <footer className="w-full p-4 text-center text-sm text-[#607D8B] bg-white border-t">
        © {year} Gatherly. All rights reserved.
      </footer>
    </motion.div>
  );
}
