"use client";
import React, { useState, useEffect, useMemo } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import SpecialistSelector, { Specialist } from "@/components/(front)/Provider/SpecialistSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import { useAddressData } from "@/lib/hooks/address/useAddressData";

function ProviderSidebar({ isHospital }: { isHospital: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DoctorAddress | null>(
    null
  );
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  const {
    data,
    error,
    isLoading,
    getDefaultAddress,
    getActiveAddresses,
    doctor,
  } = useAddressData();

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hastane için örnek doktorlar
  const hospitalSpecialists: Specialist[] = [
    {
      id: "dr-001",
      name: "Dr. Ahmet Yılmaz",
      specialty: "Kardiyoloji",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
      rating: 4.2,
      experience: "15 yıl",
      isAvailable: true,
    },
    {
      id: "dr-002",
      name: "Dr. Fatma Demir",
      specialty: "Nöroloji",
      photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=120&h=120&fit=crop&crop=face",
      rating: 4.5,
      experience: "12 yıl",
      isAvailable: true,
    },
    {
      id: "dr-003",
      name: "Dr. Mehmet Kaya",
      specialty: "Ortopedi",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=120&h=120&fit=crop&crop=face",
      rating: 4.1,
      experience: "18 yıl",
      isAvailable: true,
    },
    {
      id: "dr-004",
      name: "Dr. Ayşe Özkan",
      specialty: "Onkoloji",
      photo: "https://images.unsplash.com/photo-1551601651-bc60f254d532?w=120&h=120&fit=crop&crop=face",
      rating: 4.7,
      experience: "20 yıl",
      isAvailable: true,
    },
  ];

  // İlk uzmanı varsayılan olarak seç (sadece hastane ise)
  useEffect(() => {
    if (isHospital && hospitalSpecialists.length > 0 && !selectedSpecialist) {
      setSelectedSpecialist(hospitalSpecialists[0]);
    }
  }, [isHospital, hospitalSpecialists.length]);

  // Varsayılan adresi hemen seç ve hastane için doktor değiştiğinde güncelle
  useEffect(() => {
    if (data?.addresses) {
      const defaultAddress = getDefaultAddress();
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
        } else if (!isHospital) {
          // Normal doktor için mevcut doktor bilgilerini kullan
          addressWithDoctorInfo = {
            ...defaultAddress,
            doctorPhoto: doctor?.photo,
            doctorName: doctor?.name || "Dr. Ahmet Yılmaz",
            doctorSpecialty: doctor?.specialty || "Kardiyoloji",
          };
        }

        if (addressWithDoctorInfo) {
          setSelectedAddress(addressWithDoctorInfo);
        }
      }
    }
  }, [data, doctor, isHospital, selectedSpecialist, getDefaultAddress]);

  // selectedAddress değişikliklerini takip et
  useEffect(() => {
    if (selectedAddress && selectedAddress.id) {
      console.log("ProviderSidebar - Rendering AppointmentTimes with selectedAddressId:", selectedAddress.id);
    } else {
      console.log("ProviderSidebar - No selectedAddress, showing message");
    }
  }, [selectedAddress]);

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

  // Adresleri doktor bilgileri ile birleştir (useMemo ile optimize edildi)
  const addressesWithDoctorInfo = useMemo(() => {
    const activeAddresses = getActiveAddresses();
    return activeAddresses.map((address) => {
      if (isHospital && selectedSpecialist) {
        // Hastane için seçilen doktorun bilgilerini kullan
        return {
          ...address,
          doctorPhoto: selectedSpecialist.photo,
          doctorName: selectedSpecialist.name,
          doctorSpecialty: selectedSpecialist.specialty,
        };
      } else {
        // Normal doktor için mevcut doktor bilgilerini kullan
        return {
          ...address,
          doctorPhoto: doctor?.photo,
          doctorName: doctor?.name || "Dr. Ahmet Yılmaz",
          doctorSpecialty: doctor?.specialty || "Kardiyoloji",
        };
      }
    });
  }, [getActiveAddresses, isHospital, selectedSpecialist, doctor]);

  if (error) {
    return (
      <aside className="w-full shadow-lg shadow-gray-200 rounded-md">
        <div className="bg-white p-4">
          <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">
              {isHospital ? "Hastane" : "Adres"} bilgileri yüklenirken hata oluştu
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
      <div className="bg-white w-full p-4">
        {isHospital && (
          <div className="mb-4">
            <SpecialistSelector
              specialists={hospitalSpecialists}
              selectedSpecialist={selectedSpecialist}
              onSpecialistSelect={handleSpecialistSelect}
              isLoading={isLoading}
            />
          </div>
        )}

        <AddressSelector
          addresses={addressesWithDoctorInfo}
          selectedAddress={selectedAddress}
          onAddressSelect={handleAddressSelect}
          isLoading={isLoading}
          isHospital={isHospital}
        />

        {selectedAddress && selectedAddress.id && (
          <div className="mt-4">
            <AppointmentTimes
              onExpandedChange={setIsExpanded}
              selectedAddressId={selectedAddress.id}
            />
          </div>
        )}

        {!selectedAddress && !isLoading && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-500 text-sm">
              {isHospital 
                ? "Randevu saatlerini görmek için lütfen bir doktor seçiniz."
                : "Randevu saatlerini görmek için lütfen bir adres seçiniz."
              }
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ProviderSidebar;
