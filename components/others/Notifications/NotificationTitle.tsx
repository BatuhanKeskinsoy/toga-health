import React from "react";
import {
  IoAlertCircleOutline,
  IoCalendarOutline,
  IoCardOutline,
  IoCheckmarkSharp,
  IoCloseSharp,
  IoRefreshOutline,
  IoSparklesOutline,
} from "react-icons/io5";

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

  const fadedClass = isRead ? "text-gray-600" : "";

  const getIconAndColor = () => {
    switch (type) {
      case "appointment_created":
        return {
          icon: <IoCalendarOutline className="text-lg" />,
          color: isRead ? "text-gray-600" : "text-amber-500",
        };
      case "appointment_confirmed":
        return {
          icon: <IoCheckmarkSharp className="text-xl -mt-0.5" />,
          color: isRead ? "text-gray-600" : "text-green-500",
        };
      case "appointment_cancelled":
        return {
          icon: <IoCloseSharp className="text-xl -mt-0.5" />,
          color: isRead ? "text-gray-600" : "text-red-500",
        };
      case "appointment_rejected":
        return {
          icon: <IoAlertCircleOutline className="text-lg" />,
          color: isRead ? "text-gray-600" : "text-orange-500",
        };
      case "payment_success":
        return {
          icon: <IoCardOutline className="text-lg" />,
          color: isRead ? "text-gray-600" : "text-emerald-500",
        };
      case "payment_refunded":
        return {
          icon: <IoRefreshOutline className="text-lg" />,
          color: isRead ? "text-gray-600" : "text-blue-500",
        };
      case "user_type_change_approved":
        return {
          icon: <IoSparklesOutline className="text-lg" />,
          color: isRead ? "text-gray-600" : "text-sitePrimary",
        };
      default:
        return {
          icon: null,
          color: isRead ? "text-gray-600" : "text-sitePrimary",
        };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className={`${baseClass} ${color} ${fadedClass}`}>
      {icon}
      <span>{title}</span>
    </div>
  );
};

export default NotificationTitle;
