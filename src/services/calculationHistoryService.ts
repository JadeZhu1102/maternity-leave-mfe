/**
 * 计算历史API服务
 * Calculation History API Service
 */

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 假期详情接口
export interface LeaveDetail {
  leaveStartDate: string;
  leaveEndDate: string;
  currentLeaveDays: number;
  abortionLeaveDays: number;
  statutoryLeaveDays: number;
  dystociaLeaveDays: number;
  moreInfantLeaveDays: number;
  otherExtendedLeaveDays: number;
  totalLeaveDays: number;
}

// 津贴详情接口
export interface AllowanceDetail {
  allowance: number;
  compensation: number;
  firstMonthSalary: number;
  lastMonthSalary: number;
  otherMonthSalary: number;
  totalSalary: number;
}

// 计算说明接口
export interface CalculateComments {
  descriptionList: string[];
}

// 历史记录接口
export interface CalculationHistoryRecord {
  id: number;
  staffName: string;
  cityCode: string;
  leaveStartDate: string;
  leaveDetail: LeaveDetail;
  allowanceDetail: AllowanceDetail;
  calculateComments: CalculateComments;
  abortion: boolean;
}

// 查询参数接口
export interface HistoryQueryParams {
  staffName?: string;
  cityCode?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

// 保存历史记录请求接口
export interface SaveCalculationRequest {
  staffName: string;
  cityCode: string;
  leaveStartDate: string;
  leaveDetail: LeaveDetail;
  allowanceDetail: AllowanceDetail;
  calculateComments: CalculateComments;
  abortion?: boolean;
}

/**
 * 计算历史服务
 */
const calculationHistoryService = {
  /**
   * 保存计算历史记录
   */
  async saveCalculateHistory(data: SaveCalculationRequest): Promise<CalculationHistoryRecord> {
    try {
      const url = `${API_BASE_URL}/api/v1/maternity-leave/saveCalculateHistory`;
      console.log('[API] Saving calculation history to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API请求失败: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result: CalculationHistoryRecord = await response.json();
      console.log('[API] Save response:', result);

      return result;
    } catch (error) {
      console.error('[API] Error saving calculation history:', error);
      throw error;
    }
  },

  /**
   * 获取所有计算历史记录
   */
  async getCalculateHistory(params?: HistoryQueryParams): Promise<CalculationHistoryRecord[]> {
    try {
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (params?.staffName) queryParams.append('staffName', params.staffName);
      if (params?.cityCode) queryParams.append('cityCode', params.cityCode);
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString());

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/api/v1/maternity-leave/getCalculateHistory${queryString ? `?${queryString}` : ''}`;

      console.log('[API] Fetching calculation history from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API请求失败: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data: CalculationHistoryRecord[] = await response.json();
      console.log('[API] Response:', data);

      return data;
    } catch (error) {
      console.error('[API] Error fetching calculation history:', error);
      throw error;
    }
  },

  /**
   * 根据ID获取单条历史记录
   */
  async getCalculateHistoryById(id: number): Promise<CalculationHistoryRecord | null> {
    try {
      const url = `${API_BASE_URL}/api/v1/maternity-leave/getCalculateHistory/${id}`;
      console.log('[API] Fetching calculation history by ID from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorText = await response.text();
        throw new Error(`API请求失败: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data: CalculationHistoryRecord = await response.json();
      console.log('[API] Response:', data);

      return data;
    } catch (error) {
      console.error('[API] Error fetching calculation history by ID:', error);
      throw error;
    }
  },
};

export default calculationHistoryService;
