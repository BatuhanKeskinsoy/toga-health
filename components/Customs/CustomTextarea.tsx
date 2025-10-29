"use client";
import React, { useMemo } from "react";

interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelSlot?: React.ReactNode;
}

const CustomTextarea = React.memo(
  ({
    id,
    name,
    label,
    value,
    onChange,
    required,
    rows = 4,
    labelSlot,
    ...rest
  }: CustomTextareaProps) => {
    const textareaId = useMemo(() => id || name, [id, name]);
    const isFloating = useMemo(() => value?.length > 0, [value]);

    return (
      <div className="flex gap-1.5 rounded-md py-2 px-3.5 bg-[#f9fafb] items-start border border-[#d2d6d8] w-full min-h-[80px]">
        <label
          htmlFor={textareaId}
          className="relative w-full bg-[#f9fafb] rounded-sm"
        >
          <textarea
            id={textareaId}
            name={name}
            required={required}
            className="w-full outline-none pt-[8px] pb-[4px] px-2 peer bg-[#f9fafb] resize-y min-h-[100px]"
            value={value}
            onChange={onChange}
            rows={rows}
            {...rest}
          />

          <span
            className={`absolute ltr:left-0 rtl:right-0 top-2 cursor-text text-[#9da4ae] text-sm transition-all
    peer-focus:text-[10px] peer-focus:text-[#4d5761] peer-focus:-top-1
    ${
      isFloating
        ? `text-[10px] !text-[#4d5761] !-top-3 ltr:!-left-0 rtl:!-right-0`
        : ""
    }`}
          >
            <div className="flex justify-between items-center gap-2 w-full">
              <span className="pointer-events-none select-none px-1.5 bg-[#f9fafb]">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </span>
              {labelSlot && (
                <div className="flex bg-[#f9fafb] p-1.5">{labelSlot}</div>
              )}
            </div>
          </span>
        </label>
      </div>
    );
  }
);

CustomTextarea.displayName = "CustomTextarea";

export default CustomTextarea;

