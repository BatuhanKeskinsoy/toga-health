"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import { CustomDatePicker } from "@/components/others/CustomDatePicker";
import CustomSelect from "@/components/others/CustomSelect";
import SelectLocation from "@/components/(front)/Search/SelectLocation";
import { MdPerson, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";

interface PersonalInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    birth_date: string;
    gender: string;
    address: string;
    country: Country | null;
    city: City | null;
    district: District | null;
  };
  onInputChange: (field: string, value: string) => void;
  onSelectChange: (field: string, value: string) => void;
  onLocationChange: (location: {
    country: Country | null;
    city: City | null;
    district: District | null;
  }) => void;
  selectedGender: { id: number; name: string } | null;
}

const GENDER_OPTIONS = [
  { id: 1, name: "Erkek", value: "male" },
  { id: 2, name: "Kadın", value: "female" },
  { id: 3, name: "Diğer", value: "other" },
];

export default function PersonalInfoSection({
  formData,
  onInputChange,
  onSelectChange,
  onLocationChange,
  selectedGender,
}: PersonalInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CustomInput
        label="Ad Soyad"
        name="name"
        value={formData.name}
        onChange={(e) => onInputChange("name", e.target.value)}
        required
        icon={<MdPerson />}
      />
      
      <CustomInput
        label="E-posta"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => onInputChange("email", e.target.value)}
        required
        icon={<MdEmail />}
      />
      
      <CustomInput
        label="Telefon"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => onInputChange("phone", e.target.value)}
        required
        icon={<MdPhone />}
      />
      
      <CustomDatePicker
        label="Doğum Tarihi"
        name="birth_date"
        value={formData.birth_date}
        onChange={(e) => onInputChange("birth_date", e.target.value)}
      />
      
      <CustomSelect
        id="gender"
        name="gender"
        label="Cinsiyet"
        value={selectedGender}
        options={GENDER_OPTIONS}
        onChange={(option) => onSelectChange("gender", (option as any)?.value || "")}
        icon={<MdPerson />}
      />
      
      <CustomInput
        label="Adres"
        name="address"
        value={formData.address}
        onChange={(e) => onInputChange("address", e.target.value)}
        icon={<MdLocationOn />}
      />
      
      <div className="md:col-span-2 relative">
        <SelectLocation
          value={{
            country: formData.country,
            city: formData.city,
            district: formData.district,
          }}
          onChange={onLocationChange}
          placeholder="Konum seçiniz"
          required
        />
      </div>
    </div>
  );
}
