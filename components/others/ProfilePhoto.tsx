import { getShortName } from "@/lib/functions/getShortName";
import { UserTypes } from "@/lib/types/user/UserTypes";
import Image from "next/image";
import React from "react";

interface IProfilePhoto {
  user: UserTypes;
  size?: number;
  fontSize?: number;
}

function ProfilePhoto({ user, size = 36, fontSize = 12 }: IProfilePhoto) {
  const imageSize = `${size}px`;
  
  if (user.image) {
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
          src={user.image}
          fill
          sizes={imageSize}
          alt={`${user.name || "User"} profile photo`}
          title={`${user.name || "User"} profile photo`}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <span
      className={`flex items-center justify-center bg-sitePrimary/10 group-hover:bg-sitePrimary text-sitePrimary group-hover:text-white font-medium uppercase transition-all duration-300`}
      style={{ fontSize: fontSize, width: size, minWidth: size, height: size }}
    >
      {getShortName(user.name)}
    </span>
  );
}

export default React.memo(ProfilePhoto);
