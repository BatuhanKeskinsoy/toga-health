import CustomButton from "@/components/others/CustomButton";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getStar } from "@/lib/functions/getStar";
import {
  IoChatboxEllipses,
  IoLocationSharp,
  IoLogoWhatsapp,
  IoBusiness,
} from "react-icons/io5";
import React from "react";
import Zoom from "react-medium-image-zoom";
import {
  ProviderCardProps,
  ProviderData,
  isHospitalData,
  isDoctorData,
  isDiseaseProviderData,
} from "@/lib/types/provider/providerTypes";
import {
  DiseaseDoctorProvider,
  DiseaseCorporateProvider,
} from "@/lib/types/categories/diseasesTypes";
import { CorporateUser } from "@/lib/types/provider/hospitalTypes";
import { getTranslations } from "next-intl/server";
import AppointmentButton from "./AppointmentButton";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

// Hastane isminden slug oluşturan fonksiyon
const getHospitalSlug = (hospitalName: string): string => {
  return hospitalName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .trim();
};

const ProviderCard = React.memo<ProviderCardProps>(
  async ({ onList = false, isHospital = false, providerData }) => {
    const t = await getTranslations();
    const locale = await getLocale();
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

    // Disease provider türlerini belirle
    const isDiseaseDoctor = isDiseaseProvider && data.user_type === "doctor";
    const isDiseaseCorporate =
      isDiseaseProvider && data.user_type === "corporate";

    return (
      <div
        className={`flex flex-col w-full bg-white ${
          onList ? `rounded-md border border-gray-200` : "rounded-t-md"
        }`}
      >
        <div className="flex max-lg:flex-col justify-between gap-2 w-full">
          <div className="flex items-start gap-4 p-4 w-full">
            <div className="relative rounded-md overflow-hidden shadow-md shadow-gray-200 min-w-[140px] max-lg:min-w-[90px] group">
              <div className="relative lg:w-[140px] lg:h-[140px] w-[90px] h-[90px] overflow-hidden">
                <Zoom>
                  <ProfilePhoto
                    name={data.name}
                    photo={data.photo}
                    size={140}
                    fontSize={40}
                    enableZoom={true}
                    responsiveSizes={{
                      desktop: 140,
                      mobile: 90,
                    }}
                    responsiveFontSizes={{
                      desktop: 40,
                      mobile: 30,
                    }}
                  />
                </Zoom>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-8 bg-black/50 flex items-center justify-center origin-bottom scale-y-0 group-hover:scale-y-100 transition-all duration-300 select-none">
                <p className="text-white text-xs">
                  <span className="font-bold">3 Fotoğraf</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  {onList ? (
                    <Link
                      href={getLocalizedUrl(
                        `${
                          isDiseaseCorporate ? "/hastane" : ""
                        }/${getHospitalSlug(data.name)}${
                          isDiseaseDoctor
                            ? `/${
                                (data as DiseaseDoctorProvider).doctor_info
                                  ?.specialty.slug
                              }`
                            : ""
                        }`,
                        locale
                      )}
                      title={data.name}
                      className="text-2xl font-semibold"
                    >
                      {data.name}
                    </Link>
                  ) : (
                    <h1 className="text-2xl font-semibold">{data.name}</h1>
                  )}
                </div>
                {!isHospital && (isDoctorProvider || isDiseaseDoctor) && (
                  <p className="text-sitePrimary font-medium opacity-70">
                    {isDiseaseDoctor
                      ? (data as DiseaseDoctorProvider).doctor_info?.specialty
                          ?.name || ""
                      : isDoctorProvider
                      ? data.doctor?.specialty?.name || ""
                      : ""}
                  </p>
                )}
              </div>
              <div className="flex gap-0.5 items-center opacity-80">
                <IoLocationSharp size={16} />
                {isDiseaseProvider
                  ? `${data.location.district}, ${data.location.city}`
                  : isHospital && isHospitalProvider
                  ? `${data.district}, ${data.city}`
                  : isDoctorProvider
                  ? `${data.district}, ${data.city}`
                  : "Konum belirtilmemiş"}
              </div>
              {!isHospital && (isDoctorProvider || isDiseaseDoctor) && (
                <Link
                  href={getLocalizedUrl(
                    `/hastane/${getHospitalSlug(
                      isDiseaseDoctor
                        ? (data as DiseaseDoctorProvider).doctor_info
                            ?.hospital || ""
                        : isDoctorProvider
                        ? data.doctor?.hospital || ""
                        : ""
                    )}`,
                    locale
                  )}
                  title={
                    isDiseaseDoctor
                      ? (data as DiseaseDoctorProvider).doctor_info?.hospital ||
                        ""
                      : isDoctorProvider
                      ? data.doctor?.hospital || ""
                      : ""
                  }
                  className="text-xs opacity-70 hover:text-sitePrimary transition-all duration-300 w-fit hover:underline"
                >
                  {isDiseaseDoctor
                    ? (data as DiseaseDoctorProvider).doctor_info?.hospital ||
                      ""
                    : isDoctorProvider
                    ? data.doctor?.hospital || ""
                    : ""}
                </Link>
              )}
              {((isHospital && isHospitalProvider) || isDiseaseCorporate) && (
                <p className="text-xs opacity-70">
                  {isDiseaseCorporate
                    ? (data as DiseaseCorporateProvider).corporate_info
                        ?.description || ""
                    : isHospitalProvider
                    ? data.corporate?.description || ""
                    : ""}
                </p>
              )}
              <div className="flex gap-2 items-center flex-wrap">
                {(isDiseaseProvider
                  ? isDiseaseCorporate
                    ? (data as DiseaseCorporateProvider).corporate_info
                        ?.facilities
                    : []
                  : isHospital && isHospitalProvider
                  ? data.corporate?.branches
                  : isDoctorProvider
                  ? data.doctor?.branches
                  : []
                )?.map((item, index) => (
                  <span
                    key={index}
                    className="text-xs opacity-70 px-2 py-1 bg-gray-100 rounded-md"
                  >
                    {item}
                  </span>
                )) || null}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between p-4 gap-4">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                {getStar(parseFloat(data.rating.toString()) || 0, 5, 1)}
                <span className="text-sm font-medium">{data.rating}</span>
              </div>
              <span className="text-xs opacity-70">
                {isDiseaseProvider
                  ? "0 değerlendirme" // Disease provider'da review count yok
                  : isHospital
                  ? (data as CorporateUser).corporate?.review_count || 0
                  : (data as any).reviewCount || 0}{" "}
                değerlendirme
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />
        <div
          className={`flex w-full gap-2 items-center text-sm overflow-x-auto justify-end`}
        >
          <div className="flex items-center gap-2 p-3">
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
      </div>
    );
  }
);

export default ProviderCard;
