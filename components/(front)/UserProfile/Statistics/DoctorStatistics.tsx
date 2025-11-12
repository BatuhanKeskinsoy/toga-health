import React from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import type { StatisticsPeriod } from "@/lib/types/provider/statisticsTypes";
import { getDoctorStatistics } from "@/lib/services/provider/statistics";
import DoctorStatisticsClient from "./DoctorStatisticsClient";

interface DoctorStatisticsProps {
  user: UserTypes;
  period?: StatisticsPeriod;
  startDate?: string;
  endDate?: string;
}

const StatisticsError = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
    {message}
  </div>
);

async function DoctorStatistics({
  user,
  period = "today",
  startDate,
  endDate,
}: DoctorStatisticsProps) {
  if (user.user_type !== "doctor") {
    return null;
  }

  try {
    const response = await getDoctorStatistics({
      period,
      start_date: startDate,
      end_date: endDate,
    });

    if (!response?.status || !response.data) {
      return (
        <StatisticsError message="Doktor istatistikleri şu anda getirilemiyor." />
      );
    }

    return (
      <DoctorStatisticsClient
        initialData={response.data}
        initialFilters={{
          period,
          startDate,
          endDate,
        }}
      />
    );
  } catch (error) {
    return (
      <StatisticsError message="Doktor istatistikleri yüklenirken bir hata oluştu." />
    );
  }
}

export default DoctorStatistics;