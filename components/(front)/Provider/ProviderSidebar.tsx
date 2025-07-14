"use client";
import React, { useState, useEffect, useMemo } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import SpecialistSelector from "@/components/(front)/Provider/SpecialistSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import { Hospital } from "@/lib/hooks/provider/useHospitals";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";

interface ProviderSidebarProps {
  isHospital: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
  hospitalError?: string | null;
  specialistError?: string | null;
}

const ProviderSidebar = React.memo<ProviderSidebarProps>(({
  isHospital,
  hospitalData,
  specialistData,
  hospitalError,
  specialistError,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DoctorAddress | null>(
    null
  );
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // İlk uzmanı varsayılan olarak seç (sadece hastane ise)
  useEffect(() => {
    if (
      isHospital &&
      hospitalData?.specialists &&
      hospitalData.specialists.length > 0 &&
      !selectedSpecialist
    ) {
      setSelectedSpecialist(hospitalData.specialists[0]);
    }
  }, [isHospital, hospitalData?.specialists, selectedSpecialist]);

  // Varsayılan adresi hemen seç ve hastane için doktor değiştiğinde güncelle
  useEffect(() => {
    if (hospitalData?.addresses || specialistData?.addresses) {
      const addresses = isHospital
        ? hospitalData?.addresses
        : specialistData?.addresses;
      const defaultAddress = addresses?.find((addr) => addr.isDefault);

      if (defaultAddress) {
        let addressWithDoctorInfo;

        if (isHospital && selectedSpecialist) {
          // Hastane için seçilen doktorun bilgilerini kullan
          addressWithDoctorInfo = {
            ...defaultAddress,
            doctorPhoto: selectedSpecialist.photo,
            doctorName: selectedSpecialist.name,
            doctorSpecialty: selectedSpecialist.specialty,
          };
        } else if (!isHospital && specialistData) {
          // Normal doktor için mevcut doktor bilgilerini kullan
          addressWithDoctorInfo = {
            ...defaultAddress,
            doctorPhoto: specialistData.photo,
            doctorName: specialistData.name,
            doctorSpecialty: specialistData.specialty,
          };
        }

        if (addressWithDoctorInfo) {
          setSelectedAddress(addressWithDoctorInfo);
        }
      }
    }
  }, [hospitalData, specialistData, isHospital, selectedSpecialist]);

  useEffect(() => {
    const handleAnimationTrigger = () => {
      if (isMounted) {
        const sidebar = document.querySelector("[data-sidebar]");
        if (sidebar) {
          // Animasyon class'ını ekle
          sidebar.classList.add("scale-105");

          if (window.innerWidth < 1024) {
            sidebar.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }

          // Animasyon class'ını kaldır
          setTimeout(() => {
            sidebar.classList.remove("scale-105");
          }, 500);
        }
      }
    };

    // Event listener ekle
    window.addEventListener(
      "triggerAppointmentAnimation",
      handleAnimationTrigger
    );

    // Cleanup
    return () => {
      window.removeEventListener(
        "triggerAppointmentAnimation",
        handleAnimationTrigger
      );
    };
  }, [isMounted]);

  const handleAddressSelect = (address: DoctorAddress) => {
    console.log("ProviderSidebar - Adres seçildi:", address);
    setSelectedAddress(address);
  };

  const handleSpecialistSelect = (specialist: Specialist) => {
    console.log("ProviderSidebar - Uzman seçildi:", specialist);
    setSelectedSpecialist(specialist);
  };

  // Adresleri doktor bilgileri ile birleştir
  const addressesWithDoctorInfo = useMemo(() => {
    const addresses = isHospital
      ? hospitalData?.addresses
      : specialistData?.addresses;
    return (
      addresses?.map((address) => {
        const baseAddress = {
          id: address.id,
          name: address.name,
          address: address.address,
          doctorName: isHospital
            ? selectedSpecialist?.name
            : specialistData?.name,
          doctorSpecialty: isHospital
            ? selectedSpecialist?.specialty
            : specialistData?.specialty,
        };

        if (isHospital && selectedSpecialist) {
          // Hastane için seçilen doktorun bilgilerini kullan
          return {
            ...baseAddress,
            doctorPhoto: selectedSpecialist.photo,
            doctorName: selectedSpecialist.name,
            doctorSpecialty: selectedSpecialist.specialty,
          };
        } else if (!isHospital && specialistData) {
          // Normal doktor için mevcut doktor bilgilerini kullan
          return {
            ...baseAddress,
            doctorPhoto: specialistData.photo,
            doctorName: specialistData.name,
            doctorSpecialty: specialistData.specialty,
          };
        }
        return baseAddress;
      }) || []
    );
  }, [hospitalData, specialistData, isHospital, selectedSpecialist]);

  if (hospitalError || specialistError) {
    return (
      <aside className="w-full shadow-lg shadow-gray-200 rounded-md">
        <div className="bg-white p-4">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              {isHospital ? "Hastane" : "Doktor"} bilgileri yüklenirken hata
              oluştu
            </p>
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
      className="w-full shadow-lg shadow-gray-200 rounded-md transition-all duration-500"
    >
      <div className="bg-sitePrimary text-white p-4 rounded-t-md text-center">
        <h3 className="text-2xl font-semibold">Randevu Al</h3>
        <p className="text-sm opacity-90 mt-1">
          Hemen ücretsiz randevu oluşturun
        </p>
      </div>
      <div className="bg-white w-full p-4">
        {isHospital && hospitalData?.specialists && (
          <div className="mb-4">
            <SpecialistSelector
              specialists={hospitalData.specialists}
              selectedSpecialist={selectedSpecialist}
              onSpecialistSelect={handleSpecialistSelect}
              isLoading={false}
            />
          </div>
        )}

        <AddressSelector
          addresses={addressesWithDoctorInfo}
          selectedAddress={selectedAddress}
          onAddressSelect={handleAddressSelect}
          isLoading={false}
          isHospital={isHospital}
        />

        {selectedAddress && selectedAddress.id && (
          <div className="mt-4">
            <AppointmentTimes
              onExpandedChange={setIsExpanded}
              selectedAddressId={selectedAddress.id}
              selectedSpecialistId={selectedSpecialist?.id}
              isHospital={isHospital}
              specialistData={specialistData}
            />
          </div>
        )}

        {!selectedAddress && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm">
              {isHospital
                ? "Randevu saatlerini görmek için lütfen bir doktor seçiniz."
                : "Randevu saatlerini görmek için lütfen bir adres seçiniz."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
})

export default ProviderSidebar;
