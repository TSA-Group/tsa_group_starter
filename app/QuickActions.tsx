"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

// Animation variant for Quick Actions
const cardPop: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: "easeOut" } },
};

export function QuickActions() {
  const actions = [
    { label: "Admin", href: "/admin" },
    { label: "Resources", href: "/map" },
    { label: "Events", href: "/events" },
  ];

  return (
    <motion.section
      layout
      variants={cardPop}
      initial="hidden"
      animate="show"
      className="h-[300px] w-full sm:w-[650px] p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-2 text-blue-900">Quick Actions</h3>
      <p className="text-sm text-blue-700 mb-4">
        Welcome to Cross Creek! Explore some of our community resources.
      </p>

      <ul className="space-y-2">
        {actions.map((action, i) => (
          <li key={i}>
            <Link
              href={action.href}
              className="block bg-blue-50 border border-blue-200 rounded-xl py-2 px-3 text-sm font-semibold text-blue-900 hover:bg-blue-100 transition"
            >
              {action.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
