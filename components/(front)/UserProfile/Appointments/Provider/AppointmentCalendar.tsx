"use client";
import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import type { Appointment } from "@/lib/types/appointments/provider";
import { useLocale, useTranslations } from "next-intl";

const buildDateFromAppointment = (appointment: Appointment, key: "start_time" | "end_time") => {
  const timeValue = appointment[key];
  const dateValue = appointment.appointment_date;

  if (timeValue && timeValue.includes("T")) {
    return new Date(timeValue);
  }

  if (!dateValue) {
    return new Date(timeValue || "");
  }

  const [year, month, day] = dateValue.split("-").map((value) => Number(value));
  const [hours = 0, minutes = 0, seconds = 0] = (timeValue || "0:0:0")
    .split(":")
    .map((value) => Number(value));

  return new Date(year || 1970, (month || 1) - 1, day || 1, hours, minutes, seconds);
};


interface AppointmentCalendarProps {
  appointments: Appointment[];
  onEventClick?: (appointment: Appointment) => void;
  onDateClick?: (date: Date, time?: string) => void;
  initialView?: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onEventClick,
  onDateClick,
  initialView = "dayGridMonth",
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const calendarRef = useRef<FullCalendar>(null);
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  
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

  // Slot hover event listener'larını ekle (sadece desktop'ta)
  useEffect(() => {
    // Mobilde hover tooltip gösterme
    if (isMobile) return;

    const calendarEl = calendarRef.current;
    if (!calendarEl) return;

    // FullCalendar'ın DOM elementini bul
    const calendarElement = (calendarEl as any).el || document.querySelector('.fc');
    if (!calendarElement) return;

    const handleSlotMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const slotElement = target.closest('.fc-timegrid-slot');
      if (!slotElement) return;

      // Slot'tan saat bilgisini al
      const slotLabel = slotElement.querySelector('.fc-timegrid-slot-label-cushion');
      if (!slotLabel) {
        // Eğer label yoksa, slot'un data-time attribute'unu kullan
        const timeAttr = slotElement.getAttribute('data-time');
        if (!timeAttr) return;
        
        const [hours, minutes] = timeAttr.split(':').map(Number);
        const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        
        const endDate = new Date();
        endDate.setHours(hours, minutes + 30, 0, 0);
        const endHours = String(endDate.getHours()).padStart(2, '0');
        const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
        const endTime = `${endHours}:${endMinutes}`;

        setHoveredTime(`${startTime} - ${endTime}`);
        setTooltipPosition({
          x: e.clientX,
          y: e.clientY,
        });
        return;
      }

      const timeText = slotLabel.textContent?.trim();
      if (!timeText) return;

      // Saat aralığını hesapla (30 dakika)
      const [hours, minutes] = timeText.split(':').map(Number);
      const startTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      const endDate = new Date();
      endDate.setHours(hours, minutes + 30, 0, 0);
      const endHours = String(endDate.getHours()).padStart(2, '0');
      const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
      const endTime = `${endHours}:${endMinutes}`;

      setHoveredTime(`${startTime} - ${endTime}`);
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleSlotMouseLeave = () => {
      setHoveredTime(null);
      setTooltipPosition(null);
    };

    // Event delegation kullanarak tüm slot'lara event listener ekle
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.fc-timegrid-slot')) {
        handleSlotMouseEnter(e);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.fc-timegrid-slot')) {
        handleSlotMouseLeave();
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.fc-timegrid-slot') && hoveredTime) {
        setTooltipPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    calendarElement.addEventListener('mouseover', handleMouseOver);
    calendarElement.addEventListener('mouseout', handleMouseOut);
    calendarElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      calendarElement.removeEventListener('mouseover', handleMouseOver);
      calendarElement.removeEventListener('mouseout', handleMouseOut);
      calendarElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [appointments, isMobile, hoveredTime]);

  // Mobilde direkt "Gün" görünümünde açılmalı
  const finalInitialView = useMemo(() => {
    return isMobile ? "timeGridDay" : initialView;
  }, [isMobile, initialView]);

  const events: EventInput[] = useMemo(() => {
    return appointments.map((appointment) => {
      const startTime = buildDateFromAppointment(appointment, "start_time");
      const endTime = buildDateFromAppointment(appointment, "end_time");

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

      // Manuel randevu ise (user null) title'dan kullanıcı adını göster
      const getUserDisplayName = () => {
        if (appointment.user) {
          return appointment.user.name;
        }
        // Manuel randevu ise title'dan hasta adını al
        return appointment.title || t("Manuel Randevu");
      };

      return {
        id: appointment.id.toString(),
        title:
          appointment.title ||
          `${getUserDisplayName()} - ${
            appointment.service?.service_name || "Randevu"
          }`,
        start: startTime,
        end: endTime,
        backgroundColor: getEventColor(),
        borderColor: getEventColor(),
        textColor: "#ffffff",
        extendedProps: {
          appointment,
        },
      };
    });
  }, [appointments, t]);

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
        // Saat bilgisini al (HH:MM formatında)
        const hours = String(info.date.getHours()).padStart(2, "0");
        const minutes = String(info.date.getMinutes()).padStart(2, "0");
        const time = `${hours}:${minutes}`;
        onDateClick(info.date, time);
      }
    },
    [onDateClick]
  );

  const renderDayHeader = useCallback(
    (args: { date: Date; view: { type: string } }) => {
      const weekday = args.date.toLocaleDateString(locale, {
        weekday: isMobile ? "short" : "long",
      });

      if (args.view.type === "dayGridMonth") {
        return weekday;
      }

      const dayNumber = args.date.toLocaleDateString(locale, {
        day: "numeric",
      });

      return `${weekday} ${dayNumber}`;
    },
    [isMobile, locale]
  );

  return (
    <div className="w-full bg-white rounded-md border border-gray-200 relative">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={finalInitialView}
        headerToolbar={{
          left: "prev,next today",
          center: isMobile ? "" : "title",
          right: isMobile ? "title" : "dayGridMonth,timeGridWeek,timeGridDay",
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
          today: t("Bugün"),
          month: t("Ay"),
          week: t("Hafta"),
          day: t("Gün"),
        }}
        dayHeaderContent={renderDayHeader}
        titleFormat={{
          year: "numeric",
          month: "long",
        }}
      />
      {/* Hover tooltip (sadece desktop'ta) */}
      {!isMobile && hoveredTime && tooltipPosition && (
        <div
          className="fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md shadow-lg pointer-events-none"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 10}px`,
          }}
        >
          {hoveredTime}
        </div>
      )}
    </div>
  );
};

export default React.memo(AppointmentCalendar);
