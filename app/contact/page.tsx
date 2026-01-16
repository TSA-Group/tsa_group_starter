// app/contact/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* =======================
   Animations
======================= */
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const page: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSending(true);
      await new Promise((r) => setTimeout(r, 900));
      setSent(true);
      setTimeout(() => setSent(false), 2200);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900"
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        <motion.div variants={fadeUp}>
          <div className="text-xs font-semibold tracking-[0.22em] text-blue-700">
            GATHERLY • CONTACT
          </div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-blue-950">
            Get in Touch
          </h1>
          <p className="mt-3 max-w-2xl text-blue-800/90">
            Have a question, feedback, or a community resource to suggest? Send us
            a message and we’ll get back to you.
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          variants={card}
          className="rounded-3xl border border-blue-200 bg-white/75 backdrop-blur p-6 sm:p-8 shadow-sm"
        >
          {/* Alerts */}
          <AnimatePresence>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
              >
                ✅ Message sent successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mb-4 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800"
              >
                ❌ {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={onSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Field label="First Name">
              <input className="input" placeholder="Jane" required />
            </Field>

            <Field label="Last Name">
              <input className="input" placeholder="Doe" required />
            </Field>

            <Field label="Email">
              <input type="email" className="input" placeholder="jane@email.com" required />
            </Field>

            <Field label="Subject">
              <input className="input" placeholder="New resource suggestion" required />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea
                  required
                  placeholder="Share your question or a resource (name, address, category, hours, etc.)"
                  className="input min-h-[140px]"
                />
              </Field>
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Link
                href="/"
                className="text-sm font-semibold text-blue-800 hover:text-blue-900 transition"
              >
                ← Back to Home
              </Link>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={sending}
                type="submit"
                className="inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold
                           border border-blue-700 bg-blue-700 text-white hover:bg-blue-800 transition
                           disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      <footer className="pb-10 text-center text-sm text-blue-800/70">
        © {new Date().getFullYear()} Gatherly
      </footer>
    </motion.div>
  );
}

/* =======================
   Shared Field Styles
======================= */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-blue-900">{label}</label>
      {children}
    </div>
  );
}
