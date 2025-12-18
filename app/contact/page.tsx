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
      className="min-h-screen bg-base-100 text-base-content"
    >
      {/* Top band / subtle theme echo */}


      <main className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Title */}
        <motion.div variants={fadeUp} className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-primary">
            Contact Gatherly
          </h1>
          <p className="mt-2 text-base sm:text-lg text-base-content/70 max-w-2xl">
            Have a question, feedback, or partnership idea? Send us a message and
            we’ll get back to you.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form card */}
          <motion.section
            variants={pop}
            className="lg:col-span-8 rounded-2xl border border-primary/25 bg-base-100 shadow-sm"
          >
            <div className="p-5 sm:p-6 border-b border-primary/15">
              <h2 className="text-lg sm:text-xl font-bold text-base-content">
                Send a message
              </h2>
              <p className="mt-1 text-sm text-base-content/70">
                We usually reply within 1–2 business days.
              </p>
            </div>

            <motion.form
              variants={container}
              className="p-5 sm:p-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                // Hook up to your backend/email provider later.
                // For now: no-op to avoid build/runtime issues.
              }}
            >
              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-base-content/80">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Jane"
                    className="mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/80">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    className="mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-base-content/80">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jane@gatherly.com"
                    className="mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-base-content/80">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="How can we help?"
                    className="mt-2 w-full rounded-xl border border-base-300 bg-base-100 px-4 py-3
                               focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="text-sm font-medium text-base-content/80">
                  Message
                </label>
                <textarea
                  required
                  placeholder="Write your message here..."
                  className="mt-2 w-full min-h-[140px] rounded-xl border border-base-300 bg-base-100 px-4 py-3
                             focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-primary text-primary-content
                             px-6 py-3 font-semibold shadow-sm hover:opacity-95 transition"
                >
                  Send Message
                </motion.button>

                <p className="text-sm text-base-content/60">
                  By messaging us, you agree to be contacted back at your email.
                </p>
              </motion.div>
            </motion.form>
          </motion.section>

          {/* Info card */}
          <motion.aside
            variants={pop}
            className="lg:col-span-4 rounded-2xl border border-primary/25 bg-base-100 shadow-sm"
          >
            <div className="p-5 sm:p-6 border-b border-primary/15">
              <h3 className="text-lg font-bold text-base-content">Get in touch</h3>
              <p className="mt-1 text-sm text-base-content/70">
                Quick ways to reach the team.
              </p>
            </div>

            <motion.div variants={container} className="p-5 sm:p-6 grid gap-4">
              <motion.div variants={fadeUp} className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Email
                </span>
                <div className="text-sm">
                  <div className="font-semibold">Support</div>
                  <div className="text-base-content/70">support@gatherly.com</div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Business
                </span>
                <div className="text-sm">
                  <div className="font-semibold">Partnerships</div>
                  <div className="text-base-content/70">partners@gatherly.com</div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Social
                </span>
                <div className="text-sm">
                  <div className="font-semibold">Follow us</div>
                  <div className="text-base-content/70 flex gap-2 flex-wrap">
                    <a className="link link-primary" href="#">
                      Twitter
                    </a>
                    <span className="text-base-content/40">·</span>
                    <a className="link link-primary" href="#">
                      Instagram
                    </a>
                    <span className="text-base-content/40">·</span>
                    <a className="link link-primary" href="#">
                      LinkedIn
                    </a>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold">
                  Location
                </span>
                <div className="text-sm">
                  <div className="font-semibold">Remote-first</div>
                  <div className="text-base-content/70">
                    Serving communities worldwide
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="pt-2">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/25 px-4 py-3
                             hover:bg-primary/5 transition"
                >
                  ← Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </motion.aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-base-100">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <motion.small variants={fadeUp} className="text-base-content/60">
            © {year} Gatherly. All rights reserved.
          </motion.small>

          <motion.small variants={fadeUp} className="text-base-content/60 flex gap-2">
            <a href="#" className="link link-primary">
              Privacy
            </a>
            <span className="text-base-content/30">·</span>
            <a href="#" className="link link-primary">
              Terms
            </a>
          </motion.small>
        </div>
      </footer>
    </motion.div>
  );
}
