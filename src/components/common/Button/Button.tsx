/**
 * 通用按钮组件
 * Universal Button Component
 */

import React from 'react';
import type { ComponentVariant, ComponentSize } from '../../../types/common';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体样式 */
  variant?: ComponentVariant;
  /** 按钮尺寸 */
  size?: ComponentSize;
  /** 是否为加载状态 */
  loading?: boolean;
  /** 是否为全宽按钮 */
  fullWidth?: boolean;
  /** 左侧图标 */
  leftIcon?: React.ReactNode;
  /** 右侧图标 */
  rightIcon?: React.ReactNode;
}

/**
 * 通用按钮组件
 * 支持多种样式变体、尺寸和状态
 * 
 * @param props - 按钮属性
 * @returns React 组件
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  // 基础样式类 - 主题化版本
  const baseClasses = [
    'theme-button',
    'inline-flex items-center justify-center',
    'font-semibold rounded-xl transition-all duration-300',
    'focus:outline-none focus:ring-4 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'shadow-lg hover:shadow-xl transform hover:scale-105',
    'active:scale-95'
  ];

  // 获取主题化样式
  const getThemeStyles = (variant: ComponentVariant) => {
    const styles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'var(--gradient-primary)',
        color: 'var(--color-text-inverse)',
        border: '2px solid transparent',
        boxShadow: 'var(--shadow-lg)'
      },
      secondary: {
        background: 'var(--color-surface)',
        color: 'var(--color-primary)',
        border: '2px solid var(--color-primary)',
        boxShadow: 'var(--shadow-md)'
      },
      success: {
        background: 'var(--color-success)',
        color: 'var(--color-text-inverse)',
        border: '2px solid transparent',
        boxShadow: 'var(--shadow-lg)'
      },
      warning: {
        background: 'var(--color-warning)',
        color: 'var(--color-text-inverse)',
        border: '2px solid transparent',
        boxShadow: 'var(--shadow-lg)'
      },
      error: {
        background: 'var(--color-error)',
        color: 'var(--color-text-inverse)',
        border: '2px solid transparent',
        boxShadow: 'var(--shadow-lg)'
      },
      info: {
        background: 'var(--color-info)',
        color: 'var(--color-text-inverse)',
        border: '2px solid transparent',
        boxShadow: 'var(--shadow-lg)'
      },
      ghost: {
        background: 'transparent',
        color: 'var(--color-text-secondary)',
        border: '2px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)'
      }
    };
    return styles[variant] || styles.primary;
  };

  // 尺寸样式映射
  const sizeClasses: Record<ComponentSize, string> = {
    small: 'px-4 py-2 text-sm min-h-[36px]',
    medium: 'px-6 py-3 text-base min-h-[44px]',
    large: 'px-8 py-4 text-lg min-h-[52px]'
  };

  // 组合所有样式类
  const buttonClasses = [
    ...baseClasses,
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      style={{
        ...getThemeStyles(variant),
        ...(disabled || loading ? { opacity: 0.5, cursor: 'not-allowed' } : {})
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      <span>{children}</span>
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
