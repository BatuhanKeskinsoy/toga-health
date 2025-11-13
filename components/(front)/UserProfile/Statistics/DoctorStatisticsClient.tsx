"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  DoctorStatisticsData,
  StatisticsPeriod,
} from "@/lib/types/provider/statisticsTypes";
import PeriodChartSwitcher from "@/components/(front)/UserProfile/Statistics/components/PeriodChartSwitcher";
import StatisticsPeriodFilter from "@/components/(front)/UserProfile/Statistics/components/StatisticsPeriodFilter";
import { getDoctorStatistics } from "@/lib/services/provider/statistics";

type ChartPeriod = "daily" | "weekly" | "monthly";

interface DoctorStatisticsClientProps {
  initialData: DoctorStatisticsData;
  initialFilters: {
    period: StatisticsPeriod;
    startDate?: string | null;
    endDate?: string | null;
  };
}

const StatisticCard = ({
  title,
  value,
  description,
}: {
  title: string;
  value: string | number;
  description?: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm shadow-gray-200">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {title}
    </p>
    <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
  </div>
);

const formatDateTime = (date: string, timezone?: string) => {
  try {
    return new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: timezone || "UTC",
    }).format(new Date(date));
  } catch (error) {
    return date;
  }
};

const formatDateRange = (range: DoctorStatisticsData["date_filter"]) => {
  const start = range?.start_date;
  const end = range?.end_date;

  if (!start && !end) return "Tarih aralığı belirtilmedi";
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} sonrası`;
  return `${end} öncesi`;
};

const formatCurrency = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (_error) {
    return `${amount} ${currency}`;
  }
};

const DoctorStatisticsClient = ({
  initialData,
  initialFilters,
}: DoctorStatisticsClientProps) => {
  const [activePeriod, setActivePeriod] = useState<StatisticsPeriod>(
    initialFilters.period
  );
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [dataMap, setDataMap] = useState<
    Partial<Record<StatisticsPeriod, DoctorStatisticsData>>
  >({
    [initialFilters.period]: initialData,
  });
  const [currentData, setCurrentData] =
    useState<DoctorStatisticsData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const appointmentCards = useMemo(
    () => [
      {
        title: "Toplam Randevu",
        value: currentData.appointments.total,
        description: `${currentData.appointments.pending} beklemede`,
      },
      {
        title: "Onaylanan",
        value: currentData.appointments.confirmed,
        description: `${currentData.appointments.completed} tamamlandı`,
      },
      {
        title: "İptal Edilen",
        value: currentData.appointments.cancelled,
        description: "Seçili dönemde toplam iptaller",
      },
      {
        title: "Ortalama Puan",
        value: currentData.comments.average_rating.toFixed(2),
        description: `${currentData.comments.approved}/${currentData.comments.total} yorum onaylı`,
      },
      {
        title: "Bekleyen Yorum",
        value: currentData.comments.pending,
        description: "Onay bekleyen yorumlar",
      },
    ],
    [currentData]
  );

  const handlePeriodChange = useCallback(
    async (period: StatisticsPeriod) => {
      if (period === activePeriod) return;
      setActivePeriod(period);
      setErrorMessage(null);

      if (dataMap[period]) {
        setCurrentData(dataMap[period]!);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getDoctorStatistics({
          period,
          start_date: initialFilters.startDate ?? undefined,
          end_date: initialFilters.endDate ?? undefined,
        });

        if (!response?.status || !response.data) {
          throw new Error("İstatistik verisi alınamadı.");
        }

        setDataMap((prev) => ({ ...prev, [period]: response.data }));
        setCurrentData(response.data);
        setChartPeriod("daily");
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "İstatistik verisi alınırken bir hata oluştu.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [activePeriod, dataMap, initialFilters.endDate, initialFilters.startDate]
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-gray-200 bg-gradient-to-r from-sky-50 via-white to-white p-6 shadow-sm shadow-sky-100">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Doktor İstatistikleri
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {[currentData.doctor.expert_title, currentData.doctor.name]
                .filter(Boolean)
                .join(" ")}
            </h2>
            <div className="text-sm text-gray-500">
              <p>
                Zaman dilimi:{" "}
                <span className="font-medium text-gray-700">
                  {currentData.timezone}
                </span>
              </p>
              <p>
                Tarih aralığı:{" "}
                <span className="font-medium text-gray-700">
                  {formatDateRange(currentData.date_filter)}
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Oluşturulma zamanı:{" "}
              {formatDateTime(currentData.generated_at, currentData.timezone)}
            </p>
          </div>
          <StatisticsPeriodFilter
            selectedPeriod={activePeriod}
            onChange={handlePeriodChange}
            disabled={isLoading}
          />
        </div>
        {errorMessage && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {errorMessage}
          </div>
        )}
      </header>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {appointmentCards.map((card) => (
          <StatisticCard
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
          />
        ))}
      </div>

      <PeriodChartSwitcher
        periodStatistics={currentData.period_statistics}
        timezone={currentData.timezone}
        emptyMessage="Bu zaman aralığı için grafik verisi bulunamadı."
        activeChartPeriod={chartPeriod}
        onChartPeriodChange={setChartPeriod}
        loading={isLoading}
      />

      {currentData.revenue_history && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-200">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Gelir Geçmişi
            </h3>
            <p className="text-sm text-gray-500">
              Seçili dönem için günlük, aylık ve yıllık gelir dağılımı.
            </p>
          </div>

          {currentData.revenue_history.summary?.length ? (
            <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {currentData.revenue_history.summary.map((item, index) => (
                <div
                  key={`${item.currency}-${index}`}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {item.currency}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {formatCurrency(item.total_revenue, item.currency)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Toplam İşlem:{" "}
                    <span className="font-semibold text-gray-700">
                      {item.total_count}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Ortalama:{" "}
                    <span className="font-semibold text-gray-600">
                      {formatCurrency(item.average_revenue, item.currency)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <RevenueHistoryTables history={currentData.revenue_history} />
        </div>
      )}
    </section>
  );
};

export default DoctorStatisticsClient;

interface RevenueHistoryTablesProps {
  history: NonNullable<DoctorStatisticsData["revenue_history"]>;
}

const RevenueHistoryTables = ({ history }: RevenueHistoryTablesProps) => {
  const hasDailyData = useMemo(
    () =>
      Object.values(history.daily ?? {}).some(
        (entries) => entries && entries.length > 0
      ),
    [history.daily]
  );
  const hasMonthlyData = useMemo(
    () =>
      Object.values(history.monthly ?? {}).some(
        (entries) => entries && entries.length > 0
      ),
    [history.monthly]
  );
  const hasYearlyData = useMemo(
    () =>
      Object.values(history.yearly ?? {}).some(
        (entries) => entries && entries.length > 0
      ),
    [history.yearly]
  );

  if (!hasDailyData && !hasMonthlyData && !hasYearlyData) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
        Bu dönem için gelir geçmişi bulunamadı.
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-6">
      {hasDailyData && (
        <RevenueTable
          title="Günlük Gelir"
          emptyMessage="Günlük gelir kaydı bulunmuyor."
          groups={history.daily}
          columns={[
            {
              key: "date",
              label: "Tarih",
            },
            {
              key: "count",
              label: "İşlem Sayısı",
            },
            {
              key: "total_revenue",
              label: "Toplam Gelir",
              isCurrency: true,
            },
          ]}
        />
      )}

      {hasMonthlyData && (
        <RevenueTable
          title="Aylık Gelir"
          emptyMessage="Aylık gelir kaydı bulunmuyor."
          groups={history.monthly}
          columns={[
            {
              key: "month",
              label: "Ay",
            },
            {
              key: "count",
              label: "İşlem Sayısı",
            },
            {
              key: "total_revenue",
              label: "Toplam Gelir",
              isCurrency: true,
            },
          ]}
        />
      )}

      {hasYearlyData && (
        <RevenueTable
          title="Yıllık Gelir"
          emptyMessage="Yıllık gelir kaydı bulunmuyor."
          groups={history.yearly}
          columns={[
            {
              key: "year",
              label: "Yıl",
            },
            {
              key: "count",
              label: "İşlem Sayısı",
            },
            {
              key: "total_revenue",
              label: "Toplam Gelir",
              isCurrency: true,
            },
          ]}
        />
      )}
    </div>
  );
};

interface RevenueTableColumn {
  key: string;
  label: string;
  isCurrency?: boolean;
}

interface RevenueTableProps {
  title: string;
  emptyMessage: string;
  groups: Record<string, Array<Record<string, any>>>;
  columns: RevenueTableColumn[];
}

const RevenueTable = ({
  title,
  emptyMessage,
  groups,
  columns,
}: RevenueTableProps) => {
  const hasData = Object.values(groups ?? {}).some(
    (entries) => entries && entries.length > 0
  );

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-100">
      <h4 className="text-base font-semibold text-gray-900">{title}</h4>
      <div className="mt-3 flex flex-col gap-4">
        {Object.entries(groups).map(([currency, entries]) => {
          if (!entries || entries.length === 0) {
            return null;
          }

          return (
            <div key={currency} className="rounded-xl border border-gray-100">
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                {currency}
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-700">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {entries.map((entry, index) => (
                      <tr
                        key={`${currency}-${index}`}
                        className="hover:bg-gray-50"
                      >
                        {columns.map((column) => {
                          const value = entry[column.key];
                          return (
                            <td key={column.key} className="px-4 py-2">
                              {column.isCurrency && typeof value === "number"
                                ? formatCurrency(
                                    value,
                                    entry.currency ?? currency
                                  )
                                : value ?? "-"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
