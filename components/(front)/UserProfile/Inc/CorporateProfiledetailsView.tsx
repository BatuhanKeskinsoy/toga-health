"use client";
import React, { useState, useCallback, useMemo } from "react";
import CustomButton from "@/components/others/CustomButton";
import { MdBusiness, MdWork, MdLocationOn, MdVerified } from "react-icons/md";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import BasicInfoSection from "./CorporateSections/BasicInfoSection";
import CorporateInfoSection from "./CorporateSections/CorporateInfoSection";
import BranchesSection from "./CorporateSections/BranchesSection";
import WorkingHoursSection from "./CorporateSections/WorkingHoursSection";
import PricingSection from "./CorporateSections/PricingSection";
import CorporateServicesSection from "./CorporateSections/CorporateServicesSection";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { updateCorporateProfile } from "@/lib/services/user/updateProfile";

interface CorporateFormData {
  // Temel Bilgiler
  name: string;
  email: string;
  phone: string;
  address: string;
  country: Country | null;
  city: City | null;
  district: District | null;
  
  // Kurumsal Bilgiler
  type: string;
  experience: string;
  description: string;
  location: string;
  website: string;
  languages: string[];
  certifications: string[];
  facilities: string[];
  
  // Çalışma Saatleri
  working_hours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };
  
  // Hizmet Ücretleri
  services_pricing: {
    konsultasyon: string;
    muayene: string;
    ameliyat: string;
  };
  
  // Şubeler
  branches: Array<{
    name: string;
    address: string;
    phone: string;
  }>;
  
  // Hizmet Seçenekleri
  appointment_duration: string;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  "24_7_available": boolean;
  working_days: string[];
  is_verified: boolean;
}

type Props = {
  user: UserTypes & {
    corporate?: {
      type: string;
      experience: string;
      description: string;
      location: string;
      website: string;
      review_count: number;
      branches: Array<{
        name: string;
        address: string;
        phone: string;
      }>;
      facilities: string[];
      working_hours: {
        monday: { start: string; end: string };
        tuesday: { start: string; end: string };
        wednesday: { start: string; end: string };
        thursday: { start: string; end: string };
        friday: { start: string; end: string };
        saturday?: { start: string; end: string };
        sunday?: { start: string; end: string };
      };
      languages: string[];
      certifications: string[];
      services_pricing: {
        konsultasyon: number;
        muayene: number;
        ameliyat: number;
      };
      appointment_duration: number;
      online_consultation: boolean;
      home_visit: boolean;
      emergency_available: boolean;
      "24_7_available": boolean;
      working_days: string[];
      is_verified: boolean;
    };
  };
};


export default function CorporateProfiledetailsView({ user }: Props) {
  
  const [formData, setFormData] = useState<CorporateFormData>(() => ({
    // Temel Bilgiler
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    country: null, // TODO: Parse from user data if available
    city: null, // TODO: Parse from user data if available
    district: null, // TODO: Parse from user data if available
    
    // Kurumsal Bilgiler
    type: user.corporate?.type || "",
    experience: user.corporate?.experience || "",
    description: user.corporate?.description || "",
    location: user.corporate?.location || "",
    website: user.corporate?.website || "",
    languages: user.corporate?.languages || [],
    certifications: user.corporate?.certifications || [],
    facilities: user.corporate?.facilities || [],
    
    // Çalışma Saatleri
    working_hours: user.corporate?.working_hours || {
      monday: { start: "08:00", end: "18:00" },
      tuesday: { start: "08:00", end: "18:00" },
      wednesday: { start: "08:00", end: "18:00" },
      thursday: { start: "08:00", end: "18:00" },
      friday: { start: "08:00", end: "18:00" },
      saturday: { start: "08:00", end: "18:00" },
      sunday: { start: "08:00", end: "18:00" },
    },
    
    // Hizmet Ücretleri
    services_pricing: user.corporate?.services_pricing ? {
      konsultasyon: user.corporate.services_pricing.konsultasyon.toString(),
      muayene: user.corporate.services_pricing.muayene.toString(),
      ameliyat: user.corporate.services_pricing.ameliyat.toString(),
    } : {
      konsultasyon: "",
      muayene: "",
      ameliyat: "",
    },
    
    // Şubeler
    branches: user.corporate?.branches || [{ name: "", address: "", phone: "" }],
    
    // Hizmet Seçenekleri
    appointment_duration: user.corporate?.appointment_duration?.toString() || "30",
    online_consultation: user.corporate?.online_consultation || false,
    home_visit: user.corporate?.home_visit || false,
    emergency_available: user.corporate?.emergency_available || false,
    "24_7_available": user.corporate?.["24_7_available"] || false,
    working_days: user.corporate?.working_days || [],
    is_verified: user.corporate?.is_verified || false,
  }));

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Input change handler
  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    setErrors(prev => {
      if (prev[field]) {
        return {
          ...prev,
          [field]: "",
        };
      }
      return prev;
    });
  }, []);

  // Select change handler
  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Working hours change handler
  const handleWorkingHoursChange = useCallback((day: string, timeType: 'start' | 'end', value: string) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day as keyof typeof prev.working_hours],
          [timeType]: value,
        },
      },
    }));
  }, []);

  // Pricing change handler
  const handlePricingChange = useCallback((service: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      services_pricing: {
        ...prev.services_pricing,
        [service]: value,
      },
    }));
  }, []);

  // Branch change handler
  const handleBranchChange = useCallback((index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.map((branch, i) => 
        i === index ? { ...branch, [field]: value } : branch
      ),
    }));
  }, []);

  // Service change handler
  const handleServiceChange = useCallback((service: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [service]: value,
    }));
  }, []);

  // Location change handler
  const handleLocationChange = useCallback((location: {
    country: Country | null;
    city: City | null;
    district: District | null;
  }) => {
    setFormData(prev => ({
      ...prev,
      country: location.country,
      city: location.city,
      district: location.district,
    }));
  }, []);

  // Branch management
  const addBranch = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      branches: [...prev.branches, { name: "", address: "", phone: "" }],
    }));
  }, []);

  const removeBranch = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      branches: prev.branches.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convert form data to API format
      const apiData = {
        // Temel Bilgiler
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        country: formData.country?.name || null,
        city: formData.city?.name || null,
        district: formData.district?.name || null,
        
        // Kurumsal Bilgiler
        type: formData.type,
        experience: formData.experience,
        description: formData.description,
        location: formData.location,
        website: formData.website,
        languages: formData.languages,
        certifications: formData.certifications,
        facilities: formData.facilities,
        
        // Çalışma Saatleri
        working_hours: formData.working_hours,
        
        // Hizmet Ücretleri
        services_pricing: formData.services_pricing,
        
        // Şubeler
        branches: formData.branches,
        
        // Hizmet Seçenekleri
        appointment_duration: formData.appointment_duration,
        online_consultation: formData.online_consultation,
        home_visit: formData.home_visit,
        emergency_available: formData.emergency_available,
        "24_7_available": formData["24_7_available"],
        working_days: formData.working_days,
        is_verified: formData.is_verified,
      };

      console.log("Sending data:", apiData);
      
      // API call
      await updateCorporateProfile(apiData);
      
      // Show success message
      alert("Profil başarıyla güncellendi!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Profil güncellenirken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  // Selected values for selects
  const selectedCorporateType = useMemo(() => {
    const options = [
      { id: 1, name: "Hastane" },
      { id: 2, name: "Klinik" },
      { id: 3, name: "Sağlık Merkezi" },
      { id: 4, name: "Tıp Merkezi" },
      { id: 5, name: "Diş Kliniği" },
    ];
    return options.find(option => option.name === formData.type) || null;
  }, [formData.type]);


  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MdBusiness className="text-sitePrimary" />
            Kurumsal Profil Detayları
          </h2>
          <p className="text-gray-600 mt-1">Kurumsal profil bilgilerinizi güncelleyin</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Temel Bilgiler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdBusiness className="text-sitePrimary" />
              Temel Bilgiler
            </h3>
            <BasicInfoSection
              formData={{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                country: formData.country,
                city: formData.city,
                district: formData.district,
                website: formData.website,
                type: formData.type,
              }}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onLocationChange={handleLocationChange}
              selectedCorporateType={selectedCorporateType}
            />
          </section>

          {/* Kurumsal Bilgiler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdWork className="text-sitePrimary" />
              Kurumsal Bilgiler
            </h3>
            <CorporateInfoSection
              formData={{
                experience: formData.experience,
                description: formData.description,
                location: formData.location,
                appointment_duration: formData.appointment_duration,
              }}
              onInputChange={handleInputChange}
            />
          </section>

          {/* Şubeler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdLocationOn className="text-sitePrimary" />
              Şube Bilgileri
            </h3>
            <BranchesSection
              branches={formData.branches}
              onBranchChange={handleBranchChange}
              onAddBranch={addBranch}
              onRemoveBranch={removeBranch}
            />
          </section>

          {/* Çalışma Saatleri Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdWork className="text-sitePrimary" />
              Çalışma Saatleri
            </h3>
            <WorkingHoursSection
              working_hours={{
                ...formData.working_hours,
                saturday: formData.working_hours.saturday || { start: "08:00", end: "18:00" },
                sunday: formData.working_hours.sunday || { start: "08:00", end: "18:00" },
              }}
              onWorkingHoursChange={handleWorkingHoursChange}
            />
          </section>

          {/* Ücretler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdVerified className="text-sitePrimary" />
              Hizmet Ücretleri
            </h3>
            <PricingSection
              services_pricing={formData.services_pricing}
              onPricingChange={handlePricingChange}
            />
          </section>

          {/* Hizmetler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdVerified className="text-sitePrimary" />
              Hizmet Seçenekleri
            </h3>
            <CorporateServicesSection
              services={{
                online_consultation: formData.online_consultation,
                home_visit: formData.home_visit,
                emergency_available: formData.emergency_available,
                "24_7_available": formData["24_7_available"],
                is_verified: formData.is_verified,
              }}
              onServiceChange={handleServiceChange}
            />
          </section>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <CustomButton
              title={isLoading ? "Kaydediliyor..." : "Profili Güncelle"}
              btnType="submit"
              isDisabled={isLoading}
              containerStyles="bg-sitePrimary text-white px-8 py-3 rounded-md hover:bg-sitePrimary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </form>
      </div>
  );
}


