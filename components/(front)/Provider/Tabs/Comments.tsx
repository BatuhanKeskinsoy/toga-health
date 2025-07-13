import CommentCard from "@/components/others/Comment/CommentCard";
import React from "react";

interface CommentsProps {
  isHospital?: boolean;
  hospitalData?: any;
  specialistData?: any;
}

function Comments({ isHospital = false, hospitalData, specialistData }: CommentsProps) {
  // Server-side'dan gelen veriyi kullan
  const comments = isHospital ? hospitalData?.comments : specialistData?.comments;

  if (!comments) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Veri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800">
        {isHospital ? "Hasta Yorumları" : "Yorumlar"}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {isHospital 
          ? "Hastanemizde tedavi gören hastalarımızın deneyimleri ve yorumları. Kaliteli hizmet anlayışımızı yansıtan gerçek hasta deneyimleri."
          : "Uzman doktorumuzda tedavi gören hastaların deneyimleri ve yorumları. Kaliteli hizmet anlayışını yansıtan gerçek hasta deneyimleri."
        }
      </p>
      {comments.map((comment: any, index: number) => (
        <CommentCard 
          key={comment.id || index} 
          userName={comment.author}
          rating={comment.rating}
          date={comment.date}
          comment={comment.comment}
        />
      ))}
    </div>
  );
}

export default Comments;
