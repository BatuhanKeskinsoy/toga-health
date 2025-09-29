import Banner from "@/components/(front)/Home/Banner/Banner";
import StatsSection from "@/components/(front)/Home/StatsSection";
import PopularSpecialties from "@/components/(front)/Home/Specialties/PopularSpecialties";
import PopularCountries from "@/components/(front)/Home/Countries/PopularCountries";
import DoctorsSection from "@/components/(front)/Home/Doctors/DoctorsSection";
import HospitalsSection from "@/components/(front)/Home/Hospitals/HospitalsSection";
import RecentComments from "@/components/(front)/Home/Comments/RecentComments";
import FAQSection from "@/components/(front)/Home/FAQ/FAQSection";
import { getHome } from "@/lib/services/pages/home";
import { HomeData } from "@/lib/types/pages/homeTypes";
import React from "react";

async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const homeResponse = await getHome();
  const homeData: HomeData = homeResponse.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="relative">
        <Banner />
        {/* İstatistikler */}
        <StatsSection
          doctorsCount={homeData.doctors_count}
          hospitalsCount={homeData.hospitals_count}
          countriesCount={homeData.countries_count}
        />
      </div>

      {/* Popüler Branşlar */}
      <PopularSpecialties
        specialties={homeData.populer_specialties}
        locale={locale}
      />

      {/* Öne Çıkan Doktorlar */}
      <DoctorsSection doctors={homeData.doctors} locale={locale} />

      {/* Öne Çıkan Hastaneler */}
      <HospitalsSection hospitals={homeData.hospitals} locale={locale} />

      {/* Popüler Ülkeler */}
      <PopularCountries countries={homeData.populer_countries} />

      {/* Son Yorumlar */}
      <RecentComments comments={homeData.comments} />

      {/* Sıkça Sorulan Sorular */}
      <FAQSection faqs={homeData.faqs} />
    </div>
  );
}

export default Home;
