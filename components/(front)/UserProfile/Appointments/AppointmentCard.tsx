"use client";
import React from "react";
import type { Appointment } from "@/lib/types/appointments/provider";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { useLocale, useTranslations } from "next-intl";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoMedicalOutline,
  IoChevronForwardOutline,
} from "react-icons/io5";
import { convertDateOnly, convertTimeOnly } from "@/lib/functions/getConvertDate";

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onClick,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const getStatusColor = () => {
    switch (appointment.status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusText = () => {
    switch (appointment.status) {
      case "confirmed":
        return t("Onaylandı");
      case "pending":
        return t("Beklemede");
      case "completed":
        return t("Tamamlandı");
      case "cancelled":
        return t("İptal Edildi");
      default:
        return appointment.status;
    }
  };

  const startTime = new Date(appointment.start_time);
  const endTime = new Date(appointment.end_time);

  return (
    <div
      onClick={onClick}
      className={`w-full bg-white rounded-lg border border-gray-200 p-4 lg:p-6 transition-all duration-200 ${
        onClick
          ? "hover:shadow-lg hover:border-sitePrimary cursor-pointer group"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Kullanıcı Fotoğrafı */}
          <div className="flex-shrink-0">
            <ProfilePhoto
              name={appointment.user.name}
              photo={appointment.user.photo || null}
              size={56}
              fontSize={20}
              responsiveSizes={{ desktop: 56, mobile: 48 }}
              responsiveFontSizes={{ desktop: 20, mobile: 16 }}
            />
          </div>

          {/* Randevu Bilgileri */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {appointment.title || t("Randevu")}
              </h3>
              <span
                className={`px-2.5 py-1 text-xs font-medium rounded-md border flex-shrink-0 ${getStatusColor()}`}
              >
                {getStatusText()}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {/* Tarih ve Saat */}
              <div className="flex items-center gap-2 text-sm">
                <IoCalendarOutline size={18} className="text-sitePrimary flex-shrink-0" />
                <span className="text-gray-700 font-medium">
                  {convertDateOnly(startTime, locale)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <IoTimeOutline size={18} className="text-sitePrimary flex-shrink-0" />
                <span className="text-gray-700">
                  {convertTimeOnly(startTime, locale)} -{" "}
                  {convertTimeOnly(endTime, locale)} ({appointment.duration_minutes} {t("Dakika")})
                </span>
              </div>

              {/* Kullanıcı */}
              <div className="flex items-center gap-2 text-sm">
                <IoPersonOutline size={18} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">{appointment.user.name}</span>
              </div>

              {/* Servis */}
              {appointment.service && (
                <div className="flex items-center gap-2 text-sm">
                  <IoMedicalOutline size={18} className="text-blue-500 flex-shrink-0" />
                  <span className="text-gray-600">
                    {appointment.service.service_name} (
                    {appointment.service.service_type === "disease" ? t("Hastalık") : t("Tedavi")})
                  </span>
                </div>
              )}

              {/* Konum */}
              <div className="flex items-center gap-2 text-sm">
                <IoLocationOutline size={18} className="text-gray-400 flex-shrink-0" />
                <span className="text-gray-600">
                  {appointment.location_details && ` - ${appointment.location_details}`}
                </span>
              </div>

              {/* Fiyat */}
              {appointment.price && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-gray-900">
                    {appointment.price} {appointment.currency}
                  </span>
                  {appointment.is_paid && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {t("Ödendi")}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chevron Icon */}
        {onClick && (
          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <IoChevronForwardOutline size={24} className="text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(AppointmentCard);
