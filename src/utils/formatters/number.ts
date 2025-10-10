/**
 * 数字格式化工具函数
 * Number formatting utility functions
 */

/**
 * 格式化货币金额
 * Format number as currency
 * @param value - 要格式化的数值 (The number to format)
 * @param options - 格式化选项 (Formatting options)
 * @returns 格式化后的货币字符串 (Formatted currency string)
 */
export function formatCurrency(
  value: number | null | undefined,
  options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
): string {
  if (value === null || value === undefined) {
    return '—';
  }
  
  try {
    // 使用浏览器内置的国际化API进行格式化
    // Use browser's built-in Intl API for formatting
    return new Intl.NumberFormat('zh-CN', options).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    // 如果格式化失败，返回原始值的字符串表示
    // If formatting fails, return string representation of the value
    return String(value);
  }
}

/**
 * 格式化数字（添加千位分隔符）
 * Format number with thousands separator
 * @param value - 要格式化的数值 (The number to format)
 * @param decimalPlaces - 小数位数 (Number of decimal places)
 * @returns 格式化后的数字字符串 (Formatted number string)
 */
export function formatNumber(
  value: number | null | undefined,
  decimalPlaces = 2
): string {
  if (value === null || value === undefined) {
    return '—';
  }
  
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };
  
  try {
    return new Intl.NumberFormat('zh-CN', options).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(value);
  }
}

/**
 * 将数字转换为中文大写金额
 * Convert number to Chinese uppercase amount
 * @param num - 要转换的数字 (The number to convert)
 * @returns 中文大写金额 (Chinese uppercase amount string)
 */
export function toChineseUppercase(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '';
  }
  
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const cnIntRadice = ['', '拾', '佰', '仟'];
  const cnIntUnits = ['', '万', '亿', '兆'];
  const cnDecUnits = ['角', '分', '毫', '厘'];
  
  // 将数字转换为字符串并分割整数和小数部分
  const numStr = Math.abs(num).toString().split('.');
  const integerStr = numStr[0];
  const decimalStr = numStr.length > 1 ? numStr[1] : '';
  
  let chineseStr = '';
  
  // 处理整数部分
  if (parseInt(integerStr, 10) > 0) {
    let zeroCount = 0;
    const intLen = integerStr.length;
    
    for (let i = 0; i < intLen; i++) {
      const n = integerStr.charAt(i);
      const p = intLen - i - 1;
      const q = p / 4;
      const m = p % 4;
      
      if (n === '0') {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0];
        }
        zeroCount = 0;
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
      }
      
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q];
      }
    }
    
    chineseStr += '元';
  }
  
  // 处理小数部分
  if (decimalStr) {
    const decLen = decimalStr.length;
    for (let i = 0; i < decLen; i++) {
      if (i > 3) break; // 只处理到厘
      const n = decimalStr.charAt(i);
      if (n !== '0') {
        chineseStr += cnNums[parseInt(n)] + cnDecUnits[i];
      }
    }
  } else {
    chineseStr += '整';
  }
  
  // 处理负数
  if (num < 0) {
    chineseStr = '负' + chineseStr;
  }
  
  return chineseStr || '零元整';
}
