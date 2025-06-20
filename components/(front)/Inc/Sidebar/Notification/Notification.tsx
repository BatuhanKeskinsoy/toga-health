import React from "react";
import Notifications from "@/components/others/Notifications/Notifications";

function Notification() {
  return (
    <div className="relative flex flex-col w-full h-[calc(100dvh-77px)] overflow-y-auto overflow-x-hidden">
      <Notifications />
    </div>
  );
}

export default Notification;
