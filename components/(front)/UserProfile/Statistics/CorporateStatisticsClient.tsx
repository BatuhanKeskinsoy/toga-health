"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  CorporateDoctorStatistics,
  CorporateStatisticsData,
  StatisticsPeriod,
} from "@/lib/types/provider/statisticsTypes";
import PeriodChartSwitcher from "@/components/(front)/UserProfile/Statistics/components/PeriodChartSwitcher";
import StatisticsPeriodFilter from "@/components/(front)/UserProfile/Statistics/components/StatisticsPeriodFilter";
import { getCorporateStatistics } from "@/lib/services/provider/statistics";

type ChartPeriod = "daily" | "weekly" | "monthly";

interface CorporateStatisticsClientProps {
  initialData: CorporateStatisticsData;
  initialFilters: {
    period: StatisticsPeriod;
    startDate?: string | null;
    endDate?: string | null;
    doctorId?: number;
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

const formatDateRange = (
  range: CorporateStatisticsData["date_filter"]
) => {
  const start = range?.start_date;
  const end = range?.end_date;

  if (!start && !end) return "Tarih aralığı belirtilmedi";
  if (start && end) return `${start} - ${end}`;
  if (start) return `${start} sonrası`;
  return `${end} öncesi`;
};

const sortDoctors = (doctors: CorporateDoctorStatistics[]) => {
  return [...doctors].sort((a, b) => {
    const appointmentDiff = b.appointments.total - a.appointments.total;
    if (appointmentDiff !== 0) {
      return appointmentDiff;
    }
    const commentDiff = b.comments.total - a.comments.total;
    if (commentDiff !== 0) {
      return commentDiff;
    }
    return b.comments.average_rating - a.comments.average_rating;
  });
};

const CorporateStatisticsClient = ({
  initialData,
  initialFilters,
}: CorporateStatisticsClientProps) => {
  const [activePeriod, setActivePeriod] = useState<StatisticsPeriod>(
    initialFilters.period
  );
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [dataMap, setDataMap] = useState<
    Partial<Record<StatisticsPeriod, CorporateStatisticsData>>
  >({
    [initialFilters.period]: initialData,
  });
  const [currentData, setCurrentData] =
    useState<CorporateStatisticsData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const overviewCards = useMemo(
    () => [
      {
        title: "Toplam Doktor",
        value: currentData.doctor_count,
        description: "Aktif olarak kurumunuza bağlı",
      },
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
        title: "Ortalama Puan",
        value: currentData.comments.average_rating.toFixed(2),
        description: `${currentData.comments.total} toplam yorum`,
      },
      {
        title: "Bekleyen Yorum",
        value: currentData.comments.pending,
        description: "Onaylanmayı bekleyen yorumlar",
      },
    ],
    [currentData]
  );

  const doctors = useMemo(
    () => sortDoctors(currentData.doctors),
    [currentData.doctors]
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
        const response = await getCorporateStatistics({
          period,
          doctor_id: initialFilters.doctorId,
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
    [
      activePeriod,
      dataMap,
      initialFilters.doctorId,
      initialFilters.startDate,
      initialFilters.endDate,
    ]
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-gray-200 bg-gradient-to-r from-emerald-50 via-white to-white p-6 shadow-sm shadow-emerald-100">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Kurum İstatistikleri
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentData.corporate.name}
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
        {overviewCards.map((card) => (
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

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-200">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Doktor Performans Özeti
          </h3>
          <p className="text-sm text-gray-500">
            Kurumunuza bağlı doktorların randevu ve yorum performansları.
          </p>
        </div>

        <div className="mt-4 max-h-[420px] overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Doktor
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Toplam Randevu
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Onaylanan
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Ortalama Puan
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Onaylı Yorum
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Bekleyen Yorum
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700">
              {doctors.map((item) => (
                <tr key={item.doctor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {item.doctor.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.doctor.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-900">
                    {item.appointments.total}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.appointments.confirmed}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.comments.average_rating?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.comments.approved}
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {item.comments.pending}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default CorporateStatisticsClient;

