"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoLocationOutline } from "react-icons/io5";
import { DoctorAddress, AddressSelectionProps } from "@/lib/types/others/addressTypes";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { useTranslations } from "next-intl";

const AddressSelector: React.FC<AddressSelectionProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

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

  const handleAddressSelect = (address: DoctorAddress) => {
    onAddressSelect(address);
    setIsOpen(false);
  };

  // Seçili olmayan adresleri filtrele
  const availableAddresses = addresses.filter(
    (addr) => addr.id !== selectedAddress?.id
  );

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
          {t("Adres Seçiniz")}
        </label>

        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full cursor-pointer bg-gray-100 hover:bg-sitePrimary/5 px-4 py-3 transition-all duration-300 group"
        >
          <div className="flex items-center w-full gap-3 flex-1">
            {selectedAddress ? (
              <>
                <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                  {selectedAddress.addressPhoto ? (
                    <ProfilePhoto
                      photo={selectedAddress.addressPhoto}
                      name={selectedAddress.name}
                      size={48}
                      fontSize={16}
                      responsiveSizes={{ desktop: 48, mobile: 48 }}
                      responsiveFontSizes={{ desktop: 16, mobile: 16 }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gray-100 border border-gray-200 rounded-md group-hover:bg-sitePrimary/5 group-hover:border-sitePrimary/20 transition-colors duration-200">
                      <IoLocationOutline className="text-gray-500 text-2xl group-hover:text-sitePrimary transition-colors duration-200" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <div className="flex items-center gap-1 font-medium">
                    <span className="truncate group-hover:text-sitePrimary transition-colors duration-200">{selectedAddress.name}</span>
                  </div>
                  <div className="opacity-70 text-xs line-clamp-2 group-hover:text-sitePrimary transition-colors duration-200">
                    {selectedAddress.address}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <span className="text-gray-500">{t("Adres Seçiniz")}</span>
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
          <div className="absolute top-full w-full z-10 bg-white border border-gray-200 shadow-md max-h-80 overflow-y-auto">
            {availableAddresses.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                {t("Başka Adres Bulunamadı")}
              </div>
            ) : (
              <div className="flex flex-col">
                {availableAddresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => handleAddressSelect(address)}
                    className="w-full px-4 py-3 text-left hover:bg-sitePrimary/5 transition-colors duration-200 cursor-pointer border-b last:border-b-0 group border-gray-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                        {address.addressPhoto ? (
                          <ProfilePhoto
                            photo={address.addressPhoto}
                            name={address.name}
                            size={48}
                            fontSize={16}
                            responsiveSizes={{ desktop: 48, mobile: 48 }}
                            responsiveFontSizes={{ desktop: 16, mobile: 16 }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-100 border border-gray-200 rounded-md group-hover:bg-sitePrimary/5 group-hover:border-sitePrimary/20 transition-colors duration-200">
                            <IoLocationOutline className="text-gray-500 text-2xl group-hover:text-sitePrimary transition-colors duration-200" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 flex-1 min-w-max w-full">
                        <div className="flex items-center gap-1 font-medium">
                          <span className="truncate group-hover:text-sitePrimary transition-colors duration-200">{address.name}</span>
                        </div>
                        <span className="opacity-70 text-xs line-clamp-2 max-w-full break-words group-hover:text-sitePrimary transition-colors duration-200">
                          {address.address}
                        </span>
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

export default AddressSelector;
