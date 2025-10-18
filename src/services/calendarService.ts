import { Calendar, CalendarFilter } from '../types/calendar';
import { generateYearMonths } from './__mocks__/calendarMockData';

// 生成2025年日历数据
const generate2025Calendar = (): Calendar => {
  return {
    id: '2025',
    name: '2025年日历',
    year: 2025,
    description: '2025年标准日历',
    isDefault: true,
    months: generateYearMonths(2025),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// 2025年日历数据
const calendar2025 = generate2025Calendar();

const calendarApi = {
  // 获取日历列表（仅返回2025年日历）
  async getCalendars(filter?: CalendarFilter): Promise<Calendar[]> {
    if (filter?.year && filter.year !== 2025) {
      return [];
    }
    if (filter?.isDefault !== undefined && filter.isDefault !== true) {
      return [];
    }
    return [calendar2025];
  },

  // 根据ID获取日历（仅支持2025年日历）
  async getCalendarById(id: string): Promise<Calendar> {
    if (id === '2025') {
      return calendar2025;
    }
    throw new Error('Calendar not found');
  },

  // 获取指定年份的默认日历（仅支持2025年）
  async getDefaultCalendar(year: number): Promise<Calendar> {
    if (year === 2025) {
      return calendar2025;
    }
    throw new Error(`Only year 2025 is supported`);
  },

  /**
   * 批量更新整年日历
   * TODO: 实现真实的API调用
   */
  async batchUpdateCalendar(calendar: Calendar): Promise<Calendar> {
    // Mock implementation
    console.log('[Mock] Batch updating calendar:', calendar);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: 当后端API可用时，替换为真实的API调用
    // const response = await fetch(`/api/v1/calendar/${calendar.id}/batch-update`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(calendar),
    // });
    // return response.json();
    
    return calendar;
  },

  // 以下方法不再支持，保留接口兼容性
  async generateDefaultCalendar(): Promise<Calendar> {
    return calendar2025;
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
