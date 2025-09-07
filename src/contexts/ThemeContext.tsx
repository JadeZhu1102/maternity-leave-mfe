/**
 * 主题管理上下文
 * Theme Management Context
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'fresh' | 'modern' | 'tech' | 'warm';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  description: string;
  colors: {
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
  };
  gradients: {
    primary: string;
    background: string;
    card: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
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
    name: '温暖友好',
    description: '温暖色调，友好亲切的设计风格',
    colors: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#F472B6',
      background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
      surface: 'rgba(255, 255, 255, 0.9)',
      text: '#4C1D95',
      textSecondary: '#6B7280',
      border: 'rgba(236, 72, 153, 0.1)',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
      background: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
      card: 'rgba(255, 255, 255, 0.9)'
    },
    shadows: {
      small: '0 4px 20px rgba(236, 72, 153, 0.1)',
      medium: '0 8px 32px rgba(236, 72, 153, 0.1)',
      large: '0 12px 48px rgba(236, 72, 153, 0.15)'
    },
    borderRadius: {
      small: '12px',
      medium: '16px',
      large: '20px'
    },
    fonts: {
      primary: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      secondary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('app-theme');
    return (saved as ThemeType) || 'fresh';
  });

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    localStorage.setItem('app-theme', theme);
  };

  // 应用CSS变量到文档根元素
  useEffect(() => {
    const theme = themes[currentTheme];
    const root = document.documentElement;

    // 设置CSS变量
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-accent', theme.colors.accent);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-error', theme.colors.error);

    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-background', theme.gradients.background);
    root.style.setProperty('--gradient-card', theme.gradients.card);

    root.style.setProperty('--shadow-small', theme.shadows.small);
    root.style.setProperty('--shadow-medium', theme.shadows.medium);
    root.style.setProperty('--shadow-large', theme.shadows.large);

    root.style.setProperty('--border-radius-small', theme.borderRadius.small);
    root.style.setProperty('--border-radius-medium', theme.borderRadius.medium);
    root.style.setProperty('--border-radius-large', theme.borderRadius.large);

    root.style.setProperty('--font-primary', theme.fonts.primary);
    root.style.setProperty('--font-secondary', theme.fonts.secondary);

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
