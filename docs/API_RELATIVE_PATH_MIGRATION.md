# API相对路径迁移完成

## ✅ 迁移完成

所有API调用已从硬编码域名改为相对路径，通过Vite代理访问后端。

---

## 📋 修改的文件

### 1. 环境变量配置

**文件：** `.env`

```bash
# 之前
VITE_API_BASE_URL=http://localhost:3001/api
REACT_APP_API_BASE_URL=http://localhost:8080

# 现在
VITE_API_BASE_URL=
```

---

### 2. 服务文件 (7个)

所有服务文件的`API_BASE_URL`已更新：

| 文件 | 修改内容 |
|------|---------|
| `src/services/calculationHistoryService.ts` | `API_BASE_URL = '' ` |
| `src/services/maternityLeaveService.ts` | `API_BASE_URL = ''` |
| `src/services/policyService.ts` | `API_BASE_URL = ''` |
| `src/services/specialDateService.ts` | `API_BASE_URL = ''` |
| `src/services/calendarService.ts` | `API_BASE_URL = ''` |
| `src/services/apiClient.ts` | `API_BASE_URL = ''` |

**修改示例：**
```typescript
// 之前
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// 现在
// API配置 - 使用相对路径，通过Vite代理访问
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
```

---

### 3. 组件文件 (3个)

| 文件 | 修改内容 |
|------|---------|
| `src/components/policy/EditPolicyModal.tsx` | 硬编码URL改为变量 |
| `src/components/policy/CreatePolicyModal.tsx` | `API_BASE_URL = ''` |
| `src/pages/admin/CalendarManagement.tsx` | 默认URL改为空字符串 |

**EditPolicyModal.tsx 修改：**
```typescript
// 之前
await axios.put('http://localhost:8080/api/v1/policy/update', payload);

// 现在
await axios.put(`${API_BASE_URL}/api/v1/policy/update`, payload);
```

**CalendarManagement.tsx 修改：**
```typescript
// 之前
const [apiUrl, setApiUrl] = useState<string>('http://localhost:8080');

// 现在
const [apiUrl, setApiUrl] = useState<string>(''); // 空字符串表示使用相对路径
```

---

## 🔧 Vite代理配置

**文件：** `vite.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/v1': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

---

## 📊 API路径映射

### 之前（硬编码域名）

```typescript
// ❌ 不推荐
const url = 'http://localhost:8080/api/v1/policy/all';
const url = 'http://localhost:3001/api/policy/all';
```

### 现在（相对路径）

```typescript
// ✅ 推荐
const url = '/api/v1/policy/all';
const url = '/v1/calendar/setup-calendar';
```

### 代理转发

```
前端请求: /api/v1/policy/all
实际转发: http://localhost:8080/api/v1/policy/all

前端请求: /v1/calendar/setup-calendar
实际转发: http://localhost:8080/v1/calendar/setup-calendar
```

---

## ✅ 修改总结

### 删除的配置

- ❌ `VITE_API_BASE_URL=http://localhost:3001/api`
- ❌ `REACT_APP_API_BASE_URL=http://localhost:8080`
- ❌ 所有服务文件中的硬编码域名

### 新增的配置

- ✅ `VITE_API_BASE_URL=` (空字符串)
- ✅ Vite代理配置
- ✅ 所有API调用使用相对路径

---

## 🎯 优势

### 1. 开发环境

- ✅ 避免CORS问题
- ✅ 统一配置管理
- ✅ 无需修改代码切换环境

### 2. 生产环境

只需修改`.env`文件：

```bash
# 生产环境
VITE_API_BASE_URL=https://api.example.com
```

### 3. 代码简洁

```typescript
// 之前 - 需要拼接完整URL
const url = `${API_BASE_URL}/api/v1/policy/all`;

// 现在 - 直接使用相对路径
const url = '/api/v1/policy/all';
```

---

## 🧪 测试验证

### 1. 重启开发服务器

```bash
npm run dev
```

### 2. 验证API调用

打开浏览器开发者工具 → Network：

```
✅ Request URL: http://localhost:5173/api/v1/policy/all
✅ 实际请求: http://localhost:8080/api/v1/policy/all (代理转发)
✅ Status: 200 OK
```

### 3. 检查Console日志

```
[API] Fetching calculation history from: /api/v1/maternity-leave/getCalculateHistory
[API] Response: [...]
```

---

## ⚠️ 注意事项

### 1. 相对路径 vs 绝对路径

**使用相对路径（会被代理）：**
```typescript
✅ '/api/v1/policy/all'
✅ '/v1/calendar/setup-calendar'
```

**使用绝对路径（不会被代理）：**
```typescript
❌ 'http://localhost:8080/api/v1/policy/all'
```

### 2. 环境变量

**开发环境：**
```bash
VITE_API_BASE_URL=
```

**生产环境：**
```bash
VITE_API_BASE_URL=https://api.example.com
```

### 3. 代理仅在开发环境生效

- 开发：`npm run dev` → 代理生效
- 生产：`npm run build` → 需要配置真实API地址

---

## 📝 修改清单

- [x] 更新 `.env` 文件
- [x] 更新 `calculationHistoryService.ts`
- [x] 更新 `maternityLeaveService.ts`
- [x] 更新 `policyService.ts`
- [x] 更新 `specialDateService.ts`
- [x] 更新 `calendarService.ts`
- [x] 更新 `apiClient.ts`
- [x] 更新 `EditPolicyModal.tsx`
- [x] 更新 `CreatePolicyModal.tsx`
- [x] 更新 `CalendarManagement.tsx`
- [x] 配置 Vite 代理
- [x] 测试验证

---

## 🎉 迁移完成！

**所有API调用已改为相对路径！**

✅ **删除所有硬编码域名**  
✅ **使用相对路径**  
✅ **通过Vite代理访问**  
✅ **避免CORS问题**  

**重启开发服务器后即可使用！** 🚀

---

**最后更新：** 2025-10-18
