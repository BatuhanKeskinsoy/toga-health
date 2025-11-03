"use client";
import React, { useState, useEffect, useMemo } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import { ProviderSidebarProps, ProviderData, isHospitalData, isDoctorData, isHospitalDetailData, isDoctorDetailData } from "@/lib/types/provider/providerTypes";
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

  // İlk doktoru varsayılan olarak seç (sadece hastane ise)
  useEffect(() => {
    if (isHospital && providerData && isHospitalDetailData(providerData) && !selectedDoctor) {
      const doctors = 'doctors' in providerData ? providerData.doctors : providerData.data?.doctors;
      if (doctors && Array.isArray(doctors) && doctors.length > 0) {
        // İlk doktoru seç
        const firstDoctor = doctors[0];
        setSelectedDoctor(firstDoctor as any);
      }
    }
  }, [isHospital, providerData, selectedDoctor]);

  // Hastane için: hastanenin varsayılan adresini kullan
  // Doktor için: varsayılan adresi seç
  useEffect(() => {
    if (providerData && ((isHospital && isHospitalDetailData(providerData)) || (!isHospital && isDoctorDetailData(providerData)))) {
      const addresses = providerData && isHospitalDetailData(providerData)
        ? ('addresses' in providerData ? providerData.addresses : providerData.data?.addresses)
        : providerData && isDoctorDetailData(providerData)
        ? ('addresses' in providerData ? providerData.addresses : providerData.data?.addresses)
        : [];
      const defaultAddress = addresses?.find((addr: any) => addr.is_default);

      if (defaultAddress) {
        let addressWithDoctorInfo;

        // Hastane detayında hastanenin varsayılan adresi kullanılacak
        if (isHospital && providerData && isHospitalDetailData(providerData)) {
          // Hastane adresini kullan
          addressWithDoctorInfo = {
            id: defaultAddress.address_id || defaultAddress.id?.toString() || '',
            name: defaultAddress.name,
            address: defaultAddress.address,
            doctorName: '',
            doctorSpecialty: '',
          };
        } else if (!isHospital && providerData && isDoctorDetailData(providerData)) {
          // Doktor detayında doktorun varsayılan adresi
          const doctorName = 'name' in providerData ? providerData.name : providerData.data?.name;
          const doctorPhoto = 'photo' in providerData ? providerData.photo : providerData.data?.photo;
          
          // doctor_info'ya güvenli erişim
          let doctorSpecialty = '';
          if ('doctor_info' in providerData && providerData.doctor_info) {
            doctorSpecialty = providerData.doctor_info?.specialty?.name || '';
          } else if ('data' in providerData && providerData.data && 'doctor_info' in providerData.data) {
            doctorSpecialty = (providerData.data as any).doctor_info?.specialty?.name || '';
          }
          
          addressWithDoctorInfo = {
            id: defaultAddress.address_id || defaultAddress.id?.toString() || '',
            name: defaultAddress.name,
            address: defaultAddress.address,
            doctorPhoto: doctorPhoto,
            doctorName: doctorName || '',
            doctorSpecialty: doctorSpecialty,
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

  // ProviderMain'den seçilen doktoru dinle (hastane detayında)
  useEffect(() => {
    const handleDoctorSelect = (event: CustomEvent) => {
      const doctor = event.detail;
      setSelectedDoctor(doctor);
      // Hastane detayında adres seçimine gerek yok, direkt doktor slug'ı kullanılacak
    };

    window.addEventListener('doctorSelected', handleDoctorSelect as EventListener);
    
    return () => {
      window.removeEventListener('doctorSelected', handleDoctorSelect as EventListener);
    };
  }, []);

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
    const addresses = providerData && isHospitalDetailData(providerData)
      ? ('addresses' in providerData ? providerData.addresses : providerData.data?.addresses)
      : providerData && isDoctorDetailData(providerData)
      ? ('addresses' in providerData ? providerData.addresses : providerData.data?.addresses)
      : [];
    
    return (
      addresses?.map((address: any) => {
        const baseAddress = {
          id: address.address_id || address.id?.toString() || '',
          name: address.name,
          address: address.address,
          doctorName: '',
          doctorSpecialty: '',
        };

        if (isHospital && selectedDoctor && isDoctorData(selectedDoctor)) {
          return {
            ...baseAddress,
            doctorPhoto: selectedDoctor.photo,
            doctorName: selectedDoctor.name,
            doctorSpecialty: selectedDoctor.doctor?.specialty?.name || "",
          };
        } else if (!isHospital && providerData && isDoctorDetailData(providerData)) {
          const doctorName = 'name' in providerData ? providerData.name : providerData.data?.name;
          const doctorPhoto = 'photo' in providerData ? providerData.photo : providerData.data?.photo;
          
          // doctor_info'ya güvenli erişim
          let doctorSpecialty = '';
          if ('doctor_info' in providerData && providerData.doctor_info) {
            doctorSpecialty = providerData.doctor_info?.specialty?.name || '';
          } else if ('data' in providerData && providerData.data && 'doctor_info' in providerData.data) {
            doctorSpecialty = (providerData.data as any).doctor_info?.specialty?.name || '';
          }
          
          return {
            ...baseAddress,
            doctorPhoto: doctorPhoto,
            doctorName: doctorName || '',
            doctorSpecialty: doctorSpecialty,
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
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-md">
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
      className="w-full shadow-lg shadow-gray-200 rounded-md transition-all duration-500 sticky top-4"
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

        {/* Adres seçimi sadece doktor detay sayfasında gösterilir */}
        {!isHospital && (
          <AddressSelector
            addresses={addressesWithDoctorInfo}
            selectedAddress={selectedAddress}
            onAddressSelect={handleAddressSelect}
            isLoading={false}
            isHospital={isHospital}
          />
        )}

        {/* Randevu saatlerini göster */}
        {((isHospital && selectedDoctor) || (!isHospital && selectedAddress && selectedAddress.id)) && (
          <div className="mt-4">
            <AppointmentTimes
              onExpandedChange={setIsExpanded}
              selectedAddressId={selectedAddress?.id || ''}
              selectedDoctorId={selectedDoctor && isDoctorData(selectedDoctor) ? selectedDoctor.id : undefined}
              isHospital={isHospital}
              doctorData={providerData && isDoctorData(providerData) ? providerData : undefined}
              selectedDoctor={selectedDoctor}
            />
          </div>
        )}

        {/* Boş state mesajları */}
        {isHospital && !selectedDoctor && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500 text-sm">
              {t("Randevu saatlerini görmek için lütfen bir uzman seçiniz.")}
            </p>
          </div>
        )}

        {!isHospital && !selectedAddress && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
            <p className="text-gray-500 text-sm">
              {t("Randevu saatlerini görmek için lütfen bir adres seçiniz.")}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
})

export default ProviderSidebar;
