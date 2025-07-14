"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import CustomButton from "@/components/others/CustomButton";
import Profile from "@/components/(front)/Provider/Tabs/Profile";
import Specialists from "@/components/(front)/Provider/Tabs/Specialists";
import Services from "@/components/(front)/Provider/Tabs/Services";
import Gallery from "@/components/(front)/Provider/Tabs/Gallery";
import About from "@/components/(front)/Provider/Tabs/About";
import Comments from "@/components/(front)/Provider/Tabs/Comments";
import { Hospital } from "@/lib/hooks/provider/useHospitals";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";

// Types
type TabType = "profile" | "specialists" | "services" | "gallery" | "about" | "reviews";

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
    id: "specialists",
    title: "Uzmanlar",
    hospitalTitle: "Uzmanlar",
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
const TabButton = React.memo<{
  tab: TabData;
  isActive: boolean;
  onClick: (tabId: TabType) => void;
  isHydrated: boolean;
  isHospital: boolean;
}>(({ tab, isActive, onClick, isHydrated, isHospital }) => {
  const buttonStyles = useMemo(() => {
    return `flex items-center gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max transition-all duration-300 ${
      isActive
        ? "bg-sitePrimary text-white"
        : "bg-white hover:bg-sitePrimary hover:text-white"
    }`;
  }, [isActive]);

  const displayTitle = useMemo(() => 
    isHospital && tab.hospitalTitle ? tab.hospitalTitle : tab.title, 
    [isHospital, tab.hospitalTitle, tab.title]
  );

  const handleClick = useMemo(() => 
    isHydrated ? () => onClick(tab.id) : undefined, 
    [isHydrated, onClick, tab.id]
  );

  return (
    <CustomButton
      title={displayTitle}
      containerStyles={buttonStyles}
      handleClick={handleClick}
    />
  );
});

const TabContent = React.memo<{
  activeTab: TabType;
  isHydrated: boolean;
  isHospital: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
  selectedAddress?: any;
  onSpecialistSelect?: (specialist: any) => void;
}>(({ activeTab, isHydrated, isHospital, hospitalData, specialistData, selectedAddress, onSpecialistSelect }) => {
  const renderContent = useMemo(() => {
    // SSR sırasında veya profil tab'ında tüm içeriği göster
    if (!isHydrated || activeTab === "profile") {
              return (
          <div className="flex flex-col w-full gap-8">
            <Profile isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} selectedAddress={selectedAddress} />
            <hr className="w-full border-gray-200" />
            {isHospital && (
              <>
                <Specialists isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} onSpecialistSelect={onSpecialistSelect} />
                <hr className="w-full border-gray-200" />
              </>
            )}
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

    // Uzman tarafında specialists tab'ı seçiliyse profil tab'ını göster
    if (activeTab === "specialists" && !isHospital) {
      return <Profile isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} selectedAddress={selectedAddress} />;
    }

    switch (activeTab) {
      case "specialists":
        return <Specialists isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} onSpecialistSelect={onSpecialistSelect} />;
      case "services":
        return <Services isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      case "gallery":
        return <Gallery isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      case "about":
        return <About isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} selectedAddress={selectedAddress} />;
      case "reviews":
        return <Comments isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} />;
      default:
        return <Profile isHospital={isHospital} hospitalData={hospitalData} specialistData={specialistData} selectedAddress={selectedAddress} />;
    }
  }, [activeTab, isHydrated, isHospital, hospitalData, specialistData, selectedAddress, onSpecialistSelect]);

  return (
    <div className="transition-opacity duration-300">{renderContent}</div>
  );
});

// Main Component
interface ProviderMainProps {
  isHospital: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
}

const ProviderMain = React.memo<ProviderMainProps>(({
  isHospital,
  hospitalData,
  specialistData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [selectedSpecialist, setSelectedSpecialist] = useState<any>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ProviderSidebar'dan seçilen adresi dinle
  useEffect(() => {
    const handleAddressSelect = (event: CustomEvent) => {
      setSelectedAddress(event.detail);
    };

    window.addEventListener('addressSelected', handleAddressSelect as EventListener);
    
    return () => {
      window.removeEventListener('addressSelected', handleAddressSelect as EventListener);
    };
  }, []);

  // Uzman seçimi işlevi
  const handleSpecialistSelect = useCallback((specialist: any) => {
    setSelectedSpecialist(specialist);
    
    // ProviderSidebar'a seçilen uzmanı gönder
    window.dispatchEvent(new CustomEvent('specialistSelected', { detail: specialist }));
  }, []);

  const handleTabClick = useCallback((tabId: TabType) => {
    if (isHydrated) {
      // Uzman tarafında specialists tab'ına tıklanırsa profil tab'ına yönlendir
      if (tabId === "specialists" && !isHospital) {
        setActiveTab("profile");
      } else {
        setActiveTab(tabId);
      }
    }
  }, [isHydrated, isHospital]);

  const tabButtons = useMemo(() => 
    TAB_DATA
      .filter(tab => {
        // Uzmanlar tab'ı sadece hastane tarafında göster
        if (tab.id === "specialists" && !isHospital) {
          return false;
        }
        return true;
      })
      .map((tab) => (
        <TabButton
          key={tab.id}
          tab={tab}
          isActive={isHydrated && activeTab === tab.id}
          onClick={handleTabClick}
          isHydrated={isHydrated}
          isHospital={isHospital}
        />
      )), 
    [isHydrated, activeTab, handleTabClick, isHospital]
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      <ProviderCard
        isHospital={isHospital}
        hospitalData={hospitalData}
        specialistData={specialistData}
      />
      <div className="flex items-center p-0 border-t border-gray-100 overflow-x-auto max-w-full">
        {tabButtons}
      </div>

      <div className="flex flex-col w-full bg-white lg:p-8 p-4 rounded-b-md border-t border-gray-100 gap-4">
        <TabContent 
          activeTab={activeTab} 
          isHydrated={isHydrated} 
          isHospital={isHospital} 
          hospitalData={hospitalData}
          specialistData={specialistData}
          selectedAddress={selectedAddress}
          onSpecialistSelect={handleSpecialistSelect}
        />
      </div>
    </div>
  );
});

export default ProviderMain;
