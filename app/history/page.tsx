// app/history/page.tsx
import React from "react";

export const metadata = {
  title: "History | Gatherly",
  description: "Our community history and milestones",
};

// Sample history data
const historyData = [
  {
    year: 2023,
    title: "Starting Out",
    description: "Cross Creek is founded in Fulshear, first residents arrived in 2008.",
  },
  {
    year: 2024,
    title: "Community Grows",
    description: "Our community expands to 3,200 acres with 20,000 residents.",
  },
  {
    year: 2025,
    title: "New Website Launch",
    description: "Gatherly launches to help residents navigate and participate.",
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-white px-6 pt-28 pb-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-6 text-gray-900">Our History</h1>
        <p className="text-sm text-neutral-600 mb-8">
          See the milestones that shaped our community and how Gatherly came to life.
        </p>

        <div className="space-y-8">
          {historyData.map((item) => (
            <div
              key={item.year}
              className="p-6 border-l-4 border-blue-500 bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <h2 className="text-2xl font-semibold text-gray-900">
                {item.year} – {item.title}
              </h2>
              <p className="mt-2 text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

