"use client";
import React from "react";
import type { AppointmentStatistics as AppointmentStatisticsType } from "@/lib/types/appointments/provider";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoHourglassOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

interface AppointmentStatisticsProps {
  statistics: AppointmentStatisticsType;
}

const AppointmentStatistics: React.FC<AppointmentStatisticsProps> = ({
  statistics,
}) => {
  const stats = [
    {
      label: "Toplam",
      value: statistics.total,
      icon: IoCalendarOutline,
      color: "text-blue-600",
    },
    {
      label: "Bugün",
      value: statistics.today,
      icon: IoTimeOutline,
      color: "text-amber-600",
    },
    {
      label: "Onaylandı",
      value: statistics.confirmed,
      icon: IoCheckmarkCircleOutline,
      color: "text-green-600",
    },
    {
      label: "Beklemede",
      value: statistics.pending,
      icon: IoHourglassOutline,
      color: "text-yellow-600",
    },
    {
      label: "Tamamlandı",
      value: statistics.completed,
      icon: IoCheckmarkCircleOutline,
      color: "text-gray-600",
    },
    {
      label: "İptal Edildi",
      value: statistics.cancelled,
      icon: IoCloseCircleOutline,
      color: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 w-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-0.5 p-3 rounded-md bg-gray-50 hover:bg-white border border-gray-200 hover:shadow-md shadow-gray-200 transition-all duration-200"
          >
            <div className={`p-1.5 rounded-lg bg-gray-50 ${stat.color}`}>
              <Icon size={24} />
            </div>
            <p className="text-xs text-gray-600 font-medium uppercase flex-1">
              {stat.label}
            </p>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(AppointmentStatistics);
