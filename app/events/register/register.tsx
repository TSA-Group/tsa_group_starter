"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export type EventItem = {
  id: number;
  title: string;
  category: string;
  activities: string[];
  date: string;
  time: string;
  location: string;
  attendees: number;
  spots: number;
  description: string;
};

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
  const [agree, setAgree] = useState(false);

  if (!idParam) return null;

  if (!event) {
    return (
      <div className="mt-8 p-6 border rounded-xl bg-gray-800 text-white">
        <h2 className="text-xl font-semibold text-indigo-300">
          Event not found
        </h2>
        <button
          onClick={() => router.push("/events")}
          className="mt-4 px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="mt-8 p-6 border rounded-xl bg-gray-800 text-white">
      {!submitted ? (
        <form onSubmit={onSubmit} className="grid gap-4">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-2">
            Register for: {event.title}
          </h2>
          <p className="text-gray-300 mb-4">
            {event.date} • {event.time} • {event.location}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="First name"
              required
              className="p-2 rounded-xl bg-gray-700 border border-gray-600"
            />
            <input
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Last name"
              required
              className="p-2 rounded-xl bg-gray-700 border border-gray-600"
            />
          </div>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
            className="p-2 rounded-xl bg-gray-700 border border-gray-600"
          />

          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />
            <span>I agree to follow the code of conduct.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/events")}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold text-indigo-300">
            Registration Complete ✅
          </h2>
          <p className="mt-2 text-gray-300">
            Thanks, {first}! You're registered for <b>{event.title}</b>.
          </p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 px-4 py-2 bg-indigo-500 rounded hover:bg-indigo-600"
          >
            Back to Events
          </button>
        </div>
      )}
    </div>
  );
}
