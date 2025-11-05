"use client";
import React from "react";
import type { Appointment } from "@/lib/types/appointments/provider";
import AppointmentCard from "./AppointmentCard";
import { IoCalendarClearOutline } from "react-icons/io5";

interface AppointmentListProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onAppointmentClick,
}) => {
  if (appointments.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200 p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-gray-100 rounded-full">
            <IoCalendarClearOutline size={48} className="text-gray-400" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-900">Randevu bulunamadı</h3>
            <p className="text-gray-600 text-sm">
              Seçili adres için henüz randevu kaydı bulunmamaktadır.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onClick={() => onAppointmentClick?.(appointment)}
        />
      ))}
    </div>
  );
};

export default React.memo(AppointmentList);
