export interface CalendarDay {
  date: string; // YYYY-MM-DD format
  isWorkday?: boolean; // true = 调班（周末上班）, false = 节假日, undefined = 普通日
  description?: string; // 节假日或调班说明
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
}

export interface GenerateDefaultCalendarPayload {
  year: number;
}

// API返回的特殊日期数据
export interface SpecialDate {
  id: number;
  calendarCode: string;
  calendarDate: string; // YYYY-MM-DD
  description: string;
  isWorkday: boolean; // true = 调班, false = 节假日
  isActive: boolean;
  year: number;
  createdAt: string;
  updatedAt: string;
}
