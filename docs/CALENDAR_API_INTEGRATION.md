# 日历API集成说明

## ✅ 已完成的集成

### 1. API服务集成 (`src/services/calendarService.ts`)

已实现真实的API调用，替换了之前的Mock实现。

#### 核心功能

```typescript
async batchUpdateCalendar(
  calendar: Calendar, 
  calendarCode: string = 'CN',
  apiBaseUrl?: string
): Promise<CalendarSetupResponse>
```

**参数说明：**
- `calendar`: 日历数据对象
- `calendarCode`: 日历代码（默认'CN'）
- `apiBaseUrl`: 自定义API地址（可选，默认使用环境变量）

**数据转换：**
- 自动将前端Calendar格式转换为后端API所需格式
- 节假日：`isWorkday === false` 的日期
- 调班日：周末但 `isWorkday === true` 的日期

### 2. 页面UI集成 (`src/pages/admin/CalendarManagement.tsx`)

#### 新增功能

1. **API配置面板**
   - 可显示/隐藏配置面板
   - 支持自定义API地址
   - 支持自定义日历代码
   - 实时显示将要调用的API地址

2. **保存功能增强**
   - 调用真实API保存日历
   - 显示保存结果（节假日数量、调班日数量）
   - 完整的错误处理和提示

---

## 🔧 API规范

### 请求接口

**端点：** `POST /v1/calendar/setup-calendar`

**请求头：**
```
Content-Type: application/json
```

**请求体：**
```json
{
  "calendarCode": "CN",
  "publicHolidays": [
    {
      "calendarDate": "2025-01-01",
      "description": "元旦"
    }
  ],
  "extraWorkdays": [
    {
      "calendarDate": "2025-02-07",
      "description": "春节-调班"
    }
  ]
}
```

### 响应接口

**成功响应：** `200 OK`

```json
{
  "calendarCode": "CN",
  "publicHolidays": [
    {
      "calendarDate": "2025-01-01",
      "description": "元旦"
    }
  ],
  "extraWorkdays": [
    {
      "calendarDate": "2025-02-07",
      "description": "春节-调班"
    }
  ]
}
```

**错误响应：** `4xx/5xx`

```json
{
  "error": "错误信息"
}
```

---

## 📋 使用指南

### 1. 配置API地址

#### 方式一：环境变量（推荐）

在 `.env` 文件中配置：

```bash
VITE_API_BASE_URL=http://localhost:8080
```

#### 方式二：页面配置

1. 访问日历管理页面
2. 点击"显示API配置"按钮
3. 修改API地址和日历代码
4. 保存时将使用新配置

### 2. 编辑和保存日历

#### 步骤：

1. **进入编辑模式**
   - 点击"编辑日历"按钮
   - 页面进入编辑状态

2. **编辑日期**
   - 点击任意月份查看详情
   - 在弹窗中修改日期类型和描述
   - 支持设置：正常工作日、节假日、调班日

3. **保存更改**
   - 点击"保存整年"按钮
   - 系统自动调用API保存
   - 显示保存结果

### 3. API配置示例

#### 默认配置
```
API地址: http://localhost:8080
日历代码: CN
完整URL: http://localhost:8080/v1/calendar/setup-calendar
```

#### 自定义配置
```
API地址: http://api.example.com
日历代码: US
完整URL: http://api.example.com/v1/calendar/setup-calendar
```

---

## 🔍 数据转换逻辑

### 前端 → 后端

```typescript
// 前端Calendar格式
{
  months: [
    {
      days: [
        {
          date: "2025-01-01",
          isWorkday: false,
          description: "元旦"
        }
      ]
    }
  ]
}

// 转换为后端API格式
{
  calendarCode: "CN",
  publicHolidays: [
    {
      calendarDate: "2025-01-01",
      description: "元旦"
    }
  ],
  extraWorkdays: []
}
```

### 转换规则

| 前端字段 | 后端字段 | 条件 |
|---------|---------|------|
| `date` | `calendarDate` | - |
| `description` | `description` | - |
| `isWorkday: false` | `publicHolidays` | 节假日 |
| `isWorkday: true` | `extraWorkdays` | 周末调班 |

---

## 🧪 测试验证

### 1. 本地测试

#### 启动后端服务
```bash
# 确保后端服务运行在 http://localhost:8080
```

#### 启动前端服务
```bash
npm run dev
```

#### 测试步骤
1. 访问 `http://localhost:5173/admin/calendar`
2. 点击"显示API配置"
3. 确认API地址为 `http://localhost:8080`
4. 点击"编辑日历"
5. 修改某个日期为节假日
6. 点击"保存整年"
7. 查看控制台日志和响应

### 2. 查看请求日志

打开浏览器开发者工具，查看：

**Console日志：**
```
[API] Saving calendar to: http://localhost:8080/v1/calendar/setup-calendar
[API] Request body: { ... }
[API] Response: { ... }
```

**Network请求：**
- 请求URL
- 请求方法：POST
- 请求体
- 响应状态
- 响应数据

### 3. 测试用例

#### 测试用例1：保存节假日
```
操作：设置2025-01-01为"元旦"节假日
预期：publicHolidays包含该日期
```

#### 测试用例2：保存调班日
```
操作：设置2025-02-08（周六）为调班日
预期：extraWorkdays包含该日期
```

#### 测试用例3：混合保存
```
操作：同时设置多个节假日和调班日
预期：正确分类到publicHolidays和extraWorkdays
```

---

## 🐛 错误处理

### 常见错误

#### 1. 网络错误
```
错误：Failed to fetch
原因：后端服务未启动或地址错误
解决：检查后端服务状态和API地址
```

#### 2. CORS错误
```
错误：CORS policy blocked
原因：后端未配置CORS
解决：后端添加CORS配置
```

#### 3. 400错误
```
错误：API请求失败: 400 Bad Request
原因：请求数据格式错误
解决：检查日期格式和必填字段
```

#### 4. 500错误
```
错误：API请求失败: 500 Internal Server Error
原因：后端处理异常
解决：查看后端日志
```

### 错误处理流程

```typescript
try {
  const response = await calendarApi.batchUpdateCalendar(...);
  // 成功处理
} catch (err: any) {
  // 错误处理
  const errorMessage = err.message || '保存日历失败';
  setError(errorMessage);
  alert(`保存失败：${errorMessage}`);
}
```

---

## 📊 数据示例

### 完整请求示例

```json
{
  "calendarCode": "CN",
  "publicHolidays": [
    {
      "calendarDate": "2025-01-01",
      "description": "元旦"
    },
    {
      "calendarDate": "2025-01-28",
      "description": "春节"
    },
    {
      "calendarDate": "2025-01-29",
      "description": "春节"
    },
    {
      "calendarDate": "2025-01-30",
      "description": "春节"
    },
    {
      "calendarDate": "2025-01-31",
      "description": "春节"
    },
    {
      "calendarDate": "2025-02-01",
      "description": "春节"
    },
    {
      "calendarDate": "2025-02-02",
      "description": "春节"
    },
    {
      "calendarDate": "2025-02-03",
      "description": "春节"
    }
  ],
  "extraWorkdays": [
    {
      "calendarDate": "2025-01-26",
      "description": "春节-调班"
    },
    {
      "calendarDate": "2025-02-08",
      "description": "春节-调班"
    }
  ]
}
```

---

## 🚀 部署配置

### 开发环境
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080
```

### 测试环境
```bash
# .env.staging
VITE_API_BASE_URL=https://api-staging.example.com
```

### 生产环境
```bash
# .env.production
VITE_API_BASE_URL=https://api.example.com
```

---

## 📝 注意事项

### 1. 数据一致性
- 保存前会遍历整年所有日期
- 只保存有描述的特殊日期
- 普通工作日和周末不会发送到后端

### 2. 性能优化
- 批量保存整年数据，一次API调用
- 避免频繁的单日期更新
- 前端缓存编辑状态

### 3. 安全性
- 建议添加认证Token
- 验证用户权限
- 记录操作日志

### 4. 兼容性
- 支持自定义API地址
- 支持多个日历代码（CN、US等）
- 向后兼容旧版数据格式

---

## ✅ 集成检查清单

- [x] API服务实现
- [x] 数据转换逻辑
- [x] 页面UI集成
- [x] API配置面板
- [x] 错误处理
- [x] 成功提示
- [x] 环境变量配置
- [x] 文档说明

---

## 🎉 总结

日历API已完全集成，支持：
- ✅ 真实API调用
- ✅ 自定义配置
- ✅ 完整错误处理
- ✅ 用户友好提示
- ✅ 灵活的部署配置

可以开始使用了！
