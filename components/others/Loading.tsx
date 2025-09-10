import { siteName, siteURL } from "@/constants";
import { GeneralSettingsData } from "@/lib/types/settings/settingsTypes";
import Image from "next/image";
import React from "react";

function Loading({ generals }: { generals: GeneralSettingsData }) {
  return (
    <div className="z-50 w-screen h-full fixed overflow-hidden left-0 top-0 bg-gray-100">
      <div className="flex h-screen w-screen justify-center items-center">
        <div className="capitalize font-medium text-3xl text-site select-none animate-scaleMobile lg:animate-scaleDesktop">
          {generals?.general.find(item => item.key === "site_logo")?.value ? (
            <Image
              src={`${siteURL}/${generals.general.find(item => item.key === "site_logo")?.value}`}
              alt={siteName}
              title={siteName}
              width={150}
              height={150}
              className="h-[150px] w-[150px] object-contain"
              priority
            />
          ) : (
            <span>{siteName}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Loading);
