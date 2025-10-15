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

export interface RejectionInfo {
  is_rejected: boolean;
  rejection_reason: string;
  rejection_reason_code: string;
  rejection_description: string;
  admin_notes: string;
  rejected_at: string;
  rejection_status: string;
}

export interface RejectedReport {
  id: number;
  comment_id: number;
  report_reason: string;
  report_description: string;
  admin_notes: string;
  status: string;
  resolved_at: string;
  status_text: string;
  reason_text: string;
  formatted_date: string;
}

export interface UserCommentReply {
  id: number;
  comment_id: string;
  author: string;
  user: {
    id: number;
    name: string;
    photo: string;
    user_type: string;
  };
  comment: string;
  comment_date: string;
  created_at: string;
  is_verified: boolean;
  is_approved: boolean;
  is_active: boolean;
}

export interface UserComment {
  id: number;
  comment_id: string;
  rating: number;
  author: string;
  user: {
    id: number;
    name: string;
    photo: string;
    user_type: string;
  };
  comment: string;
  comment_date: string;
  created_at: string;
  is_approved: boolean;
  is_active: boolean;
  is_verified: boolean;
  has_reply: boolean;
  reply: UserCommentReply | null;
  rejected_report: RejectedReport | null;
}

export interface UserCommentsPagination {
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UserCommentsStatistics {
  total_comments: number;
  approved_comments: number;
  pending_comments: number;
  rejected_comments: number;
  verified_comments: number;
}

export interface UserCommentsResponse {
  status: boolean;
  message: string;
  data: UserCommentsPagination & {
    data: UserComment[];
  };
  statistics: UserCommentsStatistics;
}

