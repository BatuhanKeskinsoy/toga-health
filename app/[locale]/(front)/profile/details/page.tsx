

import DoctorProfileContent from "@/components/(front)/UserProfile/ProfileDetails/Doctor/ProfileContent";
import CorporateStatistics from "@/components/(front)/UserProfile/Statistics/CorporateStatistics";
import { getTimezones, getCurrencies, getPhoneCodes } from "@/lib/services/globals";
import { getCountries } from "@/lib/services/locations";
import { redirect } from "next/navigation";
import React from "react";
import { getServerUser } from "@/lib/utils/getServerUser";

export default async function ProfileDetailsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/profile");
  }
  if (user.user_type === "individual") {
    redirect("/profile");
  }

  // Server-side'da global verileri çek
  const [timezonesResponse, currenciesResponse, phoneCodesResponse, countriesResponse] = await Promise.all([
    getTimezones(),
    getCurrencies(),
    getPhoneCodes(),
    getCountries()
  ]);

  const globalData = {
    timezones: timezonesResponse.data || [],
    currencies: currenciesResponse.data || [],
    phoneCodes: phoneCodesResponse.data || [],
    countries: countriesResponse || []
  };

  if (user.user_type === "doctor") {
    return <DoctorProfileContent user={user} globalData={globalData} />;
  }

  if (user.user_type === "corporate") {
    return <CorporateStatistics user={user} />;
  }

  redirect("/profile");
}
