"use client";
import React from "react";
import { useTranslations } from "next-intl";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number;
  to: number;
  hasMorePages: boolean;
  onPageChange?: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  total,
  perPage,
  from,
  to,
  hasMorePages,
  onPageChange,
  className = "",
}) => {
  const t = useTranslations();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage || page === currentPage) return;

    if (onPageChange) {
      onPageChange(page);
    }
  };

  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (lastPage <= maxVisiblePages) {
      // Tüm sayfaları göster
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      // İlk sayfa
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Mevcut sayfa etrafındaki sayfalar
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(lastPage - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== lastPage) {
          pages.push(i);
        }
      }

      if (currentPage < lastPage - 2) {
        pages.push("...");
      }

      // Son sayfa
      if (lastPage > 1) {
        pages.push(lastPage);
      }
    }

    return pages;
  };

  if (lastPage <= 1) return null;

  return (
    <div className={`flex flex-col items-center justify-between gap-4 ${className}`}>

      {/* Sayfa numaraları */}
      <div className="flex items-center gap-1">
        {/* Önceki sayfa */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200"
          aria-label="Önceki sayfa"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Sayfa numaraları */}
        <div className="flex items-center gap-1">
          {generatePageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 ${
                    currentPage === page
                      ? "bg-sitePrimary border-sitePrimary text-white shadow-sm"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                  aria-label={`Sayfa ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Sonraki sayfa */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === lastPage}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 transition-all duration-200"
          aria-label="Sonraki sayfa"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {/* Sayfa bilgisi */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">{from}</span> - <span className="font-medium">{to}</span> arası, toplam{" "}
        <span className="font-medium">{total}</span> sonuçtan
      </div>
    </div>
  );
};

export default Pagination;
