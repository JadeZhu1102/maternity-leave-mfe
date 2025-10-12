import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface PolicyData {
  id: number;
  cityCode: string;
  statutoryPolicy: {
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
    leaveDays: number;
  };
  dystociaPolicy: {
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
    standardLeaveDays: number;
    dystociaRules: any;
  };
  moreInfantPolicy: {
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
    extraInfantLeaveDays: number;
  };
  otherExtendedPolicy: {
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
    standardLeaveDays: number;
    otherExtendedRules: any;
  };
  abortionPolicy: {
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
    abortionRules: Array<{
      leaveDays: number;
      ruleCode: string;
      description: string;
      minLeaveDays: number | null;
      maxLeaveDays: number | null;
    }>;
  };
  allowancePolicy: {
    corpSalaryDetailList: Array<{
      companyName: string;
      corpAverageSalary: number;
    }>;
    numerator: number;
    denominator: number;
    allowanceDaysRule: string[];
    targetAccountType: string;
    differenceCompensationRule: {
      ruleDescription: string;
      forceCompensation: string;
      otherCompensationRuleDesc: string[];
    };
    govAllowance: number;
  };
  maxLeaveDays: number | null;
}

export const fetchPolicyByCity = async (cityCode: string): Promise<PolicyData> => {
  try {
    const response = await axios.get<PolicyData>(`${API_BASE_URL}/policy/fetch?cityCode=${cityCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching policy:', error);
    throw error;
  }
};
