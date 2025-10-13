export interface UserCommentAnswer {
  id: number;
  name: string;
  slug?: string;
  email: string;
  timezone?: string;
  phone_code?: string;
  phone_number?: string;
  gender?: string;
  birth_date?: string;
  address?: string;
  preferences?: string | null;
  register_code?: string;
  google_calendar_token?: string | null;
  last_login_at?: string | null;
  last_login_ip?: string | null;
  last_login_user_agent?: string | null;
  user_type: string;
  email_code?: string | null;
  email_code_expires_at?: string | null;
  sms_code?: string | null;
  sms_code_expires_at?: string | null;
  is_active?: boolean;
  photo: string;
  country?: string;
  city?: string;
  district?: string;
  currency?: string;
  rating: number;
  is_admin?: number;
  created_at?: string;
  updated_at?: string;
  age: number | null;
  country_slug: string | null;
  city_slug: string | null;
  district_slug: string | null;
  hospital: any[] | null;
  image_url: string;
  unread_message_count: number;
}

export interface CommentUser {
  id: number;
  name: string;
  photo: string;
  user_type: string;
  email: string;
  age: number | null;
  country_slug: string | null;
  city_slug: string | null;
  district_slug: string | null;
  rating: number;
  hospital: any[] | null;
  image_url: string;
  unread_message_count: number;
}

export interface UserCommentReply {
  id: number;
  comment_id: string;
  user_id: number;
  receiver_id: number;
  author: string;
  rating: number;
  comment_date: string;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  parent_comment_id: number;
  user: CommentUser;
  answer: CommentUser;
}

export interface UserComment {
  id: number;
  comment_id: string;
  user_id: number;
  receiver_id: number;
  author: string;
  rating: number;
  comment_date: string;
  comment: string;
  is_approved: boolean;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  parent_comment_id: number | null;
  answer: UserCommentAnswer;
  user: CommentUser;
  replies: UserCommentReply[];
}

export interface UserCommentsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  approved_count: number;
  pending_count: number;
  verified_count: number;
}

export interface UserCommentsResponse {
  status: boolean;
  message: string;
  data: UserComment[];
  meta: UserCommentsMeta;
}

