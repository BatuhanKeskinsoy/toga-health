"use client";
import React, { useState, useCallback } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomButton from "@/components/Customs/CustomButton";
import {
  confirmAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
} from "@/lib/services/appointment/services";
import type { Appointment } from "@/lib/types/appointments/provider";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import Swal from "sweetalert2";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoMedicalOutline,
  IoCashOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCheckmarkOutline,
} from "react-icons/io5";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import { useLocale, useTranslations } from "next-intl";
import {
  convertDateOnly,
  convertTimeOnly,
} from "@/lib/functions/getConvertDate";

interface AppointmentDetailModalProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [completeNotes, setCompleteNotes] = useState("");
  const [cancelReason, setCancelReason] = useState("");

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

  const handleConfirm = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await confirmAppointment(appointment.id);
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: t("Başarılı"),
          text: t("Randevu onaylandı"),
          confirmButtonColor: "#ed1c24",
        });
        onUpdate?.();
        onClose();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text:
          error.response?.data?.message ||
          t("Randevu onaylanırken bir hata oluştu"),
        confirmButtonColor: "#ed1c24",
      });
    } finally {
      setIsLoading(false);
    }
  }, [appointment.id, onUpdate, onClose]);

  const handleReject = useCallback(async () => {
    if (!rejectReason.trim()) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: "Lütfen reddetme nedenini belirtiniz.",
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await rejectAppointment(appointment.id, {
        reason: rejectReason,
      });
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: t("Başarılı"),
          text: t("Randevu reddedildi"),
          confirmButtonColor: "#ed1c24",
        });
        onUpdate?.();
        setShowRejectModal(false);
        setRejectReason("");
        onClose();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text:
          error.response?.data?.message ||
          t("Randevu reddedilirken bir hata oluştu"),
        confirmButtonColor: "#ed1c24",
      });
    } finally {
      setIsLoading(false);
    }
  }, [appointment.id, rejectReason, onUpdate, onClose]);

  const handleComplete = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await completeAppointment(appointment.id, {
        notes: completeNotes || null,
      });
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: t("Başarılı"),
          text: t("Randevu tamamlandı olarak işaretlendi"),
          confirmButtonColor: "#ed1c24",
        });
        onUpdate?.();
        setShowCompleteModal(false);
        setCompleteNotes("");
        onClose();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text:
          error.response?.data?.message ||
          t("Randevu tamamlanırken bir hata oluştu"),
        confirmButtonColor: "#ed1c24",
      });
    } finally {
      setIsLoading(false);
    }
  }, [appointment.id, completeNotes, onUpdate, onClose]);

  const handleCancel = useCallback(async () => {
    if (!cancelReason.trim()) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text: "Lütfen iptal nedenini belirtiniz.",
        confirmButtonColor: "#ed1c24",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await cancelAppointment(appointment.id, {
        cancellation_reason: cancelReason,
      });
      if (response.status) {
        Swal.fire({
          icon: "success",
          title: t("Başarılı"),
          text: t("Randevu iptal edildi"),
          confirmButtonColor: "#ed1c24",
        });
        onUpdate?.();
        setShowCancelModal(false);
        setCancelReason("");
        onClose();
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: t("Hata"),
        text:
          error.response?.data?.message ||
          t("Randevu iptal edilirken bir hata oluştu"),
        confirmButtonColor: "#ed1c24",
      });
    } finally {
      setIsLoading(false);
    }
  }, [appointment.id, cancelReason, onUpdate, onClose]);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <IoCalendarOutline className="text-sitePrimary text-xl" />
          <span>{t("Randevu Detayları")}</span>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center gap-2">
          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {appointment.title || "Randevu"}
            </h3>
            {appointment.description && (
              <p className="text-gray-600 leading-relaxed">
                {appointment.description}
              </p>
            )}
          </div>
          {/* Status Badge */}
          <div className="flex items-center justify-start">
            <span
              className={`px-3 py-1.5 text-sm font-medium rounded-md border ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />
        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <IoCalendarOutline
              size={20}
              className="text-sitePrimary mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{t("Tarih")}</p>
              <p className="text-sm font-semibold text-gray-900">
                {convertDateOnly(startTime, locale)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <IoTimeOutline
              size={20}
              className="text-sitePrimary mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">{t("Saat")}</p>
              <p className="text-sm font-semibold text-gray-900">
                {convertTimeOnly(startTime, locale)} -{" "}
                {convertTimeOnly(endTime, locale)} (
                {appointment.duration_minutes} dk)
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
            <div className="flex items-center gap-2">
              <IoPersonOutline size={18} className="text-gray-400" />
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {t("Hasta")}
              </p>
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              {appointment.user.name}
            </h4>
            <p className="text-sm text-gray-600">{appointment.user.email}</p>
            {appointment.user.phone_number && (
              <p className="text-sm text-gray-600">
                {appointment.user.phone_code} {appointment.user.phone_number}
              </p>
            )}
          </div>
        </div>

        {/* Service Info */}
        {appointment.service && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <IoMedicalOutline size={20} className="text-blue-600" />
              <p className="text-sm font-semibold text-blue-900">
                {t("Hizmet Bilgisi")}
              </p>
            </div>
            <h4 className="text-lg font-semibold text-gray-900">
              {appointment.service.service_name}
            </h4>
            <p className="text-sm text-gray-600">
              {appointment.service.service_type === "disease"
                ? t("Hastalık")
                : t("Tedavi")}
            </p>
            {appointment.service.formatted_price && (
              <p className="text-sm font-medium text-gray-900">
                {appointment.service.formatted_price}
              </p>
            )}
          </div>
        )}

        {/* Location */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <IoLocationOutline
            size={20}
            className="text-sitePrimary mt-1 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t("Konum")}
            </p>
            {appointment.location_details && (
              <p className="text-sm text-gray-600">
                {appointment.location_details}
              </p>
            )}
            {appointment.user_address && (
              <p className="text-sm text-gray-600">
                {appointment.user_address.address},{" "}
                {appointment.user_address.district},{" "}
                {appointment.user_address.city},{" "}
                {appointment.user_address.country}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        {appointment.price && (
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <IoCashOutline
              size={20}
              className="text-green-600 mt-1 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {t("Fiyat")}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-lg font-bold text-gray-900">
                  {appointment.price} {appointment.currency}
                </p>
                {appointment.is_paid && (
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {t("Ödendi")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t("Randevu Tipi")}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {appointment.type === "checkup"
                ? t("Kontrol")
                : appointment.type === "followup"
                ? t("Takip")
                : appointment.type === "consultation"
                ? t("Danışmanlık")
                : appointment.type}
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {t("Oluşturulma Tarihi")}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {convertDateOnly(new Date(appointment.created_at), locale)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-gray-200">
          {appointment.status === "pending" && (
            <>
              <CustomButton
                btnType="button"
                title={t("Onayla")}
                handleClick={handleConfirm}
                isDisabled={isLoading}
                containerStyles="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                leftIcon={<IoCheckmarkCircleOutline size={20} />}
              />
              <CustomButton
                btnType="button"
                title={t("Reddet")}
                handleClick={() => setShowRejectModal(true)}
                isDisabled={isLoading}
                containerStyles="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                leftIcon={<IoCloseCircleOutline size={20} />}
              />
            </>
          )}
          {appointment.status === "confirmed" && (
            <>
              <CustomButton
                btnType="button"
                title={t("Tamamlandı")}
                handleClick={() => setShowCompleteModal(true)}
                isDisabled={isLoading}
                containerStyles="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                leftIcon={<IoCheckmarkOutline size={20} />}
              />
              <CustomButton
                btnType="button"
                title={t("İptal Et")}
                handleClick={() => setShowCancelModal(true)}
                isDisabled={isLoading}
                containerStyles="flex items-center justify-center gap-2 px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                leftIcon={<IoCloseCircleOutline size={20} />}
              />
            </>
          )}
          <CustomButton
            btnType="button"
            title={t("Kapat")}
            handleClick={onClose}
            isDisabled={isLoading}
            containerStyles="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      {/* Reject Modal */}
      <CustomModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason("");
        }}
        title={t("Randevuyu Reddet")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t("Randevuyu reddetmek için bir neden belirtiniz")}
          </p>
          <CustomTextarea
            label={t("Reddetme Nedeni")}
            name="rejectReason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={1}
            required
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              btnType="button"
              title={t("İptal")}
              handleClick={() => {
                setShowRejectModal(false);
                setRejectReason("");
              }}
              isDisabled={isLoading}
              containerStyles="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            />
            <CustomButton
              btnType="button"
              title={isLoading ? t("Yükleniyor") : t("Reddet")}
              handleClick={handleReject}
              isDisabled={isLoading}
              containerStyles="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            />
          </div>
        </div>
      </CustomModal>

      {/* Complete Modal */}
      <CustomModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setCompleteNotes("");
        }}
        title={t("Randevuyu Tamamlandı Olarak İşaretle")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t(
              "Randevu tamamlandı olarak işaretlenecek, isterseniz not ekleyebilirsiniz"
            )}
          </p>
          <CustomTextarea
            label={t("Notlar (Opsiyonel)")}
            name="completeNotes"
            value={completeNotes}
            onChange={(e) => setCompleteNotes(e.target.value)}
            rows={1}
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              btnType="button"
              title={t("İptal")}
              handleClick={() => {
                setShowCompleteModal(false);
                setCompleteNotes("");
              }}
              isDisabled={isLoading}
              containerStyles="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            />
            <CustomButton
              btnType="button"
              title={isLoading ? t("Yükleniyor") : t("Tamamla")}
              handleClick={handleComplete}
              isDisabled={isLoading}
              containerStyles="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            />
          </div>
        </div>
      </CustomModal>

      {/* Cancel Modal */}
      <CustomModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelReason("");
        }}
        title={t("Randevuyu İptal Et")}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {t("Randevuyu iptal etmek için bir neden belirtiniz")}
          </p>
          <CustomTextarea
            label={t("İptal Nedeni")}
            name="cancelReason"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            required
          />
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <CustomButton
              btnType="button"
              title={t("İptal")}
              handleClick={() => {
                setShowCancelModal(false);
                setCancelReason("");
              }}
              isDisabled={isLoading}
              containerStyles="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            />
            <CustomButton
              btnType="button"
              title={isLoading ? t("Yükleniyor") : t("İptal Et")}
              handleClick={handleCancel}
              isDisabled={isLoading}
              containerStyles="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            />
          </div>
        </div>
      </CustomModal>
    </CustomModal>
  );
};

export default React.memo(AppointmentDetailModal);
