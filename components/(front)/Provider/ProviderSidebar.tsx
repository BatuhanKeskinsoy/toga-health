"use client";
import React, { useState, useEffect, useMemo } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import { ProviderSidebarProps, ProviderData, isHospitalData, isDoctorData } from "@/lib/types/provider/providerTypes";
import { useTranslations } from "next-intl";


const ProviderSidebar = React.memo<ProviderSidebarProps>(({
  isHospital,
  providerData,
  providerError,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DoctorAddress | null>(
    null
  );
  const [selectedDoctor, setSelectedDoctor] =
    useState<ProviderData | null>(null);

    const t = useTranslations()

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true); 
  }, []);

  // İlk uzmanı varsayılan olarak seç (sadece hastane ise)
  // Not: Yeni API'de specialists ayrı bir endpoint'ten gelecek
  useEffect(() => {
    // Bu kısım yeni API entegrasyonunda güncellenecek
    // if (
    //   isHospital &&
    //   hospitalData?.specialists &&
    //   hospitalData.specialists.length > 0 &&
    //   !selectedSpecialist
    // ) {
    //   setSelectedSpecialist(hospitalData.specialists[0]);
    // }
  }, [isHospital, selectedDoctor]);

  // Varsayılan adresi hemen seç ve hastane için doktor değiştiğinde güncelle
  useEffect(() => {
    if (providerData && ((isHospital && isHospitalData(providerData)) || (!isHospital && isDoctorData(providerData)))) {
      const addresses = isHospital && isHospitalData(providerData) 
        ? providerData.active_addresses
        : isDoctorData(providerData) 
        ? providerData.active_addresses
        : [];
      const defaultAddress = addresses?.find((addr) => addr.is_default);

      if (defaultAddress) {
        let addressWithDoctorInfo;

        if (isHospital && selectedDoctor && isDoctorData(selectedDoctor)) {
          addressWithDoctorInfo = {
            ...defaultAddress,
            doctorPhoto: selectedDoctor.photo,
            doctorName: selectedDoctor.name,
            doctorSpecialty: selectedDoctor.doctor?.specialty?.name || "",
          };
        } else if (!isHospital && providerData && isDoctorData(providerData)) {
          addressWithDoctorInfo = {
            ...defaultAddress,
            doctorPhoto: providerData.photo,
            doctorName: providerData.name,
            doctorSpecialty: providerData.doctor?.specialty?.name || "",
          };
        }

        if (addressWithDoctorInfo) {
          setSelectedAddress(addressWithDoctorInfo);
        }
      }
    }
  }, [providerData, isHospital, selectedDoctor]);

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

  // ProviderMain'den seçilen doktoru dinle
  useEffect(() => {
    const handleDoctorSelect = (event: CustomEvent) => {
      const doctor = event.detail;
      setSelectedDoctor(doctor);
      
      // Seçilen doktorun varsayılan adresini seç
      if (providerData && isHospitalData(providerData) && providerData.active_addresses && providerData.active_addresses.length > 0) {
        const defaultAddress = providerData.active_addresses.find((addr: any) => addr.is_default);
        if (defaultAddress) {
          const addressWithDoctorInfo = {
            id: defaultAddress.id.toString(),
            name: defaultAddress.name,
            address: defaultAddress.address,
            doctorPhoto: doctor.photo,
            doctorName: doctor.name,
            doctorSpecialty: isDoctorData(doctor) ? doctor.doctor?.specialty?.name || "" : "",
          };
          setSelectedAddress(addressWithDoctorInfo);
        }
      }
    };

    window.addEventListener('doctorSelected', handleDoctorSelect as EventListener);
    
    return () => {
      window.removeEventListener('doctorSelected', handleDoctorSelect as EventListener);
    };
  }, [providerData]);

  const handleAddressSelect = (address: DoctorAddress) => {
    setSelectedAddress(address);
    
    // ProviderMain'e seçilen adresi gönder
    window.dispatchEvent(new CustomEvent('addressSelected', { detail: address }));
  };

  const handleDoctorSelect = (doctor: ProviderData) => {
    setSelectedDoctor(doctor);
  };

  // Adresleri doktor bilgileri ile birleştir
  const addressesWithDoctorInfo = useMemo(() => {
    const addresses = providerData && isHospitalData(providerData) 
      ? providerData.active_addresses
      : providerData && isDoctorData(providerData)
      ? providerData.active_addresses
      : [];
    return (
      addresses?.map((address) => {
        const baseAddress = {
          id: address.id.toString(),
          name: address.name,
          address: address.address,
          doctorName: isHospital
            ? (selectedDoctor && isDoctorData(selectedDoctor) ? selectedDoctor.name : "")
            : (providerData && isDoctorData(providerData) ? providerData.name : ""),
          doctorSpecialty: isHospital
            ? (selectedDoctor && isDoctorData(selectedDoctor) ? selectedDoctor.doctor?.specialty?.name || "" : "")
            : (providerData && isDoctorData(providerData) ? providerData.doctor?.specialty?.name || "" : ""),
        };

        if (isHospital && selectedDoctor && isDoctorData(selectedDoctor)) {
          return {
            ...baseAddress,
            doctorPhoto: selectedDoctor.photo,
            doctorName: selectedDoctor.name,
            doctorSpecialty: selectedDoctor.doctor?.specialty?.name || "",
          };
        } else if (!isHospital && providerData && isDoctorData(providerData)) {
          return {
            ...baseAddress,
            doctorPhoto: providerData.photo,
            doctorName: providerData.name,
            doctorSpecialty: providerData.doctor?.specialty?.name || "",
          };
        }
        return baseAddress;
      }) || []
    );
  }, [providerData, isHospital, selectedDoctor]);

  if (providerError) {
    return (
      <aside className="w-full shadow-lg shadow-gray-200 rounded-md">
        <div className="bg-white p-4">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              {isHospital ? "Hastane" : "Uzman"} bilgileri yüklenirken hata
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
        <h3 className="text-2xl font-semibold">{t('Randevu Al')}</h3>
        <p className="text-sm opacity-90 mt-1">
          {t('Hemen ücretsiz randevu oluşturun')}
        </p>
      </div>
      <div className="bg-white w-full p-4">
        {/* Specialist selector - yeni API'de specialists ayrı endpoint'ten gelecek */}
        {/* {isHospital && hospitalData?.specialists && (
          <div className="mb-4">
            <SpecialistSelector
              specialists={hospitalData.specialists}
              selectedSpecialist={selectedSpecialist}
              onSpecialistSelect={handleSpecialistSelect}
              isLoading={false}
            />
          </div>
        )} */}

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
              selectedDoctorId={selectedDoctor && isDoctorData(selectedDoctor) ? selectedDoctor.id : undefined}
              isHospital={isHospital}
              doctorData={providerData && isDoctorData(providerData) ? providerData : undefined}
            />
          </div>
        )}

        {!selectedAddress && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm">
              {isHospital
                ? "Randevu saatlerini görmek için lütfen bir uzman seçiniz."
                : "Randevu saatlerini görmek için lütfen bir adres seçiniz."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
})

export default ProviderSidebar;
