"use client";
import React, { useState, useEffect } from "react";
import AppointmentTimes from "@/components/(front)/Provider/AppointmentTimes/AppointmentTimes";
import AddressSelector from "@/components/(front)/Provider/AddressSelector/AddressSelector";
import SpecialistSelector, { Specialist } from "@/components/(front)/Provider/SpecialistSelector";
import { DoctorAddress } from "@/lib/types/others/addressTypes";
import { useAddressData } from "@/lib/hooks/address/useAddressData";

function ProviderSidebar({ isHospital }: { isHospital: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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

  // Örnek uzman verileri (gerçek uygulamada API'den gelecek)
  const hospitalSpecialists: Specialist[] = [
    {
      id: "doc-001",
      name: "Dr. Ahmet Yılmaz",
      specialty: "Kardiyoloji",
      photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      rating: 4.8,
      experience: "15 yıl deneyim",
      isAvailable: true,
    },
    {
      id: "doc-002",
      name: "Dr. Fatma Demir",
      specialty: "Nöroloji",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      rating: 4.9,
      experience: "12 yıl deneyim",
      isAvailable: true,
    },
    {
      id: "doc-003",
      name: "Dr. Mehmet Kaya",
      specialty: "Ortopedi",
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
      rating: 4.7,
      experience: "18 yıl deneyim",
      isAvailable: true,
    },
    {
      id: "doc-004",
      name: "Dr. Ayşe Özkan",
      specialty: "Dermatoloji",
      photo: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
      rating: 4.6,
      experience: "10 yıl deneyim",
      isAvailable: true,
    },
    {
      id: "doc-005",
      name: "Dr. Ali Çelik",
      specialty: "Göz Hastalıkları",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      rating: 4.5,
      experience: "8 yıl deneyim",
      isAvailable: true,
    },
    {
      id: "doc-006",
      name: "Dr. Zeynep Arslan",
      specialty: "Kadın Hastalıkları",
      photo: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
      rating: 4.9,
      experience: "14 yıl deneyim",
      isAvailable: true,
    },
  ];

  // Varsayılan adresi hemen seç
  useEffect(() => {
    if (data?.addresses && !selectedAddress) {
      const defaultAddress = getDefaultAddress();
      if (defaultAddress) {
        // Doktor bilgileri ile birleştir
        const addressWithDoctorInfo = {
          ...defaultAddress,
          doctorPhoto: doctor?.photo,
          doctorName: doctor?.name || (isHospital ? "Özel Memorial Hastanesi" : "Dr. Ahmet Yılmaz"),
          doctorSpecialty: doctor?.specialty || (isHospital ? "Çok Disiplinli Hastane" : "Kardiyoloji"),
        };
        setSelectedAddress(addressWithDoctorInfo);
      }
    }
  }, [data, doctor, selectedAddress, getDefaultAddress, isHospital]);

  // İlk uzmanı varsayılan olarak seç (sadece hastane ise)
  useEffect(() => {
    if (isHospital && hospitalSpecialists.length > 0 && !selectedSpecialist) {
      setSelectedSpecialist(hospitalSpecialists[0]);
    }
  }, [isHospital, selectedSpecialist]);

  useEffect(() => {
    const handleAnimationTrigger = () => {
      setIsAnimating(true);

      if (window.innerWidth < 1024) {
        const sidebar = document.querySelector("[data-sidebar]");
        if (sidebar) {
          sidebar.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
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
  }, []);

  const handleAddressSelect = (address: DoctorAddress) => {
    console.log("ProviderSidebar - Adres seçildi:", address);
    setSelectedAddress(address);
  };

  const handleSpecialistSelect = (specialist: Specialist) => {
    console.log("ProviderSidebar - Uzman seçildi:", specialist);
    setSelectedSpecialist(specialist);
  };

  // Adresleri doktor bilgileri ile birleştir
  const addressesWithDoctorInfo = getActiveAddresses().map((address) => ({
    ...address,
    doctorPhoto: doctor?.photo,
    doctorName: doctor?.name || (isHospital ? "Özel Memorial Hastanesi" : "Dr. Ahmet Yılmaz"),
    doctorSpecialty: doctor?.specialty || (isHospital ? "Çok Disiplinli Hastane" : "Kardiyoloji"),
  }));

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
      className={`w-full shadow-lg shadow-gray-200 transition-all duration-500 ease-in-out ${
        isExpanded ? "" : "sticky top-4"
      }`}
    >
      <div className="flex flex-col gap-4">
        <div
          className={`flex flex-col items-center overflow-hidden rounded-md transition-all duration-700 ${
            isAnimating
              ? "ring-4 ring-sitePrimary/40 shadow-2xl shadow-sitePrimary/40 scale-[1.01] animate-pulse"
              : ""
          }`}
        >
          <div
            className={`flex flex-col gap-1 items-center justify-center text-white text-xl font-medium tracking-wide py-3 w-full transition-all duration-700 ${
              isAnimating
                ? "bg-gradient-to-r from-sitePrimary via-sitePrimary/80 to-sitePrimary animate-pulse"
                : "bg-sitePrimary"
            }`}
          >
            <span>{isHospital ? "Hastane Randevusu" : "Randevu Oluştur"}</span>
            <span className="text-sm opacity-80">
              {isHospital 
                ? "Hastanemizde ücretsiz randevu oluşturabilirsiniz" 
                : "Ücretsiz olarak randevu oluşturabilirsiniz"
              }
            </span>
          </div>
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
                    ? "Randevu saatlerini görmek için lütfen bir şube seçiniz."
                    : "Randevu saatlerini görmek için lütfen bir adres seçiniz."
                  }
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
