"use client";
import React, { InputHTMLAttributes, ReactNode, useCallback, useMemo } from "react";
import { MdCalendarToday } from "react-icons/md";
import { useTranslations } from "next-intl";

interface CustomDatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomDatePicker = React.memo(({
  id,
  name,
  label,
  value,
  onChange,
  required,
  autoComplete,
  inputMode,
  tabIndex,
  ...rest
}: CustomDatePickerProps) => {
  const inputId = useMemo(() => id || name, [id, name]);
  const isFloating = useMemo(() => value?.length > 0, [value]);
  const t = useTranslations();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  }, [onChange]);

  const handleDateInputClick = useCallback(() => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input && 'showPicker' in input) {
      (input as any).showPicker?.();
    }
  }, [inputId]);

  return (
    <div className="flex gap-1.5 rounded-md py-2 px-3.5 bg-[#f9fafb] items-center border border-[#d2d6d8] w-full">
      {/* Büyük takvim ikonu - tıklanabilir alan */}
      <button
        type="button"
        onClick={handleDateInputClick}
        className="text-3xl text-gray-400 hover:text-sitePrimary transition-colors cursor-pointer p-1 hover:bg-sitePrimary/10 rounded-md"
        title="Takvim aç"
      >
        <MdCalendarToday />
      </button>

      <label
        htmlFor={inputId}
        className="relative w-full bg-zinc-100 rounded-sm cursor-pointer"
        onClick={handleDateInputClick}
      >
        <input
          id={inputId}
          name={name}
          type="date"
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          tabIndex={tabIndex}
          className="w-full outline-none pt-[8px] pb-[4px] px-2 peer bg-[#f9fafb] cursor-pointer"
          value={value}
          onChange={handleChange}
          {...rest}
        />

        <span
          className={`absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 cursor-pointer text-[#9da4ae] text-sm transition-all
            peer-focus:text-[10px] peer-focus:text-[#4d5761] peer-focus:top-0.5 w-[calc(100%+30px)]
            ${
              isFloating
                ? "text-[10px] !text-[#4d5761] !-top-2 ltr:!-left-6 rtl:!-right-6"
                : ""
            }`}
        >
          <div className="flex justify-between items-center gap-2 w-full">
            <span className="pointer-events-none select-none px-2 py-1 bg-[#f9fafb] rounded">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          </div>
        </span>
      </label>
    </div>
  );
});

CustomDatePicker.displayName = 'CustomDatePicker';
