/**
 * 日期选择器组件
 * Date Picker Component
 */

import React from 'react';

export interface DatePickerProps {
  /** 标签文本 */
  label: string;
  /** 当前值 */
  value: Date | null;
  /** 值变化回调 */
  onChange: (date: Date | null) => void;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 最小日期 */
  minDate?: Date;
  /** 最大日期 */
  maxDate?: Date;
  /** 占位符文本 */
  placeholder?: string;
  /** 错误信息 */
  error?: string;
  /** 帮助文本 */
  helpText?: string;
}

/**
 * 日期选择器组件
 * 用于选择日期，支持验证和错误显示
 * 
 * @param props - 日期选择器属性
 * @returns React 组件
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  placeholder = '请选择日期',
  error,
  helpText,
}) => {
  // 格式化日期为 YYYY-MM-DD 格式
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 处理日期变化
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    if (date && !isNaN(date.getTime())) {
      onChange(date);
    } else if (!e.target.value) {
      onChange(null);
    }
  };

  // 获取输入框类名
  const getInputClasses = () => {
    const baseClasses = [
      'block w-full pl-10 pr-3 py-2.5 rounded-md border',
      'focus:outline-none focus:ring-2',
      'sm:text-sm transition-colors',
    ];

    if (disabled) {
      baseClasses.push('bg-gray-100 text-gray-500 border-gray-200');
      return baseClasses.join(' ');
    }

    if (error) {
      baseClasses.push('border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500');
    } else {
      baseClasses.push('border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500');
    }

    return baseClasses.join(' ');
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>

      <div className="relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <input
          type="date"
          value={formatDateForInput(value)}
          onChange={handleDateChange}
          disabled={disabled}
          min={minDate ? formatDateForInput(minDate) : undefined}
          max={maxDate ? formatDateForInput(maxDate) : undefined}
          className={getInputClasses()}
          placeholder={placeholder}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : helpText ? (
        <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
};

export default DatePicker;
