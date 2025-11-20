"use client";
import Head from "next/head";
import Link from "next/link";
import { Header } from "../components/Header";

export default function Home() {
  const year = new Date().getFullYear();

  
  return (
    <>
      <Head>
        <link href="https://fonts.cdnfonts.com/css/tan-buster" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Sticky header */}
      <div className="fixed top-0 left-0 w-full z-50 bg-black">
        <Header />
      </div>

      {/* Add padding-top so content doesn't hide under the fixed header */}
      <div className="pt-20 min-h-screen flex flex-col justify-center items-center bg-black font-sans">
        <main className="flex flex-col items-center justify-center text-center">
          <h2
            className="text-5xl font-bold leading-snug tracking-tight mb-6 text-green-400"
            style={{ fontFamily: "Momo Signature, sans-serif" }}
          >
            Your Personal Geolocation Data Assembler
          </h2>

          <p className="text-lg leading-relaxed max-w-3xl mb-8 text-green-200">
            Gatherly helps you find, organize, and visualize nearby locations with precision.
            Explore local data, discover insights, and connect your maps like never before.
          </p>

          <Link
            href="/map"
            className="inline-block rounded-full bg-green-600 px-8 py-3 text-white font-medium shadow-md transition-colors hover:bg-green-700"
          >
            Launch Maps
          </Link>
        </main>

        <footer className="w-full p-4 text-left text-sm text-green-400 bg-black border-t border-green-900 mt-10">
          © {year} Gatherly. All rights reserved.
          <p>
            <a
              href="mailto:Gatherly@gmail.com"
              className="underline hover:text-green-300"
              style={{ color: "green" }}
            >
              Gatherly@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
