"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import { MdWork, MdLocationOn } from "react-icons/md";

interface CorporateInfoSectionProps {
  formData: {
    experience: string;
    description: string;
    location: string;
    appointment_duration: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export default function CorporateInfoSection({
  formData,
  onInputChange,
}: CorporateInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomInput
          label="Deneyim"
          name="experience"
          value={formData.experience}
          onChange={(e) => onInputChange("experience", e.target.value)}
          icon={<MdWork />}
        />
        
        <CustomInput
          label="Randevu Süresi (Dakika)"
          name="appointment_duration"
          type="number"
          value={formData.appointment_duration}
          onChange={(e) => onInputChange("appointment_duration", e.target.value)}
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
          name="location"
          value={formData.location}
          onChange={(e) => onInputChange("location", e.target.value)}
          icon={<MdLocationOn />}
        />
      </div>
    </div>
  );
}
