"use client";
import React from "react";
import Link from "next/link";

type LogEntry = { date: string; hours: number };

const WORK_LOG: Record<
  string,
  {
    entries: LogEntry[];
  }
> = {
  DP: {
    entries: [
      { hours: 1, date: "7-Nov" },
      { hours: 1.5, date: "8-Nov" },
      { hours: 6, date: "9-Nov" },
      { hours: 4, date: "10-Nov" },
      { hours: 3, date: "11-Nov" },
      { hours: 2, date: "12-Nov" },
      { hours: 1.5, date: "13-Nov" },
      { hours: 1.5, date: "20-Nov" },
      { hours: 5, date: "2-Dec" },
      { hours: 2, date: "3-Dec" },
      { hours: 2, date: "4-Dec" },
      { hours: 1.5, date: "6-Dec" },
      { hours: 3, date: "7-Dec" },
      { hours: 1, date: "17-Dec" },
      { hours: 1, date: "4-Jan" },
      { hours: 1.5, date: "8-Jan" },
      { hours: 0.5, date: "13-Jan" },
      { hours: 2, date: "12-Jan" },
      { hours: 1.5, date: "15-Jan" },
      { hours: 0.5, date: "16-Jan" },
    ],
  },

  SS: {
    entries: [
      { hours: 2, date: "7-Nov" },
      { hours: 3, date: "8-Nov" },
      { hours: 1, date: "19-Nov" },
      { hours: 1, date: "20-Nov" },
      { hours: 4, date: "21-Nov" },
      { hours: 2.5, date: "2-Dec" },
      { hours: 0.5, date: "3-Dec" },
      { hours: 2, date: "4-Dec" },
      { hours: 3, date: "7-Dec" },
      { hours: 2, date: "16-Dec" },
      { hours: 3, date: "17-Dec" },
      { hours: 2.5, date: "17-Dec" },
      { hours: 2, date: "18-Dec" },
      { hours: 1, date: "19-Dec" },
      { hours: 1, date: "21-Dec" },
      { hours: 2.5, date: "1-Jan" },
      { hours: 2, date: "3-Jan" },
      { hours: 3, date: "4-Jan" },
      { hours: 2, date: "5-Jan" },
      { hours: 1, date: "6-Jan" },
      { hours: 1.5, date: "7-Jan" },
      { hours: 1, date: "8-Jan" },
      { hours: 1, date: "9-Jan" },
      { hours: 1.5, date: "10-Jan" },
      { hours: 1, date: "11-Jan" },
      { hours: 0.5, date: "12-Jan" },
      { hours: 0.5, date: "13-Jan" },
      { hours: 1, date: "14-Jan" },
      { hours: 3, date: "15-Jan" },
      { hours: 2, date: "16-Jan" },
      { hours: 1, date: "18-Jan" },
      { hours: 1.5, date: "19-Jan" },
      { hours: 2.5, date: "23-Jan" },
    ],
  },

  PV: {
    entries: [
      { hours: 1.5, date: "5-Nov" },
      { hours: 6, date: "9-Nov" },
      { hours: 2, date: "12-Nov" },
      { hours: 1, date: "13-Nov" },
      { hours: 2.5, date: "22-Dec" },
      { hours: 0.5, date: "23-Jan" },
      { hours: 1.5, date: "9-Jan" },
    ],
  },

  SP: {
    entries: [
      { hours: 1.5, date: "7-Dec" },
      { hours: 2, date: "11-Jan" },
      { hours: 3, date: "12-Jan" },
    ],
  },

  BD: {
    entries: [
      { hours: 2, date: "7-Nov" },
      { hours: 3, date: "8-Nov" },
      { hours: 1, date: "19-Nov" },
      { hours: 1, date: "20-Nov" },
      { hours: 4, date: "21-Nov" },
      { hours: 2.5, date: "2-Dec" },
      { hours: 0.5, date: "3-Dec" },
      { hours: 2, date: "4-Dec" },
      { hours: 3, date: "7-Dec" },
      { hours: 2, date: "16-Dec" },
      { hours: 3, date: "17-Dec" },
      { hours: 2, date: "18-Dec" },
      { hours: 1, date: "19-Dec" },
      { hours: 1, date: "21-Dec" },
      { hours: 2.5, date: "1-Jan" },
      { hours: 2, date: "3-Jan" },
      { hours: 3, date: "4-Jan" },
      { hours: 2, date: "5-Jan" },
      { hours: 3, date: "7-Jan" },
      { hours: 2.5, date: "8-Jan" },
      { hours: 2, date: "15-Jan" },
      { hours: 0.5, date: "16-Jan" },
      { hours: 0.5, date: "18-Jan" },
    ],
  },

  TW: {
    entries: [
      { hours: 1, date: "8-Nov" },
      { hours: 1, date: "19-Nov" },
      { hours: 2, date: "21-Nov" },
      { hours: 2, date: "2-Dec" },
      { hours: 1, date: "4-Dec" },
      { hours: 3, date: "7-Dec" },
      { hours: 1, date: "17-Dec" },
      { hours: 3, date: "7-Jan" },
      { hours: 2, date: "15-Jan" },
      { hours: 1.5, date: "24-Jan" },
    ],
  },
};

function sumHours(entries: LogEntry[]) {
  return entries.reduce((acc, e) => acc + (Number(e.hours) || 0), 0);
}

export default function ReferencesPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            References & Work Log
          </h1>
          <div className="mt-6">
            <Link href="/" className="text-blue-700 font-semibold hover:underline">
              ← Back to Home
            </Link>
          </div>
        </header>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Team Hours (Student Initials)
          </h2>

          <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
            {Object.entries(WORK_LOG).map(([name, { entries }], idx) => {
              const total = sumHours(entries);
              const days = entries.length;

              return (
                <div
                  key={name}
                  className={idx === 0 ? "" : "border-t border-slate-200"}
                >
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="font-semibold text-slate-800">{name}</div>
                    <div className="text-sm text-slate-700">
                      <span className="font-semibold">{total}</span> hours •{" "}
                      <span className="font-semibold">{days}</span> days
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 px-4 py-2 text-xs font-semibold text-slate-600 border-t border-slate-200 bg-slate-50">
                    <div>Date</div>
                    <div>Hours</div>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {entries.map((e, i) => (
                      <div
                        key={`${name}-${e.date}-${e.hours}-${i}`}
                        className="grid grid-cols-2 gap-4 px-4 py-2 text-sm"
                      >
                        <div className="text-slate-800">{e.date}</div>
                        <div className="text-slate-800">{e.hours}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Citations
          </h2>
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-lg bg-white p-4">
              <p className="font-semibold text-slate-800">Citation 1</p>
              <p className="mt-2 text-sm text-slate-700">
                Source title, organization, and description of how it was used.
              </p>
              <p className="mt-1 text-sm text-slate-600">URL: —</p>
            </div>

            <div className="border border-slate-200 rounded-lg bg-white p-4">
              <p className="font-semibold text-slate-800">Citation 2</p>
              <p className="mt-2 text-sm text-slate-700">
                Source title, organization, and description of how it was used.
              </p>
              <p className="mt-1 text-sm text-slate-600">URL: —</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
