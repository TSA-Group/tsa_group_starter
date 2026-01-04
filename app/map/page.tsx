"use client";
<<<<<<< HEAD
=======
 
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  APIProvider,
  Map,
  AdvancedMarker,
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

/** ---------- Sample Data (swap with DB later) ---------- */
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
  // Put your key in .env.local:
  // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_KEY"
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const [center, setCenter] = useState<LatLng>({
    lat: 29.5959,
    lng: -95.6221,
  });

  // Places search (always visible top bar)
  const [placeInput, setPlaceInput] = useState("");
  const [placePredictions, setPlacePredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  // Directory search (resources list)
  const [directoryQuery, setDirectoryQuery] = useState("");

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
      const dx = loc.position.lat - center.lat;
      const dy = loc.position.lng - center.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 0.08; // quick nearby filter
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

  const activeCount =
    eventFilters.length +
    activityFilters.length +
    (radiusMode === "Near Center" ? 1 : 0) +
    (directoryQuery.trim() ? 1 : 0);

  return (
<<<<<<< HEAD
    <APIProvider
      apiKey="AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM"
      libraries={["places"]}
      version="beta"
    >
      {/* Page Shell (matches your home: clean, soft blue accents) */}
      <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b1220] dark:text-slate-100">
=======
    <APIProvider apiKey="AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM" libraries={["places"]}>
      <div className="min-h-screen bg-[#f5f9ff] text-slate-900">
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
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
                  Resources Map
                </h1>
<<<<<<< HEAD
                <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">
                  Find community events and resources — filter by activity,
                  event type, directory search, or what’s near you.
=======
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  Search places on the map and filter community resources.
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
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

          {/* Always-visible Places search bar */}
          <motion.div variants={fadeUp} className="mb-6">
            <PlacesSearchBar
              input={placeInput}
              setInput={setPlaceInput}
              predictions={placePredictions}
              setPredictions={setPlacePredictions}
              onPick={(loc, label) => {
                setCenter(loc);
                setSelectedPlace(loc);
                setPlaceInput(label);
              }}
              onClear={() => {
                setPlaceInput("");
                setPlacePredictions([]);
                setSelectedPlace(null);
              }}
            />
          </motion.div>

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

            {/* Map + Results */}
            <div className="lg:col-span-8 space-y-6">
              {/* Map Card */}
              <motion.section
                variants={fadeUp}
                className="rounded-2xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-blue-200/60">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                        Explore the map
                      </h2>
<<<<<<< HEAD
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Search the directory (resources) or search the map
                        (places).
=======
                      <p className="text-sm text-slate-600">
                        Autocomplete search moves the map instantly.
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
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
                  <div className="w-full h-[340px] sm:h-[420px] rounded-2xl border border-blue-200 overflow-hidden bg-white">
                    <Map
<<<<<<< HEAD
                      mapId="8859a83a13a834f6eeef1c63"
                      center={center}
                      defaultZoom={12}
=======
                      defaultZoom={12}
                      center={center}
                      mapTypeId="roadmap"
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
                      gestureHandling="greedy"
                      onClick={() => setActiveId(null)}
                    >
                      {filteredLocations.map((loc) => (
                        <AdvancedMarker key={loc.id} position={loc.position}>
                          <HoverMarker location={loc} />
                        </AdvancedMarker>
                      ))}
<<<<<<< HEAD
=======

                      {selectedPlace && <Marker position={selectedPlace} />}
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
                    </Map>
                  </div>

                  {/* Directory search (resources) */}
                  <div className="mt-5">
                    <DirectorySearch
                      value={directoryQuery}
                      onChange={setDirectoryQuery}
                    />
                  </div>
                </div>
              </motion.section>

              {/* Results List */}
              <motion.section
                variants={fadeUp}
                className="rounded-2xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-5 border-b border-blue-200/60">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
                    Matching resources
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
                            onClick={() => handleMarkerClick(loc)}
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

                            <div className="mt-3 flex flex-wrap gap-2">
                              {loc.activities.slice(0, 4).map((a) => (
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
            </div>
          </div>
        </motion.div>
      </div>
    </APIProvider>
  );
}

/** ---------- Places Search Bar (autocomplete while typing) ---------- */
function PlacesSearchBar({
  input,
  setInput,
  predictions,
  setPredictions,
  onPick,
  onClear,
}: {
  input: string;
  setInput: (v: string) => void;
  predictions: google.maps.places.AutocompletePrediction[];
  setPredictions: (p: google.maps.places.AutocompletePrediction[]) => void;
  onPick: (loc: LatLng, label: string) => void;
  onClear: () => void;
}) {
  const placesLib = useMapsLibrary("places");
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (placesLib && !serviceRef.current) {
      serviceRef.current = new placesLib.AutocompleteService();
    }
  }, [placesLib]);

  useEffect(() => {
    const q = input.trim();
    if (!serviceRef.current || q.length < 2) {
      setPredictions([]);
      return;
    }
    setOpen(true);

    const handle = window.setTimeout(() => {
      serviceRef.current?.getPlacePredictions(
        { input: q },
        (res) => setPredictions(res || []),
      );
    }, 120);

    return () => window.clearTimeout(handle);
  }, [input, setPredictions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectPlace = (placeId: string, label: string) => {
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
        onPick(loc, label);
        setOpen(false);
        setPredictions([]);
      }
    });
  };

  return (
    <div ref={boxRef} className="relative">
      <div className="rounded-2xl border border-blue-200 bg-[#eaf3ff] shadow-sm p-3 sm:p-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex h-11 w-11 rounded-2xl bg-white border border-blue-200 items-center justify-center text-blue-900">
            🔎
          </div>

          <div className="flex-1 relative">
            <div className="text-xs font-semibold text-blue-900 mb-2">
              Search a location (autocomplete)
            </div>
            <input
              value={input}
              onFocus={() => setOpen(true)}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type an address, park, library, mall..."
              className="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            {input.trim().length > 0 && (
              <motion.button
                type="button"
                aria-label="Clear"
                onClick={() => {
                  onClear();
                  setOpen(false);
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="absolute right-2 top-[34px] w-9 h-9 rounded-full bg-blue-600 text-white shadow-sm flex items-center justify-center"
              >
                ✕
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && predictions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute left-0 right-0 mt-3 rounded-2xl overflow-hidden border border-blue-200 bg-white shadow-lg z-30"
          >
            {predictions.slice(0, 6).map((p, idx) => (
              <li
                key={p.place_id}
                onClick={() => handleSelectPlace(p.place_id, p.description)}
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

/** ---------- Directory Search ---------- */
function DirectorySearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-blue-200 bg-white p-4">
      <div className="text-sm font-bold text-[#1E3A8A]">Search resources</div>
      <p className="text-xs text-slate-600 mt-1">
        Filters the cards (ex: “food”, “tutoring”, “cleanup”, “drive”).
      </p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search resources..."
        className="mt-3 w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
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
    <div className="rounded-2xl border border-blue-200 bg-[#eaf3ff] shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-blue-200/60">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">
              Filter
            </h2>
            <p className="text-sm text-slate-600">Choose what you want to see.</p>
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
          <div className="text-sm font-semibold text-slate-900">Event type</div>
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

          <p className="mt-3 text-xs text-slate-500">
            Tip: Selecting multiple activities means a location must match{" "}
            <span className="font-semibold">all</span> of them.
          </p>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD

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
  const serviceRef = useRef<google.maps.places.AutocompleteService | null>(
    null,
  );
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
function HoverMarker({ location }: { location: LocationItem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: "translate(-50%, -100%)",
        position: "relative",
        zIndex: hovered ? 10 : 1,
      }}
    >
      {/* 🔁 Spinning marker image */}
      <motion.img
        src="/marker.png"
        alt="Marker"
        className="w-8 h-8 drop-shadow-md"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "linear",
        }}
      />

      {/* 💬 Hover info box */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="
              absolute left-1/2 bottom-full mb-2
              -translate-x-1/2
              bg-blue-600 text-white text-xs
              rounded-xl px-3 py-2
              shadow-lg pointer-events-none
              w-56
            "
          >
            <div className="font-semibold">{location.title}</div>
            <div className="opacity-90">{location.when}</div>
            <div className="opacity-80">{location.eventType}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
=======
>>>>>>> b28f81de2caabb71bc1cb5b580a6f74d8d53b788
