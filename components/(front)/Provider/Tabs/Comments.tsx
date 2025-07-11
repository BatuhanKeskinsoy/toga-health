import CommentCard from "@/components/others/Comment/CommentCard";
import React from "react";

interface CommentsProps {
  isHospital?: boolean;
}

function Comments({ isHospital = false }: CommentsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg font-semibold text-gray-800">
        {isHospital ? "Hasta Yorumları" : "Yorumlar"}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {isHospital 
          ? "Hastanemizde tedavi gören hastalarımızın deneyimleri ve yorumları. Kaliteli hizmet anlayışımızı yansıtan gerçek hasta deneyimleri."
          : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error omnis, adipisci sit perferendis sint vero a quia expedita dolorem optio, consequuntur nulla, quaerat magni modi impedit rerum ea delectus maiores."
        }
      </p>
      {Array.from({ length: 3 }).map((_, index) => (
        <CommentCard key={index} />
      ))}
    </div>
  );
}

export default Comments;
