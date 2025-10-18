/**
 * 仪表盘页面 - OCBC 主题优化版
 * Dashboard Page - OCBC Theme Optimized
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MockDataService } from '../services/mockData';
import {
  CalculatorIcon,
  DocumentTextIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowRightIcon,
  CalendarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface DashboardStats {
  totalUsers: number;
  totalCalculations: number;
  thisMonthCalculations: number;
  activePolicies: number;
}


export function Dashboard() {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  const OCBC_RED = '#E21833';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardStats = await MockDataService.getDashboardStats();
        setStats(dashboardStats);
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
      name: '总计算量',
      value: stats?.totalCalculations || 0,
      icon: CalculatorIcon,
      description: '累计计算次数',
      href: '/history'
    },
    {
      name: '本月计算',
      value: stats?.thisMonthCalculations || 0,
      icon: SparklesIcon,
      description: '本月新增计算',
      href: '/history?filter=this-month'
    },
    {
      name: '活跃政策',
      value: stats?.activePolicies || 0,
      icon: DocumentTextIcon,
      description: '可用城市政策',
      href: '/admin/policies',
      adminOnly: true
    },
    {
      name: '系统用户',
      value: stats?.totalUsers || 0,
      icon: UsersIcon,
      description: '注册用户总数',
      href: '/admin/users',
      adminOnly: true
    }
  ];

  const quickActionsList = [
    {
      name: '产假计算',
      description: '智能计算产假天数和补贴',
      href: '/calculator',
      icon: CalculatorIcon,
      gradient: 'from-red-500 to-pink-500',
    },
    {
      name: '政策对比',
      description: '对比不同城市产假政策',
      href: '/policy-comparison',
      icon: ChartBarIcon,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: '计算历史',
      description: '查看历史计算记录',
      href: '/history',
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      name: '政策管理',
      description: '管理城市产假政策',
      href: '/admin/policies',
      icon: DocumentTextIcon,
      gradient: 'from-green-500 to-emerald-500',
      adminOnly: true,
    },
    {
      name: '用户管理',
      description: '管理系统用户权限',
      href: '/admin/users',
      icon: UsersIcon,
      gradient: 'from-orange-500 to-amber-500',
      adminOnly: true,
    },
    {
      name: '日历设置',
      description: '管理工作日历和假期',
      href: '/admin/calendar',
      icon: CalendarIcon,
      gradient: 'from-teal-500 to-green-500',
      adminOnly: true,
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-32 animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-40 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            你好，{user?.name || '用户'} 👋
          </h1>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards
            .filter(stat => !stat.adminOnly || isAdmin)
            .map((stat) => (
              <Link
                key={stat.name}
                to={stat.href}
                className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-red-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${OCBC_RED}10` }}
                  >
                    <stat.icon className="h-6 w-6" style={{ color: OCBC_RED }} />
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mb-0.5">
                    {stat.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stat.description}
                  </p>
                </div>
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: OCBC_RED }}
                />
              </Link>
            ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            快速操作
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActionsList
              .filter((action) => !action.adminOnly || isAdmin)
              .map((action) => (
                <Link
                  key={action.name}
                  to={action.href}
                  className="group relative bg-white rounded-xl border border-gray-200 p-6 hover:border-transparent hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-br ${action.gradient} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <ArrowRightIcon 
                        className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" 
                      />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
