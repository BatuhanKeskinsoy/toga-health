"use client";
import React, { useState } from "react";
import { sendContact, SendContactRequest } from "@/lib/services/contact";
import CustomInput from "@/components/Customs/CustomInput";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import CustomButton from "@/components/Customs/CustomButton";
import { useTranslations } from "next-intl";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoDocumentTextOutline,
  IoPaperPlaneOutline,
} from "react-icons/io5";
import funcSweetAlert from "@/lib/functions/funcSweetAlert";

function ContactForm() {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<SendContactRequest>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await sendContact(formData);
      
      if (response.status) {
        funcSweetAlert({
          title: t("Başarılı"),
          text: response.message || t("Mesajınız başarıyla gönderildi"),
          icon: "success",
        });
        
        // Form'u temizle
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        funcSweetAlert({
          title: t("Hata"),
          text: response.message || t("Mesaj gönderilirken bir hata oluştu"),
          icon: "error",
        });
      }
    } catch (error: any) {
      console.error("Contact form error:", error);
      funcSweetAlert({
        title: t("Hata"),
        text: error?.response?.data?.message || t("Mesaj gönderilirken bir hata oluştu"),
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== "" &&
    formData.subject.trim() !== "" &&
    formData.message.trim() !== "";

  return (
    <div className="bg-white rounded-md shadow-md shadow-gray-200 border border-gray-200 p-5 lg:p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {t("İletişim")}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <CustomInput
          id="name"
          name="name"
          type="text"
          label={t("Ad Soyad")}
          value={formData.name}
          onChange={handleInputChange}
          required
          icon={<IoPersonOutline />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomInput
            id="email"
            name="email"
            type="email"
            label={t("E-Posta")}
            value={formData.email}
            onChange={handleInputChange}
            required
            icon={<IoMailOutline />}
          />

          <CustomInput
            id="phone"
            name="phone"
            type="tel"
            label={t("Telefon")}
            value={formData.phone}
            onChange={handleInputChange}
            required
            icon={<IoCallOutline />}
          />
        </div>

        <CustomInput
          id="subject"
          name="subject"
          type="text"
          label={t("Başlık")}
          value={formData.subject}
          onChange={handleInputChange}
          required
          icon={<IoDocumentTextOutline />}
        />

        <CustomTextarea
          id="message"
          name="message"
          label={t("Mesajınızı buraya yazın")}
          value={formData.message}
          onChange={handleTextareaChange}
          required
          rows={5}
        />

        <CustomButton
          btnType="submit"
          title={isSubmitting ? t("Gönderiliyor") : t("Mesajı Gönder")}
          leftIcon={<IoPaperPlaneOutline className="text-base" />}
          containerStyles={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-300 ${
            isFormValid && !isSubmitting
              ? "bg-sitePrimary hover:bg-sitePrimary/90 text-white shadow-md hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          isDisabled={!isFormValid || isSubmitting}
        />
      </form>
    </div>
  );
}

export default ContactForm;

