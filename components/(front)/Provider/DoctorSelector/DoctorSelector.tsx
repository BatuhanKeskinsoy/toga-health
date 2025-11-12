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
  compact?: boolean;
}

const DoctorSelector: React.FC<DoctorSelectorProps> = ({
  doctors,
  selectedDoctor,
  onDoctorSelect,
  isLoading = false,
  compact = false,
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
      <div className={`flex ${compact ? 'flex-row items-center' : 'flex-col'} w-full gap-2`}>
        {!compact && (
          <label className="text-sm font-medium text-gray-600">
            {t("Doktor Seçiniz")}
          </label>
        )}

        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-between w-full cursor-pointer bg-gray-100 hover:bg-sitePrimary/5 gap-2 transition-all duration-300 group ${compact ? 'px-2 py-1.5 rounded text-xs' : 'px-4 py-3'}`}
        >
          <div className="flex items-center w-full gap-3 flex-1">
            {selectedDoctor ? (
              <>
                <div className={`relative ${compact ? 'w-6 h-6' : 'w-12 h-12'} rounded-md overflow-hidden flex-shrink-0`}>
                  <ProfilePhoto
                    photo={(selectedDoctor as any).photo}
                    name={(selectedDoctor as any).name}
                    size={compact ? 24 : 48}
                    fontSize={compact ? 10 : 16}
                    responsiveSizes={{ desktop: compact ? 24 : 48, mobile: compact ? 24 : 48 }}
                    responsiveFontSizes={{ desktop: compact ? 10 : 16, mobile: compact ? 10 : 16 }}
                  />
                </div>
                {compact ? (
                  <span className="truncate text-xs group-hover:text-sitePrimary transition-colors duration-200">
                    {`${(selectedDoctor as any).expert_title ? `${(selectedDoctor as any).expert_title} ` : ""}`}{(selectedDoctor as any).name}
                  </span>
                ) : (
                  <div className="flex flex-col gap-1 flex-1 w-full">
                    <div className="flex items-center gap-1 font-medium">
                      <span className="truncate group-hover:text-sitePrimary transition-colors duration-200">
                      {`${(selectedDoctor as any).expert_title ? `${(selectedDoctor as any).expert_title} ` : ""}`}{(selectedDoctor as any).name}
                      </span>
                    </div>
                    {(selectedDoctor as any).department && (
                      <div className="opacity-70 text-xs line-clamp-2 group-hover:text-sitePrimary transition-colors duration-200">
                        {(selectedDoctor as any).department}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <span className={`text-gray-500 ${compact ? 'text-xs' : ''}`}>{t("Doktor Seçiniz")}</span>
              </div>
            )}
          </div>

          <IoChevronDown
            className={`text-gray-400 ${compact ? 'text-sm' : 'text-xl'} transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {isOpen && (
          <div className={`absolute top-full w-full z-10 bg-white border border-gray-200 shadow-md overflow-x-hidden ${compact ? 'mt-1' : ''}`}>
            {/* Arama Input'u */}
            <div className={`bg-white border-b border-gray-200 w-full ${compact ? 'p-2' : 'p-3'}`}>
              <CustomInput
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label={t("Ara")}
                icon={<IoSearchOutline />}
              />
            </div>

            {availableDoctors.length === 0 ? (
              <div className={`text-gray-500 text-center ${compact ? 'px-2 py-2 text-xs' : 'px-4 py-3'}`}>
                {searchQuery.trim() ? t("Sonuç Bulunamadı") : null}
              </div>
            ) : (
              <div className={`flex flex-col w-full overflow-y-auto overflow-x-hidden ${compact ? 'max-h-[200px]' : 'max-h-[275px]'}`}>
                {availableDoctors.map((doctor) => (
                  <button
                    key={(doctor as any).id}
                    type="button"
                    onClick={() => handleDoctorSelect(doctor)}
                    className={`w-full text-left hover:bg-sitePrimary/5 transition-colors duration-200 cursor-pointer border-b last:border-b-0 border-gray-200 group ${compact ? 'px-2 py-2' : 'px-4 py-3'}`}
                  >
                    <div className={`flex items-start ${compact ? 'gap-2' : 'gap-3'}`}>
                      <div className={`relative rounded-md overflow-hidden flex-shrink-0 ${compact ? 'w-8 h-8' : 'w-12 h-12'}`}>
                        <ProfilePhoto
                          photo={(doctor as any).photo}
                          name={(doctor as any).name}
                          size={compact ? 32 : 48}
                          fontSize={compact ? 10 : 16}
                          responsiveSizes={{ desktop: compact ? 32 : 48, mobile: compact ? 32 : 48 }}
                          responsiveFontSizes={{ desktop: compact ? 10 : 16, mobile: compact ? 10 : 16 }}
                        />
                      </div>

                      <div className={`flex flex-col flex-1 w-full ${compact ? 'gap-0.5' : 'gap-1'}`}>
                        <div className="flex items-center gap-1 font-medium">
                          <span className={`truncate group-hover:text-sitePrimary transition-colors duration-200 ${compact ? 'text-xs' : ''}`}>
                            {`${(doctor as any).expert_title ? `${(doctor as any).expert_title} ` : ""}`}{(doctor as any).name}
                          </span>
                        </div>
                        {(doctor as any).department && (
                          <span className={`opacity-70 line-clamp-2 max-w-full group-hover:text-sitePrimary transition-colors duration-200 ${compact ? 'text-[10px]' : 'text-xs'}`}>
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
