"use client";
import React, { useState, useEffect } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import { useAddressData } from "@/lib/hooks/address/useAddressData";

function ProviderSidebar({ isHospital }: { isHospital: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DoctorAddress | null>(null);

  const { 
    data, 
    error, 
    isLoading, 
    getDefaultAddress, 
    getActiveAddresses,
    doctor 
  } = useAddressData();

  // Varsayılan adresi hemen seç
  useEffect(() => {
    if (data?.addresses && !selectedAddress) {
      const defaultAddress = getDefaultAddress();
      if (defaultAddress) {
        // Doktor bilgileri ile birleştir
        const addressWithDoctorInfo = {
          ...defaultAddress,
          doctorPhoto: doctor?.photo,
          doctorName: doctor?.name || "Dr. Ahmet Yılmaz",
          doctorSpecialty: doctor?.specialty || "Kardiyoloji"
        };
        setSelectedAddress(addressWithDoctorInfo);
      }
    }
  }, [data, doctor, selectedAddress, getDefaultAddress]);

  useEffect(() => {
    const handleAnimationTrigger = () => {
      setIsAnimating(true);
      
      if (window.innerWidth < 1024) { 
        const sidebar = document.querySelector('[data-sidebar]');
        if (sidebar) {
          sidebar.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    };

    // Event listener ekle
    window.addEventListener('triggerAppointmentAnimation', handleAnimationTrigger);

    // Cleanup
    return () => {
      window.removeEventListener('triggerAppointmentAnimation', handleAnimationTrigger);
    };
  }, []);

  const handleAddressSelect = (address: DoctorAddress) => {
    setSelectedAddress(address);
  };

  // Adresleri doktor bilgileri ile birleştir
  const addressesWithDoctorInfo = getActiveAddresses().map(address => ({
    ...address,
    doctorPhoto: doctor?.photo,
    doctorName: doctor?.name || "Dr. Ahmet Yılmaz",
    doctorSpecialty: doctor?.specialty || "Kardiyoloji"
  }));

  if (error) {
    return (
      <aside className="w-full shadow-lg shadow-gray-200 rounded-md">
        <div className="bg-white p-4">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">Adres bilgileri yüklenirken hata oluştu</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside 
      data-sidebar
      className={`w-full shadow-lg shadow-gray-200 transition-all duration-500 ease-in-out ${
        isExpanded ? '' : 'sticky top-4'
      }`}>
      <div className="flex flex-col gap-4">
        <div className={`flex flex-col items-center overflow-hidden rounded-md transition-all duration-700 ${
          isAnimating ? 'ring-4 ring-sitePrimary/40 shadow-2xl shadow-sitePrimary/40 scale-[1.01] animate-pulse' : ''
        }`}>
          <div className={`flex items-center justify-center text-white text-xl font-medium tracking-wide py-5 w-full transition-all duration-700 ${
            isAnimating 
              ? 'bg-gradient-to-r from-sitePrimary via-sitePrimary/80 to-sitePrimary animate-pulse' 
              : 'bg-sitePrimary'
          }`}>
            Randevu Oluştur
          </div>
          <div className="bg-white w-full p-4">
            <AddressSelector
              addresses={addressesWithDoctorInfo}
              selectedAddress={selectedAddress}
              onAddressSelect={handleAddressSelect}
              isLoading={isLoading}
            />
            
            {selectedAddress && (
              <div className="mt-4">
                <AppointmentTimes onExpandedChange={setIsExpanded} />
              </div>
            )}
            
            {!selectedAddress && !isLoading && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500 text-sm">
                  Randevu saatlerini görmek için lütfen bir adres seçiniz.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default ProviderSidebar;
