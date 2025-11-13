export type StatisticsPeriod = "today" | "week" | "month" | "year";

export interface StatisticsBaseParams extends Record<string, unknown> {
  period?: StatisticsPeriod;
  start_date?: string;
  end_date?: string;
}

export interface GetDoctorStatisticsParams extends StatisticsBaseParams {}

export interface GetCorporateStatisticsParams extends StatisticsBaseParams {
  doctor_id?: number;
}

export interface StatisticsEntity {
  id: number;
  name: string;
  slug: string;
  expert_title?: string | null;
}

export interface AppointmentSummary {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface CommentSummary {
  total: number;
  approved: number;
  pending: number;
  average_rating: number;
}

export interface DailyStatistic {
  date: string;
  count: number;
  confirmed: number | string;
}

export interface WeeklyStatistic {
  week: number;
  count: number;
  confirmed: number | string;
}

export interface MonthlyStatistic {
  month: string;
  count: number;
  confirmed: number | string;
}

export interface PeriodStatistics {
  daily: DailyStatistic[];
  weekly: WeeklyStatistic[];
  monthly: MonthlyStatistic[];
}

export interface RevenueSummaryEntry {
  total_count: number;
  total_revenue: number;
  average_revenue: number;
  currency: string;
}

export interface DailyRevenueEntry {
  date: string;
  count: number;
  total_revenue: number;
  currency: string;
}

export interface MonthlyRevenueEntry {
  month: string;
  count: number;
  total_revenue: number;
  currency: string;
}

export interface YearlyRevenueEntry {
  year: number;
  count: number;
  total_revenue: number;
  currency: string;
}

export interface RevenueHistory {
  daily: Record<string, DailyRevenueEntry[]>;
  monthly: Record<string, MonthlyRevenueEntry[]>;
  yearly: Record<string, YearlyRevenueEntry[]>;
  summary: RevenueSummaryEntry[];
}

export interface PaymentOverview {
  total_payments: number;
  successful_payments: number | string;
  failed_payments: number | string;
  pending_payments: number | string;
  refunded_payments: number | string;
  total_amount: string | number;
  average_amount: string | number;
  formatted_amount: string | null;
  formatted_refund_amount: string | null;
  status_text: string | null;
  payment_method_text: string | null;
  is_refunded: boolean;
  is_failed: boolean;
  is_pending: boolean;
  is_successful: boolean;
}

export interface MonthlyPaymentStat {
  month: number;
  count: number;
  total_amount: string;
  formatted_amount: string | null;
  formatted_refund_amount: string | null;
  status_text: string | null;
  payment_method_text: string | null;
  is_refunded: boolean;
  is_failed: boolean;
  is_pending: boolean;
  is_successful: boolean;
}

export interface DoctorPaymentStatisticsData {
  overview: PaymentOverview;
  monthly_stats: MonthlyPaymentStat[];
}

export interface DateFilterRange {
  start_date?: string | null;
  end_date?: string | null;
}

export interface DoctorStatisticsData {
  doctor: StatisticsEntity;
  timezone: string;
  date_filter: DateFilterRange | null;
  appointments: AppointmentSummary;
  comments: CommentSummary;
  period_statistics: PeriodStatistics;
  revenue_history?: RevenueHistory;
  generated_at: string;
}

export interface CorporateDoctorStatistics {
  doctor: StatisticsEntity;
  appointments: AppointmentSummary;
  comments: CommentSummary;
  period_statistics: PeriodStatistics;
}

export interface CorporateStatisticsData {
  corporate: StatisticsEntity;
  timezone: string;
  date_filter: DateFilterRange | null;
  doctor_count: number;
  appointments: AppointmentSummary;
  comments: CommentSummary;
  period_statistics: PeriodStatistics;
  doctors: CorporateDoctorStatistics[];
  revenue_history?: RevenueHistory;
  generated_at: string;
}

export interface GetDoctorStatisticsResponse {
  status: boolean;
  message: string;
  data: DoctorStatisticsData;
}

export interface GetCorporateStatisticsResponse {
  status: boolean;
  message: string;
  data: CorporateStatisticsData;
}

export interface GetDoctorPaymentStatisticsResponse {
  status: boolean;
  message: string;
  data: DoctorPaymentStatisticsData;
}
