/**
 * 仪表盘页面 - 主题化版本
 * Dashboard Page Component - Themed Version
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MockDataService } from '../services/mockData';
import {
  CalculatorIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface StatCard {
  name: string;
  value: number;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  href: string;
  adminOnly?: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalCalculations: number;
  thisMonthCalculations: number;
  activePolicies: number;
}

interface RecentCalculation {
  id: string;
  userName: string;
  cityName: string;
  totalDays: number;
  createdAt: string;
}

export function Dashboard() {
  const { user, hasRole } = useAuth();
  const { theme, currentTheme } = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCalculations, setRecentCalculations] = useState<RecentCalculation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Safe theme color access with fallbacks
  const getThemeColor = (colorPath: string, fallback = '#000000') => {
    if (!theme?.colors) return fallback;
    const path = colorPath.split('.');
    let value: any = theme;
    for (const key of path) {
      value = value?.[key];
      if (value === undefined) return fallback;
    }
    return value || fallback;
  };

  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  const themeColor = getThemeColor('colors.primary', '#3b82f6');

  // Quick actions for the dashboard


  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await MockDataService.getDashboardStats();
        const calculations = await MockDataService.getCalculationRecords();
        
        setStats(dashboardStats);
        // 转换数据格式以匹配界面需求
        const recentCalcs = calculations.slice(0, 5).map(calc => ({
          id: calc.id,
          userName: calc.userName,
          cityName: calc.cityName,
          totalDays: calc.totalDays,
          createdAt: calc.createdAt
        }));
        setRecentCalculations(recentCalcs);
      } catch (error) {
        console.error('加载仪表盘数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const statCards = [
    {
      name: '总用户数',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/users',
      adminOnly: true
    },
    {
      name: '总计算量',
      value: stats?.totalCalculations || 0,
      icon: CalculatorIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/history'
    },
    {
      name: '本月计算',
      value: stats?.thisMonthCalculations || 0,
      icon: DocumentTextIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      href: '/history?filter=this-month'
    },
    {
      name: '活跃政策',
      value: stats?.activePolicies || 0,
      icon: DocumentTextIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      href: '/admin/policies',
      adminOnly: true
    }
  ];

  const quickActionsList = [
    {
      name: '产假计算',
      description: '快速计算产假天数',
      href: '/calculator',
      icon: CalculatorIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: '查看历史',
      description: '查看计算历史记录',
      href: '/history',
      icon: DocumentTextIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: '政策管理',
      description: '管理城市产假政策',
      href: '/admin/policies',
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      adminOnly: true,
    },
    {
      name: '用户管理',
      description: '管理系统用户',
      href: '/admin/users',
      icon: UsersIcon,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      adminOnly: true,
    },
    {
      name: '公司设置',
      description: '管理系统基本设置',
      href: '/admin/company',
      icon: Cog6ToothIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      adminOnly: true,
    }
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="tile h-32 animate-pulse bg-gray-100"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 tile h-96 animate-pulse bg-gray-100"></div>
          <div className="tile h-96 animate-pulse bg-gray-100"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              欢迎回来, {user?.name || '用户'}
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              今天是 {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <span className="w-2 h-2 mr-2 rounded-full bg-blue-500"></span>
              当前主题: {theme?.name || '默认'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards
            .filter(stat => !stat.adminOnly || isAdmin)
            .map((stat) => (
              <Link
                key={stat.name}
                to={stat.href}
                className="tile hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center p-5">
                  <div 
                    className="p-3 rounded-lg mr-4 transition-colors duration-200 group-hover:bg-opacity-30"
                    style={{ 
                      backgroundColor: `${themeColor}15`,
                      color: themeColor
                    }}
                  >
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors">
                      {stat.name}
                    </p>
                    <p className="text-xl font-semibold mt-1 text-gray-900 group-hover:text-blue-700 transition-colors">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                快速操作
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActionsList
                .filter((action) => !action.adminOnly || isAdmin)
                .map((action) => (
                  <Link
                    key={action.name}
                    to={action.href}
                    className="tile group hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-5">
                      <div className="flex items-start">
                        <div 
                          className="p-2.5 rounded-lg mr-4"
                          style={{ 
                            backgroundColor: `${themeColor}08`,
                            color: themeColor
                          }}
                        >
                          <action.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                            {action.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {action.description}
                          </p>
                        </div>
                        <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRightIcon className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                最近计算
              </h2>
              <Link 
                to="/history" 
                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
              >
                查看全部
              </Link>
            </div>
            <div className="tile">
              {recentCalculations.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentCalculations.map((calc) => (
                    <div key={calc.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                          <DocumentTextIcon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {calc.userName}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <span>{calc.cityName}</span>
                            <span className="mx-2">·</span>
                            <span>{calc.totalDays}天</span>
                          </div>
                        </div>
                        <div className="ml-4 text-sm text-gray-400">
                          {new Date(calc.createdAt).toLocaleDateString('zh-CN', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium">暂无计算记录</h3>
                  <p className="mt-1 text-sm">开始使用产假计算器来创建记录</p>
                  <div className="mt-6">
                    <Link
                      to="/calculator"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      开始计算
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
