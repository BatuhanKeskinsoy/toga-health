import React from "react";
import { getServerUser } from "@/lib/utils/getServerUser";
import { getPaymentsHistory } from "@/lib/services/payments";
import { PaymentsClient } from "@/components/(front)/UserProfile/Payments/PaymentsClient";
import type { PaymentsHistoryResponse } from "@/lib/types/payments/payments";

const UnauthorizedMessage = () => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
    Bu sayfayı görüntülemek için giriş yapmanız ve uygun hesap tipine sahip
    olmanız gerekiyor.
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
    {message}
  </div>
);

export default async function PaymentsPage() {
  const user = await getServerUser();

  if (!user || !["doctor", "individual"].includes(user.user_type ?? "")) {
    return <UnauthorizedMessage />;
  }

  let paymentsResponse: PaymentsHistoryResponse | null = null;

  try {
    paymentsResponse = await getPaymentsHistory({
      page: 1,
      per_page: 15,
    });
  } catch (error) {
    console.error("Ödeme geçmişi alınırken hata oluştu:", error);
    return (
      <ErrorMessage message="Ödeme geçmişi yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin." />
    );
  }

  if (!paymentsResponse?.status || !paymentsResponse.data) {
    return (
      <ErrorMessage message="Ödeme geçmişi şu anda getirilemiyor. Lütfen daha sonra tekrar deneyin." />
    );
  }

  const { payments, statistics } = paymentsResponse.data;

  const heading =
    user.user_type === "doctor" ? "Alınan Ödemeler" : "Yapılan Ödemeler";
  const description =
    user.user_type === "doctor"
      ? "Randevularınız için aldığınız ön ödeme geçmişini görüntüleyin."
      : "Randevularınız için yaptığınız ödemelerin geçmişini görüntüleyin.";

  return (
    <PaymentsClient
      initialData={paymentsResponse.data}
      userType={user.user_type as "doctor" | "individual"}
      perPage={15}
      heading={heading}
      description={description}
    />
  );
}
