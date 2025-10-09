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
  // API Required Fields
  /** 员工姓名 */
  staffName: string;
  /** 预产期 */
  childBirthdate: Date | null;
  /** 婴儿数量 */
  infantNumber: number;
  /** 分娩顺序 */
  deliverySequence: number;
  /** 是否流产 */
  abortion: boolean;
  /** 是否难产 */
  dystocia: boolean;
  /** 城市名称 */
  cityName: string;
  /** 公司名称 */
  companyName: string;
  /** 休假开始日期 */
  leaveStartDate: Date | null;
  /** 日历代码 */
  calendarCode: string;
  /** 怀孕天数 */
  regnancyDays: number;
  /** 是否宫外孕 */
  ectopicPregnancy: boolean;
  /** 建议流产休假天数 */
  recommendAbortionLeaveDays: number;
  /** 难产代码列表 */
  dystociaCodeList: string[];
  
  // Salary related fields
  /** 平均工资 */
  averageSalary: number | null;
  /** 当前工资 */
  currentSalary: number | null;
  /** 是否适用强制补偿规则 */
  hitForceCompensationRule: boolean;
  /** 休假结束日期 */
  leaveEndDate: Date | null;
  
  // Legacy fields (keep for backward compatibility)
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

/** 津贴详情接口 */
export interface AllowanceDetail {
  /** 津贴金额 */
  allowance: number | null;
  /** 补偿金额 */
  compensation: number | null;
  /** 首月工资 */
  firstMonthSalary: number | null;
  /** 最后月工资 */
  lastMonthSalary: number | null;
  /** 其他月份工资 */
  otherMonthSalary: number | null;
  /** 总工资 */
  totalSalary: number | null;
}

/** 休假详情接口 */
export interface LeaveDetail {
  /** 休假开始日期 */
  leaveStartDate: string;
  /** 休假结束日期 */
  leaveEndDate: string;
  /** 当前休假天数 */
  currentLeaveDays: number;
}

/** 计算说明接口 */
export interface CalculateComments {
  /** 描述列表 */
  descriptionList: string[];
}

/** 计算结果接口 */
export interface CalculationResult {
  /** 津贴详情 */
  allowanceDetail: AllowanceDetail;
  /** 休假详情 */
  leaveDetail: LeaveDetail;
  /** 计算说明 */
  calculateComments: CalculateComments;
  
  // 兼容旧版字段
  /** @deprecated 使用 leaveDetail.currentLeaveDays */
  totalDays?: number;
  /** @deprecated 使用 calculateComments 替代 */
  baseDays?: number;
  /** @deprecated 使用 calculateComments 替代 */
  extraDays?: number;
  /** @deprecated 使用 leaveDetail.leaveStartDate */
  startDate?: Date;
  /** @deprecated 使用 leaveDetail.leaveEndDate */
  endDate?: Date;
  /** @deprecated 使用 calculateComments 替代 */
  region?: string;
  /** @deprecated 使用 calculateComments 替代 */
  policy?: string;
  /** @deprecated 使用 allowanceDetail 替代 */
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
  /** 是否使用了用户输入的平均薪资 */
  usedAverageSalary: boolean;
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
