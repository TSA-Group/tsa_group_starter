"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";

const sectionAnim: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ContactPage() {
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setSending(true);

      // placeholder for API / email / firestore later
      await new Promise((r) => setTimeout(r, 900));

      setSent(true);
      setTimeout(() => setSent(false), 2200);
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070b16] text-white px-6 py-12">
      <motion.div
        variants={sectionAnim}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-5xl"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Contact Gatherly
          </h1>
          <p className="mt-2 text-white/60 max-w-2xl">
            Have a question, feedback, or a community resource to suggest? Send us
            a message and we’ll get back to you.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="text-white/80 font-semibold">Send a Message</div>
            <div className="mt-1 text-sm text-white/55">
              We usually reply within 1–2 business days.
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Alerts */}
            <div className="md:col-span-2">
              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
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
                    className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    ❌ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

            <div className="md:col-span-2">
              <Field label="Message">
                <textarea
                  required
                  placeholder="Share your question or a resource (name, address, category, hours, etc.)"
                  className="input min-h-[140px]"
                />
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2 flex-wrap">
              <Link
                href="/"
                className="text-sm text-white/60 hover:text-white transition"
              >
                ← Back to Home
              </Link>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                disabled={sending}
                type="submit"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-[0_20px_55px_rgba(37,99,235,0.25)] hover:brightness-110 transition disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Message"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </main>
  );
}

/* Shared field styling (same pattern as Resource page) */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-white/85">{label}</div>
      {children}
    </div>
  );
}
