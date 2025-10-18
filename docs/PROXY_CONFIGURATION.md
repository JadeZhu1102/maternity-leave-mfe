# Vite代理配置说明

## ✅ 配置完成

已为前端配置Vite代理，可以访问后端API `http://localhost:8080`

---

## 📋 配置内容

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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

## 🔧 代理规则

### 规则1: /api 路径

**匹配：** 所有以 `/api` 开头的请求

**示例：**
```
前端请求: http://localhost:5173/api/v1/policy/all
实际转发: http://localhost:8080/api/v1/policy/all
```

### 规则2: /v1 路径

**匹配：** 所有以 `/v1` 开头的请求

**示例：**
```
前端请求: http://localhost:5173/v1/calendar/setup-calendar
实际转发: http://localhost:8080/v1/calendar/setup-calendar
```

---

## 📊 API端点映射

### 产假计算API

| 前端请求 | 代理转发 |
|---------|---------|
| `/api/v1/maternity-leave/calculateDate` | `http://localhost:8080/api/v1/maternity-leave/calculateDate` |
| `/api/v1/maternity-leave/calculateMoney` | `http://localhost:8080/api/v1/maternity-leave/calculateMoney` |
| `/api/v1/maternity-leave/saveCalculateHistory` | `http://localhost:8080/api/v1/maternity-leave/saveCalculateHistory` |
| `/api/v1/maternity-leave/getCalculateHistory` | `http://localhost:8080/api/v1/maternity-leave/getCalculateHistory` |

### 政策管理API

| 前端请求 | 代理转发 |
|---------|---------|
| `/api/v1/policy/all` | `http://localhost:8080/api/v1/policy/all` |
| `/api/v1/policy/fetch?cityCode=xxx` | `http://localhost:8080/api/v1/policy/fetch?cityCode=xxx` |
| `/api/v1/policy/update` | `http://localhost:8080/api/v1/policy/update` |

### 日历管理API

| 前端请求 | 代理转发 |
|---------|---------|
| `/api/v1/calendar/special-dates/CN?year=2025` | `http://localhost:8080/api/v1/calendar/special-dates/CN?year=2025` |
| `/v1/calendar/setup-calendar` | `http://localhost:8080/v1/calendar/setup-calendar` |

---

## ⚙️ 配置选项说明

### target
- **作用：** 指定代理的目标服务器
- **值：** `http://localhost:8080`

### changeOrigin
- **作用：** 修改请求头中的Origin字段
- **值：** `true`
- **说明：** 避免CORS问题

### secure
- **作用：** 是否验证SSL证书
- **值：** `false`
- **说明：** 本地开发环境不需要验证

---

## 🚀 使用方法

### 1. 重启开发服务器

配置修改后需要重启Vite开发服务器：

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
npm run dev
```

### 2. 前端代码无需修改

代理配置后，前端代码中的API调用无需修改：

```typescript
// ✅ 正确 - 使用相对路径
const response = await axios.get('/api/v1/policy/all');

// ❌ 错误 - 不要使用完整URL
const response = await axios.get('http://localhost:8080/api/v1/policy/all');
```

### 3. 环境变量配置

`.env` 文件中的配置：

```bash
# 开发环境 - 使用代理
VITE_API_BASE_URL=

# 生产环境 - 使用完整URL
# VITE_API_BASE_URL=https://api.example.com
```

---

## 🧪 测试代理

### 方法1: 浏览器开发者工具

1. 打开浏览器开发者工具 (F12)
2. 切换到 Network 标签
3. 执行API请求
4. 查看请求URL和响应

**预期结果：**
- Request URL: `http://localhost:5173/api/v1/policy/all`
- 实际请求: `http://localhost:8080/api/v1/policy/all`
- Status: 200 OK

### 方法2: Console日志

查看Console中的API日志：

```
[API] Fetching calculation history from: /api/v1/maternity-leave/getCalculateHistory
[API] Response: [...]
```

---

## ⚠️ 注意事项

### 1. 相对路径 vs 绝对路径

**使用相对路径（推荐）：**
```typescript
// ✅ 会被代理
axios.get('/api/v1/policy/all')
```

**使用绝对路径（不会被代理）：**
```typescript
// ❌ 不会被代理，直接请求8080
axios.get('http://localhost:8080/api/v1/policy/all')
```

### 2. 代理仅在开发环境生效

- **开发环境：** `npm run dev` - 代理生效
- **生产环境：** `npm run build` - 代理不生效，需要配置真实API地址

### 3. CORS问题

代理配置可以避免开发环境的CORS问题，但生产环境仍需后端配置CORS：

```javascript
// 后端CORS配置示例
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-domain.com'],
  credentials: true
}));
```

---

## 🔍 故障排查

### 问题1: 代理不生效

**解决方案：**
1. 确认已重启Vite服务器
2. 检查API路径是否以 `/api` 或 `/v1` 开头
3. 确认使用相对路径而非绝对路径

### 问题2: 404错误

**解决方案：**
1. 确认后端服务运行在8080端口
2. 检查API端点路径是否正确
3. 查看后端日志确认请求是否到达

### 问题3: CORS错误

**解决方案：**
1. 确认 `changeOrigin: true` 已配置
2. 检查后端CORS配置
3. 清除浏览器缓存

---

## 📝 服务配置

### 开发环境

```bash
# 前端
http://localhost:5173

# 后端
http://localhost:8080

# 代理规则
/api/* → http://localhost:8080/api/*
/v1/*  → http://localhost:8080/v1/*
```

### 生产环境

```bash
# 前端
https://your-frontend-domain.com

# 后端
https://your-backend-domain.com

# 环境变量
VITE_API_BASE_URL=https://your-backend-domain.com
```

---

## ✅ 验证清单

- [x] vite.config.ts 配置完成
- [x] 代理规则正确
- [x] 重启开发服务器
- [ ] 测试API请求
- [ ] 检查Network请求
- [ ] 验证响应数据

---

## 🎉 配置完成！

**现在前端可以通过代理访问后端API了！**

✅ **代理配置完成**  
✅ **支持 /api 和 /v1 路径**  
✅ **避免CORS问题**  
✅ **开发环境即用**  

**重启开发服务器后即可使用！** 🚀

---

**最后更新：** 2025-10-18
