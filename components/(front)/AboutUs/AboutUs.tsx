import React from "react";
import Image from "next/image";
import { SettingsResponse } from "@/lib/types/settings/settingsTypes";
import { getTranslations } from "next-intl/server";
import {
  IoHeartOutline,
  IoPeopleOutline,
  IoMedicalOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

interface AboutUsProps {
  settings: SettingsResponse;
  locale: string;
}

async function AboutUs({ settings, locale }: AboutUsProps) {
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

  const aboutText = getSettingValue("about_text", "general");
  const aboutImage = getSettingValue("about_image", "general");

  return (
    <div className="container mx-auto lg:px-4 py-4 lg:py-8">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-16 items-start">
        {/* Text Content Section */}
        <div className={`flex-1 max-lg:px-4 lg:order-1 order-2 ${aboutImage ? "lg:w-3/5" : "w-full"}`}>
          <div className="flex flex-col gap-6">
            {/* Content Text */}
            {aboutText ? (
              <div
                className="prose prose-lg prose-gray max-w-none 
                      prose-headings:text-gray-900 prose-headings:font-bold
                      prose-p:text-gray-700 prose-p:leading-relaxed
                      prose-strong:text-gray-900 prose-strong:font-semibold
                      prose-a:text-sitePrimary prose-a:no-underline hover:prose-a:underline
                      prose-ul:text-gray-700 prose-ol:text-gray-700
                      prose-li:marker:text-sitePrimary"
                dangerouslySetInnerHTML={{ __html: aboutText }}
              />
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <IoMedicalOutline className="text-5xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">
                  {t("Hakkımızda bilgisi bulunamadı")}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Image Section */}
        {aboutImage && (
          <div className="w-full lg:w-2/5 flex-shrink-0 lg:order-2 order-1">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-sitePrimary/20 to-blue-500/20 lg:rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              <div className="relative w-full aspect-[4/3] lg:rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={aboutImage}
                  alt={t("Hakkımızda")}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AboutUs;
