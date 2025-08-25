# 项目结构文档 (Project Structure Documentation)

## 概述 (Overview)
这是一个基于 React + TypeScript + Vite 的产假计算器前端项目，采用自文档化管理模式，确保项目结构清晰、代码可维护。

## 技术栈 (Tech Stack)
- **框架**: React 19.1.1 + TypeScript 5.8.3
- **构建工具**: Vite 7.1.2
- **样式**: Tailwind CSS 3.x
- **代码质量**: ESLint 9.x
- **包管理**: npm

## 项目目录结构 (Directory Structure)

```
maternity-leave-mfe/
├── docs/                           # 📚 项目文档目录
│   ├── PROJECT_STRUCTURE.md        # 项目结构说明
│   ├── DEVELOPMENT_GUIDE.md        # 开发指南
│   ├── API_DOCUMENTATION.md        # API 文档
│   └── DEPLOYMENT_GUIDE.md         # 部署指南
├── src/                            # 🎯 源代码目录
│   ├── components/                 # 🧩 可复用组件
│   │   ├── common/                 # 通用组件
│   │   │   ├── Button/             # 按钮组件
│   │   │   ├── Input/              # 输入框组件
│   │   │   ├── Modal/              # 模态框组件
│   │   │   └── Loading/            # 加载组件
│   │   ├── layout/                 # 布局组件
│   │   │   ├── Header/             # 头部组件
│   │   │   ├── Footer/             # 底部组件
│   │   │   └── Sidebar/            # 侧边栏组件
│   │   └── calculator/             # 计算器专用组件
│   │       ├── DatePicker/         # 日期选择器
│   │       ├── PolicySelector/     # 政策选择器
│   │       └── ResultDisplay/      # 结果显示组件
│   ├── pages/                      # 📄 页面组件
│   │   ├── Home/                   # 首页
│   │   ├── Calculator/             # 计算器页面
│   │   ├── About/                  # 关于页面
│   │   └── Help/                   # 帮助页面
│   ├── hooks/                      # 🎣 自定义 Hooks
│   │   ├── useCalculator.ts        # 计算器逻辑 Hook
│   │   ├── useLocalStorage.ts      # 本地存储 Hook
│   │   └── useValidation.ts        # 表单验证 Hook
│   ├── utils/                      # 🛠️ 工具函数
│   │   ├── calculations/           # 计算相关工具
│   │   │   ├── maternity.ts        # 产假计算逻辑
│   │   │   ├── paternity.ts        # 陪产假计算逻辑
│   │   │   └── policies.ts         # 政策数据处理
│   │   ├── formatters/             # 格式化工具
│   │   │   ├── date.ts             # 日期格式化
│   │   │   └── currency.ts         # 货币格式化
│   │   └── validators/             # 验证工具
│   │       ├── form.ts             # 表单验证
│   │       └── date.ts             # 日期验证
│   ├── types/                      # 📝 TypeScript 类型定义
│   │   ├── calculator.ts           # 计算器相关类型
│   │   ├── policy.ts               # 政策相关类型
│   │   └── common.ts               # 通用类型定义
│   ├── constants/                  # 📊 常量定义
│   │   ├── policies.ts             # 政策常量
│   │   ├── routes.ts               # 路由常量
│   │   └── ui.ts                   # UI 常量
│   ├── styles/                     # 🎨 样式文件
│   │   ├── globals.css             # 全局样式
│   │   ├── components.css          # 组件样式
│   │   └── utilities.css           # 工具类样式
│   ├── assets/                     # 🖼️ 静态资源
│   │   ├── images/                 # 图片资源
│   │   ├── icons/                  # 图标资源
│   │   └── fonts/                  # 字体资源
│   ├── App.tsx                     # 🏠 应用主组件
│   ├── main.tsx                    # 🚀 应用入口文件
│   └── vite-env.d.ts              # Vite 环境类型声明
├── public/                         # 🌐 公共静态资源
│   ├── favicon.ico                 # 网站图标
│   └── manifest.json               # PWA 配置
├── tests/                          # 🧪 测试文件
│   ├── components/                 # 组件测试
│   ├── utils/                      # 工具函数测试
│   └── integration/                # 集成测试
├── .github/                        # 🔧 GitHub 配置
│   └── workflows/                  # CI/CD 工作流
├── package.json                    # 📦 项目配置文件
├── tsconfig.json                   # TypeScript 配置
├── vite.config.ts                  # Vite 配置
├── tailwind.config.js              # Tailwind CSS 配置
├── postcss.config.js               # PostCSS 配置
├── eslint.config.js                # ESLint 配置
└── README.md                       # 项目说明文档
```

## 文件命名规范 (File Naming Conventions)

### 组件文件
- **React 组件**: PascalCase (例如: `UserProfile.tsx`)
- **组件目录**: PascalCase (例如: `UserProfile/`)
- **组件样式**: kebab-case (例如: `user-profile.module.css`)

### 工具和配置文件
- **工具函数**: camelCase (例如: `formatDate.ts`)
- **类型定义**: camelCase (例如: `userTypes.ts`)
- **常量文件**: camelCase (例如: `apiConstants.ts`)

### 页面和路由
- **页面组件**: PascalCase (例如: `HomePage.tsx`)
- **页面目录**: PascalCase (例如: `HomePage/`)

## 代码组织原则 (Code Organization Principles)

### 1. 单一职责原则
每个文件和组件都应该有明确的单一职责，便于维护和测试。

### 2. 分层架构
- **展示层**: React 组件负责 UI 渲染
- **逻辑层**: 自定义 Hooks 处理业务逻辑
- **工具层**: 纯函数处理数据转换和计算
- **类型层**: TypeScript 类型确保类型安全

### 3. 模块化设计
- 每个功能模块独立封装
- 通过 index.ts 文件统一导出
- 避免循环依赖

### 4. 自文档化代码
- 使用有意义的变量和函数名
- 添加必要的 JSDoc 注释
- 保持代码结构清晰

## 开发工作流 (Development Workflow)

1. **功能开发**: 在对应的功能目录下开发
2. **类型定义**: 先定义 TypeScript 类型
3. **组件开发**: 基于类型开发 React 组件
4. **测试编写**: 为每个组件和工具函数编写测试
5. **文档更新**: 及时更新相关文档

## 维护指南 (Maintenance Guidelines)

- 定期更新依赖包版本
- 保持代码风格一致性
- 及时更新文档
- 定期重构优化代码结构
