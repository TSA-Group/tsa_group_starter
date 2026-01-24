"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";

import Image from "next/image";

import { db } from "@/lib/firebase";
import { collection, onSnapshot, type DocumentData } from "firebase/firestore";

// ALL EVENT TYPES IN OUR SEARCH FUNCTION ( IF U ADD A NEW TYPE PLS MAKE SURE TO ADD IT IN THE BOX AND KEEP IT EVEN )
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
  | "Volunteer Opportunity"
  | "Other";

type ActivityType =
  | "Family"
  | "Outdoors"
  | "Food"
  | "Education"
  | "Health"
  | "Support"
  | "Volunteering"
  | "Shopping";

type ResourceDoc = {
  title: string;
  address: string;
  position: LatLng;

  eventType: EventType;
  activities: ActivityType[];

  host?: string;
  description?: string;
  featured?: boolean;
};
// do not touch this (firestore id)
type LocationItem = ResourceDoc & {
  id: string;
};

//All animations for map page
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

//Main options for filter( if you add a new option to the pls also add it to the event ttype above)
const EVENT_OPTIONS: EventType[] = [
  "Community Event",
  "Park & Trails",
  "Fitness",
  "Grocery",
  "Library",
  "Support Services",
  "Food Pantry",
  "Volunteer Opportunity",
  "Other",
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

//start of tthe page!
export default function Page() {
  // DO NOT TOUCH THIS
  const apiKey = "AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM";

  // center of map
  const [center, setCenter] = useState<LatLng>({ lat: 29.6995, lng: -95.904 });
  const [zoom, setZoom] = useState(13);

  type Prediction = { description: string; place_id: string };
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  const [directoryQuery, setDirectoryQuery] = useState("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const animateTo = (target: LatLng, targetZoom = 15, duration = 600) => {
    const map = mapRef.current;
    if (!map) return;

    const startCenter = map.getCenter();

    if (!startCenter) return; // ⬅️ guard (fixes TS error)

    const startZoom = map.getZoom() ?? targetZoom;

    const startLat = startCenter.lat();
    const startLng = startCenter.lng();

    const start = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const frame = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(t);

      const lat = startLat + (target.lat - startLat) * eased;
      const lng = startLng + (target.lng - startLng) * eased;
      const zoom = startZoom + (targetZoom - startZoom) * eased;

      map.setCenter({ lat, lng });
      map.setZoom(zoom);

      if (t < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  };

  const [activeId, setActiveId] = useState<string | null>(null);

  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  // This links the firestore to the map so u the users are able to add events
  useEffect(() => {
    setLoading(true);
    setDbError(null);

    const unsub = onSnapshot(
      collection(db, "resources"),
      (snap) => {
        const next: LocationItem[] = [];
        snap.forEach((doc) => {
          const data = doc.data() as DocumentData;

          const title = String(data?.title ?? "").trim();
          const address = String(data?.address ?? "").trim();
          const pos = data?.position;

          const lat = Number(pos?.lat);
          const lng = Number(pos?.lng);

          if (!title || !address || Number.isNaN(lat) || Number.isNaN(lng)) {
            return;
          }

          next.push({
            id: doc.id,
            title,
            address,
            position: { lat, lng },
            eventType: (data?.eventType as EventType) ?? "Other",
            activities: Array.isArray(data?.activities)
              ? (data.activities as ActivityType[])
              : [],
            host: typeof data?.host === "string" ? data.host : undefined,
            description:
              typeof data?.description === "string"
                ? data.description
                : undefined,
            featured: Boolean(data?.featured),
          });
        });

        setLocations(next);
        setLoading(false);
      },
      (err) => {
        setDbError(err?.message || "Error, unable to read");
        setLoading(false);
      },
    );

    return () => unsub();
  }, []);

  // filters for map
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
      return dist < 0.09;
    };

    return locations.filter(
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
    locations,
  ]);

  const featured = useMemo(
    () => locations.filter((l) => l.featured).slice(0, 3),
    [locations],
  );

  const activeCount =
    eventFilters.length +
    activityFilters.length +
    (radiusMode === "Near Center" ? 1 : 0) +
    (directoryQuery.trim() ? 1 : 0);

  const handleCenter = (loc: LocationItem | LatLng) => {
    const target = "position" in loc ? loc.position : loc;

    animateTo(target, 15);

    if ("id" in loc) {
      setActiveId(loc.id);
    }
  };

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <div className="text-lg font-bold text-rose-900">
            Missing Maps API key
          </div>
          <div className="mt-2 text-sm text-rose-800">
            Set{" "}
            <span className="font-semibold">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </span>{" "}
            in <span className="font-semibold">.env.local</span> (and in Vercel
            Environment Variables).
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      <div className="min-h-screen bg-white text-slate-900">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10"
        >
          <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A]">
                  Map of Cross Creek Ranch
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  Explore all that Cross Creek Ranch has and discover new
                  places!
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

            <AnimatePresence>
              {dbError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900"
                >
                  {dbError}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Spotlight Resources */}
          <motion.section
            variants={fadeUp}
            className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm p-5 sm:p-6 mb-6"
          >
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E3A8A]">
                  Spotlight Resources
                </h2>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Featured resources
              </div>

              {loading ? (
                <div className="rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-600">
                  Loading resources…
                </div>
              ) : featured.length === 0 ? (
                <div className="rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-600">
                  No featured resources yet. (Set{" "}
                  <span className="font-semibold">featured: true</span> on a
                  resource doc.)
                </div>
              ) : (
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
                      <div className="mt-3 text-xs text-slate-600">
                        {loc.address}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters */}
            <motion.aside variants={fadeUp} className="lg:col-span-4 space-y-6">
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
                <div className="p-4 sm:p-5 space-y-4">
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
            </motion.aside>

            {/* Map + Search + List */}
            <div className="lg:col-span-8 space-y-6">
              {/* MAP ONLY FULLSCREEN LOGIC */}

              <motion.section
                variants={fadeUp}
                className="flex flex-col rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden"
              >
                {/* map content */}

                <div className="relative p-4 sm:p-5 border-b border-blue-200/60 shrink-0">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Interactive Resource Map
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 bg-white text-blue-900"
                      >
                        {`Showing ${filteredLocations.length} location${
                          filteredLocations.length === 1 ? "" : "s"
                        }`}
                      </motion.div>

                      {!mapExpanded && (
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            setMapExpanded(true);
                            setShowSearchOverlay(false);
                          }}
                          className="text-xs sm:text-sm px-4 py-2 rounded-full
                                       bg-blue-600 text-white font-semibold shadow"
                        >
                          Expand map
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-3xl border border-blue-200 overflow-hidden bg-white relative">
                  <Map
                    mapId="8859a83a13a834f6eeef1c63"
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling="greedy"
                    disableDefaultUI={true}
                    zoomControl={false}
                    fullscreenControl={false}
                    streetViewControl={false}
                    mapTypeControl={false}
                    onClick={() => setActiveId(null)}
                    className="w-full h-full"
                  >
                    <MapController onReady={(m) => (mapRef.current = m)} />

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

                    {selectedPlace && (
                      <AdvancedMarker position={selectedPlace}>
                        <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow" />
                      </AdvancedMarker>
                    )}
                  </Map>
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[min(92%,480px)]">
                    <SearchBox
                      directoryQuery={directoryQuery}
                      setDirectoryQuery={setDirectoryQuery}
                      directoryResults={locations}
                      onDirectoryPick={(loc) => handleCenter(loc)}
                      input={input}
                      setInput={setInput}
                      predictions={predictions}
                      setPredictions={setPredictions}
                      setCenter={(loc) => {
                        animateTo(loc, 15);
                      }}
                      setSelectedPlace={setSelectedPlace}
                    />
                  </div>
                </div>
              </motion.section>

              <motion.section
                variants={fadeUp}
                className="rounded-3xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden"
              >
                <div className="relative p-4 sm:p-5 border-b border-blue-200/60">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                    Resource Directory
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tap a card to center it on the map.
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  {loading ? (
                    <div className="rounded-2xl border border-blue-200 bg-white p-5 text-slate-600">
                      Loading resources…
                    </div>
                  ) : (
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
                              <div className="text-sm font-semibold text-blue-900">
                                {loc.eventType}
                              </div>
                              <div className="mt-1 text-base font-bold text-slate-900">
                                {loc.title}
                              </div>

                              <div className="mt-2 text-sm text-slate-600">
                                {loc.address}
                              </div>

                              {loc.description ? (
                                <div className="mt-2 text-sm text-slate-600">
                                  {loc.description}
                                </div>
                              ) : null}

                              {loc.activities.length > 0 ? (
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
                              ) : null}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              </motion.section>
            </div>
          </div>
          {mapExpanded && (
            <div className="fixed inset-0 z-[2000] bg-white flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-blue-200">
                <div>
                  <h2 className="text-lg font-bold text-[#1E3A8A]">
                    Interactive Resource Map
                  </h2>
                  <p className="text-sm text-slate-600">
                    Search the directory or search the map.
                  </p>
                </div>

                <button
                  onClick={() => setMapExpanded(false)}
                  className="rounded-full bg-blue-600 text-white px-4 py-2 text-sm font-semibold shadow"
                >
                  Exit fullscreen
                </button>
              </div>

              {/* Map */}
              <div className="relative w-full pointer-events-auto h-[520px] sm:h-[620px] lg:h-[700px]">
                <Map
                  mapId="8859a83a13a834f6eeef1c63"
                  defaultCenter={center}
                  defaultZoom={zoom}
                  gestureHandling="greedy"
                  disableDefaultUI={true}
                  zoomControl={false}
                  fullscreenControl={false}
                  streetViewControl={false}
                  mapTypeControl={false}
                  onClick={() => setActiveId(null)}
                  style={{ width: "100%", height: "100%" }}
                >
                  <MapController onReady={(m) => (mapRef.current = m)} />

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

                  {selectedPlace && (
                    <AdvancedMarker position={selectedPlace}>
                      <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white shadow" />
                    </AdvancedMarker>
                  )}
                </Map>

                {/* 🔍 FLOATING SEARCH OVER MAP */}
                {/* 🔍 FULLSCREEN SEARCH OVER MAP */}
                <div
                  className="absolute top-6 left-1/2 -translate-x-1/2 z-[3000]
                             w-[min(92%,480px)]"
                >
                  <SearchBox
                    directoryQuery={directoryQuery}
                    setDirectoryQuery={setDirectoryQuery}
                    directoryResults={locations}
                    onDirectoryPick={(loc) => handleCenter(loc)}
                    input={input}
                    setInput={setInput}
                    predictions={predictions}
                    setPredictions={setPredictions}
                    setCenter={(loc) => {
                      animateTo(loc, 15);
                    }}
                    setSelectedPlace={setSelectedPlace}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </APIProvider>
  );
}

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

// searchbox (shivvesh add more pls)
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
  predictions: { description: string; place_id: string }[];
  setPredictions: (preds: { description: string; place_id: string }[]) => void;
  setCenter: (loc: LatLng) => void;
  setSelectedPlace: (loc: LatLng | null) => void;
}) {
  const placesLib = useMapsLibrary("places");
  const serviceRef = useRef<any>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"directory" | "places">("directory");

  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new (placesLib as any).AutocompleteService();
    }
  }, [placesLib]);

  useEffect(() => {
    if (mode !== "places") return;

    const q = input.trim();
    if (!serviceRef.current || q.length < 2 || !open) {
      setPredictions([]);
      return;
    }

    const handle = window.setTimeout(() => {
      serviceRef.current?.getPlacePredictions({ input: q }, (res: any[]) => {
        const mapped =
          (res || []).map((p) => ({
            description: String(p?.description ?? ""),
            place_id: String(p?.place_id ?? ""),
          })) ?? [];
        setPredictions(mapped.filter((p) => p.description && p.place_id));
      });
    }, 120);

    return () => window.clearTimeout(handle);
  }, [mode, input, open, setPredictions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dirMatches = useMemo(() => {
    const q = directoryQuery.trim().toLowerCase();
    if (!q) return [];
    return directoryResults
      .filter((loc) => {
        const haystack = [
          loc.title,
          loc.address,
          loc.eventType,
          loc.host ?? "",
          loc.description ?? "",
          ...loc.activities,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 3);
  }, [directoryQuery, directoryResults]);

  const handleSelectPlace = (placeId: string) => {
    if (!placesLib) return;

    const detailsService = new (placesLib as any).PlacesService(
      document.createElement("div"),
    );

    detailsService.getDetails({ placeId }, (place: any) => {
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
    <div ref={boxRef} className="relative w-full">
      {/* 🔽 HALF-CIRCLE TOGGLE TAB */}
      <motion.button
        onClick={() => setCollapsed((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute -top-7 left-1/2 -translate-x-1/2
                   w-20 h-10 rounded-b-full
                   bg-blue-600 text-white shadow-lg
                   flex items-center justify-center z-[20]"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
          className="text-lg"
        >
          {collapsed ? "⬇" : "⬆"}
        </motion.span>
      </motion.button>

      {!collapsed && (
        <>
          <div className="flex items-center mb-2">
            {(["directory", "places"] as const).map((m) => {
              const active = mode === m;
              const isMap = m === "places";

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
                  className={`px-3 py-2 rounded-xl border text-sm transition
                    ${isMap ? "ml-auto" : ""}
                    ${
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
              className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 pr-12
                         text-slate-900 placeholder:text-slate-400
                         focus:outline-none focus:ring-2 focus:ring-blue-200"
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
                className="absolute right-2 top-1/2 -translate-y-1/2
                           w-9 h-9 rounded-full bg-blue-600 text-white shadow-sm"
              >
                ✕
              </motion.button>
            )}
          </div>

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
                    <div className="font-semibold text-slate-900">
                      {loc.title}
                    </div>
                    <div className="text-xs text-slate-600">
                      {loc.eventType} • {loc.address}
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
                {predictions.slice(0, 3).map((p, idx) => (
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
        </>
      )}
    </div>
  );
}

// all markers here (DO NOT REMOVE ONLY ADDD)
export function HoverMarker({
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
  const isExpanded = hovered || isActive;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isActive) setActiveId(null);
    else onCenter(location);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        position: "relative",
        cursor: "pointer",
        zIndex: isExpanded ? 9999 : 1,
      }}
    >
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="pin"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-8 h-8"
            >
              <Image
                src="/marker.png"
                alt={location.title}
                width={32}
                height={32}
                priority
              />
            </motion.div>

            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-blue-400"
              style={{ zIndex: -1 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="card"
            layoutId={`marker-${location.id}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-56 pointer-events-auto"
            style={{ zIndex: 10000 }}
          >
            <div className="relative">
              <div className="rounded-xl bg-white shadow-2xl border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 text-white">
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90 mb-0.5">
                    {location.eventType}
                  </div>
                  <div className="text-sm font-bold leading-tight">
                    {location.title}
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="text-xs text-slate-700 font-medium">
                    {location.address}
                  </div>

                  {location.host ? (
                    <div className="text-xs text-slate-600">
                      {location.host}
                    </div>
                  ) : null}

                  {location.activities.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {location.activities.slice(0, 3).map((activity) => (
                        <span
                          key={activity}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50
                                     text-blue-700 border border-blue-200 font-medium"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="pt-1.5 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500">
                      Click again to close
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3
                           bg-white border-r border-b border-blue-100 rotate-45"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
function MapController({
  onReady,
}: {
  onReady: (map: google.maps.Map) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) onReady(map);
  }, [map, onReady]);

  return null;
}
