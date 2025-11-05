import React from "react";
import AppointmentsView from "@/components/(front)/UserProfile/Appointments/AppointmentsView";

interface AppointmentsPageProps {
  searchParams: {
    view?: "today" | "week" | "month" | "all";
    address_id?: string;
  };
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const viewType = (searchParams.view as "today" | "week" | "month" | "all") || "all";
  const addressId = searchParams.address_id || null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AppointmentsView viewType={viewType} addressId={addressId} />
    </div>
  );
}
