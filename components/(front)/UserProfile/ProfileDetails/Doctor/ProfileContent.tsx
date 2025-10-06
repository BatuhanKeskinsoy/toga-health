"use client";
import { UserTypes } from "@/lib/types/user/UserTypes";
import { Timezone, Currency } from "@/lib/types/globals";
import { Country } from "@/lib/types/locations/locationsTypes";
interface GlobalData {
  timezones: Timezone[];
  currencies: Currency[];
  phoneCodes: string[];
  countries: Country[];
}

interface ProfileContentProps {
  user: UserTypes | null;
  globalData?: GlobalData;
}

export default function ProfileContent({
  user,
  globalData,
}: ProfileContentProps) {
  return (
    <div>
      <span>Kurumsal Profil Profil Ayarları</span>
      <span>user :{user.name}</span>
      <span>user :{user.email}</span>
      <span>user :{user.phone}</span>
      <span>user :{user.phone_code}</span>
      <span>user :{user.phone_number}</span>
      <span>user :{user.gender}</span>
      <span>user :{user.birth_date}</span>
      <span>user :{user.address}</span>
      <span>
        globalData :{" "}
        {globalData?.timezones.map((timezone) => timezone.name).join(", ")}
      </span>
      <span>
        globalData :{" "}
        {globalData?.currencies.map((currency) => currency.name).join(", ")}
      </span>
      <span>globalData : {globalData?.phoneCodes.join(", ")}</span>
      <span>
        globalData :{" "}
        {globalData?.countries.map((country) => country.name).join(", ")}
      </span>
    </div>
  );
}
