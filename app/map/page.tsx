"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import Image from "next/image";

/** ---------- Types ---------- */
interface LatLng {
  lat: number;
  lng: number;
}

type EventType =
  | "Community Event"
  | "Park & Trails"
  | "Fitness"
  | "Grocery"
  | "Library"
  | "Support Services"
  | "Food Pantry"
  | "Volunteer Opportunity";

type ActivityType =
  | "Family"
  | "Outdoors"
  | "Food"
  | "Education"
  | "Health"
  | "Support"
  | "Volunteering"
  | "Shopping";

type LocationItem = {
  id: string;
  title: string;
  address: string;
  position: LatLng;
  eventType: EventType;
  activities: ActivityType[];
  when: string;
  host?: string;
  description?: string;
  featured?: boolean;
};

/** ---------- Motion ---------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const pop: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.35 } },
};

/** ---------- Cross Creek Area Resources (sample dataset) ----------
 * NOTE: Coordinates are approximate for Cross Creek Ranch / Fulshear area.
 * Swap for exact places later if needed.
 */
const ALL_LOCATIONS: LocationItem[] = [
  {
    id: "ful-1",
    title: "Cross Creek Ranch Fitness Center",
    address: "Cross Creek Ranch, Fulshear, TX (Fitness Center)",
    position: { lat: 29.7008, lng: -95.9082 },
    eventType: "Fitness",
    activities: ["Health", "Family"],
    when: "Daily • 5:00 AM – 10:00 PM",
    host: "Cross Creek Ranch",
  },
  {
    id: "ful-2",
    title: "Flewellen Creek Park & Trails",
    address: "Flewellen Creek Park, Fulshear, TX",
    position: { lat: 29.6972, lng: -95.8968 },
    eventType: "Park & Trails",
    activities: ["Outdoors", "Family"],
    when: "Daily • Sunrise – Sunset",
    host: "Community Parks",
  },
  {
    id: "ful-3",
    title: "Cross Creek Ranch Welcome Center",
    address: "Cross Creek Ranch Welcome Center, Fulshear, TX",
    position: { lat: 29.6988, lng: -95.9056 },
    eventType: "Support Services",
    activities: ["Support", "Family"],
    when: "Mon–Fri • 9:00 AM – 5:00 PM",
    host: "Community Staff",
  },
  {
    id: "ful-4",
    title: "Cross Creek Ranch Community Pool",
    address: "Cross Creek Ranch Pool, Fulshear, TX",
    position: { lat: 29.7034, lng: -95.8994 },
    eventType: "Community Event",
    activities: ["Family", "Health"],
    when: "Seasonal • Check community schedule",
    host: "Cross Creek Ranch",
  },
  {
    id: "ful-5",
    title: "HEB (Nearby Grocery)",
    address: "Fulshear, TX area grocery (HEB)",
    position: { lat: 29.6912, lng: -95.9185 },
    eventType: "Grocery",
    activities: ["Shopping", "Food", "Family"],
    when: "Daily • 6:00 AM – 11:00 PM",
    host: "HEB",
  },
  {
    id: "ful-6",
    title: "Fulshear Branch Library (Nearby)",
    address: "Fulshear, TX (Public Library)",
    position: { lat: 29.6883, lng: -95.9004 },
    eventType: "Library",
    activities: ["Education", "Family"],
    when: "Mon–Sat • Hours vary",
    host: "Public Library",
  },
  {
    id: "ful-7",
    title: "Community Food Pantry Support (Nearby)",
    address: "Fulshear/Katy area food pantry support",
    position: { lat: 29.6796, lng: -95.9222 },
    eventType: "Food Pantry",
    activities: ["Food", "Support", "Family"],
    when: "Weekly • Appointment or walk-in hours",
    host: "Community Partner",
  },
  {
    id: "ful-8",
    title: "Volunteer Cleanup — Trails & Park Day",
    address: "Cross Creek Trails (meet near main trailhead)",
    position: { lat: 29.7051, lng: -95.9041 },
    eventType: "Volunteer Opportunity",
    activities: ["Volunteering", "Outdoors", "Family"],
    when: "Sat • 9:00 AM (Monthly)",
    host: "Resident Volunteers",
  },
  {
    id: "ful-9",
    title: "Neighborhood Meetup — Community Pavilion",
    address: "Cross Creek Ranch Pavilion / Gathering Spot",
    position: { lat: 29.6999, lng: -95.8989 },
    eventType: "Community Event",
    activities: ["Family", "Support"],
    when: "Sun • 4:00 PM (Weekly)",
    host: "Neighborhood Group",
  },
  {
    id: "ful-10",
    title: "After-School Study & Tutoring Meetup",
    address: "Nearby library study room / community study space",
    position: { lat: 29.6891, lng: -95.901 },
    eventType: "Support Services",
    activities: ["Education", "Family", "Support"],
    when: "Tue/Thu • 5:30 PM",
    host: "Volunteer Tutors",
  },
];

const EVENT_OPTIONS: EventType[] = [
  "Community Event",
  "Park & Trails",
  "Fitness",
  "Grocery",
  "Library",
  "Support Services",
  "Food Pantry",
  "Volunteer Opportunity",
];

const ACTIVITY_OPTIONS: ActivityType[] = [
  "Family",
  "Outdoors",
  "Food",
  "Education",
  "Health",
  "Support",
  "Volunteering",
  "Shopping",
];

/** ---------- Page ---------- */
export default function Page() {
  const apiKey = "AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM";

  // Cross Creek Ranch-ish default center
  const [center, setCenter] = useState<LatLng>({ lat: 29.6995, lng: -95.904 });
  const [zoom, setZoom] = useState(13);

  // Places autocomplete (map search)
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  // Directory search (resource hub search)
  const [directoryQuery, setDirectoryQuery] = useState("");

  // Active marker
  const [activeId, setActiveId] = useState<string | null>(null);

  /** ---------- Filters ---------- */
  const [eventFilters, setEventFilters] = useState<EventType[]>([]);
  const [activityFilters, setActivityFilters] = useState<ActivityType[]>([]);
  const [radiusMode, setRadiusMode] = useState<"All" | "Near Center">("All");

  const filteredLocations = useMemo(() => {
    const q = directoryQuery.trim().toLowerCase();

    const passQuery = (loc: LocationItem) => {
      if (!q) return true;
      const haystack = [
        loc.title,
        loc.address,
        loc.eventType,
        loc.when,
        loc.host ?? "",
        loc.description ?? "",
        ...loc.activities,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    };

    const passEvent = (loc: LocationItem) =>
      eventFilters.length === 0 || eventFilters.includes(loc.eventType);

    const passActivity = (loc: LocationItem) =>
      activityFilters.length === 0 ||
      activityFilters.every((a) => loc.activities.includes(a));

    const passRadius = (loc: LocationItem) => {
      if (radiusMode === "All") return true;
      const dx = loc.position.lat - center.lat;
      const dy = loc.position.lng - center.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 0.09; // "nearby"
    };

    return ALL_LOCATIONS.filter(
      (loc) =>
        passQuery(loc) &&
        passEvent(loc) &&
        passActivity(loc) &&
        passRadius(loc),
    );
  }, [
    directoryQuery,
    eventFilters,
    activityFilters,
    radiusMode,
    center.lat,
    center.lng,
  ]);

  const featured = useMemo(
    () => ALL_LOCATIONS.filter((l) => l.featured).slice(0, 3),
    [],
  );

  const activeCount =
    eventFilters.length +
    activityFilters.length +
    (radiusMode === "Near Center" ? 1 : 0) +
    (directoryQuery.trim() ? 1 : 0);

  const handleCenter = (loc: LocationItem) => {
    setActiveId(loc.id);
    setCenter(loc.position);
    setZoom(15);
    setSelectedPlace(loc.position);
  };

  return (
    <APIProvider
      apiKey="AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM"
      libraries={["places"]}
    >
      {/* LIGHT THEME to match screenshot */}
      <div className="min-h-screen bg-white text-slate-900">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A]">
                  Cross Creek Community Resource Hub
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  Explore community resources, events, and support — all in one
                  place.
                </p>
              </div>

              <AnimatePresence>
                {activeCount > 0 && (
                  <motion.div
                    variants={pop}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -6 }}
                    className="text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-900"
                  >
                    {activeCount} filter{activeCount === 1 ? "" : "s"} active
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Featured / Highlights (TSA requirement) */}
          <motion.section
            variants={fadeUp}
            className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm p-5 sm:p-6 mb-6"
          >
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">
                  Spotlight Resources
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  A quick look at key resources + upcoming events in the Cross
                  Creek community.
                </p>
              </div>
            </div>

            {/* ✅ Featured Resources (your existing 3 cards) */}
            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Featured resources
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map((loc) => (
                  <motion.button
                    key={loc.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCenter(loc)}
                    className="text-left rounded-2xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="text-xs font-semibold text-blue-900">
                      {loc.eventType}
                    </div>
                    <div className="mt-1 text-base font-bold text-slate-900">
                      {loc.title}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {loc.description ?? loc.address}
                    </div>
                    <div className="mt-3 inline-flex text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-900">
                      {loc.when}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ✅ Spotlight Events (NEW: 2 motion cards) */}
            <div className="mt-6">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Spotlight events
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 inline-flex px-2 py-1 rounded-full">
                    Community Event
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    Cross Creek Neighborhood Meetup
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Meet neighbors, share updates, and learn about new community
                    resources.
                  </p>

                  <div className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">When:</span> Saturday • 4:00
                    PM
                    <br />
                    <span className="font-semibold">Where:</span> Community
                    Pavilion (Cross Creek)
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeUp}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 inline-flex px-2 py-1 rounded-full">
                    Volunteer Opportunity
                  </div>

                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    Trails & Park Cleanup Day
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    Help keep Cross Creek beautiful — gloves and bags provided.
                  </p>

                  <div className="mt-3 text-sm text-slate-700">
                    <span className="font-semibold">When:</span> Sunday • 9:00
                    AM
                    <br />
                    <span className="font-semibold">Where:</span> Main Trailhead
                    (Cross Creek)
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters */}
            <motion.aside variants={fadeUp} className="lg:col-span-4">
              <FilterBox
                eventFilters={eventFilters}
                setEventFilters={setEventFilters}
                activityFilters={activityFilters}
                setActivityFilters={setActivityFilters}
                radiusMode={radiusMode}
                setRadiusMode={setRadiusMode}
                onClear={() => {
                  setEventFilters([]);
                  setActivityFilters([]);
                  setRadiusMode("All");
                  setDirectoryQuery("");
                }}
              />
            </motion.aside>

            {/* Map + Search + List */}
            <div className="lg:col-span-8 space-y-6">
              {/* Map Card — IMPORTANT: overflow-visible so dropdown isn't clipped */}
              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-visible"
              >
                <div className="p-4 sm:p-5 border-b border-blue-200/60">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Interactive Resource Map
                      </h2>
                      <p className="text-sm text-slate-600">
                        Search the directory or search the map (autocomplete).
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 bg-white text-blue-900"
                    >
                      {`Showing ${filteredLocations.length} location${
                        filteredLocations.length === 1 ? "" : "s"
                      }`}
                    </motion.div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  {/* Map container keeps overflow-hidden */}
                  <div className="w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl border border-blue-200 overflow-hidden bg-white">
                    <Map
                      mapId="8859a83a13a834f6eeef1c63"
                      center={center}
                      zoom={zoom}
                      gestureHandling="greedy"
                      disableDefaultUI={false}
                      onClick={() => setActiveId(null)}
                      className="w-full h-full"
                    >
                      {filteredLocations.map((loc) => (
                        <AdvancedMarker key={loc.id} position={loc.position}>
                          <HoverMarker
                            location={loc}
                            activeId={activeId}
                            setActiveId={setActiveId}
                            onCenter={handleCenter}
                          />
                        </AdvancedMarker>
                      ))}

                      {/* Selected place pin (from map search) */}
                      {selectedPlace && (
                        <AdvancedMarker position={selectedPlace}>
                          <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow" />
                        </AdvancedMarker>
                      )}
                    </Map>
                  </div>

                  {/* Search — dropdown is now VERY visible (z-50, not clipped) */}
                  <div className="mt-4 relative z-50">
                    <SearchBox
                      directoryQuery={directoryQuery}
                      setDirectoryQuery={setDirectoryQuery}
                      directoryResults={ALL_LOCATIONS}
                      onDirectoryPick={(loc) => handleCenter(loc)}
                      input={input}
                      setInput={setInput}
                      predictions={predictions}
                      setPredictions={setPredictions}
                      setCenter={(loc) => {
                        setCenter(loc);
                        setZoom(15);
                      }}
                      setSelectedPlace={setSelectedPlace}
                    />
                  </div>
                </div>
              </motion.section>

              {/* Results List */}
              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-blue-200/60">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                    Resource Directory
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tap a card to center it on the map.
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  <AnimatePresence mode="popLayout">
                    {filteredLocations.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-blue-200 bg-white p-5 text-blue-900"
                      >
                        No matches. Try removing a filter or changing your
                        search.
                      </motion.div>
                    ) : (
                      <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {filteredLocations.map((loc) => (
                          <motion.button
                            key={loc.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleCenter(loc)}
                            className="text-left rounded-2xl border border-blue-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-blue-900">
                                  {loc.eventType}
                                </div>
                                <div className="mt-1 text-base font-bold text-slate-900">
                                  {loc.title}
                                </div>
                              </div>

                              <span className="shrink-0 text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-900">
                                {loc.when}
                              </span>
                            </div>

                            <div className="mt-2 text-sm text-slate-600">
                              {loc.address}
                            </div>

                            {loc.description && (
                              <div className="mt-2 text-sm text-slate-600">
                                {loc.description}
                              </div>
                            )}

                            <div className="mt-3 flex flex-wrap gap-2">
                              {loc.activities.slice(0, 6).map((a) => (
                                <span
                                  key={a}
                                  className="text-xs px-2 py-1 rounded-full border border-blue-200 text-blue-900 bg-blue-50"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.section>

              {/* Extra content (TSA requirement: additional content) */}
              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-blue-200/60">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                    Helpful Info
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tips for using the hub + quick guidance for residents.
                  </p>
                </div>
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard
                    title="How to use this hub"
                    lines={[
                      "Use Filters to narrow by category and activities.",
                      "Use Search directory to find resources by keyword.",
                      "Use Search map to jump to any place by typing an address/place name.",
                      "Tap any resource card to center it on the map.",
                    ]}
                  />
                  <InfoCard
                    title="Emergency & urgent needs"
                    lines={[
                      "If this is an emergency, call local emergency services.",
                      "For urgent food or support needs, check 'Food Pantry' or 'Support Services' filters.",
                      "For after-hours info, use the community Welcome Center during business hours for guidance.",
                    ]}
                  />
                </div>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </div>
    </APIProvider>
  );
}

/** ---------- Filter Box ---------- */
function FilterBox({
  eventFilters,
  setEventFilters,
  activityFilters,
  setActivityFilters,
  radiusMode,
  setRadiusMode,
  onClear,
}: {
  eventFilters: EventType[];
  setEventFilters: (v: EventType[]) => void;
  activityFilters: ActivityType[];
  setActivityFilters: (v: ActivityType[]) => void;
  radiusMode: "All" | "Near Center";
  setRadiusMode: (v: "All" | "Near Center") => void;
  onClear: () => void;
}) {
  const toggle = <T,>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const hasAny =
    eventFilters.length > 0 ||
    activityFilters.length > 0 ||
    radiusMode === "Near Center";

  return (
    <div className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-blue-200/60">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
              Filter
            </h2>
            <p className="text-sm text-slate-600">
              Choose what you want to see.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: hasAny ? 1.03 : 1 }}
            whileTap={{ scale: hasAny ? 0.98 : 1 }}
            onClick={onClear}
            disabled={!hasAny}
            className={`text-sm px-3 py-2 rounded-xl border transition ${
              hasAny
                ? "border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
                : "border-slate-200 text-slate-400 cursor-not-allowed bg-white"
            }`}
          >
            Clear
          </motion.button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Radius */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Area</div>
          <div className="mt-2 flex gap-2">
            {(["All", "Near Center"] as const).map((opt) => {
              const active = radiusMode === opt;
              return (
                <motion.button
                  key={opt}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setRadiusMode(opt)}
                  className={`px-3 py-2 rounded-xl border text-sm transition ${
                    active
                      ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                      : "border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
                  }`}
                >
                  {opt === "All" ? "All" : "Near map center"}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Event Type */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Category</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {EVENT_OPTIONS.map((e) => {
              const active = eventFilters.includes(e);
              return (
                <motion.button
                  key={e}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setEventFilters(toggle(eventFilters, e))}
                  className={`px-3 py-2 rounded-full border text-sm transition ${
                    active
                      ? "border-blue-400 bg-white text-blue-900 shadow-sm"
                      : "border-blue-200 bg-blue-50 text-slate-700 hover:bg-white"
                  }`}
                >
                  {e}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Activities */}
        <div>
          <div className="text-sm font-semibold text-slate-900">Activities</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map((a) => {
              const active = activityFilters.includes(a);
              return (
                <motion.button
                  key={a}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActivityFilters(toggle(activityFilters, a))}
                  className={`px-3 py-2 rounded-full border text-sm transition ${
                    active
                      ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                      : "border-blue-200 bg-blue-50 text-slate-700 hover:bg-white"
                  }`}
                >
                  {a}
                </motion.button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-slate-600">
            Tip: selecting multiple activities means a resource must match{" "}
            <span className="font-semibold">all</span> of them.
          </p>
        </div>
      </div>
    </div>
  );
}

/** ---------- SearchBox (Directory + Places) ----------
 * FIX: dropdown visibility
 * - parent has relative z-50
 * - dropdown has z-[9999]
 * - map card uses overflow-visible
 */
function SearchBox({
  directoryQuery,
  setDirectoryQuery,
  directoryResults,
  onDirectoryPick,
  input,
  setInput,
  predictions,
  setPredictions,
  setCenter,
  setSelectedPlace,
}: {
  directoryQuery: string;
  setDirectoryQuery: (val: string) => void;
  directoryResults: LocationItem[];
  onDirectoryPick: (loc: LocationItem) => void;

  input: string;
  setInput: (val: string) => void;
  predictions: google.maps.places.AutocompletePrediction[];
  setPredictions: (preds: google.maps.places.AutocompletePrediction[]) => void;
  setCenter: (loc: LatLng) => void;
  setSelectedPlace: (loc: LatLng | null) => void;
}) {
  const placesLib = useMapsLibrary("places");
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );
  const boxRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"directory" | "places">("directory");

  // init service
  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new placesLib.AutocompleteService();
    }
  }, [placesLib]);

  // fetch predictions
  useEffect(() => {
    if (mode !== "places") return;
    const q = input.trim();
    if (!serviceRef.current || q.length < 2 || !open) {
      setPredictions([]);
      return;
    }

    const handle = window.setTimeout(() => {
      serviceRef.current?.getPlacePredictions({ input: q }, (res) => {
        setPredictions(res || []);
      });
    }, 120);

    return () => window.clearTimeout(handle);
  }, [mode, input, open, setPredictions]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // directory results
  const dirMatches = useMemo(() => {
    const q = directoryQuery.trim().toLowerCase();
    if (!q) return [];
    return directoryResults
      .filter((loc) => {
        const haystack = [
          loc.title,
          loc.address,
          loc.eventType,
          loc.when,
          loc.host ?? "",
          loc.description ?? "",
          ...loc.activities,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [directoryQuery, directoryResults]);

  const handleSelectPlace = (placeId: string) => {
    if (!placesLib) return;
    const detailsService = new placesLib.PlacesService(
      document.createElement("div"),
    );

    detailsService.getDetails({ placeId }, (place) => {
      if (place?.geometry?.location) {
        const loc = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(loc);
        setSelectedPlace(loc);
        setInput(place.formatted_address || place.name || "");
        setOpen(false);
        setPredictions([]);
      }
    });
  };

  const currentValue = mode === "directory" ? directoryQuery : input;

  return (
    <div
      ref={boxRef}
      className="relative rounded-3xl border border-blue-200 bg-white shadow-sm p-3"
    >
      {/* Mode toggle */}
      <div className="flex gap-2 mb-3">
        {(["directory", "places"] as const).map((m) => {
          const active = mode === m;
          return (
            <motion.button
              key={m}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setMode(m);
                setOpen(true);
                setPredictions([]);
              }}
              className={`px-3 py-2 rounded-xl border text-sm transition ${
                active
                  ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                  : "border-blue-200 bg-blue-50 text-slate-700 hover:bg-white"
              }`}
            >
              {m === "directory" ? "Search directory" : "Search map"}
            </motion.button>
          );
        })}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={currentValue}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            const v = e.target.value;
            if (mode === "directory") setDirectoryQuery(v);
            else setInput(v);
            setOpen(true);
          }}
          placeholder={
            mode === "directory"
              ? "Search resources (fitness, park, pantry, tutoring...)"
              : "Search a place/address (autocomplete)..."
          }
          className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 pr-12 text-slate-900
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        {currentValue.trim().length > 0 && (
          <motion.button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              if (mode === "directory") setDirectoryQuery("");
              else setInput("");
              setOpen(false);
              setPredictions([]);
              setSelectedPlace(null);
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                       bg-blue-600 text-white shadow-sm flex items-center justify-center"
          >
            ✕
          </motion.button>
        )}
      </div>

      {/* Dropdown (VERY visible) */}
      <AnimatePresence>
        {open && mode === "directory" && dirMatches.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-3 rounded-3xl overflow-hidden
                       border border-blue-200 bg-white shadow-xl z-[9999]
                       max-h-[320px] overflow-y-auto"
          >
            {dirMatches.map((loc, idx) => (
              <li
                key={loc.id}
                onClick={() => {
                  onDirectoryPick(loc);
                  setOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer text-sm hover:bg-blue-50 ${
                  idx !== 0 ? "border-t border-blue-100" : ""
                }`}
              >
                <div className="font-semibold text-slate-900">{loc.title}</div>
                <div className="text-xs text-slate-600">
                  {loc.eventType} • {loc.when} • {loc.address}
                </div>
              </li>
            ))}
          </motion.ul>
        )}

        {open && mode === "places" && predictions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-3 rounded-3xl overflow-hidden
                       border border-blue-200 bg-white shadow-xl z-[9999]
                       max-h-[320px] overflow-y-auto"
          >
            {predictions.slice(0, 8).map((p, idx) => (
              <li
                key={p.place_id}
                onClick={() => handleSelectPlace(p.place_id)}
                className={`px-4 py-3 cursor-pointer text-sm hover:bg-blue-50 ${
                  idx !== 0 ? "border-t border-blue-100" : ""
                }`}
              >
                {p.description}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** ---------- Marker ---------- */
function HoverMarker({
  location,
  activeId,
  setActiveId,
  onCenter,
}: {
  location: LocationItem;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onCenter: (loc: LocationItem) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = activeId === location.id;

  return (
    <div
      onMouseEnter={() => {
        setHovered(true);
        setActiveId(location.id);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setActiveId(null);
      }}
      onClick={() => onCenter(location)}
      style={{
        transform: "translate(-50%, -100%)",
        cursor: "pointer",
        zIndex: hovered || isActive ? 999 : 1,
      }}
    >
      <motion.div
        animate={{
          scale: hovered || isActive ? 1.25 : 1,
          rotate: hovered || isActive ? 0 : 360,
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          },
          scale: {
            type: "spring",
            stiffness: 260,
            damping: 18,
          },
        }}
        className="w-8 h-8"
      >
        <Image
          src="/marker.png" // <-- put your image in /public
          alt={location.title}
          width={32}
          height={32}
          priority
        />
      </motion.div>

      <AnimatePresence>
        {(hovered || isActive) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2
                       bg-blue-700 text-white text-xs rounded-2xl px-3 py-2 shadow-xl w-60 pointer-events-none"
          >
            <div className="font-semibold leading-tight">{location.title}</div>
            <div className="mt-0.5 opacity-90">{location.when}</div>
            <div className="opacity-90">{location.eventType}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** ---------- Suggest Resource Form ---------- */
function SuggestResourceForm() {
  const [name, setName] = useState("");
  const [addr, setAddr] = useState("");
  const [category, setCategory] = useState<EventType>("Support Services");
  const [desc, setDesc] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a demo submit (client-side). Later you can POST to your DB.
    setSent(true);
    setTimeout(() => setSent(false), 2500);

    setName("");
    setAddr("");
    setCategory("Support Services");
    setDesc("");
    setContact("");
  };

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <AnimatePresence>
          {sent && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-2xl border border-blue-200 bg-white p-3 text-sm text-blue-900"
            >
              ✅ Thanks! Your suggestion was submitted.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Field label="Resource name">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Example: Community Tutoring Program"
        />
      </Field>

      <Field label="Address / location">
        <input
          value={addr}
          onChange={(e) => setAddr(e.target.value)}
          required
          className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Example: Cross Creek Ranch, Fulshear TX"
        />
      </Field>

      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as EventType)}
          className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          {EVENT_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Contact (optional)">
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Email / phone / website"
        />
      </Field>

      <div className="md:col-span-2">
        <Field label="Description">
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full min-h-[120px] rounded-2xl border border-blue-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="What is this resource and how does it help residents?"
          />
        </Field>
      </div>

      <div className="md:col-span-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-slate-600">
          Submissions are reviewed before being added to the directory.
        </div>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          Submit resource
        </motion.button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      {children}
    </div>
  );
}

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4">
      <div className="text-base font-bold text-[#1E3A8A]">{title}</div>
      <ul className="mt-2 space-y-1 text-sm text-slate-600 list-disc pl-5">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
