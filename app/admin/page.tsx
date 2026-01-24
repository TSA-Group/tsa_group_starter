"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageIn: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.995, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const glow: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

export default function AdminLoginPage() {
  const router = useRouter();

  const [user, setUser] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const authed = localStorage.getItem("admin_authed") === "1";
    if (authed) router.replace("/admin/dashboard");

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [router]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (timerRef.current) window.clearTimeout(timerRef.current);

    const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "crosscreek";

    timerRef.current = window.setTimeout(() => {
      const ok = user.trim() === ADMIN_USER && pass === ADMIN_PASS;

      if (!ok) {
        setLoading(false);
        setError("Incorrect username or password.");
        return;
      }

      localStorage.setItem("admin_authed", "1");
      setLoading(false);
      router.push("/admin/dashboard");
    }, 250);
  };

  return (
    <motion.div
      variants={pageIn}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-[#070A12] text-white relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT, delay: 0.1 } }}
        className="absolute top-5 left-5 z-20"
      >
        <Link href="/" className="group inline-block">
          <motion.div
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 backdrop-blur px-4 py-3 text-sm sm:text-base font-semibold text-white/90 shadow-[0_18px_50px_rgba(0,0,0,0.35)] hover:bg-white/10"
          >
            <span className="text-lg sm:text-xl leading-none transition-transform duration-200 group-hover:-translate-x-0.5">
              ←
            </span>
            <span>Back to Home</span>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
        className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.9), rgba(59,130,246,0) 60%)",
        }}
      />
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }}
        className="absolute -bottom-28 -right-28 w-[520px] h-[520px] rounded-full blur-3xl opacity-35"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(147,51,234,0.85), rgba(147,51,234,0) 62%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.06),transparent_45%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <motion.div variants={glow} initial="initial" animate="animate" className="w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_80px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="p-6 sm:p-7 border-b border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE_OUT }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs text-white/80">
                  Secure Admin Portal
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.7)]" />
                </div>

                <h1 className="mt-4 text-3xl font-extrabold tracking-tight">Admin Login</h1>
                <p className="mt-2 text-sm text-white/70">
                  Manage resources & events for your community hub.
                </p>
              </motion.div>
            </div>

            <form onSubmit={onSubmit} className="p-6 sm:p-7 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/85">Username</label>
                <input
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/85">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 pr-20 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                    placeholder="Enter password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-white/80 hover:bg-white/10 transition"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE_OUT } }}
                    exit={{ opacity: 0, y: -6, transition: { duration: 0.2, ease: EASE_OUT } }}
                    className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 font-semibold shadow-[0_20px_55px_rgba(37,99,235,0.25)] hover:brightness-110 transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </motion.button>

              <div className="text-xs text-white/55 leading-relaxed">
                <span className="ml-2 font-semibold text-white/80">admin</span> /
                <span className="ml-1 font-semibold text-white/80">crosscreek</span>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
