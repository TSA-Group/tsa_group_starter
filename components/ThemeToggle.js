"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      // auto-detect system theme on first visit
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const auto = prefersDark ? "dark" : "light";
      setTheme(auto);
      document.documentElement.setAttribute("data-theme", auto);
    }
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <button
      className="inline-block px-5 py-2 rounded-lg bg-neutral text-error font-medium shadow-md hover:shadow-xl transition"
      onClick={toggle}
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
