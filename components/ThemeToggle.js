// components/ThemeToggle.jsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
      return;
    }
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const system = prefersDark ? "dark" : "light";
    setTheme(system);
    document.documentElement.setAttribute("data-theme", system);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92, rotate: 12 }}
      onClick={toggleTheme}
      className="relative w-14 h-14 rounded-full flex items-center justify-center bg-transparent"
    >
      <motion.div
        animate={{ rotate: theme === "light" ? 360 : -360 }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        className="w-10 h-10 rounded-full planet"
        style={{
          background:
            theme === "light"
              ? "radial-gradient(circle, #00c2ff 20%, #0061a8 90%)"
              : "radial-gradient(circle, #15616d 20%, #001219 90%)",
          boxShadow:
            theme === "light"
              ? "0 0 12px rgba(0, 204, 255, 0.6)"
              : "0 0 14px rgba(0, 255, 200, 0.35)",
        }}
      >
        <div
          className="absolute w-4 h-3 rounded-full"
          style={{
            background: theme === "light" ? "#9cff9c" : "#68c47c",
            top: "25%",
            left: "20%",
            opacity: theme === "light" ? 0.7 : 0.45,
          }}
        />
        <div
          className="absolute w-5 h-3 rounded-full"
          style={{
            background: theme === "light" ? "#a2ff6b" : "#55bd63",
            bottom: "30%",
            right: "15%",
            opacity: theme === "light" ? 0.65 : 0.4,
          }}
        />
      </motion.div>

      <span className="absolute -bottom-6 text-xs font-medium text-neutral">
        {theme === "light" ? "Day" : "Night"}
      </span>
    </motion.button>
  );
}
