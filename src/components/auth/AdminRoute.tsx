/**
 * 管理员路由组件
 * Admin Route Component
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

export function AdminRoute() {
  const { hasRole } = useAuth();

  // 检查是否有管理员权限
  const isAdmin = hasRole('ADMIN' as UserRole) || hasRole('SUPER_ADMIN' as UserRole);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">管理员权限required</h1>
          <p className="text-gray-600">只有管理员才能访问此区域</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
