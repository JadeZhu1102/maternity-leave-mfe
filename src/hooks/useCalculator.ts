/**
 * 产假计算器自定义 Hook
 * Maternity leave calculator custom hook
 */

import { useState, useCallback, useMemo } from 'react';
import type { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateLeaveDates, calculateAllowance } from '../services/maternityLeaveService';

/**
 * 产假计算器 Hook
 * 管理计算器状态、验证和计算逻辑
 * 
 * @returns 计算器状态和操作方法
 */
export const useCalculator = () => {
  // 计算器状态
  const [state, setState] = useState<CalculatorState>({
    // Basic information
    staffName: '',
    childBirthdate: null,
    infantNumber: undefined, // Changed from 1 to undefined to make it deletable
    deliverySequence: 1,
    abortion: false,
    abortionType: null,
    dystocia: false,
    dystociaType: null,
    cityName: '',
    companyName: 'E2P',
    leaveStartDate: null,
    leaveEndDate: null,
    calendarCode: 'CN',
    regnancyDays: 0,
    ectopicPregnancy: false,
    recommendAbortionLeaveDays: 0,
    dystociaCodeList: [],
    
    // Salary information
    averageSalary: undefined,
    currentSalary: null,
    hitForceCompensationRule: false,
    
    // Legacy fields (keep for backward compatibility)
    startDate: null,
    employmentDate: null,
    region: '',
    employmentType: 'full-time',
    isMultipleBirth: false,
    isDifficultBirth: false,
    age: undefined,
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
      staffName: '',
      childBirthdate: null,
      infantNumber: undefined,
      deliverySequence: 1,
      abortion: false,
      abortionType: null,
      dystocia: false,
      dystociaType: null,
      cityName: '',
      companyName: 'E2P',
      leaveStartDate: null,
      leaveEndDate: null,
      calendarCode: 'CN',
      regnancyDays: 0,
      ectopicPregnancy: false,
      recommendAbortionLeaveDays: 0,
      dystociaCodeList: [],
      averageSalary: undefined,
      currentSalary: null,
      hitForceCompensationRule: false,
      // Legacy fields
      startDate: null,
      employmentDate: null,
      region: '',
      employmentType: 'full-time',
      isMultipleBirth: false,
      isDifficultBirth: false,
      age: undefined,
    });
    setResult(null);
    setErrors([]);
  }, []);

  /**
   * 执行产假计算（本地模拟）
   * Execute maternity leave calculation (local mock)
   */
  const handleCalculate = useCallback(async () => {
    if (!validateForm()) return;

    // Ensure required fields have values
    const infantNumber = state.infantNumber ?? 1; // Default to 1 if undefined
    
    setIsCalculating(true);
    setErrors([]);

    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 基础产假天数
      let leaveDays = 98; // 标准产假
      const descriptionList: string[] = [];
      
      // 根据条件调整产假天数
      if (infantNumber > 1) {
        leaveDays += 15; // 多胞胎增加15天
        descriptionList.push(`多胞胎增加15天产假`);
      }
      
      if (state.dystocia) {
        leaveDays += 15; // 难产增加15天
        descriptionList.push(`难产增加15天产假`);
      }
      
      // 计算结束日期
      const startDate = state.leaveStartDate || new Date();
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + leaveDays);
      
      // 格式化日期
      const formatDate = (date: Date) => date.toISOString().split('T')[0];
      
      // 构建结果对象
      let result: any = {
        leaveDetail: {
          leaveStartDate: formatDate(startDate),
          leaveEndDate: formatDate(endDate),
          currentLeaveDays: leaveDays
        },
        allowanceDetail: {
          allowance: 0,
          compensation: 0,
          firstMonthSalary: 0,
          lastMonthSalary: 0,
          otherMonthSalary: 0,
          totalSalary: 0
        },
        calculateComments: {
          descriptionList: [
            `根据${state.cityName || '当前城市'}的产假政策`,
            `标准产假为98天`,
            ...descriptionList,
            `总计产假: ${leaveDays}天`,
            `休假时间: ${formatDate(startDate)} 至 ${formatDate(endDate)}`
          ]
        }
      };
      
      // 如果提供了薪资信息，计算津贴
      if (state.averageSalary !== null && state.averageSalary !== undefined && state.averageSalary > 0) {
        const averageSalary = state.averageSalary;
        const months = Math.ceil(leaveDays / 30);
        const baseAllowance = averageSalary * months;
        const compensation = state.hitForceCompensationRule ? baseAllowance * 0.3 : 0;
        const totalAllowance = baseAllowance + compensation;
        
        result.allowanceDetail = {
          allowance: Math.round(baseAllowance * 100) / 100,
          compensation: Math.round(compensation * 100) / 100,
          firstMonthSalary: Math.round(averageSalary * 100) / 100,
          lastMonthSalary: Math.round(averageSalary * 100) / 100,
          otherMonthSalary: Math.round(averageSalary * 100) / 100,
          totalSalary: Math.round(totalAllowance * 100) / 100
        };
        
        result.calculateComments.descriptionList.push(
          `产假津贴计算基准: ${averageSalary}元/月`,
          `产假津贴总额: ${Math.round(baseAllowance * 100) / 100}元`,
          ...(state.hitForceCompensationRule ? 
            [`符合生育津贴补偿条件，额外补偿30%: ${Math.round(compensation * 100) / 100}元`] : []),
          `总计应发津贴: ${Math.round(totalAllowance * 100) / 100}元`
        );
      }
      
      // 设置结果
      setResult(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '计算过程中发生未知错误';
      setErrors([errorMessage]);
    } finally {
      setIsCalculating(false);
    }
  }, [state]);

  /**
   * 格式化日期为API需要的格式 (yyyyMMdd)
   */
  const formatDateForApi = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  /**
   * 格式化日期为显示格式 (yyyy-MM-dd)
   */
  const formatDateForDisplay = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  /**
   * 将API响应转换为计算结果
   */
  const mapApiResponseToResult = (response: any): CalculationResult => {
    return {
      allowanceDetail: response.allowanceDetail,
      leaveDetail: response.leaveDetail,
      calculateComments: response.calculateComments,
      // 兼容旧版字段
      totalDays: response.leaveDetail?.currentLeaveDays,
      startDate: new Date(response.leaveDetail.leaveStartDate),
      endDate: new Date(response.leaveDetail.leaveEndDate),
      details: response.calculateComments.descriptionList.map((desc: string) => ({
        item: desc,
        days: 0,
        description: desc,
      })),
    };
  };

  /**
   * 验证表单
   * Validate form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: string[] = [];
    
    if (!state.staffName) newErrors.push('请输入员工姓名');
    if (!state.childBirthdate) newErrors.push('请选择预产期');
    if (!state.cityName) newErrors.push('请选择所在城市');
    if (!state.leaveStartDate) newErrors.push('请选择休假开始日期');
    
    setErrors(newErrors);
    return newErrors.length === 0;
  }, [state]);

  /**
   * 检查表单是否有效
   * Check if form is valid
   */
  const isValid = useMemo(() => {
    return !!(
      state.staffName &&
      state.childBirthdate &&
      state.cityName &&
      state.leaveStartDate
    );
  }, [state]);

  // 计算完成百分比
  const completionPercentage = useMemo(() => {
    let filledFields = 0;
    const totalFields = 4; // 总必填字段数

    if (state.staffName) filledFields++;
    if (state.childBirthdate) filledFields++;
    if (state.cityName) filledFields++;
    if (state.leaveStartDate) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  }, [state]);

  // 下一步提示
  const nextStepHint = useMemo(() => {
    if (!state.staffName) return '请输入员工姓名';
    if (!state.childBirthdate) return '请选择预产期';
    if (!state.cityName) return '请选择所在城市';
    if (!state.leaveStartDate) return '请选择休假开始日期';
    return '';
  }, [state]);

  // 是否有必填字段
  const hasRequiredFields = useMemo(() => {
    return !!(
      state.staffName &&
      state.childBirthdate &&
      state.cityName &&
      state.leaveStartDate
    );
  }, [state]);

  return {
    state,
    result,
    errors,
    isCalculating,
    isValid,
    completionPercentage,
    nextStepHint,
    hasRequiredFields,
    updateState,
    resetState,
    calculate: handleCalculate,
  };
};
