import { Suspense } from "react";
import UnsubscribeClient from "./UnsubscribeClient";

function Fallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 px-4">
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-10 shadow-sm">
        <div
          className="mx-auto size-16 animate-spin rounded-full border-4 border-zinc-200 border-t-sitePrimary"
          aria-hidden
        />
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<Fallback />}>
      <UnsubscribeClient />
    </Suspense>
  );
}
