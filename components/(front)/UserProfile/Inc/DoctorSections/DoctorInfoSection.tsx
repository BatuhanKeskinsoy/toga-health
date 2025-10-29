"use client";
import React from "react";
import CustomInput from "@/components/Customs/CustomInput";
import CustomSelect from "@/components/Customs/CustomSelect";
import { MdWork, MdLocationOn, MdVerified } from "react-icons/md";

interface DoctorInfoSectionProps {
  formData: {
    type: string;
    specialty_id: string;
    experience: string;
    description: string;
    map_location: string;
    consultation_fee: string;
    examination_fee: string;
    appointment_duration: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSelectChange: (field: string, value: string) => void;
  selectedDoctorType: { id: number; name: string } | null;
  selectedSpecialty: { id: number; name: string } | null;
  selectedAppointmentDuration: { id: number; name: string } | null;
}

const DOCTOR_TYPE_OPTIONS = [
  { id: 1, name: "Uzman Doktor" },
  { id: 2, name: "Pratisyen Doktor" },
  { id: 3, name: "Cerrahi Uzmanı" },
];

const SPECIALTY_OPTIONS = [
  { id: 1, name: "Kardiyoloji" },
  { id: 2, name: "Nöroloji" },
  { id: 3, name: "Ortopedi" },
  { id: 4, name: "Dermatoloji" },
  { id: 5, name: "Göz Hastalıkları" },
];

const APPOINTMENT_DURATION_OPTIONS = [
  { id: 15, name: "15 dakika" },
  { id: 20, name: "20 dakika" },
  { id: 30, name: "30 dakika" },
  { id: 45, name: "45 dakika" },
  { id: 60, name: "60 dakika" },
  { id: 90, name: "90 dakika" },
  { id: 120, name: "120 dakika" },
];

export default function DoctorInfoSection({
  formData,
  onInputChange,
  onSelectChange,
  selectedDoctorType,
  selectedSpecialty,
  selectedAppointmentDuration,
}: DoctorInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomSelect
          id="type"
          name="type"
          label="Doktor Türü"
          value={selectedDoctorType}
          options={DOCTOR_TYPE_OPTIONS}
          onChange={(option) => onSelectChange("type", option?.name || "")}
          icon={<MdWork />}
          required
        />
        
        <CustomSelect
          id="specialty"
          name="specialty"
          label="Uzmanlık Alanı"
          value={selectedSpecialty}
          options={SPECIALTY_OPTIONS}
          onChange={(option) => onSelectChange("specialty_id", option?.id.toString() || "")}
          icon={<MdVerified />}
          required
        />
        
        <CustomInput
          label="Deneyim (Yıl)"
          name="experience"
          type="number"
          value={formData.experience}
          onChange={(e) => onInputChange("experience", e.target.value)}
          icon={<MdWork />}
        />
        
        <CustomInput
          label="Konsültasyon Ücreti (₺)"
          name="consultation_fee"
          type="number"
          value={formData.consultation_fee}
          onChange={(e) => onInputChange("consultation_fee", e.target.value)}
          icon={<MdWork />}
        />
        
        <CustomInput
          label="Muayene Ücreti (₺)"
          name="examination_fee"
          type="number"
          value={formData.examination_fee}
          onChange={(e) => onInputChange("examination_fee", e.target.value)}
          icon={<MdWork />}
        />
        
        <CustomSelect
          id="appointment_duration"
          name="appointment_duration"
          label="Randevu Süresi"
          value={selectedAppointmentDuration}
          options={APPOINTMENT_DURATION_OPTIONS}
          onChange={(option) => onSelectChange("appointment_duration", option?.id.toString() || "")}
          icon={<MdWork />}
        />
      </div>
      
      <div className="space-y-2">
        <CustomInput
          label="Açıklama"
          name="description"
          value={formData.description}
          onChange={(e) => onInputChange("description", e.target.value)}
          icon={<MdWork />}
        />
        
        <CustomInput
          label="Konum"
          name="map_location"
          value={formData.map_location}
          onChange={(e) => onInputChange("map_location", e.target.value)}
          icon={<MdLocationOn />}
        />
      </div>
    </div>
  );
}
