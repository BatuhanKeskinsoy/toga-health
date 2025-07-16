"use client";
import React, { useRef, useEffect, useCallback } from "react";
import DropdownHeader from "./DropdownHeader";
import DropdownFooter from "./DropdownFooter";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  isMobile?: boolean;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  isMobile = false,
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
      if (isMobile) {
        document.body.style.overflow = "hidden";
      }
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, isMobile, handleClickOutside, handleEscape]);

  if (!isOpen) return null;

  return (
    <>
      {/* Web Dropdown */}
      <div
        className={`hidden lg:flex absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-[400px] overflow-hidden left-0 z-50 ${className}`}
        ref={webDropdownRef}
      >
        {children}
      </div>

      {/* Mobil Modal */}
      <div className="lg:hidden fixed inset-0 flex items-center justify-center w-screen h-screen z-10">
        <div
          className="bg-white w-full h-full overflow-hidden"
          ref={mobileDropdownRef}
        >
          {/* Header */}
          <DropdownHeader title="Arama" onClose={onClose} />

          {/* Content */}
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto">
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
