/**
 * 日期格式化工具函数
 * Date formatting utility functions
 */

/**
 * 添加天数到指定日期
 * Add days to a specific date
 * 
 * @param date - 基础日期
 * @param days - 要添加的天数
 * @returns 新的日期
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * 计算两个日期之间的年份差
 * Calculate years difference between two dates
 * 
 * @param laterDate - 较晚的日期
 * @param earlierDate - 较早的日期
 * @returns 年份差
 */
export const differenceInYears = (laterDate: Date, earlierDate: Date): number => {
  const diffTime = Math.abs(laterDate.getTime() - earlierDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diffYears);
};

/**
 * 计算两个日期之间的天数差
 * Calculate days difference between two dates
 * 
 * @param laterDate - 较晚的日期
 * @param earlierDate - 较早的日期
 * @returns 天数差
 */
export const differenceInDays = (laterDate: Date, earlierDate: Date): number => {
  const diffTime = Math.abs(laterDate.getTime() - earlierDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 格式化日期为字符串
 * Format date to string
 * 
 * @param date - 日期对象
 * @param formatStr - 格式字符串 (YYYY-MM-DD, MM/DD/YYYY, etc.)
 * @returns 格式化后的日期字符串
 */
export const format = (date: Date, formatStr: string = 'YYYY-MM-DD'): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  switch (formatStr) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY年MM月DD日':
      return `${year}年${month}月${day}日`;
    case 'MM月DD日':
      return `${month}月${day}日`;
    default:
      return `${year}-${month}-${day}`;
  }
};

/**
 * 解析日期字符串
 * Parse date string
 * 
 * @param dateStr - 日期字符串
 * @returns 日期对象
 */
export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * 检查日期是否有效
 * Check if date is valid
 * 
 * @param date - 日期对象
 * @returns 是否有效
 */
export const isValidDate = (date: any): date is Date => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * 获取当前日期
 * Get current date
 * 
 * @returns 当前日期
 */
export const getCurrentDate = (): Date => {
  return new Date();
};

/**
 * 获取日期的开始时间（00:00:00）
 * Get start of day (00:00:00)
 * 
 * @param date - 日期对象
 * @returns 当天开始时间
 */
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * 获取日期的结束时间（23:59:59）
 * Get end of day (23:59:59)
 * 
 * @param date - 日期对象
 * @returns 当天结束时间
 */
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * 检查日期是否为工作日
 * Check if date is weekday
 * 
 * @param date - 日期对象
 * @returns 是否为工作日
 */
export const isWeekday = (date: Date): boolean => {
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday to Friday
};

/**
 * 检查日期是否为周末
 * Check if date is weekend
 * 
 * @param date - 日期对象
 * @returns 是否为周末
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * 获取两个日期之间的工作日数量
 * Get weekdays count between two dates
 * 
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 工作日数量
 */
export const getWeekdaysCount = (startDate: Date, endDate: Date): number => {
  let count = 0;
  const current = new Date(startDate);
  
  while (current <= endDate) {
    if (isWeekday(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

/**
 * 格式化相对时间
 * Format relative time
 * 
 * @param date - 日期对象
 * @param baseDate - 基准日期（默认为当前时间）
 * @returns 相对时间字符串
 */
export const formatRelativeTime = (date: Date, baseDate: Date = new Date()): string => {
  const diffInMs = baseDate.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return '今天';
  } else if (diffInDays === 1) {
    return '昨天';
  } else if (diffInDays === -1) {
    return '明天';
  } else if (diffInDays > 0) {
    return `${diffInDays}天前`;
  } else {
    return `${Math.abs(diffInDays)}天后`;
  }
};
