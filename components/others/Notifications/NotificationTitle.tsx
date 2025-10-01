import React from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";

interface NotificationTitleProps {
  type: "appointment_confirmed" | "appointment_cancelled" | string;
  title: string;
  isRead: boolean;
}

const NotificationTitle: React.FC<NotificationTitleProps> = ({
  type,
  title,
  isRead,
}) => {
  const baseClass = "flex items-center gap-1.5 text-sm font-medium max-xl:justify-center";
  
  const getIconAndColor = () => {
    switch (type) {
      case "appointment_confirmed":
        return {
          icon: <IoCheckmarkSharp className="text-xl -mt-0.5" />,
          color: isRead ? "text-gray-700" : "text-green-500"
        };
      case "appointment_cancelled":
        return {
          icon: <IoCloseSharp className="text-xl -mt-0.5" />,
          color: isRead ? "text-gray-700" : "text-red-500"
        };
      default:
        return {
          icon: null,
          color: "text-sitePrimary"
        };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className={`${baseClass} ${color}`}>
      {icon}
      <span>{title}</span>
    </div>
  );
};

export default NotificationTitle;
