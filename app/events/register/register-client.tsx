"use client";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import { db } from "@/lib/firebase";

import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageFade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35, ease: EASE_OUT } },
};

const cardUp: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE_OUT },
  },
};

type EventFromDB = {
  title?: string;
  date?: string; // "2026-01-17" (from admin)
  startTime?: string; // "10:13"
  endTime?: string; // "22:14"
  venue?: string;
  address?: string;
  description?: string;
  spots?: number; // capacity
  attendees?: number; // registered count
  indoorOutdoor?: "Indoor" | "Outdoor" | "Both";
  contact?: string;
};

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("id"); 

  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<(EventFromDB & { id: string }) | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [agree, setAgree] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoadError(null);
    setSubmitted(false);
    setSubmitError(null);

    if (!eventId) {
      setLoading(false);
      setEvent(null);
      setLoadError("Missing event id.");
      return;
    }

    const ref = doc(db, "events", eventId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setEvent(null);
          setLoading(false);
          setLoadError("Event not found.");
          return;
        }
        const data = snap.data() as EventFromDB;

        setEvent({
          id: snap.id,
          ...data,
          spots: typeof data.spots === "number" ? data.spots : 0,
          attendees: typeof data.attendees === "number" ? data.attendees : 0,
        });

        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setEvent(null);
        setLoadError(err?.message || "Failed to load event.");
      },
    );

    return () => unsub();
  }, [eventId]);

  const prettyTime = useMemo(() => {
    if (!event) return "";
    const s = event.startTime?.trim();
    const e = event.endTime?.trim();
    if (!s && !e) return "";
    if (s && e) return `${s} – ${e}`;
    return s || e || "";
  }, [event]);

  const spots = event?.spots ?? 0;
  const attendees = event?.attendees ?? 0;
  const spotsLeft = Math.max(0, spots - attendees);
  const percent = spots > 0 ? Math.round((attendees / spots) * 100) : 0;
  const isFull = spots > 0 && attendees >= spots;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!eventId) return setSubmitError("Missing event name.");
    if (!agree) return setSubmitError("Please agree to the code of conduct.");
    if (!email.trim()) return setSubmitError("Please enter an email.");

    try {
      setSubmitting(true);

      const eventRef = doc(db, "events", eventId);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(eventRef);
        if (!snap.exists()) throw new Error("Event not found.");

        const data = snap.data() as EventFromDB;

        const cap = typeof data.spots === "number" ? data.spots : 0;
        const cur = typeof data.attendees === "number" ? data.attendees : 0;

        if (cap > 0 && cur >= cap) {
          throw new Error("Sorry but this event is full.");
        }

        const regRef = doc(collection(db, "events", eventId, "registrations"));
        tx.set(regRef, {
          first: first.trim(),
          last: last.trim(),
          email: email.trim().toLowerCase(),
          notes: notes.trim(),
          createdAt: serverTimestamp(),
        });

        tx.update(eventRef, { attendees: cur + 1 });
      });

      setSubmitted(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        variants={pageFade}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 flex items-center justify-center px-6"
      >
        <motion.div
          variants={cardUp}
          className="max-w-xl w-full bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
        >
          <p className="text-slate-600">Loading registration…</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!event) {
    return (
      <motion.div
        variants={pageFade}
        initial="hidden"
        animate="show"
        className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 flex items-center justify-center px-6"
      >
        <motion.div
          variants={cardUp}
          className="max-w-xl w-full bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
        >
          <h1 className="text-2xl font-semibold text-[#143B8C]">Event not found</h1>
          <p className="text-slate-600 mt-2">{loadError || "Invalid link."}</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition active:scale-[0.99]"
          >
            Back to Events
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageFade}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 antialiased"
    >
      <div className="max-w-5xl mx-auto px-6 py-10">
        <motion.div variants={cardUp} className="mb-6">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-3xl font-semibold text-[#143B8C]">
                Register for {event.title || "Event"}
              </h1>
              <p className="mt-2 text-slate-600">
                {(event.date || "").trim()}
                {prettyTime ? ` • ${prettyTime}` : ""}
                {event.venue ? ` • ${event.venue}` : ""}
              </p>
              {event.address ? (
                <p className="mt-1 text-slate-600">{event.address}</p>
              ) : null}
            </div>

            <Link
              href="/events"
              className="px-4 py-2 rounded-xl bg-white border border-blue-200 hover:bg-blue-50 transition"
            >
              Back to Events
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <motion.section
            variants={cardUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold mb-2 text-[#143B8C]">Event details</h2>
            <p className="text-slate-700 text-sm">{event.description || "—"}</p>

            <div className="mt-5">
              <div className="h-2 w-full bg-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                  transition={{ duration: 0.6, ease: EASE_OUT }}
                  className="h-full bg-gradient-to-r from-blue-600 to-sky-500"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-600 mt-1">
                <span>{percent}% filled</span>
                <span>{spotsLeft} spots left</span>
              </div>
            </div>

            {isFull ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                This event is currently full.
              </div>
            ) : null}
          </motion.section>
          <motion.section
            variants={cardUp}
            initial="hidden"
            animate="show"
            className="lg:col-span-7 bg-white border border-blue-200 rounded-2xl p-6 shadow-sm"
          >
            {!submitted ? (
              <>
                <h2 className="text-lg font-semibold mb-2 text-[#143B8C]">Your info</h2>

                {submitError ? (
                  <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </div>
                ) : null}

                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-700">First name</label>
                      <input
                        required
                        value={first}
                        onChange={(e) => setFirst(e.target.value)}
                        className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="James"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-700">Last name</label>
                      <input
                        required
                        value={last}
                        onChange={(e) => setLast(e.target.value)}
                        className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-700">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-700">Notes (optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1 w-full bg-white border border-blue-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 min-h-[100px]"
                      placeholder="Anything we should know?"
                    />
                  </div>

                  <label className="flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="mt-1 accent-blue-600"
                      required
                    />
                    <span>I agree to follow the event rules and code of conduct.</span>
                  </label>

                  <button
                    type="submit"
                    disabled={submitting || isFull}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:hover:bg-blue-600 text-white py-2 rounded-xl transition active:scale-[0.99]"
                  >
                    {isFull ? "Event Full" : submitting ? "Registering..." : "Confirm Registration"}
                  </button>

                  <p className="text-xs text-slate-600">
                    By registering, you’ll receive updates about this event.
                  </p>
                </form>
              </>
            ) : (
              <div className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-semibold text-[#143B8C]">You’re registered ✅</h2>
                <p className="text-slate-700 mt-2">Thanks, {first}! Your spot is saved.</p>

                <div className="mt-4 text-sm text-slate-700 space-y-1">
                  <p>
                    <span className="text-slate-500">Event:</span> {event.title}
                  </p>
                  <p>
                    <span className="text-slate-500">When:</span> {event.date}
                    {prettyTime ? ` • ${prettyTime}` : ""}
                  </p>
                  <p>
                    <span className="text-slate-500">Where:</span> {event.venue}
                    {event.address ? ` • ${event.address}` : ""}
                  </p>
                  <p>
                    <span className="text-slate-500">Email:</span> {email}
                  </p>
                  {notes.trim() ? (
                    <p>
                      <span className="text-slate-500">Notes:</span> {notes}
                    </p>
                  ) : null}
                </div>

                <Link
                  href="/events"
                  className="mt-6 block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition active:scale-[0.99]"
                >
                  Back to Events
                </Link>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
