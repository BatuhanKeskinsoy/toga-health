import MessagesLayout from "@/components/(front)/UserProfile/Inc/Messages/MessagesLayout";

interface MessagesDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function MessagesDetailPage({ params }: MessagesDetailPageProps) {
  const { id } = await params;
  return <MessagesLayout conversationId={id} />;
}
