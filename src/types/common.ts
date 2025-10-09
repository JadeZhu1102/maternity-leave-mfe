/**
 * 通用类型定义
 * Common type definitions
 */

/** API 响应基础接口 */
export interface ApiResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 是否成功 */
  success: boolean;
  /** 时间戳 */
  timestamp: number;
}

/** 分页参数接口 */
export interface PaginationParams {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总数量 */
  total?: number;
}

/** 分页响应接口 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** 分页信息 */
  pagination: PaginationParams;
}

/** 选项接口 */
export interface Option<T = string> {
  /** 选项标签 */
  label: string;
  /** 选项值 */
  value: T;
  /** 是否禁用 */
  disabled?: boolean;
  /** 选项描述 */
  description?: string;
}

/** 表单字段接口 */
export interface FormField<T = any> {
  /** 字段名称 */
  name: string;
  /** 字段标签 */
  label: string;
  /** 字段类型 */
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio';
  /** 字段值 */
  value: T;
  /** 是否必填 */
  required?: boolean;
  /** 占位符 */
  placeholder?: string;
  /** 验证规则 */
  validation?: ValidationRule[];
  /** 选项列表（用于 select、radio） */
  options?: Option<T>[];
}

/** 验证规则接口 */
export interface ValidationRule {
  /** 规则类型 */
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  /** 规则值 */
  value?: any;
  /** 错误消息 */
  message: string;
  /** 自定义验证函数 */
  validator?: (value: any) => boolean;
}

/** 主题配置接口 */
export interface ThemeConfig {
  /** 主色调 */
  primary: string;
  /** 辅助色 */
  secondary: string;
  /** 成功色 */
  success: string;
  /** 警告色 */
  warning: string;
  /** 错误色 */
  error: string;
  /** 信息色 */
  info: string;
  /** 字体配置 */
  fonts: {
    primary: string;
    secondary: string;
  };
}

/** 用户偏好设置接口 */
export interface UserPreferences {
  /** 语言设置 */
  language: 'zh-CN' | 'en-US';
  /** 主题设置 */
  theme: 'light' | 'dark' | 'auto';
  /** 时区设置 */
  timezone: string;
  /** 日期格式 */
  dateFormat: string;
  /** 货币格式 */
  currencyFormat: string;
}

/** 错误信息接口 */
export interface ErrorInfo {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: any;
  /** 错误堆栈 */
  stack?: string;
  /** 发生时间 */
  timestamp: number;
}

/** 加载状态类型 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** 组件尺寸类型 */
export type ComponentSize = 'small' | 'medium' | 'large';

/** 组件变体类型 */
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost';

/** 事件处理器类型 */
export type EventHandler<T = Event> = (event: T) => void;

/** 异步函数类型 */
export type AsyncFunction = (...args: any[]) => Promise<any>;

/** 城市信息接口 */
export interface City {
  /** 城市代码 */
  code: string;
  /** 城市名称 */
  name: string;
  /** 省份 */
  province?: string;
  /** 是否启用 */
  enabled?: boolean;
}
