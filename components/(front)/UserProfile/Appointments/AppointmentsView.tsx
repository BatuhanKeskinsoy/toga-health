import React from "react";
import { getProviderAppointments } from "@/lib/services/appointment/services";
import { getUserAddresses } from "@/lib/services/user/addresses";
import { getServerUser } from "@/lib/utils/getServerUser";
import AppointmentsClientWrapper from "./AppointmentsClientWrapper";
import type { ProviderAppointmentsResponse } from "@/lib/types/appointments/provider";
import type { Address } from "@/lib/types/user/addressesTypes";
import { getTranslations, getLocale } from "next-intl/server";

interface AppointmentsViewProps {
  viewType?: "today" | "week" | "month" | "all";
  addressId?: string | null;
}

async function AppointmentsView({
  viewType = "all",
  addressId = null,
}: AppointmentsViewProps) {
  const locale = await getLocale();
  const t = await getTranslations({ locale });
  let appointmentsData: ProviderAppointmentsResponse | null = null;
  let addresses: Address[] = [];
  let selectedAddressId: string | null = null;
  let error: string | null = null;
  let providerId: number = 0;
  let providerType: "doctor" | "corporate" = "doctor";

  try {
    // Kullanıcı bilgilerini al
    const user = await getServerUser();
    if (user) {
      providerId = user.id;
      providerType = user.user_type === "corporate" ? "corporate" : "doctor";
    }

    // Adresleri getir
    const addressesResponse = await getUserAddresses();
    addresses = addressesResponse.data || [];

    // Varsayılan adresi bul (is_default = true) veya ilk adresi seç
    const defaultAddress = addresses.find((addr) => addr.is_default) || addresses[0];
    const defaultAddressId = defaultAddress?.address_id ? String(defaultAddress.address_id) : null;

    // Eğer searchParams'dan addressId gelmişse onu kullan, yoksa varsayılan adresi kullan
    selectedAddressId = addressId || defaultAddressId;

    // Eğer seçili adres varsa, o adres için randevuları getir
    if (selectedAddressId) {
      appointmentsData = await getProviderAppointments(viewType, selectedAddressId);
    }
  } catch (err) {
    console.error("Error fetching appointments:", err);
    error = t("Randevular yüklenirken bir hata oluştu");
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-md border border-red-200 p-8 text-center">
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <p className="text-gray-500 text-sm mt-2">{t("Lütfen daha sonra tekrar deneyin")}</p>
      </div>
    );
  }

  // Eğer adres yoksa
  if (addresses.length === 0) {
    return (
      <div className="w-full bg-white rounded-md border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-lg">{t("Adres bulunamadı")}</p>
        <p className="text-gray-400 text-sm mt-2">
          {t("Randevularınızı görmek için önce bir adres eklemeniz gerekiyor")}
        </p>
      </div>
    );
  }

  // Eğer randevu verisi yoksa
  if (!appointmentsData || !appointmentsData.status) {
    return (
      <AppointmentsClientWrapper
        initialData={{
          appointments: [],
          statistics: {
            total: 0,
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0,
            today: 0,
            upcoming: 0,
          },
          today_appointments: [],
          upcoming_appointments: [],
          filters: {
            status: null,
            type: null,
            date_from: null,
            date_to: null,
            address_ids: [],
            view_type: viewType,
            sort_by: "appointment_date",
            sort_order: "desc",
          },
          provider_info: {
            type: "doctor",
            name: "",
            provider_id: 0,
            doctor_id: null,
            address_ids: [],
          },
        }}
        statistics={{
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          today: 0,
          upcoming: 0,
        }}
        viewType={viewType}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        providerId={providerId}
        providerType={providerType}
      />
    );
  }

  return (
    <AppointmentsClientWrapper
      initialData={appointmentsData.data}
      statistics={appointmentsData.data.statistics}
      viewType={viewType}
      addresses={addresses}
      selectedAddressId={selectedAddressId}
      providerId={providerId}
      providerType={providerType}
    />
  );
}

export default AppointmentsView;
