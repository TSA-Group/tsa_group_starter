"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

// Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const cardPop: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

// All actions combined in one box
const allActions = [
  { label: "Map", href: "/map" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
];

export function QuickActions() {
  return (
    <motion.section
      layout
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <motion.div
        layout
        variants={cardPop}
        initial="hidden"
        animate="visible"
        className="p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
      >
        <h3 className="text-lg font-semibold mb-1 text-blue-900">Quick Actions</h3>
        <p className="text-sm text-blue-700">
          <b>Welcome to Cross Creek!</b>
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allActions.map(({ label, href }) => (
            <Link key={label} href={href} className="block">
              <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200 cursor-pointer hover:bg-blue-100 transition">
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
