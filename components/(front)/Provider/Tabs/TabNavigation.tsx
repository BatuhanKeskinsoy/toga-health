"use client";

import React from "react";
import { useTranslations } from "next-intl";

type TabType = "profile" | "specialists" | "services" | "gallery" | "about" | "reviews";

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
    ...(isHospital ? [{ id: "specialists" as TabType, label: t("Uzmanlar") }] : []),
    { id: "services" as TabType, label: t("Hizmetler") },
    { id: "gallery" as TabType, label: t("Galeri") },
    { id: "about" as TabType, label: t("Hakkında") },
    { id: "reviews" as TabType, label: t("Yorumlar") },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            activeTab === tab.id
              ? "bg-white text-sitePrimary shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation; 