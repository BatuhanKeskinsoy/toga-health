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

const ProviderSidebar = React.memo<ProviderSidebarProps>(
  ({ isHospital, providerData, providerError }) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedAddress, setSelectedAddress] =
      useState<DoctorAddress | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<ProviderData | null>(
      null
    );
    const t = useTranslations();

    // Client-side mounting kontrolü
    useEffect(() => {
      setIsMounted(true);
    }, []);

    // Hastane detayında: İlk doktoru varsayılan olarak seç
    useEffect(() => {
      if (
        isHospital &&
        providerData &&
        isHospitalDetailData(providerData) &&
        !selectedDoctor
      ) {
        const doctors =
          "doctors" in providerData
            ? providerData.doctors
            : providerData.data?.doctors;
        if (doctors && Array.isArray(doctors) && doctors.length > 0) {
          setSelectedDoctor(doctors[0] as any);
        }
      }
    }, [isHospital, providerData, selectedDoctor]);

    // Doktor detayında: Varsayılan adresi seç
    // Hastane detayında: Varsayılan adresi seç (hastanenin adresi)
    useEffect(() => {
      if (!providerData) return;

      const getAddresses = () => {
        if (isHospital && isHospitalDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
        } else if (!isHospital && isDoctorDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
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
    }, [providerData, isHospital]);

    // Animasyon trigger
    useEffect(() => {
      const handleAnimationTrigger = () => {
        if (isMounted) {
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
    }, [isMounted]);

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
        if (isHospital && isHospitalDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
        } else if (!isHospital && isDoctorDetailData(providerData)) {
          return "addresses" in providerData
            ? providerData.addresses
            : providerData.data?.addresses;
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
          } else if (
            !isHospital &&
            providerData &&
            isDoctorDetailData(providerData)
          ) {
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
    }, [providerData, isHospital, selectedDoctor]);

    // Hastane detayında doktor listesi
    const hospitalDoctors = useMemo(() => {
      if (!isHospital || !providerData || !isHospitalDetailData(providerData)) {
        return [];
      }
      const doctors =
        "doctors" in providerData
          ? providerData.doctors
          : providerData.data?.doctors;
      return (doctors || []).map((doctor: any) => doctor as ProviderData);
    }, [isHospital, providerData]);

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
        className={`w-full shadow-lg shadow-gray-200 rounded-md transition-all duration-500 ${
          !isExpanded ? "sticky top-4" : ""
        }`}
      >
        <div className="bg-sitePrimary text-white p-4 rounded-t-md text-center">
          <h3 className="text-2xl font-semibold">{t("Randevu Al")}</h3>
          <p className="text-sm opacity-90 mt-1">
            {t("Hemen ücretsiz randevu oluşturun")}
          </p>
        </div>

        <div className="bg-white w-full p-4">
          {/* Hastane detayında: Doktor seçimi */}
          {isHospital && (
            <div className="mb-4">
              <DoctorSelector
                doctors={hospitalDoctors}
                selectedDoctor={selectedDoctor}
                onDoctorSelect={handleDoctorSelectChange}
                isLoading={false}
              />
            </div>
          )}

          {/* Doktor detayında: Adres seçimi */}
          {!isHospital && (
            <div className="mb-4">
              <AddressSelector
                addresses={addressesWithDoctorInfo}
                selectedAddress={selectedAddress}
                onAddressSelect={handleAddressSelect}
                isLoading={false}
                isHospital={isHospital}
              />
            </div>
          )}

          {/* Randevu saatlerini göster */}
          {((isHospital && selectedDoctor) ||
            (!isHospital && selectedAddress && selectedAddress.id)) && (
            <div className="mt-4">
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
                {t("Randevu saatlerini görmek için lütfen bir adres seçiniz")}
              </p>
            </div>
          )}
        </div>
      </aside>
    );
  }
);

export default ProviderSidebar;
