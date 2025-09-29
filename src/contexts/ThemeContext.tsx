/**
 * 主题管理上下文
 * Theme Management Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'fresh' | 'modern' | 'tech' | 'warm' | 'ocbc';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  [key: string]: string; // Index signature for dynamic access
}

interface ThemeGradients {
  primary: string;
  background: string;
  card: string;
  [key: string]: string; // Index signature for dynamic access
}

interface ThemeShadows {
  small: string;
  medium: string;
  large: string;
  [key: string]: string; // Index signature for dynamic access
}

interface BorderRadius {
  small: string;
  medium: string;
  large: string;
  [key: string]: string; // Index signature for dynamic access
}

interface ThemeFonts {
  primary: string;
  secondary: string;
  [key: string]: string; // Index signature for dynamic access
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  colors: ColorPalette;
  gradients: ThemeGradients;
  shadows: ThemeShadows;
  borderRadius: BorderRadius;
  fonts: ThemeFonts;
}

// 主题配置
const themes: Record<ThemeType, ThemeConfig> = {
  fresh: {
    id: 'fresh',
    name: '清新自然',
    description: '绿色生态，清新自然的设计风格',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#34D399',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: '#166534',
      textSecondary: '#374151',
      border: 'rgba(5, 150, 105, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #059669, #10B981)',
      background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 50%, #BBF7D0 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    shadows: {
      small: '0 4px 20px rgba(5, 150, 105, 0.1)',
      medium: '0 8px 32px rgba(5, 150, 105, 0.1)',
      large: '0 12px 48px rgba(5, 150, 105, 0.15)'
    },
    borderRadius: {
      small: '15px',
      medium: '20px',
      large: '25px'
    },
    fonts: {
      primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      secondary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }
  },
  modern: {
    id: 'modern',
    name: '现代简约',
    description: '简洁现代，注重功能性的设计风格',
    colors: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #2563EB, #3B82F6)',
      background: '#F8FAFC',
      card: '#FFFFFF'
    },
    shadows: {
      small: '0 1px 3px rgba(0, 0, 0, 0.1)',
      medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
      large: '0 10px 15px rgba(0, 0, 0, 0.1)'
    },
    borderRadius: {
      small: '6px',
      medium: '8px',
      large: '12px'
    },
    fonts: {
      primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      secondary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }
  },
  tech: {
    id: 'tech',
    name: '科技商务',
    description: '深色科技感，专业商务的设计风格',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#06B6D4',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      surface: 'rgba(30, 41, 59, 0.8)',
      text: '#E2E8F0',
      textSecondary: '#94A3B8',
      border: 'rgba(59, 130, 246, 0.2)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      card: 'rgba(30, 41, 59, 0.8)'
    },
    shadows: {
      small: '0 4px 20px rgba(59, 130, 246, 0.1)',
      medium: '0 8px 32px rgba(59, 130, 246, 0.15)',
      large: '0 12px 48px rgba(59, 130, 246, 0.2)'
    },
    borderRadius: {
      small: '6px',
      medium: '8px',
      large: '12px'
    },
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      secondary: "'JetBrains Mono', 'Fira Code', monospace"
    }
  },
  warm: {
    id: 'warm',
    name: '温暖柔和',
    description: '温暖柔和的色调，营造舒适氛围',
    colors: {
      primary: '#DB2777',
      secondary: '#EC4899',
      accent: '#F472B6',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      text: '#831843',
      textSecondary: '#6B7280',
      border: '#FBCFE8',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #DB2777, #EC4899)',
      background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 50%, #FBCFE8 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    shadows: {
      small: '0 4px 20px rgba(219, 39, 119, 0.1)',
      medium: '0 8px 32px rgba(219, 39, 119, 0.1)',
      large: '0 12px 48px rgba(219, 39, 119, 0.15)'
    },
    borderRadius: {
      small: '15px',
      medium: '20px',
      large: '25px'
    },
    fonts: {
      primary: "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
      secondary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }
  },
  ocbc: {
    id: 'ocbc',
    name: 'OCBC银行',
    description: 'OCBC银行企业主题，专业可靠',
    colors: {
      primary: '#E21833', // OCBC红色
      secondary: '#B30E23', // 深红色
      accent: '#FF4D5F', // 亮红色
      background: '#F8F9FA', // 浅灰色背景
      surface: '#FFFFFF', // 白色表面
      text: '#1A202C', // 深灰色文字
      textSecondary: '#4A5568', // 中等灰色文字
      border: 'rgba(226, 24, 51, 0.1)', // 半透明红色边框
      success: '#38A169', // 成功绿色
      warning: '#DD6B20', // 警告橙色
      error: '#E53E3E' // 错误红色
    },
    gradients: {
      primary: 'linear-gradient(135deg, #E21833, #FF4D5F)',
      background: 'linear-gradient(135deg, #F8F9FA 0%, #EDF2F7 100%)',
      card: 'rgba(255, 255, 255, 0.95)'
    },
    shadows: {
      small: '0 4px 20px rgba(226, 24, 51, 0.1)',
      medium: '0 8px 32px rgba(226, 24, 51, 0.1)',
      large: '0 12px 48px rgba(226, 24, 51, 0.15)'
    },
    borderRadius: {
      small: '12px',
      medium: '16px',
      large: '20px'
    },
    fonts: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      secondary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }
  }
};

interface ThemeContextType {
  currentTheme: ThemeType;
  theme: ThemeConfig;
  setTheme: (theme: ThemeType) => void;
  themes: Record<ThemeType, ThemeConfig>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 默认主题配置
const defaultTheme: ThemeConfig = {
  id: 'fresh',
  name: '默认主题',
  description: '系统默认主题',
  colors: {
    primary: '#3b82f6',
    secondary: '#6366f1',
    accent: '#8b5cf6',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    background: '#f9fafb',
    card: '#ffffff'
  },
  shadows: {
    small: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    large: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  borderRadius: {
    small: '0.375rem',
    medium: '0.5rem',
    large: '0.75rem'
  },
  fonts: {
    primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    secondary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeReady, setThemeReady] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('fresh');
  
  // 初始化主题
  useEffect(() => {
    try {
      const saved = localStorage.getItem('app-theme');
      const initialTheme = saved && themes[saved as ThemeType] ? saved as ThemeType : 'fresh';
      setCurrentTheme(initialTheme);
      setThemeReady(true);
    } catch (error) {
      console.error('Failed to initialize theme:', error);
      setThemeReady(true); // Continue with default theme even if there's an error
    }
  }, []);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('app-theme', theme);
  };

  // 应用CSS变量到文档根元素
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    if (!theme || !theme.colors) {
      console.error('Invalid theme configuration:', theme);
      return;
    }

    // 设置颜色变量
    const { colors } = theme;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // 设置渐变
    if (theme.gradients) {
      Object.entries(theme.gradients).forEach(([key, value]) => {
        root.style.setProperty(`--gradient-${key}`, value);
      });
    }

    // 设置阴影
    if (theme.shadows) {
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });
    }

    // 设置圆角
    if (theme.borderRadius) {
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--border-radius-${key}`, value);
      });
    }

    // 设置字体
    if (theme.fonts) {
      Object.entries(theme.fonts).forEach(([key, value]) => {
        root.style.setProperty(`--font-${key}`, value);
      });
    }

    // 设置背景
    if (theme.colors.background.startsWith('linear-gradient')) {
      document.body.style.background = theme.colors.background;
    } else {
      document.body.style.backgroundColor = theme.colors.background;
    }
    
    document.body.style.color = theme.colors.text;
    document.body.style.fontFamily = theme.fonts.primary;
  }, [currentTheme]);

  const value: ThemeContextType = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme,
    themes
  };

  // 确保主题已初始化
  if (!themeReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-pulse">
          <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900"></div>
          <div className="text-center text-gray-600 dark:text-gray-400">加载主题中...</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
