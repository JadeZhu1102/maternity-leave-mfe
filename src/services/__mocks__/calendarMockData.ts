import { Calendar, CalendarDay, MonthCalendar, GenerateDefaultCalendarPayload } from '../../types/calendar';

// 生成一个月的日历数据
function generateMonth(year: number, month: number, isWorkingDayDefault = true): MonthCalendar {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days: CalendarDay[] = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    days.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      isWorkingDay: !isWeekend, // 默认周末休息
      isHoliday: false,
      description: ''
    });
  }
  
  return { year, month, days };
}

// 模拟日历数据
const mockCalendars: Calendar[] = [
  {
    id: '1',
    name: '2024年中国大陆工作日历',
    year: 2024,
    description: '2024年中国大陆标准工作日历，包含法定节假日和调休安排',
    isDefault: true,
    months: Array.from({ length: 12 }, (_, i) => generateMonth(2024, i + 1)),
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2023-12-15T10:30:00Z'
  },
  {
    id: '2',
    name: '2024年上海工作日历',
    year: 2024,
    description: '2024年上海地区工作日历，包含上海本地节假日安排',
    isDefault: false,
    months: Array.from({ length: 12 }, (_, i) => generateMonth(2024, i + 1)),
    createdAt: '2023-12-05T00:00:00Z',
    updatedAt: '2023-12-20T14:15:00Z'
  }
];

// 生成一年的月份数据
function generateYearMonths(year: number, countryCode: string, region: string): MonthCalendar[] {
  const months: MonthCalendar[] = [];
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: CalendarDay[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // 模拟一些特殊日期（节假日/调休日）
      const isHoliday = isSpecialHoliday(year, month + 1, day, countryCode, region);
      const isWorkingDay = isWeekend ? isHoliday === 'workday' : !isHoliday;
      
      days.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        isWorkingDay,
        isHoliday: !!isHoliday,
        description: isHoliday === 'holiday' ? getHolidayName(year, month + 1, day, countryCode, region) : '',
        calendarId: '1'
      });
    }
    
    months.push({
      year,
      month: month + 1,
      days
    });
  }
  
  return months;
}

// 判断是否是特殊日期（节假日/调休日）
function isSpecialHoliday(year: number, month: number, day: number, countryCode: string, region: string): 'holiday' | 'workday' | false {
  // 这里简化处理，实际应该根据具体年份的节假日安排来
  const dateStr = `${month}-${day}`;
  
  // 中国法定节假日（简化版）
  const holidays: Record<string, string> = {
    '1-1': '元旦节',
    '2-10': '春节', '2-11': '春节', '2-12': '春节',
    '4-4': '清明节',
    '5-1': '劳动节',
    '6-14': '端午节',
    '9-21': '中秋节',
    '10-1': '国庆节', '10-2': '国庆节', '10-3': '国庆节'
  };
  
  // 调休工作日（周末上班）
  const workdays: Record<string, string> = {
    '2-7': '春节调休', '2-20': '春节调休',
    '4-25': '劳动节调休',
    '5-8': '劳动节调休',
    '9-18': '中秋节调休',
    '9-26': '国庆节调休', '10-9': '国庆节调休'
  };
  
  if (holidays[dateStr]) return 'holiday';
  if (workdays[dateStr]) return 'workday';
  
  return false;
}

// 获取节日名称
function getHolidayName(year: number, month: number, day: number, countryCode: string, region: string): string {
  const dateStr = `${month}-${day}`;
  
  const holidays: Record<string, string> = {
    '1-1': '元旦节',
    '2-10': '春节', '2-11': '春节', '2-12': '春节',
    '4-4': '清明节',
    '5-1': '劳动节',
    '6-14': '端午节',
    '9-21': '中秋节',
    '10-1': '国庆节', '10-2': '国庆节', '10-3': '国庆节'
  };
  
  return holidays[dateStr] || '';
}

export { mockCalendars, generateYearMonths };
