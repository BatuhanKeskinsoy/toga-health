"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import { MdWork } from "react-icons/md";

interface WorkingHoursSectionProps {
  working_hours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  onWorkingHoursChange: (day: string, timeType: 'start' | 'end', value: string) => void;
}

export default function WorkingHoursSection({
  working_hours,
  onWorkingHoursChange,
}: WorkingHoursSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900 mb-4">Çalışma Saatleri</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(working_hours).map(([day, hours]) => {
          if (!hours) return null;
          return (
            <div key={day} className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-3 capitalize">{day}</h5>
              <div className="grid grid-cols-2 gap-2">
                <CustomInput
                  label="Başlangıç"
                  name={`${day}_start`}
                  type="time"
                  value={hours.start}
                  onChange={(e) => onWorkingHoursChange(day, "start", e.target.value)}
                  icon={<MdWork />}
                />
                <CustomInput
                  label="Bitiş"
                  name={`${day}_end`}
                  type="time"
                  value={hours.end}
                  onChange={(e) => onWorkingHoursChange(day, "end", e.target.value)}
                  icon={<MdWork />}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
