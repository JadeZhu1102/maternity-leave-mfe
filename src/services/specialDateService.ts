// import axios from 'axios';
import { SpecialDate } from '../types/calendar';

// const API_BASE_URL = 'http://localhost:8080/api/v1';

// Mock data for 2024 (based on the provided example)
const mock2024SpecialDates: SpecialDate[] = [
  { id: 34, calendarCode: "CN", calendarDate: "2024-01-01", description: "元旦", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 35, calendarCode: "CN", calendarDate: "2024-02-04", description: "春节-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 36, calendarCode: "CN", calendarDate: "2024-02-10", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 37, calendarCode: "CN", calendarDate: "2024-02-11", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 38, calendarCode: "CN", calendarDate: "2024-02-12", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 39, calendarCode: "CN", calendarDate: "2024-02-13", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 40, calendarCode: "CN", calendarDate: "2024-02-14", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 41, calendarCode: "CN", calendarDate: "2024-02-15", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 42, calendarCode: "CN", calendarDate: "2024-02-16", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 43, calendarCode: "CN", calendarDate: "2024-02-17", description: "春节", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 44, calendarCode: "CN", calendarDate: "2024-02-18", description: "春节-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 45, calendarCode: "CN", calendarDate: "2024-04-04", description: "清明", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 46, calendarCode: "CN", calendarDate: "2024-04-05", description: "清明", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 47, calendarCode: "CN", calendarDate: "2024-04-06", description: "清明", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 48, calendarCode: "CN", calendarDate: "2024-04-07", description: "清明-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 49, calendarCode: "CN", calendarDate: "2024-04-28", description: "五一-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 50, calendarCode: "CN", calendarDate: "2024-05-01", description: "五一", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 51, calendarCode: "CN", calendarDate: "2024-05-02", description: "五一", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 52, calendarCode: "CN", calendarDate: "2024-05-03", description: "五一", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 53, calendarCode: "CN", calendarDate: "2024-05-04", description: "五一", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 54, calendarCode: "CN", calendarDate: "2024-05-05", description: "五一", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 55, calendarCode: "CN", calendarDate: "2024-05-11", description: "五一-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 56, calendarCode: "CN", calendarDate: "2024-06-08", description: "端午", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 57, calendarCode: "CN", calendarDate: "2024-06-09", description: "端午", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 58, calendarCode: "CN", calendarDate: "2024-06-10", description: "端午", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 59, calendarCode: "CN", calendarDate: "2024-09-14", description: "中秋-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 60, calendarCode: "CN", calendarDate: "2024-09-15", description: "中秋", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 61, calendarCode: "CN", calendarDate: "2024-09-16", description: "中秋", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 62, calendarCode: "CN", calendarDate: "2024-09-17", description: "中秋", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 63, calendarCode: "CN", calendarDate: "2024-09-29", description: "国庆-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 64, calendarCode: "CN", calendarDate: "2024-10-01", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 65, calendarCode: "CN", calendarDate: "2024-10-02", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 66, calendarCode: "CN", calendarDate: "2024-10-03", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 67, calendarCode: "CN", calendarDate: "2024-10-04", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 68, calendarCode: "CN", calendarDate: "2024-10-05", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 69, calendarCode: "CN", calendarDate: "2024-10-06", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 70, calendarCode: "CN", calendarDate: "2024-10-07", description: "国庆", isWorkday: false, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 71, calendarCode: "CN", calendarDate: "2024-10-12", description: "国庆-调班", isWorkday: true, isActive: true, year: 2024, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" }
];

// Mock data for 2025
const mock2025SpecialDates: SpecialDate[] = [
  { id: 101, calendarCode: "CN", calendarDate: "2025-01-01", description: "元旦", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 102, calendarCode: "CN", calendarDate: "2025-01-26", description: "春节-调班", isWorkday: true, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 103, calendarCode: "CN", calendarDate: "2025-01-28", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 104, calendarCode: "CN", calendarDate: "2025-01-29", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 105, calendarCode: "CN", calendarDate: "2025-01-30", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 106, calendarCode: "CN", calendarDate: "2025-01-31", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 107, calendarCode: "CN", calendarDate: "2025-02-01", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 108, calendarCode: "CN", calendarDate: "2025-02-02", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 109, calendarCode: "CN", calendarDate: "2025-02-03", description: "春节", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 110, calendarCode: "CN", calendarDate: "2025-02-08", description: "春节-调班", isWorkday: true, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 111, calendarCode: "CN", calendarDate: "2025-04-04", description: "清明", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 112, calendarCode: "CN", calendarDate: "2025-04-05", description: "清明", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 113, calendarCode: "CN", calendarDate: "2025-04-06", description: "清明", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 114, calendarCode: "CN", calendarDate: "2025-05-01", description: "五一", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 115, calendarCode: "CN", calendarDate: "2025-05-02", description: "五一", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 116, calendarCode: "CN", calendarDate: "2025-05-03", description: "五一", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 117, calendarCode: "CN", calendarDate: "2025-05-04", description: "五一", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 118, calendarCode: "CN", calendarDate: "2025-05-05", description: "五一", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 119, calendarCode: "CN", calendarDate: "2025-05-31", description: "端午", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 120, calendarCode: "CN", calendarDate: "2025-06-01", description: "端午", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 121, calendarCode: "CN", calendarDate: "2025-06-02", description: "端午", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 122, calendarCode: "CN", calendarDate: "2025-10-01", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 123, calendarCode: "CN", calendarDate: "2025-10-02", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 124, calendarCode: "CN", calendarDate: "2025-10-03", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 125, calendarCode: "CN", calendarDate: "2025-10-04", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 126, calendarCode: "CN", calendarDate: "2025-10-05", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 127, calendarCode: "CN", calendarDate: "2025-10-06", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 128, calendarCode: "CN", calendarDate: "2025-10-07", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 129, calendarCode: "CN", calendarDate: "2025-10-08", description: "国庆", isWorkday: false, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 130, calendarCode: "CN", calendarDate: "2025-09-28", description: "国庆-调班", isWorkday: true, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" },
  { id: 131, calendarCode: "CN", calendarDate: "2025-10-11", description: "国庆-调班", isWorkday: true, isActive: true, year: 2025, createdAt: "2025-10-02T15:58:56.591658", updatedAt: "2025-10-02T15:58:56.591658" }
];

const mockDataByYear: Record<number, SpecialDate[]> = {
  2024: mock2024SpecialDates,
  2025: mock2025SpecialDates
};

const specialDateApi = {
  /**
   * 获取指定年份的特殊日期（节假日和调班）
   * GET /api/v1/calendar/special-dates/{calendarCode}?year={year}
   */
  async getSpecialDates(calendarCode: string = 'CN', year: number): Promise<SpecialDate[]> {
    // TODO: 当后端API可用时，取消注释以下代码
    // try {
    //   const response = await axios.get<SpecialDate[]>(
    //     `${API_BASE_URL}/calendar/special-dates/${calendarCode}`,
    //     { params: { year } }
    //   );
    //   return response.data;
    // } catch (error) {
    //   console.error('Error fetching special dates:', error);
    //   throw error;
    // }

    // Mock implementation
    console.log(`[Mock] Fetching special dates for ${calendarCode} year ${year}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return mockDataByYear[year] || [];
  }
};

export default specialDateApi;
