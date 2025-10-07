export interface BaseNotificationData {
  title: string;
  message: string;
  type: string;
}

export interface AppointmentConfirmedData extends BaseNotificationData {
  type: "appointment_confirmed";
  appointment_id: number;
  date: string;
  time: string;
  doctor_name: string;
  doctor_photo: string | null;
  department: string;
  department_slug: string;
}

export interface AppointmentCancelledData extends BaseNotificationData {
  type: "appointment_cancelled";
  appointment_id: number;
  date: string;
  time: string;
  doctor_name: string;
  doctor_photo: string | null;
  department: string;
  department_slug: string;
  cancellation_reason: string;
}

export interface MessageData extends BaseNotificationData {
  type: "message";
  // mesaj tipinde ekstra alan varsa buraya yaz
}

export type NotificationData =
  | AppointmentConfirmedData
  | AppointmentCancelledData
  | MessageData;

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

export interface NotificationResponse {
  current_page: number;
  data: NotificationItemTypes[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}
