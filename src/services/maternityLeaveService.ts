import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

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
      `${API_BASE_URL}/maternity-leave/calculateDate`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error calculating leave dates:', error);
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
      `${API_BASE_URL}/maternity-leave/calculateMoney`,
      requestData
    );
    return response.data;
  } catch (error) {
    console.error('Error calculating allowance:', error);
    throw error;
  }
};
