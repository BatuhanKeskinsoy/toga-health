import React from "react";
import ProviderMain from "@/components/(front)/Provider/ProviderMain";
import ProviderSidebar from "@/components/(front)/Provider/ProviderSidebar";

interface ProviderViewProps {
  isHospital?: boolean;
}

function ProviderView({ isHospital = false }: ProviderViewProps) {
  return (
    <div className="container mx-auto px-4 lg:flex lg:gap-8 gap-4 mb-4">
      <div className="w-full lg:max-w-2/3">
        <ProviderMain isHospital={isHospital} />
      </div>
      <div className="w-full lg:max-w-1/3 mt-6 lg:mt-0">
        <ProviderSidebar isHospital={isHospital} />
      </div>
    </div>
  );
}

export default ProviderView;
