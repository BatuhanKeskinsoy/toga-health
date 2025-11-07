import api from "@/lib/axios";
import {
  ProviderAppointmentsResponse,
  CreateAppointmentRequest,
  CreateAppointmentResponse,
  ConfirmAppointmentResponse,
  RejectAppointmentRequest,
  RejectAppointmentResponse,
  CompleteAppointmentRequest,
  CompleteAppointmentResponse,
  CancelAppointmentRequest,
  CancelAppointmentResponse,
} from "@/lib/types/appointments/provider";

// Provider'ın hastalıkları ve tedavileri birleştirilmiş şekilde listeler ayrıca hangi günlerde hangi saat aralığında randevu saati oluşturacağımızı alırız duration ile randevu süresini belirleriz. (Appointment Flow API) (Eğer doktor detayda ise address_id ve doctor_id gönderecek eğer kurum detayda ise doctor_id ve corporate_id gönderecek data olarak)
export const getProviderAppointmentServices = async (
  doctor_id: number,
  address_id?: string,
  corporate_id?: number
) => {
  try {
    const response = await api.get(
      `/appointment-flow/doctor-services?doctor_id=${doctor_id}${
        address_id ? `&address_id=${address_id}` : ""
      }${corporate_id ? `&corporate_id=${corporate_id}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Get provider appointment services API error:", error);
    throw error;
  }
};

// Adres için randevu alınmış saatleri getirir
export const getAppointmentBookedSlots = async (
  bookable_id: number, // Doktor/Kurum User ID
  address_id?: string, // Adres ID
  corporate_id?: number, // Kurum ID
  days?: number // göndermezsek default 4 gelir
) => {
  try {
    const response = await api.get(
      `/appointments/booked-days?bookable_id=${bookable_id}${
        address_id ? `&address_id=${address_id}` : ""
      }${corporate_id ? `&corporate_id=${corporate_id}` : ""}${
        days ? `&days=${days}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error("Get provider booked slots API error:", error);
    throw error;
  }
};

// Provider'ın randevularını getirir
export const getProviderAppointments = async (
  view_type: "today" | "week" | "month" | "all", // view_type: "today" günün randevularını, "week" haftanın randevularını, "month" ayın randevularını, "all" tüm randevuları getirir
  address_id?: string, // Adres ID
  doctor_id?: number // Kurum ID
  // Eğer doktor bu isteği alıyorsa address_id gönderecek randevularını alması için 
  // Eğer corporate bu isteği alıyorsa doctor_id gönderecek randevularını alması için
): Promise<ProviderAppointmentsResponse> => {
  try {
    const response = await api.get(
      `appointments/provider?view_type=${view_type}${
        doctor_id ? `&doctor_id=${doctor_id}` : ""
      }${address_id ? `&address_id=${address_id}` : ""}`
    );
    return response.data as ProviderAppointmentsResponse;
  } catch (error) {
    console.error("Get provider appointments API error:", error);
    throw error;
  }
};

// Randevu oluşturur
export const createAppointment = async (
  data: CreateAppointmentRequest
): Promise<CreateAppointmentResponse> => {
  try {
    const response = await api.post("/appointments", data);
    return response.data as CreateAppointmentResponse;
  } catch (error) {
    console.error("Create appointment API error:", error);
    throw error;
  }
};

// Randevu onaylar
export const confirmAppointment = async (
  appointmentId: number
): Promise<ConfirmAppointmentResponse> => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/confirm`);
    return response.data as ConfirmAppointmentResponse;
  } catch (error) {
    console.error("Confirm appointment API error:", error);
    throw error;
  }
};

// Randevu reddeder
export const rejectAppointment = async (
  appointmentId: number,
  data: RejectAppointmentRequest
): Promise<RejectAppointmentResponse> => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/reject`, data);
    return response.data as RejectAppointmentResponse;
  } catch (error) {
    console.error("Reject appointment API error:", error);
    throw error;
  }
};

// Randevu tamamlandı olarak işaretler
export const completeAppointment = async (
  appointmentId: number,
  data: CompleteAppointmentRequest
): Promise<CompleteAppointmentResponse> => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/complete`, data);
    return response.data as CompleteAppointmentResponse;
  } catch (error) {
    console.error("Complete appointment API error:", error);
    throw error;
  }
};

// Randevu iptal eder
export const cancelAppointment = async (
  appointmentId: number,
  data: CancelAppointmentRequest
): Promise<CancelAppointmentResponse> => {
  try {
    const response = await api.post(`/appointments/${appointmentId}/cancel`, data);
    return response.data as CancelAppointmentResponse;
  } catch (error) {
    console.error("Cancel appointment API error:", error);
    throw error;
  }
};
