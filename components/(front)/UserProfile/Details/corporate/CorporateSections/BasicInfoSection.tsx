"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import CustomSelect from "@/components/others/CustomSelect";
import SelectLocation from "@/components/(front)/Search/SelectLocation";
import { MdBusiness, MdEmail, MdPhone, MdLocationOn, MdWeb } from "react-icons/md";
import { Country, City, District } from "@/lib/types/locations/locationsTypes";

interface BasicInfoSectionProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    country: Country | null;
    city: City | null;
    district: District | null;
    website: string;
    type: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSelectChange: (field: string, value: string) => void;
  onLocationChange: (location: {
    country: Country | null;
    city: City | null;
    district: District | null;
  }) => void;
  selectedCorporateType: { id: number; name: string } | null;
}

const CORPORATE_TYPE_OPTIONS = [
  { id: 1, name: "Hastane" },
  { id: 2, name: "Klinik" },
  { id: 3, name: "Sağlık Merkezi" },
  { id: 4, name: "Tıp Merkezi" },
  { id: 5, name: "Diş Kliniği" },
];

export default function BasicInfoSection({
  formData,
  onInputChange,
  onSelectChange,
  onLocationChange,
  selectedCorporateType,
}: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CustomInput
        label="Kurum Adı"
        name="name"
        value={formData.name}
        onChange={(e) => onInputChange("name", e.target.value)}
        required
        icon={<MdBusiness />}
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
      
      <CustomInput
        label="Website"
        name="website"
        type="url"
        value={formData.website}
        onChange={(e) => onInputChange("website", e.target.value)}
        icon={<MdWeb />}
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
      
      <CustomSelect
        id="type"
        name="type"
        label="Kurum Türü"
        value={selectedCorporateType}
        options={CORPORATE_TYPE_OPTIONS}
        onChange={(option) => onSelectChange("type", option?.name || "")}
        icon={<MdBusiness />}
        required
      />
    </div>
  );
}
