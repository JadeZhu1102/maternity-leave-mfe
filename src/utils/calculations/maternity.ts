/**
 * 产假计算核心逻辑
 * Maternity leave calculation core logic
 */

import type { CalculatorState, CalculationResult, CalculationDetail, AllowanceCalculation } from '../../types/calculator';
import { MATERNITY_POLICIES } from '../../constants/policies';
import { addDays, differenceInYears } from '../formatters/date';

/**
 * 计算产假天数和相关信息
 * Calculate maternity leave days and related information
 * 
 * @param state - 计算器状态
 * @returns 计算结果
 */
export const calculateMaternityLeave = async (
  state: CalculatorState
): Promise<CalculationResult> => {
  const { startDate, employmentDate, region, employmentType, isMultipleBirth, isDifficultBirth, age } = state;
  
  if (!startDate || !employmentDate || !region) {
    throw new Error('缺少必要的计算参数');
  }

  // 获取对应地区的政策
  const policy = MATERNITY_POLICIES[region];
  if (!policy) {
    throw new Error(`未找到地区 ${region} 的政策信息`);
  }

  // 计算工作年限
  const workYears = calculateWorkYears(employmentDate, startDate);
  
  // 验证就业时间是否满足要求（一般要求连续缴费满12个月）
  if (workYears < 1) {
    console.warn('工作年限不足1年，可能影响津贴计算');
  }

  // 计算基础产假天数
  const baseDays = policy.baseDays;
  
  // 计算额外天数
  const { extraDays, details } = calculateExtraDays(state, policy);
  
  // 计算总天数
  const totalDays = baseDays + extraDays;
  
  // 计算结束日期
  const endDate = addDays(startDate, totalDays);
  
  // 计算津贴（如果有政策支持）
  const allowance = policy.allowancePolicy 
    ? calculateAllowance(totalDays, policy.allowancePolicy, workYears, state.averageSalary)
    : undefined;

  // 构建详细说明
  const calculationDetails: CalculationDetail[] = [
    {
      item: '基础产假',
      days: baseDays,
      description: `根据${policy.name}规定的基础产假天数`,
      isExtra: false
    },
    ...details
  ];

  return {
    totalDays,
    baseDays,
    extraDays,
    startDate,
    endDate,
    region: policy.name,
    policy: policy.name,
    allowance,
    details: calculationDetails
  };
};

/**
 * 计算工作年限
 * Calculate work years
 * 
 * @param employmentDate - 入职日期
 * @param currentDate - 当前日期
 * @returns 工作年限
 */
const calculateWorkYears = (employmentDate: Date, currentDate: Date): number => {
  return differenceInYears(currentDate, employmentDate);
};

/**
 * 计算额外产假天数
 * Calculate extra maternity leave days
 * 
 * @param state - 计算器状态
 * @param policy - 适用政策
 * @returns 额外天数和详细说明
 */
const calculateExtraDays = (
  state: CalculatorState, 
  policy: any
): { extraDays: number; details: CalculationDetail[] } => {
  let extraDays = 0;
  const details: CalculationDetail[] = [];

  for (const rule of policy.extraDaysRules) {
    let shouldApply = false;
    let appliedDays = 0;

    switch (rule.type) {
      case 'multiple_birth':
        if (state.isMultipleBirth) {
          shouldApply = true;
          appliedDays = rule.days;
        }
        break;

      case 'difficult_birth':
        if (state.isDifficultBirth) {
          shouldApply = true;
          appliedDays = rule.days;
        }
        break;

      case 'age_bonus':
        if (state.age && rule.condition.min && state.age >= rule.condition.min) {
          shouldApply = true;
          appliedDays = rule.days;
        }
        break;

      case 'employment_years':
        const workYears = calculateWorkYears(state.employmentDate!, state.startDate!);
        if (rule.condition.min && workYears >= rule.condition.min) {
          shouldApply = true;
          appliedDays = rule.days;
        }
        break;

      case 'late_marriage':
        if (state.age && rule.condition.min && state.age >= rule.condition.min) {
          shouldApply = true;
          appliedDays = rule.days;
        }
        break;
    }

    if (shouldApply) {
      extraDays += appliedDays;
      details.push({
        item: getExtraTypeLabel(rule.type),
        days: appliedDays,
        description: rule.description,
        isExtra: true
      });
    }
  }

  return { extraDays, details };
};

/**
 * 计算生育津贴
 * Calculate maternity allowance
 * 
 * @param totalDays - 总产假天数
 * @param allowancePolicy - 津贴政策
 * @param workYears - 工作年限
 * @param averageSalary - 员工平均薪资（元/月）
 * @returns 津贴计算结果
 */
const calculateAllowance = (
  totalDays: number,
  allowancePolicy: any,
  workYears: number,
  averageSalary?: number
): AllowanceCalculation => {
  // 使用用户输入的平均薪资，如果没有输入则使用政策规定的最低基数
  const baseAmount = averageSalary || allowancePolicy.minAmount || 5000;
  
  // 计算每月津贴金额（通常为平均工资的一定比例）
  const monthlyAmount = baseAmount * allowancePolicy.percentage;
  
  // 按天计算总津贴
  const dailyAmount = monthlyAmount / 30;
  const totalAmount = dailyAmount * totalDays;

  return {
    monthlyAmount: Math.round(monthlyAmount * 100) / 100, // 保留两位小数
    totalAmount: Math.round(totalAmount * 100) / 100,     // 保留两位小数
    baseAmount: Math.round(baseAmount * 100) / 100,       // 保留两位小数
    percentage: allowancePolicy.percentage,
    usedAverageSalary: !!averageSalary  // 标记是否使用了用户输入的平均薪资
  };
};

/**
 * 获取额外类型的中文标签
 * Get Chinese label for extra type
 * 
 * @param type - 额外类型
 * @returns 中文标签
 */
const getExtraTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'multiple_birth': '多胞胎产假',
    'difficult_birth': '难产产假',
    'age_bonus': '年龄奖励产假',
    'employment_years': '工龄奖励产假',
    'late_marriage': '晚育产假'
  };
  return labels[type] || type;
};

/**
 * 验证计算参数
 * Validate calculation parameters
 * 
 * @param state - 计算器状态
 * @returns 验证结果
 */
export const validateCalculationParams = (state: CalculatorState): string[] => {
  const errors: string[] = [];

  if (!state.region) {
    errors.push('请选择所在地区');
  }

  return errors;
};
