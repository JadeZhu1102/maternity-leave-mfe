/**
 * 头部导航组件
 * Header Navigation Component
 */

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeSwitcher } from '../common/ThemeSwitcher';
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭用户菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const handleNotificationClick = () => {
    // 这里可以添加通知功能的逻辑
    console.log('通知按钮被点击');
    // 可以打开通知面板或跳转到通知页面
    // 暂时减少通知数量作为演示
    if (notificationCount > 0) {
      setNotificationCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <div className="theme-header sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 pl-4 pr-0 sm:gap-x-6 sm:pl-6 sm:pr-0 lg:pl-8 lg:pr-0">
      {/* 菜单按钮 - 桌面端和移动端都可用 */}
      <button
        type="button"
        className="theme-button-ghost -m-2.5 p-2.5"
        onClick={onMenuClick}
        title="切换侧边栏"
      >
        <span className="sr-only">切换侧边栏</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* 分隔线 */}
      <div 
        className="h-6 w-px lg:hidden" 
        style={{ backgroundColor: 'var(--color-divider)' }}
        aria-hidden="true" 
      />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* 搜索区域 - 预留 */}
        <div className="flex flex-1">
          {/* 可以在这里添加搜索功能 */}
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* 通知按钮 */}
          <button
            type="button"
            className="theme-button-ghost -m-2.5 p-2.5 relative"
            onClick={handleNotificationClick}
            title="查看通知"
          >
            <span className="sr-only">查看通知</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {/* 通知徽章 */}
            {notificationCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs font-bold flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--color-error)', 
                  color: 'var(--color-text-inverse)' 
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>

          {/* 主题切换器 */}
          <ThemeSwitcher />

          {/* 分隔线 */}
          <div 
            className="hidden lg:block lg:h-6 lg:w-px" 
            style={{ backgroundColor: 'var(--color-divider)' }}
            aria-hidden="true" 
          />

          {/* 用户菜单 */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              className="theme-button-ghost -m-1.5 flex items-center p-1.5 rounded-full"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <span className="sr-only">打开用户菜单</span>
              <div 
                className="h-8 w-8 rounded-full flex items-center justify-center font-semibold text-sm"
                style={{ 
                  background: 'var(--gradient-primary)', 
                  color: 'var(--color-text-inverse)' 
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span 
                  className="ml-4 text-sm font-semibold leading-6" 
                  style={{ color: 'var(--color-text)' }}
                  aria-hidden="true"
                >
                  {user?.name || '用户'}
                </span>
              </span>
            </button>

            {/* 用户下拉菜单 */}
            {userMenuOpen && (
              <div className="theme-modal absolute right-0 z-10 mt-2.5 w-48 origin-top-right py-2 focus:outline-none theme-animate-slide-in">
                <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--color-divider)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                    {user?.name || '用户'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="flex w-full items-center px-4 py-2 text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-hover)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <Cog6ToothIcon className="mr-3 h-4 w-4" />
                  个人设置
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm transition-colors"
                  style={{ color: 'var(--color-text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-hover)';
                    e.currentTarget.style.color = 'var(--color-error)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                  }}
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
