"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoMailOutline, IoNotificationsOffOutline } from "react-icons/io5";

const N8N_UNSUBSCRIBE_WEBHOOK =
  "https://n8n.srv1208919.hstgr.cloud/webhook/unsubscribe";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const emailFromUrl = useMemo(
    () => searchParams.get("email")?.trim() ?? "",
    [searchParams]
  );
  const [emailManual, setEmailManual] = useState("");

  const effectiveEmail = (emailFromUrl || emailManual.trim()).trim();
  const emailLockedFromLink = Boolean(emailFromUrl);

  const handleUnsubscribe = useCallback(() => {
    if (!isValidEmail(effectiveEmail)) return;
    const url = new URL(N8N_UNSUBSCRIBE_WEBHOOK);
    url.searchParams.set("email", effectiveEmail);
    window.location.assign(url.toString());
  }, [effectiveEmail]);

  const canSubmit = isValidEmail(effectiveEmail);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200/80 bg-white p-8 shadow-sm">
        <div className="flex gap-0">
          <div className="relative w-full">
            <IoMailOutline
              className="pointer-events-none absolute left-5 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
              aria-hidden
            />
            <input
              id="unsubscribe-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              readOnly={emailLockedFromLink}
              value={emailLockedFromLink ? emailFromUrl : emailManual}
              onChange={(e) => setEmailManual(e.target.value)}
              placeholder="example@email.com"
              className="w-full rounded-l-xl border border-zinc-200 bg-zinc-50/80 py-3 pl-14 pr-3 text-zinc-900 outline-none transition focus:border-sitePrimary focus:ring-2 focus:ring-sitePrimary/20 read-only:bg-zinc-100 read-only:text-zinc-700"
            />
          </div>

          <button
            type="button"
            onClick={handleUnsubscribe}
            disabled={!canSubmit}
            className="inline-flex w-fit px-4 items-center justify-center gap-2 rounded-r-xl bg-sitePrimary py-3 text-sm font-semibold text-white transition hover:bg-sitePrimary/80 disabled:pointer-events-none disabled:opacity-40"
          >
            <IoNotificationsOffOutline className="size-5 shrink-0" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
