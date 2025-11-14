"use client";

import type { StatisticsPeriod } from "@/lib/types/provider/statisticsTypes";
import { useTranslations } from "next-intl";

const PERIOD_OPTIONS: Array<{
  value: StatisticsPeriod;
  label: string;
}> = [
  { value: "today", label: "Bugün" },
  { value: "week", label: "Bu Hafta" },
  { value: "month", label: "Bu Ay" },
  { value: "year", label: "Bu Yıl" },
];

interface StatisticsPeriodFilterProps {
  selectedPeriod: StatisticsPeriod;
  onChange: (period: StatisticsPeriod) => void;
  disabled?: boolean;
}

const StatisticsPeriodFilter = ({
  selectedPeriod,
  onChange,
  disabled = false,
}: StatisticsPeriodFilterProps) => {
  const t = useTranslations();
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full bg-gray-100 p-1">
      {PERIOD_OPTIONS.map(({ value, label }) => {
        const isActive = selectedPeriod === value;
        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(value)}
            className={`rounded-full px-3 py-1 text-sm font-medium transition ${
              isActive
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
          >
            {t(label)}
          </button>
        );
      })}
    </div>
  );
};

export default StatisticsPeriodFilter;

