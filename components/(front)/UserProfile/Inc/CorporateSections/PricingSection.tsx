"use client";
import React from "react";
import { CustomInput } from "@/components/others/CustomInput";
import { MdVerified } from "react-icons/md";

interface PricingSectionProps {
  services_pricing: {
    konsultasyon: string;
    muayene: string;
    ameliyat: string;
  };
  onPricingChange: (service: string, value: string) => void;
}

export default function PricingSection({
  services_pricing,
  onPricingChange,
}: PricingSectionProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium text-gray-900 mb-4">Hizmet Ücretleri</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CustomInput
          label="Konsültasyon (₺)"
          name="konsultasyon"
          type="number"
          value={services_pricing.konsultasyon}
          onChange={(e) => onPricingChange("konsultasyon", e.target.value)}
          icon={<MdVerified />}
        />
        
        <CustomInput
          label="Muayene (₺)"
          name="muayene"
          type="number"
          value={services_pricing.muayene}
          onChange={(e) => onPricingChange("muayene", e.target.value)}
          icon={<MdVerified />}
        />
        
        <CustomInput
          label="Ameliyat (₺)"
          name="ameliyat"
          type="number"
          value={services_pricing.ameliyat}
          onChange={(e) => onPricingChange("ameliyat", e.target.value)}
          icon={<MdVerified />}
        />
      </div>
    </div>
  );
}
