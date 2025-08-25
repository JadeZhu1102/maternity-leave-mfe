/**
 * 产假计算器相关类型定义
 * Calculator-related type definitions
 */

/** 就业类型枚举 */
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance';

/** 地区代码类型 */
export type RegionCode = 'beijing' | 'shanghai' | 'guangzhou' | 'shenzhen' | 'hangzhou' | 'nanjing' | 'other';

/** 计算器状态接口 */
export interface CalculatorState {
  /** 预产期/生产日期 */
  startDate: Date | null;
  /** 入职日期 */
  employmentDate: Date | null;
  /** 所在地区 */
  region: RegionCode | '';
  /** 就业类型 */
  employmentType: EmploymentType;
  /** 是否为多胞胎 */
  isMultipleBirth?: boolean;
  /** 是否为难产 */
  isDifficultBirth?: boolean;
  /** 年龄 */
  age?: number;
}

/** 计算结果接口 */
export interface CalculationResult {
  /** 总产假天数 */
  totalDays: number;
  /** 基础产假天数 */
  baseDays: number;
  /** 额外产假天数 */
  extraDays: number;
  /** 开始日期 */
  startDate: Date;
  /** 结束日期 */
  endDate: Date;
  /** 地区 */
  region: string;
  /** 适用政策名称 */
  policy: string;
  /** 津贴计算结果 */
  allowance?: AllowanceCalculation;
  /** 详细说明 */
  details: CalculationDetail[];
}

/** 津贴计算结果 */
export interface AllowanceCalculation {
  /** 每月津贴金额 */
  monthlyAmount: number;
  /** 总津贴金额 */
  totalAmount: number;
  /** 计算基数 */
  baseAmount: number;
  /** 津贴比例 */
  percentage: number;
}

/** 计算详情 */
export interface CalculationDetail {
  /** 项目名称 */
  item: string;
  /** 天数 */
  days: number;
  /** 说明 */
  description: string;
  /** 是否为额外项目 */
  isExtra?: boolean;
}

/** 表单验证错误 */
export interface ValidationError {
  /** 字段名 */
  field: keyof CalculatorState;
  /** 错误消息 */
  message: string;
}

/** 计算器配置 */
export interface CalculatorConfig {
  /** 最小入职天数要求 */
  minEmploymentDays: number;
  /** 最大计算天数 */
  maxCalculationDays: number;
  /** 是否启用津贴计算 */
  enableAllowanceCalculation: boolean;
}
