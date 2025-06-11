// components/shared/FloatingInput.tsx
import { InputHTMLAttributes, ReactNode } from "react";

interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  icon?: ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelSlot?: ReactNode;
}

export function CustomInput({
  id,
  name,
  type = "text",
  label,
  icon,
  value,
  onChange,
  required,
  autoComplete,
  inputMode,
  tabIndex,
  labelSlot,
  ...rest
}: CustomInputProps) {
  const inputId = id || name;
  const isFloating = value?.length > 0;

  return (
    <div className="flex gap-1.5 rounded-[12px] py-2 px-3.5 bg-[#f9fafb] items-center border border-[#d2d6d8]">
      {icon && <span className="text-2xl min-w-6 text-gray-400">{icon}</span>}

      <label
        htmlFor={inputId}
        className="relative w-full bg-zinc-100 rounded-sm"
      >
        <input
          id={inputId}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          tabIndex={tabIndex}
          className="w-full outline-none pt-[8px] pb-[4px] px-2 peer bg-[#f9fafb]"
          value={value}
          onChange={onChange}
          {...rest}
        />

        <span
          className={`absolute ltr:left-0 rtl:right-0 top-1/2 -translate-y-1/2 cursor-text text-[#9da4ae] text-sm transition-all
    peer-focus:text-[10px] peer-focus:text-[#4d5761] peer-focus:top-0.5 w-[calc(100%+30px)]
    ${
      isFloating
        ? "text-[10px] !text-[#4d5761] !-top-2 ltr:!-left-6 rtl:!-right-6"
        : ""
    }`}
        >
          <div className="flex justify-between items-center gap-2 w-full">
            <span className="pointer-events-none select-none px-1.5 bg-[#f9fafb]">
              {label}
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
