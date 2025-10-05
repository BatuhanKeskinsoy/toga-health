import ProfileContent from "@/components/(front)/UserProfile/ProfileDetails/Individual/ProfileContent";
import CorporateStatistics from "@/components/(front)/UserProfile/Statistics/CorporateStatistics";
import DoctorStatistics from "@/components/(front)/UserProfile/Statistics/DoctorStatistics";
import { getUserProfile } from "@/lib/services/user/user";
import { getTimezones, getCurrencies, getPhoneCodes } from "@/lib/services/globals";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getUserProfile();

  if (!user) {
    redirect("/login");
  }

  // Server-side'da global verileri çek
  const [timezonesResponse, currenciesResponse, phoneCodesResponse] = await Promise.all([
    getTimezones(),
    getCurrencies(),
    getPhoneCodes()
  ]);

  const globalData = {
    timezones: timezonesResponse.data || [],
    currencies: currenciesResponse.data || [],
    phoneCodes: phoneCodesResponse.data || []
  };

  if (user.user_type === "individual") {
    return <ProfileContent user={user} globalData={globalData} />;
  }

  if (user.user_type === "doctor") {
    return <DoctorStatistics user={user} />;
  }

  if (user.user_type === "corporate") {
    return <CorporateStatistics user={user} />;
  }
}
