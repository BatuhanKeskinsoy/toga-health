import Banner from "@/components/(front)/Home/Banner/Banner";
import StatsSection from "@/components/(front)/Home/StatsSection";
import PopularSpecialties from "@/components/(front)/Home/PopularSpecialties";
import PopularCountries from "@/components/(front)/Home/PopularCountries";
import DoctorsSection from "@/components/(front)/Home/DoctorsSection";
import HospitalsSection from "@/components/(front)/Home/HospitalsSection";
import RecentComments from "@/components/(front)/Home/RecentComments";
import { getHome } from "@/lib/services/pages/home";
import { HomeData } from "@/lib/types/pages/homeTypes";
import React from "react";

async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const homeResponse = await getHome();
  const homeData: HomeData = homeResponse.data;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Banner />
      <div className="container mx-auto px-4 py-16">
        {/* İstatistikler */}
        <StatsSection
          doctorsCount={homeData.doctors_count}
          hospitalsCount={homeData.hospitals_count}
          countriesCount={homeData.countries_count}
        />

        {/* Popüler Branşlar */}
        <PopularSpecialties
          specialties={homeData.populer_specialties}
          locale={locale}
        />

        {/* Öne Çıkan Doktorlar */}
        <DoctorsSection
          doctors={homeData.doctors}
          locale={locale}
        />

        {/* Öne Çıkan Hastaneler */}
        <HospitalsSection
          hospitals={homeData.hospitals}
          locale={locale}
        />

        {/* Popüler Ülkeler */}
        <PopularCountries
          countries={homeData.populer_countries}
        />

        {/* Son Yorumlar */}
        <RecentComments
          comments={homeData.comments}
        />
      </div>
    </div>
  );
}

export default Home;
