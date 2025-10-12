/**
 * API 政策相关类型定义
 * Policy-related type definitions for API
 */

export interface StatutoryPolicy {
  leaveDays: number;
  calendarDay: boolean;
  maxLeaveDays: number;
  bonusLeaveDays: number;
}

export interface DystociaPolicy {
  calendarDay: boolean;
  standardLeaveDays: number;
}

export interface MoreInfantPolicy {
  leaveDays: number;
  calendarDay: boolean;
}

export interface OtherExtendedPolicy {
  leaveDays: number;
  calendarDay: boolean;
  maxLeaveDays: number;
}

export interface AbortionRule {
  name: string; // 规则名称，如"宫外孕"、"自然流产"等
  ectopicPregnancy?: boolean; // 是否为宫外孕
  minPregnancyDays: number; // 最小怀孕天数
  maxPregnancyDays: number; // 最大怀孕天数
  minLeaveDays: number; // 最小休假天数
  maxLeaveDays: number; // 最大休假天数
  leaveDays: number; // 默认休假天数
}

export interface AbortionPolicy {
  calendarDay: boolean;
  abortionRules: AbortionRule[];
}

export interface CorpSalaryDetail {
  companyName: string;
  corpAverageSalary: number;
}

export interface DifferenceCompensationRule {
  ruleDescription: string;
  forceCompensation: string;
  otherCompensationRuleDesc: string[];
}

export interface AllowancePolicy {
  corpSalaryDetailList: CorpSalaryDetail[];
  numerator: number;
  denominator: number;
  allowanceDays: number;
  targetAccountType: string;
  differenceCompensationRule: DifferenceCompensationRule;
  govAllowance: number;
}

export interface BonusLeavePolicy {
  description: string;
  days: number;
}

export interface CreatePolicyPayload {
  cityName: string;
  statutoryPolicy: StatutoryPolicy;
  dystociaPolicy: DystociaPolicy;
  moreInfantPolicy: MoreInfantPolicy;
  otherExtendedPolicy: OtherExtendedPolicy;
  abortionPolicy: AbortionPolicy;
  allowancePolicy: AllowancePolicy;
  bonusLeavePolicies: BonusLeavePolicy[];
}
