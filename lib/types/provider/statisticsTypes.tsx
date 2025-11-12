export type StatisticsPeriod = "today" | "week" | "month" | "year";

export interface StatisticsBaseParams {
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
