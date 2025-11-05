"use client";
import React from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import type { Appointment } from "@/lib/types/appointments/provider";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoMedicalOutline,
  IoCashOutline,
} from "react-icons/io5";

interface AppointmentDetailModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const startTime = new Date(appointment.start_time);
  const endTime = new Date(appointment.end_time);

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
        return "Onaylandı";
      case "pending":
        return "Beklemede";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return appointment.status;
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <IoCalendarOutline className="text-sitePrimary text-xl" />
          <span>Randevu Detayları</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-start">
          <span
            className={`px-3 py-1.5 text-sm font-medium rounded-md border ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {appointment.title || "Randevu"}
          </h3>
          {appointment.description && (
            <p className="text-gray-600 leading-relaxed">{appointment.description}</p>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <IoCalendarOutline size={20} className="text-sitePrimary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Tarih</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(startTime, "d MMMM yyyy, EEEE", { locale: tr })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <IoTimeOutline size={20} className="text-sitePrimary mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Saat</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(startTime, "HH:mm", { locale: tr })} -{" "}
                {format(endTime, "HH:mm", { locale: tr })} ({appointment.duration_minutes} dk)
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <ProfilePhoto
            name={appointment.user.name}
            photo={appointment.user.photo || null}
            size={60}
            fontSize={24}
            responsiveSizes={{ desktop: 60, mobile: 50 }}
            responsiveFontSizes={{ desktop: 24, mobile: 20 }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <IoPersonOutline size={18} className="text-gray-400" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Hasta</p>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{appointment.user.name}</h4>
            <p className="text-sm text-gray-600">{appointment.user.email}</p>
            {appointment.user.phone_number && (
              <p className="text-sm text-gray-600 mt-1">
                {appointment.user.phone_code} {appointment.user.phone_number}
              </p>
            )}
          </div>
        </div>

        {/* Service Info */}
        {appointment.service && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <IoMedicalOutline size={20} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">Hizmet Bilgisi</p>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-1">
              {appointment.service.service_name}
            </h4>
            <p className="text-sm text-gray-600">
              {appointment.service.service_type === "disease" ? "Hastalık" : "Tedavi"}
            </p>
            {appointment.service.formatted_price && (
              <p className="text-sm font-medium text-gray-900 mt-2">
                {appointment.service.formatted_price}
              </p>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <IoLocationOutline size={20} className="text-sitePrimary mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Konum
            </p>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              {appointment.location_type === "office"
                ? appointment.user_address?.name || "Ofis"
                : "Online"}
            </p>
            {appointment.location_details && (
              <p className="text-sm text-gray-600">{appointment.location_details}</p>
            )}
            {appointment.user_address && (
              <p className="text-sm text-gray-600 mt-2">
                {appointment.user_address.address}, {appointment.user_address.district},{" "}
                {appointment.user_address.city}, {appointment.user_address.country}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        {appointment.price && (
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <IoCashOutline size={20} className="text-green-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Fiyat
              </p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-gray-900">
                  {appointment.price} {appointment.currency}
                </p>
                {appointment.is_paid && (
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ödendi
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Randevu Tipi
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {appointment.type === "checkup"
                ? "Kontrol"
                : appointment.type === "followup"
                ? "Takip"
                : appointment.type === "consultation"
                ? "Danışmanlık"
                : appointment.type}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Oluşturulma Tarihi
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {format(new Date(appointment.created_at), "d MMMM yyyy, HH:mm", { locale: tr })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton
            btnType="button"
            title="Kapat"
            handleClick={onClose}
            containerStyles="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default React.memo(AppointmentDetailModal);
