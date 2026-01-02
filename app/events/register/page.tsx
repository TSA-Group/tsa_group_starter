"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EVENTS } from "../../page"; // imports the same events list

export default function RegisterPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const eventId = Number(params?.id);
  const event = useMemo(
    () => EVENTS.find((e) => e.id === eventId),
    [eventId],
  );

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // form state
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0b1220] text-white flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-6">
          <h1 className="text-2xl font-semibold">Event not found</h1>
          <p className="text-slate-300 mt-2">
            That event doesn’t exist (or the link is wrong).
          </p>
          <Link
            href="/events"
            className="inline-block mt-5 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const percent = Math.round((event.attendees / event.spots) * 100);
  const spotsLeft = event.spots - event.attendees;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;

    setLoading(true);

    // Simulate an API call (replace with real DB later)
    await new Promise((r) => setTimeout(r, 700));

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white antialiased">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-indigo-300">
              Register for: {event.title}
            </h1>
            <p className="text-slate-400 mt-2">
              {event.date} • {event.time} • {event.location}
            </p>
          </div>

          <Link
            href="/events"
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/15"
          >
            ← Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Event summary */}
          <section className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-2">Event details</h2>
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

            <div className="mt-6 text-sm text-slate-300 space-y-2">
              <p>
                <span className="text-slate-400">Location:</span>{" "}
                {event.location}
              </p>
              <p>
                <span className="text-slate-400">Date:</span> {event.date}
              </p>
              <p>
                <span className="text-slate-400">Time:</span> {event.time}
              </p>
            </div>

            <div className="mt-6 text-xs text-slate-400">
              Note: This is a demo registration form. Later you can connect it
              to a database or Google Sheets.
            </div>
          </section>

          {/* Right: Form */}
          <section className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold mb-2">Your info</h2>
                <p className="text-slate-400 text-sm mb-5">
                  Fill this out to reserve a spot. You’ll see a confirmation
                  screen after submitting.
                </p>

                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300">
                        First name
                      </label>
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
                    <label className="text-xs text-slate-300">
                      Notes (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
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
                    <span>
                      I understand this is a community event and I will follow
                      the guidelines and code of conduct.
                    </span>
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
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-2xl font-semibold text-indigo-300">
                  You’re registered ✅
                </h2>
                <p className="text-slate-300 mt-2">
                  Thanks, {first}! We’ve saved your spot for{" "}
                  <span className="text-white font-semibold">{event.title}</span>.
                </p>

                <div className="mt-4 text-sm text-slate-300 space-y-1">
                  <p>
                    <span className="text-slate-400">When:</span> {event.date} •{" "}
                    {event.time}
                  </p>
                  <p>
                    <span className="text-slate-400">Where:</span>{" "}
                    {event.location}
                  </p>
                  <p>
                    <span className="text-slate-400">Email:</span> {email}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Link
                    href="/events"
                    className="flex-1 text-center bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl"
                  >
                    Back to Events
                  </Link>
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
      </div>
    </div>
  );
}

