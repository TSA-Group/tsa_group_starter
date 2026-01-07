// app/events/register/page.tsx
import { Suspense } from "react";
import RegisterClient from "./register-client";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6FAFF] via-[#F2F7FF] to-[#EEF5FF] text-slate-900 flex items-center justify-center">
      <p className="text-slate-600">Loading registration…</p>
    </div>
  );
}
