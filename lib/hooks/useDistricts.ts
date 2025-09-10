"use client";
import { useState, useEffect } from "react";
import { getDistricts } from "@/lib/services/locations";
import { District } from "@/lib/types/locations/locationsTypes";

interface UseDistrictsReturn {
  districts: District[];
  loading: boolean;
  error: string | null;
}

// Cookie işlemleri için yardımcı fonksiyonlar
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export const useDistricts = (
  countrySlug: string | null,
  citySlug: string | null
): UseDistrictsReturn => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      // Cookie'den location kontrolü
      const cityCookie = getCookie("selected_city");
      const districtCookie = getCookie("selected_district");

      // Eğer cookie'de location varsa ve citySlug null ise, cookie'den al
      let targetCitySlug = citySlug;
      let targetCountrySlug = countrySlug;

      if (!targetCitySlug && cityCookie) {
        try {
          const cityData = JSON.parse(cityCookie);
          targetCitySlug = cityData.slug;
        } catch (err) {
          // Cookie parse edilemezse boş bırak
        }
      }

      if (!targetCountrySlug && cityCookie) {
        try {
          const cityData = JSON.parse(cityCookie);
          targetCountrySlug = cityData.countrySlug;
        } catch (err) {
          // Cookie parse edilemezse boş bırak
        }
      }

      if (!targetCitySlug || !targetCountrySlug) {
        setDistricts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getDistricts(targetCountrySlug, targetCitySlug);
        setDistricts(data.districts || []);
      } catch (err: any) {
        setError(err.message || "İlçeler yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [countrySlug, citySlug]);

  return { districts, loading, error };
};
