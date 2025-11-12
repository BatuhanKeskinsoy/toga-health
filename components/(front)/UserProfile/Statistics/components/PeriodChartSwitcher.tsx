"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PeriodStatistics } from "@/lib/types/provider/statisticsTypes";

type PeriodKey = "daily" | "weekly" | "monthly";

const PERIOD_OPTIONS: Array<{ key: PeriodKey; label: string }> = [
  { key: "daily", label: "Günlük" },
  { key: "weekly", label: "Haftalık" },
  { key: "monthly", label: "Aylık" },
];

interface PeriodChartSwitcherProps {
  periodStatistics: PeriodStatistics;
  timezone?: string;
  emptyMessage?: string;
  chartHeight?: number;
  activeChartPeriod: PeriodKey;
  onChartPeriodChange: (period: PeriodKey) => void;
  loading?: boolean;
}

const formatLabel = (
  period: PeriodKey,
  value: string | number,
  timezone?: string
) => {
  if (period === "daily") {
    const safeDate = new Date(`${value}T00:00:00Z`);
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        day: "2-digit",
        month: "short",
        timeZone: timezone || "UTC",
      }).format(safeDate);
    } catch (error) {
      return value;
    }
  }

  if (period === "monthly") {
    const safeDate = new Date(`${value}-01T00:00:00Z`);
    try {
      return new Intl.DateTimeFormat("tr-TR", {
        month: "long",
        year: "numeric",
        timeZone: timezone || "UTC",
      }).format(safeDate);
    } catch (error) {
      return value;
    }
  }

  return `Hafta ${value}`;
};

const formatTooltipValue = (value: number, name: string) => {
  return [value, name === "confirmed" ? "Onaylanan" : "Toplam"];
};

const PeriodChartSwitcher = ({
  periodStatistics,
  timezone,
  emptyMessage = "Grafik verisi bulunamadı.",
  chartHeight = 280,
  activeChartPeriod,
  onChartPeriodChange,
  loading = false,
}: PeriodChartSwitcherProps) => {
  const chartData = useMemo(() => {
    const source = periodStatistics[activeChartPeriod] ?? [];
    return source.map((item) => {
      const labelKey =
        activeChartPeriod === "daily"
          ? (item as { date: string }).date
          : activeChartPeriod === "weekly"
          ? (item as { week: number }).week
          : (item as { month: string }).month;

      return {
        label: formatLabel(activeChartPeriod, labelKey, timezone),
        total: Number((item as { count: number }).count ?? 0),
        confirmed: Number(
          (item as { confirmed: number | string }).confirmed ?? 0
        ),
      };
    });
  }, [activeChartPeriod, periodStatistics, timezone]);

  const hasData = chartData.length > 0;

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-200">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-sitePrimary border-t-transparent" />
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Dönemsel Randevu Eğilimleri
          </h3>
          <p className="text-sm text-gray-500">
            Seçtiğiniz zaman aralığında randevu yoğunluğunu inceleyin.
          </p>
        </div>
      </div>

      <div className="w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height={chartHeight}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="label" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip formatter={formatTooltipValue} />
              <Legend
                verticalAlign="top"
                align="right"
                height={32}
                wrapperStyle={{ paddingBottom: 16 }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Toplam"
                stroke="#3B82F6"
                fill="#BFDBFE"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="confirmed"
                name="Onaylanan"
                stroke="#10B981"
                fill="#BBF7D0"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default PeriodChartSwitcher;

