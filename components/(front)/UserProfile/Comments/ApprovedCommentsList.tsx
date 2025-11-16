import { useTranslations } from "next-intl";
import ProfileCommentCard from "./ProfileCommentCard";
import type { UserComment } from "@/lib/types/comments/UserCommentTypes";

interface ApprovedCommentsListProps {
  comments: UserComment[];
}

export default function ApprovedCommentsList({
  comments,
}: ApprovedCommentsListProps) {
  const t = useTranslations();
  if (comments.length === 0) {
    return (
      <div className="flex flex-col max-lg:items-center items-start max-lg:justify-center justify-start">
        <p className="text-gray-500 text-center">
          {t("Henüz onaylanmış yorum bulunmamaktadır")}
        </p>
      </div>
    );
  }

  return (
    <>
      {comments.map((comment) => (
        <ProfileCommentCard key={comment.id} comment={comment} />
      ))}
    </>
  );
}
