import api from "@/lib/axios";
import { DoctorsListResponse } from "@/lib/types/provider/doctorTypes";

export async function getCorporateDoctors(corporateId: number): Promise<DoctorsListResponse> {
  const res = await api.get(`/doctors?corporate_id=${corporateId}`);
  return res.data;
}

export async function getToBeApprovedDoctors(): Promise<void> {
  const res = await api.get(`/user/doctor-corporate-requests`);
  return res.data;
}

export async function addDoctorToCorporate(email: string): Promise<void> {
  const res = await api.post(`/user/add-doctor`, { email });
  return res.data;
}

export async function approveDoctor(doctorId: number): Promise<void> {
  const res = await api.post(
    `/user/doctor-corporate-requests/${doctorId}/approve`
  );
  return res.data;
}

export async function rejectDoctor(
  doctorId: number,
  reason: string
): Promise<void> {
  const res = await api.post(
    `/user/doctor-corporate-requests/${doctorId}/reject`,
    { rejection_reason: reason }
  );
  return res.data;
}
