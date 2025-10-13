/**
 * 模拟数据服务
 * Mock Data Service
 */

import { User, AuthResponse, LoginCredentials } from '../types/auth';
import { Calendar, CalendarDay, GenerateDefaultCalendarPayload, UpdateCalendarDayPayload } from '../types/calendar';
import { mockCalendars } from './__mocks__/calendarMockData';

// 模拟用户数据
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    name: '系统管理员',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=0ea5e9&color=fff',
    roles: ['SUPER_ADMIN'],
    permissions: [
      'calculator:use',
      'calculator:history:view',
      'policy:view',
      'policy:create',
      'policy:update',
      'policy:delete',
      'company:view',
      'company:update',
      'user:view',
      'user:create',
      'user:update',
      'user:delete',
      'system:config',
      'system:logs',
      'analytics:view',
      'analytics:export'
    ],
    department: 'IT部门',
    employeeId: 'EMP001',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T08:30:00Z'
  },
  {
    id: '2',
    username: 'hr_manager',
    email: 'hr@company.com',
    name: '人事经理',
    avatar: 'https://ui-avatars.com/api/?name=HR&background=ec4899&color=fff',
    roles: ['ADMIN'],
    permissions: [
      'calculator:use',
      'calculator:history:view',
      'policy:view',
      'policy:update',
      'company:view',
      'company:update',
      'user:view',
      'user:create',
      'user:update',
      'analytics:view'
    ],
    department: '人事部门',
    employeeId: 'EMP002',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-14T09:15:00Z'
  },
  {
    id: '3',
    username: 'employee',
    email: 'employee@company.com',
    name: '普通员工',
    avatar: 'https://ui-avatars.com/api/?name=User&background=10b981&color=fff',
    roles: ['USER'],
    permissions: [
      'calculator:use',
      'calculator:history:view'
    ],
    department: '业务部门',
    employeeId: 'EMP003',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-13T10:00:00Z'
  }
];

// 模拟城市政策数据
export interface CityPolicy {
  id: string;
  cityName: string;
  cityCode: string;
  basicMaternityLeave: number; // 基础产假天数
  difficultBirthExtension: number; // 难产延长天数
  multipleChildrenExtension: number; // 多胎延长天数
  lateMarriageExtension: number; // 晚婚延长天数
  paternalLeave: number; // 陪产假天数
  miscarriageLeave: number; // 流产假天数
  breastfeedingLeave: number; // 哺乳假天数
  effectiveDate: string;
  isActive: boolean;
  description?: string;
}

const mockCityPolicies: CityPolicy[] = [
  {
    id: '1',
    cityName: '北京市',
    cityCode: '110000',
    basicMaternityLeave: 98,
    difficultBirthExtension: 15,
    multipleChildrenExtension: 30,
    lateMarriageExtension: 0,
    paternalLeave: 15,
    miscarriageLeave: 15,
    breastfeedingLeave: 30,
    effectiveDate: '2023-01-01',
    isActive: true,
    description: '北京市生育保险政策'
  },
  {
    id: '2',
    cityName: '上海市',
    cityCode: '310000',
    basicMaternityLeave: 98,
    difficultBirthExtension: 15,
    multipleChildrenExtension: 30,
    lateMarriageExtension: 0,
    paternalLeave: 10,
    miscarriageLeave: 15,
    breastfeedingLeave: 30,
    effectiveDate: '2023-01-01',
    isActive: true,
    description: '上海市生育保险政策'
  },
  {
    id: '3',
    cityName: '广州市',
    cityCode: '440100',
    basicMaternityLeave: 98,
    difficultBirthExtension: 30,
    multipleChildrenExtension: 15,
    lateMarriageExtension: 15,
    paternalLeave: 15,
    miscarriageLeave: 15,
    breastfeedingLeave: 30,
    effectiveDate: '2023-01-01',
    isActive: true,
    description: '广州市生育保险政策'
  }
];

// 模拟计算历史数据
interface CalculationRecord {
  id: string;
  userId: string;
  userName: string;
  cityName: string;
  birthDate: string;
  isFirstChild: boolean;
  isDifficultBirth: boolean;
  isMultipleChildren: boolean;
  isLateMarriage: boolean;
  totalDays: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  status: 'draft' | 'confirmed' | 'approved';
}

const mockCalculationRecords: CalculationRecord[] = [
  {
    id: '1',
    userId: '3',
    userName: '普通员工',
    cityName: '北京市',
    birthDate: '2024-05-15',
    isFirstChild: true,
    isDifficultBirth: false,
    isMultipleChildren: false,
    isLateMarriage: true,
    totalDays: 128,
    startDate: '2024-05-01',
    endDate: '2024-09-06',
    createdAt: '2024-04-01T10:30:00Z',
    status: 'confirmed'
  },
  {
    id: '2',
    userId: '3',
    userName: '普通员工',
    cityName: '上海市',
    birthDate: '2024-06-20',
    isFirstChild: false,
    isDifficultBirth: true,
    isMultipleChildren: false,
    isLateMarriage: false,
    totalDays: 113,
    startDate: '2024-06-01',
    endDate: '2024-09-22',
    createdAt: '2024-05-15T14:20:00Z',
    status: 'draft'
  }
];

// 模拟公司设置数据
interface CompanySettings {
  id: string;
  companyName: string;
  companyCode: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  legalRepresentative: string;
  businessLicense: string;
  baseSalary: number;
  workingHoursPerDay: number;
  workingDaysPerWeek: number;
  socialInsuranceBase: number;
  housingFundBase: number;
  maternityInsuranceRate: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoApproval: boolean;
  approvalWorkflow: boolean;
  updatedAt: string;
}

const mockCompanySettings: CompanySettings = {
  id: '1',
  companyName: '示例科技有限公司',
  companyCode: 'DEMO001',
  address: '北京市朝阳区望京科技园A座1001',
  contactPhone: '010-12345678',
  contactEmail: 'hr@example.com',
  legalRepresentative: '张三',
  businessLicense: '123456789012345678',
  baseSalary: 10000,
  workingHoursPerDay: 8,
  workingDaysPerWeek: 5,
  socialInsuranceBase: 10000,
  housingFundBase: 10000,
  maternityInsuranceRate: 0.01,
  emailNotifications: true,
  smsNotifications: true,
  autoApproval: false,
  approvalWorkflow: true,
  updatedAt: '2024-01-01T00:00:00Z'
};

/**
 * 模拟数据服务类
 */
class MockDataService {
  private static token: string = '';
  private static mockCalendars = [...mockCalendars];

  // 认证相关
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay(500);
    const user = mockUsers.find(u => u.username === credentials.username && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Invalid username or password');
    }

    this.token = `mock-jwt-token-${Date.now()}`;
    
    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        roles: user.roles,
        permissions: user.permissions,
        department: user.department,
        employeeId: user.employeeId
      },
      token: this.token,
      refreshToken: `mock-refresh-token-${Date.now()}`,
      expiresIn: 3600
    };
  }

  static async refreshToken(refreshToken: string): Promise<{ token: string }> {
    await this.delay(300);
    return { token: `new-mock-jwt-token-${Date.now()}` };
  }

  static async getUserInfo(userId: string): Promise<User> {
    await this.delay(300);
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  }

  // 用户管理
  static async getUsers(): Promise<User[]> {
    await this.delay(500);
    return mockUsers.map(user => ({
      ...user,
      password: undefined
    }));
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    await this.delay(500);
    const newUser: User = {
      id: String(mockUsers.length + 1),
      username: userData.username || '',
      email: userData.email || '',
      name: userData.name || '',
      avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'U')}`,
      roles: userData.roles || ['USER'],
      permissions: userData.permissions || [],
      department: userData.department || '',
      employeeId: userData.employeeId || `EMP${String(mockUsers.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    return { ...newUser };
  }

  static async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    await this.delay(500);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData,
      updatedAt: new Date().toISOString()
    };
    
    mockUsers[userIndex] = updatedUser;
    return { ...updatedUser };
  }

  static async deleteUser(userId: string): Promise<void> {
    await this.delay(300);
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers.splice(userIndex, 1);
  }

  // 政策管理
  static async getCityPolicies(): Promise<CityPolicy[]> {
    await this.delay(500);
    return [...mockCityPolicies];
  }

  static async createCityPolicy(policyData: Omit<CityPolicy, 'id'>): Promise<CityPolicy> {
    await this.delay(500);
    const newPolicy: CityPolicy = {
      ...policyData,
      id: String(mockCityPolicies.length + 1)
    };
    
    mockCityPolicies.push(newPolicy);
    return { ...newPolicy };
  }

  static async updateCityPolicy(policyId: string, policyData: Partial<CityPolicy>): Promise<CityPolicy> {
    await this.delay(500);
    const policyIndex = mockCityPolicies.findIndex(p => p.id === policyId);
    
    if (policyIndex === -1) {
      throw new Error('Policy not found');
    }
    
    const updatedPolicy = {
      ...mockCityPolicies[policyIndex],
      ...policyData
    };
    
    mockCityPolicies[policyIndex] = updatedPolicy;
    return { ...updatedPolicy };
  }

  static async deleteCityPolicy(policyId: string): Promise<void> {
    await this.delay(300);
    const policyIndex = mockCityPolicies.findIndex(p => p.id === policyId);
    
    if (policyIndex === -1) {
      throw new Error('Policy not found');
    }
    
    mockCityPolicies.splice(policyIndex, 1);
  }

  // 计算历史
  static async getCalculationRecords(userId?: string): Promise<CalculationRecord[]> {
    await this.delay(500);
    if (userId) {
      return mockCalculationRecords.filter(record => record.userId === userId);
    }
    return [...mockCalculationRecords];
  }

  static async createCalculationRecord(recordData: Omit<CalculationRecord, 'id' | 'createdAt'>): Promise<CalculationRecord> {
    await this.delay(1000);
    const newRecord: CalculationRecord = {
      id: String(mockCalculationRecords.length + 1),
      ...recordData,
      createdAt: new Date().toISOString()
    };
    mockCalculationRecords.push(newRecord);
    return newRecord;
  }

  // 公司设置
  static async getCompanySettings(): Promise<CompanySettings> {
    await this.delay(500);
    return { ...mockCompanySettings };
  }

  static async updateCompanySettings(settingsData: Partial<CompanySettings>): Promise<CompanySettings> {
    await this.delay(500);
    const updatedSettings = { ...mockCompanySettings, ...settingsData, updatedAt: new Date().toISOString() };
    Object.assign(mockCompanySettings, updatedSettings);
    return updatedSettings;
  }

  // 日历相关方法
  static async getCalendars(): Promise<Calendar[]> {
    await MockDataService.delay(300);
    return [...mockCalendars];
  }

  static async getCalendarById(id: string): Promise<Calendar> {
    await MockDataService.delay(300);
    const calendar = mockCalendars.find(c => c.id === id);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    return { ...calendar };
  }

  static async createCalendar(calendarData: Omit<Calendar, 'id' | 'createdAt' | 'updatedAt'>): Promise<Calendar> {
    await MockDataService.delay(500);
    const newCalendar: Calendar = {
      ...calendarData,
      id: `cal_${Date.now()}`,
      months: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockCalendars.push(newCalendar);
    return { ...newCalendar };
  }

  static async updateCalendar(calendarId: string, calendarData: Partial<Calendar>): Promise<Calendar> {
    await MockDataService.delay(500);
    const index = mockCalendars.findIndex(c => c.id === calendarId);
    if (index === -1) {
      throw new Error('Calendar not found');
    }
    
    const updatedCalendar = {
      ...mockCalendars[index],
      ...calendarData,
      updatedAt: new Date().toISOString()
    };
    
    mockCalendars[index] = updatedCalendar;
    return { ...updatedCalendar };
  }

  static async deleteCalendar(calendarId: string): Promise<void> {
    await MockDataService.delay(300);
    const index = mockCalendars.findIndex(c => c.id === calendarId);
    if (index === -1) {
      throw new Error('Calendar not found');
    }
    mockCalendars.splice(index, 1);
  }

  static async getCalendarDays(calendarId: string, year: number, month: number): Promise<CalendarDay[]> {
    await MockDataService.delay(300);
    const calendar = mockCalendars.find(c => c.id === calendarId);
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    const monthData = calendar.months.find(m => m.year === year && m.month === month);
    return monthData ? [...monthData.days] : [];
  }

  static async updateCalendarDay(updateData: UpdateCalendarDayPayload): Promise<Calendar> {
    await MockDataService.delay(500);
    const { calendarId, date, ...updates } = updateData;
    const calendar = mockCalendars.find(c => c.id === calendarId);
    
    if (!calendar) {
      throw new Error('Calendar not found');
    }
    
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    
    let monthData = calendar.months.find(m => m.year === year && m.month === month);
    
    if (!monthData) {
      monthData = {
        year,
        month,
        days: []
      };
      calendar.months.push(monthData);
    }
    
    const dayIndex = monthData.days.findIndex(d => d.date === date);
    if (dayIndex !== -1) {
      monthData.days[dayIndex] = {
        ...monthData.days[dayIndex],
        ...updates
      };
    } else {
      monthData.days.push({
        date,
        isWorkingDay: true,
        isHoliday: false,
        ...updates
      });
      
      monthData.days.sort((a, b) => a.date.localeCompare(b.date));
    }
    
    calendar.updatedAt = new Date().toISOString();
    return { ...calendar };
  }

  static async generateDefaultCalendar(payload: GenerateDefaultCalendarPayload): Promise<Calendar> {
    await MockDataService.delay(1000);
    
    const newCalendar: Calendar = {
      id: `cal_${Date.now()}`,
      name: `${payload.year}年${payload.region ? payload.region + ' ' : ''}工作日历`,
      year: payload.year,
      description: `自动生成的${payload.year}年${payload.region ? payload.region + ' ' : ''}工作日历`,
      isDefault: false,
      months: Array.from({ length: 12 }, (_, i) => ({
        year: payload.year,
        month: i + 1,
        days: []
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockCalendars.push(newCalendar);
    return { ...newCalendar };
  }

  // 仪表盘统计数据
  static async getDashboardStats() {
    await MockDataService.delay(500);
    return {
      totalUsers: mockUsers.length,
      totalCalculations: mockCalculationRecords.length,
      thisMonthCalculations: mockCalculationRecords.filter(
        r => new Date(r.createdAt).getMonth() === new Date().getMonth()
      ).length,
      activePolicies: mockCityPolicies.filter(p => p.isActive).length
    };
  }

  // 工具方法：模拟网络延迟
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MockDataService;
