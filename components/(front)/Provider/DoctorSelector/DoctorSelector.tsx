"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { IoChevronDown } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { useTranslations } from "next-intl";
import { ProviderData } from "@/lib/types/provider/providerTypes";
import CustomInput from "@/components/Customs/CustomInput";

interface DoctorSelectorProps {
  doctors: ProviderData[];
  selectedDoctor: ProviderData | null;
  onDoctorSelect: (doctor: ProviderData) => void;
  isLoading?: boolean;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedDoctor,
  onDoctorSelect,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery(""); // Dropdown kapanınca arama temizlensin
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dropdown açıldığında arama input'una odaklan
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const searchInput = dropdownRef.current?.querySelector(
          "input[type='search']"
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }, [isOpen]);

  const handleDoctorSelect = (doctor: ProviderData) => {
    onDoctorSelect(doctor);
    setIsOpen(false);
    setSearchQuery(""); // Seçim yapıldığında arama temizlensin
  };

  // Seçili olmayan doktorları filtrele, arama yap ve alfabetik sırala
  const availableDoctors = useMemo(() => {
    let filtered = doctors.filter(
      (doctor) => (doctor as any).id !== (selectedDoctor as any)?.id
    );

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((doctor) => {
        const name = (doctor as any).name?.toLowerCase() || "";
        const department = (doctor as any).department?.toLowerCase() || "";
        const specialty =
          (doctor as any).doctor_info?.specialty?.name?.toLowerCase() || "";
        return (
          name.includes(query) ||
          department.includes(query) ||
          specialty.includes(query)
        );
      });
    }

    // Alfabetik sıralama (A-Z) - isme göre
    filtered.sort((a, b) => {
      const nameA = ((a as any).name || "").toLowerCase();
      const nameB = ((b as any).name || "").toLowerCase();
      return nameA.localeCompare(nameB, "tr");
    });

    return filtered;
  }, [doctors, selectedDoctor, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium text-gray-600">
          {t("Doktor Seçiniz")}
        </label>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full cursor-pointer bg-gray-100 hover:bg-sitePrimary/5 px-4 py-3 gap-2 transition-all duration-300 group"
        >
          <div className="flex items-center w-full gap-3 flex-1">
            {selectedDoctor ? (
              <>
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <ProfilePhoto
                    photo={(selectedDoctor as any).photo}
                    name={(selectedDoctor as any).name}
                    size={48}
                    fontSize={16}
                    responsiveSizes={{ desktop: 48, mobile: 48 }}
                    responsiveFontSizes={{ desktop: 16, mobile: 16 }}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <div className="flex items-center gap-1 font-medium">
                    <span className="truncate group-hover:text-sitePrimary transition-colors duration-200">
                      {(selectedDoctor as any).name}
                    </span>
                  </div>
                  {(selectedDoctor as any).department && (
                    <div className="opacity-70 text-xs line-clamp-2 group-hover:text-sitePrimary transition-colors duration-200">
                      {(selectedDoctor as any).department}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <span className="text-gray-500">{t("Doktor Seçiniz")}</span>
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
          <div className="absolute top-full w-full z-10 bg-white border border-gray-200 shadow-md overflow-x-hidden">
            {/* Arama Input'u */}
            <div className="bg-white border-b border-gray-200 p-3 w-full">
              <CustomInput
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label={t("Ara")}
                icon={<IoSearchOutline />}
              />
            </div>

            {availableDoctors.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                {searchQuery.trim() ? t("Sonuç Bulunamadı") : null}
              </div>
            ) : (
              <div className="flex flex-col w-full max-h-[275px] overflow-y-auto overflow-x-hidden">
                {availableDoctors.map((doctor) => (
                  <button
                    key={(doctor as any).id}
                    type="button"
                    onClick={() => handleDoctorSelect(doctor)}
                    className="w-full px-4 py-3 text-left hover:bg-sitePrimary/5 transition-colors duration-200 cursor-pointer border-b last:border-b-0 border-gray-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        <ProfilePhoto
                          photo={(doctor as any).photo}
                          name={(doctor as any).name}
                          size={48}
                          fontSize={16}
                          responsiveSizes={{ desktop: 48, mobile: 48 }}
                          responsiveFontSizes={{ desktop: 16, mobile: 16 }}
                        />
                      </div>

                      <div className="flex flex-col gap-1 flex-1 w-full">
                        <div className="flex items-center gap-1 font-medium">
                          <span className="truncate group-hover:text-sitePrimary transition-colors duration-200">
                            {(doctor as any).name}
                          </span>
                        </div>
                        {(doctor as any).department && (
                          <span className="opacity-70 text-xs line-clamp-2 max-w-full group-hover:text-sitePrimary transition-colors duration-200">
                            {(doctor as any).department}
                          </span>
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

export default DoctorSelector;
