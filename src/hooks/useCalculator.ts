/**
 * 产假计算器自定义 Hook
 * Maternity leave calculator custom hook
 */

import { useState, useCallback, useMemo } from 'react';
import type { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateMaternityLeave, validateCalculationParams } from '../utils/calculations/maternity';

/**
 * 产假计算器 Hook
 * 管理计算器状态、验证和计算逻辑
 * 
 * @returns 计算器状态和操作方法
 */
export const useCalculator = () => {
  // 计算器状态
  const [state, setState] = useState<CalculatorState>({
    startDate: null,
    employmentDate: null,
    region: '',
    employmentType: 'full-time',
    isMultipleBirth: false,
    isDifficultBirth: false,
    age: undefined,
    averageSalary: undefined,
  });

  // 计算状态
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  /**
   * 更新计算器状态
   * Update calculator state
   */
  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
    // 清除之前的结果和错误
    setResult(null);
    setErrors([]);
  }, []);

  /**
   * 重置计算器状态
   * Reset calculator state
   */
  const resetState = useCallback(() => {
    setState({
      startDate: null,
      employmentDate: null,
      region: '',
      employmentType: 'full-time',
      isMultipleBirth: false,
      isDifficultBirth: false,
      age: undefined,
      averageSalary: undefined,
    });
    setResult(null);
    setErrors([]);
  }, []);

  /**
   * 执行产假计算
   * Execute maternity leave calculation
   */
  const calculate = useCallback(async (): Promise<CalculationResult | null> => {
    // 验证输入参数
    const validationErrors = validateCalculationParams(state);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return null;
    }

    setIsCalculating(true);
    setErrors([]);

    try {
      const calculationResult = await calculateMaternityLeave(state);
      setResult(calculationResult);
      return calculationResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '计算过程中发生未知错误';
      setErrors([errorMessage]);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, [state]);

  /**
   * 检查表单是否有效
   * Check if form is valid
   */
  const isValid = useMemo(() => {
    return !!(
      state.startDate && 
      state.employmentDate && 
      state.region &&
      state.startDate > state.employmentDate
    );
  }, [state]);

  /**
   * 检查是否有必填字段为空
   * Check if any required fields are empty
   */
  const hasRequiredFields = useMemo(() => {
    return !!(state.startDate && state.employmentDate && state.region);
  }, [state]);

  /**
   * 获取表单完成度百分比
   * Get form completion percentage
   */
  const completionPercentage = useMemo(() => {
    let completed = 0;
    const total = 4; // 必填字段数量

    if (state.startDate) completed++;
    if (state.employmentDate) completed++;
    if (state.region) completed++;
    if (state.employmentType) completed++;

    return Math.round((completed / total) * 100);
  }, [state]);

  /**
   * 获取下一步提示
   * Get next step hint
   */
  const nextStepHint = useMemo(() => {
    if (!state.employmentDate) {
      return '请选择您的入职日期';
    }
    if (!state.startDate) {
      return '请选择预产期或生产日期';
    }
    if (!state.region) {
      return '请选择您所在的地区';
    }
    if (isValid && !result) {
      return '点击计算按钮查看结果';
    }
    return '';
  }, [state, isValid, result]);

  return {
    // 状态
    state,
    result,
    errors,
    isCalculating,
    
    // 验证状态
    isValid,
    hasRequiredFields,
    completionPercentage,
    nextStepHint,
    
    // 操作方法
    updateState,
    resetState,
    calculate,
  };
};
