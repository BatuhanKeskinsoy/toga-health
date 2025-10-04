import React from "react";
import MessagesLayout from "@/components/(front)/UserProfile/Messages/MessagesLayout";

function Message() {
  return (
    <div className="relative flex flex-col w-full h-[calc(100dvh-77px)] overflow-y-auto overflow-x-hidden">
      <MessagesLayout isSidebar={true} />
    </div>
  );
}

export default Message;
