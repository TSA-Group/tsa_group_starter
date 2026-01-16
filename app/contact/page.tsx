"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";

/* =======================
   Animations (History-style)
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
      {/* ================= Header ================= */}
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

      {/* ================= Form Card ================= */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <motion.div
          variants={card}
          className="rounded-3xl border border-blue-300 bg-white shadow-md"
        >
          {/* Alerts */}
          <div className="px-6 pt-6">
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mb-5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
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
                  className="mb-5 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
                >
                  ❌ {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Form */}
          <form
            onSubmit={onSubmit}
            className="px-6 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6"
          >
            <Field label="First Name">
              <input
                className="form-input"
                placeholder="Jane"
                autoComplete="given-name"
                required
              />
            </Field>

            <Field label="Last Name">
              <input
                className="form-input"
                placeholder="Doe"
                autoComplete="family-name"
                required
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                className="form-input"
                placeholder="jane@email.com"
                autoComplete="email"
                required
              />
            </Field>

            <Field label="Subject">
              <input
                className="form-input"
                placeholder="New resource suggestion"
                required
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Message">
                <textarea
                  className="form-input min-h-[160px] resize-none"
                  placeholder="Tell us your question or share a resource (name, address, category, hours, etc.)"
                  required
                />
              </Field>
            </div>

            {/* Actions */}
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
                className="rounded-2xl px-6 py-3 font-semibold
                           border border-blue-700 bg-blue-700 text-white
                           hover:bg-blue-800 transition
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

      {/* ================= Input Styles (LOCAL) ================= */}
      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1.5px solid rgb(96 165 250); /* blue-400 */
          background: rgb(239 246 255); /* blue-50 */
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          color: rgb(15 23 42);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.06);
          transition: background 0.15s ease, border 0.15s ease,
            box-shadow 0.15s ease;
        }

        .form-input::placeholder {
          color: rgb(100 116 139);
        }

        .form-input:focus {
          outline: none;
          background: #ffffff;
          border-color: rgb(37 99 235); /* blue-600 */
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
        }
      `}</style>
    </motion.div>
  );
}

/* =======================
   Field Wrapper
======================= */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-blue-900">
        {label}
      </label>
      {children}
    </div>
  );
}

