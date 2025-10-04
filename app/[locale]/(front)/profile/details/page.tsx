import CorporateProfiledetailsView from "@/components/(front)/UserProfile/Details/corporate/CorporateProfiledetailsView";
import DoctorProfiledetailsView from "@/components/(front)/UserProfile/Details/doctor/DoctorProfiledetailsView";
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
    return <DoctorProfiledetailsView user={user} />;
  }

  if (user.user_type === "corporate") {
    return <CorporateProfiledetailsView user={user} />;
  }

  redirect("/profile");
}


