"use client";
import React, { useState, useMemo, useEffect } from "react";
import SpecialistCard from "@/components/(front)/Specialist/SpecialistCard";
import CustomButton from "@/components/others/CustomButton";
import Profile from "@/components/(front)/Specialist/Tabs/Profile";
import Services from "@/components/(front)/Specialist/Tabs/Services";
import Gallery from "@/components/(front)/Specialist/Tabs/Gallery";
import About from "@/components/(front)/Specialist/Tabs/About";
import Comments from "@/components/(front)/Specialist/Tabs/Comments";

// Types
type TabType = "profile" | "services" | "gallery" | "about" | "reviews";

interface TabData {
  id: TabType;
  title: string;
}

// Constants
const TAB_DATA: TabData[] = [
  {
    id: "profile",
    title: "Profil",
  },
  {
    id: "services",
    title: "Hizmetler",
  },
  {
    id: "gallery",
    title: "Galeri",
  },
  {
    id: "about",
    title: "Hakkında",
  },
  {
    id: "reviews",
    title: "Yorumlar",
  },
];

// Components
const TabButton: React.FC<{
  tab: TabData;
  isActive: boolean;
  onClick: (tabId: TabType) => void;
  isHydrated: boolean;
}> = ({ tab, isActive, onClick, isHydrated }) => {
  const buttonStyles = useMemo(() => {
    return `flex items-center gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max transition-all duration-300 ${
      isActive
        ? "bg-sitePrimary text-white"
        : "bg-white hover:bg-sitePrimary hover:text-white"
    }`;
  }, [isActive]);

  return (
    <CustomButton
      title={tab.title}
      containerStyles={buttonStyles}
      handleClick={isHydrated ? () => onClick(tab.id) : undefined}
    />
  );
};

const TabContent: React.FC<{
  activeTab: TabType;
  isHydrated: boolean;
}> = ({ activeTab, isHydrated }) => {
  const renderContent = () => {
    // SSR sırasında veya profil tab'ında tüm içeriği göster
    if (!isHydrated || activeTab === "profile") {
      return (
        <div className="flex flex-col w-full gap-8">
          <Profile />
          <hr className="w-full border-gray-200" />
          <Services />
          <hr className="w-full border-gray-200" />
          <About />
          <hr className="w-full border-gray-200" />
          <Gallery />
          <hr className="w-full border-gray-200" />
          <Comments />
        </div>
      );
    }

    switch (activeTab) {
      case "services":
        return <Services />;
      case "gallery":
        return <Gallery />;
      case "about":
        return <About />;
      case "reviews":
        return <Comments />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="transition-opacity duration-300">{renderContent()}</div>
  );
};

// Main Component
function SpecialistMain() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleTabClick = (tabId: TabType) => {
    if (isHydrated) {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <SpecialistCard />

      {/* Tab Navigation */}
      <div className="flex items-center p-0 border-t border-gray-100 overflow-x-auto max-w-full">
        {TAB_DATA.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={isHydrated && activeTab === tab.id}
            onClick={handleTabClick}
            isHydrated={isHydrated}
          />
        ))}
      </div>

      <div className="flex flex-col w-full bg-white lg:p-8 p-4 rounded-b-md border-t border-gray-100 gap-4">
        <TabContent activeTab={activeTab} isHydrated={isHydrated} />
      </div>
    </div>
  );
}

export default SpecialistMain;
