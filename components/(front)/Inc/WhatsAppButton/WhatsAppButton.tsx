"use client";
import React from "react";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { SettingsResponse, SettingsData } from "@/lib/types/settings/settingsTypes";
import { useTranslations } from "next-intl";

interface WhatsAppButtonProps {
  generals?: SettingsResponse | SettingsData;
}

function WhatsAppButton({ generals }: WhatsAppButtonProps) {
  const t = useTranslations();
  // Helper function to get setting value by key
  const getSettingValue = (
    key: string,
    group: string = "general"
  ): string | null => {
    const data =
      (generals as SettingsResponse)?.data || (generals as SettingsData);
    if (!data || !data[group] || !Array.isArray(data[group])) return null;
    const setting = data[group].find((item) => item.key === key);
    if (!setting || setting.value === null || setting.value === undefined) return null;
    const value = String(setting.value).trim();
    return value === "" || value === "null" || value === "undefined" ? null : value;
  };

  // Get WhatsApp number from settings (only whatsapp key, no fallback to phone)
  const phone = getSettingValue("whatsapp");
  
  // If no phone number, don't render the button
  if (!phone) {
    return null;
  }

  // Format phone number for WhatsApp (remove spaces, dashes, and other characters)
  const formattedPhone = phone.replace(/[^\d+]/g, "");
  const whatsappUrl = `https://wa.me/${formattedPhone}`;

  return (
    <Link
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-12 right-6 z-50 group"
    >
      {/* Pulse animation ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" style={{ animationDuration: '2s' }}></div>
      
      {/* Button */}
      <div className="relative flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-[#20BA5A] active:scale-95">
        <FaWhatsapp className="text-white text-2xl lg:text-3xl" />
        
        {/* Hover tooltip */}
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
          {t("WhatsApp ile iletişime geç")}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
        </div>
      </div>
    </Link>
  );
}

export default WhatsAppButton;

