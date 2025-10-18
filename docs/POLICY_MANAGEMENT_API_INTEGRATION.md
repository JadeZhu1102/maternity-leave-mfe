# 政策管理API集成说明

## ✅ 集成完成

PolicyManagement页面已成功集成真实API，Mock数据已注释。

---

## 📋 完成的工作

### 1. **导入真实API服务** ✓

```typescript
import { getAllPolicies, type PolicyData } from '../../services/policyService';
```

### 2. **更新loadPolicies函数** ✓

**之前（Mock数据）：**
```typescript
const loadPolicies = async () => {
  setIsLoading(true);
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockPolicies: CityPolicy[] = [...]; // 硬编码的Mock数据
    setPolicies(mockPolicies);
  } catch (error) {
    console.error('加载政策数据失败:', error);
  } finally {
    setIsLoading(false);
  }
};
```

**现在（真实API）：**
```typescript
const loadPolicies = async () => {
  setIsLoading(true);
  try {
    // 调用真实API获取所有政策
    const apiPolicies = await getAllPolicies();
    
    // 将API数据转换为组件需要的格式
    const formattedPolicies: CityPolicy[] = apiPolicies.map((policy, index) => ({
      id: String(index + 1),
      cityName: policy.cityName,
      statutoryPolicy: {
        leaveDays: policy.statutoryPolicy.leaveDays,
        maxLeaveDays: policy.statutoryPolicy.maxLeaveDays,
        delayForPublicHoliday: policy.statutoryPolicy.delayForPublicHoliday,
        calendarDay: policy.statutoryPolicy.calendarDay,
        bonusLeaveDays: policy.statutoryPolicy.maxLeaveDays - policy.statutoryPolicy.leaveDays
      },
      dystociaPolicy: {
        standardLeaveDays: policy.dystociaPolicy.standardLeaveDays,
        delayForPublicHoliday: policy.dystociaPolicy.delayForPublicHoliday,
        calendarDay: policy.dystociaPolicy.calendarDay
      },
      moreInfantPolicy: {
        leaveDays: policy.moreInfantPolicy.leaveDays,
        delayForPublicHoliday: policy.moreInfantPolicy.delayForPublicHoliday,
        calendarDay: policy.moreInfantPolicy.calendarDay
      },
      isActive: true,
      effectiveDate: policy.effectiveDate,
      createdAt: policy.lastUpdated,
      updatedAt: policy.lastUpdated
    }));

    setPolicies(formattedPolicies);
  } catch (error) {
    console.error('加载政策数据失败:', error);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. **Mock数据已注释** ✓

所有Mock数据已被注释保留，方便将来参考：

```typescript
// Mock数据已注释
// const mockPolicies: CityPolicy[] = [
//   {
//     id: '1',
//     cityName: '北京',
//     statutoryPolicy: { ... },
//     ...
//   },
//   ...
// ];
```

---

## 🔧 API调用

### API端点

```
GET /api/v1/policy/all
```

### 响应格式

```json
[
  {
    "cityCode": "Beijing",
    "cityName": "北京",
    "statutoryPolicy": {
      "leaveDays": 98,
      "maxLeaveDays": 128,
      "delayForPublicHoliday": true,
      "calendarDay": false
    },
    "dystociaPolicy": {
      "standardLeaveDays": 15,
      "delayForPublicHoliday": true,
      "calendarDay": false
    },
    "moreInfantPolicy": {
      "leaveDays": 15,
      "extraInfantLeaveDays": 15,
      "delayForPublicHoliday": true,
      "calendarDay": false
    },
    "effectiveDate": "2023-01-01",
    "lastUpdated": "2023-01-01T00:00:00Z"
  }
]
```

---

## 📊 数据映射

### API → 组件格式

| API字段 | 组件字段 | 说明 |
|---------|---------|------|
| `cityName` | `cityName` | 城市名称 |
| `statutoryPolicy.leaveDays` | `statutoryPolicy.leaveDays` | 法定产假天数 |
| `statutoryPolicy.maxLeaveDays` | `statutoryPolicy.maxLeaveDays` | 最大产假天数 |
| `maxLeaveDays - leaveDays` | `statutoryPolicy.bonusLeaveDays` | 奖励假天数（计算得出） |
| `dystociaPolicy.standardLeaveDays` | `dystociaPolicy.standardLeaveDays` | 难产假天数 |
| `moreInfantPolicy.leaveDays` | `moreInfantPolicy.leaveDays` | 多胎假天数 |
| `effectiveDate` | `effectiveDate` | 生效日期 |
| `lastUpdated` | `createdAt`, `updatedAt` | 更新时间 |

---

## 🎯 功能说明

### 1. 加载政策列表

**触发时机：** 页面加载时自动调用

**流程：**
```
页面加载
  ↓
调用 getAllPolicies()
  ↓
获取API数据
  ↓
转换数据格式
  ↓
显示政策列表
```

### 2. 搜索功能

**前端过滤：** 根据城市名称搜索

```typescript
const filteredPolicies = policies.filter(policy =>
  policy.cityName.toLowerCase().includes(searchTerm.toLowerCase())
);
```

### 3. 删除功能

**当前状态：** 本地删除（等待后端API）

```typescript
// TODO: 调用真实API删除政策
// await deletePolicyAPI(policyToDelete);

// 暂时使用本地删除
setPolicies(prev => prev.filter(policy => policy.id !== policyToDelete));
```

---

## 📝 待完成功能

### 1. 删除API

**需要后端提供：**
```
DELETE /api/v1/policy/{cityCode}
```

**实现后更新：**
```typescript
const handleDeletePolicy = async () => {
  if (!policyToDelete) return;
  
  try {
    await deletePolicyAPI(policyToDelete);
    loadPolicies(); // 重新加载列表
    console.log('政策删除成功');
  } catch (error) {
    console.error('删除政策失败:', error);
  } finally {
    setShowDeleteDialog(false);
  }
};
```

### 2. 创建/编辑API

**需要后端提供：**
```
POST /api/v1/policy        # 创建政策
PUT  /api/v1/policy/{code} # 更新政策
```

---

## 🧪 测试验证

### 访问页面

```
http://localhost:5173/admin/policies
```

### 验证步骤

1. ✅ 页面加载时显示加载动画
2. ✅ 成功获取并显示所有政策
3. ✅ 搜索功能正常工作
4. ✅ 数据格式正确显示
5. ✅ Console日志正确

### Console日志

```
[API] Fetched all policies: [...]
```

---

## ⚠️ 注意事项

### 1. 数据格式转换

API返回的数据格式与组件需要的格式略有不同，需要进行转换：

- `bonusLeaveDays` 需要计算：`maxLeaveDays - leaveDays`
- `id` 使用索引生成（临时方案）
- `isActive` 默认为true

### 2. ID生成

当前使用索引生成ID，建议后端返回唯一ID：

```typescript
id: String(index + 1)  // 临时方案
// 建议改为：
id: policy.cityCode    // 使用城市代码作为ID
```

### 3. Mock数据保留

Mock数据已注释但保留在代码中，便于：
- 参考数据格式
- 本地开发测试
- 紧急降级方案

---

## ✅ 集成检查清单

- [x] 导入真实API服务
- [x] 更新loadPolicies函数
- [x] 注释Mock数据
- [x] 数据格式转换
- [x] 错误处理
- [x] 测试验证
- [ ] 实现删除API（等待后端）
- [ ] 实现创建API（等待后端）
- [ ] 实现编辑API（等待后端）

---

## 🎉 总结

**政策管理页面已成功集成真实API！**

✅ **已完成：**
- 调用真实API获取政策列表
- Mock数据已注释
- 数据格式正确转换
- 搜索功能正常

⏳ **待完成：**
- 删除API集成（等待后端）
- 创建API集成（等待后端）
- 编辑API集成（等待后端）

**可以开始使用政策管理功能了！** 🚀

---

**最后更新：** 2025-10-18
