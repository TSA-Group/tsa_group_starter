// app/admin/add-resource/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import AdminShell from "../../_components/AdminShell";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp, type Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

const sectionAnim: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const COMMUNITIES = ["Cross Creek Ranch"] as const;

/**
 * ✅ These MUST match what your MAP page expects:
 * eventType: "Community Event" | "Park & Trails" | ...
 * activities: "Family" | "Outdoors" | ...
 */
const EVENT_OPTIONS = [
  "Community Event",
  "Park & Trails",
  "Fitness",
  "Grocery",
  "Library",
  "Support Services",
  "Food Pantry",
  "Volunteer Opportunity",
  "Other",
] as const;

const ACTIVITY_OPTIONS = [
  "Family",
  "Outdoors",
  "Food",
  "Education",
  "Health",
  "Support",
  "Volunteering",
  "Shopping",
] as const;

/**
 * ✅ Keep your existing "types" for the /resources page (admin tiles).
 * We'll still write "types" exactly like before.
 */
const RESOURCE_TYPES = [
  "Gym/Fitness",
  "Park/Trails",
  "Grocery",
  "Library",
  "Support Services",
  "Non-Profit",
  "Clinic/Health",
  "Other",
] as const;

type LatLng = { lat: number; lng: number };

export type ResourceDoc = {
  // existing fields your /resources page reads
  community: (typeof COMMUNITIES)[number];
  types: (typeof RESOURCE_TYPES)[number][];
  name: string;
  address: string;
  indoorOutdoor: "Indoor" | "Outdoor" | "Both";
  contact: string;
  location?: { lat: number; lng: number } | null;
  createdAt: Timestamp | null;

  // ✅ fields your MAP page reads
  title: string;
  position: LatLng;
  eventType: (typeof EVENT_OPTIONS)[number];
  activities: (typeof ACTIVITY_OPTIONS)[number][];
  host?: string;
  description?: string;
  featured?: boolean;
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-white/85">{label}</div>
      {children}
    </div>
  );
}

async function geocodeAddress(address: string, apiKey: string): Promise<LatLng | null> {
  const url =
    "https://maps.googleapis.com/maps/api/geocode/json?address=" +
    encodeURIComponent(address) +
    "&key=" +
    encodeURIComponent(apiKey);

  const res = await fetch(url);
  const data = await res.json();

  const loc = data?.results?.[0]?.geometry?.location;
  const lat = Number(loc?.lat);
  const lng = Number(loc?.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export default function AddResourcePage() {
  const router = useRouter();

  // ✅ Put this in .env.local (and Vercel env):
  // NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxxx
  const mapsKey = "AIzaSyCiMFgLk0Yr6r-no_flkRFIlYNU0PNvlZM";

  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [community, setCommunity] = React.useState<(typeof COMMUNITIES)[number]>("Cross Creek Ranch");

  // existing multi-select (for /resources page)
  const [types, setTypes] = React.useState<(typeof RESOURCE_TYPES)[number][]>(["Park/Trails"]);
  const [typesOpen, setTypesOpen] = React.useState(false);
  const typesRef = React.useRef<HTMLDivElement | null>(null);

  // ✅ NEW: map category + activities
  const [eventType, setEventType] = React.useState<(typeof EVENT_OPTIONS)[number]>("Other");

  const [activities, setActivities] = React.useState<(typeof ACTIVITY_OPTIONS)[number][]>([]);
  const [activitiesOpen, setActivitiesOpen] = React.useState(false);
  const activitiesRef = React.useRef<HTMLDivElement | null>(null);

  const [featured, setFeatured] = React.useState(false);

  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [indoorOutdoor, setIndoorOutdoor] = React.useState<"Indoor" | "Outdoor" | "Both">("Both");
  const [contact, setContact] = React.useState("");

  // optional extras for map cards
  const [host, setHost] = React.useState("");
  const [description, setDescription] = React.useState("");

  // ✅ close dropdowns when clicking outside
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (typesRef.current && !typesRef.current.contains(e.target as Node)) setTypesOpen(false);
      if (activitiesRef.current && !activitiesRef.current.contains(e.target as Node))
        setActivitiesOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggleType = (t: (typeof RESOURCE_TYPES)[number]) => {
    setTypes((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const toggleActivity = (a: (typeof ACTIVITY_OPTIONS)[number]) => {
    // ✅ NOTE: default is [], so "Family" won't be auto-selected unless you click it
    setActivities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  };

  const logoutAndHome = () => {
    localStorage.removeItem("admin_authed");
    router.push("/");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !address.trim()) {
      setError("Please fill out Resource Name and Address.");
      return;
    }
    if (types.length === 0) {
      setError("Please select at least 1 Resource Type.");
      return;
    }
    if (!mapsKey) {
      setError("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local (needed to geocode address).");
      return;
    }

    try {
      setSaving(true);

      // ✅ Convert address -> lat/lng so MAP page can show marker
      const pos = await geocodeAddress(address.trim(), mapsKey);
      if (!pos) {
        setError("Could not convert that address to coordinates. Try a more specific address.");
        return;
      }

      // ✅ Write BOTH formats:
      // - old fields for /resources page
      // - new fields for /map page
      await addDoc(collection(db, "resources"), {
        // /resources page fields (keep exactly)
        community,
        types,
        name: name.trim(),
        address: address.trim(),
        indoorOutdoor,
        contact: contact.trim(),
        location: null,
        createdAt: serverTimestamp(),

        // /map page fields
        title: name.trim(), // map reads "title"
        position: pos, // map reads "position" {lat,lng}
        eventType, // map reads "eventType"
        activities, // map reads "activities"
        host: host.trim() || undefined,
        description: description.trim() || undefined,
        featured,
      } satisfies Partial<ResourceDoc>);

      setSent(true);
      window.setTimeout(() => setSent(false), 2200);

      // reset
      setName("");
      setAddress("");
      setContact("");
      setIndoorOutdoor("Both");
      setTypes(["Park/Trails"]);
      setEventType("Other");
      setActivities([]); // ✅ prevents “Family auto on”
      setHost("");
      setDescription("");
      setFeatured(false);
    } catch (err: any) {
      setError(err?.message || "Failed to save resource. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Add Resource"
      subtitle="Resources are places/services that exist (gym, parks, grocery stores, support services)."
    >
      {/* ✅ Back to Home (logs out) */}
      <div className="mb-4">
        <motion.button
          onClick={logoutAndHome}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition"
        >
          <span aria-hidden>←</span>
          Back to Home
        </motion.button>
      </div>

      <motion.div variants={sectionAnim} initial="hidden" animate="show">
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_70px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="text-white/80 font-semibold">Subsections</div>
            <div className="mt-2 text-sm text-white/60">
              Community Name → Resources (types, name, address, indoor/outdoor, contact) + Map (category,
              activities, marker coords)
            </div>
          </div>

          <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.25 },
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.2 },
                    }}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                  >
                    ✅ Resource saved to Firestore!
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.25 },
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.2 },
                    }}
                    className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    ❌ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Community */}
            <Field label="Community Name">
              <select
                value={community}
                onChange={(e) => setCommunity(e.target.value as (typeof COMMUNITIES)[number])}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {COMMUNITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0b1020]">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            {/* ✅ MAP Category (eventType) */}
            <Field label="Category (for Map filters)">
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as (typeof EVENT_OPTIONS)[number])}
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {EVENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#0b1020]">
                    {opt}
                  </option>
                ))}
              </select>
            </Field>

            {/* ✅ Resource Types (kept for /resources page) */}
            <Field label="Resource Types (for Resources tab, multi-select)">
              <div ref={typesRef} className="relative">
                <button
                  type="button"
                  onClick={() => setTypesOpen((v) => !v)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      {types.length === 0 ? (
                        <span className="text-white/50">Select types…</span>
                      ) : (
                        <span className="text-white">{types.join(", ")}</span>
                      )}
                    </div>
                    <span className="text-white/60">{typesOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {typesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        filter: "blur(6px)",
                        transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
                      }}
                      className="absolute z-20 mt-2 w-full rounded-2xl border border-white/10 bg-[#070A12]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-2"
                    >
                      <div className="max-h-56 overflow-auto">
                        {RESOURCE_TYPES.map((t) => {
                          const checked = types.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => toggleType(t)}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition text-left"
                            >
                              <span className="text-sm text-white/90">{t}</span>
                              <span
                                className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs ${
                                  checked
                                    ? "border-blue-400/40 bg-blue-500/20 text-white"
                                    : "border-white/15 bg-white/5 text-white/40"
                                }`}
                              >
                                {checked ? "✓" : ""}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 mt-2">
                        <button
                          type="button"
                          onClick={() => setTypes([])}
                          className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setTypesOpen(false)}
                          className="text-xs px-3 py-2 rounded-xl bg-blue-600/90 text-white hover:bg-blue-600 transition"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Field>

            {/* ✅ Activities (for Map filters, multi-select) */}
            <Field label="Activities (for Map filters, multi-select)">
              <div ref={activitiesRef} className="relative">
                <button
                  type="button"
                  onClick={() => setActivitiesOpen((v) => !v)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="truncate">
                      {activities.length === 0 ? (
                        <span className="text-white/50">Select activities… (optional)</span>
                      ) : (
                        <span className="text-white">{activities.join(", ")}</span>
                      )}
                    </div>
                    <span className="text-white/60">{activitiesOpen ? "▲" : "▼"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {activitiesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                        filter: "blur(6px)",
                        transition: { duration: 0.16, ease: [0.16, 1, 0.3, 1] },
                      }}
                      className="absolute z-20 mt-2 w-full rounded-2xl border border-white/10 bg-[#070A12]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-2"
                    >
                      <div className="max-h-56 overflow-auto">
                        {ACTIVITY_OPTIONS.map((a) => {
                          const checked = activities.includes(a);
                          return (
                            <button
                              key={a}
                              type="button"
                              onClick={() => toggleActivity(a)}
                              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition text-left"
                            >
                              <span className="text-sm text-white/90">{a}</span>
                              <span
                                className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs ${
                                  checked
                                    ? "border-blue-400/40 bg-blue-500/20 text-white"
                                    : "border-white/15 bg-white/5 text-white/40"
                                }`}
                              >
                                {checked ? "✓" : ""}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 mt-2">
                        <button
                          type="button"
                          onClick={() => setActivities([])}
                          className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setActivitiesOpen(false)}
                          className="text-xs px-3 py-2 rounded-xl bg-blue-600/90 text-white hover:bg-blue-600 transition"
                        >
                          Done
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Field>

            {/* Name */}
            <Field label="Resource Name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Example: Cross Creek Ranch Fitness Center"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            {/* Indoor/Outdoor */}
            <Field label="Indoor / Outdoor">
              <div className="grid grid-cols-3 gap-2">
                {(["Indoor", "Outdoor", "Both"] as const).map((opt) => {
                  const active = indoorOutdoor === opt;
                  return (
                    <motion.button
                      key={opt}
                      type="button"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setIndoorOutdoor(opt)}
                      className={`rounded-2xl px-3 py-3 text-sm border transition ${
                        active
                          ? "border-blue-500/40 bg-blue-500/15 text-white"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {opt}
                    </motion.button>
                  );
                })}
              </div>
            </Field>

            {/* Address */}
            <div className="md:col-span-2">
              <Field label="Address (will be converted to marker coords)">
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  placeholder="Street address (recommended) or landmark"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
            </div>

            {/* Contact */}
            <div className="md:col-span-2">
              <Field label="Contact">
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone / email / website (optional)"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
            </div>

            {/* Optional: Host + Description */}
            <Field label="Host (optional)">
              <input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="Example: Cross Creek HOA / Library staff"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            <Field label="Description (optional)">
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short info shown on map cards (optional)"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            {/* Featured */}
            <div className="md:col-span-2">
              <Field label="Featured (shows in Spotlight on map page)">
                <button
                  type="button"
                  onClick={() => setFeatured((v) => !v)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    featured
                      ? "border-blue-500/40 bg-blue-500/15 text-white"
                      : "border-white/10 bg-black/30 text-white/80 hover:bg-white/5"
                  }`}
                >
                  {featured ? "✓ Featured: ON" : "Featured: OFF"}
                  <div className="text-xs mt-1 text-white/55">
                    Turn ON if you want it to appear in the “Spotlight Resources” section.
                  </div>
                </button>
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-3 flex-wrap pt-2">
              <div className="text-xs text-white/55">
                Saves to Firestore collection: <span className="font-semibold">resources</span>
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={saving}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-[0_20px_55px_rgba(37,99,235,0.25)] hover:brightness-110 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Resource"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </AdminShell>
  );
}
