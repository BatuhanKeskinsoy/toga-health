// Pagination Types
export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginationData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Hospital Type
export interface Hospital {
  id: number | null;
  name: string | null;
  slug: string | null;
}

// Preferences Type
export interface UserPreferences {
  privacy: string;
  language: string;
  notifications: boolean;
}

// Participant/User Type
export interface Participant {
  id: number;
  name: string;
  slug: string;
  email: string;
  timezone: string;
  phone_code: string;
  phone_number: string;
  gender: string | null;
  birth_date: string | null;
  address: string | null;
  preferences: UserPreferences | null;
  register_code: string;
  google_calendar_token: string | null;
  last_login_at: string | null;
  last_login_ip: string | null;
  last_login_user_agent: string | null;
  user_type: string;
  email_code: string | null;
  email_code_expires_at: string | null;
  sms_code: string | null;
  sms_code_expires_at: string | null;
  is_active: boolean;
  photo: string;
  country: string;
  city: string | null;
  district: string | null;
  currency: string;
  rating: number | null;
  created_at: string;
  updated_at: string;
  age: number | null;
  country_slug: string;
  city_slug: string | null;
  district_slug: string | null;
  hospital: Hospital | null;
  image_url: string;
}

// Message Attachment Type
export interface MessageAttachment {
  id: number;
  message_id: number;
  file_path: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_extension: string;
  mime_type: string;
  is_image: boolean;
  image_width: number | null;
  image_height: number | null;
  thumbnail_path: string | null;
  download_count: number;
  metadata: any | null;
  lang_code: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  file_url: string;
  thumbnail_url: string | null;
  download_url: string;
  formatted_file_size: string;
  is_pdf: boolean;
  is_image_file: boolean;
  is_video: boolean;
  is_audio: boolean;
}

// Message Type
export interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  receiver_id: number;
  sender_type: string;
  receiver_type: string;
  message_type: string;
  content: string;
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  file_type: string | null;
  file_extension: string | null;
  is_read: boolean;
  read_at: string | null;
  is_important: boolean;
  is_deleted_by_sender: boolean;
  is_deleted_by_receiver: boolean;
  parent_message_id: number | null;
  metadata: any | null;
  lang_code: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  formatted_created_at: string;
  formatted_file_size: string;
  is_sender: boolean;
  can_reply: boolean;
  file_url: string | null;
  sender?: Participant;
  receiver?: Participant;
  attachments?: MessageAttachment[];
  parent_message?: Message | null;
}

// Conversation Type
export interface Conversation {
  id: number;
  conversation_id: string;
  participant1_id: number;
  participant1_type: string;
  participant2_id: number;
  participant2_type: string;
  title: string;
  type: string;
  is_active: boolean;
  is_archived: boolean;
  archived_by: number | null;
  archived_at: string | null;
  last_message_id: number | null;
  last_message_at: string | null;
  metadata: any | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  other_participant: Participant;
  unread_count: number;
  last_message_content: string;
  formatted_last_message_at: string;
  last_message: Message | null;
  participant1: Participant;
  participant2: Participant;
}

// API Response Types
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface GetMessagesResponse extends ApiResponse<PaginationData<Conversation>> {}

export interface GetMessageDetailResponse extends ApiResponse<{
  conversation: Conversation;
  messages: PaginationData<Message>;
}> {}

export interface SendCreateMessageConversationResponse extends ApiResponse<Conversation> {}

export interface SendMessageResponse extends ApiResponse<Message> {}

// Request Types
export interface CreateConversationRequest {
  receiver_id: number;
  title: string;
}

export interface SendTextMessageRequest {
  conversation_id: number;
  receiver_id: number;
  content: string;
  parent_message_id?: number | null;
}

export interface SendFileMessageRequest {
  conversation_id: number;
  receiver_id: number;
  content: string;
  file: File;
  parent_message_id?: number | null;
}

