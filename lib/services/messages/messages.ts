import api from "@/lib/axios";
import type {
  Conversation,
  Message,
  GetMessagesResponse,
  GetMessageDetailResponse,
  SendCreateMessageConversationResponse,
  SendMessageResponse,
  CreateConversationRequest,
  SendMessageRequest,
} from "@/lib/types/messages/messages";

// Kişinin Mesajlarını listele
export async function getMessages(): Promise<Conversation[]> {
  try {
    const response = await api.get(`/messaging/conversations`);
    const data = response.data as GetMessagesResponse;
    if (data.status) {
      return data.data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching messages:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Kişinin Mesaj Detayını listele
export async function getMessageDetail(conversationId: number): Promise<Message[]> {
  try {
    const response = await api.get(
      `/messaging/conversations/${conversationId}/messages`
    );
    const data = response.data as GetMessageDetailResponse;
    if (data.status) {
      return data.data.messages.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error: any) {
    console.error(
      "Error fetching message detail:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Doctor veya Hastaneyle Konuşma Başlatma
export async function sendCreateMessageConversation(
  data: CreateConversationRequest
): Promise<Conversation> {
  try {
    const response = await api.post(`/messaging/conversations`, data);
    const responseData = response.data as SendCreateMessageConversationResponse;
    if (responseData.status) {
      return responseData.data;
    } else {
      throw new Error(responseData.message);
    }
  } catch (error: any) {
    console.error(
      "Error sending message conversation:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// Mesaj gönder (file ile veya file olmadan)
export async function sendMessage(
  data: SendMessageRequest
): Promise<Message> {
  try {
    // Create FormData to properly send the data
    const formData = new FormData();
    formData.append("conversation_id", data.conversation_id.toString());
    formData.append("receiver_id", data.receiver_id.toString());
    formData.append("content", data.content);
    
    // File varsa ekle
    if (data.file) {
      formData.append("file", data.file);
    }
    
    // Parent message ID varsa ekle
    if (data.parent_message_id) {
      formData.append("parent_message_id", data.parent_message_id.toString());
    }

    // Set the correct headers for multipart/form-data
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await api.post(
      `/messaging/messages/send`,
      formData,
      config
    );
    const responseData = response.data as SendMessageResponse;
    
    if (responseData.status) {
      return responseData.data;
    } else {
      throw new Error(responseData.message);
    }
  } catch (error: any) {
    console.error(
      "Error sending message:",
      error.response?.data || error.message
    );
    throw error;
  }
}
