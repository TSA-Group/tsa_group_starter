"use client";
import React from "react";
import Link from "next/link";
export default function ReferencesPage() {
  return (
    <main className="min-h-screen bg-[#F4F7FB] text-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-blue-900">
            References & Work Log
          </h1>
          <div className="mt-6">
            <Link
              href="/"
              className="text-blue-700 font-semibold hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </header>
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Team Hours
          </h2>

          <div className="border border-slate-200 rounded-lg bg-white">
            <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm font-semibold text-slate-700 border-b">
              <div>Name</div>
              <div>Role</div>
              <div>Hours</div>
            </div>
            <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm border-b">
              <div>Your Name</div>
              <div>Developer / Designer</div>
              <div>—</div>
            </div>

            <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
              <div>Team Member</div>
              <div>Research / Content</div>
              <div>—</div>
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Citations
          </h2>
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-lg bg-white p-4">
              <p className="font-semibold text-slate-800">
                Citation 1
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Source title, organization, and description of how it was used.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                URL: —
              </p>
            </div>

            <div className="border border-slate-200 rounded-lg bg-white p-4">
              <p className="font-semibold text-slate-800">
                Citation 2
              </p>
              <p className="mt-2 text-sm text-slate-700">
                Source title, organization, and description of how it was used.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                URL: —
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
