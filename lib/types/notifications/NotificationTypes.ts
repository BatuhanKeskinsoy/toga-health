export type AppointmentNotificationType =
  | "appointment_created"
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_rejected";

export type PaymentNotificationType = "payment_success" | "payment_refunded";

export type UserTypeNotificationType = "user_type_change_approved";

export type KnownNotificationType =
  | AppointmentNotificationType
  | PaymentNotificationType
  | UserTypeNotificationType;

export interface BaseNotificationData {
  title: string;
  message: string;
  type: string;
  action_url?: string;
  icon?: string;
  [key: string]: unknown;
}

export interface AppointmentNotificationPayload {
  appointment_id: number;
  appointment_status: string;
  appointment_date: string;
  appointment_time: string;
  provider_id: number;
  user_id: number;
  patient_name?: string;
  doctor_name?: string;
  doctor_photo?: string | null;
  department?: string;
  department_slug?: string;
  address?: string;
  lang_code?: string;
  cancellation_reason?: string | null;
  action_url?: string;
}

export interface AppointmentNotificationData extends BaseNotificationData {
  type: AppointmentNotificationType;
  data: AppointmentNotificationPayload;
}

export interface PaymentAppointmentInfo {
  doctor_name?: string;
  date?: string;
  time?: string;
}

export interface PaymentNotificationData extends BaseNotificationData {
  type: PaymentNotificationType;
  payment_id: number;
  amount?: string;
  transaction_id?: string;
  payment_method?: string;
  status?: string;
  date?: string;
  priority?: string;
  appointment?: PaymentAppointmentInfo;
}

export interface UserTypeChangeDataPayload {
  user_type_change_id: number;
  current_type?: string;
  requested_type?: string;
  approved_at?: string;
  action_url?: string;
}

export interface UserTypeChangeNotificationData extends BaseNotificationData {
  type: UserTypeNotificationType;
  data: UserTypeChangeDataPayload;
}

export interface GenericNotificationData extends BaseNotificationData {
  type: string;
}

export type NotificationData =
  | AppointmentNotificationData
  | PaymentNotificationData
  | UserTypeChangeNotificationData
  | GenericNotificationData;

export interface NotificationItemTypes {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  unread_count: number;
  from?: number | null;
  to?: number | null;
  first_page_url?: string;
  last_page_url?: string;
  next_page_url?: string | null;
  prev_page_url?: string | null;
  path?: string;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

export interface NotificationApiResponse {
  status: boolean;
  message: string;
  data: NotificationItemTypes[];
  meta: NotificationMeta;
}