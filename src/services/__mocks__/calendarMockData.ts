import { Calendar, CalendarDay, MonthCalendar } from '../../types/calendar';

// 生成一个月的日历数据
function generateMonth(year: number, month: number): MonthCalendar {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    });
  }
  
  return { year, month, days };
}

// 模拟日历数据
const mockCalendars: Calendar[] = [
  {
    id: '1',
    name: '2024年日历',
    year: 2024,
    description: '2024年标准日历',
    isDefault: true,
    months: Array.from({ length: 12 }, (_, i) => generateMonth(2024, i + 1)),
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-15T10:30:00Z'
  },
  {
    id: '2',
    name: '2024年日历',
    year: 2024,
    description: '2024年标准日历',
    isDefault: false,
    months: Array.from({ length: 12 }, (_, i) => generateMonth(2024, i + 1)),
    createdAt: '2023-12-05T00:00:00Z',
    updatedAt: '2023-12-20T14:15:00Z'
  }
];

// 生成一年的月份数据
function generateYearMonths(year: number): MonthCalendar[] {
  return Array.from({ length: 12 }, (_, i) => generateMonth(year, i + 1));
}

export { mockCalendars, generateYearMonths };
