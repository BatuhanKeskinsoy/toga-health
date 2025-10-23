import React from "react";
import { getServerUser } from "@/lib/utils/getServerUser";
import { redirect } from "next/navigation";
import { getCorporateDoctors } from "@/lib/services/provider/requests";

export default async function DoctorsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  // Server-side'da galeri verilerini çek
  let doctors = [];
  let error = null;

  try {
    const response = await getCorporateDoctors(user.id);
    doctors = response.data?.data || [];
  } catch (err) {
    console.error("Doktorlar verileri yüklenirken hata:", err);
    error = "Doktorlar verileri yüklenirken bir hata oluştu";
  }

  /* <GalleryContent 
      user={user} 
      initialGalleryItems={galleryItems}
      initialError={error}
    /> */
  return (
    <div>
      <h1>Doktorlar</h1>
    </div>
  );
}
