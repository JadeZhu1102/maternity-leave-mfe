/**
 * 系统设置页面
 * System Settings Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import {
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,

  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const SystemSettings = () => {
  const navigate = useNavigate();
  const { currentTheme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true,
  });

  const toggleNotification = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const SettingSection = ({ 
    title, 
    children,
    icon: Icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="setting-section mb-8">
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-lg mr-3" style={{ background: 'var(--color-surface-container-highest)' }}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {title}
        </h2>
      </div>
      <div className="pl-11">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ 
    title, 
    description,
    action,
  }: {
    title: string;
    description?: string;
    action: React.ReactNode;
  }) => (
    <div className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'var(--color-divider)' }}>
      <div>
        <h3 className="font-medium" style={{ color: 'var(--color-text)' }}>{title}</h3>
        {description && (
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {description}
          </p>
        )}
      </div>
      <div>
        {action}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full hover:bg-surface-container-highest transition-colors"
          aria-label="返回"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          系统设置
        </h1>
      </div>

      <div className="bg-surface rounded-xl p-6 shadow-sm" style={{ background: 'var(--color-surface-container-low)' }}>
        <SettingSection title="外观" icon={SunIcon}>
          <SettingItem
            title="主题模式"
            description="选择浅色、深色或跟随系统设置"
            action={
              <div className="flex space-x-2">
                {['light', 'system', 'dark'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setTheme(theme as any)}
                    className={`p-2 rounded-lg flex items-center justify-center ${
                      currentTheme === theme 
                        ? 'bg-primary/10 text-primary' 
                        : 'hover:bg-surface-container-highest'
                    }`}
                    style={{
                      '--tw-bg-opacity': 'var(--opacity-hover)',
                    } as React.CSSProperties}
                  >
                    {theme === 'light' ? (
                      <SunIcon className="h-5 w-5" />
                    ) : theme === 'dark' ? (
                      <MoonIcon className="h-5 w-5" />
                    ) : (
                      <Cog6ToothIcon className="h-5 w-5" />
                    )}
                  </button>
                ))}
              </div>
            }
          />
        </SettingSection>

        <SettingSection title="通知" icon={BellIcon}>
          <SettingItem
            title="邮件通知"
            description="接收重要系统通知和提醒"
            action={
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => toggleNotification('email')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            }
          />
          <SettingItem
            title="推送通知"
            description="接收应用内推送通知"
            action={
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => toggleNotification('push')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            }
          />
          <SettingItem
            title="提醒"
            description="重要日程和截止日期提醒"
            action={
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.reminders}
                  onChange={() => toggleNotification('reminders')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            }
          />
        </SettingSection>

        <SettingSection title="账户与安全" icon={ShieldCheckIcon}>
          <SettingItem
            title="修改密码"
            description="定期更改密码以提高账户安全性"
            action={
              <Button variant="secondary" size="small" onClick={() => {}}>
                修改
              </Button>
            }
          />
          <SettingItem
            title="双重认证"
            description="为您的账户添加额外安全层"
            action={
              <Button variant="secondary" size="small" onClick={() => {}}>
                启用
              </Button>
            }
          />
        </SettingSection>

        <SettingSection title="语言与地区" icon={LanguageIcon}>
          <SettingItem
            title="显示语言"
            description="设置应用显示语言"
            action={
              <select 
                className="px-3 py-1 text-sm rounded-md border"
                style={{
                  backgroundColor: 'var(--color-surface-container-highest)',
                  borderColor: 'var(--color-outline-variant)',
                  color: 'var(--color-text)'
                }}
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            }
          />
          <SettingItem
            title="日期格式"
            description="设置日期显示格式"
            action={
              <select 
                className="px-3 py-1 text-sm rounded-md border"
                style={{
                  backgroundColor: 'var(--color-surface-container-highest)',
                  borderColor: 'var(--color-outline-variant)',
                  color: 'var(--color-text)'
                }}
              >
                <option value="zh">2023-09-24</option>
                <option value="en">09/24/2023</option>
              </select>
            }
          />
        </SettingSection>

        <SettingSection title="关于" icon={DocumentTextIcon}>
          <SettingItem
            title="版本信息"
            description="v1.0.0"
            action={<span className="text-sm text-muted-foreground">最新版本</span>}
          />
          <SettingItem
            title="隐私政策"
            action={
              <Button variant="secondary" size="small" onClick={() => {}}>
                查看
              </Button>
            }
          />
          <SettingItem
            title="用户协议"
            action={
              <Button variant="secondary" size="small" onClick={() => {}}>
                查看
              </Button>
            }
          />
        </SettingSection>

        <div className="mt-10 pt-6 border-t" style={{ borderColor: 'var(--color-divider)' }}>
          <Button 
            variant="secondary" 
            className="w-full"
            onClick={() => {
              // 登出逻辑
              navigate('/login');
            }}
          >
            退出登录
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
