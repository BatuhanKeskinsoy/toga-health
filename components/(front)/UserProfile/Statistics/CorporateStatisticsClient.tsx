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
import CustomSelect from "@/components/Customs/CustomSelect";
import { useLocale, useTranslations } from "next-intl";
import { convertDate } from "@/lib/functions/getConvertDate";

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
  isDoctorSelected,
}: {
  title: string;
  value: string | number;
  description?: string;
  isDoctorSelected?: boolean;
}) => {
  const t = useTranslations();
  const first =
    "first:text-wrap first:text-center first:whitespace-normal first:flex first:items-center first:justify-center first:*:text-base first:!bg-emerald-50 first:!border-emerald-200 first:!text-emerald-600";
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-md shadow-gray-200 ${
        isDoctorSelected ? first : ""
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      {description && (
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
};

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

const formatDateRange = (range: CorporateStatisticsData["date_filter"]) => {
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

const getCacheKey = (period: StatisticsPeriod, doctorId?: number | null) =>
  `${period}-${doctorId ?? "all"}`;

const normalizeCorporateStatistics = (
  data: CorporateStatisticsData
): CorporateStatisticsData => ({
  ...data,
  doctors: Array.isArray(data.doctors) ? data.doctors : [],
});

const CorporateStatisticsClient = ({
  initialData,
  initialFilters,
}: CorporateStatisticsClientProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  const normalizedInitialData = useMemo(
    () => normalizeCorporateStatistics(initialData),
    [initialData]
  );
  const [activePeriod, setActivePeriod] = useState<StatisticsPeriod>(
    initialFilters.period
  );
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("daily");
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | "all">(
    initialFilters.doctorId ?? "all"
  );
  const initialCacheKey = getCacheKey(
    initialFilters.period,
    initialFilters.doctorId
  );
  const [dataMap, setDataMap] = useState<
    Record<string, CorporateStatisticsData>
  >({
    [initialCacheKey]: normalizedInitialData,
  });
  const [currentData, setCurrentData] = useState<CorporateStatisticsData>(
    normalizedInitialData
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const doctorOptions = useMemo(() => {
    const uniqueDoctors = new Map<number, string>();

    const collectDoctors = (list: CorporateDoctorStatistics[]) => {
      list.forEach((doctorStat) => {
        uniqueDoctors.set(
          doctorStat.doctor.id,
          [doctorStat.doctor.expert_title, doctorStat.doctor.name]
            .filter(Boolean)
            .join(" ")
        );
      });
    };

    collectDoctors(normalizedInitialData.doctors);
    collectDoctors(currentData.doctors);

    const sortedDoctors = Array.from(uniqueDoctors.entries())
      .map(([id, label]) => ({ id, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "tr"));

    return [
      { id: 0, name: t("Tüm Doktorlar"), value: "all" },
      ...sortedDoctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.label,
        value: doctor.id,
      })),
    ];
  }, [currentData.doctors, normalizedInitialData.doctors]);

  const selectedDoctorOption = useMemo(() => {
    if (selectedDoctorId === "all") {
      return doctorOptions.find((option) => option.value === "all") ?? null;
    }
    return (
      doctorOptions.find(
        (option) =>
          option.value === selectedDoctorId || option.id === selectedDoctorId
      ) ?? null
    );
  }, [doctorOptions, selectedDoctorId]);

  const overviewCards = useMemo(
    () => [

      {
        title: selectedDoctorOption?.name ?? t("Toplam Doktor"),
        value: currentData.doctor_count,
        description: selectedDoctorId !== "all"  ? "" : t("Tüm Doktorlar"),
      },
      {
        title: t("Toplam Randevu"),
        value: currentData.appointments.total,
        description: `${currentData.appointments.pending} ${t("Beklemede")}`,
      },
      {
        title: t("Onaylanan"),
        value: currentData.appointments.confirmed,
        description: `${currentData.appointments.completed} ${t("Tamamlandı")}`,
      },
      {
        title: t("Ortalama Puan"),
        value: currentData.comments.average_rating.toFixed(2),
        description: `${currentData.comments.total} ${t("Toplam Yorum")}`,
      },
      {
        title: t("Bekleyen Yorum"),
        value: currentData.comments.pending,
        description: t("Bekleyen Yorumlar"),
      },
    ],
    [currentData]
  );

  const doctors = useMemo(
    () => sortDoctors(currentData.doctors),
    [currentData.doctors]
  );

  const buildRequestParams = useCallback(
    (period: StatisticsPeriod, doctorIdValue: number | "all") => ({
      period,
      doctor_id: doctorIdValue === "all" ? undefined : doctorIdValue,
      start_date: initialFilters.startDate ?? undefined,
      end_date: initialFilters.endDate ?? undefined,
    }),
    [initialFilters.endDate, initialFilters.startDate]
  );

  const handlePeriodChange = useCallback(
    async (period: StatisticsPeriod) => {
      if (period === activePeriod) return;
      setActivePeriod(period);
      setErrorMessage(null);

      const doctorIdValue = selectedDoctorId;
      const cacheKey = getCacheKey(
        period,
        doctorIdValue === "all" ? undefined : doctorIdValue
      );

      if (dataMap[cacheKey]) {
        setCurrentData(dataMap[cacheKey]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getCorporateStatistics(
          buildRequestParams(period, doctorIdValue)
        );

        if (!response?.status || !response.data) {
          throw new Error("İstatistik verisi alınamadı.");
        }

        const normalizedData = normalizeCorporateStatistics(response.data);

        setDataMap((prev) => ({ ...prev, [cacheKey]: normalizedData }));
        setCurrentData(normalizedData);
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
    [activePeriod, buildRequestParams, dataMap, selectedDoctorId]
  );

  const handleDoctorSelect = useCallback(
    async (option: { value?: unknown; id?: number } | null) => {
      const rawValue =
        option?.value !== undefined ? option.value : option?.id ?? "all";
      const normalizedValue =
        rawValue === "all" ? "all" : Number(rawValue ?? "all");

      if (normalizedValue === selectedDoctorId) {
        return;
      }

      setSelectedDoctorId(normalizedValue);
      setErrorMessage(null);

      const cacheKey = getCacheKey(
        activePeriod,
        normalizedValue === "all" ? undefined : normalizedValue
      );

      if (dataMap[cacheKey]) {
        setCurrentData(dataMap[cacheKey]);
        setChartPeriod("daily");
        return;
      }

      setIsLoading(true);
      try {
        const response = await getCorporateStatistics(
          buildRequestParams(activePeriod, normalizedValue)
        );

        if (!response?.status || !response.data) {
          throw new Error("İstatistik verisi alınamadı.");
        }

        const normalizedData = normalizeCorporateStatistics(response.data);

        setDataMap((prev) => ({ ...prev, [cacheKey]: normalizedData }));
        setCurrentData(normalizedData);
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
    [activePeriod, buildRequestParams, dataMap, selectedDoctorId]
  );

  return (
    <section className="flex flex-col gap-6">
      <header className="rounded-2xl border border-gray-200 bg-gradient-to-r from-emerald-50 via-white to-white p-6 shadow-sm shadow-emerald-100">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              {t("Kurum İstatistikleri")}
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentData.corporate.name}
            </h2>
            <div className="text-sm text-gray-500">
              <p>
                {t("Zaman Dilimi")} :{" "}
                <span className="font-medium text-gray-700">
                  {currentData.timezone}
                </span>
              </p>
              <p>
                {t("Tarih Aralığı")} :{" "}
                <span className="font-medium text-gray-700">
                  {formatDateRange(currentData.date_filter)}
                </span>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              {t("Oluşturulma Zamanı")} :{" "}
              {convertDate(new Date(currentData.generated_at), locale)}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <StatisticsPeriodFilter
              selectedPeriod={activePeriod}
              onChange={handlePeriodChange}
              disabled={isLoading}
            />
            <div className="w-full">
              <CustomSelect
                id="doctor-filter"
                name="doctor-filter"
                label={t("Doktor Filtresi")}
                options={doctorOptions}
                value={selectedDoctorOption}
                onChange={handleDoctorSelect}
                disabled={isLoading}
              />
            </div>
          </div>
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
            isDoctorSelected={selectedDoctorId !== "all"}
          />
        ))}
      </div>

      <PeriodChartSwitcher
        periodStatistics={currentData.period_statistics}
        timezone={currentData.timezone}
        emptyMessage={t("Bu zaman aralığı için grafik verisi bulunamadı")}
        activeChartPeriod={chartPeriod}
        onChartPeriodChange={setChartPeriod}
        loading={isLoading}
      />

      {selectedDoctorId === "all" && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm shadow-gray-200">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("Doktor Performans Özeti")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("Kurumunuza bağlı doktorların randevu ve yorum performansları")}
            </p>
          </div>

          <div className="mt-4 max-h-[420px] overflow-x-auto rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("Doktor")}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("Toplam Randevu")}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("Onaylanan")}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("Ortalama Puan")}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("Onaylı Yorum")}
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t("Bekleyen Yorum")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm text-gray-700">
                {doctors.map((item) => (
                  <tr key={item.doctor.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {[item.doctor.expert_title, item.doctor.name]
                            .filter(Boolean)
                            .join(" ")}
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
      )}
    </section>
  );
};

export default CorporateStatisticsClient;
