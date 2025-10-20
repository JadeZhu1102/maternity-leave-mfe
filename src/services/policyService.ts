import axios from 'axios';
import { getMockPolicyByCity } from './__mocks__/policyMockData';

// 定义政策数据类型
export interface StatutoryPolicy {
  leaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  
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
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
  /** 后端返回的规则列表 */
  abortionRules?: PolicyRuleItem[];
  description?: string;
}

export interface OtherExtendedPolicy {
  standardLeaveDays: number;
  delayForPublicHoliday: boolean;
  calendarDay: boolean;
}

// 规则项（来自后端返回）
export interface PolicyRuleItem {
  /** 规则命中时假期天数, 如为可变值则此值可能为空 */
  leaveDays?: number | null;
  /** 规则代码，唯一标识（UUID） */
  ruleCode: string;
  /** 规则描述 */
  description: string;
  /** 可变天数的最小值 */
  minLeaveDays?: number | null;
  /** 可变天数的最大值 */
  maxLeaveDays?: number | null;
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
  otherExtendedPolicy?: OtherExtendedPolicy;
  paternityLeavePolicy?: PaternityLeavePolicy;
  allowancePolicy?: AllowancePolicy;
  /** 难产规则集合 */
  dystociaRules?: PolicyRuleItem[];
  /** 其他延长规则集合 */
  otherExtendedRules?: PolicyRuleItem[];
  /** 流产规则集合 */
  abortionRules?: PolicyRuleItem[];
  maxLeaveDays: number;
  effectiveDate: string; // YYYY-MM-DD
  expirationDate?: string; // YYYY-MM-DD
  lastUpdated: string; // ISO date string
}

// API配置 - 使用相对路径，通过Vite代理访问
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const USE_MOCK = false; // 设置为true使用mock数据，false使用真实API

/**
 * 根据城市代码获取产假政策
 * @param cityCode 城市代码
 * @returns 产假政策数据
 */
export const fetchPolicyByCity = async (cityCode: string): Promise<PolicyData> => {
  // Mock数据已注释，使用真实API
  // if (USE_MOCK) {
  //   try {
  //     return await getMockPolicyByCity(cityCode);
  //   } catch (error) {
  //     console.error('Failed to fetch mock policy data:', error);
  //     throw new Error(`Mock data not available for city: ${cityCode}`);
  //   }
  // }

  try {
    const response = await axios.get<PolicyData>(`${API_BASE_URL}/api/v1/policy/fetch`, {
      params: { cityCode }
    });
    // Normalize abortionRules to top-level if backend nests it under abortionPolicy
    const d: any = response.data as any;
    const normalized: PolicyData = {
      ...response.data,
      abortionRules: (d?.abortionRules && Array.isArray(d.abortionRules))
        ? d.abortionRules
        : (d?.abortionPolicy?.abortionRules && Array.isArray(d.abortionPolicy.abortionRules))
          ? d.abortionPolicy.abortionRules
          : [],
    };
    console.log('[API] Fetched policy for city (normalized):', cityCode, normalized);
    return normalized;
  } catch (error) {
    console.error('Failed to fetch policy data from API:', error);
    
    // 如果API调用失败，尝试使用mock数据作为降级方案
    // try {
    //   const mockData = await getMockPolicyByCity(cityCode);
    //   console.warn('Using mock data as fallback');
    //   return mockData;
    // } catch (mockError) {
    //   console.error('Failed to load mock data:', mockError);
    //   throw new Error(`Failed to load policy data for city: ${cityCode}`);
    // }
    throw new Error(`Failed to load policy data for city: ${cityCode}`);
  }
};

/**
 * 获取所有城市政策
 * @returns 所有可用的城市政策数据
 */
export const getAllPolicies = async (): Promise<PolicyData[]> => {
  // Mock数据已注释，使用真实API
  // if (USE_MOCK) {
  //   try {
  //     const { getAllMockPolicies } = await import('./__mocks__/policyMockData');
  //     const mockPolicies = await getAllMockPolicies();
  //     // Convert Record<string, PolicyData> to PolicyData[]
  //     return Object.values(mockPolicies);
  //   } catch (error) {
  //     console.error('Failed to fetch mock policies:', error);
  //     throw new Error('Failed to load mock policies');
  //   }
  // }

  try {
    const response = await axios.get<PolicyData[]>(`${API_BASE_URL}/api/v1/policy/getAllPolicy`);
    console.log('[API] Fetched all policies:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch policies from API:', error);
    
    // 如果API调用失败，尝试使用mock数据作为降级方案
    // try {
    //   const { getAllMockPolicies } = await import('./__mocks__/policyMockData');
    //   const mockPolicies = await getAllMockPolicies();
    //   console.warn('Using mock data as fallback');
    //   // Convert Record<string, PolicyData> to PolicyData[]
    //   return Object.values(mockPolicies);
    // } catch (mockError) {
    //   console.error('Failed to load mock data:', mockError);
    //   throw new Error('Failed to load policies');
    // }
    throw new Error('Failed to load policies');
  }
};

/**
 * 删除政策
 * @param id 政策ID (numeric)
 */
export const deletePolicy = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/api/v1/policy/delete/${id}`);
    console.log(`[API] Deleted policy with ID: ${id}`);
  } catch (error) {
    console.error('Failed to delete policy:', error);
    throw new Error(`Failed to delete policy with ID: ${id}`);
  }
};
