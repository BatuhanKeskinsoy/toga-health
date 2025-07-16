"use client";
import React from "react";

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  title?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value,
  onChange,
  disabled = false,
  title
}) => {
  return (
    <div className="px-3 flex flex-col items-start justify-center border-b border-gray-200 h-[100px]">
      {title && <h3 className="text-sm font-medium text-gray-900 mb-2">{title}</h3>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sitePrimary focus:border-sitePrimary disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default SearchInput; 