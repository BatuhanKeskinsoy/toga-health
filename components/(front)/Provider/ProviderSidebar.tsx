"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  ({ isHospital, providerData, providerError, onList = false }) => {
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
      onList
    );

    // Adres veya doktor değiştiğinde servis seçimini sıfırla
    useEffect(() => {
      setSelectedService(null);
    }, [selectedAddress, selectedDoctor]);

    // Hastane detayında: İlk doktoru varsayılan olarak seç
    useEffect(() => {
      if (isHospital && providerData && !selectedDoctor) {
        let doctors: any[] = [];

        // Liste görünümünde Provider tipi direkt doctors'a sahip
        if (onList && "doctors" in providerData) {
          doctors = (providerData as any).doctors || [];
        } else if (isHospitalDetailData(providerData)) {
          doctors =
            "doctors" in providerData
              ? providerData.doctors
              : providerData.data?.doctors || [];
        } else if ("doctors" in providerData) {
          // Fallback: direkt doctors property'sini kontrol et
          doctors = (providerData as any).doctors || [];
        }

        if (doctors && Array.isArray(doctors) && doctors.length > 0) {
          setSelectedDoctor(doctors[0] as any);
        }
      }
    }, [isHospital, providerData, selectedDoctor, onList]);

    // Doktor detayında: Varsayılan adresi seç
    // Hastane detayında: Varsayılan adresi seç (hastanenin adresi)
    useEffect(() => {
      if (!providerData) return;

      const getAddresses = () => {
        // Liste görünümünde Provider tipi direkt addresses'e sahip
        if (onList && "addresses" in providerData) {
          return (providerData as any).addresses || [];
        }

        if (isHospital && isHospitalDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
        } else if (!isHospital && isDoctorDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
        }
        // Fallback: direkt addresses property'sini kontrol et
        if ("addresses" in providerData) {
          return (providerData as any).addresses || [];
        }
        return [];
      };

      const addresses = getAddresses();
      const defaultAddress = addresses?.find((addr: any) => addr.is_default);

      if (defaultAddress) {
        let addressWithDoctorInfo: DoctorAddress;

        if (isHospital) {
          // Hastane detayında hastanenin varsayılan adresi
          addressWithDoctorInfo = {
            id:
              defaultAddress.address_id || defaultAddress.id?.toString() || "",
            name: defaultAddress.name,
            address: defaultAddress.address,
            addressPhoto: defaultAddress.photo, // Adresin kendi fotoğrafı
            doctorName: "",
            doctorSpecialty: "",
          };
        } else {
          // Doktor detayında doktorun varsayılan adresi
          const doctorName =
            "name" in providerData
              ? providerData.name
              : providerData.data?.name;
          const doctorPhoto =
            "photo" in providerData
              ? providerData.photo
              : providerData.data?.photo;

          let doctorSpecialty = "";
          if ("doctor_info" in providerData && providerData.doctor_info) {
            doctorSpecialty = providerData.doctor_info?.specialty?.name || "";
          } else if (
            "data" in providerData &&
            providerData.data &&
            "doctor_info" in providerData.data
          ) {
            doctorSpecialty =
              (providerData.data as any).doctor_info?.specialty?.name || "";
          }

          addressWithDoctorInfo = {
            id:
              defaultAddress.address_id || defaultAddress.id?.toString() || "",
            name: defaultAddress.name,
            address: defaultAddress.address,
            addressPhoto: defaultAddress.photo, // Adresin kendi fotoğrafı
            doctorPhoto: doctorPhoto, // Fallback olarak doktor fotoğrafı
            doctorName: doctorName || "",
            doctorSpecialty: doctorSpecialty,
          };
        }

        setSelectedAddress(addressWithDoctorInfo);
      }
    }, [providerData, isHospital, onList]);

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

    const handleAddressSelect = (address: DoctorAddress) => {
      setSelectedAddress(address);
      window.dispatchEvent(
        new CustomEvent("addressSelected", { detail: address })
      );
    };

    // Doktor seçimi için hastane detayında
    const handleDoctorSelectChange = (doctor: any) => {
      setSelectedDoctor(doctor);
    };

    // Adresleri doktor bilgileri ile birleştir
    const addressesWithDoctorInfo = useMemo(() => {
      const getAddresses = () => {
        // Liste görünümünde Provider tipi direkt addresses'e sahip
        if (onList && "addresses" in providerData) {
          return (providerData as any).addresses || [];
        }

        if (isHospital && isHospitalDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
        } else if (!isHospital && isDoctorDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
        }
        // Fallback: direkt addresses property'sini kontrol et
        if ("addresses" in providerData) {
          return (providerData as any).addresses || [];
        }
        return [];
      };

      const addresses = getAddresses();

      return (
        addresses?.map((address: any) => {
          const baseAddress: DoctorAddress = {
            id: address.address_id || address.id?.toString() || "",
            name: address.name,
            address: address.address,
            addressPhoto: address.photo, // Adresin kendi fotoğrafı
            doctorName: "",
            doctorSpecialty: "",
          };

          if (isHospital && selectedDoctor) {
            // Hastane detayında seçilen doktorun bilgileri
            return {
              ...baseAddress,
              doctorPhoto: (selectedDoctor as any).photo, // Fallback olarak doktor fotoğrafı
              doctorName: (selectedDoctor as any).name,
              doctorSpecialty: (selectedDoctor as any).department || "",
            };
          } else if (!isHospital && providerData) {
            // Liste görünümünde veya detay sayfasında doktor bilgileri
            const isListOrDetailData =
              onList || isDoctorDetailData(providerData);

            if (!isListOrDetailData) {
              // Fallback: direkt property'leri kontrol et
              const doctorName = (providerData as any)?.name;
              const doctorPhoto = (providerData as any)?.photo;
              const doctorSpecialty =
                (providerData as any)?.doctor_info?.specialty?.name || "";

              return {
                ...baseAddress,
                doctorPhoto: doctorPhoto,
                doctorName: doctorName || "",
                doctorSpecialty: doctorSpecialty,
              };
            }

            // Liste görünümünde direkt property'lerden al
            if (onList) {
              const doctorName = (providerData as any)?.name;
              const doctorPhoto = (providerData as any)?.photo;
              const doctorSpecialty =
                (providerData as any)?.doctor_info?.specialty?.name || "";

              return {
                ...baseAddress,
                doctorPhoto: doctorPhoto,
                doctorName: doctorName || "",
                doctorSpecialty: doctorSpecialty,
              };
            }

            // Doktor detayında doktorun bilgileri
            const doctorName =
              "name" in providerData
                ? providerData.name
                : providerData.data?.name;
            const doctorPhoto =
              "photo" in providerData
                ? providerData.photo
                : providerData.data?.photo;

            let doctorSpecialty = "";
            if ("doctor_info" in providerData && providerData.doctor_info) {
              doctorSpecialty = providerData.doctor_info?.specialty?.name || "";
            } else if (
              "data" in providerData &&
              providerData.data &&
              "doctor_info" in providerData.data
            ) {
              doctorSpecialty =
                (providerData.data as any).doctor_info?.specialty?.name || "";
            }

            return {
              ...baseAddress,
              doctorPhoto: doctorPhoto, // Fallback olarak doktor fotoğrafı
              doctorName: doctorName || "",
              doctorSpecialty: doctorSpecialty,
            };
          }
          return baseAddress;
        }) || []
      );
    }, [providerData, isHospital, selectedDoctor, onList]);

    // Hastane detayında doktor listesi
    const hospitalDoctors = useMemo(() => {
      if (!isHospital || !providerData) {
        return [];
      }

      // Liste görünümünde Provider tipi direkt doctors'a sahip
      if (onList && "doctors" in providerData) {
        return ((providerData as any).doctors || []).map(
          (doctor: any) => doctor as ProviderData
        );
      }

      if (!isHospitalDetailData(providerData)) {
        // Fallback: direkt doctors property'sini kontrol et
        if ("doctors" in providerData) {
          return ((providerData as any).doctors || []).map(
            (doctor: any) => doctor as ProviderData
          );
        }
        return [];
      }

      const doctors =
        "doctors" in providerData
          ? providerData.doctors
          : providerData.data?.doctors;
      return (doctors || []).map((doctor: any) => doctor as ProviderData);
    }, [isHospital, providerData, onList]);

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
