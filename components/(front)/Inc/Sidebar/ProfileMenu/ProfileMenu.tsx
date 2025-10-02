"use client";
import React from "react";
import ProfileSidebar from "@/components/(front)/UserProfile/Inc/ProfileSidebar";
import { UserTypes } from "@/lib/types/user/UserTypes";

interface ProfileMenuProps {
  user: UserTypes;
}

export default function ProfileMenu({ user }: ProfileMenuProps) {
  return (
    <div className="relative flex flex-col w-full h-[calc(100dvh-77px)] overflow-y-auto overflow-x-hidden">
        <ProfileSidebar user={user} />
    </div>
  );
}
