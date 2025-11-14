"use client";
import React from "react";
import { useLocale } from "next-intl";
import { convertDate } from "@/lib/functions/getConvertDate";
import type { PaymentItem } from "@/lib/types/payments/payments";

type SupportedUserType = "doctor" | "individual";

interface PaymentsTableProps {
  payments: PaymentItem[];
  userType: SupportedUserType;
}

const formatDateTime = (value?: string | null, locale = "tr-TR") => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const formatStatus = (status?: string | null) => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const StatusBadge = ({ status }: { status?: string | null }) => {
  if (!status) {
    return (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
        -
      </span>
    );
  }

  const normalized = status.toLowerCase();
  const styles =
    normalized === "succeeded" || normalized === "başarılı"
      ? "bg-emerald-100 text-emerald-700"
      : normalized === "refunded" || normalized === "iade edildi"
      ? "bg-amber-100 text-amber-700"
      : normalized === "failed" || normalized === "başarısız"
      ? "bg-red-100 text-red-700"
      : normalized === "pending" || normalized === "beklemede"
      ? "bg-sky-100 text-sky-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles}`}
    >
      {formatStatus(status)}
    </span>
  );
};

const PaymentDetails = ({
  payment,
  userType,
}: {
  payment: PaymentItem;
  userType: SupportedUserType;
}) => {
  const locale = useLocale();
  const fullLocale = `${locale}-${locale.toUpperCase()}`;
  
  const metadata = payment.metadata;
  const appointmentData = metadata?.appointment_data;
  const appointment = payment.appointment;

  const dateLabel =
    appointment?.appointment_date || appointmentData?.appointment_date;
  const timeLabel =
    appointment?.start_time || appointmentData?.appointment_time;
  const serviceName = appointmentData?.service_name;
  const counterpartName =
    userType === "doctor"
      ? appointment?.user?.name || appointmentData?.title
      : appointment?.provider?.name || appointmentData?.provider_type;

  // Tarih ve saati birleştirip formatla
  const formatAppointmentDateTime = () => {
    if (!dateLabel && !timeLabel) return null;
    
    try {
      let dateObj: Date;
      
      if (dateLabel && timeLabel) {
        // Tarih ve saat varsa birleştir
        const dateStr = dateLabel.includes("T") 
          ? dateLabel.split("T")[0] 
          : dateLabel;
        const timeStr = timeLabel.includes(":") 
          ? timeLabel.substring(0, 5) 
          : timeLabel;
        dateObj = new Date(`${dateStr}T${timeStr}`);
      } else if (dateLabel) {
        // Sadece tarih varsa
        dateObj = new Date(dateLabel);
      } else {
        // Sadece saat varsa (bugünün tarihini kullan)
        const today = new Date().toISOString().split("T")[0];
        const timeStr = timeLabel.includes(":") 
          ? timeLabel.substring(0, 5) 
          : timeLabel;
        dateObj = new Date(`${today}T${timeStr}`);
      }
      
      if (Number.isNaN(dateObj.getTime())) {
        // Geçersiz tarih ise eski formatı göster
        return (dateLabel || "") +
          (dateLabel && timeLabel ? " • " : "") +
          (timeLabel || "");
      }
      
      return convertDate(dateObj, fullLocale);
    } catch (error) {
      // Hata durumunda eski formatı göster
      return (dateLabel || "") +
        (dateLabel && timeLabel ? " • " : "") +
        (timeLabel || "");
    }
  };

  const formattedDateTime = formatAppointmentDateTime();

  return (
    <div className="flex flex-col gap-1 text-sm text-gray-600">
      {counterpartName && (
        <span className="font-medium text-gray-900">{counterpartName}</span>
      )}
      {serviceName && <span>{serviceName}</span>}
      {formattedDateTime && (
        <span className="text-xs text-gray-500">{formattedDateTime}</span>
      )}
      {payment.description && (
        <span className="text-xs text-gray-500">{payment.description}</span>
      )}
    </div>
  );
};

export function PaymentsTable({ payments, userType }: PaymentsTableProps) {
  if (payments.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Henüz herhangi bir ödeme bulunmuyor.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm shadow-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 text-sm text-gray-700">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                İşlem No
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tutar
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Durum
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Ödeme Yöntemi
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Tarih
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                Detay
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-900">
                  {payment.transaction_id ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {payment.formatted_amount ??
                        `${payment.amount} ${
                          payment.currency
                            ? payment.currency.toUpperCase()
                            : ""
                        }`}
                    </span>
                    {payment.formatted_refund_amount && (
                      <span className="text-xs text-gray-500">
                        İade: {payment.formatted_refund_amount}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={payment.status_text ?? payment.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {payment.payment_method_text ?? payment.payment_method}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDateTime(payment.processed_at ?? payment.created_at)}
                </td>
                <td className="px-4 py-3">
                  <PaymentDetails payment={payment} userType={userType} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

