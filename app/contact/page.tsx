"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

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
      className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 text-slate-900"
    >
      {/* soft background accents */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-sky-300/30 rounded-full blur-[90px]" />
        <div className="absolute top-40 right-10 w-[360px] h-[360px] bg-emerald-300/25 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-120px] left-1/2 w-[420px] h-[420px] bg-indigo-300/20 rounded-full blur-[90px] -translate-x-1/2" />
      </div>

      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        {/* header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-sky-900">
            Contact Gatherly
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Have a question, feedback, or a new community resource to suggest? Send us a
            message and we’ll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* form card */}
          <motion.section
            variants={pop}
            className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm"
          >
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Send a message</h2>
              <p className="mt-1 text-sm text-slate-600">
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
                <Input label="Email" type="email" placeholder="jane@email.com" />
                <Input label="Subject" placeholder="New resource suggestion / question" />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea
                  required
                  placeholder="Share your question, feedback, or a resource we should add (name, address, phone, website, hours, category)..."
                  className="mt-2 w-full min-h-[140px] rounded-xl border border-slate-200 bg-white px-4 py-3
                             text-slate-900 placeholder:text-slate-400 shadow-sm
                             focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-300"
                />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  type="submit"
                  className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-700 shadow-sm"
                >
                  Send Message
                </motion.button>

                <p className="text-sm text-slate-600 sm:self-center">
                  By messaging us, you agree to be contacted back at your email.
                </p>
              </motion.div>
            </motion.form>
          </motion.section>

          {/* info card */}
          <motion.aside
            variants={pop}
            className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-md shadow-sm"
          >
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Get in touch</h3>
              <p className="mt-1 text-sm text-slate-600">
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
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-3
                             text-slate-800 hover:bg-slate-50 shadow-sm"
                >
                  ← Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </motion.aside>
        </div>
      </main>

      {/* footer */}
      <footer className="border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row justify-between gap-3">
          <motion.small variants={fadeUp} className="text-slate-600">
            © {year} Gatherly. All rights reserved.
          </motion.small>
          <motion.small variants={fadeUp} className="text-slate-600 flex gap-2">
            <a href="#" className="hover:text-sky-700">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-sky-700">Terms</a>
          </motion.small>
        </div>
      </footer>
    </motion.div>
  );
}

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
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        required
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3
                   text-slate-900 placeholder:text-slate-400 shadow-sm
                   focus:outline-none focus:ring-2 focus:ring-sky-500/40 focus:border-sky-300"
      />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col">
      <span className="text-xs font-semibold text-sky-700">{label}</span>
      <span className="text-sm text-slate-700">{value}</span>
    </motion.div>
  );
}
