# Bug修复：getCityPolicy 导出问题

## 🐛 问题描述

```
Uncaught SyntaxError: The requested module '/src/constants/policies.ts' 
does not provide an export named 'getCityPolicy' (at EnhancedCalculator.tsx:52:10)
```

## 🔍 原因分析

`EnhancedCalculator.tsx` 和 `PolicyComparison.tsx` 尝试从 `constants/policies.ts` 导入 `getCityPolicy` 函数，但该文件中没有导出这个函数。

## ✅ 解决方案

在 `src/constants/policies.ts` 中添加了：

### 1. 简化的城市政策接口

```typescript
export interface SimpleCityPolicy {
  cityCode: string;
  cityName: string;
  basicMaternityLeave: number;          // 基础产假
  extendedMaternityLeave: number;       // 延长产假
  difficultBirthExtraLeave: number;     // 难产额外假
  multipleBirthExtraLeave: number;      // 多胎额外假
  paternityLeave: number;               // 陪产假
  lateMarriageLeave?: number;           // 晚婚假（可选）
}
```

### 2. 13个城市的政策数据

```typescript
export const CITY_POLICIES: Record<string, SimpleCityPolicy> = {
  beijing: {
    cityCode: 'beijing',
    cityName: '北京',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 60,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
    lateMarriageLeave: 30,
  },
  shanghai: { ... },
  guangzhou: { ... },
  // ... 其他10个城市
};
```

### 3. getCityPolicy 函数

```typescript
export const getCityPolicy = (cityCode: string): SimpleCityPolicy => {
  return CITY_POLICIES[cityCode] || {
    cityCode: 'default',
    cityName: '默认',
    basicMaternityLeave: 98,
    extendedMaternityLeave: 30,
    difficultBirthExtraLeave: 15,
    multipleBirthExtraLeave: 15,
    paternityLeave: 15,
  };
};
```

## 📊 支持的城市列表

| 城市 | 总产假 | 难产假 | 陪产假 |
|------|--------|--------|--------|
| 北京 | 158天 | +15天 | 15天 |
| 上海 | 158天 | +15天 | 10天 |
| 广州 | 178天 | +30天 | 15天 |
| 深圳 | 178天 | +30天 | 15天 |
| 天津 | 158天 | +15天 | 15天 |
| 南京 | 128天 | +15天 | 15天 |
| 杭州 | 128天 | +15天 | 15天 |
| 济南 | 158天 | +15天 | 15天 |
| 青岛 | 158天 | +15天 | 15天 |
| 武汉 | 158天 | +15天 | 15天 |
| 长沙 | 158天 | +15天 | 15天 |
| 重庆 | 128天 | +15天 | 15天 |
| 成都 | 158天 | +15天 | 20天 |

## 🎯 使用方式

```typescript
import { getCityPolicy } from '../constants/policies';

// 获取北京的政策
const policy = getCityPolicy('beijing');
console.log(policy.basicMaternityLeave);  // 98
console.log(policy.extendedMaternityLeave);  // 60

// 获取不存在的城市（返回默认政策）
const defaultPolicy = getCityPolicy('unknown');
console.log(defaultPolicy.cityName);  // '默认'
```

## ✅ 测试验证

1. **增强版计算器** - 可以正常选择城市并显示政策
2. **政策对比页面** - 可以正常对比多个城市的政策
3. **所有13个城市** - 都有完整的政策数据

## 📝 注意事项

### 政策数据来源
- 基础产假：98天（国家统一规定）
- 延长产假：各地不同（30-80天）
- 难产假：各地不同（15-30天）
- 多胎假：大部分地区为15天/胎
- 陪产假：各地不同（10-20天）

### 数据更新
政策数据基于2024年最新规定，实际执行时请以当地最新政策为准。

## 🔄 后续优化

- [ ] 从后端API动态获取政策数据
- [ ] 添加政策版本管理
- [ ] 支持政策历史查询
- [ ] 添加政策变更通知

## ✅ 问题已解决

现在可以正常使用增强版计算器和政策对比功能了！
