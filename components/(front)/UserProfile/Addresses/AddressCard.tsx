"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";
import { Address } from "@/lib/types/user/addressesTypes";
import {
  setDefaultAddress,
  toggleStatusAddress,
  deleteAddress,
} from "@/lib/services/user/addresses";
import CustomButton from "@/components/Customs/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";
import {
  IoLocationOutline,
  IoStarOutline,
  IoStar,
  IoCreateOutline,
  IoTrashOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoBusinessOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import EditAddressModal from "@/components/(front)/UserProfile/Addresses/EditAddressModal";

interface AddressCardProps {
  address: Address;
  onUpdated: () => void;
  onDeleted: () => void;
  globalData?: any;
}

export default function AddressCard({
  address,
  onUpdated,
  onDeleted,
  globalData,
}: AddressCardProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Varsayılan adres yap
  const handleSetDefault = async () => {
    try {
      setIsLoading(true);
      await setDefaultAddress(address.id);
      await funcSweetAlert({
        title: t("Başarılı"),
        text: t("Varsayılan adres güncellendi"),
        icon: "success",
      });
      onUpdated();
    } catch (error) {
      console.error("Varsayılan adres hatası:", error);
      await funcSweetAlert({
        title: t("Hata"),
        text: t("Varsayılan adres güncellenirken bir hata oluştu"),
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adres durumunu değiştir
  const handleToggleStatus = async () => {
    try {
      setIsLoading(true);
      await toggleStatusAddress(address.id);
      await funcSweetAlert({
        title: t("Başarılı"),
        text: t(`Adres ${address.is_active ? "pasif" : "aktif"} hale getirildi`),
        icon: "success",
      });
      onUpdated();
    } catch (error) {
      console.error("Adres durumu hatası:", error);
      await funcSweetAlert({
        title: t("Hata"),
        text: t("Adres durumu değiştirilirken bir hata oluştu"),
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adres sil
  const handleDelete = async () => {
    const result = await funcSweetAlert({
      title: t("Emin misiniz?"),
      text: t("Bu adres kalıcı olarak silinecek"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Evet, Sil"),
      cancelButtonText: t("İptal"),
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await deleteAddress(address.id);
        await funcSweetAlert({
          title: t("Başarılı"),
          text: t("Adres başarıyla silindi"),
          icon: "success",
        });
        onDeleted();
      } catch (error) {
        console.error("Adres silme hatası:", error);
        await funcSweetAlert({
          title: t("Hata"),
          text: t("Adres silinirken bir hata oluştu"),
          icon: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Adres türü belirleme
  const isCompanyAddress = Boolean(address.company_id && address.company);
  const isPendingApplication =
    address.corporate_application?.status === "pending";

  return (
    <>
      <div
        className={`relative flex flex-col h-full justify-between bg-white border border-gray-200 rounded-md p-6 transition-all duration-300 ${
          isPendingApplication
            ? "opacity-50 cursor-not-allowed"
            : "hover:shadow-lg hover:border-sitePrimary/20"
        }`}
      >
        {/* Header */}
        <div className="">
          <div className="flex max-lg:flex-col items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 min-w-12 rounded-md flex items-center justify-center shadow-sm border ${
                  isCompanyAddress
                    ? "bg-blue-50 border-blue-200"
                    : "bg-sitePrimary/5 border-sitePrimary/20"
                }`}
              >
                {isCompanyAddress ? (
                  <IoBusinessOutline className="text-2xl text-blue-600" />
                ) : (
                  <IoLocationOutline className="text-2xl text-sitePrimary" />
                )}
              </div>
              <div className="flex flex-col gap-0.5">
                <h3
                  className="font-semibold text-gray-900 text-lg line-clamp-1"
                  title={address.name}
                >
                  {address.name}
                </h3>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  {isCompanyAddress ? (
                    <span className="flex items-center gap-1">
                      <IoBusinessOutline className="text-base" />
                      <span className="text-xs -mb-1">{t("Hastane Adresi")}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <IoLocationOutline className="text-base" />
                      <span className="text-xs -mb-1">{t("Kişisel Adres")}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {address.is_default && (
                <div className="flex items-center gap-1 px-3 py-1 bg-sitePrimary/10 text-sitePrimary rounded-full text-xs font-medium border border-sitePrimary/20">
                  <IoStar className="text-sm" />
                  {t("Varsayılan")}
                </div>
              )}
              <div
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                  address.is_active
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {address.is_active ? (
                  <IoCheckmarkCircleOutline className="text-sm" />
                ) : (
                  <IoCloseCircleOutline className="text-sm" />
                )}
                {address.is_active ? t("Aktif") : t("Pasif")}
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-gray-50 rounded-md p-2 mb-2">
            <div className="flex-1">
              <p className="text-gray-900 font-medium">{address.address}</p>
              <p className="text-sm text-gray-600 mt-1">
                {address.district}, {address.city}, {address.country}
              </p>
              {address.postal_code && (
                <p className="text-xs text-gray-500 mt-1">
                  {t("Posta Kodu")}: {address.postal_code}
                </p>
              )}
              {address.map_location && (
                <div className="mt-3 relative">
                  <div className="w-full h-40 rounded-md border border-gray-200 overflow-hidden bg-gray-100">
                    {showMap ? (
                      <div
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{
                          __html: address.map_location,
                        }}
                      />
                    ) : (
                      <CustomButton
                        containerStyles="w-full h-full flex items-center gap-1 justify-center bg-gradient-to-br from-gray-50 to-gray-200 hover:from-white hover:text-sitePrimary hover:to-sitePrimary/10 transition-colors duration-300"
                        handleClick={() => setShowMap(true)}
                        title={t("Konumu Göster")}
                        leftIcon={<IoLocationOutline size={24} />}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex 2xl:flex-row flex-col items-center justify-between gap-3 pt-4 border-t border-gray-200">
          <div className="flex gap-2 max-lg:w-full">
            {!address.company_id && (
              <CustomButton
                title={t("Düzenle")}
                containerStyles="flex items-center justify-center max-lg:w-full gap-2 px-4 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                leftIcon={<IoCreateOutline className="text-sm" />}
                handleClick={() => setShowEditModal(true)}
                isDisabled={
                  isLoading || isCompanyAddress || isPendingApplication
                }
              />
            )}

            <CustomButton
              title={address.is_default ? t("Varsayılan") : t("Varsayılan Adres Yap")}
              containerStyles={`flex items-center justify-center max-lg:w-full gap-2 px-4 py-2 text-xs text-gray-600 rounded-md transition-colors border border-gray-200 ${
                address.is_default
                  ? "bg-sitePrimary/5 text-sitePrimary border-sitePrimary/20 hover:text-sitePrimary hover:bg-sitePrimary/10"
                  : "hover:text-gray-800 hover:bg-gray-100"
              }`}
              leftIcon={
                address.is_default ? (
                  <IoStar className="text-sm" />
                ) : (
                  <IoStarOutline className="text-sm" />
                )
              }
              handleClick={handleSetDefault}
              isDisabled={
                isLoading || address.is_default || isPendingApplication
              }
            />
          </div>

          <div className="flex gap-2 max-lg:w-full">
            <CustomButton
              title={address.is_active ? t("Pasif Yap") : t("Aktif Yap")}
              containerStyles={`flex items-center justify-center max-lg:w-full gap-2 px-4 py-2 text-xs rounded-md transition-colors border ${
                address.is_active
                  ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50 border-orange-200"
                  : "text-green-600 hover:text-green-800 hover:bg-green-50 border-green-200"
              }`}
              leftIcon={
                address.is_active ? (
                  <IoCloseCircleOutline className="text-sm" />
                ) : (
                  <IoCheckmarkCircleOutline className="text-sm" />
                )
              }
              handleClick={handleToggleStatus}
              isDisabled={isLoading || isPendingApplication}
            />

            <CustomButton
              title={t("Sil")}
              containerStyles="flex items-center justify-center max-lg:w-full gap-2 px-4 py-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors border border-red-200"
              leftIcon={<IoTrashOutline className="text-sm" />}
              handleClick={handleDelete}
              isDisabled={isLoading || isPendingApplication}
            />
          </div>
        </div>

        {/* Pending Application Overlay */}
        {isPendingApplication && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs rounded-md flex items-center justify-center z-10 select-none">
            <div className="text-center p-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <IoCalendarOutline className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t("Onay Bekleniyor")}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("Bu adres kurum tarafından henüz onaylanmadı")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditAddressModal
          address={address}
          onClose={() => setShowEditModal(false)}
          onSuccess={onUpdated}
          globalData={globalData}
        />
      )}
    </>
  );
}
