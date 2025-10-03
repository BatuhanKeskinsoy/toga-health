import ChatArea from "@/components/(front)/UserProfile/Inc/Messages/ChatArea";
import { getMessages } from "@/lib/services/messages/messages";
import { Conversation } from "@/lib/types/messages/messages";

interface MessagesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MessagesDetailPage({ params }: MessagesDetailPageProps) {
  const { id } = await params;
  
  // Conversation'ı bul
  const conversations = await getMessages();
  const conversation = conversations.find(conv => conv.id.toString() === id);
  
  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-gray-700">
                Konuşma bulunamadı
              </h3>
              <p className="text-gray-500">
                Bu konuşma mevcut değil veya erişim yetkiniz yok
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <ChatArea conversation={conversation} />;
}
