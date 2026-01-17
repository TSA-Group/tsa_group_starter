"use client";
import React from "react";
import Link from "next/link";
import { motion, type Variants, useReducedMotion } from "framer-motion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function SiteFooter() {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#F6FAFF] via-[#EEF6FF] to-[#E8F0FF]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-120px" }}
          variants={container}
          className="mt-14 rounded-[34px] border border-blue-200 bg-blue-100/60 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)]"
        >
          <div className="px-7 py-8 sm:px-10 sm:py-10">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-extrabold text-blue-950">
                  Our Vision
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-blue-900/80">
                  Gatherly helps Cross Creek residents find community resources,
                  explore events, and stay connected — in a calm, clear, local
                  space.
                </p>
              </motion.div>
              <motion.div variants={fadeUp}>
                <h3 className="text-lg font-extrabold text-blue-950">
                  Explore
                </h3>

                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {[
                    { label: "Resources", href: "/map" },
                    { label: "Events", href: "/events" },
                    { label: "History", href: "/history" },
                    { label: "Contact", href: "/contact" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-blue-900/80 hover:text-blue-950 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="md:justify-self-end">
                <h3 className="text-lg font-extrabold text-blue-950">
                  Connect With Us
                </h3>

                <div className="mt-3 flex items-center gap-3">
                  <motion.a
                    href="/contact"
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center rounded-xl border border-blue-300 bg-white/70 px-4 py-2 text-sm font-semibold text-blue-950 shadow-sm hover:bg-white transition-colors"
                  >
                    Contact
                  </motion.a>

                  <div className="flex items-center gap-3">
                    <IconLink label="Instagram" href="#" icon="◎" />
                    <IconLink label="Facebook" href="#" icon="f" />
                    <IconLink label="X" href="#" icon="x" />
                  </div>
                </div>

                <div className="mt-4 space-y-1 text-sm text-blue-900/80">
                  <p className="flex items-center gap-2">
                    <span aria-hidden>✉</span>
                    <span>contact@gatherly.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span aria-hidden>☎</span>
                    <span>(123)-456-7890</span>
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 h-px w-full bg-blue-200/70" />

            <motion.div
              variants={fadeUp}
              className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm"
            >
              <span className="text-blue-950/80">
                © {year} Gatherly. All rights reserved.
              </span>

              <div className="flex items-center gap-4 text-blue-900/70">
                <Link href="/privacy" className="hover:text-blue-950">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-blue-950">
                  Terms
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none h-8 w-full bg-gradient-to-b from-transparent to-blue-950/5" />
    </footer>
  );
}

function IconLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.a
      href={href}
      aria-label={label}
      title={label}
      whileHover={reduce ? undefined : { y: -2, scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      className="h-9 w-9 rounded-xl border border-blue-300 bg-white/65 backdrop-blur flex items-center justify-center text-blue-950/80 shadow-sm hover:bg-white transition-colors"
    >
      <span className="text-sm font-bold">{icon}</span>
    </motion.a>
  );
}
