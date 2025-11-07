import React from "react";
import { getTranslations } from "next-intl/server";
import { getIndividualAppointments } from "@/lib/services/appointment/individual";
import IndividualAppointmentsClient from "./IndividualAppointmentsClient";

async function IndividualAppointmentsView() {
  const t = await getTranslations();
  const response = await getIndividualAppointments();

  if (!response.status) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {t("Randevular yüklenirken bir hata oluştu")}
      </div>
    );
  }

  return <IndividualAppointmentsClient {...response.data} />;
}

export default IndividualAppointmentsView;