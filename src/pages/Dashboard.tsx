/**
 * 仪表盘页面 - 主题化版本
 * Dashboard Page Component - Themed Version
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { MockDataService } from '../services/mockData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  CalculatorIcon,
  ClockIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

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

  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');

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

  const getThemeIcon = () => {
    const icons = {
      fresh: '🌱',
      modern: '💼',
      tech: '⚡',
      warm: '🌸'
    };
    return icons[currentTheme];
  };

  const statCards = [
    {
      name: '总用户数',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: '总计算次数',
      value: stats?.totalCalculations || 0,
      icon: CalculatorIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: '本月计算',
      value: stats?.thisMonthCalculations || 0,
      icon: ChartBarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: '活跃政策',
      value: stats?.activePolicies || 0,
      icon: DocumentTextIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const quickActions = [
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
      icon: ClockIcon,
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
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      adminOnly: true,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="加载仪表盘数据..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* 主题装饰元素 */}
      <div className="theme-decoration theme-decoration-1" />
      <div className="theme-decoration theme-decoration-2" />
      <div className="theme-decoration theme-decoration-3" />
      
      <div className="space-y-6 theme-animate-fade-in">
        {/* 欢迎信息 */}
        <div className="theme-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-2xl font-bold mb-2"
                style={{ color: 'var(--color-text)' }}
              >
                {getThemeIcon()} 欢迎回来，{user?.name}！
              </h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                今天是 {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
            <div 
              className="text-6xl opacity-20"
              style={{ color: 'var(--color-primary)' }}
            >
              {getThemeIcon()}
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        {isAdmin && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.name} className="theme-stat-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="p-3 rounded-md"
                      style={{ 
                        backgroundColor: `${theme.colors.primary}20`,
                        color: theme.colors.primary
                      }}
                    >
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt 
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {stat.name}
                      </dt>
                      <dd 
                        className="text-lg font-medium"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {stat.value.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 快速操作 */}
        <div className="theme-card p-6 mb-8">
          <h2 
            className="text-lg font-medium mb-6"
            style={{ color: 'var(--color-text)' }}
          >
            快速操作
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions
              .filter(action => !action.adminOnly || isAdmin)
              .map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="group relative rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  style={{ 
                    backgroundColor: `${theme.colors.primary}08`,
                    border: `1px solid ${theme.colors.border}`,
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div>
                    <span 
                      className="rounded-xl inline-flex p-3 ring-4 ring-white shadow-lg"
                      style={{ 
                        backgroundColor: `${theme.colors.primary}15`,
                        color: theme.colors.primary
                      }}
                    >
                      <action.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="mt-6">
                    <h3 
                      className="text-lg font-semibold"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {action.name}
                    </h3>
                    <p 
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {action.description}
                    </p>
                  </div>
                  <span
                    className="pointer-events-none absolute top-6 right-6 group-hover:scale-110 transition-transform duration-200"
                    aria-hidden="true"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <ArrowRightIcon className="h-5 w-5" />
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* 最近计算记录 */}
        <div className="theme-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-lg font-medium"
              style={{ color: 'var(--color-text)' }}
            >
              最近计算记录
            </h2>
            <Link
              to="/history"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              查看全部
            </Link>
          </div>
          
          {recentCalculations.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <div className="theme-table min-w-full">
                <table className="w-full table-auto">
                  <thead>
                    <tr>
                      <th className="theme-table th text-left px-4 py-3 min-w-[100px]">用户姓名</th>
                      <th className="theme-table th text-left px-4 py-3 min-w-[100px]">所在城市</th>
                      <th className="theme-table th text-left px-4 py-3 min-w-[100px]">计算天数</th>
                      <th className="theme-table th text-left px-4 py-3 min-w-[120px]">计算时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCalculations.map((calculation) => (
                      <tr key={calculation.id} className="border-b border-opacity-20" style={{ borderColor: 'var(--color-border)' }}>
                        <td className="theme-table td px-4 py-3 whitespace-nowrap">{calculation.userName}</td>
                        <td className="theme-table td px-4 py-3 whitespace-nowrap">{calculation.cityName}</td>
                        <td className="theme-table td px-4 py-3 whitespace-nowrap">{calculation.totalDays} 天</td>
                        <td className="theme-table td px-4 py-3 whitespace-nowrap">
                          {new Date(calculation.createdAt).toLocaleDateString('zh-CN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div 
              className="text-center py-8"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <ClockIcon className="mx-auto h-12 w-12 opacity-50" />
              <h3 className="mt-2 text-sm font-medium">暂无计算记录</h3>
              <p className="mt-1 text-sm">开始使用产假计算器来创建记录</p>
              <div className="mt-6">
                <Link
                  to="/calculator"
                  className="theme-button"
                >
                  开始计算
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
