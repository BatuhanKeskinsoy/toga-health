import React from "react";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import type { StatisticsPeriod } from "@/lib/types/provider/statisticsTypes";
import {
  getDoctorPaymentStatistics,
  getDoctorStatistics,
} from "@/lib/services/provider/statistics";
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
    const [statsResponse, paymentResponse] = await Promise.all([
      getDoctorStatistics({
      period,
      start_date: startDate,
      end_date: endDate,
      }),
      getDoctorPaymentStatistics(),
    ]);

    if (!statsResponse?.status || !statsResponse.data) {
      return (
        <StatisticsError message="Doktor istatistikleri şu anda getirilemiyor." />
      );
    }

    return (
      <DoctorStatisticsClient
        initialData={statsResponse.data}
        paymentStatistics={
          paymentResponse?.status ? paymentResponse.data : undefined
        }
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