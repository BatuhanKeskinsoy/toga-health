import React from "react";
import ProviderMain from "@/components/(front)/Provider/ProviderMain";
import ProviderSidebar from "@/components/(front)/Provider/ProviderSidebar";
import { Hospital } from "@/lib/hooks/provider/useHospitals";
import { Specialist } from "@/lib/hooks/provider/useSpecialists";

interface ProviderViewProps {
  isHospital?: boolean;
  hospitalData?: Hospital | null;
  specialistData?: Specialist | null;
  hospitalError?: string | null;
  specialistError?: string | null;
}

function ProviderView({
  isHospital = false,
  hospitalData,
  specialistData,
  hospitalError,
  specialistError
}: ProviderViewProps) {
  return (
    <div className="container mx-auto px-4 lg:flex lg:gap-8 gap-4 mb-4">
      <div className="w-full lg:max-w-2/3">
        <ProviderMain
          isHospital={isHospital}
          hospitalData={hospitalData}
          specialistData={specialistData}
        />
      </div>
      <div className="w-full lg:max-w-1/3 mt-6 lg:mt-0">
        <ProviderSidebar
          isHospital={isHospital}
          hospitalData={hospitalData}
          specialistData={specialistData}
          hospitalError={hospitalError}
          specialistError={specialistError}
        />
      </div>
    </div>
  );
}

export default ProviderView;
