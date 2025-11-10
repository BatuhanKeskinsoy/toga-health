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
    startDate: string;
    endDate: string;
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
    {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
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

const formatDateRange = (start: string, end: string) => {
  if (!start && !end) return "Tarih aralığı belirtilmedi";
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} sonrası`;
  return `${end} öncesi`;
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
          start_date: initialFilters.startDate,
          end_date: initialFilters.endDate,
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
              {currentData.doctor.name}
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
                  {formatDateRange(
                    initialFilters.startDate,
                    initialFilters.endDate
                  )}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    </section>
  );
};

export default DoctorStatisticsClient;

