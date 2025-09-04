# 产假计算和生育补贴管理系统需求文档
# Maternity Leave and Allowance Management System Requirements

## 📋 项目概述 | Project Overview

### 系统名称
产假计算和生育补贴管理系统 (Maternity Leave and Allowance Management System)

### 项目背景
基于现有的前端产假计算器，扩展为一个完整的企业级产假和生育补贴管理系统，支持多城市政策管理、公司政策配置、社保参数管理、计算历史记录和数据分析仪表盘。

### 技术架构
- **前端**: React + TypeScript + Vite + Tailwind CSS
- **后端**: Node.js + Express/Nest.js + TypeScript
- **数据库**: PostgreSQL/MySQL + Redis (缓存)
- **认证**: 集成公司内部认证系统
- **部署**: Docker + Kubernetes/云服务

---

## 🎯 核心功能模块 | Core Feature Modules

### 1. 用户认证模块 (Authentication Module)

#### 1.1 登录功能
- **接口集成**: 使用公司内部认证系统 API
- **页面设计**: 独立的登录页面设计
- **功能要求**:
  - 支持单点登录 (SSO)
  - 用户角色权限管理 (普通用户/管理员)
  - 登录状态保持和自动刷新
  - 安全退出功能

#### 1.2 权限管理
- **角色定义**:
  - `USER`: 普通用户 - 查看和使用计算功能
  - `ADMIN`: 管理员 - 所有功能 + 数据管理
  - `SUPER_ADMIN`: 超级管理员 - 系统配置
- **权限控制**: 基于角色的访问控制 (RBAC)

---

### 2. 信息管理模块 (Information Management Module)

#### 2.1 城市产假政策管理
- **数据结构**:
  ```typescript
  interface CityPolicy {
    id: string;
    cityCode: string;
    cityName: string;
    baseDays: number;
    extraDaysRules: ExtraDaysRule[];
    effectiveDate: Date;
    expiryDate?: Date;
    description: string;
    legalBasis: string;
    lastUpdated: Date;
    updatedBy: string;
  }
  ```
- **管理功能**:
  - ✅ 增加新城市政策
  - ✅ 修改现有政策
  - ✅ 删除过期政策
  - ✅ 查询和筛选政策
  - ✅ 政策版本历史管理
  - ✅ 批量导入/导出功能

#### 2.2 公司政策管理
- **数据结构**:
  ```typescript
  interface CompanyPolicy {
    id: string;
    companyId: string;
    companyName: string;
    additionalDays: number;
    allowanceMultiplier: number;
    specialBenefits: string[];
    effectiveDate: Date;
    isActive: boolean;
  }
  ```
- **管理功能**:
  - 公司特殊政策配置
  - 额外假期天数设置
  - 补贴倍数调整
  - 特殊福利项目管理

#### 2.3 社保平均参数管理
- **数据结构**:
  ```typescript
  interface SocialInsuranceParams {
    id: string;
    cityCode: string;
    year: number;
    averageSalary: number;
    minBase: number;
    maxBase: number;
    contributionRate: number;
    lastUpdated: Date;
  }
  ```
- **管理功能**:
  - 各城市社保基数管理
  - 年度参数更新
  - 历史数据保存
  - 参数有效性验证

#### 2.4 产假类型管理
- **数据结构**:
  ```typescript
  interface MaternityLeaveType {
    id: string;
    typeCode: string;
    typeName: string;
    description: string;
    baseDays: number;
    additionalDays: number;
    medicalProofRequired: boolean;
    medicalProofTypes: string[];
    applicableConditions: string[];
    combinationRules: CombinationRule[];
    effectiveDate: Date;
    isActive: boolean;
  }
  
  interface CombinationRule {
    combinedTypes: string[];
    calculationMethod: 'add' | 'max' | 'custom';
    customFormula?: string;
    priority: number;
  }
  
  interface RegionalTypePolicy {
    id: string;
    regionCode: string;
    typeCode: string;
    localDays: number;
    localRules: string[];
    lastUpdated: Date;
  }
  ```
- **产假类型定义**:
  - `NORMAL`: 正常分娩
  - `DIFFICULT`: 难产（剖腹产、产钳助产等）
  - `MULTIPLE`: 多胞胎（双胞胎、三胞胎等）
  - `MISCARRIAGE`: 流产（自然/人工流产）
  - `PREMATURE`: 早产（不满37周）
  - `LATE_CHILDBEARING`: 晚育奖励
  - `SPECIAL`: 其他特殊情况
- **管理功能**:
  - 产假类型定义管理
  - 各类型天数规定设置
  - 地区差异化配置
  - 类型组合规则管理
  - 医学证明要求配置

#### 2.5 日历配置管理
- **数据结构**:
  ```typescript
  interface CalendarConfig {
    id: string;
    year: number;
    workingDays: Date[];
    holidays: Holiday[];
    minorityFestivals: MinorityFestival[];
    customWorkDays: Date[];
  }
  
  interface Holiday {
    name: string;
    startDate: Date;
    endDate: Date;
    type: 'national' | 'regional' | 'company';
  }
  ```
- **管理功能**:
  - 工作日配置
  - 国家法定节假日管理
  - 少数民族节日配置
  - 调休日期设置
  - 年度日历批量导入

---

### 3. 计算功能模块 (Calculation Module)

#### 3.1 产假计算功能
- **增强功能**:
  - 基于数据库的政策数据
  - 实时政策更新
  - 多公司政策叠加计算
  - 工作日/自然日切换
  - 节假日智能处理

#### 3.2 生育补贴计算功能
- **计算逻辑**:
  ```typescript
  interface AllowanceCalculation {
    baseSalary: number;
    socialInsuranceBase: number;
    companyMultiplier: number;
    totalDays: number;
    dailyAllowance: number;
    totalAllowance: number;
    taxDeduction: number;
    netAllowance: number;
  }
  ```
- **功能特性**:
  - 多种计算模式 (社保基数/实际工资)
  - 税收计算
  - 公司补贴叠加
  - 分阶段补贴计算

#### 3.3 计算结果保存
- **数据结构**:
  ```typescript
  interface CalculationRecord {
    id: string;
    userId: string;
    calculationType: 'maternity' | 'allowance' | 'combined';
    inputParams: CalculationInput;
    result: CalculationResult;
    createdAt: Date;
    tags: string[];
    notes?: string;
  }
  ```

---

### 4. 历史记录模块 (History Module)

#### 4.1 个人历史记录
- **功能特性**:
  - 计算历史查看
  - 结果对比分析
  - 收藏常用计算
  - 导出计算报告
  - 历史数据搜索和筛选

#### 4.2 团队历史记录 (管理员)
- **功能特性**:
  - 团队计算统计
  - 使用频率分析
  - 政策使用情况
  - 数据导出功能

---

### 5. 仪表盘模块 (Dashboard Module)

#### 5.1 用户仪表盘
- **数据展示**:
  - 个人计算历史概览
  - 常用政策快捷入口
  - 最近计算结果
  - 政策更新通知

#### 5.2 管理员仪表盘
- **数据分析**:
  ```typescript
  interface DashboardMetrics {
    totalUsers: number;
    totalCalculations: number;
    topCities: CityUsageStats[];
    monthlyTrends: MonthlyStats[];
    policyUsage: PolicyUsageStats[];
    systemHealth: SystemHealthMetrics;
  }
  ```
- **可视化图表**:
  - 使用量趋势图
  - 城市政策使用分布
  - 用户活跃度分析
  - 计算准确性统计
  - 系统性能监控

---

## 🗄️ 数据库设计 | Database Design

### 核心数据表

#### 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'USER',
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);
```

#### 城市政策表 (city_policies)
```sql
CREATE TABLE city_policies (
  id UUID PRIMARY KEY,
  city_code VARCHAR(10) NOT NULL,
  city_name VARCHAR(50) NOT NULL,
  base_days INTEGER NOT NULL,
  extra_rules JSONB,
  effective_date DATE NOT NULL,
  expiry_date DATE,
  description TEXT,
  legal_basis TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);
```

#### 计算记录表 (calculation_records)
```sql
CREATE TABLE calculation_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  calculation_type calculation_type NOT NULL,
  input_params JSONB NOT NULL,
  result JSONB NOT NULL,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 技术实现规范 | Technical Implementation Standards

### 前端架构
- **组件结构**: 基于现有的自文档化组件架构
- **状态管理**: React Context + useReducer / Zustand
- **路由管理**: React Router v6
- **表单处理**: React Hook Form + Zod 验证
- **数据获取**: TanStack Query (React Query)
- **UI 组件**: 基于现有 Tailwind CSS 设计系统

### 后端架构
- **API 设计**: RESTful API + GraphQL (可选)
- **数据验证**: Joi / Zod
- **认证中间件**: JWT + 公司 SSO 集成
- **数据库 ORM**: Prisma / TypeORM
- **缓存策略**: Redis 缓存热点数据
- **日志系统**: Winston + 结构化日志

### 安全要求
- **数据加密**: 敏感数据加密存储
- **API 安全**: Rate limiting + CORS 配置
- **权限控制**: 细粒度权限管理
- **审计日志**: 所有操作记录审计
- **数据备份**: 定期自动备份

---

## 📱 用户界面设计 | UI/UX Design

### 页面结构
```
├── 登录页面 (Login)
├── 主仪表盘 (Dashboard)
├── 计算器页面 (Calculator)
│   ├── 产假计算
│   └── 生育补贴计算
├── 历史记录 (History)
├── 管理页面 (Admin) - 仅管理员
│   ├── 政策管理
│   ├── 用户管理
│   ├── 系统配置
│   └── 数据分析
└── 个人设置 (Profile)
```

### 设计原则
- **一致性**: 延续现有设计语言
- **易用性**: 直观的操作流程
- **响应式**: 支持多设备访问
- **无障碍**: 符合 WCAG 2.1 标准
- **性能**: 优化加载速度和交互响应

---

## 🚀 开发计划 | Development Plan

### 第一阶段 (4-6周)
- [ ] 后端基础架构搭建
- [ ] 数据库设计和初始化
- [ ] 用户认证系统集成
- [ ] 基础 CRUD API 开发

### 第二阶段 (3-4周)
- [ ] 前端页面重构和扩展
- [ ] 管理员界面开发
- [ ] 计算功能后端化
- [ ] 历史记录功能实现

### 第三阶段 (2-3周)
- [ ] 仪表盘数据分析功能
- [ ] 系统集成测试
- [ ] 性能优化
- [ ] 部署和上线

### 第四阶段 (1-2周)
- [ ] 用户培训和文档
- [ ] 生产环境监控
- [ ] 反馈收集和优化

---

## 📊 成功指标 | Success Metrics

### 功能指标
- [ ] 支持 20+ 城市政策管理
- [ ] 计算准确率 > 99.5%
- [ ] 系统响应时间 < 2秒
- [ ] 用户满意度 > 4.5/5

### 技术指标
- [ ] 系统可用性 > 99.9%
- [ ] 数据安全零事故
- [ ] API 响应时间 < 500ms
- [ ] 移动端兼容性 100%

---

## 📝 附录 | Appendix

### A. 现有代码资产利用
- 复用现有的类型定义系统
- 扩展现有的计算逻辑
- 保持现有的组件设计风格
- 继承现有的文档化标准

### B. 风险评估
- **技术风险**: 公司认证系统集成复杂度
- **数据风险**: 敏感信息安全保护
- **业务风险**: 政策变化频繁更新需求
- **时间风险**: 开发周期紧张

### C. 质量保证
- 单元测试覆盖率 > 80%
- 集成测试自动化
- 代码审查制度
- 性能测试和监控

---

**文档版本**: v1.0  
**创建日期**: 2025-09-04  
**最后更新**: 2025-09-04  
**负责人**: 开发团队  
**审核状态**: 待审核  

---

> 本文档基于现有产假计算器项目的自文档化架构标准编写，保持了项目的技术一致性和文档规范性。
