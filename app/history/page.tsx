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

