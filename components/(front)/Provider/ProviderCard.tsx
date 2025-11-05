"use client";
import CustomButton from "@/components/Customs/CustomButton";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getStar } from "@/lib/functions/getStar";
import {
  IoChatboxEllipses,
  IoLogoWhatsapp,
  IoLocationOutline,
  IoReturnDownForwardSharp,
} from "react-icons/io5";
import React, { useState, useMemo, useCallback } from "react";
import Zoom from "react-medium-image-zoom";
import {
  ProviderCardProps,
  isDoctorData,
  isDiseaseProviderData,
  isHospitalDetailData,
  isDoctorDetailData,
} from "@/lib/types/provider/providerTypes";
import { DoctorProvider } from "@/lib/types/providers/providersTypes";
import { CorporateUser } from "@/lib/types/provider/corporateTypes";
import { useLocale } from "next-intl";
import AppointmentButton from "./AppointmentButton";
import { Link, useRouter } from "@/i18n/navigation";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";
import { FaHouseMedical, FaUserDoctor } from "react-icons/fa6";
import { useSendMessage } from "@/lib/hooks/messages/useSendMessage";
import { sendMessageModal } from "@/lib/functions/messages/sendMessageModal";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

const ProviderCard = React.memo<ProviderCardProps>(
  ({ onList = false, isHospital = false, providerData }) => {
    const locale = useLocale();
    const router = useRouter();
    const data = providerData;
    const { createConversationAndSendMessage } = useSendMessage();
    const [isSending, setIsSending] = useState(false);

    // Helper fonksiyon - data property'lerine güvenli erişim - optimize edilmiş
    const getDataProperty = useCallback(
      (property: string) => {
        if (!data) return undefined;
        if ("data" in data && data.data && typeof data.data === "object") {
          return (data.data as any)[property];
        }
        return (data as any)?.[property];
      },
      [data]
    );

    // Provider verilerini useMemo ile optimize et
    const providerDataMemo = useMemo(() => {
      if (!data) return null;

      const getDataPropertyMemo = (property: string) => {
        if ("data" in data && data.data && typeof data.data === "object") {
          return (data.data as any)[property];
        }
        return (data as any)?.[property];
      };

      return {
        userType: getDataPropertyMemo("user_type"),
        name: getDataPropertyMemo("name"),
        photo: getDataPropertyMemo("photo"),
        id: getDataPropertyMemo("id"),
        rating: getDataPropertyMemo("rating"),
        location: getDataPropertyMemo("location"),
        diseases: (() => {
          const value = getDataPropertyMemo("diseases");
          return Array.isArray(value) ? value : [];
        })(),
        treatments: (() => {
          const value = getDataPropertyMemo("treatments");
          return Array.isArray(value) ? value : [];
        })(),
        comments: (() => {
          const value = getDataPropertyMemo("comments");
          return Array.isArray(value) ? value : [];
        })(),
        commentsCount: getDataPropertyMemo("comments_count") || 0,
        doctorInfo: getDataPropertyMemo("doctor_info"),
        corporateInfo: getDataPropertyMemo("corporate_info"),
        doctors: getDataPropertyMemo("doctors") || [],
        hospital: (() => {
          const h = getDataPropertyMemo("hospital");
          if (!h) return null;
          if (Array.isArray(h)) {
            return h.length > 0 ? h[0] : null;
          }
          return h;
        })(),
      };
    }, [data]);

    if (!data || !providerDataMemo) {
      return (
        <div className="flex flex-col w-full bg-white rounded-md p-4">
          <div className="text-center text-gray-500">Veri bulunamadı</div>
        </div>
      );
    }

    // Provider türünü belirle - optimize edilmiş
    const providerTypes = useMemo(() => {
      return {
        isDiseaseProvider: isDiseaseProviderData(data),
        isDoctorProvider: isDoctorData(data),
        isHospitalDetail: isHospitalDetailData(data),
        isDoctorDetail: isDoctorDetailData(data),
        isDiseaseDoctor:
          isDiseaseProviderData(data) && providerDataMemo.userType === "doctor",
        isDiseaseCorporate:
          isDiseaseProviderData(data) &&
          providerDataMemo.userType === "corporate",
      };
    }, [data, providerDataMemo.userType]);

    // Specialty bilgisini al - optimize edilmiş
    const getSpecialty = useCallback(() => {
      if (providerTypes.isDoctorDetail) {
        return providerDataMemo.doctorInfo?.specialty;
      } else if (providerTypes.isDiseaseDoctor) {
        return providerDataMemo.doctorInfo?.specialty;
      } else if (providerTypes.isDoctorProvider) {
        return (data as any).doctor?.specialty;
      }
      return null;
    }, [providerTypes, providerDataMemo, data]);

    // Specialty slug'ını mevcut locale'e göre çevir
    const getLocalizedSpecialtySlug = (): string => {
      const specialty = getSpecialty();
      if (!specialty) return "";

      // Translations varsa mevcut locale'e göre slug'ı bul
      if (specialty.translations && Array.isArray(specialty.translations)) {
        const targetTranslation = specialty.translations.find(
          (t: any) => t.lang === locale
        );
        if (targetTranslation && targetTranslation.slug) {
          return targetTranslation.slug;
        }
      }

      // Translations yoksa mevcut slug'ı döndür
      return specialty.slug || "";
    };

    // Specialty name'ini mevcut locale'e göre çevir
    const getLocalizedSpecialtyName = (): string => {
      const specialty = getSpecialty();
      if (!specialty) return "";

      // Translations varsa mevcut locale'e göre name'i bul
      if (specialty.translations && Array.isArray(specialty.translations)) {
        const targetTranslation = specialty.translations.find(
          (t: any) => t.lang === locale
        );
        if (targetTranslation && targetTranslation.name) {
          return targetTranslation.name;
        }
      }

      // Translations yoksa mevcut name'i döndür
      return specialty.name || "";
    };

    // Mesaj gönderme işlemi - optimize edilmiş
    const handleSendMessage = useCallback(async () => {
      try {
        // Modal aç - isim ve fotoğrafı gönder
        const modalResult = await sendMessageModal({
          receiverName: providerDataMemo.name || "",
          receiverPhoto: providerDataMemo.photo || null,
        });

        if (!modalResult.isConfirmed || !modalResult.value) {
          return;
        }

        setIsSending(true);

        // Mesajı gönder
        const result = await createConversationAndSendMessage(
          providerDataMemo.id?.toString() || "",
          modalResult.value.title,
          modalResult.value.content
        );

        setIsSending(false);

        if (!result) {
          await funcSweetAlert({
            title: "Hata!",
            text: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
            icon: "error",
            confirmButtonText: "Tamam",
          });
          return;
        }

        // Başarılı
        await funcSweetAlert({
          title: "Başarılı!",
          text: "Mesajınız başarıyla gönderildi.",
          icon: "success",
          confirmButtonText: "Tamam",
        });

        // Eğer "Gönder ve Mesaja Git" seçildiyse yönlendir
        if (modalResult.value.action === "send_and_goto") {
          const messageUrl = getLocalizedUrl("/profile/messages/[id]", locale, {
            id: result.conversation.id.toString(),
          });
          router.push(messageUrl);
        }
      } catch (error) {
        console.error("Mesaj gönderme hatası:", error);
        setIsSending(false);
        await funcSweetAlert({
          title: "Hata!",
          text: "Bir hata oluştu. Lütfen tekrar deneyin.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
      }
    }, [providerDataMemo, createConversationAndSendMessage, locale, router]);

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
            {providerDataMemo.userType === "doctor" ? (
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
                    ? "lg:w-[90px] lg:h-[90px] w-[70px] h-[70px] lg:min-w-[90px] min-w-[70px]"
                    : "lg:w-[120px] lg:h-[120px] w-[90px] h-[90px] lg:min-w-[120px] min-w-[90px]"
                }${providerDataMemo.photo ? " cursor-pointer" : ""}`}
              >
                <Zoom>
                  <ProfilePhoto
                    name={providerDataMemo.name || ""}
                    photo={providerDataMemo.photo || null}
                    size={onList ? 90 : 120}
                    fontSize={onList ? 30 : 40}
                    enableZoom={true}
                    responsiveSizes={{
                      desktop: onList ? 90 : 120,
                      mobile: onList ? 70 : 90,
                    }}
                    responsiveFontSizes={{
                      desktop: onList ? 30 : 40,
                      mobile: onList ? 20 : 30,
                    }}
                  />
                </Zoom>
              </div>

              <div className="flex flex-col gap-2 w-full h-full justify-evenly">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {onList ? (
                      <Link
                        href={
                          providerDataMemo.userType === "doctor"
                            ? getLocalizedUrl("/[...slug]", locale, {
                                slug: [
                                  getDataProperty("slug"),
                                  getLocalizedSpecialtySlug(),
                                  (data as any).location?.country_slug,
                                  (data as any).location?.city_slug,
                                ].join("/"),
                              })
                            : getLocalizedUrl("/hospital/[...slug]", locale, {
                                slug: [
                                  getDataProperty("slug"),
                                  (data as any).location?.country_slug,
                                  (data as any).location?.city_slug,
                                ].join("/"),
                              })
                        }
                        title={providerDataMemo.name || ""}
                        className="text-xl font-semibold hover:text-sitePrimary transition-all duration-300"
                      >
                        {providerDataMemo.name || ""}
                      </Link>
                    ) : (
                      <h1 className="text-2xl font-semibold">
                        {providerDataMemo.name || ""}
                      </h1>
                    )}
                  </div>
                  {!isHospital &&
                    (providerTypes.isDoctorProvider ||
                      providerTypes.isDiseaseDoctor ||
                      providerTypes.isDoctorDetail) && (
                      <p className="text-sitePrimary text-sm font-medium opacity-70">
                        {getLocalizedSpecialtyName()}
                      </p>
                    )}
                  {isHospital &&
                    (providerTypes.isDiseaseCorporate ||
                      providerTypes.isHospitalDetail) &&
                    providerDataMemo.diseases.length > 0 && (
                      <div className="flex gap-1 items-center flex-wrap">
                        {providerDataMemo.diseases
                          .slice(0, 3)
                          .map((disease: any, index: number) => (
                            <span
                              key={disease.disease_id}
                              className="text-sitePrimary text-sm font-medium opacity-70"
                            >
                              {disease.disease_name}
                              {index <
                                Math.min(providerDataMemo.diseases.length, 3) -
                                  1 && ", "}
                            </span>
                          ))}
                        {providerDataMemo.diseases.length > 3 && (
                          <span className="text-sm font-medium opacity-70">
                            ( +{providerDataMemo.diseases.length - 3} daha )
                          </span>
                        )}
                      </div>
                    )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-0.5 items-center font-medium text-sm">
                    {/* district null ise district'i gösterme ve şehirden sonra virgül koyma */}
                    <IoLocationOutline size={16} />
                    {(() => {
                      const loc = providerDataMemo.location;
                      if (loc && loc.country) {
                        const districtPart = loc.district
                          ? ", " + loc.district
                          : "";
                        return `${loc.country}, ${loc.city}${districtPart}`;
                      }
                      if (providerTypes.isDoctorProvider) {
                        const country = getDataProperty("country");
                        const city = getDataProperty("city");
                        const district = getDataProperty("district");
                        const districtPart = district ? ", " + district : "";
                        return `${country}, ${city} ${districtPart}`;
                      }
                      return "Konum belirtilmemiş";
                    })()}
                  </div>
                  <div className="flex gap-0.5 items-center opacity-80 text-xs">
                    <IoReturnDownForwardSharp size={16} />
                    {(() => {
                      const loc = providerDataMemo.location;
                      return loc && (loc as any).full_address
                        ? String((loc as any).full_address)
                        : "Adres belirtilmemiş";
                    })()}
                  </div>
                </div>
                {!isHospital &&
                  (providerTypes.isDoctorProvider ||
                    providerTypes.isDiseaseDoctor ||
                    providerTypes.isDoctorDetail) &&
                  providerDataMemo.hospital && (
                    <Link
                      href={getLocalizedUrl("/hospital/[...slug]", locale, {
                        slug: [
                          (providerDataMemo.hospital as any)?.slug || "",
                          (providerDataMemo.hospital as any)?.country_slug,
                          (providerDataMemo.hospital as any)?.city_slug,
                        ].join("/"),
                      })}
                      title={(providerDataMemo.hospital as any)?.name || ""}
                      className="flex gap-1 items-center text-xs opacity-70 hover:text-sitePrimary transition-all duration-300 w-fit"
                    >
                      <FaHouseMedical size={14} className="-mt-0.5" />
                      {(providerDataMemo.hospital as any)?.name || ""}
                    </Link>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between p-4 gap-4">
            <div className="flex flex-col items-end gap-1">
              {providerDataMemo.rating && providerDataMemo.rating !== null ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center min-w-10 font-medium p-2 bg-gray-50 border border-gray-200 text-gray-500 rounded-full select-none">
                      {providerDataMemo.rating || 0}
                    </div>
                    <div className="flex flex-col items-left gap-2 min-w-max">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <React.Fragment key={index}>
                            {getStar(
                              index + 1,
                              providerDataMemo.rating || 0,
                              16
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-xs opacity-70">
                        {providerTypes.isDiseaseProvider
                          ? providerDataMemo.commentsCount || 0
                          : isHospital
                          ? (data as CorporateUser).comments_count || 0
                          : providerDataMemo.commentsCount || 0}{" "}
                        değerlendirme
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <React.Fragment key={index}>
                        {getStar(index + 1, 0, 16)}
                      </React.Fragment>
                    ))}
                  </div>
                  <span className="text-xs opacity-70 text-right">
                    Henüz değerlendirme yapılmamış
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />
        <div className="flex w-full gap-2 items-center text-sm overflow-x-auto lg:justify-end p-3">
          <CustomButton
            title={isSending ? "Gönderiliyor..." : "Mesaj Gönder"}
            containerStyles={`flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            leftIcon={<IoChatboxEllipses size={20} />}
            handleClick={handleSendMessage}
            isDisabled={isSending}
          />
          {!onList && <AppointmentButton />}
        </div>
      </div>
    );
  }
);

export default ProviderCard;