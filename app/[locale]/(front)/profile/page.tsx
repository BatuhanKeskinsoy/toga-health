import ProfileContent from "@/components/(front)/UserProfile/ProfileContent";
import { getServerUser } from "@/lib/services/userService";
import React from "react";

export default async function page() {
  const user = await getServerUser();
  
  return (
      <ProfileContent user={user} />
  );
}