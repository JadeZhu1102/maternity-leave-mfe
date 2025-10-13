import { Dayjs } from 'dayjs';

export interface CalendarDay {
  date: string; // YYYY-MM-DD format
  isWorkingDay: boolean;
  isHoliday: boolean;
  description?: string; // e.g., "春节", "国庆节"
}

export interface MonthCalendar {
  year: number;
  month: number; // 1-12
  days: CalendarDay[];
}

export interface Calendar {
  id?: string;
  name: string;
  year: number;
  description?: string;
  isDefault: boolean;
  months: MonthCalendar[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CalendarFilter {
  year?: number;
  isDefault?: boolean;
}

export interface UpdateCalendarDayPayload {
  calendarId: string;
  date: string;
  isWorkingDay: boolean;
  isHoliday: boolean;
  description?: string;
}

export interface GenerateDefaultCalendarPayload {
  year: number;
  countryCode?: string; // e.g., 'CN' for China
  region?: string;      // e.g., 'shanghai' for specific regions
}
