import { Suspense } from "react";
import ResourcesClient from "./resources-client";

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ResourcesClient />
    </Suspense>
  );
}

function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex items-center justify-center">
      <p className="text-slate-600">Loading resources…</p>
    </div>
  );
}
