"use client";
import CustomButton from "@/components/others/CustomButton";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getStar } from "@/lib/functions/getStar";
import {
  IoChatboxEllipses,
  IoLocationSharp,
  IoLogoWhatsapp,
  IoBusiness,
  IoLocationOutline,
  IoReturnDownForwardSharp,
} from "react-icons/io5";
import React from "react";
import Zoom from "react-medium-image-zoom";
import {
  ProviderCardProps,
  ProviderData,
  isHospitalData,
  isDoctorData,
  isDiseaseProviderData,
  isHospitalDetailData,
  isDoctorDetailData,
} from "@/lib/types/provider/providerTypes";
import {
  DoctorProvider,
  CorporateProvider,
} from "@/lib/types/providers/providersTypes";
import { CorporateUser } from "@/lib/types/provider/hospitalTypes";
import { useTranslations, useLocale } from "next-intl";
import AppointmentButton from "./AppointmentButton";
import { Link } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { FaHouseMedical, FaUserDoctor } from "react-icons/fa6";

const ProviderCard = React.memo<ProviderCardProps>(
  ({ onList = false, isHospital = false, providerData }) => {
    const t = useTranslations();
    const locale = useLocale();
    const data = providerData;

    if (!data) {
      return (
        <div className="flex flex-col w-full bg-white rounded-md p-4">
          <div className="text-center text-gray-500">Veri bulunamadı</div>
        </div>
      );
    }

    // Provider türünü belirle
    const isDiseaseProvider = isDiseaseProviderData(data);
    const isHospitalProvider = isHospitalData(data);
    const isDoctorProvider = isDoctorData(data);
    const isHospitalDetail = isHospitalDetailData(data);
    const isDoctorDetail = isDoctorDetailData(data);

    // Disease provider türlerini belirle
    const isDiseaseDoctor = isDiseaseProvider && data.user_type === "doctor";
    const isDiseaseCorporate =
      isDiseaseProvider && data.user_type === "corporate";

    return (
      <div
        className={`relative flex flex-col w-full bg-white ${
          onList
            ? `lg:rounded-l-md lg:rounded-r-none rounded-t-md border border-gray-200`
            : "rounded-t-md"
        }`}
      >
        {onList && (
          <div className="bg-gray-200/70 text-gray-500 rounded-full p-3 absolute -top-2 -left-3 flex items-center justify-center z-10">
            {data.user_type === "doctor" ? (
              <span className="text-xl transition-all duration-300">
                <FaUserDoctor />
              </span>
            ) : (
              <span className="text-xl transition-all duration-300">
                <FaHouseMedical />
              </span>
            )}
          </div>
        )}
        <div className="flex max-lg:flex-col justify-between gap-2 w-full">
          <div className="flex flex-col w-full">
            <div className="flex items-start gap-4 p-4 w-full">
              <div
                className={`relative rounded-md overflow-hidden shadow-md shadow-gray-200 group ${
                  onList
                    ? "lg:w-[100px] lg:h-[100px] w-[80px] h-[80px] lg:min-w-[100px] min-w-[80px]"
                    : "lg:w-[120px] lg:h-[120px] w-[90px] h-[90px] lg:min-w-[120px] min-w-[90px]"
                }${data.photo ? " cursor-pointer" : ""}`}
              >
                <Zoom>
                  <ProfilePhoto
                    name={data.name}
                    photo={data.photo}
                    size={onList ? 100 : 120}
                    fontSize={onList ? 30 : 40}
                    enableZoom={true}
                    responsiveSizes={{
                      desktop: onList ? 100 : 120,
                      mobile: onList ? 80 : 90,
                    }}
                    responsiveFontSizes={{
                      desktop: onList ? 30 : 40,
                      mobile: onList ? 20 : 30,
                    }}
                  />
                </Zoom>
              </div>

              <div className="flex flex-col gap-1 w-full h-full justify-evenly">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    {onList ? (
                      <Link
                        href={
                          data.user_type === "doctor"
                            ? getLocalizedUrl("/[...slug]", locale, {
                                slug: [
                                  data.slug,
                                  (isDoctorDetail &&
                                    (data as any).doctor_info?.specialty
                                      ?.slug) ||
                                    (isDiseaseDoctor &&
                                      (data as DoctorProvider)
                                        .doctor_info?.specialty?.slug) ||
                                    "",
                                  (data as any).location?.country_slug ||
                                    "turkiye",
                                  (data as any).location?.city_slug ||
                                    "istanbul",
                                ].join("/"),
                              })
                            : getLocalizedUrl("/hospital/[...slug]", locale, {
                                slug: [
                                  data.slug,
                                  (data as any).location?.country_slug ||
                                    "turkiye",
                                  (data as any).location?.city_slug ||
                                    "istanbul",
                                ].join("/"),
                              })
                        }
                        title={data.name}
                        className="text-xl font-semibold hover:text-sitePrimary transition-all duration-300"
                      >
                        {data.name}
                      </Link>
                    ) : (
                      <h1 className="text-2xl font-semibold">{data.name}</h1>
                    )}
                  </div>
                  {!isHospital &&
                    (isDoctorProvider || isDiseaseDoctor || isDoctorDetail) && (
                      <p className="text-sitePrimary text-sm font-medium opacity-70">
                        {isDiseaseDoctor
                          ? (data as DoctorProvider).doctor_info
                              ?.specialty?.name || ""
                          : isDoctorDetail
                          ? (data as any).doctor_info?.specialty?.name || ""
                          : isDoctorProvider
                          ? data.doctor?.specialty?.name || ""
                          : ""}
                      </p>
                    )}
                  {isHospital &&
                    (isDiseaseCorporate || isHospitalDetail) &&
                    data.diseases &&
                    data.diseases.length > 0 && (
                      <div className="flex gap-1 items-center flex-wrap">
                        {data.diseases.slice(0, 3).map((disease, index) => (
                          <span
                            key={disease.disease_id}
                            className="text-sitePrimary text-sm font-medium opacity-70"
                          >
                            {disease.disease_name}
                            {index < Math.min(data.diseases.length, 3) - 1 &&
                              ", "}
                          </span>
                        ))}
                        {data.diseases.length > 3 && (
                          <span className="text-sm font-medium opacity-70">
                            ( +{data.diseases.length - 3} daha )
                          </span>
                        )}
                      </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5 items-center font-medium text-sm">
                    <IoLocationOutline size={16} />
                    {(data as any).location && (data as any).location.country
                      ? `${(data as any).location.country}, ${
                          (data as any).location.city
                        }, ${(data as any).location.district}`
                      : isDoctorProvider
                      ? `${data.country}, ${data.city}, ${data.district}`
                      : "Konum belirtilmemiş"}
                  </div>
                  <div className="flex gap-0.5 items-center opacity-80 text-xs">
                    <IoReturnDownForwardSharp size={16} />
                    {(data as any).location &&
                    (data as any).location.full_address
                      ? `${(data as any).location.full_address}`
                      : "Adres belirtilmemiş"}
                  </div>
                </div>
                {!isHospital &&
                  (isDoctorProvider || isDiseaseDoctor || isDoctorDetail) &&
                  ((isDiseaseDoctor &&
                    (data as DoctorProvider).hospital.slug &&
                    (data as DoctorProvider).hospital) ||
                    (isDoctorDetail &&
                      (data as any).hospital.slug &&
                      (data as any).hospital) ||
                    (isDoctorProvider &&
                      data.hospital.slug &&
                      data.hospital)) && (
                    <Link
                      href={getLocalizedUrl("/hospital/[...slug]", locale, {
                        slug: [
                          isDiseaseDoctor
                            ? (data as DoctorProvider).hospital.slug ||
                              ""
                            : isDoctorDetail
                            ? (data as any).hospital_slug || ""
                            : isDoctorProvider
                            ? data.hospital.slug || ""
                            : "",
                          (data as any).hospital?.country_slug,
                          (data as any).hospital?.city_slug,
                        ].join("/"),
                      })}
                      title={
                        isDiseaseDoctor
                          ? (data as DoctorProvider).hospital?.name || ""
                          : isDoctorDetail
                          ? (data as any).hospital?.name || ""
                          : isDoctorProvider
                          ? data.hospital?.name || ""
                          : ""
                      }
                      className="flex gap-1 items-center text-xs opacity-70 hover:text-sitePrimary transition-all duration-300 w-fit"
                    >
                      <FaHouseMedical size={14} className="-mt-0.5" />
                      {isDiseaseDoctor
                        ? (data as DoctorProvider).hospital?.name || ""
                        : isDoctorDetail
                        ? (data as any).hospital?.name || ""
                        : isDoctorProvider
                        ? data.hospital?.name || ""
                        : ""}
                    </Link>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between p-4 gap-4">
            <div className="flex flex-col items-end gap-1">
              {data.rating && data.rating !== null ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center min-w-10 font-medium p-2 bg-gray-50 border border-gray-200 text-gray-500 rounded-full select-none">
                      {data.rating || 0}
                    </div>
                    <div className="flex flex-col items-left gap-1 min-w-max">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <React.Fragment key={index}>
                            {getStar(index + 1, data.rating || 0, 16)}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-xs opacity-70">
                        {isDiseaseProvider
                          ? data.comments_count || 0
                          : isHospital
                          ? (data as CorporateUser).comments_count || 0
                          : (data as any).comments_count || 0}{" "}
                        değerlendirme
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <React.Fragment key={index}>
                        {getStar(index + 1, 0, 16)}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-xs opacity-70">
                    Henüz değerlendirme yapılmamış
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />
        <div className="flex w-full gap-2 items-center text-sm overflow-x-auto lg:justify-end p-3">
          <CustomButton
            title="WhatsApp'tan Ulaşın"
            containerStyles="flex items-center gap-2 rounded-md bg-green-500 text-white px-4 py-2 min-w-max hover:opacity-80 transition-all duration-300"
            leftIcon={<IoLogoWhatsapp size={20} />}
          />
          <CustomButton
            title="Mesaj Gönder"
            containerStyles="flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300"
            leftIcon={<IoChatboxEllipses size={20} />}
          />
          <AppointmentButton />
        </div>
      </div>
    );
  }
);

export default ProviderCard;
