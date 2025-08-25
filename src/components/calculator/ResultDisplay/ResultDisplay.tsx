/**
 * 计算结果显示组件
 * Calculation Result Display Component
 */

import React from 'react';
import type { CalculationResult } from '../../../types/calculator';
import { format } from '../../../utils/formatters/date';

export interface ResultDisplayProps {
  /** 计算结果 */
  result: CalculationResult;
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 计算结果显示组件
 * 展示产假计算的详细结果，包括天数、日期和津贴信息
 * 
 * @param props - 结果显示属性
 * @returns React 组件
 */
export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  result,
  showDetails = true,
  className = '',
}) => {
  const {
    totalDays,
    baseDays,
    extraDays,
    startDate,
    endDate,
    region,
    policy,
    allowance,
    details
  } = result;

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* 结果头部 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">产假计算结果</h3>
            <p className="text-primary-100 mt-1">基于 {region} 政策计算</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{totalDays}</div>
            <div className="text-primary-100">天</div>
          </div>
        </div>
      </div>

      {/* 主要信息 */}
      <div className="p-6 space-y-6">
        {/* 假期概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">基础产假</p>
                <p className="text-2xl font-bold text-blue-900">{baseDays}天</p>
              </div>
            </div>
          </div>

          {extraDays > 0 && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">额外假期</p>
                  <p className="text-2xl font-bold text-green-900">{extraDays}天</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">总计天数</p>
                <p className="text-2xl font-bold text-purple-900">{totalDays}天</p>
              </div>
            </div>
          </div>
        </div>

        {/* 日期信息 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">假期时间安排</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-20">开始日期:</span>
              <span className="text-gray-900 font-semibold">{format(startDate, 'YYYY年MM月DD日')}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 font-medium w-20">结束日期:</span>
              <span className="text-gray-900 font-semibold">{format(endDate, 'YYYY年MM月DD日')}</span>
            </div>
          </div>
        </div>

        {/* 津贴信息 */}
        {allowance && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-lg font-semibold text-yellow-900 mb-3">生育津贴预估</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 font-medium">月津贴金额:</span>
                <span className="text-yellow-900 font-bold text-lg">¥{allowance.monthlyAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-yellow-800 font-medium">总津贴预估:</span>
                <span className="text-yellow-900 font-bold text-lg">¥{allowance.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-sm text-yellow-700 mt-2">
              * 实际津贴金额以社保部门核定为准，此为预估值
            </p>
          </div>
        )}

        {/* 详细说明 */}
        {showDetails && details.length > 0 && (
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">计算详情</h4>
            <div className="space-y-3">
              {details.map((detail, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    detail.isExtra ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`font-medium ${detail.isExtra ? 'text-green-900' : 'text-blue-900'}`}>
                      {detail.item}
                    </p>
                    <p className={`text-sm ${detail.isExtra ? 'text-green-700' : 'text-blue-700'}`}>
                      {detail.description}
                    </p>
                  </div>
                  <div className={`font-bold text-lg ${detail.isExtra ? 'text-green-900' : 'text-blue-900'}`}>
                    {detail.days}天
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 政策说明 */}
        <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-primary-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h5 className="text-sm font-medium text-gray-900">政策说明</h5>
              <p className="text-sm text-gray-700 mt-1">
                本计算结果基于 <strong>{policy}</strong> 制定，实际执行时请以最新政策规定为准。
                如有疑问，建议咨询当地人力资源和社会保障部门。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
