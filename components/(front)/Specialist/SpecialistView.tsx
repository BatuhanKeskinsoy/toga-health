import React from "react";
import SpecialistMain from "@/components/(front)/Specialist/SpecialistMain";
import SpecialistSidebar from "@/components/(front)/Specialist/SpecialistSidebar";

function SpecialistView() {
  return (
    <div className="container mx-auto px-4 lg:flex lg:gap-10 gap-4">
      <div className="w-full flex-1/3">
        <SpecialistMain />
      </div>
      <div className="w-full flex-1 mt-6 lg:mt-0">
        <SpecialistSidebar />
        </div>
    </div>
  );
}

export default SpecialistView;
