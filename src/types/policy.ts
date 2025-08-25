/**
 * 政策相关类型定义
 * Policy-related type definitions
 */

/**
 * 政策相关类型定义
 * Policy-related type definitions
 */
import type { RegionCode } from './calculator';

/** 产假政策接口 */
export interface MaternityPolicy {
  /** 政策ID */
  id: string;
  /** 政策名称 */
  name: string;
  /** 适用地区 */
  region: RegionCode;
  /** 基础产假天数 */
  baseDays: number;
  /** 额外天数规则 */
  extraDaysRules: ExtraDaysRule[];
  /** 津贴政策 */
  allowancePolicy?: AllowancePolicy;
  /** 政策生效日期 */
  effectiveDate: Date;
  /** 政策描述 */
  description: string;
  /** 相关法规链接 */
  regulationUrl?: string;
}

/** 额外天数规则 */
export interface ExtraDaysRule {
  /** 规则类型 */
  type: 'multiple_birth' | 'difficult_birth' | 'age_bonus' | 'employment_years' | 'late_marriage';
  /** 额外天数 */
  days: number;
  /** 规则条件 */
  condition: RuleCondition;
  /** 规则描述 */
  description: string;
}

/** 规则条件 */
export interface RuleCondition {
  /** 最小值 */
  min?: number;
  /** 最大值 */
  max?: number;
  /** 精确值 */
  exact?: boolean;
  /** 字符串值 */
  value?: string;
}

/** 津贴政策 */
export interface AllowancePolicy {
  /** 津贴类型 */
  type: 'social_insurance' | 'employer_paid' | 'government_subsidy';
  /** 计算方式 */
  calculationMethod: 'average_salary' | 'minimum_wage' | 'fixed_amount';
  /** 津贴比例 (0-1) */
  percentage: number;
  /** 最低津贴金额 */
  minAmount?: number;
  /** 最高津贴金额 */
  maxAmount?: number;
  /** 固定金额 */
  fixedAmount?: number;
  /** 计算说明 */
  description: string;
}

/** 陪产假政策 */
export interface PaternityPolicy {
  /** 政策ID */
  id: string;
  /** 政策名称 */
  name: string;
  /** 适用地区 */
  region: RegionCode;
  /** 陪产假天数 */
  days: number;
  /** 津贴政策 */
  allowancePolicy?: AllowancePolicy;
  /** 使用条件 */
  conditions: string[];
  /** 政策描述 */
  description: string;
}

/** 政策更新记录 */
export interface PolicyUpdateRecord {
  /** 更新ID */
  id: string;
  /** 政策ID */
  policyId: string;
  /** 更新类型 */
  updateType: 'create' | 'modify' | 'delete';
  /** 更新内容 */
  changes: Record<string, any>;
  /** 更新时间 */
  updateTime: Date;
  /** 更新说明 */
  description: string;
}
