import React from 'react';
import { 
  type CalculationResult, 
  type CalculationDetail
} from '../../types/calculator';

interface ResultDisplayProps {
  result: CalculationResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  // Format date for display
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '未设置';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '日期格式错误';
    }
  };

  // Calculate total allowance if available
  const totalAllowance = result.allowance?.totalAmount || 
                        (result.allowanceDetail?.allowance || 0);

  // Get policy details from calculateComments if available
  const policyDetails = result.calculateComments?.descriptionList || [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">计算结果</h3>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-blue-800 mb-2">产假信息</h4>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">总假期天数：</span>
              <span className="text-blue-600 font-semibold">
                {result.totalDays || result.leaveDetail?.currentLeaveDays || 0} 天
              </span>
            </p>
            
            <p className="text-gray-700">
              <span className="font-medium">开始日期：</span>
              <span>{formatDate(result.startDate || result.leaveDetail?.leaveStartDate)}</span>
            </p>
            
            <p className="text-gray-700">
              <span className="font-medium">结束日期：</span>
              <span>{formatDate(result.endDate || result.leaveDetail?.leaveEndDate)}</span>
            </p>
            
            {totalAllowance > 0 && (
              <p className="text-gray-700">
                <span className="font-medium">预计生育津贴：</span>
                <span className="text-green-600 font-semibold">
                  ¥{totalAllowance.toLocaleString('zh-CN')}
                </span>
              </p>
            )}
          </div>
        </div>

        {result.details && result.details.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-green-800 mb-2">假期明细</h4>
            <ul className="space-y-2">
              {result.details.map((detail: CalculationDetail, index: number) => (
                <li key={index} className="text-green-700">
                  <div className="flex justify-between">
                    <span>{detail.item}：</span>
                    <span className="font-medium">{detail.days} 天</span>
                  </div>
                  {detail.description && (
                    <p className="text-sm text-gray-600 mt-1">{detail.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {policyDetails.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium text-yellow-800 mb-2">政策详情</h4>
            <ul className="list-disc pl-5 space-y-1">
              {policyDetails.map((detail: string, index: number) => (
                <li key={index} className="text-yellow-700">{detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
