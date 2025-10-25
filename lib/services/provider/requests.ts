import api from "@/lib/axios";
import {
  GetCorporateDoctorsResponse,
  GetToBeApprovedDoctorsResponse,
  AddDoctorToCorporateResponse,
  AddDoctorToCorporateRequest,
} from "@/lib/types/provider/requestsTypes";

export async function getCorporateDoctors(
  corporateId: number,
  page: number = 1
): Promise<GetCorporateDoctorsResponse> {
  const res = await api.get(
    `/doctors?corporate_id=${corporateId}&page=${page}`
  );
  return res.data;
}

export async function getToBeApprovedDoctors(
  page: number = 1,
  status: string
): Promise<GetToBeApprovedDoctorsResponse> {
  const res = await api.get(
    `/user/doctor-corporate-requests?status=${status}&page=${page}`
  );
  return res.data;
}

export async function addDoctorToCorporate(
  data: AddDoctorToCorporateRequest
): Promise<AddDoctorToCorporateResponse> {
  const res = await api.post(`/user/add-doctor`, data);
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

export async function removeDoctorFromCorporate(
  doctorId: number
): Promise<void> {
  const res = await api.delete(`/addresses/doctor/${doctorId}`);
  return res.data;
}