import React from "react";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { getTranslations } from "next-intl/server";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import ContactForm from "./ContactForm";

interface ContactProps {
  settings: SettingsResponse;
  locale: string;
}

async function Contact({ settings, locale }: ContactProps) {
  const t = await getTranslations({ locale });

  // Helper function to get setting value by key
  const getSettingValue = (
    key: string,
    group: string = "general"
  ): string | null => {
    const data = settings?.data;
    if (!data || !data[group] || !Array.isArray(data[group])) return null;
    const setting = data[group].find((item) => item.key === key);
    if (!setting) return null;

    // Handle different value types
    if (typeof setting.value === "string") {
      return setting.value;
    }
    if (
      typeof setting.value === "number" ||
      typeof setting.value === "boolean"
    ) {
      return String(setting.value);
    }
    return null;
  };

  const email = getSettingValue("email", "general");
  const phone = getSettingValue("phone", "general");
  const address = getSettingValue("address", "default");
  const addressIframe = getSettingValue("address_iframe", "default");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 lg:gap-8 items-start">
        {/* Contact Form */}
        <ContactForm />
        {/* Contact Information */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-md border border-gray-200 p-5 lg:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-1 w-12 bg-gradient-to-r from-sitePrimary to-blue-500 rounded-full"></div>
              <h2 className="text-xl font-bold text-gray-900">
                {t("Mevcut İletişim Bilgileri")}
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-sitePrimary/5 hover:to-sitePrimary/10 hover:border-sitePrimary/30 border border-transparent transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-sitePrimary/10 to-sitePrimary/5 flex items-center justify-center group-hover:from-sitePrimary group-hover:to-sitePrimary/90 group-hover:scale-110 group-hover:shadow-lg transition-all">
                    <IoMailOutline className="text-sitePrimary group-hover:text-white text-xl transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      {t("E-Posta")}
                    </h3>
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-sitePrimary transition-colors">
                      {email}
                    </p>
                  </div>
                </a>
              )}

              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50/50 hover:from-blue-50 hover:to-blue-50/50 hover:border-blue-300 border border-transparent transition-all group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-600 group-hover:to-blue-500 group-hover:scale-110 group-hover:shadow-lg transition-all">
                    <IoCallOutline className="text-blue-600 group-hover:text-white text-xl transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      {t("Telefon")}
                    </h3>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {phone}
                    </p>
                  </div>
                </a>
              )}

              {address && (
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50/50 border border-transparent">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <IoLocationOutline className="text-green-600 text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                      {t("Adres")}
                    </h3>
                    <p className="text-sm text-gray-900 leading-relaxed">
                      {address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Map Section - Inside Contact Info Card */}
            {addressIframe && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  {t("Konum")}
                </h3>
                <div className="w-full rounded-lg overflow-hidden border border-gray-200">
                  <div className="w-full aspect-video">
                    <div
                      dangerouslySetInnerHTML={{ __html: addressIframe }}
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;
