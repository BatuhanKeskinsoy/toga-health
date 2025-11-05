"use client";
import React, { useMemo, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventInput, EventClickArg } from "@fullcalendar/core";
import type { Appointment } from "@/lib/types/appointments/provider";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

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
  const events: EventInput[] = useMemo(() => {
    return appointments.map((appointment) => {
      const startTime = new Date(appointment.start_time);
      const endTime = new Date(appointment.end_time);

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
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
      <div className="min-w-full">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={initialView}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          locale="tr"
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
            weekday: "long",
          }}
          titleFormat={{
            year: "numeric",
            month: "long",
          }}
        />
      </div>
    </div>
  );
};

export default React.memo(AppointmentCalendar);