import React from 'react';

interface AllowanceCalculation {
  amount: number;
  // Add other allowance calculation details as needed
}

interface CalculationResult {
  totalLeaveDays: number;
  startDate: string;
  endDate: string;
  allowance?: number | AllowanceCalculation;
  policyDetails?: string[];
}

interface ResultDisplayProps {
  result: CalculationResult;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">计算结果</h3>
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-lg font-medium text-blue-800 mb-2">产假信息</h4>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">总假期天数：</span>
              <span className="text-blue-600 font-semibold">{result.totalLeaveDays} 天</span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">开始日期：</span>
              <span>{result.startDate}</span>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">结束日期：</span>
              <span>{result.endDate}</span>
            </p>
            {result.allowance && (
              <p className="text-gray-700">
                <span className="font-medium">预计生育津贴：</span>
                <span className="text-green-600 font-semibold">
                  ¥{typeof result.allowance === 'number' 
                    ? result.allowance.toLocaleString() 
                    : result.allowance.amount.toLocaleString()}
                </span>
              </p>
            )}
          </div>
        </div>

        {result.policyDetails && result.policyDetails.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 mb-2">政策详情</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              {result.policyDetails.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
