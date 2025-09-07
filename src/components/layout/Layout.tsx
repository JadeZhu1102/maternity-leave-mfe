/**
 * 主布局组件 - 主题化版本
 * Main Layout Component - Themed Version
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // 默认显示侧边栏

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen); // 切换侧边栏显示/隐藏状态
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-secondary)' }}>
      {/* 侧边栏 */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={handleSidebarClose} 
      />

      {/* 主内容区域 - 响应侧边栏状态 */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {/* 顶部导航 */}
        <Header onMenuClick={handleMenuClick} />

        {/* 页面内容 - 完全移除右侧留白，内容平铺到边缘 */}
        <main className="min-h-screen">
          <div className="w-full pl-4 pr-0 py-6 sm:pl-6 sm:pr-0 lg:pl-8 lg:pr-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
