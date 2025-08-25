# 产假计算器 (Maternity Leave Calculator)

一个基于 React + TypeScript + Vite 的现代化产假计算工具，支持全国主要城市的最新产假政策。

## 🚀 项目特色

- **现代化技术栈**: React 19 + TypeScript 5.8 + Vite 7
- **响应式设计**: 基于 Tailwind CSS 的现代化 UI
- **自文档化代码**: 详细的中英文注释和完整的类型定义
- **政策数据完整**: 覆盖北京、上海、广州、深圳等主要城市
- **计算精确**: 基于最新法规的精确计算逻辑
- **用户友好**: 直观的界面和详细的结果展示

## 📋 功能特性

### 核心功能
- ✅ 基础产假天数计算
- ✅ 多胞胎、难产等额外假期计算
- ✅ 生育津贴预估
- ✅ 多地区政策支持
- ✅ 实时表单验证
- ✅ 详细计算说明

### 支持地区
- 北京市 (128天基础 + 额外假期)
- 上海市 (158天基础 + 额外假期)
- 广州市 (178天基础 + 额外假期)
- 深圳市 (178天基础 + 额外假期)
- 杭州市 (158天基础 + 额外假期)
- 南京市 (158天基础 + 额外假期)
- 其他地区 (98天国家标准)

## 🛠️ 技术架构

### 技术栈
- **前端框架**: React 19.1.1
- **类型系统**: TypeScript 5.8.3
- **构建工具**: Vite 7.1.2
- **样式框架**: Tailwind CSS 3.x
- **代码质量**: ESLint 9.x
- **包管理**: npm

### 项目结构
```
src/
├── components/          # 可复用组件
│   ├── common/         # 通用组件 (Button, Input 等)
│   └── calculator/     # 计算器专用组件
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── utils/              # 工具函数
│   ├── calculations/   # 计算逻辑
│   └── formatters/     # 格式化工具
├── types/              # TypeScript 类型定义
├── constants/          # 常量和政策数据
└── styles/             # 样式文件
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装和运行
```bash
# 克隆项目
git clone <repository-url>
cd maternity-leave-mfe

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

### 开发服务器
启动后访问 http://localhost:5173 查看应用。

## 📖 使用指南

### 基本使用
1. **填写基本信息**
   - 选择入职日期
   - 选择预产期或生产日期
   - 选择所在地区
   - 选择就业类型

2. **配置高级选项** (可选)
   - 勾选多胞胎选项
   - 勾选难产选项
   - 填写年龄信息

3. **查看计算结果**
   - 总产假天数
   - 假期时间安排
   - 生育津贴预估
   - 详细计算说明

### 计算依据
- 《女职工劳动保护特别规定》
- 各地人口与计划生育条例
- 社会保险相关政策法规

## 🏗️ 开发指南

### 代码规范
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件采用函数式编程
- 使用自定义 Hooks 管理状态

### 组件开发
```typescript
// 组件模板
export const ComponentName: React.FC<Props> = ({
  prop1,
  prop2,
  ...props
}) => {
  // 组件逻辑
  return (
    <div className="component-styles">
      {/* 组件内容 */}
    </div>
  );
};
```

### 添加新政策
1. 在 `src/constants/policies.ts` 中添加政策数据
2. 更新 `RegionCode` 类型定义
3. 在 `REGION_OPTIONS` 中添加选项
4. 测试计算逻辑

## ⚠️ 免责声明

本工具提供的计算结果仅供参考，实际执行请以当地人力资源和社会保障部门的最新政策为准。

## 📞 联系我们

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 参与讨论

---

**注意**: 政策数据基于公开资料整理，如有变动请以官方最新政策为准。

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
