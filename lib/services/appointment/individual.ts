import api from "@/lib/axios";
import type {
  IndividualAppointmentStatus,
  IndividualAppointmentsResponse,
} from "@/lib/types/appointments";

interface GetIndividualAppointmentsParams {
  status?: IndividualAppointmentStatus;
  page?: number;
  perPage?: number;
}

const buildQueryString = ({
  status,
  page = 1,
  perPage,
}: GetIndividualAppointmentsParams) => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (perPage) {
    params.append("per_page", perPage.toString());
  }
  if (status) {
    params.append("status", status);
  }
  return params.toString();
};

export const getIndividualAppointments = async (
  params: GetIndividualAppointmentsParams = {}
): Promise<IndividualAppointmentsResponse> => {
  const queryString = buildQueryString(params);
  const url = queryString ? `appointments/user?${queryString}` : "appointments/user";
  const response = await api.get(url);
  return response.data as IndividualAppointmentsResponse;
};
