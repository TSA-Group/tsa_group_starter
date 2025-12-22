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
      {/* Background bubbles */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-indigo-500/10 rounded-full blur-[90px]" />
        <div className="absolute top-40 right-10 w-[360px] h-[360px] bg-blue-400/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-120px] left-1/2 w-[420px] h-[420px] bg-cyan-400/10 rounded-full blur-[90px] -translate-x-1/2" />
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-indigo-300">
            Contact Gatherly
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Have a question, feedback, or partnership idea? Send us a message and
            we’ll get back to you.
          </p>
        </motion.div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <motion.section
            variants={pop}
            className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold">Send a message</h2>
              <p className="mt-1 text-sm text-slate-400">
                We usually reply within 1–2 business days.
              </p>
            </div>

            <motion.form
              variants={container}
              className="p-6 grid gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
                <Input label="First name" placeholder="Jane" />
                <Input label="Last name" placeholder="Doe" />
              </motion.div>

              <motion.div variants={fadeUp} className="grid sm:grid-cols-2 gap-4">
                <Input label="Email" type="email" placeholder="jane@gatherly.com" />
                <Input label="Subject" placeholder="How can we help?" />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="text-sm font-medium text-slate-300">
                  Message
                </label>
                <textarea
                  required
                  placeholder="Write your message here..."
                  className="mt-2 w-full min-h-[140px] rounded-xl border border-white/10 bg-white/5 px-4 py-3
                             text-white placeholder:text-slate-400 focus:outline-none
                             focus:ring-2 focus:ring-indigo-500/50"
                />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  type="submit"
                  className="rounded-full bg-indigo-500 px-6 py-3 font-semibold text-white hover:bg-indigo-600"
                >
                  Send Message
                </motion.button>

                <p className="text-sm text-slate-400">
                  By messaging us, you agree to be contacted back at your email.
                </p>
              </motion.div>
            </motion.form>
          </motion.section>

          {/* Info */}
          <motion.aside
            variants={pop}
            className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold">Get in touch</h3>
              <p className="mt-1 text-sm text-slate-400">
                Quick ways to reach the team.
              </p>
            </div>

            <motion.div variants={container} className="p-6 grid gap-4">
              <Info label="Support" value="support@gatherly.com" />
              <Info label="Partnerships" value="partners@gatherly.com" />
              <Info label="Location" value="Remote-first, worldwide" />

              <motion.div variants={fadeUp}>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-xl border border-white/15 px-4 py-3 hover:bg-white/10"
                >
                  ← Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between gap-3">
          <motion.small variants={fadeUp} className="text-slate-400">
            © {year} Gatherly. All rights reserved.
          </motion.small>
          <motion.small variants={fadeUp} className="text-slate-400 flex gap-2">
            <a href="#" className="hover:text-indigo-400">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-indigo-400">Terms</a>
          </motion.small>
        </div>
      </footer>
    </motion.div>
  );
}

/* =====================
   Components
===================== */
function Input({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3
                   text-white placeholder:text-slate-400 focus:outline-none
                   focus:ring-2 focus:ring-indigo-500/50"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col">
      <span className="text-xs font-semibold text-indigo-400">{label}</span>
      <span className="text-sm text-slate-300">{value}</span>
    </motion.div>
  );
}

