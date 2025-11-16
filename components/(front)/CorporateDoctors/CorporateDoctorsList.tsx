"use client";

import React from "react";
import { CorporateDoctor } from "@/lib/types/provider/requestsTypes";
import DoctorCard from "@/components/(front)/CorporateDoctors/DoctorCard";
import { useTranslations } from "next-intl";

interface CorporateDoctorsListProps {
  doctors: CorporateDoctor[];
  onDoctorUpdate: (doctors: CorporateDoctor[]) => void;
}

const CorporateDoctorsList: React.FC<CorporateDoctorsListProps> = ({
  doctors,
  onDoctorUpdate
}) => {
  const t = useTranslations();
  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t("Henüz doktor eklenmemiş")}</h3>
        <p className="text-gray-500">{t("Doktorlarınızı eklemek için Yeni Doktor Ekle butonunu kullanınız")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onUpdate={(updatedDoctor) => {
            // Eğer doktor silinmişse (status: 'removed' gibi bir işaret varsa), listeden çıkar
            // Şimdilik basit bir yaklaşım: doktoru listeden çıkar
            const updatedDoctors = doctors.filter(d => d.id !== updatedDoctor.id);
            onDoctorUpdate(updatedDoctors);
          }}
        />
      ))}
    </div>
  );
};

export default CorporateDoctorsList;
