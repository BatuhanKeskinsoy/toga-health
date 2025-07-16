"use client";
import { CustomInput } from "@/components/others/CustomInput";
import { Link } from "@/i18n/navigation";
import React, { useState } from "react";
import { IoLocationOutline, IoSearchOutline } from "react-icons/io5";

function SearchBar() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  return (
    <div className="relative w-full flex items-center justify-center gap-2">
      <div className="w-full">
        <CustomInput
          id="search"
          required
          type="text"
          name="search"
          autoComplete="search"
          inputMode="search"
          tabIndex={1}
          value={search}
          icon={<IoSearchOutline />}
          label={"Uzman, Branş, Hastalık veya Kurum Ara"}
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>
      <div className="w-full max-w-[200px]">
        <CustomInput
          id="country"
          required
          type="text"
          name="country"
          autoComplete="country"
          inputMode="text"
          tabIndex={3}
          value={country}
          icon={<IoLocationOutline />}
          label={"Ülke Seçiniz"}
          onChange={(e: any) => setCountry(e.target.value)}
        />
      </div>
      <div className="w-full max-w-[200px]">
        <CustomInput
          id="city"
          required
          type="text"
          name="city"
          autoComplete="city"
          inputMode="text"
          tabIndex={2}
          value={city}
          icon={<IoLocationOutline />}
          label={"Şehir Seçiniz"}
          onChange={(e: any) => setCity(e.target.value)}
        />
      </div>
      <div className="w-full max-w-[150px]">
        <Link
          href="/search"
          className="flex items-center justify-center gap-2 bg-sitePrimary text-white px-4 py-3 rounded-md w-full"
        >
          <IoSearchOutline className="text-2xl" />
          <span className="text-lg">Ara</span>
        </Link>
      </div>
    </div>
  );
}

export default SearchBar;
