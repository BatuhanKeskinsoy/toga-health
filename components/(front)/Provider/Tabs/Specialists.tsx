import CustomButton from "@/components/others/CustomButton";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { FaCalendar, FaUser } from "react-icons/fa";
import React from "react";
import { Link } from "@/i18n/navigation";

interface SpecialistsProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
  onSpecialistSelect?: (specialist: any) => void;
}

function Specialists({
  isHospital = false,
  hospitalData,
  specialistData,
  onSpecialistSelect,
}: SpecialistsProps) {
  // Sadece hastane için uzmanları göster
  if (!isHospital || !hospitalData?.specialists) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Yükleniyor</p>
        </div>
      </div>
    );
  }

  const handleSpecialistClick = (specialist: any) => {
    if (onSpecialistSelect) {
      onSpecialistSelect(specialist);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Hastane Uzmanları
        </h3>
        <p className="text-gray-600">
          Hastanemizde görev yapan uzmanlarımız. Uzman seçerek randevu
          alabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hospitalData.specialists.map((specialist: any, index: number) => (
          <div
            key={specialist.id || index}
            className="hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden rounded-md"
          >
            <div className="flex items-center gap-3 bg-white p-3">
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <ProfilePhoto photo={specialist.photo} />
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="font-semibold text-gray-800 text-base">
                  {specialist.name}
                </h4>
                <p className="text-sitePrimary text-xs">
                  {specialist.specialty}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 text-xl -mt-1">★</span>
                  <span className="text-sm font-medium">
                    {specialist.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex w-full">
              <Link
                href={`/${specialist.specialty.toLowerCase()}/${
                  specialist.slug
                }`}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 text-xs hover:bg-sitePrimary hover:text-white transition-all duration-300 w-full"
                title="Profili Görüntüle"
              >
                <FaUser />
                <span>Profili Görüntüle</span>
              </Link>
              <CustomButton
                title="Randevu Al"
                containerStyles="flex items-center justify-center gap-1.5 px-4 py-2 bg-sitePrimary/10 text-sitePrimary text-xs hover:bg-sitePrimary hover:text-white transition-all duration-300 w-full"
                leftIcon={<FaCalendar />}
                handleClick={(e) => {
                  e.stopPropagation();
                  handleSpecialistClick(specialist);
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Specialists;
