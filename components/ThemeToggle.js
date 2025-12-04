// components/ThemeToggle.js
import React, { useEffect } from "react";

export default function ThemeToggle() {
  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-md bg-[#26A69A] text-white hover:bg-[#1F8D81] transition"
    >
      Toggle Theme
    </button>
  );
}
