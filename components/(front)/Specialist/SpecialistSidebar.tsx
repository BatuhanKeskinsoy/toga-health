import React from "react";
import AppointmentTimes from "./AppointmentTimes/AppointmentTimes";

function SpecialistSidebar() {
  return (
    <aside className="w-full  shadow-lg shadow-gray-200">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center overflow-hidden rounded-md">
          <div className="flex items-center justify-center bg-sitePrimary text-white text-xl font-medium tracking-wide py-5 w-full">
            Randevu Oluştur
          </div>
          <div className="bg-white w-full p-4">
            <AppointmentTimes />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SpecialistSidebar;
