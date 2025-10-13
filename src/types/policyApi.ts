/**
 * API 政策相关类型定义
 * Policy-related type definitions for API
 */

export interface StatutoryPolicy {
  leaveDays: number;
  calendarDay: boolean;
  delayForPublicHoliday: boolean;
}

export interface DystociaPolicy {
  standardLeaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
}

export interface MoreInfantPolicy {
  extraInfantLeaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
}

export interface OtherExtendedPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
}

export interface AbortionRule {
  ruleCode: string;
  description: string;
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
  allowanceDaysRule: string[];
  targetAccountType: string;
  differenceCompensationRule: DifferenceCompensationRule;
  govAllowance: number;
}

export interface UpdatePolicyPayload {
  id: number;
  cityCode: string;
  statutoryPolicy: StatutoryPolicy;
  dystociaPolicy: DystociaPolicy;
  moreInfantPolicy: MoreInfantPolicy;
  otherExtendedPolicy: OtherExtendedPolicy;
  abortionPolicy: AbortionPolicy;
  allowancePolicy: AllowancePolicy;
}

export interface CreatePolicyPayload extends Omit<UpdatePolicyPayload, 'id'> {
  cityName: string;
}

export interface BonusLeavePolicy {
  description: string;
  days: number;
}
