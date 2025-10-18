# 计算历史API集成说明

## ✅ 集成完成

计算历史查询功能已成功集成真实的后端API。

---

## 📋 完成的工作

### 1. **API服务层** (`src/services/calculationHistoryService.ts`)

✅ 创建完整的API服务
- `getCalculateHistory()` - 获取所有历史记录
- `getCalculateHistoryById()` - 根据ID获取单条记录
- 支持查询参数过滤
- 完整的错误处理

### 2. **页面UI层** (`src/pages/CalculationHistory.tsx`)

✅ 更新页面以使用真实API
- 调用真实API获取数据
- 显示完整的记录信息
- 详情对话框展示
- 错误提示
- 筛选和搜索功能

---

## 🔧 API规范

### 请求

```bash
GET http://localhost:8080/api/v1/maternity-leave/getCalculateHistory
```

**查询参数（可选）：**
- `staffName` - 员工姓名
- `cityCode` - 城市代码
- `startDate` - 开始日期 (YYYY-MM-DD)
- `endDate` - 结束日期 (YYYY-MM-DD)
- `page` - 页码
- `pageSize` - 每页数量

### 响应

```json
[
  {
    "id": 1,
    "staffName": "张三",
    "cityCode": "Shanghai",
    "leaveStartDate": "2023-10-15",
    "leaveDetail": {
      "leaveStartDate": "2023-10-15",
      "leaveEndDate": "2024-04-16",
      "currentLeaveDays": 184,
      "abortionLeaveDays": 0,
      "statutoryLeaveDays": 98,
      "dystociaLeaveDays": 15,
      "moreInfantLeaveDays": 0,
      "otherExtendedLeaveDays": 60,
      "totalLeaveDays": 0
    },
    "allowanceDetail": {
      "allowance": 142200.00,
      "compensation": 29504.31,
      "firstMonthSalary": 8608.71,
      "lastMonthSalary": 14086.98,
      "otherMonthSalary": 90000,
      "totalSalary": 112695.69
    },
    "calculateComments": {
      "descriptionList": [
        "假期计算开始",
        "进入计算产假流程",
        ...
      ]
    },
    "abortion": false
  }
]
```

---

## 🎯 核心功能

### 1. 数据展示

**列表视图：**
- 计算ID
- 员工姓名
- 城市
- 产假类型
- 总天数
- 津贴金额
- 计算时间
- 操作按钮

### 2. 详情对话框

**包含四个部分：**

#### 基本信息
- 员工姓名
- 城市
- 休假开始日期
- 计算类型

#### 假期详情
- 休假开始/结束日期
- 当前休假天数
- 法定产假
- 难产假
- 多胎假
- 其他延长假
- 流产假（如适用）

#### 津贴详情
- 生育津贴
- 补差金额
- 第一个月工资
- 最后一个月工资
- 其他月份工资
- 总工资

#### 计算说明
- 详细的计算步骤列表
- 每一步的说明

### 3. 筛选功能

- **搜索**：按员工姓名搜索
- **城市筛选**：按城市代码筛选
- **日期范围**：按开始/结束日期筛选
- **快速筛选**：今天/最近一周/最近一月/最近三月

---

## 📊 使用流程

```
1. 访问历史记录页面
   ↓
2. 查看所有记录列表
   ↓
3. 使用筛选条件（可选）
   ↓
4. 点击"查看"按钮
   ↓
5. 查看详细信息
   ↓
6. 关闭对话框
```

---

## 🧪 测试验证

### 快速测试

```bash
# 1. 启动后端（确保运行在8080端口）
# 2. 启动前端
npm run dev

# 3. 访问
http://localhost:5173/history

# 4. 查看历史记录
```

### 验证要点

- ✅ 列表正确显示
- ✅ 数据字段映射正确
- ✅ 详情对话框显示完整
- ✅ 筛选功能正常
- ✅ 错误处理友好
- ✅ Console日志正确

---

## 📁 相关文件

```
src/
├── services/
│   └── calculationHistoryService.ts  # API服务层
├── pages/
│   └── CalculationHistory.tsx        # 页面UI层
└── constants/
    └── supportedCities.ts            # 城市列表

docs/
└── HISTORY_API_INTEGRATION.md        # 集成说明
```

---

## 🎨 UI功能

### 列表视图

```
┌─────────────────────────────────────────────────────────┐
│ 计算历史记录                                             │
├─────────────────────────────────────────────────────────┤
│ [搜索] [开始日期] [结束日期] [城市] [导出]              │
├─────────────────────────────────────────────────────────┤
│ ID  │ 用户  │ 城市  │ 类型  │ 天数 │ 津贴   │ 操作      │
│ #1  │ 张三  │ 上海  │ 难产  │ 184  │ ¥142K │ [查看]    │
│ #2  │ 李四  │ 北京  │ 标准  │ 158  │ ¥95K  │ [查看]    │
└─────────────────────────────────────────────────────────┘
```

### 详情对话框

```
┌─────────────────────────────────────────┐
│ 计算详情 - 张三                    [X]  │
├─────────────────────────────────────────┤
│ 📋 基本信息                              │
│ 员工：张三  城市：上海                   │
│                                          │
│ 📅 假期详情                              │
│ 开始：2023-10-15  结束：2024-04-16      │
│ 总天数：184天                            │
│                                          │
│ 💰 津贴详情                              │
│ 生育津贴：¥142,200                       │
│ 总工资：¥112,695.69                      │
│                                          │
│ 📝 计算说明                              │
│ 1. 假期计算开始                          │
│ 2. 进入计算产假流程                      │
│ ...                                      │
│                                          │
│                          [关闭]          │
└─────────────────────────────────────────┘
```

---

## 🔍 数据映射

### 后端 → 前端

| 后端字段 | 前端显示 | 说明 |
|---------|---------|------|
| `id` | 计算ID | 数字ID |
| `staffName` | 员工姓名 | 直接显示 |
| `cityCode` | 城市 | 转换为中文名称 |
| `leaveDetail.currentLeaveDays` | 总天数 | 显示天数 |
| `allowanceDetail.allowance` | 津贴金额 | 格式化货币 |
| `leaveStartDate` | 计算时间 | 日期格式 |

### 计算类型判断

```typescript
if (record.abortion) return '流产假';
if (record.leaveDetail.dystociaLeaveDays > 0) return '难产产假';
if (record.leaveDetail.moreInfantLeaveDays > 0) return '多胎产假';
return '标准产假';
```

---

## ⚙️ 配置

### 环境变量

```bash
# .env
VITE_API_BASE_URL=http://localhost:8080
```

### API地址

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
```

---

## 🐛 错误处理

### 网络错误

```typescript
try {
  const data = await calculationHistoryService.getCalculateHistory(params);
  setRecords(data);
} catch (err: any) {
  const errorMessage = err.message || '加载计算历史失败';
  setError(errorMessage);
}
```

### 错误提示

```jsx
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
    <strong>错误：</strong> {error}
  </div>
)}
```

---

## 📝 注意事项

### 1. 城市代码

- 后端返回：`Shanghai`（英文）
- 前端显示：`上海`（中文）
- 需要通过 `SUPPORTED_CITIES` 转换

### 2. 日期格式

- 后端：`2023-10-15`
- 前端：直接显示或格式化

### 3. 金额格式

- 使用 `toLocaleString()` 格式化
- 显示千位分隔符

### 4. 分页

- 当前实现：前端分页
- 建议：后端分页（大数据量时）

---

## 🚀 下一步优化

### 短期
- [ ] 添加导出功能
- [ ] 添加打印功能
- [ ] 优化移动端显示

### 中期
- [ ] 后端分页支持
- [ ] 高级筛选功能
- [ ] 批量操作

### 长期
- [ ] 数据分析图表
- [ ] 导出PDF报告
- [ ] 历史记录对比

---

## ✅ 集成检查清单

- [x] API服务实现
- [x] 页面UI集成
- [x] 数据映射正确
- [x] 详情对话框
- [x] 筛选功能
- [x] 错误处理
- [x] 响应式设计
- [x] 文档说明

---

## 🎉 总结

**计算历史API集成已完成！**

✅ **功能完整** - 支持查询、筛选、详情查看
✅ **数据准确** - 完整映射后端数据
✅ **用户友好** - 清晰的UI和详细的信息展示
✅ **错误处理** - 完善的错误提示

**可以开始使用了！** 🚀

---

## 📞 访问地址

```
http://localhost:5173/history
```

**API端点：**
```
GET http://localhost:8080/api/v1/maternity-leave/getCalculateHistory
```
