import React from "react";
import { getStar } from "@/lib/functions/getStar";
import { getShortName } from "@/lib/functions/getShortName";

interface CommentCardProps {
  id?: string;
  userName?: string;
  userAvatar?: string;
  rating?: number;
  comment?: string;
  date?: string;
  helpfulCount?: number;
  replyCount?: number;
}

function CommentCard({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  date,
}: CommentCardProps) {
  const renderStars = (rating: number) => {
    const size = 16;
    return (
      <div className="flex gap-1 items-center min-w-max">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className={`relative min-w-[${size}px] w-[${size}px] h-[${size}px]`}
          >
            {getStar(index + 1, rating, size)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg xl:p-6 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-14 h-14 min-w-14 rounded-md overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fotoğraf yüklenemezse fallback göster
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-full h-full bg-sitePrimary/10 flex items-center justify-center"><span class="text-sitePrimary font-medium uppercase text-lg">${getShortName(userName || "")}</span></div>`;
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-sitePrimary/10 flex items-center justify-center">
                <span className="text-sitePrimary font-medium uppercase text-lg">
                  {getShortName(userName || "")}
                </span>
              </div>
            )}
          </div>
          {/* User Info */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{userName}</h4>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">{date}</span>
            </div>
            <div className="flex items-center gap-1">
              {renderStars(rating)}
              <span className="text-sm text-gray-500 font-medium">
                ({rating})
              </span>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{comment}</p>
    </div>
  );
}

export default CommentCard;
