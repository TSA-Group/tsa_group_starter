"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  type MotionValue,
  type Variants,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";

// basically just categories for the events
type Category = { id: string; name: string };
type Activity = { id: string; name: string };

// all the stuff an event can have
type EventDoc = {
  id: string;
  title?: string;
  community?: string;
  activities?: string[];
  types?: string[];
  date?: string; // like "2026-01-17"
  startTime?: string; // like "10:13"
  endTime?: string; // like "22:14"
  startAt?: Timestamp;
  endAt?: Timestamp;
  venue?: string;
  address?: string;
  attendees?: number;
  spots?: number;
  description?: string;
};

// little badge thing for activities
const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
    {children}
  </span>
);

// generates google maps link for an event
function mapsHref(event: EventDoc) {
  const searchQuery = `${event.venue ?? ""}, ${event.address ?? ""}`.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
}

// formats the date to look nice
function formatDateLabel(event: EventDoc) {
  if (event.startAt) {
    return event.startAt.toDate().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (event.date) {
    const parsedDate = new Date(`${event.date}T00:00:00`);
    return Number.isNaN(parsedDate.getTime())
      ? event.date
      : parsedDate.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  return "";
}

// formats time range like "2:00 PM – 5:00 PM"
function formatTimeRange(event: EventDoc) {
  if (event.startAt && event.endAt) {
    const startTimeFormatted = event.startAt
      .toDate()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const endTimeFormatted = event.endAt
      .toDate()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    return `${startTimeFormatted} – ${endTimeFormatted}`;
  }

  if (event.startTime && event.endTime) {
    const startTimeFormatted = new Date(`1970-01-01T${event.startTime}:00`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    const endTimeFormatted = new Date(`1970-01-01T${event.endTime}:00`).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${startTimeFormatted} – ${endTimeFormatted}`;
  }

  return "";
}

// animation easing we use everywhere - makes stuff smooth
const SMOOTH_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// animation for the whole page - staggers children
const pageAnimation: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

// header slides up and fades in
const headerSlideUp: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: SMOOTH_EASE },
  },
};

// filter panel slides up
const panelSlideUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: SMOOTH_EASE },
  },
};

// grid wrapper for staggering cards
const gridAnimation: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

// each event card pops in with a slight scale
const cardPopIn: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.985, filter: "blur(12px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: SMOOTH_EASE },
  },
  exit: { opacity: 0, y: 10, scale: 0.985, transition: { duration: 0.18 } },
};

// subtle fade in effect
const fadeInEffect: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: SMOOTH_EASE },
  },
};

export default function EventsPage() {
  // check if user has reduced motion enabled (accessibility)
  const shouldReduceMotion = useReducedMotion();
  
  // main state for all events from firebase
  const [allEvents, setAllEvents] = useState<EventDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // filter states - what the user selected
  const [currentCategory, setCurrentCategory] = useState<string>("all");
  const [currentActivities, setCurrentActivities] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortMethod, setSortMethod] = useState<"upcoming" | "popular">("upcoming");

  // all the categories we support
  const allCategories: Category[] = [
    { id: "all", name: "All" },
    { id: "Community", name: "Community" },
    { id: "Meetup", name: "Meetups" },
    { id: "Clothing", name: "Clothing" },
    { id: "Tutoring", name: "Tutoring" },
    { id: "Food Pantry", name: "Food Pantry" },
    { id: "Cleanup", name: "Cleanup" },
    { id: "Workshop", name: "Workshop" },
    { id: "Other", name: "Other" },
  ];

  // all the activity types
  const allActivities: Activity[] = [
    { id: "Food", name: "Food" },
    { id: "Volunteering", name: "Volunteering" },
    { id: "Education", name: "Education" },
    { id: "Donations", name: "Donations" },
    { id: "Outdoors", name: "Outdoors" },
    { id: "Family", name: "Family" },
  ];

  // grab events from firebase when page loads
  useEffect(() => {
    const eventsQuery = query(collection(db, "events"), orderBy("startAt", "asc"));

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        const eventsList: EventDoc[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<EventDoc, "id">;
          return { id: doc.id, ...data };
        });
        setAllEvents(eventsList);
        setIsLoading(false);
      },
      (error) => {
        console.error("Firestore read error:", error);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // filter and sort events based on what user selected
  const filteredEvents = useMemo(() => {
    const searchQuery = searchText.trim().toLowerCase();

    // first filter by category
    let results =
      currentCategory === "all"
        ? allEvents
        : allEvents.filter((event) => (event.types || []).includes(currentCategory));

    // then filter by activities if any selected
    if (currentActivities.length > 0) {
      results = results.filter((event) =>
        currentActivities.every((activity) => (event.activities || []).includes(activity)),
      );
    }

    // search filter - checks title, description, venue, address
    if (searchQuery) {
      results = results.filter((event) =>
        `${event.title ?? ""} ${event.description ?? ""} ${event.venue ?? ""} ${event.address ?? ""}`
          .toLowerCase()
          .includes(searchQuery),
      );
    }

    // sort by popular (most attendees) or upcoming (soonest date)
    if (sortMethod === "popular") {
      results = [...results].sort((a, b) => (b.attendees ?? 0) - (a.attendees ?? 0));
    } else {
      results = [...results].sort((a, b) => {
        const timeA = a.startAt?.toMillis?.() ?? new Date(a.date || "").getTime();
        const timeB = b.startAt?.toMillis?.() ?? new Date(b.date || "").getTime();
        return timeA - timeB;
      });
    }

    return results;
  }, [allEvents, currentCategory, currentActivities, searchText, sortMethod]);

  // toggle an activity filter on/off
  const toggleActivity = (activityId: string) =>
    setCurrentActivities((previous) =>
      previous.includes(activityId) ? previous.filter((x) => x !== activityId) : [...previous, activityId],
    );

  // reset all filters back to default
  const clearAllFilters = () => {
    setCurrentCategory("all");
    setCurrentActivities([]);
    setSearchText("");
    setSortMethod("upcoming");
  };

  // scroll tracking for animations
  const { scrollY, scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  // velocity tracking for tilt effect
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 80, damping: 30 });
  const headerTilt = useTransform(smoothVelocity, [-1600, 0, 1600], [-1.0, 0, 1.0]);

  // mouse position tracking for glow effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const glowPositionX = useTransform(mouseX, (value) => `${value}px`);
  const glowPositionY = useTransform(mouseY, (value) => `${value}px`);

  // background color changes as you scroll
  const backgroundColor = useTransform(
    smoothScrollProgress,
    [0, 0.35, 0.7, 1],
    ["#F6FAFF", "#F2F7FF", "#EEF5FF", "#EAF0FF"],
  );

  // subtle grey overlay appears mid-scroll
  const greyOverlay = useTransform(
    smoothScrollProgress,
    [0.25, 0.55],
    ["rgba(226,232,240,0)", "rgba(203,213,225,0.55)"],
  );

  // darker overlay appears near bottom
  const darkOverlay = useTransform(
    smoothScrollProgress,
    [0.62, 1],
    ["rgba(15,23,42,0)", "rgba(15,23,42,0.12)"],
  );

  // progress bar at top scales with scroll
  const progressBarScale = useTransform(smoothScrollProgress, [0, 1], [0.06, 1]);

  // grain texture moves with scroll for depth
  const grainOffsetX = useTransform(scrollY, [0, 1200], [0, -110]);
  const grainOffsetY = useTransform(scrollY, [0, 1200], [0, -80]);

  // floating orbs in background - each has different properties
  const floatingOrbs = useMemo(
    () => [
      { size: 360, color: "rgba(59,130,246,0.16)", top: 12, left: 6, speed: 0.22 },
      { size: 520, color: "rgba(147,197,253,0.14)", top: 48, left: 76, speed: 0.33 },
      { size: 260, color: "rgba(15,23,42,0.10)", top: 72, left: 18, speed: 0.15 },
      { size: 420, color: "rgba(147,197,253,0.10)", top: 20, left: 86, speed: 0.26 },
      { size: 320, color: "rgba(59,130,246,0.12)", top: 62, left: 52, speed: 0.21 },
    ],
    [],
  );

  // motion values for each orb's position
  const orbXPositions: MotionValue<number>[] = floatingOrbs.map(() => useMotionValue(0));
  const orbYPositions: MotionValue<number>[] = floatingOrbs.map(() => useMotionValue(0));

  // track mouse separately for orb calculations
  const mousePosition = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // update orb positions based on scroll and mouse
  useMotionValueEvent(scrollY, "change", (scrollPosition) => {
    const viewportHeight = window.innerHeight || 1;
    const viewportWidth = window.innerWidth || 1;
    const totalScrollRange = document.body.scrollHeight - viewportHeight || 1;

    const mouse = mousePosition.current;

    floatingOrbs.forEach((orb, index) => {
      // mouse influence on horizontal movement
      const mouseInfluenceX = (mouse.x / viewportWidth - 0.5) * 180 * orb.speed;
      // mouse influence on vertical movement
      const mouseInfluenceY = (mouse.y / viewportHeight - 0.5) * 180 * orb.speed;
      // scroll influence on vertical movement
      const scrollInfluenceY = -240 * orb.speed * (scrollPosition / totalScrollRange);

      orbXPositions[index].set(mouseInfluenceX);
      orbYPositions[index].set(scrollInfluenceY + mouseInfluenceY);
    });
  });

  return (
    <motion.div
      variants={pageAnimation}
      initial="hidden"
      animate="show"
      style={{ background: backgroundColor }}
      className="relative min-h-screen overflow-hidden text-slate-900 antialiased"
    >
      {/* progress bar at the very top */}
      <motion.div
        style={{ scaleX: progressBarScale }}
        className="fixed left-0 top-0 h-1 w-full origin-left bg-gradient-to-r from-blue-900 via-blue-600 to-blue-300 z-[60]"
      />

      {/* mouse-following glow effect */}
      <motion.div
        aria-hidden
        style={{
          background: useTransform([glowPositionX, glowPositionY], ([x, y]) => {
            return `radial-gradient(420px circle at ${x} ${y}, rgba(59,130,246,0.18), rgba(59,130,246,0.06) 35%, rgba(255,255,255,0) 70%)`;
          }),
        }}
        className="fixed inset-0 pointer-events-none -z-30"
      />

      {/* grain texture overlay - moves with scroll */}
      <motion.div
        aria-hidden
        style={{ x: grainOffsetX, y: grainOffsetY, opacity: shouldReduceMotion ? 0.05 : 0.085 }}
        className="fixed inset-0 pointer-events-none -z-30"
      >
        <div
          className="w-[140%] h-[140%]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
      </motion.div>

      {/* floating orbs in background */}
      {floatingOrbs.map((orb, index) => (
        <motion.div
          key={index}
          style={{
            x: shouldReduceMotion ? 0 : orbXPositions[index],
            y: shouldReduceMotion ? 0 : orbYPositions[index],
            width: orb.size,
            height: orb.size,
            top: `${orb.top}%`,
            left: `${orb.left}%`,
            backgroundColor: orb.color,
          }}
          className="absolute rounded-full pointer-events-none -z-20 blur-3xl"
        />
      ))}

      {/* subtle grey overlay layer */}
      <motion.div
        style={{ backgroundColor: greyOverlay }}
        className="fixed inset-0 pointer-events-none -z-20"
      />

      {/* darker overlay layer */}
      <motion.div
        style={{ backgroundColor: darkOverlay }}
        className="fixed inset-0 pointer-events-none -z-20"
      />

      {/* grid pattern overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.20] [background-image:linear-gradient(to_right,rgba(20,59,140,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,59,140,0.10)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      {/* main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* header section */}
        <motion.header variants={headerSlideUp} style={{ rotate: shouldReduceMotion ? 0 : headerTilt }} className="mb-8">
          <motion.div
            variants={fadeInEffect}
            className="rounded-[28px] border border-blue-200 bg-white/65 backdrop-blur-xl shadow-[0_18px_60px_rgba(15,23,42,0.10)] px-6 sm:px-10 py-8 relative overflow-hidden"
          >
            {/* decorative blobs inside header */}
            <div className="pointer-events-none absolute -top-20 -left-16 w-[420px] h-[420px] rounded-full bg-blue-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 w-[460px] h-[460px] rounded-full bg-blue-500/10 blur-3xl" />

            <div className="text-xs sm:text-sm font-semibold text-blue-700 tracking-[0.22em]">
              DISCOVER • VOLUNTEER • CONNECT
            </div>
            <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-blue-950 via-blue-800 to-blue-600">
              Gatherly — Community Events
            </h1>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Discover local volunteering opportunities and community events in Cross Creek.
            </p>

            {/* scroll indicator with bounce animation */}
            <motion.div
              className="mt-5 text-blue-700/80 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              <motion.span
                className="inline-flex items-center gap-2"
                animate={shouldReduceMotion ? undefined : { y: [0, 4, 0] }}
                transition={shouldReduceMotion ? undefined : { duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="font-semibold">Scroll</span>
                <span className="opacity-80">to explore</span>
                <span aria-hidden>↓</span>
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.header>

        {/* filter panel */}
        <motion.div
          variants={panelSlideUp}
          className="bg-white/70 backdrop-blur-xl border border-blue-200 rounded-3xl p-5 mb-10 shadow-[0_18px_60px_rgba(15,23,42,0.08)] relative overflow-hidden"
        >
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -top-16 -right-20 w-[360px] h-[360px] rounded-full bg-blue-300/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-24 w-[420px] h-[420px] rounded-full bg-sky-300/10 blur-3xl" />

          {/* filter header with clear button */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#143B8C]">Filter</h2>
              <p className="text-sm text-slate-600">Choose what you want to see.</p>
            </div>

            <motion.button
              onClick={clearAllFilters}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl text-sm border border-blue-200 bg-white/80 hover:bg-blue-50 transition shadow-sm"
            >
              Clear
            </motion.button>
          </div>

          {/* category filter buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {allCategories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                  currentCategory === category.id
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white/80 text-slate-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* activity filter buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {allActivities.map((activity) => (
              <motion.button
                key={activity.id}
                onClick={() => toggleActivity(activity.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-full text-sm transition shadow-sm ${
                  currentActivities.includes(activity.id)
                    ? "bg-blue-600 text-white border border-blue-600"
                    : "bg-white/80 text-slate-700 border border-blue-200 hover:bg-blue-50"
                }`}
              >
                {activity.name}
              </motion.button>
            ))}
          </div>

          {/* search bar and sort toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* search input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-blue-700/60">
                🔎
              </div>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search events..."
                className="w-full bg-white/85 placeholder:text-slate-400 text-slate-800 pl-10 pr-4 py-2.5 rounded-2xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
              />
            </div>

            {/* sort toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort:</span>
              <div className="inline-flex rounded-full bg-white/85 border border-blue-200 p-1 shadow-sm">
                {["upcoming", "popular"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setSortMethod(option as "upcoming" | "popular")}
                    className={`px-4 py-1 text-sm rounded-full transition ${
                      sortMethod === option ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50"
                    }`}
                  >
                    {option === "upcoming" ? "Upcoming" : "Popular"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* events grid */}
        <motion.div variants={gridAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="col-span-full rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl p-6 text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                Loading events...
              </motion.div>
            ) : filteredEvents.length === 0 ? (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                className="col-span-full rounded-3xl border border-blue-200 bg-white/70 backdrop-blur-xl p-6 text-slate-700 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
              >
                No events found.
              </motion.div>
            ) : (
              filteredEvents.map((event) => {
                // calculate how full the event is
                const currentAttendees = event.attendees ?? 0;
                const totalSpots = event.spots ?? 0;
                const percentFull = totalSpots > 0 ? Math.round((currentAttendees / totalSpots) * 100) : 0;
                const spotsRemaining = Math.max(0, totalSpots - currentAttendees);

                const eventDate = formatDateLabel(event);
                const eventTime = formatTimeRange(event);

                return (
                  <motion.article
                    key={event.id}
                    layout
                    variants={cardPopIn}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    className="bg-white/75 backdrop-blur-xl border border-blue-200 rounded-3xl p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_80px_rgba(15,23,42,0.12)] hover:border-blue-300 relative overflow-hidden"
                  >
                    {/* decorative blobs for each card */}
                    <div className="pointer-events-none absolute -top-16 -left-16 w-[240px] h-[240px] rounded-full bg-blue-300/15 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -right-16 w-[280px] h-[280px] rounded-full bg-sky-300/10 blur-3xl" />

                    <div className="relative">
                      {/* event title */}
                      <h3 className="text-xl font-semibold mb-1 text-slate-900">
                        {event.title ?? "Untitled Event"}
                      </h3>

                      {/* venue name */}
                      <p className="text-slate-700 text-sm font-medium">{event.venue ?? ""}</p>

                      {/* address */}
                      {event.address ? <p className="text-slate-600 text-sm">{event.address}</p> : null}

                      {/* date and time */}
                      {(eventDate || eventTime) && (
                        <p className="text-slate-700 text-sm mt-1">
                          {eventDate}
                          {eventTime ? ` • ${eventTime}` : ""}
                        </p>
                      )}

                      {/* description */}
                      {event.description ? <p className="text-slate-700 text-sm mt-3">{event.description}</p> : null}

                      {/* activity chips */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {(event.activities || []).map((activity) => (
                          <Chip key={activity}>{activity}</Chip>
                        ))}
                      </div>

                      {/* progress bar showing how full event is */}
                      <div className="mt-4">
                        <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, Math.max(0, percentFull))}%` }}
                            transition={{ duration: 0.7, ease: SMOOTH_EASE }}
                            className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 mt-1">
                          <span>{percentFull}% filled</span>
                          <span>{spotsRemaining} spots left</span>
                        </div>
                      </div>

                      {/* register button */}
                      <div className="grid grid-cols-2 gap-2 mt-5">
                        <Link
                          href={`/events/register?id=${event.id}`}
                          className="col-span-2 w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99] shadow-sm"
                        >
                          Register
                        </Link>
                      </div>

                      {/* view on maps link */}
                      {(event.venue || event.address) && (
                        <a
                          href={mapsHref(event)}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
                        >
                          View on Maps <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
