//Choose Event/ Resource

"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AdminShell from "../_components/AdminShell";

const card = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut", delay: 0.05 * i },
  }),
};

export default function AdminDashboard() {
  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="Choose what you want to add. Resources are permanent places/services; Events are scheduled activities."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/admin/resources/new">
          <motion.div
            variants={card}
            initial="hidden"
            animate="show"
            custom={1}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 text-xs text-emerald-200">
              Add a Resource
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.65)]" />
            </div>

            <h2 className="mt-4 text-2xl font-extrabold">Resources</h2>
            <p className="mt-2 text-sm text-white/70">
              Add a place or service that exists (gym, park, grocery, support
              center). These show up in your directory & map.
            </p>

            <div className="mt-5 text-sm text-white/85 font-semibold">
              → Open Resource Form
            </div>
          </motion.div>
        </Link>

        <Link href="/admin/events/new">
          <motion.div
            variants={card}
            initial="hidden"
            animate="show"
            custom={2}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-400/20 bg-blue-500/10 text-xs text-blue-200">
              Add an Event
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 shadow-[0_0_14px_rgba(147,197,253,0.7)]" />
            </div>

            <h2 className="mt-4 text-2xl font-extrabold">Events</h2>
            <p className="mt-2 text-sm text-white/70">
              Add scheduled activities held at a resource (has start/end date &
              time, and indoor/outdoor).
            </p>

            <div className="mt-5 text-sm text-white/85 font-semibold">
              → Open Event Form
            </div>
          </motion.div>
        </Link>
      </div>
    </AdminShell>
  );
}
