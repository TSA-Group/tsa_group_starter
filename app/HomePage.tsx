"use client";

import React from "react";
import { motion, Variants } from "framer-motion"; 
import QuickActions from "./QuickActions"; // Make sure this points to your QuickActions component

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        layout
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <motion.h1
          layout
          variants={cardPop}
          className="text-4xl font-bold text-blue-900"
        >
          GATHERLY
        </motion.h1>
      </motion.header>

      {/* Main Content */}
      <motion.main
        layout
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6"
      >
        {/* QuickActions Box */}
        <motion.div
          layout
          variants={cardPop}
          className="lg:w-1/3 p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
        >
          <QuickActions />
        </motion.div>

        {/* Calendar */}
        <motion.div
          layout
          variants={cardPop}
          className="lg:w-2/3 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
        >
          <Calendar />
        </motion.div>
      </motion.main>
    </div>
  );
}
