import { getShortName } from "@/lib/functions/getShortName";
import { UserTypes } from "@/lib/types/user/UserTypes";
import Image from "next/image";
import React from "react";

interface IProfilePhoto {
  user?: UserTypes;
  photo?: string;
  name?: string;
  size?: number;
  fontSize?: number;
  enableZoom?: boolean;
  responsiveSizes?: {
    desktop: number;
    mobile: number;
  };
  responsiveFontSizes?: {
    desktop: number;
    mobile: number;
  };
}

function ProfilePhoto({
  user,
  photo,
  name,
  size,
  fontSize = 12,
  enableZoom = false,
  responsiveSizes,
  responsiveFontSizes,
}: IProfilePhoto) {
  const imageSize = `${size || 36}px`;

  const imageSrc = user?.image ?? photo;
  const displayName = user?.name ?? name ?? "User";

  if (imageSrc) {
    if (enableZoom) {
      const desktopSize = responsiveSizes?.desktop || size || 36;
      const mobileSize = responsiveSizes?.mobile || size || 36;

      return (
        <Image
          src={imageSrc}
          alt={`${displayName} profile photo`}
          title={`${displayName} profile photo`}
          fill
          sizes={`(max-width: 1024px) ${mobileSize}, ${desktopSize}`}
          className="w-full h-full object-cover"
          style={
            {
              width: responsiveSizes ? "100%" : size || "100%",
              height: responsiveSizes ? "100%" : size || "100%",
              minWidth: responsiveSizes ? "100%" : size || "100%",
              "--desktop-size": `${desktopSize}px`,
              "--mobile-size": `${mobileSize}px`,
            } as React.CSSProperties
          }
          data-desktop-size={desktopSize}
          data-mobile-size={mobileSize}
        />
      );
    }

    return (
      <div
        className="relative"
        style={{
          width: size || "100%",
          height: size || "100%",
          minWidth: size || "100%",
        }}
      >
        <Image
          src={imageSrc}
          alt={`${displayName} profile photo`}
          title={`${displayName} profile photo`}
          fill
          sizes={`(max-width: 1024px) ${imageSize}, ${imageSize}`}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const desktopSize = responsiveSizes?.desktop || size || 36;
  const mobileSize = responsiveSizes?.mobile || size || 36;
  const desktopFontSize = responsiveFontSizes?.desktop || fontSize || 12;
  const mobileFontSize = responsiveFontSizes?.mobile || fontSize || 12;

  // Client-side'da short name'i hesapla
  const shortName = getShortName(displayName);

  return (
    <span
      className="flex items-center justify-center bg-sitePrimary/10 text-sitePrimary select-none font-medium uppercase transition-all duration-300"
      style={
        {
          fontSize: responsiveFontSizes ? mobileFontSize : fontSize,
          width: responsiveSizes ? mobileSize : size || "100%",
          minWidth: responsiveSizes ? mobileSize : size || "100%",
          height: responsiveSizes ? mobileSize : size || "100%",
          "--desktop-size": `${desktopSize}px`,
          "--mobile-size": `${mobileSize}px`,
          "--desktop-font-size": `${desktopFontSize}px`,
          "--mobile-font-size": `${mobileFontSize}px`,
        } as React.CSSProperties
      }
      data-desktop-size={desktopSize}
      data-mobile-size={mobileSize}
      data-desktop-font-size={desktopFontSize}
      data-mobile-font-size={mobileFontSize}
    >
      {shortName}
    </span>
  );
}

export default React.memo(ProfilePhoto);
