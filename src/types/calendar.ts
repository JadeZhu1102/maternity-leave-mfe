export interface CalendarDay {
  date: string; // YYYY-MM-DD format
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
