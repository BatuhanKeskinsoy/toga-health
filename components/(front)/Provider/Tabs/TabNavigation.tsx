"use client";

import React from "react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/others/CustomButton";

type TabType =
  | "profile"
  | "services"
  | "doctors"
  | "about"
  | "gallery"
  | "reviews";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isHospital: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  isHospital,
}) => {
  const t = useTranslations();

  const tabs = [
    { id: "profile" as TabType, label: t("Profil") },
    { id: "services" as TabType, label: t("Hizmetler") },
    ...(isHospital ? [{ id: "doctors" as TabType, label: t("Doktorlar") }] : []),
    { id: "about" as TabType, label: t("Hakkında") },
    { id: "gallery" as TabType, label: t("Galeri") },
    { id: "reviews" as TabType, label: t("Yorumlar") },
    // Sadece hastane için doktorlar tab'ı göster
  ];

  return (
    <div className="flex w-fit">
      {tabs.map((tab) => (
        <CustomButton
          key={tab.id}
          title={tab.label}
          handleClick={() => onTabChange(tab.id)}
          containerStyles={`px-8 py-4 font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-white text-sitePrimary"
              : "hover:bg-white hover:text-sitePrimary"
          }`}
        />
      ))}
    </div>
  );
};

export default TabNavigation;
