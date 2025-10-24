"use client";
import React, { useRef, useEffect, useCallback } from "react";
import DropdownHeader from "./DropdownHeader";
import DropdownFooter from "./DropdownFooter";
import CustomInput from "@/components/others/CustomInput";
import { IoSearchOutline } from "react-icons/io5";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
  searchValue?: string;
  onSearchChange?: (e: any) => void;
  onSearchFocus?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  isMobile = false,
  searchValue = "",
  onSearchChange,
  onSearchFocus,
}) => {
  const webDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const webDropdown = webDropdownRef.current;
    const mobileDropdown = mobileDropdownRef.current;
    if (
      (webDropdown && webDropdown.contains(event.target as Node)) ||
      (mobileDropdown && mobileDropdown.contains(event.target as Node))
    ) {
      // Dropdown'un içi, hiçbir şey yapma
      return;
    }
    onClose();
  }, [onClose]);

  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, handleClickOutside, handleEscape]);

  if (!isOpen) return null;

  return (
    <>
      {/* Web Dropdown */}
      <div
        className={`hidden lg:flex absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[400px] overflow-x-hidden overflow-y-auto left-0 z-10 ${className}`}
        ref={webDropdownRef}
      >
        {children}
      </div>

      {/* Mobil Modal */}
      <div className="lg:hidden fixed inset-0 flex items-center justify-center w-screen h-screen z-20">
        <div
          className="bg-white w-full h-full overflow-hidden"
          ref={mobileDropdownRef}
        >
          {/* Header */}
          <DropdownHeader title="Arama" onClose={onClose} />

          {/* Search Input - Mobilde modal içinde */}
          <div className="p-4 border-b border-gray-200">
            <CustomInput
              id="mobile-search"
              required
              type="text"
              name="mobile-search"
              autoComplete="search"
              inputMode="search"
              value={searchValue}
              icon={<IoSearchOutline />}
              label={"Uzman, Branş, Hastalık veya Kurum Ara"}
              onChange={onSearchChange}
              onFocus={onSearchFocus}
            />
          </div>

          {/* Content */}
          <div className="max-h-[calc(100vh-215px)] overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          <DropdownFooter onClose={onClose} />
        </div>
      </div>
    </>
  );
};

export default SearchDropdown;
