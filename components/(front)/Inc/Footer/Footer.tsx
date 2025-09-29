import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SettingItem,
  SettingsData,
  SettingsResponse,
} from "@/lib/types/settings/settingsTypes";
import {
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { getSocialIcon } from "@/lib/functions/getSocialIcon";
import { getLocalizedUrl } from "@/lib/utils/getLocalizedUrl";

interface FooterProps {
  generals?: SettingsResponse | SettingsData | SettingItem[];
  locale: string;
}

function Footer({ locale, generals = [] }: FooterProps) {
  // Extract data from response
  const data =
    (generals as SettingsResponse)?.data || (generals as SettingsData);
  const settingsResponse = generals as SettingsResponse;

  // Helper function to get setting value by key
  const getSettingValue = (
    key: string,
    group: string = "general"
  ): string | null => {
    if (!data || !data[group] || !Array.isArray(data[group])) return null;
    const setting = data[group].find((item) => item.key === key);
    return setting ? String(setting.value) : null;
  };

  // Get required settings
  const appName = getSettingValue("app_name") || "Toga Health";
  const appDescription =
    getSettingValue("app_description") || "Global Sağlık Randevu Sistemi";
  const email = getSettingValue("email");
  const phone = getSettingValue("phone");
  const siteLogo = getSettingValue("site_logo");
  const address = getSettingValue("address") || "İstanbul";

  // Get popular data
  const popularDiseases = settingsResponse?.populer_diseases?.slice(0, 5) || [];
  const popularTreatments =
    settingsResponse?.populer_treatments?.slice(0, 5) || [];
  const popularSpecialties =
    settingsResponse?.populer_specialties?.slice(0, 5) || [];

  // Social media links
  const facebook = getSettingValue("facebook", "social_media");
  const instagram = getSettingValue("instagram", "social_media");
  const twitter = getSettingValue("twitter", "social_media");
  const linkedin = getSettingValue("linkedin", "social_media");
  const youtube = getSettingValue("youtube", "social_media");

  console.log("Footer locale :", locale);
  return (
    <footer className="bg-white text-gray-900 shadow-gray-200 shadow-lg">
      <div className="container mx-auto px-4 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Company Info */}
          <div className="flex flex-col gap-4">
            {siteLogo && (
              <div className="relative w-28 h-28">
                <Image
                  src={siteLogo}
                  alt={appName}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-gray-600 text-sm leading-relaxed">
              {appDescription}
            </p>
            <div className="flex gap-4">
              {facebook && (
                <Link
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Facebook"
                >
                  {getSocialIcon("facebook")}
                </Link>
              )}
              {instagram && (
                <Link
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Instagram"
                >
                  {getSocialIcon("instagram")}
                </Link>
              )}
              {twitter && (
                <Link
                  href={twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="Twitter"
                >
                  {getSocialIcon("twitter")}
                </Link>
              )}
              {linkedin && (
                <Link
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="LinkedIn"
                >
                  {getSocialIcon("linkedin")}
                </Link>
              )}
              {youtube && (
                <Link
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label="YouTube"
                >
                  {getSocialIcon("youtube")}
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Hızlı Bağlantılar
            </h4>
            <ul className="flex flex-col gap-2">
              <li>
                <Link
                  href={`/${locale}${getLocalizedUrl("/branches", locale)}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  title="Branşlar"
                  aria-label="Branşlar"
                >
                  Branşlar
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}${getLocalizedUrl("/treatments-services", locale)}`}
                  title="Tedaviler ve Hizmetler"
                  aria-label="Tedaviler ve Hizmetler"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Tedaviler ve Hizmetler
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}${getLocalizedUrl("/diseases", locale)}`}
                  title="Hastalıklar"
                  aria-label="Hastalıklar"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Hastalıklar
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}${getLocalizedUrl("/aboutus", locale)}`}
                  title="Hakkımızda"
                  aria-label="Hakkımızda"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}${getLocalizedUrl("/contact", locale)}`}
                  title="İletişim"
                  aria-label="İletişim"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Diseases */}
          {popularDiseases.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Popüler Hastalıklar
              </h4>
              <ul className="flex flex-col gap-2">
                {popularDiseases.map((disease) => (
                  <li key={disease.id}>
                    <Link
                      href={`/${locale}${getLocalizedUrl("/diseases/[slug]", locale, {
                        slug: disease.slug,
                      })}`}
                      title={disease.name}
                      aria-label={disease.name}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {disease.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Treatments */}
          {popularTreatments.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Popüler Tedaviler
              </h4>
              <ul className="flex flex-col gap-2">
                {popularTreatments.map((treatment) => (
                  <li key={treatment.id}>
                    <Link
                      href={`/${locale}${getLocalizedUrl("/treatments-services/[slug]", locale, {
                        slug: treatment.slug,
                      })}`}
                      title={treatment.name}
                      aria-label={treatment.name}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {treatment.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Specialties */}
          {popularSpecialties.length > 0 && (
            <div className="flex flex-col gap-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Popüler Branşlar
              </h4>
              <ul className="flex flex-col gap-2">
                {popularSpecialties.map((specialty) => (
                  <li key={specialty.id}>
                    <Link
                      href={`/${locale}${getLocalizedUrl("/branches/[slug]", locale, {
                        slug: specialty.slug,
                      })}`}
                      title={specialty.name}
                      aria-label={specialty.name}
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                    >
                      {specialty.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-gray-900">İletişim</h4>
            <div className="flex flex-col gap-3">
              {email && (
                <div className="flex items-center gap-3">
                  <IoMailOutline className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <Link
                    href={`mailto:${email}`}
                    title={email}
                    aria-label={email}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {email}
                  </Link>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-3">
                  <IoCallOutline className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <Link
                    href={`tel:${phone}`}
                    title={phone}
                    aria-label={phone}
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm"
                  >
                    {phone}
                  </Link>
                </div>
              )}
              {address && (
                <div className="flex items-start gap-3">
                  <IoLocationOutline className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm" title={address} aria-label={address}>{address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {appName}. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
              >
                Gizlilik Politikası
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
              >
                Kullanım Şartları
              </Link>
              <Link
                href="/cookies"
                className="text-gray-500 hover:text-gray-900 transition-colors text-sm"
              >
                Çerez Politikası
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
