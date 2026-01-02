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
    <div className="min-h-screen bg-gradient-to-br from-[#071026] via-[#0b1220] to-[#020617] text-white flex items-center justify-center">
      <p className="text-slate-400">Loading registration…</p>
    </div>
  );
}
