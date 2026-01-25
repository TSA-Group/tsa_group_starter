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
              <p className="font-semibold text-slate-800">Next.js</p>
              <p className="mt-2 text-sm text-slate-700">
                Next.js is the main framework used to build Gatherly. It provides
                the project structure (pages/routes and layouts), fast
                development tooling, and production optimizations like bundling,
                code-splitting, and server rendering options. We used it to set
                up navigation across pages (Home, Map, Resources, Events,
                References), manage client/server boundaries (like client
                components when needed), and deploy the site in a way that stays
                fast and reliable as features grow.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Source: Next.js Documentation (https://nextjs.org/docs)
              </p>
            </div>
            <div className="border border-slate-200 rounded-lg bg-white p-4">
              <p className="font-semibold text-slate-800">TypeScript</p>
              <p className="mt-2 text-sm text-slate-700">
                TypeScript is used to add static typing on top of JavaScript so
                our components, props, and data structures are safer and easier
                to maintain. In Gatherly, we use types to define the shape of
                things like events, resources, Firestore documents, and UI state
                so we catch mistakes earlier (for example: missing fields, wrong
                types, or incorrect component props). This makes collaboration
                smoother because everyone on the team can understand what data
                each feature expects, and it reduces runtime bugs by catching
                issues during development.
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Source: TypeScript Handbook (https://www.typescriptlang.org/docs/)
              </p>
            </div>
            <CitationCard
              name="@vis.gl/react-google-maps"
              desc="React components for rendering and controlling Google Maps (markers, map view, interactions) inside the app."
              url="https://visgl.github.io/react-google-maps/"
            />
            <CitationCard
              name="Firebase"
              desc="Backend services used for storing and retrieving data (like events/resources) with Firestore, plus hosting/auth if needed."
              url="https://firebase.google.com/docs"
            />
            <CitationCard
              name="Framer Motion"
              desc="Animation library used for smooth transitions, scroll effects, motion variants, and interactive UI micro-animations."
              url="https://www.framer.com/motion/"
            />
            <CitationCard
              name="React"
              desc="UI library used to build components and manage state across the site."
              url="https://react.dev/"
            />
            <CitationCard
              name="react-dom"
              desc="React package that handles rendering React components into the DOM in the browser."
              url="https://react.dev/reference/react-dom"
            />
            <CitationCard
              name="Radix UI"
              desc="Accessible, unstyled component primitives used to build clean UI elements (menus, dialogs, popovers) reliably."
              url="https://www.radix-ui.com/primitives/docs/overview/introduction"
            />
            <CitationCard
              name="PostCSS"
              desc="CSS processing tool used in the build pipeline (commonly with Tailwind) to transform and optimize styles."
              url="https://postcss.org/"
            />
            <CitationCard
              name="use-places-autocomplete"
              desc="Hook that simplifies Google Places Autocomplete for location searching (used for address/place search UX)."
              url="https://www.npmjs.com/package/use-places-autocomplete"
            />
            <CitationCard
              name="@next/codemod"
              desc="Next.js codemod utilities used to help migrate/upgrade Next.js codebases safely."
              url="https://www.npmjs.com/package/@next/codemod"
            />
            <CitationCard
              name="@tailwindcss/postcss"
              desc="Tailwind’s PostCSS integration used to compile Tailwind utilities during builds."
              url="https://tailwindcss.com/docs/installation"
            />
            <CitationCard
              name="@types/node"
              desc="Type definitions for Node.js APIs to improve TypeScript support during development."
              url="https://www.npmjs.com/package/@types/node"
            />
            <CitationCard
              name="@types/react"
              desc="Type definitions for React used by TypeScript for component and JSX typing."
              url="https://www.npmjs.com/package/@types/react"
            />
            <CitationCard
              name="@types/react-dom"
              desc="Type definitions for react-dom used by TypeScript for DOM rendering APIs."
              url="https://www.npmjs.com/package/@types/react-dom"
            />
            <CitationCard
              name="daisyUI"
              desc="Tailwind CSS component plugin that provides prebuilt UI classes/components for faster styling."
              url="https://daisyui.com/"
            />
            <CitationCard
              name="ESLint"
              desc="Linting tool used to catch code issues and enforce consistent style across the project."
              url="https://eslint.org/docs/latest/"
            />
            <CitationCard
              name="eslint-config-next"
              desc="Official Next.js ESLint rules/config used to follow Next best practices and avoid common mistakes."
              url="https://nextjs.org/docs/app/building-your-application/configuring/eslint"
            />
            <CitationCard
              name="Tailwind CSS"
              desc="Utility-first CSS framework used for styling layout, spacing, colors, and responsive design quickly."
              url="https://tailwindcss.com/docs"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function CitationCard({
  name,
  desc,
  url,
}: {
  name: string;
  desc: string;
  url: string;
}) {
  return (
    <div className="border border-slate-200 rounded-lg bg-white p-4">
      <p className="font-semibold text-slate-800">{name}</p>
      <p className="mt-2 text-sm text-slate-700">{desc}</p>
      <p className="mt-1 text-sm text-slate-600">Source: {url}</p>
    </div>
  );
}
