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
}

function ProfilePhoto({
  user,
  photo,
  name,
  size = 36,
  fontSize = 12,
}: IProfilePhoto) {
  const imageSize = `${size}px`;

  const imageSrc = user?.image ?? photo;
  const displayName = user?.name ?? name ?? "User";
  
  if (imageSrc) {
    return (
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          minWidth: size,
        }}
      >
        <Image
          src={imageSrc}
          fill
          sizes={imageSize}
          alt={`${displayName} profile photo`}
          title={`${displayName} profile photo`}
          className={`object-cover min-w-${imageSize}`}
        />
      </div>
    );
  }

  return (
    <span
      className={`flex items-center justify-center bg-sitePrimary/10 text-sitePrimary select-none font-medium uppercase transition-all duration-300`}
      style={{ fontSize: fontSize, width: size, minWidth: size, height: size }}
    >
      {getShortName(displayName)}
    </span>
  );
}

export default React.memo(ProfilePhoto);
