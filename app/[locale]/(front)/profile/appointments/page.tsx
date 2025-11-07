import React from "react";
import AppointmentsView from "@/components/(front)/UserProfile/Appointments/Provider/AppointmentsView";
import { getServerUser } from "@/lib/utils/getServerUser";
import IndividualAppointmentsView from "@/components/(front)/UserProfile/Appointments/Individual/AppointmentsView";

interface AppointmentsPageProps {
  searchParams: Promise<{
    view?: "today" | "week" | "month" | "all";
    address_id?: string;
  }>;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const resolvedSearchParams = await searchParams;
  const viewType =
    (resolvedSearchParams.view as "today" | "week" | "month" | "all") || "all";
  const addressId = resolvedSearchParams.address_id || null;
  const user = await getServerUser();

  if (user?.user_type === "individual") {
    return (
      <div className="flex flex-col gap-6 w-full">
        <IndividualAppointmentsView />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6 w-full">
      <AppointmentsView viewType={viewType} addressId={addressId} user={user} />
    </div>
  );
}
