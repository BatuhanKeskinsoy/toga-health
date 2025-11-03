import api from "@/lib/axios";

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
    console.error("Get provider unified services API error:", error);
    throw error;
  }
};

// Adres için randevu alınmış saatleri getirir
export const getAppointmentBookedSlots = async (
  bookable_id: number, // Doktor/Kurum User ID
  address_id: string, // Adres ID
  days?: number // göndermezsek default 4 gelir
) => {
  try {
    const response = await api.get(
      `/appointments/booked-days?bookable_id=${bookable_id}&address_id=${address_id}${
        days ? `&days=${days}` : ""
      }`
    );
    return response.data;
  } catch (error) {
    console.error("Get provider unified services API error:", error);
    throw error;
  }
};
