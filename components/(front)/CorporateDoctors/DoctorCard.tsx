"use client";

import React, { useState } from "react";
import { CorporateDoctor } from "@/lib/types/provider/requestsTypes";
import CustomButton from "@/components/Customs/CustomButton";
import { FaExternalLinkAlt, FaEye, FaTrash } from "react-icons/fa";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { useLocale, useTranslations } from "next-intl";
import { removeDoctorFromCorporate } from "@/lib/services/provider/requests";
import Swal from "sweetalert2";

interface DoctorCardProps {
  doctor: CorporateDoctor;
  onUpdate: (doctor: CorporateDoctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onUpdate }) => {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();

  const handleRemoveDoctor = async () => {
    const result = await Swal.fire({
      title: t("Doktoru Çıkar"),
      text: `"${doctor.name}" ${t("doktor listesinden çıkarmak istediğinizden emin misiniz?")}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: t("Evet, Çıkar"),
      cancelButtonText: t("İptal"),
    });

    if (!result.isConfirmed) {
      return;
    }

    setIsLoading(true);
    try {
      await removeDoctorFromCorporate(doctor.id);
      
      // Başarılı olursa parent component'i güncelle
      onUpdate(doctor);
      
      await Swal.fire({
        title: t("Başarılı"),
        text: t("Doktor başarıyla listeden çıkarıldı"),
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    } catch (error: any) {
      console.error("Error removing doctor:", error);
      await Swal.fire({
        title: t("Hata"),
        text: error?.response?.data?.message || t("Doktor çıkarılırken bir hata oluştu, lütfen tekrar deneyiniz"),
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:bg-sitePrimary/5 hover:border-sitePrimary/20 transition-colors">
      <div className="flex flex-col items-center sm:flex-row gap-4">
        {/* Header */}
        <div className="flex items-start gap-2 w-full">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
              <ProfilePhoto
                photo={doctor.photo}
                name={doctor.name}
                size={48}
                fontSize={16}
                responsiveSizes={{
                  desktop: 48,
                  mobile: 32,
                }}
                responsiveFontSizes={{
                  desktop: 16,
                  mobile: 12,
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-xs text-gray-500">
                {doctor.doctor_info.specialty.name}
              </p>
            </div>
          </div>
        </div>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium mt-0.5 ${getStatusColor(
            "active"
          )}`}
        >
          {t("Aktif")}
        </span>
        {/* Doctor Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{doctor.phone}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(doctor.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{doctor.rating}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={getLocalizedUrl("/[...slug]", locale, {
              slug: [
                doctor.slug,
                doctor.doctor_info?.specialty?.slug,
                doctor.location?.country_slug,
                doctor.location?.city_slug,
              ].join("/"),
            })}
            target="_blank"
            className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-white text-gray-700 border-gray-200 border rounded-md hover:bg-sitePrimary hover:text-white hover:border-sitePrimary/20 transition-colors text-nowrap text-sm"
          >
            <FaExternalLinkAlt size={12} className="-mt-1" />
            {t("Profili Görüntüle")}
          </Link>
          <CustomButton
            handleClick={handleRemoveDoctor}
            btnType="button"
            containerStyles="flex items-center justify-center gap-2 flex-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            leftIcon={<FaTrash size={16} />}
            textStyles="hidden"
            isDisabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
