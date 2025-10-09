import { useState } from 'react';
import { DateCalculateRequest, calculateLeaveDates } from '../services/maternityLeaveService';

export const useMaternityLeaveCalculation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateLeave = async (data: DateCalculateRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await calculateLeaveDates(data);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '计算产假日期时出错，请重试';
      setError(errorMessage);
      console.error('Calculation error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { calculateLeave, result, isLoading, error, setError };
};

export default useMaternityLeaveCalculation;
