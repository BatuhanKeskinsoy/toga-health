import { getServerUser } from "@/lib/utils/getServerUser";
import { redirect } from "next/navigation";

export default async function ProfileDetailsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/profile");
  }

  if (user.user_type === "individual") {
    redirect("/profile");
  }

  if (user.user_type === "doctor") {
    return <div>Burası Doktor Detay Düzenleme Sayfası</div>;
  }

  if (user.user_type === "corporate") {
    return <div>Burası Kurumsal Detay Düzenleme Sayfası</div>;
  }

  redirect("/profile");
}


