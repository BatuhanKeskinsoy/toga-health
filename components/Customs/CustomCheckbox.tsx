"use client";
import React from "react";
import { IoCheckmark, IoCheckmarkCircleOutline } from "react-icons/io5";

interface CustomCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "success" | "warning" | "error";
}

const CustomCheckbox = React.memo(({
  id,
  checked,
  onChange,
  label,
  disabled = false,
  required = false,
  className = "",
  size = "md",
  color = "primary",
}: CustomCheckboxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const iconSizes = {
    sm: "w-2.5 h-2.5",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const colorClasses = {
    primary: checked 
      ? 'bg-sitePrimary border-sitePrimary shadow-sm' 
      : 'border-gray-300 group-hover:border-sitePrimary/50',
    secondary: checked 
      ? 'bg-gray-600 border-gray-600 shadow-sm' 
      : 'border-gray-300 group-hover:border-gray-400',
    success: checked 
      ? 'bg-green-500 border-green-500 shadow-sm' 
      : 'border-gray-300 group-hover:border-green-400',
    warning: checked 
      ? 'bg-yellow-500 border-yellow-500 shadow-sm' 
      : 'border-gray-300 group-hover:border-yellow-400',
    error: checked 
      ? 'bg-red-500 border-red-500 shadow-sm' 
      : 'border-gray-300 group-hover:border-red-400',
  };

  const checkboxElement = (
    <div className="relative">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
      />
      <div className={`${sizeClasses[size]} rounded-sm border transition-all duration-200 flex items-center justify-center ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${colorClasses[color]}`}>
        {checked && (
          <IoCheckmark className="text-white" size={iconSizes[size]} />
        )}
      </div>
    </div>
  );

  if (label) {
    return (
      <label 
        htmlFor={id}
        className={`flex items-center gap-2 cursor-pointer group ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
      >
        {checkboxElement}
        <div className="flex-1">
          {label}
        </div>
      </label>
    );
  }

  return (
    <div className={className}>
      {checkboxElement}
    </div>
  );
});

CustomCheckbox.displayName = 'CustomCheckbox';

export default CustomCheckbox;
