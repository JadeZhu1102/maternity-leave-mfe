import React from 'react';
import { formatCurrency } from '../../../utils/formatters/number';

export interface AllowanceDisplayProps {
  /** 津贴计算结果 */
  result: {
    allowanceDetail: {
      allowance: number | null;
      compensation: number | null;
      firstMonthSalary: number;
      lastMonthSalary: number;
      otherMonthSalary: number;
      totalSalary: number | null;
    };
    leaveDetail: {
      leaveStartDate: string | null;
      leaveEndDate: string | null;
      currentLeaveDays: number;
    };
    calculateComments: {
      descriptionList: string[];
    };
  };
  /** 自定义类名 */
  className?: string;
}

/**
 * 生育津贴计算结果显示组件
 * 展示详细的生育津贴计算结果，包括工资明细和计算说明
 */
export const AllowanceDisplay: React.FC<AllowanceDisplayProps> = ({
  result,
  className = '',
}) => {
  const { allowanceDetail, leaveDetail, calculateComments } = result;

  // 提取关键信息
  const totalSalary = allowanceDetail.totalSalary || 
    (allowanceDetail.firstMonthSalary + allowanceDetail.lastMonthSalary + allowanceDetail.otherMonthSalary);
  
  const allowance = allowanceDetail.allowance || 0;
  const compensation = allowanceDetail.compensation || 0;
  const netAllowance = allowance + compensation;

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* 头部标题 */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
        <h3 className="text-2xl font-bold">生育津贴计算结果</h3>
        <p className="text-primary-100 mt-1">详细津贴及工资明细</p>
      </div>

      <div className="p-6 space-y-6">
        {/* 津贴概览 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 政府发放金额 */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">政府发放金额</p>
                <p className="text-xl font-bold text-blue-900">
                  {formatCurrency(allowance)}
                </p>
              </div>
            </div>
          </div>

          {/* 公司补差 */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">公司补差金额</p>
                <p className="text-xl font-bold text-green-900">
                  {formatCurrency(compensation)}
                </p>
              </div>
            </div>
          </div>

          {/* 总计 */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-800">实际到手金额</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(netAllowance)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 工资明细 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">工资明细</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">首月工资</span>
              <span className="font-medium">{formatCurrency(allowanceDetail.firstMonthSalary)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">最后一个月工资</span>
              <span className="font-medium">{formatCurrency(allowanceDetail.lastMonthSalary)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">其他月份工资</span>
              <span className="font-medium">{formatCurrency(allowanceDetail.otherMonthSalary)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 font-semibold text-lg">
              <span>工资总额</span>
              <span className="text-primary-600">{formatCurrency(totalSalary)}</span>
            </div>
          </div>
        </div>

        {/* 休假信息 */}
        {leaveDetail.leaveStartDate && leaveDetail.leaveEndDate && (
          <div className="bg-blue-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">休假信息</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-blue-700">开始日期</p>
                <p className="font-medium">{new Date(leaveDetail.leaveStartDate).toLocaleDateString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">结束日期</p>
                <p className="font-medium">{new Date(leaveDetail.leaveEndDate).toLocaleDateString('zh-CN')}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">休假天数</p>
                <p className="font-medium">{leaveDetail.currentLeaveDays} 天</p>
              </div>
            </div>
          </div>
        )}

        {/* 计算说明 */}
        {calculateComments?.descriptionList?.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">计算说明</h4>
            <div className="space-y-2">
              {calculateComments.descriptionList.map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllowanceDisplay;
