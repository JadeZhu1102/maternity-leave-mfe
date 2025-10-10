/**
 * API 政策相关类型定义
 * Policy-related type definitions for API
 */

export interface StatutoryPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  maxLeaveDays: number;
}

export interface DystociaPolicy {
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  standardLeaveDays: number;
}

export interface MoreInfantPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
}

export interface OtherExtendedPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  maxLeaveDays: number;
}

export interface AbortionRule {
  ectopicPregnancy: boolean;
  minRegnancyDays: number;
  maxRegnancyDays: number;
  minLeaveDays: number;
  maxLeaveDays: number;
  leaveDays: number;
}

export interface AbortionPolicy {
  delayForPublicHoliday: boolean;
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

export interface CreatePolicyPayload {
  cityName: string;
  statutoryPolicy: StatutoryPolicy;
  dystociaPolicy: DystociaPolicy;
  moreInfantPolicy: MoreInfantPolicy;
  otherExtendedPolicy: OtherExtendedPolicy;
  abortionPolicy: AbortionPolicy;
  allowancePolicy: AllowancePolicy;
}
