import axios from 'axios';

// API配置 - 使用相对路径，通过Vite代理访问
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface DateCalculateRequest {
  staffName: string;
  childBirthdate: string; // yyyyMMdd
  infantNumber: number;
  deliverySequence: number;
  abortion: boolean;
  dystocia: boolean;
  cityName: string;
  companyName: string;
  leaveStartDate: string; // yyyy-MM-dd
  calendarCode: string;
  regnancyDays: number;
  ectopicPregnancy: boolean;
  recommendAbortionLeaveDays: number;
  dystociaCodeList: string[];
}

export interface AllowanceCalculateRequest extends Omit<DateCalculateRequest, 'leaveStartDate'> {
  leaveStartDate: string; // yyyy-MM-dd
  leaveEndDate: string;   // yyyy-MM-dd
  averageSalary: number | null;
  currentSalary: number | null;
  hitForceCompensationRule: boolean;
}

export interface CalculateResponse {
  allowanceDetail: {
    allowance: number | null;
    compensation: number | null;
    firstMonthSalary: number | null;
    lastMonthSalary: number | null;
    otherMonthSalary: number | null;
    totalSalary: number | null;
  };
  leaveDetail: {
    leaveStartDate: string;
    leaveEndDate: string;
    currentLeaveDays: number;
  };
  calculateComments: {
    descriptionList: string[];
  };
}

export const calculateLeaveDates = async (data: DateCalculateRequest): Promise<CalculateResponse> => {
  try {
    const response = await axios.post<CalculateResponse>(
      `${API_BASE_URL}/api/v1/maternity-leave/calculateDate`,
      data
    );
    console.log('[API] Calculate leave dates response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error calculating leave dates:', error);
    throw error;
  }
};

export const calculateAllowance = async (data: AllowanceCalculateRequest): Promise<CalculateResponse> => {
  try {
    // 过滤掉为null的薪资字段
    const requestData = {
      ...data,
      averageSalary: data.averageSalary || 0,
      currentSalary: data.currentSalary || 0,
    };

    const response = await axios.post<CalculateResponse>(
      `${API_BASE_URL}/api/v1/maternity-leave/calculateMoney`,
      requestData
    );
    console.log('[API] Calculate allowance response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[API] Error calculating allowance:', error);
    throw error;
  }
};
