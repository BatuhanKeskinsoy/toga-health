import React from "react";
import Notifications from "@/components/others/Notifications/Notifications";
import { usePusherContext } from "@/lib/context/PusherContext";

function NotificationWrapper() {
  const { serverUser } = usePusherContext();
  
  return <Notifications serverUser={serverUser} />;
}

export default NotificationWrapper; 