"use client";
import React from "react";
import Pagination from "@/components/others/Pagination";

interface CommentsPaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const CommentsPagination: React.FC<CommentsPaginationProps> = ({
  currentPage,
  lastPage,
  total,
  perPage,
  onPageChange,
  className = "",
}) => {
  // from ve to değerlerini hesapla
  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, total);

  return (
    <div className={`flex justify-center ${className}`}>
      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        total={total}
        from={from}
        to={to}
        onPageChange={onPageChange}
        className="w-full max-w-2xl"
      />
    </div>
  );
};

export default CommentsPagination;
