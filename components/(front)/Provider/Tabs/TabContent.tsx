"use client";

import React, { useState } from "react";
import TabNavigation from "./TabNavigation";
import Profile from "./Profile";
import Specialists from "./Specialists";
import Services from "./Services";
import Gallery from "./Gallery";
import About from "./About";
import Comments from "./Comments";
import { Hospital } from "@/lib/hooks/provider/useHospitals";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";

type TabType = "profile" | "specialists" | "services" | "gallery" | "about" | "reviews";

interface TabContentProps {
  isHospital: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
}

const TabContent: React.FC<TabContentProps> = ({
  isHospital,
  hospitalData,
  specialistData,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const handleTabChange = (tab: TabType) => {
    if (tab === "specialists" && !isHospital) {
      setActiveTab("profile");
    } else {
      setActiveTab(tab);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "profile") {
      return (
        <div className="flex flex-col w-full gap-8">
          <Profile 
            isHospital={isHospital} 
            hospitalData={hospitalData} 
            specialistData={specialistData} 
          />
          <hr className="w-full border-gray-200" />
          {isHospital && (
            <>
              <Specialists 
                isHospital={isHospital} 
                hospitalData={hospitalData} 
              />
              <hr className="w-full border-gray-200" />
            </>
          )}
          <Services 
            isHospital={isHospital} 
            hospitalData={hospitalData} 
            specialistData={specialistData} 
          />
          <hr className="w-full border-gray-200" />
          <About 
            isHospital={isHospital} 
            hospitalData={hospitalData} 
            specialistData={specialistData} 
          />
          <hr className="w-full border-gray-200" />
          <Gallery 
            isHospital={isHospital} 
            hospitalData={hospitalData} 
            specialistData={specialistData} 
          />
          <hr className="w-full border-gray-200" />
          <Comments 
            isHospital={isHospital} 
            hospitalData={hospitalData} 
            specialistData={specialistData} 
          />
        </div>
      );
    }

    switch (activeTab) {
      case "specialists":
        return <Specialists isHospital={isHospital} hospitalData={hospitalData} />;
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
    <div className="flex flex-col w-full">
      <div className="flex items-center p-0 border-t border-gray-100 overflow-x-auto max-w-full">
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