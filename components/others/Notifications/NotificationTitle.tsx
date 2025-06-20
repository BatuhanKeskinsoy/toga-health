import React from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";

interface NotificationTitleProps {
  type: string;
  title: string;
  isRead: boolean;
}

const NotificationTitle: React.FC<NotificationTitleProps> = ({
  type,
  title,
  isRead,
}) => {
  const baseClass =
    "flex items-center gap-1.5 text-sm font-medium max-lg:justify-center";
  switch (type) {
    case "appointment_confirmed":
      return (
        <div className={`${baseClass} ${isRead ? "text-gray-700" : "text-green-500"}`}>
          <IoCheckmarkSharp className="text-xl -mt-0.5" />
          <span>{title}</span>
        </div>
      );
    case "appointment_cancelled":
      return (
        <div className={`${baseClass} ${isRead ? "text-gray-700" : "text-red-500"}`}>
          <IoCloseSharp className="text-xl -mt-0.5" />
          <span>{title}</span>
        </div>
      );
    default:
      return <div className={`${baseClass} text-sitePrimary`}>{title}</div>;
  }
};

export default NotificationTitle;
