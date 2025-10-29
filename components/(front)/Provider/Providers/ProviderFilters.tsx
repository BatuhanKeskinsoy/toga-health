"use client";

import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

interface ProviderFiltersProps {
  sortBy: "rating" | "name" | "created_at";
  sortOrder: "asc" | "desc";
  providerType: "corporate" | "doctor" | null;
  categoryType?: "diseases" | "branches" | "treatments-services";
  onSortChange: (
    sortBy: "rating" | "name" | "created_at",
    sortOrder: "asc" | "desc"
  ) => void;
  onProviderTypeChange: (providerType: "corporate" | "doctor" | null) => void;
}

export default function ProviderFilters({
  sortBy,
  sortOrder,
  providerType,
  categoryType,
  onSortChange,
  onProviderTypeChange,
}: ProviderFiltersProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef<HTMLDivElement>(null);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        providerRef.current &&
        !providerRef.current.contains(event.target as Node)
      ) {
        setIsProviderOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: "created_at-desc", label: "En Yeni" },
    { value: "created_at-asc", label: "En Eski" },
    { value: "rating-desc", label: "En Yüksek Puan" },
    { value: "rating-asc", label: "En Düşük Puan" },
    { value: "name-asc", label: "A-Z" },
    { value: "name-desc", label: "Z-A" },
  ];

  // Branches (uzmanlik-alanlari) sayfasında sadece doktor gösterilmeli
  const providerOptions = categoryType === "branches"
    ? [
        { value: "all", label: "Tümü" },
        { value: "doctor", label: "Doktor" },
      ]
    : [
        { value: "all", label: "Tümü" },
        { value: "doctor", label: "Doktor" },
        { value: "corporate", label: "Hastane" },
      ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(
      (opt) => opt.value === `${sortBy}-${sortOrder}`
    );
    return option?.label || "En Yeni";
  };

  const getCurrentProviderLabel = () => {
    const option = providerOptions.find(
      (opt) => opt.value === (providerType || "all")
    );
    return option?.label || "Tümü";
  };

  const handleSortSelect = (value: string) => {
    const [newSortBy, newSortOrder] = value.split("-") as [
      "rating" | "name" | "created_at",
      "asc" | "desc"
    ];
    onSortChange(newSortBy, newSortOrder);
    setIsSortOpen(false);
  };

  const handleProviderSelect = (value: string) => {
    onProviderTypeChange(
      value === "all" ? null : (value as "corporate" | "doctor")
    );
    setIsProviderOpen(false);
  };

  return (
    <div className="flex items-center gap-2 min-w-max max-lg:mb-2">
      {/* Sıralama Dropdown */}
      <div className="relative max-lg:w-full" ref={sortRef}>
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="flex items-center justify-between lg:min-w-[170px] max-lg:w-full gap-6 bg-white border border-gray-200 px-4 py-3 rounded-md hover:border-sitePrimary transition-all duration-300 cursor-pointer"
        >
          <div className="flex flex-col items-start">
            <span className="text-[11px] opacity-80">Sıralama</span>
            <span className="text-xs font-medium text-sitePrimary">
              {getCurrentSortLabel()}
            </span>
          </div>
          <div className="flex items-center justify-center size-8 bg-gray-100 rounded-md">
            <IoChevronDown size={16} className="text-gray-500" />
          </div>
        </button>

        {isSortOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
                  option.value === `${sortBy}-${sortOrder}`
                    ? "bg-sitePrimary/10 text-sitePrimary"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Provider Type Dropdown */}
      <div className="relative max-lg:w-full" ref={providerRef}>
        <button
          onClick={() => setIsProviderOpen(!isProviderOpen)}
          className="flex items-center justify-between lg:min-w-[170px] max-lg:w-full gap-6 bg-white border border-gray-200 px-4 py-3 rounded-md hover:border-sitePrimary transition-all duration-300 cursor-pointer"
        >
          <div className="flex flex-col items-start">
            <span className="text-[11px] opacity-80">Sağlayıcı</span>
            <span className="text-xs font-medium text-sitePrimary">
              {getCurrentProviderLabel()}
            </span>
          </div>
          <div className="flex items-center justify-center size-8 bg-gray-100 rounded-md">
            <IoChevronDown size={16} className="text-gray-500" />
          </div>
        </button>

        {isProviderOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
            {providerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleProviderSelect(option.value)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200 first:rounded-t-md last:rounded-b-md ${
                  option.value === (providerType || "all")
                    ? "bg-sitePrimary/10 text-sitePrimary"
                    : "text-gray-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
