# 产假计算和生育补贴管理系统 - 前端设置指南

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制环境变量配置文件：
```bash
cp .env.example .env
```

根据实际情况修改 `.env` 文件中的配置：
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development
VITE_APP_TITLE=产假计算和生育补贴管理系统
VITE_DEBUG=true
```

### 3. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 4. 构建生产版本

```bash
npm run build
```

### 5. 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
src/
├── components/          # 可复用组件
│   ├── auth/           # 认证相关组件
│   ├── common/         # 通用组件
│   └── layout/         # 布局组件
├── contexts/           # React上下文
├── pages/              # 页面组件
│   ├── auth/          # 认证页面
│   └── admin/         # 管理员页面
├── router/             # 路由配置
├── services/           # API服务
├── types/              # TypeScript类型定义
├── utils/              # 工具函数
└── styles/             # 样式文件
```

## 🔐 用户角色和权限

### 角色类型
- **USER**: 普通用户 - 可以使用计算功能和查看个人历史
- **ADMIN**: 管理员 - 可以管理政策、查看所有数据
- **SUPER_ADMIN**: 超级管理员 - 拥有所有权限

### 默认登录账号（开发环境）
- 超级管理员: `admin` / `admin123`
- 管理员: `hr_manager` / `hr123`
- 普通用户: `employee1` / `emp123`

## 🛠️ 开发工具

### 代码检查
```bash
npm run lint
```

### 类型检查
```bash
npx tsc --noEmit
```

## 📋 功能模块

### 1. 认证模块
- 用户登录/登出
- 基于角色的权限控制
- Token自动刷新

### 2. 仪表盘
- 数据统计概览
- 快捷操作入口
- 最近计算记录

### 3. 产假计算
- 多城市政策支持
- 实时计算结果
- 详细计算说明

### 4. 计算历史
- 个人计算记录
- 搜索和筛选
- 数据导出

### 5. 管理功能（管理员）
- 政策管理
- 用户管理
- 公司设置

## 🔧 技术栈

- **前端框架**: React 19 + TypeScript
- **路由**: React Router v6
- **状态管理**: React Context + useReducer
- **样式**: Tailwind CSS
- **图标**: Heroicons
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **代码质量**: ESLint + TypeScript

## 📝 开发注意事项

1. **类型安全**: 所有组件都使用TypeScript，确保类型安全
2. **响应式设计**: 支持桌面端和移动端
3. **权限控制**: 基于用户角色的页面和功能访问控制
4. **错误处理**: 统一的错误处理和用户反馈
5. **性能优化**: 懒加载、代码分割等优化措施

## 🐛 常见问题

### Q: 启动时提示依赖缺失？
A: 运行 `npm install` 安装所有依赖

### Q: API请求失败？
A: 检查 `.env` 文件中的 `VITE_API_BASE_URL` 配置是否正确

### Q: 登录后页面空白？
A: 检查浏览器控制台错误信息，确保后端API服务正常运行

### Q: 样式显示异常？
A: 确保Tailwind CSS配置正确，运行 `npm run build` 重新构建

## 📞 技术支持

如有问题，请联系开发团队或查看项目文档。
