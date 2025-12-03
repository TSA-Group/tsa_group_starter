"use client";

import React, { useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const year = new Date().getFullYear();

  const heroRef = useRef(null);
  const boxRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: boxRef,
    offset: ["start end", "end start"],
  });

  const yBox = useTransform(scrollYProgress, [0, 1], [300, 0]);

  return (
    <>
      <Head>
        <title>Gatherly — Home</title>
        <meta name="description" content="Gatherly — Community Resource Hub" />
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap" rel="stylesheet" />
      </Head>

      {/* Animated Sticky Header */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.25,
          type: "spring",
          stiffness: 120
        }}
        className="fixed top-0 left-0 w-full z-50 bg-[#FFFFFF]/90 backdrop-blur-md shadow-md"
      >
        <Header />
      </motion.div>

      {/* Page Content */}
      <div className="pt-24 min-h-screen flex flex-col items-center bg-[#F4F6F7] font-sans text-[#37474F]">

        {/* Hero Section */}
        <motion.div
          ref={heroRef}
          initial={{ x: "0%" }}
          animate={{ x: "-60%" }}
          transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
          className="mx-auto w-full max-w-2xl border-l-4 border-[#26A69A] bg-white p-10 rounded-xl shadow-xl mb-20"
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

        {/* Scrollable content box */}
        <div className="w-full max-w-4xl px-6 py-12 text-[#37474F] space-y-6">

          <motion.div
            ref={boxRef}
            className="rounded-lg border border-[#90A4AE] bg-white/70 shadow"
            style={{
              y: yBox,
              height: "500px",
              width: "400px",
              marginLeft: "600px",
              marginBottom: "1000px",
            }}
          />

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
