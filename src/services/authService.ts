/**
 * 认证服务
 * Authentication Service
 */

import { User, LoginCredentials, AuthResponse } from '../types/auth';
import { MockDataService } from './mockData';

class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  /**
   * 用户登录
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await MockDataService.login(credentials);
      
      // 存储tokens
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
      
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '登录失败，请检查用户名和密码');
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      // 模拟数据服务不需要调用服务端登出
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.warn('登出处理:', error);
    } finally {
      this.clearTokens();
    }
  }

  /**
   * 刷新token
   */
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await MockDataService.refreshToken(refreshToken);
      
      // 更新token
      localStorage.setItem(this.TOKEN_KEY, response.token);
      
      // 获取用户信息（模拟完整的AuthResponse）
      const token = this.getToken();
      if (token) {
        const userId = this.getUserIdFromToken(token);
        const user = await MockDataService.getUserInfo(userId);
        return {
          user,
          token: response.token,
          refreshToken: refreshToken,
          expiresIn: 3600
        };
      }
      
      throw new Error('Token刷新失败');
    } catch (error) {
      // 刷新失败，清除所有tokens
      this.clearTokens();
      throw new Error('Token刷新失败，请重新登录');
    }
  }

  /**
   * 验证token有效性
   */
  async validateToken(token: string): Promise<User> {
    try {
      const userId = this.getUserIdFromToken(token);
      return await MockDataService.getUserInfo(userId);
    } catch (error) {
      throw new Error('Token验证失败');
    }
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('未登录');
      }
      const userId = this.getUserIdFromToken(token);
      return await MockDataService.getUserInfo(userId);
    } catch (error) {
      throw new Error('获取用户信息失败');
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(user: User, data: Partial<User>): Promise<User> {
    try {
      return await MockDataService.updateUser(user.id, data);
    } catch (error) {
      throw new Error('更新用户资料失败');
    }
  }

  /**
   * 修改密码
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> {
    try {
      // 模拟密码修改延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 在实际应用中，这里会调用API验证当前密码并更新新密码
      if (data.currentPassword !== 'password') {
        throw new Error('当前密码不正确');
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : '修改密码失败');
    }
  }

  /**
   * 获取当前token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * 清除所有tokens
   */
  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * 从token中提取用户ID（模拟实现）
   */
  private getUserIdFromToken(token: string): string {
    // 在实际应用中，这里会解析JWT token
    // 这里我们从模拟token中提取用户ID
    const parts = token.split('_');
    return parts.length > 2 ? parts[2] : '1'; // 默认返回用户ID 1
  }
}

export const authService = new AuthService();
