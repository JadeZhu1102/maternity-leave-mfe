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
   * 执行产假计算
   * Execute maternity leave calculation
   */
  const handleCalculate = useCallback(async () => {
    if (!validateForm()) return;

    // Ensure required fields have values
    const infantNumber = state.infantNumber ?? 1; // Default to 1 if undefined
    
    setIsCalculating(true);
    setErrors([]);

    try {
      // 准备请求参数
      const requestData: any = {
        staffName: state.staffName,
        childBirthdate: state.childBirthdate?.toISOString() || '',
        infantNumber: infantNumber,
        deliverySequence: state.deliverySequence,
        abortion: state.abortion,
        abortionType: state.abortionType || undefined,
        dystocia: state.dystocia,
        dystociaType: state.dystociaType || undefined,
        cityName: state.cityName,
        companyName: state.companyName,
        leaveStartDate: state.leaveStartDate?.toISOString() || '',
        calendarCode: state.calendarCode,
        regnancyDays: state.regnancyDays,
        ectopicPregnancy: state.ectopicPregnancy,
        recommendAbortionLeaveDays: state.recommendAbortionLeaveDays,
        dystociaCodeList: state.dystociaCodeList,
      };

      // 调用基础API计算产假日期
      const leaveResponse = await calculateLeaveDates(requestData);
      let result = mapApiResponseToResult(leaveResponse);
      
      // 如果用户输入了薪资信息，则调用津贴计算API
      if ((state.averageSalary !== null || state.currentSalary !== null) && state.leaveStartDate) {
        try {
          // 确保休假结束日期存在，如果API返回的leaveEndDate不存在，则根据休假开始日期和标准产假天数计算
          const leaveEndDate = result.leaveDetail?.leaveEndDate || 
            (() => {
              const endDate = new Date(state.leaveStartDate);
              // 标准产假天数（根据城市政策可能会有所不同）
              const standardMaternityLeaveDays = 98; // 默认98天
              endDate.setDate(endDate.getDate() + standardMaternityLeaveDays);
              return formatDateForDisplay(endDate);
            })();
          
          const allowanceRequest: any = {
            averageSalary: state.averageSalary || 0, // Default to 0 if undefined
            currentSalary: state.currentSalary || 0,
            hitForceCompensationRule: state.hitForceCompensationRule,
            leaveEndDate: leaveEndDate,
            staffName: state.staffName,
            childBirthdate: state.childBirthdate?.toISOString() || '',
            infantNumber: infantNumber,
            deliverySequence: state.deliverySequence,
            abortion: state.abortion,
            dystocia: state.dystocia,
            cityName: state.cityName,
            companyName: state.companyName,
            leaveStartDate: state.leaveStartDate?.toISOString() || '',
            calendarCode: state.calendarCode,
            regnancyDays: state.regnancyDays,
            ectopicPregnancy: state.ectopicPregnancy,
            recommendAbortionLeaveDays: state.recommendAbortionLeaveDays,
            dystociaCodeList: state.dystociaCodeList,
          };
          
          console.log('Calling allowance API with data:', allowanceRequest);
          const allowanceResponse = await calculateAllowance(allowanceRequest);
          
          // 合并津贴计算结果
          result = {
            ...result,
            allowanceDetail: {
              ...result.allowanceDetail,
              ...(allowanceResponse.allowanceDetail || {})
            },
            calculateComments: {
              ...result.calculateComments,
              descriptionList: [
                ...(result.calculateComments?.descriptionList || []),
                ...(allowanceResponse.calculateComments?.descriptionList || [])
              ]
            }
          };
        } catch (error) {
          // 如果津贴计算失败，只记录错误，不中断主流程
          console.error('津贴计算失败:', error);
          setErrors(prev => [
            ...prev,
            `产假日期计算成功，但津贴计算失败: ${error instanceof Error ? error.message : '未知错误'}`
          ]);
        }
      }
      
      setResult(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '计算过程中发生未知错误';
      setErrors([errorMessage]);
      return null;
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
