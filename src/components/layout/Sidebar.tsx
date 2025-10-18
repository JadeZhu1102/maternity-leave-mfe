/**
 * 侧边栏组件 - 主题化版本
 * Sidebar Component - Themed Version
 */

import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  HomeIcon,
  CalculatorIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarIcon,
  XMarkIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
  description?: string;
}

const navigation: NavigationItem[] = [
  { 
    name: '仪表盘', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: '查看系统概览和统计信息'
  },
  { 
    name: '产假计算', 
    href: '/calculator', 
    icon: CalculatorIcon,
    description: '智能计算产假天数和补贴'
  },
  { 
    name: '政策对比', 
    href: '/policy-comparison', 
    icon: ChartBarIcon,
    description: '对比不同城市产假政策'
  },
  { 
    name: '计算历史', 
    href: '/history', 
    icon: ClockIcon,
    description: '查看历史计算记录'
  },
  { 
    name: '政策管理', 
    href: '/admin/policies', 
    icon: DocumentTextIcon, 
    adminOnly: true,
    description: '管理城市产假政策'
  },
  { 
    name: '用户管理', 
    href: '/admin/users', 
    icon: UsersIcon, 
    adminOnly: true,
    description: '管理系统用户权限'
  },
  { 
    name: '日历设置', 
    href: '/admin/calendar', 
    icon: CalendarIcon, 
    adminOnly: true,
    description: '管理工作日历和假期设置'
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, hasRole } = useAuth();
  const { currentTheme } = useTheme();
  const location = useLocation();

  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');

  // 过滤导航项
  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || isAdmin
  );

  const getThemeIcon = () => {
    const icons: Record<string, string> = {
      fresh: '🌱',
      modern: '💼',
      tech: '⚡',
      warm: '🌸',
      ocbc: '🏦'
    };
    return icons[currentTheme] || '🏦';
  };

  return (
    <>
      {/* 桌面端侧边栏 - 支持显示/隐藏切换 */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col transition-transform duration-300 ${isOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}>
        <div className="theme-sidebar flex grow flex-col overflow-y-auto">
          {/* Logo 区域 - 只保留主题图标 */}
          <div className="flex h-16 shrink-0 items-center justify-center px-6 border-b" style={{ borderColor: 'var(--color-divider)' }}>
            <div 
              className="flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {getThemeIcon()}
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex flex-1 flex-col px-6 py-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={`theme-nav-item group relative ${
                        isActive ? 'active' : ''
                      }`}
                      title={item.description}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div 
                            className="text-xs mt-0.5"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {item.description}
                          </div>
                        )}
                      </div>
                      {isActive && (
                        <div 
                          className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 rounded-l-full"
                          style={{ background: 'var(--gradient-primary)' }}
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 用户信息区域 */}
          <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--color-divider)' }}>
            <div className="theme-card p-3">
              <div className="flex items-center gap-x-3">
                <div 
                  className="h-10 w-10 rounded-full flex items-center justify-center font-semibold"
                  style={{ 
                    background: 'var(--gradient-primary)', 
                    color: 'var(--color-text-inverse)' 
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {user?.name || '用户'}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      {isOpen && (
        <div className="relative z-50 lg:hidden">
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 theme-modal-overlay"
            onClick={onClose}
          />
          
          {/* 侧边栏内容 */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 theme-sidebar px-6 pb-4 theme-animate-slide-in">
            {/* 头部 */}
            <div className="flex h-16 shrink-0 items-center justify-between">
              <div 
                className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-lg"
                style={{ background: 'var(--gradient-primary)' }}
              >
                {getThemeIcon()}
              </div>
              <button
                type="button"
                className="theme-button-ghost -m-2.5 p-2.5"
                onClick={onClose}
              >
                <span className="sr-only">关闭侧边栏</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* 导航菜单 */}
            <nav className="flex flex-1 flex-col mt-5">
              <ul role="list" className="flex flex-1 flex-col gap-y-2">
                {filteredNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={`theme-nav-item group ${
                          isActive ? 'active' : ''
                        }`}
                        onClick={onClose}
                        title={item.description}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div 
                              className="text-xs mt-0.5"
                              style={{ color: 'var(--color-text-muted)' }}
                            >
                              {item.description}
                            </div>
                          )}
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* 用户信息区域 */}
            <div className="theme-card p-3 mt-4">
              <div className="flex items-center gap-x-3">
                <div 
                  className="h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm"
                  style={{ 
                    background: 'var(--gradient-primary)', 
                    color: 'var(--color-text-inverse)' 
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p 
                    className="text-sm font-semibold truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {user?.name || '用户'}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
