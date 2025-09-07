/**
 * 认证相关类型定义
 * Authentication Type Definitions
 */

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  roles: UserRole[];
  permissions: string[];
  department?: string;
  employeeId?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
}

// 权限常量
export const PERMISSIONS = {
  // 计算器权限
  CALCULATOR_USE: 'calculator:use',
  CALCULATOR_HISTORY_VIEW: 'calculator:history:view',
  
  // 政策管理权限
  POLICY_VIEW: 'policy:view',
  POLICY_CREATE: 'policy:create',
  POLICY_UPDATE: 'policy:update',
  POLICY_DELETE: 'policy:delete',
  
  // 公司设置权限
  COMPANY_VIEW: 'company:view',
  COMPANY_UPDATE: 'company:update',
  
  // 用户管理权限
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // 系统管理权限
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_LOGS: 'system:logs',
  
  // 数据分析权限
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
