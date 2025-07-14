import React from "react";
import ProviderCard from "@/components/(front)/Provider/ProviderCard";
import { Hospital } from "@/lib/hooks/provider/useHospitals";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";
import TabContent from "@/components/(front)/Provider/Tabs/TabContent";

interface ProviderMainProps {
  isHospital: boolean;
  hospitalData?: Hospital | null;
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
        hospitalData={hospitalData}
        specialistData={specialistData}
      />
    </div>
  );
});

export default ProviderMain;
