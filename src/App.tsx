/**
 * 主应用组件
 * Main Application Component
 */

import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ocbcTheme } from './theme/muiTheme';
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
    <MuiThemeProvider theme={ocbcTheme}>
      <CssBaseline />
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
