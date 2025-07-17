"use client";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

interface District {
  id: number;
  name: string;
  cityId: number;
}

interface UseDistrictsReturn {
  districts: District[];
  loading: boolean;
  error: string | null;
}

// Fallback veriler - API çalışmazsa kullanılacak
const fallbackDistricts = {
  26: [ // Eskişehir
    { id: 1, name: "Tepebaşı", cityId: 26 },
    { id: 2, name: "Odunpazarı", cityId: 26 },
    { id: 3, name: "Alpu", cityId: 26 },
    { id: 4, name: "Beylikova", cityId: 26 },
    { id: 5, name: "Çifteler", cityId: 26 },
    { id: 6, name: "Günyüzü", cityId: 26 },
    { id: 7, name: "Han", cityId: 26 },
    { id: 8, name: "İnönü", cityId: 26 },
    { id: 9, name: "Mahmudiye", cityId: 26 },
    { id: 10, name: "Mihalgazi", cityId: 26 },
    { id: 11, name: "Mihalıççık", cityId: 26 },
    { id: 12, name: "Sarıcakaya", cityId: 26 },
    { id: 13, name: "Seyitgazi", cityId: 26 },
    { id: 14, name: "Sivrihisar", cityId: 26 },
  ],
  34: [ // İstanbul
    { id: 15, name: "Kadıköy", cityId: 34 },
    { id: 16, name: "Beşiktaş", cityId: 34 },
    { id: 17, name: "Şişli", cityId: 34 },
    { id: 18, name: "Beyoğlu", cityId: 34 },
    { id: 19, name: "Fatih", cityId: 34 },
    { id: 20, name: "Üsküdar", cityId: 34 },
  ],
  6: [ // Ankara
    { id: 67, name: "Çankaya", cityId: 6 },
    { id: 68, name: "Keçiören", cityId: 6 },
    { id: 69, name: "Mamak", cityId: 6 },
    { id: 70, name: "Yenimahalle", cityId: 6 },
    { id: 71, name: "Etimesgut", cityId: 6 },
    { id: 72, name: "Sincan", cityId: 6 },
  ],
  35: [ // İzmir
    { id: 92, name: "Konak", cityId: 35 },
    { id: 93, name: "Bornova", cityId: 35 },
    { id: 94, name: "Karşıyaka", cityId: 35 },
    { id: 95, name: "Buca", cityId: 35 },
    { id: 96, name: "Çiğli", cityId: 35 },
    { id: 97, name: "Bayraklı", cityId: 35 },
  ],
};

export const useDistricts = (cityId: number | null): UseDistrictsReturn => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!cityId) {
        setDistricts([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("Fetching districts for cityId:", cityId);
        const response = await axios.get(`http://localhost:3000/api/districts/${cityId}`);
        
        console.log("Districts response:", response.data);
        
        if (response.data.success) {
          setDistricts(response.data.data);
        } else {
          setError(response.data.message || "İlçeler yüklenirken hata oluştu");
        }
      } catch (err: any) {
        console.error("Districts fetch error:", err);
        console.log("Using fallback districts for cityId:", cityId);
        
        // API çalışmazsa fallback verileri kullan
        const fallbackData = fallbackDistricts[cityId as keyof typeof fallbackDistricts] || [];
        setDistricts(fallbackData);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [cityId]);

  return { districts, loading, error };
}; 