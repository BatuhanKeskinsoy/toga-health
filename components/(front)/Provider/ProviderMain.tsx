"use client";
import React, { useState, useMemo, useEffect } from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import CustomButton from "@/components/others/CustomButton";
import Profile from "@/components/(front)/Provider/Tabs/Profile";
import Services from "@/components/(front)/Provider/Tabs/Services";
import Gallery from "@/components/(front)/Provider/Tabs/Gallery";
import About from "@/components/(front)/Provider/Tabs/About";
import Comments from "@/components/(front)/Provider/Tabs/Comments";
import { Hospital } from "@/lib/hooks/provider/useHospitals";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";

// Types
type TabType = "profile" | "services" | "gallery" | "about" | "reviews";

interface TabData {
  id: TabType;
  title: string;
  hospitalTitle?: string;
}

// Constants
const TAB_DATA: TabData[] = [
  {
    id: "profile",
    title: "Profil",
    hospitalTitle: "Hastane",
  },
  {
    id: "services",
    title: "Hizmetler",
    hospitalTitle: "Hizmetler",
  },
  {
    id: "gallery",
    title: "Galeri",
    hospitalTitle: "Galeri",
  },
  {
    id: "about",
    title: "Hakkında",
    hospitalTitle: "Hakkında",
  },
  {
    id: "reviews",
    title: "Yorumlar",
    hospitalTitle: "Yorumlar",
  },
];

// Components
const TabButton: React.FC<{
  tab: TabData;
  isActive: boolean;
  onClick: (tabId: TabType) => void;
  isHydrated: boolean;
  isHospital: boolean;
}> = ({ tab, isActive, onClick, isHydrated, isHospital }) => {
  const buttonStyles = useMemo(() => {
    return `flex items-center gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max transition-all duration-300 ${
      isActive
        ? "bg-sitePrimary text-white"
        : "bg-white hover:bg-sitePrimary hover:text-white"
    }`;
  }, [isActive]);

  const displayTitle = isHospital && tab.hospitalTitle ? tab.hospitalTitle : tab.title;

  return (
    <CustomButton
      title={displayTitle}
      containerStyles={buttonStyles}
      handleClick={isHydrated ? () => onClick(tab.id) : undefined}
    />
  );
};

const TabContent: React.FC<{
  activeTab: TabType;
  isHydrated: boolean;
  isHospital: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
}> = ({ activeTab, isHydrated, isHospital, hospitalData, specialistData }) => {
  const renderContent = () => {
    // SSR sırasında veya profil tab'ında tüm içeriği göster
    if (!isHydrated || activeTab === "profile") {
      return (
        <div className="flex flex-col w-full gap-8">
          <Profile isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />
          <hr className="w-full border-gray-200" />
          <Services isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />
          <hr className="w-full border-gray-200" />
          <About isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />
          <hr className="w-full border-gray-200" />
          <Gallery isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />
          <hr className="w-full border-gray-200" />
          <Comments isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />
        </div>
      );
    }

    switch (activeTab) {
      case "services":
        return <Services isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      case "gallery":
        return <Gallery isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      case "about":
        return <About isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      case "reviews":
        return <Comments isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      default:
        return <Profile isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
    }
  };

  return (
    <div className="transition-opacity duration-300">{renderContent()}</div>
  );
};

// Main Component
interface ProviderMainProps {
  isHospital: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
}

function ProviderMain({
  isHospital,
  hospitalData,
  specialistData,
}: ProviderMainProps) {
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
      <ProviderCard
        isHospital={isHospital}
        hospitalData={hospitalData}
        specialistData={specialistData}
      />
      <div className="flex items-center p-0 border-t border-gray-100 overflow-x-auto max-w-full">
        {TAB_DATA.map((tab) => (
          <TabButton
            key={tab.id}
            tab={tab}
            isActive={isHydrated && activeTab === tab.id}
            onClick={handleTabClick}
            isHydrated={isHydrated}
            isHospital={isHospital}
          />
        ))}
      </div>

      <div className="flex flex-col w-full bg-white lg:p-8 p-4 rounded-b-md border-t border-gray-100 gap-4">
        <TabContent 
          activeTab={activeTab} 
          isHydrated={isHydrated} 
          isHospital={isHospital} 
          hospitalData={hospitalData}
          specialistData={specialistData}
        />
      </div>
    </div>
  );
}

export default ProviderMain;
