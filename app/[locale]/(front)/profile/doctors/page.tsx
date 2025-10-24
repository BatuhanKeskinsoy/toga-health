import React from "react";
import { getServerUser } from "@/lib/utils/getServerUser";
import { redirect } from "next/navigation";
import { getCorporateDoctors, getToBeApprovedDoctors } from "@/lib/services/provider/requests";
import { CorporateDoctorsMain } from "@/components/(front)/CorporateDoctors";
import { CorporateDoctor, PendingDoctorRequest } from "@/lib/types/provider/requestsTypes";

export default async function DoctorsPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  // Server-side'da doktor verilerini çek
  let doctors: CorporateDoctor[] = [];
  let pendingRequests: PendingDoctorRequest[] = [];
  let doctorsPagination = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
    from: 1,
    to: 0,
    hasMorePages: false,
  };
  let requestsPagination = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
    from: 1,
    to: 0,
    hasMorePages: false,
  };
  let error = null;

  try {
    // Kurumsal doktorları çek (sayfa 1)
    const doctorsResponse = await getCorporateDoctors(user.id, 1);
    doctors = doctorsResponse.data?.data || [];
    doctorsPagination = {
      currentPage: doctorsResponse.data?.current_page || 1,
      lastPage: doctorsResponse.data?.last_page || 1,
      total: doctorsResponse.data?.total || 0,
      perPage: doctorsResponse.data?.per_page || 15,
      from: doctorsResponse.data?.from || 1,
      to: doctorsResponse.data?.to || 0,
      hasMorePages: (doctorsResponse.data?.current_page || 1) < (doctorsResponse.data?.last_page || 1),
    };
    
    // Bekleyen istekleri çek (sayfa 1)
    const requestsResponse = await getToBeApprovedDoctors(1, "pending");
    pendingRequests = requestsResponse.data || [];
    requestsPagination = {
      currentPage: requestsResponse.pagination?.current_page || 1,
      lastPage: requestsResponse.pagination?.last_page || 1,
      total: requestsResponse.pagination?.total || 0,
      perPage: requestsResponse.pagination?.per_page || 15,
      from: requestsResponse.pagination?.from || 1,
      to: requestsResponse.pagination?.to || 0,
      hasMorePages: requestsResponse.pagination?.has_more_pages || false,
    };
  } catch (err) {
    console.error("Doktorlar verileri yüklenirken hata:", err);
    error = "Doktorlar verileri yüklenirken bir hata oluştu";
  }

  return (
    <CorporateDoctorsMain
      initialDoctors={doctors}
      initialPendingRequests={pendingRequests}
      initialDoctorsPagination={doctorsPagination}
      initialRequestsPagination={requestsPagination}
      userId={user.id}
    />
  );
}
