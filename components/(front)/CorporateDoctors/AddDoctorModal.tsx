"use client";
import React, { useState } from "react";
import CustomModal from "@/components/Customs/CustomModal";
import CustomInput from "@/components/Customs/CustomInput";
import CustomButton from "@/components/Customs/CustomButton";
import { IoMailOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      await Swal.fire({
        title: t("Uyarı"),
        text: t("E-Posta Adresinizi giriniz"),
        icon: "warning",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        doctor_finder: email.trim(),
      });

      // Form'u temizle
      setEmail("");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title={t("Yeni Doktor Ekle")}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <CustomInput
            label={t("E-Posta Adresiniz")}
            type="email"
            icon={<IoMailOutline />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <CustomButton
            btnType="button"
            handleClick={onClose}
            isDisabled={isLoading}
            containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            title={t("İptal")}
          />
          <CustomButton
            btnType="submit"
            containerStyles="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-sitePrimary text-white rounded-lg hover:bg-sitePrimary/90 transition-colors"
            isDisabled={isLoading}
            title={isLoading ? t("Yükleniyor") : t("Ekle")}
          />
        </div>
      </form>
    </CustomModal>
  );
};

export default AddDoctorModal;
