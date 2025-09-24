/**
 * 路由配置
 * Router Configuration
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { LoginPage } from '../pages/auth/LoginPage';
import { Calculator } from '../pages/Calculator';
import { Dashboard } from '../pages/Dashboard';
import { PolicyManagement } from '../pages/admin/PolicyManagement';
import { CompanySettings } from '../pages/admin/CompanySettings';
import { UserManagement } from '../pages/admin/UserManagement';
import { CalculationHistory } from '../pages/CalculationHistory';
import { Profile } from '../pages/Profile';
import SystemSettings from '../pages/settings';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'calculator',
        element: <Calculator />,
      },
      {
        path: 'history',
        element: <CalculationHistory />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <SystemSettings />,
      },
      {
        path: 'admin',
        element: <AdminRoute />,
        children: [
          {
            path: 'policies',
            element: <PolicyManagement />,
          },
          {
            path: 'company',
            element: <CompanySettings />,
          },
          {
            path: 'users',
            element: <UserManagement />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
