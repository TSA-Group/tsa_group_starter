"use client";

import Link from "next/link";

export function QuickActions() {
  const actions = [
    { label: "Admin", href: "/admin" },
    { label: "Resources", href: "/map" },
    { label: "Events", href: "/events" },
  ];

  return (
    <section
      className="h-[260px] w-full sm:w-[650px] p-5 bg-white rounded-2xl border border-blue-200 ring-1 ring-blue-100 shadow-sm"
    >
      <h3 className="text-lg font-semibold mb-2 text-blue-900">Quick Actions</h3>
      <p className="text-sm text-blue-700 mb-4">
        Welcome to Cross Creek! Explore some of our community resources.
      </p>

      <ul className="flex flex-col gap-2">
        {actions.map((action, i) => (
          <li key={i}>
            <Link
              href={action.href}
              className="block bg-blue-50 border border-blue-200 rounded-xl py-2 px-3 text-sm font-semibold text-blue-900 hover:bg-blue-100 transition"
            >
              {action.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
