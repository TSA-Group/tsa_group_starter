"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

// Animation variant for pop effect
const cardPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function QuickActions() {
  return (
    <motion.section
      layout
      variants={cardPop}
      initial="hidden"
      animate="show"
      className="h-[220px] w-full lg:w-[450px] p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm overflow-y-auto"
    >
      <h3 className="text-lg font-semibold mb-4 text-blue-900">Quick Actions</h3>
      <ul className="space-y-3">
        {[
          "Join Neighborhood Meetup",
          "Sign up for Community Dinner",
          "Volunteer for Clothing Drive",
          "Donate Items for Local Pantry",
          "Register for Community Cleanup",
        ].map((action, i) => (
          <li
            key={i}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm font-medium text-blue-900 hover:bg-blue-100 cursor-pointer transition"
          >
            {action}
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
