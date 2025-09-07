/**
 * 主应用组件
 * Main Application Component
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { router } from './router';
import './styles/globals.css';

/**
 * 产假计算和生育补贴管理系统主应用
 * 提供完整的企业级产假管理功能
 * 
 * @returns React 应用组件
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
