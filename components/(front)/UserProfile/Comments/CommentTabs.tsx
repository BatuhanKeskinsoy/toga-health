"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { getUserComments } from "@/lib/services/user/comments";
import Pagination from "@/components/others/Pagination";
import ProfileCommentCard from "./ProfileCommentCard";
import type {
  UserComment,
  UserCommentsResponse,
} from "@/lib/types/comments/UserCommentTypes";

interface CommentTabsProps {
  approvedComments: React.ReactNode;
  pendingComments: React.ReactNode;
  rejectedComments: React.ReactNode;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  approvedPaginationData?: UserCommentsResponse["data"];
}

type TabType = "approved" | "pending" | "rejected";

export default function CommentTabs({
  approvedComments,
  pendingComments,
  rejectedComments,
  approvedCount,
  pendingCount,
  rejectedCount,
  approvedPaginationData,
}: CommentTabsProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<TabType>("approved");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [approvedCommentsData, setApprovedCommentsData] =
    useState<React.ReactNode>(approvedComments);

  const handlePageChange = async (page: number) => {
    if (page === currentPage || loading) return;

    setLoading(true);
    try {
      const response = await getUserComments(`?page=${page}`);
      const newApprovedComments = response.data.data.filter(
        (comment: UserComment) => comment.is_approved
      );

      // ApprovedCommentsList component'ini yeni data ile oluştur
      const newApprovedCommentsElement = (
        <>
          {newApprovedComments.map((comment: UserComment) => (
            <ProfileCommentCard key={comment.id} comment={comment} />
          ))}
        </>
      );

      setApprovedCommentsData(newApprovedCommentsElement);
      setCurrentPage(page);
    } catch (error) {
      console.error("Sayfa yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      key: "approved" as TabType,
      label: t("Onaylanmış Yorumlar"),
      count: approvedCount,
      content: approvedCommentsData,
    },
    {
      key: "pending" as TabType,
      label: t("Onay Bekleyen Yorumlar"),
      count: pendingCount,
      content: pendingComments,
    },
    {
      key: "rejected" as TabType,
      label: t("Reddedilmiş Yorumlar"),
      count: rejectedCount,
      content: rejectedComments,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex gap-2 min-w-max px-1" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-3 lg:px-4 lg:border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-sitePrimary text-sitePrimary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.key
                    ? "bg-sitePrimary/10 text-sitePrimary"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tabs.find((tab) => tab.key === activeTab)?.content}
        </div>

        {/* Pagination - Sadece approved tab'da göster */}
        {activeTab === "approved" &&
          approvedPaginationData &&
          approvedPaginationData.last_page > 1 && (
            <Pagination
              currentPage={currentPage}
              lastPage={approvedPaginationData.last_page}
              total={approvedPaginationData.total}
              perPage={approvedPaginationData.per_page}
              from={approvedPaginationData.from}
              to={approvedPaginationData.to}
              hasMorePages={approvedPaginationData.next_page_url !== null}
              onPageChange={handlePageChange}
            />
          )}
      </div>
    </div>
  );
}
