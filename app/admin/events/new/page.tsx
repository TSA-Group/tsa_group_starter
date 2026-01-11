"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminShell from "../../_components/AdminShell";

// ✅ IMPORTANT: your firebase file path (change if needed)
import { db } from "@/lib/firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

/* =====================
   Motion
===================== */
const sectionAnim: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

/* =====================
   Options
===================== */
const COMMUNITIES = ["Cross Creek Ranch"] as const;

const EVENT_TYPES = [
  "Community",
  "Meetup",
  "Cleanup",
  "Food Pantry",
  "Tutoring",
  "Clothing",
  "Workshop",
  "Other",
] as const;

const ACTIVITIES = [
  "Food",
  "Volunteering",
  "Education",
  "Donations",
  "Outdoors",
  "Family",
] as const;

export type EventDoc = {
  community: (typeof COMMUNITIES)[number];

  // multi select
  types: (typeof EVENT_TYPES)[number][];
  activities: (typeof ACTIVITIES)[number][];

  title: string;

  // strings for UI
  date: string; // yyyy-mm-dd
  startTime: string; // HH:MM
  endTime: string; // HH:MM

  // timestamps for sorting/querying
  startAt: Timestamp;
  endAt: Timestamp;

  venue: string;
  address: string;

  indoorOutdoor: "Indoor" | "Outdoor" | "Both";
  contact: string;
  description: string;

  // ✅ registration capacity + current attendees
  spots: number;
  attendees: number;

  createdAt: any; // serverTimestamp
};

/* =====================
   Helpers
===================== */
function toTimestamp(date: string, time: string) {
  // date = "2026-01-09", time = "18:30"
  const d = new Date(`${date}T${time}:00`);
  return Timestamp.fromDate(d);
}

/* =====================
   Page
===================== */
export default function AddEventPage() {
  const router = useRouter();

  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const [community, setCommunity] = React.useState<(typeof COMMUNITIES)[number]>(
    "Cross Creek Ranch",
  );

  // Multi selects
  const [types, setTypes] = React.useState<(typeof EVENT_TYPES)[number][]>([
    "Community",
  ]);
  const [activities, setActivities] = React.useState<(typeof ACTIVITIES)[number][]>([
    "Volunteering",
  ]);

  const [typesOpen, setTypesOpen] = React.useState(false);
  const [actsOpen, setActsOpen] = React.useState(false);
  const typesRef = React.useRef<HTMLDivElement | null>(null);
  const actsRef = React.useRef<HTMLDivElement | null>(null);

  // Fields
  const [title, setTitle] = React.useState("");
  const [date, setDate] = React.useState("");
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const [venue, setVenue] = React.useState("");
  const [address, setAddress] = React.useState("");

  const [indoorOutdoor, setIndoorOutdoor] = React.useState<
    "Indoor" | "Outdoor" | "Both"
  >("Both");

  const [contact, setContact] = React.useState("");
  const [description, setDescription] = React.useState("");

  // ✅ NEW: capacity / spots
  const [spots, setSpots] = React.useState<number>(30);

  // close dropdowns when clicking outside
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (typesRef.current && !typesRef.current.contains(target)) setTypesOpen(false);
      if (actsRef.current && !actsRef.current.contains(target)) setActsOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggleInArray = <T,>(arr: T[], value: T, setter: (v: T[]) => void) => {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const logoutAndHome = () => {
    localStorage.removeItem("admin_authed");
    router.push("/");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // validation
    if (!title.trim()) return setError("Please enter an Event Title.");
    if (!date) return setError("Please select an Event Date.");
    if (!startTime || !endTime) return setError("Please select Start + End time.");
    if (!venue.trim() || !address.trim())
      return setError("Please fill out Venue and Address.");
    if (types.length === 0) return setError("Please select at least 1 Event Type.");
    if (activities.length === 0) return setError("Please select at least 1 Activity.");
    if (!Number.isFinite(spots) || spots <= 0)
      return setError("Please enter a valid capacity (spots) greater than 0.");

    // build timestamps (so Events page can sort/query)
    let startAt: Timestamp;
    let endAt: Timestamp;

    try {
      startAt = toTimestamp(date, startTime);
      endAt = toTimestamp(date, endTime);

      if (endAt.toMillis() <= startAt.toMillis()) {
        return setError("End time must be after start time.");
      }
    } catch {
      return setError("Invalid date/time. Please re-check fields.");
    }

    try {
      setSaving(true);

      const payload: Omit<EventDoc, "createdAt"> & { createdAt: any } = {
        community,
        types,
        activities,

        title: title.trim(),
        date,
        startTime,
        endTime,

        startAt,
        endAt,

        venue: venue.trim(),
        address: address.trim(),

        indoorOutdoor,
        contact: contact.trim(),
        description: description.trim(),

        // ✅ NEW saved fields
        spots,
        attendees: 0,

        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events"), payload);

      setSent(true);
      window.setTimeout(() => setSent(false), 2200);

      // reset
      setTitle("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setVenue("");
      setAddress("");
      setIndoorOutdoor("Both");
      setContact("");
      setDescription("");
      setTypes(["Community"]);
      setActivities(["Volunteering"]);
      setSpots(30);
    } catch (err: any) {
      setError(err?.message || "Failed to save event. Check Firestore rules.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title="Add Event"
      subtitle="Create community events that appear on the public Events page."
    >
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
              Community → Event (types + activities, title, date/time, venue/address,
              indoor/outdoor, contact, description, capacity)
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <AnimatePresence>
                {sent && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                  >
                    ✅ Event saved to Firestore!
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
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                    }}
                    className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                  >
                    ❌ {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Field label="Community Name">
              <select
                value={community}
                onChange={(e) =>
                  setCommunity(e.target.value as (typeof COMMUNITIES)[number])
                }
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {COMMUNITIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0b1020]">
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Event Types (multi-select)">
              <MultiSelect
                refEl={typesRef}
                open={typesOpen}
                setOpen={setTypesOpen}
                value={types}
                options={EVENT_TYPES}
                onToggle={(t) => toggleInArray(types, t, setTypes)}
                onClear={() => setTypes([])}
                placeholder="Select event types…"
              />
            </Field>

            <Field label="Activities (multi-select)">
              <MultiSelect
                refEl={actsRef}
                open={actsOpen}
                setOpen={setActsOpen}
                value={activities}
                options={ACTIVITIES}
                onToggle={(a) => toggleInArray(activities, a, setActivities)}
                onClear={() => setActivities([])}
                placeholder="Select activities…"
              />
            </Field>

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

            <div className="md:col-span-2">
              <Field label="Event Title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Example: Community Dinner Night"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
            </div>

            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            <Field label="Start / End Time">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>
            </Field>

            {/* ✅ NEW: capacity */}
            <Field label="Registration Capacity (spots)">
              <input
                type="number"
                min={1}
                step={1}
                value={spots}
                onChange={(e) => setSpots(Number(e.target.value))}
                required
                placeholder="Example: 60"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            <Field label="Venue Name">
              <input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                required
                placeholder="Example: Cross Creek Ranch Welcome Center"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            <Field label="Address">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Full street address (recommended)"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </Field>

            <div className="md:col-span-2">
              <Field label="Contact (optional)">
                <input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Phone / email / website"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Description (optional)">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this event about?"
                  className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </Field>
            </div>

            <div className="md:col-span-2 flex items-center justify-between gap-3 flex-wrap pt-2">
              <div className="text-xs text-white/55">
                Saves to Firestore: <span className="font-semibold">events</span>
              </div>

              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={saving}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold shadow-[0_20px_55px_rgba(37,99,235,0.25)] hover:brightness-110 transition disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Event"}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </AdminShell>
  );
}

/* =====================
   Components
===================== */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-semibold text-white/85">{label}</div>
      {children}
    </div>
  );
}

function MultiSelect<T extends string>({
  refEl,
  open,
  setOpen,
  value,
  options,
  onToggle,
  onClear,
  placeholder,
}: {
  refEl: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  setOpen: (v: boolean) => void;
  value: T[];
  options: readonly T[];
  onToggle: (opt: T) => void;
  onClear: () => void;
  placeholder: string;
}) {
  return (
    <div ref={refEl} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="truncate">
            {value.length === 0 ? (
              <span className="text-white/50">{placeholder}</span>
            ) : (
              <span className="text-white">{value.join(", ")}</span>
            )}
          </div>
          <span className="text-white/60">{open ? "▲" : "▼"}</span>
        </div>
      </button>

      <AnimatePresence>
        {open && (
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
              {options.map((opt) => {
                const checked = value.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggle(opt)}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition text-left"
                  >
                    <span className="text-sm text-white/90">{opt}</span>
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
                onClick={onClear}
                className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 transition"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs px-3 py-2 rounded-xl bg-blue-600/90 text-white hover:bg-blue-600 transition"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
