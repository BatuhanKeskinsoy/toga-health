import React from "react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  TabComponentProps,
  isHospitalDetailData,
} from "@/lib/types/provider/providerTypes";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { getLocale } from "next-intl/server";

async function Doctors({
  isHospital = false,
  providerData,
}: TabComponentProps) {
  const locale = await getLocale();
  const t = await getTranslations({ locale });

  if (!providerData) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">{t("Yükleniyor")}</p>
        </div>
      </div>
    );
  }

  // Sadece hastane detay sayfasında doktorlar gösterilir
  if (!isHospital) {
    return null;
  }

  // API response'una göre doktorları al
  const doctors = isHospitalDetailData(providerData)
    ? providerData.doctors
    : null;

  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-lg font-semibold text-gray-800">
          {t("Doktorlar")}
        </h3>
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {t("Henüz doktor bilgisi bulunmuyor")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {t("Doktorlar")}
        </h3>
        <span className="bg-sitePrimary/10 text-sitePrimary text-sm font-medium px-2.5 py-0.5 rounded-full">
          {doctors.length}
        </span>
      </div>
      <p className="text-gray-600 leading-relaxed">
        {t("Bu hastanede çalışan uzman doktorlarımız")}
      </p>

      {/* Doktorlar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor: any, index: number) => (
          <Link
            key={doctor.id || index}
            href={`/${locale}${getLocalizedUrl(
              "/[specialist_slug]/[branch_slug]",
              locale,
              {
                specialist_slug: doctor.slug,
                branch_slug: doctor.department_slug,
              }
            )}`}
            className="group bg-white rounded-lg border border-gray-200 hover:border-sitePrimary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4">
              <div className="relative min-w-16 w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                <ProfilePhoto
                  photo={doctor.photo}
                  name={doctor.name}
                  fontSize={22}
                  size={64}
                />
              </div>

              <div className="flex flex-col gap-0.5">
                <h4
                  className="text-base font-semibold text-gray-800 group-hover:text-sitePrimary transition-colors duration-300 line-clamp-1"
                  title={doctor.name}
                >
                  {doctor.name}
                </h4>
                <p className="text-xs text-sitePrimary font-medium">
                  {doctor.department}
                </p>
                <p className="text-xs text-gray-500">{doctor.position}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Doctors;
