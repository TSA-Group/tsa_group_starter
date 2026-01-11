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

// ✅ Firestore
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Timestamp,
} from "firebase/firestore";

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

type ResourceDoc = {
  id: string;
  title: string;
  address: string;
  position: LatLng;
  eventType: EventType;
  activities: ActivityType[];
  host?: string;
  description?: string;
  featured?: boolean;
  seedKey?: string; // used to avoid duplicates for the "seed" button
  createdAt?: Timestamp;
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

/** ---------- Seed (NOT hard-coded addresses)
 * We only hard-code place QUERIES. Google Places returns the real formatted address + lat/lng.
 * Clicking the button writes them into Firestore collection: "resources"
 */
const SEED_PLACES: Array<{
  seedKey: string;
  query: string;
  title: string;
  eventType: EventType;
  activities: ActivityType[];
  host?: string;
  description?: string;
  featured?: boolean;
}> = [
  {
    seedKey: "fulshear_library",
    query: "Fulshear Branch Library, Fulshear TX",
    title: "Fulshear Branch Library",
    eventType: "Library",
    activities: ["Education", "Family"],
    host: "Public Library",
    featured: true,
    description: "Books, study space, and community programs for residents.",
  },
  {
    seedKey: "fulshear_heb",
    query: "H-E-B near Fulshear TX",
    title: "H-E-B (Grocery)",
    eventType: "Grocery",
    activities: ["Shopping", "Food", "Family"],
    host: "HEB",
    featured: true,
    description: "Nearby grocery for essentials, pantry staples, and meals.",
  },
  {
    seedKey: "cross_creek_ranch",
    query: "Cross Creek Ranch, Fulshear TX",
    title: "Cross Creek Ranch (Community Area)",
    eventType: "Community Event",
    activities: ["Family", "Support"],
    host: "Cross Creek Ranch",
    featured: true,
    description: "Community area with events, meetups, and resident resources.",
  },
  {
    seedKey: "fulshear_park",
    query: "park near Cross Creek Ranch Fulshear TX",
    title: "Nearby Park & Trails",
    eventType: "Park & Trails",
    activities: ["Outdoors", "Family"],
    host: "Community Parks",
    description: "Outdoor trails and green space for walking and family time.",
  },
  {
    seedKey: "food_pantry_katy_fulshear",
    query: "food pantry near Fulshear TX",
    title: "Food Pantry Support (Nearby)",
    eventType: "Food Pantry",
    activities: ["Food", "Support", "Family"],
    host: "Community Partner",
    description: "Local food assistance options for residents who need help.",
  },
];

/** ---------- Page ---------- */
export default function Page() {
  // ✅ Use env (don’t hard-code keys in code)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Cross Creek Ranch-ish default center (map stays the same)
  const [center, setCenter] = useState<LatLng>({ lat: 29.6995, lng: -95.904 });
  const [zoom, setZoom] = useState(13);

  // Places autocomplete (map search)
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [input, setInput] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<LatLng | null>(null);

  // Directory search
  const [directoryQuery, setDirectoryQuery] = useState("");

  // Active marker
  const [activeId, setActiveId] = useState<string | null>(null);

  /** ---------- Filters ---------- */
  const [eventFilters, setEventFilters] = useState<EventType[]>([]);
  const [activityFilters, setActivityFilters] = useState<ActivityType[]>([]);
  const [radiusMode, setRadiusMode] = useState<"All" | "Near Center">("All");

  /** ---------- Firestore Resources ---------- */
  const [resources, setResources] = useState<ResourceDoc[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  // Seed button states
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  useEffect(() => {
    const colRef = collection(db, "resources");
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const next: ResourceDoc[] = snap.docs
          .map((d) => {
            const data = d.data() as Omit<ResourceDoc, "id">;
            return {
              id: d.id,
              title: data.title,
              address: data.address,
              position: data.position,
              eventType: data.eventType,
              activities: data.activities ?? [],
              host: data.host,
              description: data.description,
              featured: data.featured ?? false,
              seedKey: data.seedKey,
              createdAt: data.createdAt,
            };
          })
          .filter(
            (r) =>
              !!r.title &&
              !!r.address &&
              !!r.position &&
              typeof r.position.lat === "number" &&
              typeof r.position.lng === "number",
          );

        // small sort: featured first, then title
        next.sort((a, b) => {
          const fa = a.featured ? 1 : 0;
          const fb = b.featured ? 1 : 0;
          if (fa !== fb) return fb - fa;
          return a.title.localeCompare(b.title);
        });

        setResources(next);
        setLoadingResources(false);
      },
      (err) => {
        console.error("Firestore resources read error:", err);
        setResources([]);
        setLoadingResources(false);
      },
    );
    return () => unsub();
  }, []);

  const filteredLocations = useMemo(() => {
    const q = directoryQuery.trim().toLowerCase();

    const passQuery = (loc: ResourceDoc) => {
      if (!q) return true;
      const haystack = [
        loc.title,
        loc.address,
        loc.eventType,
        loc.host ?? "",
        loc.description ?? "",
        ...(loc.activities ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    };

    const passEvent = (loc: ResourceDoc) =>
      eventFilters.length === 0 || eventFilters.includes(loc.eventType);

    const passActivity = (loc: ResourceDoc) =>
      activityFilters.length === 0 ||
      activityFilters.every((a) => (loc.activities ?? []).includes(a));

    const passRadius = (loc: ResourceDoc) => {
      if (radiusMode === "All") return true;
      const dx = loc.position.lat - center.lat;
      const dy = loc.position.lng - center.lng;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist < 0.09; // "nearby"
    };

    return resources.filter(
      (loc) => passQuery(loc) && passEvent(loc) && passActivity(loc) && passRadius(loc),
    );
  }, [resources, directoryQuery, eventFilters, activityFilters, radiusMode, center.lat, center.lng]);

  const featured = useMemo(
    () => resources.filter((l) => l.featured).slice(0, 3),
    [resources],
  );

  const activeCount =
    eventFilters.length +
    activityFilters.length +
    (radiusMode === "Near Center" ? 1 : 0) +
    (directoryQuery.trim() ? 1 : 0);

  const handleCenter = (loc: ResourceDoc) => {
    setCenter(loc.position);
    setZoom(15);
    setSelectedPlace(loc.position);
  };

  return (
    <APIProvider apiKey={apiKey} libraries={["places"]}>
      {/* LIGHT THEME */}
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
                  Explore community resources, events, and support — all in one place.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
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

                {/* ✅ One-click seed button */}
                <SeedResourcesButton
                  seeding={seeding}
                  setSeeding={setSeeding}
                  seedMsg={seedMsg}
                  setSeedMsg={setSeedMsg}
                />
              </div>
            </div>

            <AnimatePresence>
              {seedMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 text-blue-900 px-4 py-3 text-sm"
                >
                  {seedMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Featured / Highlights */}
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
                  A quick look at key resources in the community.
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm font-semibold text-slate-700 mb-2">
                Featured resources
              </div>

              {loadingResources ? (
                <div className="rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-600">
                  Loading resources…
                </div>
              ) : featured.length === 0 ? (
                <div className="rounded-2xl border border-blue-200 bg-white p-4 text-sm text-slate-600">
                  No featured resources yet. Use the “Save starter resources” button to add some.
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
                        <span className="font-semibold text-slate-700">Address:</span>{" "}
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
              {/* Map Card — DO NOT CHANGE MAP */}
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

                  {/* Search */}
                  <div className="mt-4 relative z-50">
                    <SearchBox
                      directoryQuery={directoryQuery}
                      setDirectoryQuery={setDirectoryQuery}
                      directoryResults={resources}
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

              {/* Results List (tiles like before) */}
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
                    {loadingResources ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-blue-200 bg-white p-5 text-slate-700"
                      >
                        Loading resources…
                      </motion.div>
                    ) : filteredLocations.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-2xl border border-blue-200 bg-white p-5 text-blue-900"
                      >
                        No matches. Try removing a filter or changing your search.
                      </motion.div>
                    ) : (
                      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                              {loc.featured ? (
                                <span className="shrink-0 text-xs px-2 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-900">
                                  Featured
                                </span>
                              ) : null}
                            </div>

                            <div className="mt-2 text-sm text-slate-600">{loc.address}</div>

                            {loc.description && (
                              <div className="mt-2 text-sm text-slate-600">
                                {loc.description}
                              </div>
                            )}

                            {loc.host ? (
                              <div className="mt-3 text-xs text-slate-600">
                                <span className="font-semibold text-slate-700">Host:</span>{" "}
                                {loc.host}
                              </div>
                            ) : null}

                            <div className="mt-3 flex flex-wrap gap-2">
                              {(loc.activities ?? []).slice(0, 6).map((a) => (
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

/** ---------- One-click Seed Button ----------
 * Writes docs into Firestore "resources" using Places textSearch result:
 * - formatted_address (real address)
 * - geometry.location (real lat/lng)
 * Uses seedKey as doc id so you can’t duplicate by clicking twice.
 */
function SeedResourcesButton({
  seeding,
  setSeeding,
  seedMsg,
  setSeedMsg,
}: {
  seeding: boolean;
  setSeeding: (v: boolean) => void;
  seedMsg: string | null;
  setSeedMsg: (v: string | null) => void;
}) {
  const placesLib = useMapsLibrary("places");

  const runSeed = async () => {
    if (!placesLib) {
      setSeedMsg("Places library is not ready yet. Try again in a second.");
      return;
    }

    setSeeding(true);
    setSeedMsg(null);

    try {
      // Use PlacesService textSearch to get real formatted addresses + lat/lng
      const svc = new placesLib.PlacesService(document.createElement("div"));

      const resolvePlace = (q: string) =>
        new Promise<google.maps.places.PlaceResult | null>((resolve) => {
          svc.textSearch({ query: q }, (results, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              results &&
              results.length > 0
            ) {
              resolve(results[0]);
            } else {
              resolve(null);
            }
          });
        });

      const batch = writeBatch(db);
      const failures: string[] = [];

      for (const item of SEED_PLACES) {
        const place = await resolvePlace(item.query);

        if (!place?.geometry?.location || !place.formatted_address) {
          failures.push(item.title);
          continue;
        }

        const position = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };

        const ref = doc(db, "resources", item.seedKey); // ✅ prevents duplicates
        batch.set(
          ref,
          {
            seedKey: item.seedKey,
            title: item.title,
            address: place.formatted_address, // ✅ real address from Google
            position,
            eventType: item.eventType,
            activities: item.activities,
            host: item.host ?? "",
            description: item.description ?? "",
            featured: !!item.featured,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
      }

      await batch.commit();

      if (failures.length > 0) {
        setSeedMsg(
          `Saved starter resources ✅ (Some could not be resolved: ${failures.join(
            ", ",
          )})`,
        );
      } else {
        setSeedMsg("Saved starter resources ✅");
      }
    } catch (e) {
      console.error(e);
      setSeedMsg("Could not save starter resources. Check console for details.");
    } finally {
      setSeeding(false);
      // auto-clear message after a bit
      window.setTimeout(() => setSeedMsg(null), 3500);
    }
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      onClick={runSeed}
      disabled={seeding}
      className={`px-4 py-2 rounded-xl border text-sm transition ${
        seeding
          ? "border-slate-200 bg-white text-slate-400 cursor-not-allowed"
          : "border-blue-200 bg-white text-blue-900 hover:bg-blue-50"
      }`}
      title="Adds a starter set of resources to Firestore (resources collection) using Places results."
    >
      {seeding ? "Saving…" : "Save starter resources"}
    </motion.button>
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
            <h2 className="text-lg sm:text-xl font-bold text-[#1E3A8A]">Filter</h2>
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
 * (kept the same UX, but now searches Firestore-loaded resources)
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
  directoryResults: ResourceDoc[];
  onDirectoryPick: (loc: ResourceDoc) => void;

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
          loc.host ?? "",
          loc.description ?? "",
          ...(loc.activities ?? []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [directoryQuery, directoryResults]);

  const handleSelectPlace = (placeId: string) => {
    if (!placesLib) return;
    const detailsService = new placesLib.PlacesService(document.createElement("div"));

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

      {/* Dropdown */}
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

/** ---------- Marker ----------
 * ✅ Removed the time section everywhere (no "when" field at all now)
 */
function HoverMarker({
  location,
  activeId,
  setActiveId,
  onCenter,
}: {
  location: ResourceDoc;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  onCenter: (loc: ResourceDoc) => void;
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
        transform: "translate(-50%, -100%)",
        cursor: "pointer",
        zIndex: isExpanded ? 9999 : 1,
        position: "relative",
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
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8"
            >
              <Image src="/marker.png" alt={location.title} width={32} height={32} priority />
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
                  <div className="text-sm font-bold leading-tight">{location.title}</div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold">Address:</span> {location.address}
                  </div>

                  {location.host ? (
                    <div className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Host:</span>{" "}
                      {location.host}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-1">
                    {(location.activities ?? []).slice(0, 3).map((activity) => (
                      <span
                        key={activity}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50
                                   text-blue-700 border border-blue-200 font-medium"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-slate-100">
                    <div className="text-[10px] text-slate-500">Click again to close</div>
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
