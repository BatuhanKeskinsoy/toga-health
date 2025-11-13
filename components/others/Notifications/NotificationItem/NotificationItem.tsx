"use client";
import React, { useCallback, useMemo } from "react";
import { convertDate } from "@/lib/functions/getConvertDate";
import CustomButton from "@/components/Customs/CustomButton";
import { notificationRead } from "@/lib/services/notification/notificationRead";
import NotificationTitle from "../NotificationTitle";
import { showNotificationDetailsModal } from "../NotificationDetailsModal";
import ReactDOMServer from "react-dom/server";
import { useLocale, useTranslations } from "next-intl";
import {
  AppointmentNotificationData,
  AppointmentNotificationType,
  NotificationItemTypes,
  PaymentNotificationData,
  PaymentNotificationType,
  UserTypeChangeNotificationData,
} from "./notificationTypes";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface DetailRow {
  label: string;
  value: React.ReactNode;
}

interface DetailContentProps {
  icon?: string;
  title: string;
  message?: string;
  rows?: DetailRow[];
  actionUrl?: string;
  actionLabel?: string;
  locale?: string;
}

const NotificationDetailContent: React.FC<DetailContentProps> = ({
  icon,
  title,
  message,
  rows,
  actionUrl,
  actionLabel,
  locale,
}) => (
  <div className="flex flex-col gap-4 py-4 text-left text-[14px] text-gray-700">
    <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
      {icon && <span className="text-2xl">{icon}</span>}
      <span className="text-lg font-semibold text-gray-900">{title}</span>
    </div>
    {message && <p className="text-sm leading-relaxed">{message}</p>}
    {rows && rows.length > 0 && (
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            className="flex flex-col rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
              {row.label}
            </span>
            <span className="text-sm text-gray-700">{row.value}</span>
          </div>
        ))}
      </div>
    )}
    {actionUrl && (
      <a
        href={getLocalizedUrl(actionUrl as string, locale)}
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md bg-sitePrimary px-4 py-2 text-sm font-medium text-white transition hover:bg-sitePrimary/90"
      >
        {actionLabel ?? "Detaya Git"}
      </a>
    )}
  </div>
);

const formatDateString = (value?: string, locale?: string) => {
  if (!value) return "-";
  try {
    const date = new Date(`${value}T00:00:00Z`);
    return new Intl.DateTimeFormat(locale ?? "tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch (_error) {
    return value;
  }
};

const formatTimeString = (value?: string, locale?: string) => {
  if (!value) return "-";
  try {
    const date = new Date(value);
    return new Intl.DateTimeFormat(locale ?? "tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (_error) {
    return value;
  }
};

const formatDateTimeString = (value?: string, locale?: string) => {
  if (!value) return "-";
  const isoLike = value.includes("T")
    ? value
    : value.replace(
        /(\d{2})\.(\d{2})\.(\d{4})/,
        (_match, day, month, year) => `${year}-${month}-${day}`
      );
  try {
    const date = new Date(isoLike);
    return new Intl.DateTimeFormat(locale ?? "tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (_error) {
    return value;
  }
};

interface INotificationItemProps {
  notification: NotificationItemTypes;
  mutateNotifications: () => void;
  markAsRead?: (notificationId: string | number) => Promise<void>;
  isMobile: boolean;
}

const appointmentStatusKey: Record<
  AppointmentNotificationType,
  "pending" | "confirmed" | "cancelled" | "rejected"
> = {
  appointment_created: "pending",
  appointment_confirmed: "confirmed",
  appointment_cancelled: "cancelled",
  appointment_rejected: "rejected",
};

const paymentStatusKey: Record<PaymentNotificationType, "success" | "refunded"> =
  {
    payment_success: "success",
    payment_refunded: "refunded",
  };

function NotificationItem({
  notification,
  mutateNotifications,
  markAsRead,
  isMobile,
}: INotificationItemProps) {
  const t = useTranslations();
  const isRead = Boolean(notification.read_at);
  const { data } = notification;
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;

  const handleMarkAsRead = useCallback(async () => {
    try {
      if (markAsRead) {
        await markAsRead(notification.id);
      } else {
        await notificationRead(notification.id);
        mutateNotifications();
      }
    } catch (error) {
      console.error(t("Hata!"), error);
    }
  }, [notification.id, mutateNotifications, markAsRead, t]);

  const appointmentStatusLabels = useMemo(
    () => ({
      pending: t("Beklemede"),
      confirmed: t("Onaylandı"),
      cancelled: t("İptal Edildi"),
      rejected: t("Reddedildi"),
    }),
    [t]
  );

  const paymentStatusLabels = useMemo(
    () => ({
      success: t("Başarılı"),
      refunded: t("İade Edildi"),
    }),
    [t]
  );

  const buildAppointmentDetails = useCallback(
    (payload: AppointmentNotificationData): DetailContentProps => {
      const details =
        payload.data ?? ({} as AppointmentNotificationData["data"]);
    const statusKey =
      appointmentStatusKey[payload.type as AppointmentNotificationType];
    const rows: DetailRow[] = [
      {
        label: t("Durum"),
        value:
          appointmentStatusLabels[statusKey] ??
          (details.appointment_status
            ? t(details.appointment_status)
            : t("Bilinmiyor")),
      },
      {
        label: t("Randevu Tarihi"),
        value: formatDateString(details.appointment_date, locale),
      },
      {
        label: t("Randevu Saati"),
        value: formatTimeString(details.appointment_time, locale),
      },
    ];

    if (details.patient_name) {
      rows.push({ label: t("Hasta"), value: details.patient_name });
    }
    if (details.doctor_name) {
      rows.push({ label: t("Doktor"), value: details.doctor_name });
    }
    if (details.department) {
      rows.push({ label: t("Bölüm"), value: details.department });
    }
    if (details.address) {
      rows.push({ label: t("Adres"), value: details.address });
    }
    if (details.cancellation_reason) {
      rows.push({
        label:
          payload.type === "appointment_rejected"
            ? t("Reddetme Sebebi")
            : t("İptal Nedeni"),
        value: details.cancellation_reason,
      });
    }

    return {
      icon:
        payload.type === "appointment_confirmed"
          ? "✅"
          : payload.type === "appointment_cancelled"
          ? "⚠️"
          : payload.type === "appointment_rejected"
          ? "⛔"
          : "📅",
      title: payload.title,
      message: payload.message,
      rows,
      actionUrl: "/profile/appointments",
      actionLabel: t("Randevuyu Görüntüle"),
    };
    },
    [appointmentStatusLabels, locale, t]
  );

  const buildPaymentDetails = useCallback(
    (payload: PaymentNotificationData): DetailContentProps => {
    const statusKey =
      paymentStatusKey[payload.type as PaymentNotificationType] ??
      (payload.status === "refunded" ? "refunded" : "success");
    const appointment = payload.appointment ?? {};
    const rows: DetailRow[] = [
      { label: t("Ödeme No"), value: `#${payload.payment_id}` },
      {
        label: t("Durum"),
        value: paymentStatusLabels[statusKey] ?? payload.status ?? "-",
      },
    ];

    if (payload.amount) {
      rows.push({ label: t("Tutar"), value: payload.amount });
    }
    if (payload.payment_method) {
      rows.push({ label: t("Ödeme Yöntemi"), value: payload.payment_method });
    }
    if (payload.date) {
      rows.push({
        label: t("İşlem Tarihi"),
        value: formatDateTimeString(payload.date, locale),
      });
    }
    if (payload.transaction_id) {
      rows.push({
        label: t("İşlem ID"),
        value: payload.transaction_id,
      });
    }

    if (appointment.doctor_name || appointment.date || appointment.time) {
      rows.push({
        label: t("Randevu"),
        value: [
          appointment.doctor_name,
          appointment.date,
          appointment.time && appointment.time !== "-"
            ? appointment.time
            : undefined,
        ]
          .filter(Boolean)
          .join(" • "),
      });
    }

    return {
      icon: payload.icon ?? (statusKey === "success" ? "💳" : "💰"),
      title: payload.title,
      message: payload.message,
      rows,
      actionUrl: "/profile/appointments",
      actionLabel: t("Randevuları Görüntüle"),
    };
  },
    [locale, paymentStatusLabels, t]
  );

  const buildUserTypeChangeDetails = useCallback(
    (payload: UserTypeChangeNotificationData): DetailContentProps => {
      const details =
        payload.data ?? ({} as UserTypeChangeNotificationData["data"]);
    const rows: DetailRow[] = [
      { label: t("Başvuru ID"), value: `#${details.user_type_change_id}` },
    ];
    if (details.current_type) {
      rows.push({
        label: t("Mevcut Tip"),
        value: t(details.current_type),
      });
    }
    if (details.requested_type) {
      rows.push({
        label: t("Onaylanan Tip"),
        value: t(details.requested_type),
      });
    }
    if (details.approved_at) {
      rows.push({
        label: t("Onay Tarihi"),
        value: formatDateTimeString(details.approved_at, locale),
      });
    }

    return {
      icon: "🎉",
      title: payload.title,
      message: payload.message,
      rows,
      actionUrl: "/profile",
      actionLabel: t("Profili Aç"),
    };
    },
    [locale, t]
  );

  const handleShowDetails = useCallback(() => {
    let detailProps: DetailContentProps | null = null;

    if (data && typeof data === "object") {
      switch (data.type) {
        case "appointment_created":
        case "appointment_confirmed":
        case "appointment_cancelled":
        case "appointment_rejected":
          detailProps = buildAppointmentDetails(
            data as AppointmentNotificationData
          );
          break;
        case "payment_success":
        case "payment_refunded":
          detailProps = buildPaymentDetails(data as PaymentNotificationData);
          break;
        case "user_type_change_approved":
          detailProps = buildUserTypeChangeDetails(
            data as UserTypeChangeNotificationData
          );
          break;
        default:
          detailProps = {
            icon: data.icon as string | undefined,
            title: data.title,
            message: data.message,
            actionUrl: "/profile",
            actionLabel: t("Profile Git"),
          };
      }
    }

    const htmlContent = ReactDOMServer.renderToString(
      <NotificationDetailContent
        icon={detailProps?.icon}
        title={detailProps?.title ?? t("Bildirim Detayı")}
        message={detailProps?.message}
        rows={detailProps?.rows}
        actionUrl={detailProps?.actionUrl}
        actionLabel={detailProps?.actionLabel}
        locale={locale}
      />
    );

    showNotificationDetailsModal({
      html: htmlContent,
      confirmButtonText: t("Tamam"),
    });
  }, [
    data,
    buildAppointmentDetails,
    buildPaymentDetails,
    buildUserTypeChangeDetails,
    t,
    locale,
  ]);

  const containerClasses = `flex flex-col gap-2 lg:px-6 px-4 lg:py-4 py-6 border-b last:border-b-0 border-gray-200 transition-all duration-300 ${
    isRead ? "opacity-60 bg-white" : "bg-gray-100 hover:bg-white"
  }`;

  const buttonClasses = `px-2 py-1 text-white rounded-sm max-lg:w-full ${
    isRead ? "bg-gray-400" : "bg-sitePrimary"
  }`;

  return (
    <div className={containerClasses}>
      <NotificationTitle type={data.type} title={data.title} isRead={isRead} />

      <div className="text-gray-600 text-xs max-lg:text-center">
        {data.message}
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px] max-lg:w-full max-lg:flex-col max-lg:gap-2">
        <div className="flex items-center gap-2 max-lg:w-full max-lg:flex-col">
          <CustomButton
            title={t("Detayları Görüntüle")}
            containerStyles={buttonClasses}
            handleClick={handleShowDetails}
          />

          {!isRead && (
            <CustomButton
              title={t("Okundu Olarak İşaretle")}
              containerStyles="hover:text-sitePrimary"
              handleClick={handleMarkAsRead}
            />
          )}
        </div>

        <span className="text-gray-400">
          {convertDate(new Date(notification.created_at), fullLocale)}
        </span>
      </div>
    </div>
  );
}

export default React.memo(NotificationItem);
