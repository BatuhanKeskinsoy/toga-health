"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";
import { createAddress } from "@/lib/services/user/addresses";
import {
  CreateAddressRequest,
  CreateAddressWithCompanyRequest,
} from "@/lib/types/user/addressesTypes";
import CustomModal from "@/components/others/CustomModal";
import { CustomInput } from "@/components/others/CustomInput";
import CustomSelect from "@/components/others/CustomSelect";
import CustomButton from "@/components/others/CustomButton";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

interface CreateAddressModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAddressModal({
  onClose,
  onSuccess,
}: CreateAddressModalProps) {
  const t = useTranslations();
  const [step, setStep] = useState<"type" | "personal" | "company">("type");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    country: "Türkiye",
    city: "",
    district: "",
    postal_code: "",
    is_default: false,
    is_active: true,
    company_register_code: "",
  });

  // Form alanlarını güncelle
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Kişisel adres formu gönder
  const handlePersonalSubmit = async () => {
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

      const submitData: CreateAddressRequest = {
        name: formData.name,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        district: formData.district,
        postal_code: formData.postal_code,
        is_default: formData.is_default,
        is_active: formData.is_active,
      };

      await createAddress(submitData);

      await funcSweetAlert({
        title: "Başarılı!",
        text: "Adresiniz başarıyla oluşturuldu.",
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

  // Hastane başvurusu gönder
  const handleCompanySubmit = async () => {
    if (!formData.company_register_code) {
      await funcSweetAlert({
        title: "Eksik Bilgi",
        text: "Lütfen hastane kayıt kodunu girin.",
        icon: "warning",
      });
      return;
    }

    try {
      setIsLoading(true);

      const submitData: CreateAddressWithCompanyRequest = {
        company_register_code: formData.company_register_code,
      };

      await createAddress(submitData);

      await funcSweetAlert({
        title: "Başarılı!",
        text: "Hastane başvurunuz başarıyla gönderildi.",
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

  // Adres türü seçimi
  const renderTypeSelection = () => (
    <div className="flex flex-col gap-6 text-center">
      <p className="text-lg text-gray-700 font-medium">
        Hangi tür adres eklemek istiyorsunuz?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {/* Kişisel Adres */}
        <div
          className="flex flex-col gap-3 border-2 border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-sitePrimary hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-white to-gray-50"
          onClick={() => setStep("personal")}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sitePrimary to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Kişisel Adres
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Kendi adresinizi oluşturun ve yönetin.
          </p>
          <div className="inline-flex items-center w-max mx-auto px-4 py-2 bg-sitePrimary/10 text-sitePrimary rounded-full text-sm font-medium">
            Adres Oluştur
          </div>
        </div>

        {/* Hastane Başvurusu */}
        <div
          className="flex flex-col gap-3 border-2 border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-sitePrimary hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br from-white to-gray-50"
          onClick={() => setStep("company")}
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sitePrimary to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M17 12H15V17H13V12H11V10H13V7H15V10H17V12Z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Hastane Başvurusu
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Hastaneye başvuru gönderin ve hastane adresini kullanın.
          </p>
          <div className="inline-flex items-center w-max mx-auto px-4 py-2 bg-sitePrimary/10 text-sitePrimary rounded-full text-sm font-medium">
            Başvuru Gönder
          </div>
        </div>
      </div>

      {/* Bilgi Kutusu */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border-l-4 border-sitePrimary">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-sitePrimary rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">💡</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700">Bilgi</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Kişisel adreslerinizi düzenleyebilir, hastane başvurularınızı
              takip edebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Kişisel adres formu
  const renderPersonalForm = () => (
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
            onChange={(e) => handleInputChange("is_default", e.target.checked)}
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
          title="Geri"
          containerStyles="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          handleClick={() => setStep("type")}
        />
        <CustomButton
          title={isLoading ? "Oluşturuluyor..." : "Adres Oluştur"}
          containerStyles="px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
          handleClick={handlePersonalSubmit}
          isDisabled={isLoading}
        />
      </div>
    </div>
  );

  // Hastane başvuru formu
  const renderCompanyForm = () => (
    <div className="space-y-6">
      {/* Bilgi Kutusu */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border-l-4 border-blue-500">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🏥</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Hastane Başvurusu
            </p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Hastane kayıt kodunu girerek hastaneye başvuru gönderebilirsiniz.
              Hastane başvurunuzu kabul ederse, hastane adresi adreslerinize
              eklenecektir.
            </p>
          </div>
        </div>
      </div>

      <CustomInput
        label="Hastane Kayıt Kodu"
        value={formData.company_register_code}
        onChange={(value) => handleInputChange("company_register_code", value)}
        required
      />

      <div className="flex max-lg:flex-col justify-end gap-3 pt-4">
        <CustomButton
          title="Geri"
          containerStyles="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          handleClick={() => setStep("type")}
        />
        <CustomButton
          title={isLoading ? "Gönderiliyor..." : "Başvuru Gönder"}
          containerStyles="px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
          handleClick={handleCompanySubmit}
          isDisabled={isLoading}
        />
      </div>
    </div>
  );

  return (
    <CustomModal
      isOpen={true}
      onClose={onClose}
      title={
        step === "type"
          ? "Yeni Adres Ekle"
          : step === "personal"
          ? "Kişisel Adres Oluştur"
          : "Hastane Başvurusu"
      }
    >
      {step === "type" && renderTypeSelection()}
      {step === "personal" && renderPersonalForm()}
      {step === "company" && renderCompanyForm()}
    </CustomModal>
  );
}
