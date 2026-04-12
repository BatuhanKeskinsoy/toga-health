"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoMailOutline, IoNotificationsOffOutline } from "react-icons/io5";

const N8N_UNSUBSCRIBE_WEBHOOK =
  "https://n8n.srv1208919.hstgr.cloud/webhook-test/unsubscribe";

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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="unsubscribe-email"
              className="text-sm font-medium text-zinc-700"
            >
              E-posta
            </label>
            <div className="relative">
              <IoMailOutline
                className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400"
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
                placeholder="ornek@eposta.com"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 py-3 pl-11 pr-3 text-zinc-900 outline-none transition focus:border-sitePrimary focus:ring-2 focus:ring-sitePrimary/20 read-only:bg-zinc-100 read-only:text-zinc-700"
              />
            </div>
            {emailLockedFromLink ? (
              <p className="text-xs text-zinc-500">
                Adres, e-postanızdaki bağlantıdan alındı. İsterseniz tarayıcı
                adres çubuğundaki bağlantıyı kontrol edin.
              </p>
            ) : (
              <p className="text-xs text-zinc-500">
                Aboneliği sonlandırmak istediğiniz e-postayı girin.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleUnsubscribe}
            disabled={!canSubmit}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-sitePrimary bg-white py-3 text-sm font-semibold text-sitePrimary transition hover:bg-sitePrimary/10 disabled:pointer-events-none disabled:opacity-40"
          >
            <IoNotificationsOffOutline className="size-5 shrink-0" aria-hidden />
            Abonelikten çık
          </button>
        </div>
      </div>
    </div>
  );
}
