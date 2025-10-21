"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";
import { updateAddress } from "@/lib/services/user/addresses";
import { UpdateAddressRequest, Address } from "@/lib/types/user/addressesTypes";
import CustomModal from "@/components/others/CustomModal";
import { CustomInput } from "@/components/others/CustomInput";
import CustomButton from "@/components/others/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

interface EditAddressModalProps {
  address: Address;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAddressModal({
  address,
  onClose,
  onSuccess,
}: EditAddressModalProps) {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: address.name,
    address: address.address,
    country: address.country,
    city: address.city,
    district: address.district,
    postal_code: address.postal_code || "",
    is_default: address.is_default,
    is_active: address.is_active,
  });

  // Form alanlarını güncelle
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Adres güncelleme gönder
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.address ||
      !formData.city ||
      !formData.district
    ) {
      await funcSweetAlert({
        title: "Eksik Bilgi",
        text: "Lütfen tüm gerekli alanları doldurun.",
        icon: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);

      const submitData: UpdateAddressRequest = {
        name: formData.name,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        district: formData.district,
        postal_code: formData.postal_code,
        is_default: formData.is_default,
        is_active: formData.is_active,
      };

      await updateAddress(address.id, submitData);

      await funcSweetAlert({
        title: "Başarılı!",
        text: "Adresiniz başarıyla güncellendi.",
        icon: "success",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      await funcSweetAlert({
        title: "Hata!",
        text:
          error?.response?.data?.message ||
          "Bir hata oluştu. Lütfen tekrar deneyin.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={true} onClose={onClose} title="Adres Düzenle">
      <div className="space-y-6">
        <CustomInput
          label="Başlık Örnek: Ana Muayenehane"
          value={formData.name}
          onChange={(value) => handleInputChange("name", value)}
          required
        />

        <CustomInput
          label="Açık Adres"
          value={formData.address}
          onChange={(value) => handleInputChange("address", value)}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CustomInput
            label="Ülke"
            value={formData.country}
            onChange={(value) => handleInputChange("country", value)}
            required
          />
          <CustomInput
            label="Şehir"
            value={formData.city}
            onChange={(value) => handleInputChange("city", value)}
            required
          />
          <CustomInput
            label="İlçe"
            value={formData.district}
            onChange={(value) => handleInputChange("district", value)}
            required
          />
        </div>

        <CustomInput
          label="Posta Kodu"
          value={formData.postal_code}
          onChange={(value) => handleInputChange("postal_code", value)}
        />

        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) =>
                handleInputChange("is_default", e.target.checked)
              }
              className="w-5 h-5 text-sitePrimary border-gray-300 rounded focus:ring-sitePrimary"
            />
            <span className="text-sm text-gray-700">
              Varsayılan adres olarak ayarla
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleInputChange("is_active", e.target.checked)}
              className="w-5 h-5 text-sitePrimary border-gray-300 rounded focus:ring-sitePrimary"
            />
            <span className="text-sm text-gray-700">Aktif</span>
          </label>
        </div>

        <div className="flex max-lg:flex-col justify-end gap-3 pt-4">
          <CustomButton
            title="İptal"
            containerStyles="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            handleClick={onClose}
          />
          <CustomButton
            title={isLoading ? "Güncelleniyor..." : "Adres Güncelle"}
            containerStyles="px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
            handleClick={handleSubmit}
            isDisabled={isLoading}
          />
        </div>
      </div>
    </CustomModal>
  );
}
