import React from "react";
import SpecialistCard from "@/components/(front)/Specialist/SpecialistCard";
import CustomButton from "@/components/others/CustomButton";

function SpecialistMain() {
  return (
    <div className="flex flex-col w-full">
      <SpecialistCard />
      <div className="flex items-center p-0 border-t border-gray-100">
        <CustomButton
          title="Profil"
          containerStyles="flex items-center bg-white gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
        />
        <CustomButton
          title="Hizmetler"
          containerStyles="flex items-center bg-white gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
        />
        <CustomButton
          title="Galeri"
          containerStyles="flex items-center bg-white gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
        />
        <CustomButton
          title="Hakkında"
          containerStyles="flex items-center bg-white gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
        />
        <CustomButton
          title="Yorumlar"
          containerStyles="flex items-center bg-white gap-2 flex-1 justify-center rounded-none rounded-md px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
        />
      </div>
      <div className="flex flex-col w-full bg-white lg:p-8 p-4 rounded-b-md border-t border-gray-100 gap-4">
        <div id="profile">
          <span className="text-lg font-medium">Profil</span>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            omnis, adipisci sit perferendis sint vero a quia expedita dolorem
            optio, consequuntur nulla, quaerat magni modi impedit rerum ea
            delectus maiores.
          </p>
        </div>
        <div id="services">
          <span className="text-lg font-medium">Hizmetler</span>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            omnis, adipisci sit perferendis sint vero a quia expedita dolorem
            optio, consequuntur nulla, quaerat magni modi impedit rerum ea
            delectus maiores.
          </p>
        </div>
        <div id="gallery">
          <span className="text-lg font-medium">Galeri</span>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            omnis, adipisci sit perferendis sint vero a quia expedita dolorem
            optio, consequuntur nulla, quaerat magni modi impedit rerum ea
            delectus maiores.
          </p>
        </div>
        <div id="about">
          <span className="text-lg font-medium">Hakkında</span>
          <p className="text-gray-500 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Error
            omnis, adipisci sit perferendis sint vero a quia expedita dolorem
            optio, consequuntur nulla, quaerat magni modi impedit rerum ea
            delectus maiores.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SpecialistMain;
