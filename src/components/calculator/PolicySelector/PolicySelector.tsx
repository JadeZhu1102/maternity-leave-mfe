/**
 * 政策选择器组件
 * Policy Selector Component
 */

import React from 'react';
import type { RegionCode } from '../../../types/calculator';
import { REGION_OPTIONS } from '../../../constants/policies';

export interface PolicySelectorProps {
  /** 标签文本 */
  label: string;
  /** 当前选中的地区 */
  value: RegionCode | '';
  /** 值变化回调 */
  onChange: (region: RegionCode | '') => void;
  /** 是否必填 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 占位符文本 */
  placeholder?: string;
  /** 错误信息 */
  error?: string;
  /** 帮助文本 */
  helpText?: string;
}

/**
 * 政策选择器组件
 * 用于选择适用的产假政策地区
 * 
 * @param props - 政策选择器属性
 * @returns React 组件
 */
export const PolicySelector: React.FC<PolicySelectorProps> = ({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder = '请选择您所在的地区',
  error,
  helpText,
}) => {
  // 处理选择变化
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as RegionCode | '';
    onChange(selectedValue);
  };

  // 获取选择框样式类
  const getSelectClasses = () => {
    const baseClasses = [
      'block w-full px-3 py-2 pr-10 border rounded-md shadow-sm',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
      'transition-colors duration-200',
      'bg-white',
      'appearance-none' // 隐藏浏览器原生下拉箭头
    ];

    if (error) {
      baseClasses.push('border-red-300 text-red-900');
    } else {
      baseClasses.push('border-gray-300 text-gray-900');
    }

    return baseClasses.join(' ');
  };

  return (
    <div className="space-y-1">
      {/* 标签 */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* 选择框 */}
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={getSelectClasses()}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {REGION_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* 下拉箭头图标 */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg 
            className="h-5 w-5 text-gray-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>

      {/* 帮助文本 */}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {/* 错误信息 */}
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg 
            className="h-4 w-4 mr-1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}

      {/* 政策信息提示 */}
      {value && !error && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg 
                className="h-5 w-5 text-blue-400" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                将根据所选地区的最新产假政策进行计算，包括基础产假和各项额外假期。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicySelector;
