"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  IoChevronDown,
  IoPersonCircle,
  IoSchoolOutline,
  IoSearch,
} from "react-icons/io5";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { CustomInput } from "@/components/others/CustomInput";

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  photo?: string;
  rating?: number;
  experience?: string;
  isAvailable?: boolean;
}

interface SpecialistSelectorProps {
  specialists: Specialist[];
  selectedSpecialist: Specialist | null;
  onSpecialistSelect: (specialist: Specialist) => void;
  isLoading?: boolean;
}

const SpecialistSelector: React.FC<SpecialistSelectorProps> = ({
  specialists,
  selectedSpecialist,
  onSpecialistSelect,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSpecialistSelect = (specialist: Specialist) => {
    onSpecialistSelect(specialist);
    setIsOpen(false);
    setSearchTerm("");
  };

  // Seçili olmayan uzmanları filtrele ve arama yap
  const availableSpecialists = specialists
    .filter((specialist) => specialist.id !== selectedSpecialist?.id)
    .filter((specialist) =>
      specialist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      specialist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium text-gray-600">
          Uzman Seçiniz
        </label>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full cursor-pointer bg-gray-100 hover:bg-sitePrimary/10 px-4 py-3 transition-all duration-300"
        >
          <div className="flex items-center w-full gap-3 flex-1">
            {selectedSpecialist ? (
              <>
                {selectedSpecialist.photo && (
                  <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <ProfilePhoto photo={selectedSpecialist.photo} />
                  </div>
                )}
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <div className="flex items-center gap-2 font-medium">
                    <IoSchoolOutline className="text-gray-500" />
                    <span className="truncate">{selectedSpecialist.name}</span>
                  </div>
                  <div className="opacity-70 text-xs line-clamp-2">
                    {selectedSpecialist.specialty}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <IoSchoolOutline className="text-gray-500" />
                </div>
                <span className="text-gray-500">Uzman seçiniz</span>
              </div>
            )}
          </div>

          <IoChevronDown
            className={`text-gray-400 text-xl transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full w-full z-10 bg-white border border-gray-200 shadow-md max-h-80 overflow-y-auto overflow-x-hidden">
            <div className="p-3 border-b border-gray-200">
              <CustomInput
                type="text"
                label="Uzman ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IoSearch />}
                placeholder=""
              />
            </div>
            
            {availableSpecialists.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                {searchTerm ? "Arama sonucu bulunamadı" : "Başka uzman bulunamadı"}
              </div>
            ) : (
              <div className="flex flex-col">
                {availableSpecialists.map((specialist) => (
                  <button
                    key={specialist.id}
                    type="button"
                    onClick={() => handleSpecialistSelect(specialist)}
                    className="w-full px-4 py-3 text-left hover:bg-sitePrimary/10 transition-colors duration-200 cursor-pointer border-b last:border-b-0 border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      {specialist.photo ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <ProfilePhoto photo={specialist.photo} />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <IoPersonCircle className="text-gray-500" />
                        </div>
                      )}
                      <div className="flex justify-between items-start gap-1 w-full">
                        <div className="flex flex-col gap-1 flex-1 min-w-max w-full">
                          <div className="flex items-center gap-2 font-medium">
                            <IoSchoolOutline className="text-gray-500" />
                            <span className="truncate">{specialist.name}</span>
                          </div>
                          <span className="opacity-70 text-xs line-clamp-2 max-w-full break-words">
                            {specialist.specialty}
                          </span>
                        </div>
                        {specialist.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-lg">★</span>
                            <span className="text-xs text-gray-600">
                              {specialist.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialistSelector;
