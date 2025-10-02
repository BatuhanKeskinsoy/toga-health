"use client";
import React, { useState, ReactNode } from "react";
import TabNavigation from "./TabNavigation";

type TabType =
  | "profile"
  | "services"
  | "doctors"
  | "about"
  | "gallery"
  | "reviews";

interface TabContentProps {
  isHospital: boolean;
  children: {
    profile: ReactNode;
    services: ReactNode;
    gallery: ReactNode;
    about: ReactNode;
    reviews: ReactNode;
    doctors: ReactNode;
  };
}

const TabContent: React.FC<TabContentProps> = ({ isHospital, children }) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderTabContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="flex flex-col w-full gap-8">
          {children.profile}
          <hr className="w-full border-gray-200" />
          {children.services}
          <hr className="w-full border-gray-200" />
          {children.doctors}
          <hr className="w-full border-gray-200" />
          {children.about}
          <hr className="w-full border-gray-200" />
          {children.gallery}
          <hr className="w-full border-gray-200" />
          {children.reviews}
        </div>
      );
    }

    switch (activeTab) {
      case "services":
        return children.services;
      case "doctors":
        return children.doctors;
        case "about":
          return children.about;
      case "gallery":
        return children.gallery;
      case "reviews":
        return children.reviews;
      default:
        return children.profile;
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center border-t border-gray-100 overflow-x-auto max-w-full">
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isHospital={isHospital}
        />
      </div>

      <div className="flex flex-col w-full bg-white lg:p-8 p-4 rounded-b-md border-t border-gray-100 gap-4">
        <div className="transition-opacity duration-300">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TabContent;
