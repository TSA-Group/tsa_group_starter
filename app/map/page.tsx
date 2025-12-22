
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

/** ---------- Types ---------- */
interface LatLng {
  lat: number;
  lng: number;
}

type EventType =
  | "Community Dinner"
  | "Neighborhood Meetup"
  | "Clothing Drive"
  | "Literacy Tutoring"
  | "Food Pantry"
  | "Volunteer Cleanup";

type ActivityType =
  | "Food"
  | "Volunteering"
  | "Education"
  | "Donations"
  | "Outdoors"
  | "Family";

type LocationItem = {
  id: string;
  title: string;
  address: string;
  position: LatLng;
  eventType: EventType;
  activities: ActivityType[];
  when: string;
  host?: string;
};

/** ---------- UI Motion ---------- */
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

/** ---------- Sample Data (replace with your DB later) ---------- */
const ALL_LOCATIONS: LocationItem[] = [
  {
    id: "loc-1",
    title: "Sugar Land Town Square — Free Community Dinner",
    address: "Sugar Land Town Square, Sugar Land, TX 77479",
    position: { lat: 29.5959, lng: -95.6221 },
    eventType: "Community Dinner",
    activities: ["Food", "Family", "Volunteering"],
    when: "Sat • 6:00 PM",
    host: "Sugar Land Community Partners",
  },
  {
    id: "loc-2",
    title: "Sugar Land Memorial Park — Neighborhood Meetup",
    address: "15300 University Blvd, Sugar Land, TX 77479",
    position: { lat: 29.5747, lng: -95.651 },
    eventType: "Neighborhood Meetup",
    activities: ["Outdoors", "Family"],
    when: "Sat • 2:00 PM",
    host: "Sugar Land Neighborhood Association",
  },
  {
    id: "loc-3",
    title: "Fort Bend County Libraries (Sugar Land) — Warm Clothing Drive",
    address: "550 Eldridge Rd, Sugar Land, TX 77478",
    position: { lat: 29.5602, lng: -95.658 },
    eventType: "Clothing Drive",
    activities: ["Donations", "Volunteering"],
    when: "Sun • 10:00 AM",
    host: "Fort Bend County Libraries",
  },
  {
    id: "loc-4",
    title: "T.E. Harman Center — Literacy Tutors Needed",
    address: "3110 University Blvd, Sugar Land, TX 77479",
    position: { lat: 29.6079, lng: -95.6376 },
    eventType: "Literacy Tutoring",
    activities: ["Education", "Volunteering"],
    when: "Weekdays • Flexible",
    host: "T.E. Harman Center",
  },
  {
    id: "loc-5",
    title: "First Colony Mall Area — Food Pantry Pickup",
    address: "16535 Southwest Fwy, Sugar Land, TX 77479",
    position: { lat: 29.5955, lng: -95.62 },
    eventType: "Food Pantry",
    activities: ["Food", "Family"],
    when: "Wed • 4:00 PM",
    host: "First Colony Community Outreach",
  },
  {
    id: "loc-6",
    title: "Constellation Field — Volunteer Cleanup",
    address: "1 Stadium Dr, Sugar Land, TX 77498",
    position: { lat: 29.6243, lng: -95.6516 },
    eventType: "Volunteer Cleanup",
    activities: ["Outdoors", "Volunteering"],
    when: "Sun • 9:00 AM",
    host: "Sugar Land Parks & Recreation",
  },
];

const EVENT_OPTIONS: EventType[] = [
  "Community Dinner",
  "Neighborhood Meetup",
  "Clothing Drive",
  "Literacy Tutoring",
  "Food Pantry",
  "Volunteer Cleanup",
];

const ACTIVITY_OPTIONS: ActivityType[] = [
  "Food",
  "Volunteering",
  "Education",
  "Donations",
  "Outdoors",
  "Family",
];

/** ---------- Page ---------- */
export default function Page() {
  const [center, setCenter] = useState<LatLng>({
    lat: 29.5959,
    lng: -95.6221,
  });

  // Google Places Autocomplete state (MAP SEARCH)
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  // Directory search (RESOURCE SEARCH)
  const [directoryQuery, setDirectoryQuery] = useState("");

  // Theme tracking (works with your ThemeToggle)
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");

    const handler = (e: Event) => {
      const custom = e as CustomEvent<"light" | "dark">;
      setTheme(custom.detail);
    };
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);

  // Google Night Mode style JSON
  const darkStyle: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#212121" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212121" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#8a8a8a" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#000000" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#3d3d3d" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#181818" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#616161" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1b1b1b" }],
    },
  ];

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
      // quick + simple “near center” filter (no geometry lib needed)
      const dx = loc.position.lat - center.lat;
      const dy = loc.position.lng - center.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 0.08; // ~ “nearby”
    };

    return ALL_LOCATIONS.filter(
      (loc) =>
        passQuery(loc) && passEvent(loc) && passActivity(loc) && passRadius(loc),
    );
  }, [directoryQuery, eventFilters, activityFilters, radiusMode, center.lat, center.lng]);

  const activeCount =
    eventFilters.length +
    activityFilters.length +
    (radiusMode === "Near Center" ? 1 : 0) +
    (directoryQuery.trim() ? 1 : 0);

  const handleMarkerClick = (loc: LocationItem) => {
    setSelectedPlace(loc.position);
    setCenter(loc.position);
  };

  return (
    <APIProvider apiKey="AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM" libraries={["places"]}>
      {/* Page Shell (matches your home: clean, soft blue accents) */}
      <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8 py-8 sm:py-10"
        >
          {/* Title / Header */}
          <motion.div variants={fadeUp} className="mb-6 sm:mb-8">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1E3A8A] dark:text-[#7aa2ff]">
                  Resources Map
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  Find community events and resources — filter by activity, event
                  type, directory search, or what’s near you.
                </p>
              </div>

              <AnimatePresence>
                {activeCount > 0 && (
                  <motion.div
                    variants={pop}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, y: -6 }}
                    className="text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-800
                               dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100"
                  >
                    {activeCount} filter{activeCount === 1 ? "" : "s"} active
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Responsive Grid: Filters + Map + List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Filters */}
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

            {/* Right: Map + Search + Results */}
            <div className="lg:col-span-8 space-y-6">
              {/* Map Card */}
              <motion.section
                variants={fadeUp}
                className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden
                           dark:bg-[#0f1a2e] dark:border-blue-900/60"
              >
                <div className="p-4 sm:p-5 border-b border-blue-100 dark:border-blue-900/40">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A] dark:text-[#9bb7ff]">
                        Explore the map
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Search the directory (resources) or search the map (places).
                      </p>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="text-xs sm:text-sm px-3 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-800
                                 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100"
                    >
                      Showing {filteredLocations.length} location
                      {filteredLocations.length === 1 ? "" : "s"}
                    </motion.div>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div
                    className="w-full h-[320px] sm:h-[380px] lg:h-[420px] rounded-2xl border border-blue-200 overflow-hidden
                               dark:border-blue-900/60"
                  >
                    <Map
                      key={theme}
                      defaultZoom={12}
                      center={center}
                      mapTypeId="roadmap"
                      styles={theme === "dark" ? darkStyle : []}
                      gestureHandling="greedy"
                      disableDefaultUI={false}
                    >
                      {/* Filtered Markers */}
                      {filteredLocations.map((loc) => (
                        <Marker
                          key={loc.id}
                          position={loc.position}
                          onClick={() => handleMarkerClick(loc)}
                        />
                      ))}

                      {/* Selected marker (from map search or clicking a card) */}
                      {selectedPlace && <Marker position={selectedPlace} />}
                    </Map>
                  </div>

                  {/* Search */}
                  <div className="mt-4">
                    <SearchBox
                      // Directory search
                      directoryQuery={directoryQuery}
                      setDirectoryQuery={setDirectoryQuery}
                      directoryResults={ALL_LOCATIONS}
                      onDirectoryPick={(loc) => {
                        setCenter(loc.position);
                        setSelectedPlace(loc.position);
                      }}
                      // Places search
                      input={input}
                      setInput={setInput}
                      predictions={predictions}
                      setPredictions={setPredictions}
                      setCenter={setCenter}
                      setSelectedPlace={setSelectedPlace}
                    />
                  </div>
                </div>
              </motion.section>

              {/* Results List */}
              <motion.section
                variants={fadeUp}
                className="rounded-2xl border border-blue-200 bg-white shadow-sm
                           dark:bg-[#0f1a2e] dark:border-blue-900/60"
              >
                <div className="p-4 sm:p-5 border-b border-blue-100 dark:border-blue-900/40">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A] dark:text-[#9bb7ff]">
                    Matching resources
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
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
                        className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-900
                                   dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100"
                      >
                        No matches. Try removing a filter or changing your search.
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
                            onClick={() => handleMarkerClick(loc)}
                            className="text-left rounded-2xl border border-blue-200 bg-white p-4 shadow-sm
                                       hover:shadow-md transition-shadow
                                       dark:bg-[#0b1220] dark:border-blue-900/60"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                                  {loc.eventType}
                                </div>
                                <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-50">
                                  {loc.title}
                                </div>
                              </div>

                              <span
                                className="shrink-0 text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-800
                                           dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100"
                              >
                                {loc.when}
                              </span>
                            </div>

                            <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                              {loc.address}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {loc.activities.slice(0, 4).map((a) => (
                                <span
                                  key={a}
                                  className="text-xs px-2 py-1 rounded-full border border-blue-200 text-blue-900 bg-white
                                             dark:border-blue-900/60 dark:text-blue-100 dark:bg-transparent"
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
    <div
      className="rounded-2xl border border-blue-200 bg-white shadow-sm overflow-hidden
                 dark:bg-[#0f1a2e] dark:border-blue-900/60"
    >
      <div className="p-4 sm:p-5 border-b border-blue-100 dark:border-blue-900/40">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A] dark:text-[#9bb7ff]">
              Filter
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Choose what you want to see.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: hasAny ? 1.03 : 1 }}
            whileTap={{ scale: hasAny ? 0.98 : 1 }}
            onClick={onClear}
            disabled={!hasAny}
            className={`text-sm px-3 py-2 rounded-xl border transition
              ${
                hasAny
                  ? "border-blue-200 bg-blue-50 text-blue-900 hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950/60"
                  : "border-slate-200 text-slate-400 cursor-not-allowed dark:border-slate-700 dark:text-slate-500"
              }`}
          >
            Clear
          </motion.button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        {/* Radius */}
        <div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Area
          </div>
          <div className="mt-2 flex gap-2">
            {(["All", "Near Center"] as const).map((opt) => {
              const active = radiusMode === opt;
              return (
                <motion.button
                  key={opt}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setRadiusMode(opt)}
                  className={`px-3 py-2 rounded-xl border text-sm transition
                    ${
                      active
                        ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                        : "border-blue-200 bg-white text-blue-900 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-transparent dark:text-blue-100 dark:hover:bg-blue-950/40"
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
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Event type
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {EVENT_OPTIONS.map((e) => {
              const active = eventFilters.includes(e);
              return (
                <motion.button
                  key={e}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setEventFilters(toggle(eventFilters, e))}
                  className={`px-3 py-2 rounded-full border text-sm transition
                    ${
                      active
                        ? "border-blue-400 bg-blue-50 text-blue-900 shadow-sm dark:border-blue-400/60 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-blue-200 bg-white text-slate-700 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-transparent dark:text-slate-200 dark:hover:bg-blue-950/30"
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
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Activities
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {ACTIVITY_OPTIONS.map((a) => {
              const active = activityFilters.includes(a);
              return (
                <motion.button
                  key={a}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActivityFilters(toggle(activityFilters, a))}
                  className={`px-3 py-2 rounded-full border text-sm transition
                    ${
                      active
                        ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                        : "border-blue-200 bg-white text-slate-700 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-transparent dark:text-slate-200 dark:hover:bg-blue-950/30"
                    }`}
                >
                  {a}
                </motion.button>
              );
            })}
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Tip: Selecting multiple activities means a location must match{" "}
            <span className="font-semibold">all</span> of them.
          </p>
        </div>
      </div>
    </div>
  );
}

/** ---------- SearchBox (Directory + Places, keeps theme + motion) ---------- */
function SearchBox({
  // Directory search
  directoryQuery,
  setDirectoryQuery,
  directoryResults,
  onDirectoryPick,

  // Places search
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
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"directory" | "places">("directory");

  // Places: init service
  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new placesLib.AutocompleteService();
    }
  }, [placesLib]);

  // Places: fetch predictions
  useEffect(() => {
    if (mode !== "places") return;
    if (!serviceRef.current || !input || !open) {
      setPredictions([]);
      return;
    }
    serviceRef.current.getPlacePredictions({ input }, (res) => {
      setPredictions(res || []);
    });
  }, [mode, input, open, setPredictions]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Directory: compute results
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
          ...loc.activities,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 6);
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
        setInput(place.formatted_address || "");
        setOpen(false);
        setPredictions([]);
      }
    });
  };

  const currentValue = mode === "directory" ? directoryQuery : input;

  return (
    <div
      ref={boxRef}
      className="relative rounded-2xl border border-blue-200 bg-white shadow-sm p-3
                 dark:bg-[#0b1220] dark:border-blue-900/60"
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
              className={`px-3 py-2 rounded-xl border text-sm transition
                ${
                  active
                    ? "border-blue-400 bg-blue-600 text-white shadow-sm"
                    : "border-blue-200 bg-white text-slate-700 hover:bg-blue-50 dark:border-blue-900/60 dark:bg-transparent dark:text-slate-200 dark:hover:bg-blue-950/30"
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
              ? "Search resources (food, tutoring, cleanup, park...)"
              : "Search a place to move the map..."
          }
          className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 pr-12 text-slate-900
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-300
                     dark:bg-transparent dark:text-slate-100 dark:border-blue-900/60 dark:focus:ring-blue-900/40"
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
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full
                       bg-blue-600 text-white shadow-sm flex items-center justify-center"
          >
            ✕
          </motion.button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && mode === "directory" && dirMatches.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden
                       border border-blue-200 bg-white shadow-lg z-20
                       dark:bg-[#0f1a2e] dark:border-blue-900/60"
          >
            {dirMatches.map((loc, idx) => (
              <li
                key={loc.id}
                onClick={() => {
                  onDirectoryPick(loc);
                  setOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer text-sm
                            hover:bg-blue-50 dark:hover:bg-blue-950/40
                            ${idx !== 0 ? "border-t border-blue-100 dark:border-blue-900/40" : ""}`}
              >
                <div className="font-semibold text-slate-900 dark:text-slate-50">
                  {loc.title}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
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
            className="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden
                       border border-blue-200 bg-white shadow-lg z-20
                       dark:bg-[#0f1a2e] dark:border-blue-900/60"
          >
            {predictions.slice(0, 5).map((p, idx) => (
              <li
                key={p.place_id}
                onClick={() => handleSelectPlace(p.place_id)}
                className={`px-4 py-3 cursor-pointer text-sm
                            hover:bg-blue-50 dark:hover:bg-blue-950/40
                            ${idx !== 0 ? "border-t border-blue-100 dark:border-blue-900/40" : ""}`}
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
