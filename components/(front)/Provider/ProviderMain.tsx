import React from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import { CorporateUser } from "@/lib/types/provider/hospitalTypes";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";
import TabContent from "@/components/(front)/Provider/Tabs/TabContent";
import Profile from "@/components/(front)/Provider/Tabs/Profile";
import Specialists from "@/components/(front)/Provider/Tabs/Specialists";
import Services from "@/components/(front)/Provider/Tabs/Services";
import Gallery from "@/components/(front)/Provider/Tabs/Gallery";
import About from "@/components/(front)/Provider/Tabs/About";
import Comments from "@/components/(front)/Provider/Tabs/Comments";

interface ProviderMainProps {
  isHospital: boolean;
  hospitalData?: CorporateUser | null;
  specialistData?: Specialist | null;
}

const ProviderMain = React.memo<ProviderMainProps>(async ({
  isHospital,
  hospitalData,
  specialistData,
}) => {
  return (
    <div className="flex flex-col gap-3 w-full">
      <ProviderCard
        isHospital={isHospital}
        hospitalData={hospitalData}
        specialistData={specialistData}
      />
      
      <TabContent
        isHospital={isHospital}
        children={{
          profile: (
            <Profile 
              isHospital={isHospital} 
              hospitalData={hospitalData} 
              specialistData={specialistData} 
            />
          ),
          // Specialists - yeni API'de specialists ayrı endpoint'ten gelecek
          // specialists: isHospital ? (
          //   <Specialists 
          //     isHospital={isHospital} 
          //     hospitalData={hospitalData} 
          //   />
          // ) : undefined,
          services: (
            <Services 
              isHospital={isHospital} 
              hospitalData={hospitalData} 
              specialistData={specialistData} 
            />
          ),
          gallery: (
            <Gallery 
              isHospital={isHospital} 
              hospitalData={hospitalData} 
              specialistData={specialistData} 
            />
          ),
          about: (
            <About 
              isHospital={isHospital} 
              hospitalData={hospitalData} 
              specialistData={specialistData} 
            />
          ),
          reviews: (
            <Comments 
              isHospital={isHospital} 
              hospitalData={hospitalData} 
              specialistData={specialistData} 
            />
          ),
        }}
      />
    </div>
  );
});

export default ProviderMain;
