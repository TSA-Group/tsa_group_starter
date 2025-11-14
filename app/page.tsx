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
        <link href="https://fonts.googleapis.com/css2?family=Momo+Signature&display=swap" rel="stylesheet" />
      </Head>

      {/* Animated header, can be further customized */}
      <Header />

      <nav className="w-full flex justify-end px-8 py-4 gap-8 select-none">
        <Link href="/" className="text-green-300 hover:text-green-100 transition font-semibold">Home</Link>
        <Link href="/resources" className="text-green-300 hover:text-green-100 transition font-semibold">Resources</Link>
        <Link href="/events" className="text-green-300 hover:text-green-100 transition font-semibold">Events</Link>
        <Link href="/contact" className="text-green-300 hover:text-green-100 transition font-semibold">Contact</Link>
      </nav>

      <div className="min-h-screen min-w-screen flex flex-col items-center justify-center bg-black font-sans">
        <main className="w-full max-w-4xl flex flex-col items-start px-8 py-16 mx-auto animate-fadein">
          <h2
            className="text-5xl font-black leading-snug tracking-tight mb-8 bg-gradient-to-r from-green-400 via-green-300 to-green-500 text-transparent bg-clip-text animate-gradient"
            style={{ fontFamily: "Momo Signature, sans-serif" }}
          >
            Your Personal Geolocation Data Assembler
          </h2>
          <p className="text-xl leading-relaxed mb-10 text-green-200">
            Gatherly helps you find, organize, and visualize nearby locations with precision.
            Explore local data, discover insights, and connect your maps like never before.
          </p>
          <Link
            href="/map"
            className="inline-block rounded-full bg-green-600 px-10 py-4 text-lg text-white font-semibold shadow-lg transition-all duration-200 hover:bg-green-700 hover:shadow-green-500/40 focus:ring-2 focus:ring-green-400 animate-slide-in"
          >
            Launch Maps
          </Link>
        </main>
        <footer className="w-full p-4 text-center text-[15px] text-green-700 bg-black border-t border-green-900 font-medium mt-12">
          © {year} Gatherly. All rights reserved.
        </footer>
      </div>

      {/* Example Animations (add in global styles or Tailwind config) */}
      <style>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 5s ease infinite;
        }
        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        .animate-fadein {
          animation: fadein 1s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(-30px);}
          to   { opacity: 1; transform: translateY(0);}
        }
        .animate-slide-in {
          animation: slidein 1s;
        }
        @keyframes slidein {
          from { opacity: 0; transform: translateY(20px);}
          to   { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </>
  );
}
