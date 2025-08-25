# 开发指南 (Development Guide)

## 快速开始 (Quick Start)

### 环境要求 (Prerequisites)
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### 安装依赖 (Installation)
```bash
# 克隆项目
git clone <repository-url>
cd maternity-leave-mfe

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 可用脚本 (Available Scripts)
```bash
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产构建
npm run lint     # 运行 ESLint 检查
npm run test     # 运行测试套件
```

## 开发规范 (Development Standards)

### 代码风格 (Code Style)
- 使用 ESLint 进行代码质量检查
- 使用 Prettier 进行代码格式化
- 遵循 React Hooks 最佳实践
- TypeScript 严格模式

### 组件开发规范 (Component Development)

#### 1. 组件结构模板
```typescript
// components/common/Button/Button.tsx
import React from 'react';
import { ButtonProps } from './Button.types';
import './Button.css';

/**
 * 通用按钮组件
 * @param props - 按钮属性
 * @returns React 组件
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = `btn--${variant}`;
  const sizeClasses = `btn--${size}`;
  
  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

#### 2. 类型定义
```typescript
// components/common/Button/Button.types.ts
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** 按钮尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击事件处理器 */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

#### 3. 组件导出
```typescript
// components/common/Button/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

### 自定义 Hook 开发 (Custom Hooks)

#### Hook 结构模板
```typescript
// hooks/useCalculator.ts
import { useState, useCallback, useMemo } from 'react';
import { CalculatorState, CalculationResult } from '../types/calculator';
import { calculateMaternityLeave } from '../utils/calculations/maternity';

/**
 * 产假计算器 Hook
 * 管理计算器状态和计算逻辑
 */
export const useCalculator = () => {
  const [state, setState] = useState<CalculatorState>({
    startDate: null,
    employmentDate: null,
    region: '',
    employmentType: 'full-time',
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const calculate = useCallback(async (): Promise<CalculationResult | null> => {
    if (!state.startDate || !state.employmentDate || !state.region) {
      return null;
    }

    setIsCalculating(true);
    try {
      const result = await calculateMaternityLeave(state);
      return result;
    } finally {
      setIsCalculating(false);
    }
  }, [state]);

  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const isValid = useMemo(() => {
    return !!(state.startDate && state.employmentDate && state.region);
  }, [state]);

  return {
    state,
    updateState,
    calculate,
    isCalculating,
    isValid,
  };
};
```

### 工具函数开发 (Utility Functions)

#### 工具函数模板
```typescript
// utils/calculations/maternity.ts
import { CalculatorState, CalculationResult } from '../../types/calculator';
import { MATERNITY_POLICIES } from '../../constants/policies';

/**
 * 计算产假天数和相关信息
 * @param state - 计算器状态
 * @returns 计算结果
 */
export const calculateMaternityLeave = async (
  state: CalculatorState
): Promise<CalculationResult> => {
  const { startDate, employmentDate, region, employmentType } = state;
  
  // 获取对应地区的政策
  const policy = MATERNITY_POLICIES[region];
  if (!policy) {
    throw new Error(`未找到地区 ${region} 的政策信息`);
  }

  // 计算工作年限
  const workYears = calculateWorkYears(employmentDate, startDate);
  
  // 计算基础产假天数
  const baseDays = policy.baseDays;
  
  // 计算额外天数（基于工作年限等）
  const extraDays = calculateExtraDays(workYears, policy);
  
  // 计算总天数
  const totalDays = baseDays + extraDays;
  
  // 计算结束日期
  const endDate = addDays(startDate, totalDays);
  
  return {
    totalDays,
    baseDays,
    extraDays,
    startDate,
    endDate,
    region,
    policy: policy.name,
  };
};

/**
 * 计算工作年限
 * @param employmentDate - 入职日期
 * @param currentDate - 当前日期
 * @returns 工作年限
 */
const calculateWorkYears = (employmentDate: Date, currentDate: Date): number => {
  const diffTime = Math.abs(currentDate.getTime() - employmentDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diffYears);
};
```

## 测试规范 (Testing Standards)

### 组件测试
```typescript
// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/components/common/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes', () => {
    render(<Button variant="secondary" size="large">Button</Button>);
    const button = screen.getByText('Button');
    
    expect(button).toHaveClass('btn', 'btn--secondary', 'btn--large');
  });
});
```

### Hook 测试
```typescript
// tests/hooks/useCalculator.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../../src/hooks/useCalculator';

describe('useCalculator Hook', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useCalculator());
    
    expect(result.current.state.startDate).toBeNull();
    expect(result.current.state.region).toBe('');
    expect(result.current.isValid).toBe(false);
  });

  it('updates state correctly', () => {
    const { result } = renderHook(() => useCalculator());
    
    act(() => {
      result.current.updateState({
        region: 'beijing',
        startDate: new Date('2024-01-01'),
      });
    });

    expect(result.current.state.region).toBe('beijing');
    expect(result.current.state.startDate).toEqual(new Date('2024-01-01'));
  });
});
```

## 性能优化 (Performance Optimization)

### 1. 组件优化
- 使用 `React.memo` 避免不必要的重渲染
- 使用 `useMemo` 和 `useCallback` 优化计算和函数
- 合理使用 `useState` 和 `useReducer`

### 2. 代码分割
- 使用动态导入进行路由级别的代码分割
- 懒加载非关键组件

### 3. 资源优化
- 图片压缩和格式优化
- 字体文件优化
- CSS 和 JS 文件压缩

## 部署准备 (Deployment Preparation)

### 构建优化
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['./src/utils'],
        },
      },
    },
  },
});
```

### 环境变量管理
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=产假计算器 - 开发环境

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=产假计算器
```

## 故障排除 (Troubleshooting)

### 常见问题
1. **依赖安装失败**: 清除 `node_modules` 和 `package-lock.json`，重新安装
2. **TypeScript 错误**: 检查类型定义和 tsconfig.json 配置
3. **样式不生效**: 确认 Tailwind CSS 配置正确，检查 PostCSS 设置
4. **构建失败**: 检查环境变量和构建配置

### 调试技巧
- 使用 React Developer Tools
- 利用 Vite 的 HMR 功能
- 使用 console.log 和断点调试
- 检查网络请求和响应
