import React from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import type { StatisticsPeriod } from "@/lib/types/provider/statisticsTypes";
import { getCorporateStatistics } from "@/lib/services/provider/statistics";
import CorporateStatisticsClient from "./CorporateStatisticsClient";

interface CorporateStatisticsProps {
  user: UserTypes;
  period?: StatisticsPeriod;
  startDate?: string;
  endDate?: string;
  doctorId?: number;
}

const StatisticsError = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
    {message}
  </div>
);

const formatDateForApi = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

async function CorporateStatistics({
  user,
  period = "today",
  startDate,
  endDate,
  doctorId,
}: CorporateStatisticsProps) {
  if (user.user_type !== "corporate") {
    return null;
  }

  const now = new Date();
  const resolvedEndDate = endDate || formatDateForApi(now);
  const startBoundary = new Date(now);
  startBoundary.setMonth(startBoundary.getMonth() - 3);
  const resolvedStartDate = startDate || formatDateForApi(startBoundary);

  try {
    const response = await getCorporateStatistics({
      period,
      doctor_id: doctorId,
      start_date: resolvedStartDate,
      end_date: resolvedEndDate,
    });

    if (!response?.status || !response.data) {
      return (
        <StatisticsError message="Kurum istatistikleri şu anda getirilemiyor." />
      );
    }

    return (
      <CorporateStatisticsClient
        initialData={response.data}
        initialFilters={{
          period,
          startDate: resolvedStartDate,
          endDate: resolvedEndDate,
          doctorId,
        }}
      />
    );
  } catch (error) {
    return (
      <StatisticsError message="Kurum istatistikleri yüklenirken bir hata oluştu." />
    );
  }
}

export default CorporateStatistics;