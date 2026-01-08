import localFont from "next/font/local";

export const geistSans = localFont({
  src: "../public/fonts/Geist-Regular.woff2",
  variable: "--font-geist-sans",
  display: "swap",
});

export const geistMono = localFont({
  src: "../public/fonts/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
  display: "swap",
});
