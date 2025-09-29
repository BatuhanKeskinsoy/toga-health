import Banner from "@/components/(front)/Home/Banner/Banner";
import PopularSpecialties from "@/components/(front)/Home/Specialties/PopularSpecialties";
import PopularCountries from "@/components/(front)/Home/Countries/PopularCountries";
import DoctorsSection from "@/components/(front)/Home/Doctors/DoctorsSection";
import HospitalsSection from "@/components/(front)/Home/Hospitals/HospitalsSection";
import RecentComments from "@/components/(front)/Home/Comments/RecentComments";
import FAQSection from "@/components/(front)/Home/FAQ/FAQSection";
import { getHome } from "@/lib/services/pages/home";
import { HomeData } from "@/lib/types/pages/homeTypes";
import React from "react";
import "@/public/styles/homepage.css";

async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const homeResponse = await getHome();
  const homeData: HomeData = homeResponse.data;

  return (
    <div className="flex flex-col bg-gray-50 *:border *:border-gray-100">
      {/* Search Banner */}
      <Banner
        doctors_count={homeData.doctors_count}
        hospitals_count={homeData.hospitals_count}
        countries_count={homeData.countries_count}
      />

      {/* Popüler Branşlar */}
      <section
        className="bg-white py-4 lg:py-20"
        aria-labelledby="popular-specialties-heading"
      >
        <PopularSpecialties
          specialties={homeData.populer_specialties}
          locale={locale}
        />
      </section>

      {/* Öne Çıkan Doktorlar */}
      <section
        className="py-4 lg:py-20"
        aria-labelledby="featured-doctors-heading"
      >
        <DoctorsSection doctors={homeData.doctors} locale={locale} />
      </section>

      {/* Öne Çıkan Hastaneler */}
      <section
        className="bg-white py-4 lg:py-20"
        aria-labelledby="featured-hospitals-heading"
      >
        <HospitalsSection hospitals={homeData.hospitals} locale={locale} />
      </section>

      {/* Popüler Ülkeler */}
      <section
        className="py-4 lg:py-20"
        aria-labelledby="popular-countries-heading"
      >
        <PopularCountries countries={homeData.populer_countries} />
      </section>

      {/* Son Yorumlar */}
      <section
        className="bg-white py-4 lg:py-20"
        aria-labelledby="recent-comments-heading"
      >
        <RecentComments comments={homeData.comments} locale={locale} />
      </section>

      {/* Sıkça Sorulan Sorular */}
      <section className="py-4 lg:py-20" aria-labelledby="faq-heading">
        <FAQSection faqs={homeData.faqs} />
      </section>
    </div>
  );
}

export default Home;
