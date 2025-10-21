"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";
import { Address } from "@/lib/types/user/addressesTypes";
import {
  setDefaultAddress,
  toggleStatusAddress,
  deleteAddress,
} from "@/lib/services/user/addresses";
import CustomButton from "@/components/others/CustomButton";
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
}

export default function AddressCard({
  address,
  onUpdated,
  onDeleted,
}: AddressCardProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Varsayılan adres yap
  const handleSetDefault = async () => {
    try {
      setIsLoading(true);
      await setDefaultAddress(address.id);
      await funcSweetAlert({
        title: "Başarılı",
        text: "Varsayılan adres güncellendi",
        icon: "success",
      });
      onUpdated();
    } catch (error) {
      console.error("Varsayılan adres hatası:", error);
      await funcSweetAlert({
        title: "Hata",
        text: "Varsayılan adres güncellenirken bir hata oluştu",
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
        title: "Başarılı",
        text: `Adres ${address.is_active ? "pasif" : "aktif"} hale getirildi`,
        icon: "success",
      });
      onUpdated();
    } catch (error) {
      console.error("Adres durumu hatası:", error);
      await funcSweetAlert({
        title: "Hata",
        text: "Adres durumu değiştirilirken bir hata oluştu",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Adres sil
  const handleDelete = async () => {
    const result = await funcSweetAlert({
      title: "Emin misiniz?",
      text: "Bu adres kalıcı olarak silinecek",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Evet, Sil",
      cancelButtonText: "İptal",
    });

    if (result.isConfirmed) {
      try {
        setIsLoading(true);
        await deleteAddress(address.id);
        await funcSweetAlert({
          title: "Başarılı",
          text: "Adres başarıyla silindi",
          icon: "success",
        });
        onDeleted();
      } catch (error) {
        console.error("Adres silme hatası:", error);
        await funcSweetAlert({
          title: "Hata",
          text: "Adres silinirken bir hata oluştu",
          icon: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Adres türü belirleme
  const isCompanyAddress = Boolean(address.company_id && address.company);

  return (
    <>
      <div className="flex flex-col h-full justify-between bg-white border border-gray-200 rounded-md p-6 hover:shadow-lg transition-all duration-300 hover:border-sitePrimary/20">
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
                <h3 className="font-semibold text-gray-900 text-lg line-clamp-1" title={address.name}>
                  {address.name}
                </h3>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  {isCompanyAddress ? (
                    <div className="flex items-center gap-1">
                      <IoBusinessOutline className="text-base" />
                      <span className="text-xs -mb-1">Hastane Adresi</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <IoLocationOutline className="text-base" />
                      <span className="text-xs -mb-1">Kişisel Adres</span>
                    </div>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {address.is_default && (
                <div className="flex items-center gap-1 px-3 py-1 bg-sitePrimary/10 text-sitePrimary rounded-full text-xs font-medium border border-sitePrimary/20">
                  <IoStar className="text-sm" />
                  Varsayılan
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
                {address.is_active ? "Aktif" : "Pasif"}
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
                <p className="text-sm text-gray-500 mt-1">
                  Posta Kodu: {address.postal_code}
                </p>
              )}
            </div>
          </div>

          {/* Company Info (if applicable) */}
          {isCompanyAddress && address.company && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <IoBusinessOutline className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  Hastane Bilgileri
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-blue-800">
                  {address.company.name}
                </p>
                <p className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
                  Kayıt Kodu: {address.company.register_code}
                </p>
              </div>
            </div>
          )}

          {/* Working Hours (if available) */}
          {address.working_days && address.working_days.length > 0 && (
            <div className="bg-gray-50 rounded-md p-2 mb-2">
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <IoCalendarOutline className="text-sitePrimary" />
                Çalışma Günleri
              </p>
              <div className="flex flex-wrap gap-2">
                {address.working_days.map((day, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-md text-xs font-medium"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex 2xl:flex-row flex-col items-center justify-between gap-3 pt-4 border-t border-gray-200">
          <div className="flex gap-2 max-lg:w-full">
            {!address.company_id && (
              <CustomButton
                title="Düzenle"
                containerStyles="flex items-center justify-center max-lg:w-full gap-2 px-4 py-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors border border-gray-200"
                leftIcon={<IoCreateOutline className="text-sm" />}
                handleClick={() => setShowEditModal(true)}
                isDisabled={isLoading || isCompanyAddress}
              />
            )}

            <CustomButton
              title={address.is_default ? "Varsayılan" : "Varsayılan Yap"}
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
              isDisabled={isLoading || address.is_default}
            />
          </div>

          <div className="flex gap-2 max-lg:w-full">
            <CustomButton
              title={address.is_active ? "Pasif Yap" : "Aktif Yap"}
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
              isDisabled={isLoading}
            />

            <CustomButton
              title="Sil"
              containerStyles="flex items-center justify-center max-lg:w-full gap-2 px-4 py-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors border border-red-200"
              leftIcon={<IoTrashOutline className="text-sm" />}
              handleClick={handleDelete}
              isDisabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditAddressModal
          address={address}
          onClose={() => setShowEditModal(false)}
          onSuccess={onUpdated}
        />
      )}
    </>
  );
}
