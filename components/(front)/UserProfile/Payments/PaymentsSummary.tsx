import React from "react";
import type { PaymentsHistoryStatistics } from "@/lib/types/payments/payments";

interface PaymentsSummaryProps {
  title: string;
  description?: string;
  statistics?: PaymentsHistoryStatistics | null;
}

const formatNumber = (value: number | string | undefined) => {
  if (value === undefined || value === null) return "-";
  if (typeof value === "number") {
    return new Intl.NumberFormat("tr-TR", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    }).format(value);
  }

  const trimmed = value.trim();
  if (!trimmed) return "-";

  const numeric = Number.parseFloat(trimmed);
  if (Number.isNaN(numeric)) {
    return trimmed;
  }

  const hasDecimal = trimmed.includes(".");
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: hasDecimal ? 2 : 0,
    maximumFractionDigits: hasDecimal ? 2 : 0,
  }).format(numeric);
};

const SummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

export function PaymentsSummary({
  title,
  description,
  statistics,
}: PaymentsSummaryProps) {
  if (!statistics) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Ödeme istatistikleri bulunamadı.
      </section>
    );
  }

  const cards = [
    {
      label: "Toplam Ödeme",
      value: formatNumber(statistics.total_payments),
    },
    {
      label: "Başarılı Ödemeler",
      value: formatNumber(statistics.successful_payments),
    },
    {
      label: "İade Edilen",
      value: formatNumber(statistics.refunded_payments),
    },
    {
      label: "Bekleyen",
      value: formatNumber(statistics.pending_payments),
    },
    {
      label: "Toplam Tutar",
      value: formatNumber(statistics.total_amount),
    },
  ];

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </header>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <SummaryCard
            key={card.label}
            label={card.label}
            value={card.value}
          />
        ))}
      </div>
    </section>
  );
}

