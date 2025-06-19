import React from "react";
import { useLocale } from "next-intl";
import { useLanguages } from "@/lib/hooks/lang/useLanguages";
import Notifications from "@/components/others/Notifications/Notifications";

function Notification() {
  const locale = useLocale();
  console.log("locale", locale);
  
  
  const { languages, isLoading } = useLanguages();

  if (isLoading) {
    return <div className="p-4">Yükleniyor...</div>;
  }

  return (
    <div className="relative flex flex-col w-full h-[calc(100dvh-77px)] overflow-hidden">
      <Notifications />
    </div>
  );
}

export default Notification;
