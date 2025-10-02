import MessagesLayout from "@/components/(front)/UserProfile/Inc/Messages/MessagesLayout";

interface MessagesDetailPageProps {
  params: {
    id: string;
  };
}

export default function MessagesDetailPage({ params }: MessagesDetailPageProps) {
  return <MessagesLayout conversationId={params.id} />;
}
