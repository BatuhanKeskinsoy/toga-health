"use client";
import React from "react";

interface ServicesSectionProps {
  services: {
    online_consultation: boolean;
    home_visit: boolean;
    emergency_available: boolean;
  };
  onServiceChange: (service: string, value: boolean) => void;
}

export default function ServicesSection({
  services,
  onServiceChange,
}: ServicesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Hizmet Seçenekleri</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={services.online_consultation}
              onChange={(e) => onServiceChange("online_consultation", e.target.checked)}
              className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary/50"
            />
            <span className="text-sm text-gray-700">Online Konsültasyon</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={services.home_visit}
              onChange={(e) => onServiceChange("home_visit", e.target.checked)}
              className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary/50"
            />
            <span className="text-sm text-gray-700">Evde Muayene</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={services.emergency_available}
              onChange={(e) => onServiceChange("emergency_available", e.target.checked)}
              className="rounded border-gray-300 text-sitePrimary focus:ring-sitePrimary/50"
            />
            <span className="text-sm text-gray-700">Acil Müsaitlik</span>
          </label>
        </div>
      </div>
    </div>
  );
}
