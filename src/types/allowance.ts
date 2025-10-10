/**
 * 生育津贴计算结果
 * Maternity Allowance Calculation Result
 */

export interface AllowanceCalculationResult {
  /** 津贴详情 */
  allowanceDetail: {
    /** 津贴金额 */
    allowance: number | null;
    /** 补偿金额 */
    compensation: number | null;
    /** 首月工资 */
    firstMonthSalary: number;
    /** 最后一个月工资 */
    lastMonthSalary: number;
    /** 其他月份工资 */
    otherMonthSalary: number;
    /** 总工资 */
    totalSalary: number | null;
  };
  
  /** 休假详情 */
  leaveDetail: {
    /** 休假开始日期 */
    leaveStartDate: string | null;
    /** 休假结束日期 */
    leaveEndDate: string | null;
    /** 当前休假天数 */
    currentLeaveDays: number;
  };
  
  /** 计算说明 */
  calculateComments: {
    /** 描述列表 */
    descriptionList: string[];
  };
}
