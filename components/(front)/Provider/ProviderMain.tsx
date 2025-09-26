import React from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import { ProviderMainProps } from "@/lib/types/provider/providerTypes";
import TabContent from "@/components/(front)/Provider/Tabs/TabContent";
import Profile from "@/components/(front)/Provider/Tabs/Profile";
import Services from "@/components/(front)/Provider/Tabs/Services";
import Gallery from "@/components/(front)/Provider/Tabs/Gallery";
import About from "@/components/(front)/Provider/Tabs/About";
import Comments from "@/components/(front)/Provider/Tabs/Comments";
import Doctors from "@/components/(front)/Provider/Tabs/Doctors";

const ProviderMain = React.memo<ProviderMainProps>(async ({
  isHospital,
  providerData,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <ProviderCard
        isHospital={isHospital}
        providerData={providerData}
      />
      
      <TabContent
        isHospital={isHospital}
        children={{
          profile: (
            <Profile 
              isHospital={isHospital} 
              providerData={providerData} 
            />
          ),
          services: (
            <Services 
              isHospital={isHospital} 
              providerData={providerData} 
            />
          ),
          gallery: (
            <Gallery 
              isHospital={isHospital} 
              providerData={providerData} 
            />
          ),
          about: (
            <About 
              isHospital={isHospital} 
              providerData={providerData} 
            />
          ),
          reviews: (
            <Comments 
              isHospital={isHospital} 
              providerData={providerData} 
            />
          ),
          doctors: (
            <Doctors 
              isHospital={isHospital} 
              providerData={providerData} 
            />
          ),
        }}
      />
    </div>
  );
});

export default ProviderMain;
