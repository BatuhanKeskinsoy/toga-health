"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoLocation, IoTime, IoCall } from "react-icons/io5";
import { DoctorAddress, AddressSelectionProps } from "@/lib/types/others/addressTypes";
import Image from "next/image";

const AddressSelector: React.FC<AddressSelectionProps> = ({
  addresses,
  selectedAddress,
  onAddressSelect,
  isLoading = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
  const availableAddresses = addresses.filter(addr => addr.id !== selectedAddress?.id);

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
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Adres Seçiniz
        </label>
        
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full cursor-pointer px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-sitePrimary focus:outline-none focus:ring-2 focus:ring-sitePrimary/20 focus:border-sitePrimary transition-all duration-200"
        >
          <div className="flex items-center gap-3 flex-1">
            {selectedAddress ? (
              <>
                {selectedAddress.doctorPhoto && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={selectedAddress.doctorPhoto}
                      alt={selectedAddress.doctorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">
                      {selectedAddress.doctorName}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {selectedAddress.doctorSpecialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <IoLocation className="text-xs" />
                    <span className="truncate">{selectedAddress.name}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <IoLocation className="text-gray-400" />
                </div>
                <span className="text-gray-500">Adres seçiniz</span>
              </div>
            )}
          </div>
          
          <IoChevronDown 
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {availableAddresses.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-center">
                Başka adres bulunamadı
              </div>
            ) : (
              <div className="py-2">
                {availableAddresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    onClick={() => handleAddressSelect(address)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      {address.doctorPhoto ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={address.doctorPhoto}
                            alt={address.doctorName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <IoLocation className="text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {address.doctorName}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {address.doctorSpecialty}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <IoLocation className="text-xs" />
                          <span className="truncate">{address.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <IoTime className="text-xs" />
                          <span>
                            {address.workingHours.start} - {address.workingHours.end}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <IoCall className="text-xs" />
                          <span>{address.phone}</span>
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

export default AddressSelector; 