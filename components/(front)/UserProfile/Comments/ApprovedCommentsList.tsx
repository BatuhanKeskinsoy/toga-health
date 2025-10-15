"use client";

import { useState, useEffect } from "react";
import ProfileCommentCard from "./ProfileCommentCard";
import Pagination from "@/components/others/Pagination";
import { getUserComments } from "@/lib/services/user/comments";
import type {
  UserComment,
  UserCommentsResponse,
} from "@/lib/types/comments/UserCommentTypes";

interface ApprovedCommentsListProps {
  comments: UserComment[];
  pagination?: UserCommentsResponse["data"];
}

export default function ApprovedCommentsList({
  comments: initialComments,
  pagination: initialPagination,
}: ApprovedCommentsListProps) {
  const [comments, setComments] = useState(initialComments);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page: number) => {
    if (page === currentPage || loading) return;

    setLoading(true);
    try {
      const response = await getUserComments(`?page=${page}`);
        const newComments = response.data.data.filter(
          (comment: UserComment) => comment.is_approved
        );
      setComments(newComments);
      setPagination(response.data);
      setCurrentPage(page);
    } catch (error) {
      console.error("Sayfa yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  if (comments.length === 0) {
    return (
      <div className="flex flex-col max-lg:items-center items-start max-lg:justify-center justify-start">
        <p className="text-gray-500 text-center">
          Henüz onaylanmış yorum bulunmamaktadır.
        </p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <ProfileCommentCard key={comment.id} comment={comment} />
      ))}

      {pagination && pagination.last_page > 1 && (
        <Pagination
          currentPage={currentPage}
          lastPage={pagination.last_page}
          total={pagination.total}
          perPage={pagination.per_page}
          from={pagination.from}
          to={pagination.to}
          hasMorePages={pagination.next_page_url !== null}
          onPageChange={handlePageChange}
          className="mt-6"
        />
      )}
    </>
  );
}
