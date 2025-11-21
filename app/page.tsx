"use client";

import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
  const year = new Date().getFullYear();

  // Hook for scroll animation
  const boxRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["0 1", "1 0"],
  });

  // Moves left as user scrolls
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <>
      <Head>
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Animated Sticky Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          type: "spring",
          stiffness: 120,
        }}
        className="fixed top-0 left-0 w-full z-50 bg-black"
      >
        <Header />
      </motion.div>

      {/* Main Content */}
      <div className="pt-20 min-h-screen flex flex-col items-center bg-black font-sans">

        {/* ╔══════════════════════════════════╗ */}
        {/* ║   THE BOX THAT SLIDES LEFT       ║ */}
        {/* ╚══════════════════════════════════╝ */}
        <motion.div
          ref={boxRef}
          style={{ x }}
          className="border-l-4 border-green-500 bg-black p-10 rounded-xl shadow-xl max-w-xl text-left mt-20"
        >
          <h2
            className="text-5xl font-bold leading-snug tracking-tight mb-6 text-green-400"
            style={{ fontFamily: 'Momo Signature, sans-serif' }}
          >
            Your Personal Geolocation Data Assembler
          </h2>

          <p className="text-lg leading-relaxed mb-8 text-green-200">
            Gatherly helps you find, organize, and visualize nearby locations with precision.
            Explore local data, discover insights, and connect your maps like never before.
          </p>

          <Link
            href="/map"
            className="inline-block rounded-full bg-green-600 px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700"
          >
            Launch Maps
          </Link>
        </motion.div>

        {/* Footer 1 */}
        <footer className="w-full p-4 text-center text-sm text-green-400 bg-black border-t border-green-900 mt-20">
          © {year} Gatherly. All rights reserved.
        </footer>

        {/* Footer 2 */}
        <footer className="w-full p-4 text-left text-sm text-green-400 bg-black border-t border-green-900">
          <a
            href="mailto:Gatherly@gmail.com"
            className="underline hover:text-green-400"
            style={{ color: "rgb(5,223,114)" }}
          >
            Gatherly@gmail.com
          </a>
        </footer>

      </div>
    </>
  );
}
