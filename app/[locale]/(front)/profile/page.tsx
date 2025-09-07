import ProfileContent from "@/components/(front)/UserProfile/ProfileContent";
import { getUserProfile } from "@/lib/services/user/user";
import React from "react";

export default async function page() {
  const user = await getUserProfile();
  
  return (
      <ProfileContent user={user} />
  );
}