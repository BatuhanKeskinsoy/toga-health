"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import {
  ProviderSidebarProps,
  ProviderData,
  isHospitalDetailData,
  isDoctorDetailData,
} from "@/lib/types/provider/providerTypes";
import { useTranslations } from "next-intl";
import DoctorSelector from "@/components/(front)/Provider/DoctorSelector/DoctorSelector";
import ServiceSelector from "@/components/(front)/Provider/ServiceSelector/ServiceSelector";
import { Service } from "@/lib/types/appointments";
import { useAppointmentData } from "@/components/(front)/Provider/AppointmentTimes/hooks/useAppointmentData";
import { IoCalendarClearOutline } from "react-icons/io5";

const ProviderSidebar = React.memo<ProviderSidebarProps>(
  ({ isHospital, providerData, providerError, onList = false, initialAppointmentData = null }) => {
  const [isExpanded, setIsExpanded] = useState(false);
    const [selectedAddress, setSelectedAddress] =
      useState<DoctorAddress | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<ProviderData | null>(
      null
    );
    const [selectedService, setSelectedService] = useState<Service | null>(
    null
  );
    const t = useTranslations();

    // Appointment verilerini çek (servis listesi için)
    const selectedAddressId = selectedAddress?.id || null;
    const selectedDoctorId = isHospital
      ? (selectedDoctor as any)?.id
      : (providerData as any)?.id;

    const { appointmentData } = useAppointmentData(
      selectedAddressId,
      selectedDoctorId?.toString(),
      isHospital,
      isHospital ? undefined : (providerData as ProviderData),
      isHospital ? selectedDoctor : undefined,
      isHospital ? providerData : undefined,
      onList,
      initialAppointmentData
    );

    // ID karşılaştırması için optimize edilmiş yardımcı fonksiyon
    const compareIds = useCallback((id1: any, id2: any): boolean => {
      if (id1 === id2) return true;
      if (String(id1) === String(id2)) return true;
      const num1 = Number(id1);
      const num2 = Number(id2);
      return !isNaN(num1) && !isNaN(num2) && num1 === num2;
    }, []);

    // Adresleri almak için optimize edilmiş yardımcı fonksiyon
    const getAddressesFromProvider = useCallback((): any[] => {
      if (!providerData) return [];
      
      if (onList && "addresses" in providerData) {
        return (providerData as any).addresses || [];
      }
      
      if (isHospital && isHospitalDetailData(providerData)) {
        return "addresses" in providerData
          ? providerData.addresses
          : providerData.data?.addresses || [];
      }
      
      if (!isHospital && isDoctorDetailData(providerData)) {
        return "addresses" in providerData
          ? providerData.addresses
          : providerData.data?.addresses || [];
      }
      
      if ("addresses" in providerData) {
        return (providerData as any).addresses || [];
      }
      
      return [];
    }, [providerData, isHospital, onList]);

    // Hastane detayında doktor listesi - optimize edilmiş
    const hospitalDoctors = useMemo(() => {
      if (!isHospital || !providerData) return [];

      let doctors: any[] = [];
      
      if (onList && "doctors" in providerData) {
        doctors = (providerData as any).doctors || [];
      } else if (isHospitalDetailData(providerData)) {
        doctors = "doctors" in providerData
          ? providerData.doctors
          : providerData.data?.doctors || [];
      } else if ("doctors" in providerData) {
        doctors = (providerData as any).doctors || [];
      }

      return (doctors || []).map((doctor: any) => doctor as ProviderData);
    }, [isHospital, providerData, onList]);

    // Adres veya doktor değiştiğinde servis seçimini sıfırla
    useEffect(() => {
      setSelectedService(null);
    }, [selectedAddress, selectedDoctor]);

    // Hastane detayında: Varsayılan doktoru seç - optimize edilmiş
    useEffect(() => {
      if (!isHospital || !providerData || selectedDoctor || hospitalDoctors.length === 0) {
        return;
      }

      // initialAppointmentData varsa, o verideki doktoru seç
      if (initialAppointmentData?.doctor?.id) {
        const doctorIdFromData = initialAppointmentData.doctor.id;
        const matchingDoctor = hospitalDoctors.find((doc: any) => 
          compareIds(doc.id, doctorIdFromData)
        );
        
        setSelectedDoctor(matchingDoctor || hospitalDoctors[0]);
      } else {
        // initialAppointmentData yoksa, ilk doktoru seç
        setSelectedDoctor(hospitalDoctors[0]);
      }
    }, [isHospital, providerData, selectedDoctor, hospitalDoctors, initialAppointmentData, compareIds]);

    // Doktor bilgilerini almak için optimize edilmiş yardımcı fonksiyon
    const getDoctorInfo = useCallback(() => {
      if (!providerData) return { name: "", photo: null, specialty: "" };
      
      const name = "name" in providerData
        ? providerData.name
        : providerData.data?.name || "";
      
      const photo = "photo" in providerData
        ? providerData.photo
        : providerData.data?.photo || null;
      
      let specialty = "";
      if ("doctor_info" in providerData && providerData.doctor_info) {
        specialty = providerData.doctor_info?.specialty?.name || "";
      } else if ("data" in providerData && providerData.data && "doctor_info" in providerData.data) {
        specialty = (providerData.data as any).doctor_info?.specialty?.name || "";
      }
      
      return { name, photo, specialty };
    }, [providerData]);

    // Doktor detayında: Varsayılan adresi seç - optimize edilmiş
    useEffect(() => {
      if (!providerData || selectedAddress) return;

      const addresses = getAddressesFromProvider();
      const defaultAddress = addresses?.find((addr: any) => addr.is_default);

      if (!defaultAddress) return;

      const addressId = defaultAddress.address_id || defaultAddress.id?.toString() || "";
      const baseAddress: DoctorAddress = {
        id: addressId,
        name: defaultAddress.name,
        address: defaultAddress.address,
        addressPhoto: defaultAddress.photo,
        doctorName: "",
        doctorSpecialty: "",
      };

      if (isHospital) {
        setSelectedAddress(baseAddress);
      } else {
        const doctorInfo = getDoctorInfo();
        setSelectedAddress({
          ...baseAddress,
          doctorPhoto: doctorInfo.photo,
          doctorName: doctorInfo.name,
          doctorSpecialty: doctorInfo.specialty,
        });
      }
    }, [providerData, isHospital, selectedAddress, getAddressesFromProvider, getDoctorInfo]);

    // Animasyon trigger
  useEffect(() => {
    const handleAnimationTrigger = () => {
        const sidebar = document.querySelector("[data-sidebar]");
        if (sidebar) {
          sidebar.classList.add("scale-105");

          if (window.innerWidth < 1024) {
            sidebar.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }

          setTimeout(() => {
            sidebar.classList.remove("scale-105");
          }, 500);
      }
    };

    window.addEventListener(
      "triggerAppointmentAnimation",
      handleAnimationTrigger
    );
    return () => {
      window.removeEventListener(
        "triggerAppointmentAnimation",
        handleAnimationTrigger
      );
    };
    }, []);

  // ProviderMain'den seçilen doktoru dinle (hastane detayında)
  useEffect(() => {
    const handleDoctorSelect = (event: CustomEvent) => {
        setSelectedDoctor(event.detail);
    };

      window.addEventListener(
        "doctorSelected",
        handleDoctorSelect as EventListener
      );
    return () => {
        window.removeEventListener(
          "doctorSelected",
          handleDoctorSelect as EventListener
        );
    };
  }, []);

    // Event handler'lar - optimize edilmiş
    const handleAddressSelect = useCallback((address: DoctorAddress) => {
      setSelectedAddress(address);
      window.dispatchEvent(
        new CustomEvent("addressSelected", { detail: address })
      );
    }, []);

    const handleDoctorSelectChange = useCallback((doctor: any) => {
      setSelectedDoctor(doctor);
    }, []);

    // Adresleri doktor bilgileri ile birleştir - optimize edilmiş
    const addressesWithDoctorInfo = useMemo(() => {
      const addresses = getAddressesFromProvider();
      if (!addresses || addresses.length === 0) return [];

      return addresses.map((address: any) => {
        const baseAddress: DoctorAddress = {
          id: address.address_id || address.id?.toString() || "",
          name: address.name,
          address: address.address,
          addressPhoto: address.photo,
          doctorName: "",
          doctorSpecialty: "",
        };

        if (isHospital && selectedDoctor) {
          return {
            ...baseAddress,
            doctorPhoto: (selectedDoctor as any).photo,
            doctorName: (selectedDoctor as any).name,
            doctorSpecialty: (selectedDoctor as any).department || "",
          };
        }

        if (!isHospital && providerData) {
          const doctorInfo = getDoctorInfo();
          return {
            ...baseAddress,
            doctorPhoto: doctorInfo.photo,
            doctorName: doctorInfo.name,
            doctorSpecialty: doctorInfo.specialty,
          };
        }

        return baseAddress;
      });
    }, [providerData, isHospital, selectedDoctor, getAddressesFromProvider, getDoctorInfo]);

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

    // Liste görünümünde adres/doktor yoksa mesaj göster
    if (onList) {
      if (!isHospital && addressesWithDoctorInfo.length === 0) {
        return (
          <>
            <IoCalendarClearOutline className="text-gray-400 text-5xl" />
            <p className="text-sm text-gray-500">
              {t("Bu sağlayıcının hiç adresi yok")}
            </p>
          </>
        );
      }

      if (isHospital && hospitalDoctors.length === 0) {
        return (
          <>
            <IoCalendarClearOutline className="text-gray-600 text-2xl" />
            <p className="text-sm text-gray-500">
              {t("Bu sağlayıcının hiç doktoru yok")}
            </p>
          </>
        );
      }
    }

  return (
    <aside
      data-sidebar
        className={`w-full min-w-0 transition-all duration-500 ${
          !isExpanded && !onList ? "sticky top-4" : ""
        } ${!onList ? "rounded-md shadow-lg shadow-gray-200" : ""}`}
    >
        {/* Liste görünümünde header'ı gizle */}
        {!onList && (
      <div className="bg-sitePrimary text-white p-4 rounded-t-md text-center">
            <h3 className="text-2xl font-semibold">{t("Randevu Al")}</h3>
        <p className="text-sm opacity-90 mt-1">
              {t("Hemen Ücretsiz randevu oluşturun")}
            </p>
          </div>
        )}

        <div
          className={`bg-white w-full min-w-0 flex flex-col ${
            onList ? "gap-1.5" : "gap-4 p-4"
          }`}
        >
          {/* Liste görünümünde minimalist selector'lar */}
          {onList ? (
            <>
              {/* Hastane detayında: Doktor seçimi */}
              {isHospital && (
                <>
                  {hospitalDoctors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 w-full text-center p-6 opacity-70 bg-gray-50 border border-gray-200 rounded-md">
                      <IoCalendarClearOutline className="text-gray-600 text-3xl" />
                      <p className="text-gray-600 text-sm">
                        {t("Bu sağlayıcının hiç doktoru yok")}
        </p>
      </div>
                  ) : (
                    <DoctorSelector
                      doctors={hospitalDoctors}
                      selectedDoctor={selectedDoctor}
                      onDoctorSelect={handleDoctorSelectChange}
                      compact={true}
                    />
                  )}
                </>
              )}

              {/* Doktor detayında: Adres seçimi */}
              {!isHospital && (
                <>
                  {addressesWithDoctorInfo.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4 w-full text-center p-6 opacity-70 bg-gray-50 border border-gray-200 rounded-md">
                      <IoCalendarClearOutline className="text-gray-600 text-3xl" />
                      <p className="text-gray-600 text-sm">
                        {t("Bu sağlayıcının hiç adresi yok")}
                      </p>
          </div>
                  ) : (
                    <AddressSelector
                      addresses={addressesWithDoctorInfo}
                      selectedAddress={selectedAddress}
                      onAddressSelect={handleAddressSelect}
                      isHospital={isHospital}
                      compact={true}
                    />
                  )}
                </>
              )}

              {/* Servis Seçimi */}
              {appointmentData?.services &&
                appointmentData.services.length > 0 &&
                (selectedAddress || selectedDoctor) && (
                  <ServiceSelector
                    services={appointmentData.services}
                    selectedService={selectedService}
                    onServiceSelect={setSelectedService}
                    compact={true}
                  />
                )}
            </>
          ) : (
            <>
              {/* Detay sayfasında normal selector'lar */}
              {/* Hastane detayında: Doktor seçimi */}
              {isHospital && (
                <DoctorSelector
                  doctors={hospitalDoctors}
                  selectedDoctor={selectedDoctor}
                  onDoctorSelect={handleDoctorSelectChange}
                />
              )}

              {/* Doktor detayında: Adres seçimi */}
        {!isHospital && (
          <AddressSelector
            addresses={addressesWithDoctorInfo}
            selectedAddress={selectedAddress}
            onAddressSelect={handleAddressSelect}
            isHospital={isHospital}
          />
              )}

              {/* Servis Seçimi - Adres veya Doktor seçildikten sonra göster */}
              {appointmentData?.services &&
                appointmentData.services.length > 0 &&
                (selectedAddress || selectedDoctor) && (
                  <ServiceSelector
                    services={appointmentData.services}
                    selectedService={selectedService}
                    onServiceSelect={setSelectedService}
                  />
                )}
            </>
        )}

        {/* Randevu saatlerini göster */}
          {((isHospital && selectedDoctor) ||
            (!isHospital && selectedAddress && selectedAddress.id)) && (
            <AppointmentTimes
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
              selectedAddressId={selectedAddress?.id || ""}
              selectedDoctorId={
                selectedDoctor ? (selectedDoctor as any).id : undefined
              }
              isHospital={isHospital}
              doctorData={
                !isHospital && providerData ? providerData : undefined
              }
              selectedDoctor={selectedDoctor}
              providerData={providerData}
              selectedService={selectedService}
              selectedAddress={selectedAddress}
              onList={onList}
            />
        )}
      </div>
    </aside>
  );
  }
);

export default ProviderSidebar;
