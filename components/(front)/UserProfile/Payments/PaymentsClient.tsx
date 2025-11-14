'use client';

import React, { useCallback, useState } from "react";
import { PaymentsSummary } from "./PaymentsSummary";
import { PaymentsTable } from "./PaymentsTable";
import { PaymentsPagination } from "./PaymentsPagination";
import type {
  PaymentsHistoryData,
  PaymentItem,
} from "@/lib/types/payments/payments";
import { getPaymentsHistory } from "@/lib/services/payments";
import { useTranslations } from "next-intl";

type SupportedUserType = "doctor" | "individual";

interface PaymentsClientProps {
  initialData: PaymentsHistoryData;
  userType: SupportedUserType;
  perPage: number;
  heading: string;
  description?: string;
}

export function PaymentsClient({
  initialData,
  userType,
  perPage,
  heading,
  description,
}: PaymentsClientProps) {
  const t = useTranslations();
  const [data, setData] = useState<PaymentsHistoryData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePageChange = useCallback(
    async (page: number) => {
      if (page === data.payments.current_page) return;

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getPaymentsHistory({
          page,
          per_page: perPage,
        });
        if (!response?.status || !response.data) {
          throw new Error("Ödeme verisi alınamadı.");
        }
        setData(response.data);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Ödeme geçmişi alınırken bir hata oluştu.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    },
    [data.payments.current_page, perPage]
  );

  const payments: PaymentItem[] = data.payments.data;

  return (
    <div className="flex flex-col gap-6">
      <PaymentsSummary
        title={heading}
        description={description}
        statistics={data.statistics}
      />

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-sitePrimary border-t-transparent" />
          </div>
        )}
        <PaymentsTable payments={payments} userType={userType} />
      </div>

      <PaymentsPagination
        pagination={data.payments}
        perPage={perPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
