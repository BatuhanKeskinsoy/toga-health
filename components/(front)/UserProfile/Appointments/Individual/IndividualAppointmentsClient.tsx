"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import type {
  IndividualAppointmentsData,
  IndividualAppointment,
} from "@/lib/types/appointments";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoHourglassOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";
import { convertDate } from "@/lib/functions/getConvertDate";

type ActiveTab = "upcoming" | "past";

const getAppointmentStart = (appointment: IndividualAppointment) => {
  const [year, month, day] = appointment.appointment_date
    .split("-")
    .map((value) => Number(value));
  const start = new Date(appointment.start_time);

  return new Date(
    year || 1970,
    (month || 1) - 1,
    day || 1,
    start.getHours(),
    start.getMinutes(),
    start.getSeconds()
  );
};

const getAppointmentEnd = (appointment: IndividualAppointment) => {
  const [year, month, day] = appointment.appointment_date
    .split("-")
    .map((value) => Number(value));
  const end = new Date(appointment.end_time);

  return new Date(
    year || 1970,
    (month || 1) - 1,
    day || 1,
    end.getHours(),
    end.getMinutes(),
    end.getSeconds()
  );
};

const statusStyles: Record<
  string,
  { className: string; translationKey: string }
> = {
  confirmed: {
    className: "bg-emerald-100 text-emerald-700",
    translationKey: "Onaylandı",
  },
  pending: {
    className: "bg-amber-100 text-amber-700",
    translationKey: "Beklemede",
  },
  cancelled: {
    className: "bg-rose-100 text-rose-700",
    translationKey: "İptal Edildi",
  },
  completed: {
    className: "bg-slate-200 text-slate-700",
    translationKey: "Tamamlandı",
  },
};

const IndividualAppointmentsClient: React.FC<IndividualAppointmentsData> = ({
  appointments,
  statistics,
  user_timezone,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<ActiveTab>("upcoming");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((appointmentId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(appointmentId)) {
        next.delete(appointmentId);
      } else {
        next.add(appointmentId);
      }
      return next;
    });
  }, []);

  const now = useMemo(() => new Date(), []);

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => getAppointmentStart(appointment) >= now)
      .sort(
        (a, b) =>
          getAppointmentStart(a).getTime() - getAppointmentStart(b).getTime()
      );
  }, [appointments, now]);

  const pastAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => getAppointmentStart(appointment) < now)
      .sort(
        (a, b) =>
          getAppointmentStart(b).getTime() - getAppointmentStart(a).getTime()
      );
  }, [appointments, now]);

  const displayedAppointments =
    activeTab === "upcoming" ? upcomingAppointments : pastAppointments;

  const emptyMessage =
    activeTab === "upcoming"
      ? t("Yaklaşan randevunuz bulunmuyor.")
      : t("Henüz tamamlanmış bir randevunuz bulunmuyor.");

  const statsCards = useMemo(
    () => [
      {
        label: t("Toplam"),
        value: statistics.total,
        icon: IoCalendarOutline,
        color: "text-blue-600",
      },
      {
        label: t("Yaklaşan"),
        value: statistics.upcoming,
        icon: IoTimeOutline,
        color: "text-sky-600",
      },
      {
        label: t("Onaylandı"),
        value: statistics.confirmed,
        icon: IoCheckmarkCircleOutline,
        color: "text-emerald-600",
      },
      {
        label: t("Beklemede"),
        value: statistics.pending,
        icon: IoHourglassOutline,
        color: "text-amber-600",
      },
      {
        label: t("Tamamlandı"),
        value: statistics.completed,
        icon: IoCheckmarkCircleOutline,
        color: "text-gray-600",
      },
      {
        label: t("İptal Edildi"),
        value: statistics.cancelled,
        icon: IoCloseCircleOutline,
        color: "text-red-600",
      },
    ],
    [statistics, t]
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone: user_timezone || undefined,
      }),
    [locale, user_timezone]
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: user_timezone || undefined,
      }),
    [locale, user_timezone]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-md shadow-gray-200">
        <div className="flex flex-col gap-3 md:flex-row items-center md:justify-between">
          <div className="flex flex-col items-center md:items-start gap-1">
            <h1 className="text-xl font-bold text-gray-900">
              {t("Randevularım")}
            </h1>
            <p className="text-sm text-gray-500">
              {t("Zaman dilimi")}:{" "}
              <span className="font-semibold text-gray-700">
                {user_timezone || "UTC"}
              </span>
            </p>
          </div>
          <div className="flex overflow-hidden rounded-full border border-gray-200 bg-gray-100 p-1 text-sm font-medium text-gray-600">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-full px-4 py-1.5 transition ${
                activeTab === "upcoming"
                  ? "bg-white text-gray-900 shadow-sm shadow-gray-200"
                  : "hover:text-gray-900"
              }`}
            >
              {t("Yaklaşan Randevular")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`rounded-full px-4 py-1.5 transition ${
                activeTab === "past"
                  ? "bg-white text-gray-900 shadow-sm shadow-gray-200"
                  : "hover:text-gray-900"
              }`}
            >
              {t("Geçmiş Randevular")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 w-full">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={`${card.label}-${index}`}
              className="flex items-center gap-0.5 p-3 rounded-md bg-white border border-gray-200 hover:shadow-md shadow-gray-200 transition-all duration-200"
            >
              <div className={`p-1.5 rounded-lg bg-gray-50 ${card.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-xs text-gray-600 font-medium uppercase flex-1">
                {card.label}
              </p>
              <p className="text-lg font-bold text-gray-900">{card.value}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        {displayedAppointments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {displayedAppointments.map((appointment) => {
              const start = getAppointmentStart(appointment);
              const end = getAppointmentEnd(appointment);
              const statusMeta =
                statusStyles[appointment.status] ?? statusStyles.confirmed;
              const isExpanded = expandedIds.has(appointment.appointment_id);

              return (
                <li key={appointment.appointment_id}>
                  <button
                    type="button"
                    onClick={() => toggleExpanded(appointment.appointment_id)}
                    className="group flex w-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm shadow-gray-100 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sitePrimary/40"
                  >
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          <span>{appointment.provider.name}</span>
                          <span className="text-gray-300">•</span>
                          <span>{t("Randevu")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                          <span>{dateFormatter.format(start)}</span>
                          <span className="text-gray-300">•</span>
                          <span>
                            {timeFormatter.format(start)} –{" "}
                            {timeFormatter.format(end)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition group-hover:scale-[1.03] ${statusMeta.className}`}
                      >
                        {t(statusMeta.translationKey)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-400">
                        <span>{appointment.duration_minutes} dk</span>
                        <span className="text-gray-300">•</span>
                        <span>
                          {appointment.location_type === "online"
                            ? t("Online")
                            : appointment.location_type === "office"
                            ? t("Ofis")
                            : appointment.location_type || t("Belirtilmemiş")}
                        </span>
                        {appointment.price && appointment.currency && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>
                              {appointment.price} {appointment.currency}
                            </span>
                          </>
                        )}
                      </div>
                      {appointment.user_address?.name && (
                        <p className="text-xs text-gray-500">
                          {appointment.user_address.name}
                        </p>
                      )}
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded
                          ? "opacity-100"
                          : "h-0 opacity-0"
                      }`}
                    >
                      <div className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 shadow-inner">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase text-gray-500">
                              {t("Randevu Sahibi")}
                            </span>
                            <span>{appointment.user.name}</span>
                            {appointment.user.email && (
                              <span className="text-xs text-gray-500">
                                {appointment.user.email}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase text-gray-500">
                              {t("İletişim")}
                            </span>
                            <span>
                              {appointment.phone_number ||
                                appointment.user.phone_number ||
                                t("Belirtilmemiş")}
                            </span>
                          </div>
                        </div>

                        {appointment.status === "cancelled" && (
                          <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                            {appointment.cancellation_reason && (
                              <p className="mt-1">
                                <span className="font-semibold">{t("İptal Nedeni")}: </span>
                                {appointment.cancellation_reason}
                              </p>
                            )}
                            {appointment.cancelled_at && (
                              <p className="mt-1">
                                <span className="font-semibold">{t("İptal Tarihi")}: </span>
                                {convertDate(new Date(appointment.cancelled_at), locale)}
                              </p>
                            )}
                          </div>
                        )}

                        {appointment.description && (
                          <div className="mt-3 rounded-lg bg-white p-3 text-sm text-gray-700 shadow-sm">
                            {appointment.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default IndividualAppointmentsClient;
