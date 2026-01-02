"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { EventItem } from "./page";

export default function RegisterClient({ events }: { events: EventItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idParam = searchParams.get("id");
  const eventId = Number(idParam);

  const event = useMemo(() => {
    if (!idParam || Number.isNaN(eventId)) return null;
    return events.find((e) => e.id === eventId) ?? null;
  }, [events, idParam, eventId]);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);

  if (!idParam) return null;

  if (!event) {
    return (
      <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-indigo-300">Event not found</h2>
        <p className="text-slate-300 mt-2">
          That registration link is missing a valid event id.
        </p>
        <button
          onClick={() => router.push("/events")}
          className="mt-5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const percent = Math.round((event.attendees / event.spots) * 100);
  const spotsLeft = event.spots - event.attendees;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 650));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="mt-10">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-indigo-300">
              Register for: {event.title}
            </h2>
            <p className="text-slate-400 mt-2">
              {event.date} • {event.time} • {event.location}
            </p>
          </div>

          <button
            onClick={() => router.push("/events")}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15"
          >
            ✕ Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          <section className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-2">Event details</h3>
            <p className="text-slate-300 text-sm">{event.description}</p>

            <div className="mt-5">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{percent}% filled</span>
                <span>{spotsLeft} spots left</span>
              </div>
            </div>
          </section>

          <section className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-5">
            {!submitted ? (
              <form onSubmit={onSubmit} className="grid gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-300">First name</label>
                    <input
                      value={first}
                      onChange={(e) => setFirst(e.target.value)}
                      required
                      className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Jane"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300">Last name</label>
                    <input
                      value={last}
                      onChange={(e) => setLast(e.target.value)}
                      required
                      className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                    className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300">Notes (optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[90px]"
                    placeholder="Anything we should know?"
                  />
                </div>

                <label className="flex items-start gap-3 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1"
                    required
                  />
                  <span>I agree to follow the community code of conduct.</span>
                </label>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-70 text-white py-2 rounded-xl"
                  >
                    {loading ? "Submitting..." : "Submit Registration"}
                  </button>

                  <button
                    type="button"
                    onClick={() => router.push("/events")}
                    className="flex-1 bg-transparent border border-white/10 text-slate-200 py-2 rounded-xl hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-xl font-semibold text-indigo-300">
                  You’re registered ✅
                </h3>
                <p className="text-slate-300 mt-2">
                  Thanks, {first}! Your spot is saved for{" "}
                  <span className="text-white font-semibold">{event.title}</span>.
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => router.push("/events")}
                    className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
                  >
                    Back to Events
                  </button>
                  <Link
                    href="/map"
                    className="flex-1 text-center bg-transparent border border-white/10 text-slate-200 py-2 rounded-xl hover:bg-white/10"
                  >
                    View Map
                  </Link>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="mt-4 text-xs text-slate-500">
          Tip: This page uses <code>?id=</code> in the URL. Example: <code>/events?id=1</code>
        </div>
      </div>
    </div>
  );
}
