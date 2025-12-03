"use client";

import React, { useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const year = new Date().getFullYear();

  const heroRef = useRef<HTMLDivElement | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });

  const yBox = useTransform(scrollYProgress, [0, 1], [150, 0]); // smaller movement for smoothness

  return (
    <>
      <Head>
        <title>Gatherly — Home</title>
        <meta name="description" content="Gatherly — Community Resource Hub" />
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header */}
      <Header />

      {/* Page Content */}
      <div className="pt-24 min-h-screen flex flex-col items-center bg-[#F4F6F7] font-sans text-[#37474F]">
        
        {/* Hero + Animated Box Row */}
        <div className="w-full max-w-6xl px-6 mt-6 flex flex-col lg:flex-row gap-10 items-start">
          
          {/* Left: Hero */}
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="w-full lg:w-1/2 border-l-4 border-[#26A69A] bg-white p-10 rounded-xl shadow-xl"
          >
            <h2
              className="text-5xl font-bold leading-snug tracking-tight mb-6 text-[#37474F]"
              style={{ fontFamily: "Momo Signature, sans-serif" }}
            >
              Community Resource Hub
            </h2>

            <p className="text-lg leading-relaxed mb-8 text-[#546E7A]">
              Explore local nonprofits, events, support services, and helpful community programs—
              all organized in one central place.
            </p>

            <Link
              href="/map"
              className="inline-block rounded-full bg-[#26A69A] px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-[#1F8D81]"
            >
              Launch Maps
            </Link>
          </motion.div>

          {/* Right: Animated Box */}
          <motion.div
            ref={boxRef}
            className="w-full lg:w-1/2 h-[450px] rounded-lg border border-[#90A4AE] bg-white/70 shadow"
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            style={{ y: yBox as unknown as number }}
          />
        </div>

        {/* Additional content blocks */}
        <div className="w-full max-w-4xl px-6 py-12 text-[#37474F] space-y-6">
          <div className="h-96 bg-white/70 rounded-lg border border-[#90A4AE] shadow" />
          <div className="h-96 bg-white/70 rounded-lg border border-[#90A4AE] shadow" />
        </div>

        {/* Footer */}
        <footer className="w-full p-4 text-left text-sm text-[#37474F] bg-white border-t border-[#B0BEC5] mt-4">
          <p className="underline hover:text-[#26A69A]">
            <b>Contact Our Community Staff:</b>
          </p>

          <div style={{ fontSize: "12px" }}>
            <a href="mailto:Gatherly@gmail.com" className="text-[black] mr-10">
              Gatherly@gmail.com
            </a>
          </div>

          <div style={{ fontSize: "12px" }}>
            <a href="tel:012-345-6789" className="text-[black] mr-12">
              012-345-6789
            </a>
          </div>

          <div style={{ fontSize: "12px" }}>
            <a href="#" className="text-[black] mr-12">
              [enter info]
            </a>
          </div>
        </footer>

        <footer className="w-full p-4 text-center text-sm text-[#607D8B] bg-white border-t border-[#B0BEC5] mt-10">
          © {year} Gatherly. All rights reserved.
        </footer>
      </div>
    </>
  );
}
