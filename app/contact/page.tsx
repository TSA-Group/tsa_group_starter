"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

/* =====================
   Animations
===================== */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

export default function ContactPage() {
  const year = new Date().getFullYear();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="min-h-screen bg-gradient-to-br from-[#070c1f] via-[#0b1224] to-[#020617] text-white"
    >
      {/* Soft background bubbles */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-indigo-500/10 rounded-full blur-[90px]" />
        <div className="absolute top-40 right-10 w-[360px] h-[360px] bg-blue-400/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-120px] left-1/2 w-[420px] h-[420px] bg-cyan-400/10 rounded-full blur-[90px] -translate-x-1/2" />
      </div>

      <main className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Title */}
        <motion.div variants={fadeUp} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-indigo-300">
            Contact Gatherly
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-400 max-w-2xl">
            Have a question, feedback, or partnership idea? Send us a message and
            we’ll get back to you.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <motion.section
            variants={pop}
            className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-sm"
          >
            <div className="p-5 sm:p-6 border-b border-white/10">
              <h2 className="text-lg sm:text-xl font-semibold">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                We usually reply within 1–2

