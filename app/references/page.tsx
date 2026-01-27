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
            Work Log & Copyright Checklist (PDF)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Work Log */}
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200">
                <p className="text-xl font-semibold text-slate-900">Work Log</p>
                <p className="text-sm text-slate-600 mt-1">
                  Full team work log (dates + hours + short description).
                </p>
                <a
                  href="/pdfs/work-log.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm text-blue-700 font-semibold hover:underline"
                >
                  Open / Download PDF →
                </a>
              </div>

              <div className="h-[520px] bg-slate-50">
                <iframe
                  title="Work Log PDF"
                  src="/pdfs/work-log.pdf"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Copyright Checklist */}
            <div className="border border-slate-200 rounded-lg bg-white overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-slate-200">
                <p className="text-xl font-semibold text-slate-900">
                  Copyright Checklist
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Student Copyright Checklist (required for TSA).
                </p>
                <a
                  href="/pdfs/copyright-checklist.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-sm text-blue-700 font-semibold hover:underline"
                >
                  Open / Download PDF →
                </a>
              </div>

              <div className="h-[520px] bg-slate-50">
                <iframe
                  title="Copyright Checklist PDF"
                  src="/pdfs/copyright-checklist.pdf"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">
            Research Links (Inspiration)
          </h2>

          <div className="space-y-4">
            <ResearchLink
              title="Rivian"
              desc="Inspired the clean, high-end spacing, big typography, and modern hero layout."
              url="https://rivian.com/"
            />
            <ResearchLink
              title="Abetka UA (English)"
              desc="Inspired smooth motion, floating visuals, and bold-yet-minimal design direction."
              url="https://abetkaua.com/en/"
            />
            <ResearchLink
              title="Abetka (Main)"
              desc="Extra reference for motion pacing and modern layout flow."
              url="https://abetka.com/"
            />
            <ResearchLink
              title="React Typescript Tutorial for Beginners"
              desc="Tutorial by Dave Gray"
              url="https://youtu.be/xTVQZ46wc28"
            />
            <ResearchLink
              title="Animating vector paths in Framer (Animation Lesson 18)"
              desc="Tutorial by Framer"
              url="https://youtu.be/MOmvYoUFQWU"
            />
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
                Next.js is the main framework we use to build Gatherly. It gives
                us the project structure, including pages, routes, and layouts.
                It also offers fast development tools and improves production
                with features like bundling, code splitting, and server rendering
                options. We used it to set up navigation across the pages: Home,
                Map, Resources, Events, and References. It helps us manage
                client/server boundaries, such as using client components when
                needed. This setup allows us to deploy the site while keeping it
                fast and reliable as we add more features.
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
            <CitationCard
              name="Vercel"
              desc="Used for deployment and hosting."
              url="https://vercel.com"
            />
            <CitationCard
              name="Image 1"
              desc="Our mission image in home page."
              url="http://insitearchitecture.net/project/cross-creek-ranch/"
            />
            <CitationCard
              name="Image 2"
              desc="Our future image in home page."
              url="https://communityimpact.com/houston/katy/development/2022/03/26/cross-creek-ranch-in-fulshear-begins-to-fulfill-its-last-300-acres/"
            />
            <CitationCard
              name="Geist Font"
              desc="Different font sizes and styles."
              url="https://fonts.google.com/specimen/Geist"
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

function ResearchLink({
  title,
  desc,
  url,
}: {
  title: string;
  desc: string;
  url: string;
}) {
  return (
    <div className="border border-slate-200 rounded-lg bg-white p-4">
      <p className="font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm text-slate-700">{desc}</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-sm text-blue-700 font-semibold hover:underline break-all"
      >
        {url}
      </a>
    </div>
  );
}
