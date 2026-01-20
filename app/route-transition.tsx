"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: EASE_OUT } }}
        exit={{ opacity: 0, y: -6, filter: "blur(10px)", transition: { duration: 0.2, ease: EASE_OUT } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
