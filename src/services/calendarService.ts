import { Calendar, CalendarFilter, GenerateDefaultCalendarPayload } from '../types/calendar';
import { generateYearMonths } from './__mocks__/calendarMockData';

// API配置 - 使用相对路径，通过Vite代理访问
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// 日历设置请求接口
interface CalendarSetupRequest {
  calendarCode: string;
  publicHolidays: Array<{
    calendarDate: string;
    description: string;
  }>;
  extraWorkdays: Array<{
    calendarDate: string;
    description: string;
  }>;
}

// 日历设置响应接口
interface CalendarSetupResponse {
  calendarCode: string;
  publicHolidays: Array<{
    calendarDate: string;
    description: string;
  }>;
  extraWorkdays: Array<{
    calendarDate: string;
    description: string;
  }>;
}

// 生成指定年份的日历数据
const generateCalendar = (year: number): Calendar => {
  return {
    id: String(year),
    name: `${year}年日历`,
    year,
    description: `${year}年标准日历`,
    isDefault: true,
    months: generateYearMonths(year),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const calendarApi = {
  // 获取日历列表（默认返回所请求的年份或当前年份）
  async getCalendars(filter?: CalendarFilter): Promise<Calendar[]> {
    const y = filter?.year ?? new Date().getFullYear();
    return [generateCalendar(y)];
  },

  // 根据ID获取日历（ID为年份字符串）
  async getCalendarById(id: string): Promise<Calendar> {
    const y = Number.parseInt(id, 10);
    if (!Number.isFinite(y)) throw new Error('Calendar not found');
    return generateCalendar(y);
  },

  // 获取指定年份的默认日历（支持任意年份）
  async getDefaultCalendar(year: number): Promise<Calendar> {
    return generateCalendar(year);
  },

  /**
   * 批量更新整年日历 - 调用真实API
   * @param calendar 日历数据
   * @param calendarCode 日历代码（默认CN）
   * @param apiBaseUrl 自定义API地址（可选）
   */
  async batchUpdateCalendar(
    calendar: Calendar, 
    calendarCode: string = 'CN',
    apiBaseUrl?: string
  ): Promise<CalendarSetupResponse> {
    try {
      const baseUrl = apiBaseUrl || API_BASE_URL;
      
      // 将Calendar数据转换为API所需的格式
      const publicHolidays: Array<{ calendarDate: string; description: string }> = [];
      const extraWorkdays: Array<{ calendarDate: string; description: string }> = [];

      // 遍历所有月份的所有日期
      calendar.months.forEach(month => {
        month.days.forEach(day => {
          // 节假日：isWorkday === false
          if (day.isWorkday === false && day.description) {
            publicHolidays.push({
              calendarDate: day.date,
              description: day.description
            });
          }
          // 调班日：周末但isWorkday === true
          else if (day.isWorkday === true && day.description) {
            const dayOfWeek = new Date(day.date).getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
              extraWorkdays.push({
                calendarDate: day.date,
                description: day.description
              });
            }
          }
        });
      });

      const requestBody: CalendarSetupRequest = {
        calendarCode,
        publicHolidays,
        extraWorkdays
      };

      const apiUrl = `${baseUrl}/v1/calendar/setup-calendar`;
      console.log('[API] Saving calendar to:', apiUrl);
      console.log('[API] Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API请求失败: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result: CalendarSetupResponse = await response.json();
      console.log('[API] Response:', result);
      
      return result;
    } catch (error) {
      console.error('[API] Error saving calendar:', error);
      throw error;
    }
  },

  // 生成指定年份的默认日历
  async generateDefaultCalendar(payload: GenerateDefaultCalendarPayload): Promise<Calendar> {
    const { year } = payload;
    return generateCalendar(year);
  },

  async updateCalendarDay(): Promise<Calendar> {
    throw new Error('Calendar updates are not supported');
  },

  async saveCalendar(): Promise<Calendar> {
    throw new Error('Calendar creation/updates are not supported');
  },

  async deleteCalendar(): Promise<void> {
    throw new Error('Calendar deletion is not supported');
  }
};

export default calendarApi;
