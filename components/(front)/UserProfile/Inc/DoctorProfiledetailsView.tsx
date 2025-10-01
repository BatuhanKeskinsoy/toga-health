"use client";
import React, { useState, useCallback, useMemo } from "react";
import CustomButton from "@/components/others/CustomButton";
import { MdPerson, MdWork, MdSchool, MdVerified } from "react-icons/md";
import type { UserTypes } from "@/lib/types/user/UserTypes";
import PersonalInfoSection from "./DoctorSections/PersonalInfoSection";
import DoctorInfoSection from "./DoctorSections/DoctorInfoSection";
import EducationSection from "./DoctorSections/EducationSection";
import ExperienceSection from "./DoctorSections/ExperienceSection";
import ServicesSection from "./DoctorSections/ServicesSection";
import WorkingHoursSection from "./DoctorSections/WorkingHoursSection";
import ImageGallerySection from "./DoctorSections/ImageGallerySection";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";
import { updateDoctorProfile } from "@/lib/services/user/updateProfile";

interface DoctorFormData {
  // Kişisel Bilgiler
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  gender: string;
  address: string;
  country: Country | null;
  city: City | null;
  district: District | null;
  
  // Doktor Bilgileri
  type: string;
  specialty_id: string;
  experience: string;
  description: string;
  map_location: string;
  languages: string[];
  certifications: string[];
  consultation_fee: string;
  examination_fee: string;
  appointment_duration: string;
  online_consultation: boolean;
  home_visit: boolean;
  emergency_available: boolean;
  working_days: string[];
  
  // Çalışma Saatleri
  working_hours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday: { open: string; close: string };
    sunday: { open: string; close: string } | { closed: boolean };
  };
  
  // Fotoğraf Galerisi
  images: any[];
  
  // Eğitim
  education: Array<{
    degree: string;
    university: string;
    year: string;
  }>;
  
  // Deneyim
  experience_list: Array<{
    position: string;
    hospital: string;
    start_date: string;
    end_date: string;
  }>;
}

type Props = {
  user: UserTypes & {
    doctor?: {
      type: string;
      specialty_id: number;
      experience: string;
      description: string;
      location: string;
      map_location: string;
      review_count: number;
      education: Array<{
        degree: string;
        university: string;
        year: number;
      }>;
      experience_list: Array<{
        position: string;
        hospital: string;
        start_date: string;
        end_date: string | null;
      }>;
      languages: string[];
      certifications: string[];
      consultation_fee: number;
      examination_fee: number;
      appointment_duration: number;
      online_consultation: boolean;
      home_visit: boolean;
      emergency_available: boolean;
      working_days: string[];
      working_hours: {
        monday: { open: string; close: string };
        tuesday: { open: string; close: string };
        wednesday: { open: string; close: string };
        thursday: { open: string; close: string };
        friday: { open: string; close: string };
        saturday: { open: string; close: string };
        sunday: { open: string; close: string } | { closed: boolean };
      };
    };
  };
};


export default function DoctorProfiledetailsView({ user }: Props) {
  
  const [formData, setFormData] = useState<DoctorFormData>(() => ({
    // Kişisel Bilgiler
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    birth_date: user.birth_date || "",
    gender: user.gender || "",
    address: user.address || "",
    country: null, // TODO: Parse from user data if available
    city: null, // TODO: Parse from user data if available
    district: null, // TODO: Parse from user data if available
    
    // Doktor Bilgileri
    type: user.doctor?.type || "",
    specialty_id: user.doctor?.specialty_id?.toString() || "",
    experience: user.doctor?.experience || "",
    description: user.doctor?.description || "",
    map_location: user.doctor?.map_location || "",
    languages: user.doctor?.languages || [],
    certifications: user.doctor?.certifications || [],
    consultation_fee: user.doctor?.consultation_fee?.toString() || "",
    examination_fee: user.doctor?.examination_fee?.toString() || "",
    appointment_duration: user.doctor?.appointment_duration?.toString() || "30",
    online_consultation: user.doctor?.online_consultation || false,
    home_visit: user.doctor?.home_visit || false,
    emergency_available: user.doctor?.emergency_available || false,
    working_days: user.doctor?.working_days || [],
    
    // Çalışma Saatleri
    working_hours: user.doctor?.working_hours || {
      monday: { open: "08:00", close: "20:00" },
      tuesday: { open: "08:00", close: "20:00" },
      wednesday: { open: "08:00", close: "20:00" },
      thursday: { open: "08:00", close: "20:00" },
      friday: { open: "08:00", close: "20:00" },
      saturday: { open: "09:00", close: "18:00" },
      sunday: { closed: true },
    },
    
    // Fotoğraf Galerisi
    images: (user.doctor as any)?.images || [],
    
    // Eğitim
    education: user.doctor?.education?.map(edu => ({
      degree: edu.degree,
      university: edu.university,
      year: edu.year.toString(),
    })) || [{ degree: "", university: "", year: "" }],
    
    // Deneyim
    experience_list: user.doctor?.experience_list?.map(exp => ({
      position: exp.position,
      hospital: exp.hospital,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
    })) || [{ position: "", hospital: "", start_date: "", end_date: "" }],
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
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  }, [errors]);

  // Select change handler
  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Education array change handler
  const handleEducationChange = useCallback((index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  // Experience array change handler
  const handleExperienceChange = useCallback((index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience_list: prev.experience_list.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
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

  // Working hours change handler
  const handleWorkingHoursChange = useCallback((day: string, timeType: 'open' | 'close' | 'closed', value: string | boolean) => {
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

  // Array field update handler
  const handleArrayFieldUpdate = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Education management
  const addEducationItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: "", university: "", year: "" }],
    }));
  }, []);

  const removeEducationItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  // Experience management
  const addExperienceItem = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      experience_list: [...prev.experience_list, { position: "", hospital: "", start_date: "", end_date: "" }],
    }));
  }, []);

  const removeExperienceItem = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      experience_list: prev.experience_list.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Convert form data to API format
      const apiData = {
        // Kişisel Bilgiler
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birth_date,
        gender: formData.gender,
        address: formData.address,
        country: formData.country?.name || null,
        city: formData.city?.name || null,
        district: formData.district?.name || null,
        
        // Doktor Bilgileri
        type: formData.type,
        specialty_id: formData.specialty_id,
        experience: formData.experience,
        description: formData.description,
        map_location: formData.map_location,
        languages: formData.languages,
        certifications: formData.certifications,
        consultation_fee: formData.consultation_fee,
        examination_fee: formData.examination_fee,
        appointment_duration: formData.appointment_duration,
        online_consultation: formData.online_consultation,
        home_visit: formData.home_visit,
        emergency_available: formData.emergency_available,
        working_days: formData.working_days,
        
        // Çalışma Saatleri
        working_hours: formData.working_hours,
        
        // Eğitim
        education: formData.education,
        
        // Deneyim
        experience_list: formData.experience_list,
      };

      console.log("Sending data:", apiData);
      
      // API call
      await updateDoctorProfile(apiData);
      
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
  const selectedGender = useMemo(() => {
    const options = [
      { id: 1, name: "Erkek", value: "male" },
      { id: 2, name: "Kadın", value: "female" },
      { id: 3, name: "Diğer", value: "other" },
    ];
    return options.find(option => option.value === formData.gender) || null;
  }, [formData.gender]);

  const selectedDoctorType = useMemo(() => {
    const options = [
      { id: 1, name: "Uzman Doktor" },
      { id: 2, name: "Pratisyen Doktor" },
      { id: 3, name: "Cerrahi Uzmanı" },
    ];
    return options.find(option => option.name === formData.type) || null;
  }, [formData.type]);

  const selectedSpecialty = useMemo(() => {
    const options = [
      { id: 1, name: "Kardiyoloji" },
      { id: 2, name: "Nöroloji" },
      { id: 3, name: "Ortopedi" },
      { id: 4, name: "Dermatoloji" },
      { id: 5, name: "Göz Hastalıkları" },
    ];
    return options.find(option => option.id.toString() === formData.specialty_id) || null;
  }, [formData.specialty_id]);

  const selectedAppointmentDuration = useMemo(() => {
    const options = [
      { id: 15, name: "15 dakika" },
      { id: 20, name: "20 dakika" },
      { id: 30, name: "30 dakika" },
      { id: 45, name: "45 dakika" },
      { id: 60, name: "60 dakika" },
      { id: 90, name: "90 dakika" },
      { id: 120, name: "120 dakika" },
    ];
    return options.find(option => option.id.toString() === formData.appointment_duration) || null;
  }, [formData.appointment_duration]);


  return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MdWork className="text-sitePrimary" />
            Doktor Profil Detayları
          </h2>
          <p className="text-gray-600 mt-1">Profil bilgilerinizi güncelleyin</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Kişisel Bilgiler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdPerson className="text-sitePrimary" />
              Kişisel Bilgiler
            </h3>
            <PersonalInfoSection
              formData={{
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                birth_date: formData.birth_date,
                gender: formData.gender,
                address: formData.address,
                country: formData.country,
                city: formData.city,
                district: formData.district,
              }}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onLocationChange={handleLocationChange}
              selectedGender={selectedGender}
            />
          </section>

          {/* Doktor Bilgileri Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdWork className="text-sitePrimary" />
              Doktor Bilgileri
            </h3>
            <DoctorInfoSection
              formData={{
                type: formData.type,
                specialty_id: formData.specialty_id,
                experience: formData.experience,
                description: formData.description,
                map_location: formData.map_location,
                consultation_fee: formData.consultation_fee,
                examination_fee: formData.examination_fee,
                appointment_duration: formData.appointment_duration,
              }}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              selectedDoctorType={selectedDoctorType}
              selectedSpecialty={selectedSpecialty}
              selectedAppointmentDuration={selectedAppointmentDuration}
            />
          </section>

          {/* Eğitim Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdSchool className="text-sitePrimary" />
              Eğitim Bilgileri
            </h3>
            <EducationSection
              education={formData.education}
              onArrayChange={handleEducationChange}
              onAddItem={addEducationItem}
              onRemoveItem={removeEducationItem}
            />
          </section>

          {/* Deneyim Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdWork className="text-sitePrimary" />
              Deneyim Bilgileri
            </h3>
            <ExperienceSection
              experience_list={formData.experience_list}
              onArrayChange={handleExperienceChange}
              onAddItem={addExperienceItem}
              onRemoveItem={removeExperienceItem}
            />
          </section>

          {/* Hizmetler Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdVerified className="text-sitePrimary" />
              Hizmet Seçenekleri
            </h3>
            <ServicesSection
              services={{
                online_consultation: formData.online_consultation,
                home_visit: formData.home_visit,
                emergency_available: formData.emergency_available,
              }}
              onServiceChange={handleServiceChange}
            />
          </section>

          {/* Çalışma Saatleri Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MdWork className="text-sitePrimary" />
              Çalışma Saatleri
            </h3>
            <WorkingHoursSection
              working_hours={formData.working_hours}
              onWorkingHoursChange={handleWorkingHoursChange}
            />
          </section>

          {/* Fotoğraf Galerisi Section */}
          <section className="space-y-4">
            <ImageGallerySection
              formData={{
                images: formData.images,
              }}
              updateArrayField={handleArrayFieldUpdate}
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


