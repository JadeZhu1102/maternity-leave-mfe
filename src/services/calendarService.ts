import { Calendar, CalendarFilter, GenerateDefaultCalendarPayload, UpdateCalendarDayPayload } from '../types/calendar';
import { MockDataService } from './mockData';

// 使用 MockDataService 实现所有日历相关的 API 调用
const calendarApi = {
  // 获取日历列表（带过滤）
  async getCalendars(filter?: CalendarFilter): Promise<Calendar[]> {
    const calendars = await MockDataService.getCalendars();
    // 应用过滤条件
    return calendars.filter(calendar => {
      if (filter?.year && calendar.year !== filter.year) return false;
      if (filter?.isDefault !== undefined && calendar.isDefault !== filter.isDefault) return false;
      return true;
    });
  },

  // 根据ID获取日历
  async getCalendarById(id: string): Promise<Calendar> {
    return MockDataService.getCalendarById(id);
  },

  // 获取指定年份的默认日历
  async getDefaultCalendar(year: number): Promise<Calendar> {
    const calendars = await this.getCalendars({ year, isDefault: true });
    if (calendars.length > 0) {
      return calendars[0];
    }
    // 如果没有找到默认日历，返回第一个匹配年份的日历
    const yearCalendars = await this.getCalendars({ year });
    if (yearCalendars.length > 0) {
      return yearCalendars[0];
    }
    // 如果还没有，生成一个默认日历
    return this.generateDefaultCalendar({ year });
  },

  // 为指定年份生成默认日历
  async generateDefaultCalendar(payload: GenerateDefaultCalendarPayload): Promise<Calendar> {
    const { year, countryCode = 'CN', region } = payload;
    const calendarName = region 
      ? `${year}年${region}工作日历`
      : `${year}年中国大陆工作日历`;
      
    return MockDataService.createCalendar({
      name: calendarName,
      year,
      description: `自动生成的${year}年${region ? region + ' ' : ''}工作日历`,
      isDefault: true,
      months: []
    });
  },

  // 更新日历中的某一天
  async updateCalendarDay(payload: UpdateCalendarDayPayload): Promise<Calendar> {
    return MockDataService.updateCalendarDay(payload);
  },

  // 保存日历（创建或更新）
  async saveCalendar(calendar: Partial<Calendar>): Promise<Calendar> {
    if (calendar.id) {
      return MockDataService.updateCalendar(calendar.id, calendar);
    } else {
      return MockDataService.createCalendar({
        ...calendar,
        isDefault: calendar.isDefault || false,
        months: calendar.months || []
      });
    }
  },

  // 删除日历
  async deleteCalendar(id: string): Promise<void> {
    await MockDataService.deleteCalendar(id);
  }
};

export default calendarApi;
