"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  IoChevronDown,
  IoSearchOutline,
  IoMedicalOutline,
} from "react-icons/io5";
import { Service } from "@/lib/types/appointments";
import { useTranslations } from "next-intl";
import CustomInput from "@/components/Customs/CustomInput";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
  isLoading?: boolean;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedService,
  onServiceSelect,
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

  const handleServiceSelect = (service: Service) => {
    onServiceSelect(service);
    setIsOpen(false);
    setSearchQuery(""); // Seçim yapıldığında arama temizlensin
  };

  // Seçili olmayan servisleri filtrele, arama yap ve alfabetik sırala
  const availableServices = useMemo(() => {
    let filtered = services.filter(
      (service) => service.service_id !== selectedService?.service_id
    );

    // Arama filtresi
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((service) => {
        const name = service.name?.toLowerCase() || "";
        const description = service.description?.toLowerCase() || "";
        const type = service.type === "disease" ? "hastalık" : "tedavi";
        return (
          name.includes(query) ||
          description.includes(query) ||
          type.includes(query.toLowerCase())
        );
      });
    }

    // Alfabetik sıralama (A-Z) - isme göre
    filtered.sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return nameA.localeCompare(nameB, "tr");
    });

    return filtered;
  }, [services, selectedService, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative" ref={dropdownRef}>
      <div className="flex flex-col w-full gap-2">
        <label className="text-sm font-medium text-gray-600">
          {t("Hizmet Seçiniz")}
        </label>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full cursor-pointer bg-gray-100 hover:bg-sitePrimary/5 px-4 py-3 gap-2 transition-all duration-300 group"
        >
          <div className="flex items-center w-full gap-3 flex-1">
            {selectedService ? (
              <>
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100 border border-gray-200 group-hover:bg-sitePrimary/5 group-hover:border-sitePrimary/20 transition-colors duration-200">
                  <IoMedicalOutline className="text-gray-500 text-2xl group-hover:text-sitePrimary transition-colors duration-200" />
                </div>
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <div className="flex items-center w-full justify-between gap-2">
                    <span
                      className="line-clamp-1 group-hover:text-sitePrimary transition-colors duration-200 font-medium"
                      title={selectedService.name}
                    >
                      {selectedService.name}
                    </span>
                    {selectedService.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sitePrimary/10 text-sitePrimary">
                        {selectedService.type === "disease"
                          ? t("Hastalık")
                          : t("Tedavi")}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs w-full justify-between">
                    {selectedService.price && (
                      <span className="opacity-70 group-hover:text-sitePrimary transition-colors duration-200">
                        {selectedService.price} {selectedService.currency}
                      </span>
                    )}
                    {selectedService.prepayment_required && (
                      <span className="text-[10px] text-orange-400">
                        ( {t("Ön Ödeme Gerekli")} )
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100 border border-gray-200 group-hover:bg-sitePrimary/5 group-hover:border-sitePrimary/20 transition-colors duration-200">
                  <IoMedicalOutline className="text-gray-500 text-2xl group-hover:text-sitePrimary transition-colors duration-200" />
                </div>
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <div className="flex items-center gap-1 font-medium">
                    <div className="text-sm text-gray-500 group-hover:text-sitePrimary transition-colors duration-200">
                      {t("Hizmet Seçiniz")}
                    </div>
                  </div>
                </div>
              </>
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

            {availableServices.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                {searchQuery.trim() ? t("Sonuç Bulunamadı") : null}
              </div>
            ) : (
              <div className="flex flex-col w-full max-h-[275px] overflow-y-auto overflow-x-hidden">
                {availableServices.map((service) => (
                  <button
                    key={service.service_id}
                    type="button"
                    onClick={() => handleServiceSelect(service)}
                    className="w-full px-4 py-3 text-left hover:bg-sitePrimary/5 transition-colors duration-200 cursor-pointer border-b last:border-b-0 border-gray-200 group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100 border border-gray-200 group-hover:bg-sitePrimary/5 group-hover:border-sitePrimary/20 transition-colors duration-200">
                        <IoMedicalOutline className="text-gray-500 text-xl group-hover:text-sitePrimary transition-colors duration-200" />
                      </div>

                      <div className="flex flex-col gap-1 flex-1 w-full">
                        <div className="flex items-center w-full justify-between gap-2">
                          <span
                            className="text-sm line-clamp-1 group-hover:text-sitePrimary transition-colors duration-200 font-medium"
                            title={service.name}
                          >
                            {service.name}
                          </span>
                          {service.type && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-sitePrimary/10 text-sitePrimary flex-shrink-0">
                              {service.type === "disease"
                                ? t("Hastalık")
                                : t("Tedavi")}
                            </span>
                          )}
                        </div>
                        {service.description && (
                          <span
                            className="opacity-70 text-xs line-clamp-1 max-w-full group-hover:text-sitePrimary transition-colors duration-200"
                            title={service.description}
                          >
                            {service.description}
                          </span>
                        )}
                        <div className="flex items-center gap-2 text-xs mt-1 w-full justify-between">
                          {service.price && (
                            <span className="opacity-70 group-hover:text-sitePrimary transition-colors duration-200 font-medium">
                              {service.price} {service.currency}
                            </span>
                          )}
                          {service.prepayment_required && (
                            <span className="text-[10px] text-orange-400">
                              ( {t("Ön Ödeme Gerekli")} )
                            </span>
                          )}
                        </div>
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

export default ServiceSelector;
