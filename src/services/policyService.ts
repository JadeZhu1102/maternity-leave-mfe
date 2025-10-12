import axios from 'axios';
import { getMockPolicyByCity } from './__mocks__/policyMockData';

// 定义政策数据类型
export interface StatutoryPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  maxLeaveDays: number;
  description?: string;
}

export interface DystociaPolicy {
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  standardLeaveDays: number;
  description?: string;
}

export interface MoreInfantPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  extraInfantLeaveDays: number;
  description?: string;
}

export interface AbortionPolicy {
  earlyPregnancyLeave: number;
  midTermPregnancyLeave: number;
  latePregnancyLeave: number;
  description?: string;
}

export interface PaternityLeavePolicy {
  leaveDays: number;
  description?: string;
}

export interface AllowancePolicy {
  calculationBase: 'social_security' | 'company_average_salary' | 'actual_salary';
  numerator: number;
  denominator: number;
  minDays: number;
  maxDays: number;
  description?: string;
}

export interface PolicyData {
  cityCode: string;
  cityName: string;
  statutoryPolicy: StatutoryPolicy;
  dystociaPolicy: DystociaPolicy;
  moreInfantPolicy: MoreInfantPolicy;
  abortionPolicy?: AbortionPolicy;
  paternityLeavePolicy?: PaternityLeavePolicy;
  allowancePolicy?: AllowancePolicy;
  effectiveDate: string; // YYYY-MM-DD
  expirationDate?: string; // YYYY-MM-DD
  lastUpdated: string; // ISO date string
}

const API_BASE_URL = 'http://localhost:8080/api/v1/policy';
const USE_MOCK = true; // 设置为true使用mock数据，false使用真实API

/**
 * 根据城市代码获取产假政策
 * @param cityCode 城市代码
 * @returns 产假政策数据
 */
export const fetchPolicyByCity = async (cityCode: string): Promise<PolicyData> => {
  if (USE_MOCK) {
    try {
      return await getMockPolicyByCity(cityCode);
    } catch (error) {
      console.error('Failed to fetch mock policy data:', error);
      throw new Error(`Mock data not available for city: ${cityCode}`);
    }
  }

  try {
    const response = await axios.get<PolicyData>(`${API_BASE_URL}/fetch`, {
      params: { cityCode }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch policy data from API, falling back to mock data:', error);
    
    // 如果API调用失败，尝试使用mock数据
    try {
      const mockData = await getMockPolicyByCity(cityCode);
      console.warn('Using mock data as fallback');
      return mockData;
    } catch (mockError) {
      console.error('Failed to load mock data:', mockError);
      throw new Error(`Failed to load policy data for city: ${cityCode}`);
    }
  }
};

/**
 * 获取所有城市政策
 * @returns 所有可用的城市政策数据
 */
export const getAllPolicies = async (): Promise<PolicyData[]> => {
  if (USE_MOCK) {
    try {
      const { getAllMockPolicies } = await import('./__mocks__/policyMockData');
      const mockPolicies = await getAllMockPolicies();
      // Convert Record<string, PolicyData> to PolicyData[]
      return Object.values(mockPolicies);
    } catch (error) {
      console.error('Failed to fetch mock policies:', error);
      throw new Error('Failed to load mock policies');
    }
  }

  try {
    const response = await axios.get<PolicyData[]>(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch policies from API, falling back to mock data:', error);
    
    try {
      const { getAllMockPolicies } = await import('./__mocks__/policyMockData');
      const mockPolicies = await getAllMockPolicies();
      console.warn('Using mock data as fallback');
      // Convert Record<string, PolicyData> to PolicyData[]
      return Object.values(mockPolicies);
    } catch (mockError) {
      console.error('Failed to load mock data:', mockError);
      throw new Error('Failed to load policies');
    }
  }
};
