// app/history/page.tsx
import React from "react";

export const metadata = {
  title: "History | Gatherly",
  description: "History page",
};

export default function HistoryPage() {
  return (
    <div className="min-h-screen px-6 pt-28 pb-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold tracking-tight">History</h1>
        <p className="mt-3 text-sm text-neutral-600">
          This page is working and exporting correctly now. Replace this content with your real history UI.
        </p>
      </div>
    </div>
  );
}
// pages/history.tsx
import React from "react";

const historyData = [
  { year: 2023, title: "Starting Out", description: "Cross Creek is founded in Fulshear, first residents arrived in 2008." },
  { year: 2024, title: "Community Grows", description: "Our community expands to 3,200 acres with 20,000 residents." },
  { year: 2025, title: "New Website Launch", description: "Gatherly launches to help residents navigate and participate." },
];

export default function History() {
  return (
    <div className="min-h-screen bg-white text-gray-900 px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">Our History</h1>
      <div className="space-y-8">
        {historyData.map((item) => (
          <div key={item.year} className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold">{item.year} – {item.title}</h2>
            <p className="mt-2 text-gray-700">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
