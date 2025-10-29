"use client";
import CustomButton from "@/components/others/CustomButton";
import ProfilePhoto from "@/components/others/ProfilePhoto";
import { getStar } from "@/lib/functions/getStar";
import {
  IoChatboxEllipses,
  IoLogoWhatsapp,
  IoLocationOutline,
  IoReturnDownForwardSharp,
} from "react-icons/io5";
import React, { useState } from "react";
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

    // Helper fonksiyonlar - data property'lerine güvenli erişim
    const getDataProperty = (property: string) => {
      if ('data' in data && data.data && typeof data.data === 'object') {
        return (data.data as any)[property];
      }
      return (data as any)?.[property];
    };

    const getUserType = () => getDataProperty('user_type');
    const getName = () => getDataProperty('name');
    const getPhoto = () => getDataProperty('photo');
    const getId = () => getDataProperty('id');
    const getRating = () => getDataProperty('rating');
    const getLocation = () => getDataProperty('location');
    const getDiseases = () => {
      const value = getDataProperty('diseases');
      return Array.isArray(value) ? value : [];
    };
    const getTreatments = () => {
      const value = getDataProperty('treatments');
      return Array.isArray(value) ? value : [];
    };
    const getComments = () => {
      const value = getDataProperty('comments');
      return Array.isArray(value) ? value : [];
    };
    const getCommentsCount = () => getDataProperty('comments_count') || 0;
    const getDoctorInfo = () => getDataProperty('doctor_info');
    const getCorporateInfo = () => getDataProperty('corporate_info');
    const getDoctors = () => getDataProperty('doctors') || [];
    const getHospital = () => {
      const h = getDataProperty('hospital');
      if (!h) return null;
      if (Array.isArray(h)) {
        // Bazı responselarda boş dizi gelebiliyor; varsa ilk öğeyi al
        return h.length > 0 ? h[0] : null;
      }
      // Obje ise direkt dön
      return h;
    };

    if (!data) {
      return (
        <div className="flex flex-col w-full bg-white rounded-md p-4">
          <div className="text-center text-gray-500">Veri bulunamadı</div>
        </div>
      );
    }

    // Provider türünü belirle
    const isDiseaseProvider = isDiseaseProviderData(data);
    const isDoctorProvider = isDoctorData(data);
    const isHospitalDetail = isHospitalDetailData(data);
    const isDoctorDetail = isDoctorDetailData(data);

    // Disease provider türlerini belirle
    const isDiseaseDoctor = isDiseaseProvider && getUserType() === "doctor";
    const isDiseaseCorporate =
      isDiseaseProvider && getUserType() === "corporate";

    // Mesaj gönderme işlemi
    const handleSendMessage = async () => {
      try {
        // Modal aç - isim ve fotoğrafı gönder
        const modalResult = await sendMessageModal({
          receiverName: getName(),
          receiverPhoto: getPhoto(),
        });

        if (!modalResult.isConfirmed || !modalResult.value) {
          return;
        }

        setIsSending(true);

        // Mesajı gönder
        const result = await createConversationAndSendMessage(
          getId(),
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
    };

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
            {getUserType() === "doctor" ? (
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
                }${getPhoto() ? " cursor-pointer" : ""}`}
              >
                <Zoom>
                  <ProfilePhoto
                    name={getName()}
                    photo={getPhoto()}
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

              <div className="flex flex-col gap-1 w-full h-full justify-evenly">
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    {onList ? (
                      <Link
                        href={
                          getUserType() === "doctor"
                            ? getLocalizedUrl("/[...slug]", locale, {
                                slug: [
                                  getDataProperty('slug'),
                                  (isDoctorDetail &&
                                    (data as any).doctor_info?.specialty
                                      ?.slug) ||
                                    (isDiseaseDoctor &&
                                      (data as DoctorProvider).doctor_info
                                        ?.specialty?.slug) ||
                                    "",
                                  (data as any).location?.country_slug,
                                  (data as any).location?.city_slug,
                                ].join("/"),
                              })
                            : getLocalizedUrl("/hospital/[...slug]", locale, {
                                slug: [
                                  getDataProperty('slug'),
                                  (data as any).location?.country_slug,
                                  (data as any).location?.city_slug,
                                ].join("/"),
                              })
                        }
                        title={getName()}
                        className="text-xl font-semibold hover:text-sitePrimary transition-all duration-300"
                      >
                        {getName()}
                      </Link>
                    ) : (
                      <h1 className="text-2xl font-semibold">{getName()}</h1>
                    )}
                  </div>
                  {!isHospital &&
                    (isDoctorProvider || isDiseaseDoctor || isDoctorDetail) && (
                      <p className="text-sitePrimary text-sm font-medium opacity-70">
                        {isDiseaseDoctor
                          ? (data as DoctorProvider).doctor_info?.specialty
                              ?.name || ""
                          : isDoctorDetail
                          ? (data as any).doctor_info?.specialty?.name || ""
                          : isDoctorProvider
                          ? data.doctor?.specialty?.name || ""
                          : ""}
                      </p>
                    )}
                  {isHospital &&
                    (isDiseaseCorporate || isHospitalDetail) &&
                    getDiseases().length > 0 && (
                      <div className="flex gap-1 items-center flex-wrap">
                        {getDiseases().slice(0, 3).map((disease, index) => (
                          <span
                            key={disease.disease_id}
                            className="text-sitePrimary text-sm font-medium opacity-70"
                          >
                            {disease.disease_name}
                            {index < Math.min(getDiseases().length, 3) - 1 &&
                              ", "}
                          </span>
                        ))}
                        {getDiseases().length > 3 && (
                          <span className="text-sm font-medium opacity-70">
                            ( +{getDiseases().length - 3} daha )
                          </span>
                        )}
                      </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <div className="flex gap-0.5 items-center font-medium text-sm">
                    {/* district null ise district'i gösterme ve şehirden sonra virgül koyma */}
                    <IoLocationOutline size={16} />
                    {(data as any).location && (data as any).location.country
                      ? `${(data as any).location.country}, ${
                          (data as any).location.city
                        }${ 
                            (data as any).location.district ? "," + (data as any).location.district : ""
                        }`
                      : isDoctorProvider
                      ? `${getDataProperty('country')}, ${getDataProperty('city')} ${getDataProperty('district') ? "," + getDataProperty('district') : ""}`
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
                    getHospital()?.slug &&
                    getHospital()) ||
                    (isDoctorDetail &&
                      getHospital()?.slug &&
                      getHospital()) ||
                    (isDoctorProvider &&
                      getHospital()?.slug &&
                      getHospital())) && (
                    <Link
                      href={getLocalizedUrl("/hospital/[...slug]", locale, {
                        slug: [
                          getHospital()?.slug || "",
                          getHospital()?.country_slug,
                          getHospital()?.city_slug,
                        ].join("/"),
                      })}
                      title={
                        getHospital()?.name || ""
                      }
                      className="flex gap-1 items-center text-xs opacity-70 hover:text-sitePrimary transition-all duration-300 w-fit"
                    >
                      <FaHouseMedical size={14} className="-mt-0.5" />
                      {getHospital()?.name || ""}
                    </Link>
                  )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between p-4 gap-4">
            <div className="flex flex-col items-end gap-1">
              {getRating() && getRating() !== null ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center min-w-10 font-medium p-2 bg-gray-50 border border-gray-200 text-gray-500 rounded-full select-none">
                      {getRating() || 0}
                    </div>
                    <div className="flex flex-col items-left gap-1 min-w-max">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }, (_, index) => (
                          <React.Fragment key={index}>
                            {getStar(index + 1, getRating() || 0, 16)}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-xs opacity-70">
                        {isDiseaseProvider
                          ? getCommentsCount() || 0
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
            title={isSending ? "Gönderiliyor..." : "Mesaj Gönder"}
            containerStyles={`flex items-center gap-2 rounded-md bg-gray-100 text-gray-500 px-4 py-2 min-w-max hover:bg-sitePrimary hover:text-white transition-all duration-300 ${
              isSending ? "opacity-50 cursor-not-allowed" : ""
            }`}
            leftIcon={<IoChatboxEllipses size={20} />}
            handleClick={handleSendMessage}
            isDisabled={isSending}
          />
          <AppointmentButton />
        </div>
      </div>
    );
  }
);

export default ProviderCard;
