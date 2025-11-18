"use client";
import React, { useState, useEffect } from "react";
import { sendContact, SendContactRequest } from "@/lib/services/contact";
import CustomInput from "@/components/Customs/CustomInput";
import CustomTextarea from "@/components/Customs/CustomTextarea";
import CustomButton from "@/components/Customs/CustomButton";
import CustomSelect from "@/components/Customs/CustomSelect";
import { useTranslations } from "next-intl";
import { getPhoneCodes } from "@/lib/services/globals";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoDocumentTextOutline,
  IoPaperPlaneOutline,
  IoFlagOutline,
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
  const [phoneCode, setPhoneCode] = useState<{
    id: number;
    name: string;
    code: string;
  } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCodeOptions, setPhoneCodeOptions] = useState<
    { id: number; name: string; code: string }[]
  >([]);

  // Telefon kodlarını API'den getir
  useEffect(() => {
    const fetchPhoneCodes = async () => {
      try {
        const response = await getPhoneCodes();
        if (response.status && response.data) {
          // API'den gelen kodları uygun formata çevir
          const formattedCodes = response.data.map((code, index) => ({
            id: index + 1,
            name: code,
            code: code,
          }));
          setPhoneCodeOptions(formattedCodes);
        }
      } catch (error) {
        console.error("Telefon kodları getirilemedi:", error);
      }
    };

    fetchPhoneCodes();
  }, []);

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
      // Telefon kodunu ve numarasını birleştir
      const fullPhone = phoneCode && phoneNumber 
        ? `${phoneCode.code}${phoneNumber}` 
        : phoneNumber;

      const submitData: SendContactRequest = {
        ...formData,
        phone: fullPhone,
      };

      const response = await sendContact(submitData);
      
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
        setPhoneCode(null);
        setPhoneNumber("");
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
    phoneCode !== null &&
    phoneNumber.trim() !== "" &&
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

        <div className="flex max-lg:flex-col gap-4">
          <div className="w-full sm:w-1/2">
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
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:w-2/3">
            <div className="w-full">
              <CustomSelect
                id="phone_code"
                name="phone_code"
                label={t("Ülke Kodu")}
                value={phoneCode}
                options={phoneCodeOptions}
                onChange={(option) =>
                  setPhoneCode(
                    option as {
                      id: number;
                      name: string;
                      code: string;
                    } | null
                  )
                }
                required
                icon={<IoFlagOutline />}
              />
            </div>
            <div className="w-full">
              <CustomInput
                id="phone_number"
                name="phone_number"
                type="tel"
                label={t("Telefon Numarası")}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                icon={<IoCallOutline />}
              />
            </div>
          </div>
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

