"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import { MdAccessTime, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

interface WorkingHoursSectionProps {
  working_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string } | { closed: boolean };
  };
  onWorkingHoursChange: (day: string, timeType: 'open' | 'close' | 'closed', value: string | boolean) => void;
}

const DAYS = [
  { key: 'monday', label: 'Pazartesi' },
  { key: 'tuesday', label: 'Salı' },
  { key: 'wednesday', label: 'Çarşamba' },
  { key: 'thursday', label: 'Perşembe' },
  { key: 'friday', label: 'Cuma' },
  { key: 'saturday', label: 'Cumartesi' },
  { key: 'sunday', label: 'Pazar' },
];

export default function WorkingHoursSection({ working_hours, onWorkingHoursChange }: WorkingHoursSectionProps) {
  const handleTimeChange = (day: string, timeType: 'open' | 'close', value: string) => {
    onWorkingHoursChange(day, timeType, value);
  };

  const handleClosedToggle = (day: string, isClosed: boolean) => {
    if (isClosed) {
      onWorkingHoursChange(day, 'closed', true);
    } else {
      onWorkingHoursChange(day, 'open', '08:00');
      onWorkingHoursChange(day, 'close', '20:00');
    }
  };

  const isDayClosed = (day: string) => {
    const dayHours = working_hours[day as keyof typeof working_hours];
    return 'closed' in dayHours && dayHours.closed === true;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {DAYS.map(({ key, label }) => {
          const isClosed = isDayClosed(key);
          const dayHours = working_hours[key as keyof typeof working_hours];

          return (
            <div key={key} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                  <MdAccessTime className="text-sitePrimary" />
                  {label}
                </h4>
                <button
                  type="button"
                  onClick={() => handleClosedToggle(key, !isClosed)}
                  className="flex items-center gap-2 text-sm"
                >
                  {isClosed ? (
                    <MdCheckBox className="text-red-500" />
                  ) : (
                    <MdCheckBoxOutlineBlank className="text-gray-400" />
                  )}
                  <span className={isClosed ? "text-red-500" : "text-gray-600"}>
                    {isClosed ? "Kapalı" : "Açık"}
                  </span>
                </button>
              </div>

              {!isClosed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    label="Açılış Saati"
                    name={`${key}_open`}
                    type="time"
                    value={'open' in dayHours ? dayHours.open : '08:00'}
                    onChange={(e) => handleTimeChange(key, 'open', e.target.value)}
                    icon={<MdAccessTime />}
                  />
                  
                  <CustomInput
                    label="Kapanış Saati"
                    name={`${key}_close`}
                    type="time"
                    value={'close' in dayHours ? dayHours.close : '20:00'}
                    onChange={(e) => handleTimeChange(key, 'close', e.target.value)}
                    icon={<MdAccessTime />}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
