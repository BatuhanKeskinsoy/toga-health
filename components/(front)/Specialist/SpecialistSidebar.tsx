import React from "react";

function SpecialistSidebar() {
  return (
    <aside className="w-full sticky top-20">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center overflow-hidden rounded-md shadow-lg shadow-gray-200">
          <div className="flex items-center justify-center bg-sitePrimary text-white py-5 w-full">
            Randevu Oluştur
          </div>
          <div className="bg-white w-full p-4 h-40 flex items-center justify-center font-semibold">Randevu Takvimi</div>
        </div>
      </div>
    </aside>
  );
}

export default SpecialistSidebar;
