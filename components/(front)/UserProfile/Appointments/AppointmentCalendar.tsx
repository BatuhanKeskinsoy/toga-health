"use client";
import React, { useMemo, useCallback, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import type { Appointment } from "@/lib/types/appointments/provider";
import { useLocale } from "next-intl";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onEventClick?: (appointment: Appointment) => void;
  onDateClick?: (date: Date) => void;
  initialView?: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onEventClick,
  onDateClick,
  initialView = "dayGridMonth",
}) => {
  const locale = useLocale();
  // SSR-safe: İlk render'da window kontrolü yap
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mobilde direkt "Gün" görünümünde açılmalı
  const finalInitialView = useMemo(() => {
    return isMobile ? "timeGridDay" : initialView;
  }, [isMobile, initialView]);

  const events: EventInput[] = useMemo(() => {
    return appointments.map((appointment) => {
      // appointment_date'den doğru tarihi al, start_time ve end_time'dan saat bilgisini al
      // start_time ve end_time UTC formatında geliyor, sadece saat bilgisini al
      const startTime = new Date(appointment.start_time);
      const endTime = new Date(appointment.end_time);

      // appointment_date string'ini parse et (YYYY-MM-DD formatında)
      const [year, month, day] = appointment.appointment_date
        .split("-")
        .map(Number);

      // Doğru tarih ve saat ile Date objeleri oluştur (local timezone)
      const correctStartTime = new Date(
        year,
        month - 1,
        day,
        startTime.getUTCHours(),
        startTime.getUTCMinutes(),
        startTime.getUTCSeconds()
      );
      const correctEndTime = new Date(
        year,
        month - 1,
        day,
        endTime.getUTCHours(),
        endTime.getUTCMinutes(),
        endTime.getUTCSeconds()
      );

      const getEventColor = () => {
        switch (appointment.status) {
          case "confirmed":
            return "#10b981"; // green
          case "pending":
            return "#f59e0b"; // amber
          case "completed":
            return "#6b7280"; // gray
          case "cancelled":
            return "#ef4444"; // red
          default:
            return "#3b82f6"; // blue
        }
      };

      return {
        id: appointment.id.toString(),
        title:
          appointment.title ||
          `${appointment.user.name} - ${
            appointment.service?.service_name || "Randevu"
          }`,
        start: correctStartTime,
        end: correctEndTime,
        backgroundColor: getEventColor(),
        borderColor: getEventColor(),
        textColor: "#ffffff",
        extendedProps: {
          appointment,
        },
      };
    });
  }, [appointments]);

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const appointment = info.event.extendedProps.appointment as Appointment;
      if (appointment && onEventClick) {
        onEventClick(appointment);
      }
    },
    [onEventClick]
  );

  const handleDateClick = useCallback(
    (info: any) => {
      if (onDateClick && info.date) {
        onDateClick(info.date);
      }
    },
    [onDateClick]
  );

  return (
    <div className="w-full bg-white rounded-md border border-gray-200">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={finalInitialView}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: isMobile
            ? "timeGridDay"
            : "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        locale={locale}
        firstDay={1}
        height="auto"
        eventDisplay="block"
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot={false}
        weekends={true}
        editable={false}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        moreLinkClick="popover"
        eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
        buttonText={{
          today: "Bugün",
          month: "Ay",
          week: "Hafta",
          day: "Gün",
        }}
        dayHeaderFormat={{
          weekday: isMobile ? "short" : "long",
        }}
        titleFormat={{
          year: "numeric",
          month: "long",
        }}
      />
    </div>
  );
};

export default React.memo(AppointmentCalendar);
