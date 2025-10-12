import { PolicyData } from '../policyService';

// Mock data for different cities
export const mockPolicies: Record<string, PolicyData> = {
  'shanghai': {
    cityCode: 'shanghai',
    cityName: '上海',
    statutoryPolicy: {
      leaveDays: 98,
      delayForPublicHoliday: false,
      calendarDay: true,
      maxLeaveDays: 180,
      description: '上海市女职工生育享受98天产假，其中产前可以休假15天',
    },
    dystociaPolicy: {
      delayForPublicHoliday: false,
      calendarDay: true,
      standardLeaveDays: 15,
      description: '难产的，增加产假15天',
    },
    moreInfantPolicy: {
      leaveDays: 15,
      delayForPublicHoliday: false,
      calendarDay: true,
      extraInfantLeaveDays: 15,
      description: '生育多胞胎的，每多生育1个婴儿，增加产假15天',
    },
    abortionPolicy: {
      earlyPregnancyLeave: 15,
      midTermPregnancyLeave: 30,
      latePregnancyLeave: 42,
      description: '女职工怀孕未满4个月流产的，享受15天产假；怀孕满4个月流产的，享受42天产假',
    },
    paternityLeavePolicy: {
      leaveDays: 10,
      description: '符合法律法规规定生育的夫妻，男方享受配偶陪产假10天',
    },
    allowancePolicy: {
      calculationBase: 'company_average_salary',
      numerator: 1,
      denominator: 30,
      minDays: 98,
      maxDays: 180,
      description: '生育津贴按照职工所在用人单位上年度职工月平均工资计发',
    },
    effectiveDate: '2023-01-01',
    expirationDate: '2025-12-31',
    lastUpdated: '2023-01-15T10:30:00Z',
  },
  'beijing': {
    cityCode: 'beijing',
    cityName: '北京',
    statutoryPolicy: {
      leaveDays: 98,
      delayForPublicHoliday: true,
      calendarDay: true,
      maxLeaveDays: 180,
      description: '北京市女职工生育享受98天产假，遇法定节假日顺延',
    },
    dystociaPolicy: {
      delayForPublicHoliday: true,
      calendarDay: true,
      standardLeaveDays: 15,
      description: '难产的，增加产假15天',
    },
    moreInfantPolicy: {
      leaveDays: 15,
      delayForPublicHoliday: true,
      calendarDay: true,
      extraInfantLeaveDays: 15,
      description: '生育多胞胎的，每多生育1个婴儿，增加产假15天',
    },
    allowancePolicy: {
      calculationBase: 'social_security',
      numerator: 1,
      denominator: 30,
      minDays: 98,
      maxDays: 180,
      description: '生育津贴按照职工所在用人单位上年度职工月平均工资计发',
    },
    effectiveDate: '2023-01-01',
    expirationDate: '2025-12-31',
    lastUpdated: '2023-01-10T09:15:00Z',
  },
  'guangzhou': {
    cityCode: 'guangzhou',
    cityName: '广州',
    statutoryPolicy: {
      leaveDays: 98,
      delayForPublicHoliday: true,
      calendarDay: true,
      maxLeaveDays: 178,
      description: '广东省女职工生育享受98天产假，符合法律法规规定生育子女的夫妻，女方享受八十日的奖励假',
    },
    dystociaPolicy: {
      delayForPublicHoliday: true,
      calendarDay: true,
      standardLeaveDays: 15,
      description: '难产的，增加产假15天',
    },
    moreInfantPolicy: {
      leaveDays: 15,
      delayForPublicHoliday: true,
      calendarDay: true,
      extraInfantLeaveDays: 15,
      description: '生育多胞胎的，每多生育1个婴儿，增加产假15天',
    },
    paternityLeavePolicy: {
      leaveDays: 15,
      description: '符合法律法规规定生育的夫妻，男方享受十五日的陪产假',
    },
    allowancePolicy: {
      calculationBase: 'social_security',
      numerator: 1,
      denominator: 30,
      minDays: 98,
      maxDays: 178,
      description: '生育津贴按照职工所在用人单位上年度职工月平均工资计发',
    },
    effectiveDate: '2023-01-01',
    expirationDate: '2025-12-31',
    lastUpdated: '2023-01-05T14:20:00Z',
  },
};

// Get mock policy by city code
export const getMockPolicyByCity = (cityCode: string): Promise<PolicyData> => {
  return new Promise((resolve, reject) => {
    const policy = mockPolicies[cityCode.toLowerCase()];
    if (policy) {
      // Simulate network delay
      setTimeout(() => resolve(policy), 300);
    } else {
      reject(new Error(`No policy found for city code: ${cityCode}`));
    }
  });
};

// Get all mock policies
export const getAllMockPolicies = (): Promise<Record<string, PolicyData>> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => resolve(mockPolicies), 500);
  });
};
