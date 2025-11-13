'use client';

import Pagination from "@/components/others/Pagination";
import type { PaymentsPagination as PaymentsPaginationType } from "@/lib/types/payments/payments";

interface PaymentsPaginationProps {
  pagination: PaymentsPaginationType<unknown>;
  perPage: number;
  onPageChange?: (page: number) => void;
}

export function PaymentsPagination({
  pagination,
  perPage,
  onPageChange,
}: PaymentsPaginationProps) {
  const from =
    pagination.from ??
    (pagination.current_page - 1) * perPage +
      (pagination.total === 0 ? 0 : 1);
  const calculatedTo =
    pagination.current_page * perPage > pagination.total
      ? pagination.total
      : pagination.current_page * perPage;
  const to = pagination.to ?? calculatedTo;

  return (
    <Pagination
      currentPage={pagination.current_page}
      lastPage={pagination.last_page}
      total={pagination.total}
      from={from}
      to={to}
      onPageChange={onPageChange}
      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm shadow-gray-200"
    />
  );
}

