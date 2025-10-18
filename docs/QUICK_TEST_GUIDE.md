# 日历API快速测试指南

## 🚀 快速开始

### 1. 启动后端服务

确保后端服务运行在 `http://localhost:8080`

### 2. 启动前端服务

```bash
npm run dev
```

### 3. 访问日历管理页面

```
http://localhost:5173/admin/calendar
```

---

## 📝 测试步骤

### 测试1：查看API配置

1. 点击页面右上角的 **"显示API配置"** 按钮
2. 查看当前配置：
   - API地址：`http://localhost:8080`
   - 日历代码：`CN`
   - 完整URL：`http://localhost:8080/v1/calendar/setup-calendar`

### 测试2：编辑日历

1. 点击 **"编辑日历"** 按钮，进入编辑模式
2. 点击任意月份（如1月）
3. 在弹窗中选择某个日期（如2025-01-01）
4. 设置为 **"节假日"**
5. 输入描述：**"元旦"**
6. 点击 **"保存"**

### 测试3：保存到后端

1. 点击页面右上角的 **"保存整年"** 按钮
2. 等待保存完成
3. 查看成功提示：
   ```
   日历保存成功！
   节假日: X个
   调班日: X个
   ```

### 测试4：查看请求日志

打开浏览器开发者工具（F12），查看Console：

```
[API] Saving calendar to: http://localhost:8080/v1/calendar/setup-calendar
[API] Request body: {
  "calendarCode": "CN",
  "publicHolidays": [
    {
      "calendarDate": "2025-01-01",
      "description": "元旦"
    }
  ],
  "extraWorkdays": []
}
[API] Response: { ... }
```

---

## 🧪 测试用例

### 用例1：添加节假日

**操作：**
1. 编辑模式
2. 选择2025-01-01
3. 设置为"节假日"
4. 描述："元旦"
5. 保存

**预期结果：**
```json
{
  "publicHolidays": [
    {
      "calendarDate": "2025-01-01",
      "description": "元旦"
    }
  ]
}
```

### 用例2：添加调班日

**操作：**
1. 编辑模式
2. 选择2025-02-08（周六）
3. 设置为"调班日"
4. 描述："春节-调班"
5. 保存

**预期结果：**
```json
{
  "extraWorkdays": [
    {
      "calendarDate": "2025-02-08",
      "description": "春节-调班"
    }
  ]
}
```

### 用例3：批量添加春节假期

**操作：**
1. 编辑模式
2. 添加以下节假日：
   - 2025-01-28 春节
   - 2025-01-29 春节
   - 2025-01-30 春节
   - 2025-01-31 春节
   - 2025-02-01 春节
   - 2025-02-02 春节
   - 2025-02-03 春节
3. 添加调班日：
   - 2025-01-26 春节-调班
   - 2025-02-08 春节-调班
4. 保存

**预期结果：**
```json
{
  "publicHolidays": [7个春节假期],
  "extraWorkdays": [2个调班日]
}
```

---

## 🔍 验证方法

### 方法1：查看Network请求

1. 打开开发者工具 → Network标签
2. 筛选：XHR
3. 查找：`setup-calendar`
4. 查看：
   - Request URL
   - Request Method: POST
   - Request Payload
   - Response

### 方法2：使用curl测试

```bash
curl -X POST http://localhost:8080/v1/calendar/setup-calendar \
  -H "Content-Type: application/json" \
  -d '{
    "calendarCode": "CN",
    "publicHolidays": [
      {
        "calendarDate": "2025-01-01",
        "description": "元旦"
      }
    ],
    "extraWorkdays": []
  }'
```

### 方法3：使用Postman

1. 创建POST请求
2. URL: `http://localhost:8080/v1/calendar/setup-calendar`
3. Headers: `Content-Type: application/json`
4. Body: 选择raw JSON
5. 粘贴请求数据
6. 发送请求

---

## ⚙️ 自定义配置测试

### 测试不同的API地址

1. 显示API配置
2. 修改API地址为：`http://localhost:9000`
3. 保存日历
4. 查看请求是否发送到新地址

### 测试不同的日历代码

1. 显示API配置
2. 修改日历代码为：`US`
3. 保存日历
4. 查看请求体中的calendarCode是否为"US"

---

## ❌ 错误测试

### 测试1：后端服务未启动

**操作：**
1. 停止后端服务
2. 尝试保存日历

**预期：**
- 显示错误提示
- Console显示网络错误

### 测试2：错误的API地址

**操作：**
1. 修改API地址为：`http://invalid-url`
2. 尝试保存日历

**预期：**
- 显示错误提示
- Console显示连接失败

### 测试3：后端返回错误

**操作：**
1. 后端返回400/500错误
2. 尝试保存日历

**预期：**
- 显示具体错误信息
- Console显示完整错误

---

## 📊 测试数据模板

### 完整的2025年节假日

```json
{
  "calendarCode": "CN",
  "publicHolidays": [
    {"calendarDate": "2025-01-01", "description": "元旦"},
    {"calendarDate": "2025-01-28", "description": "春节"},
    {"calendarDate": "2025-01-29", "description": "春节"},
    {"calendarDate": "2025-01-30", "description": "春节"},
    {"calendarDate": "2025-01-31", "description": "春节"},
    {"calendarDate": "2025-02-01", "description": "春节"},
    {"calendarDate": "2025-02-02", "description": "春节"},
    {"calendarDate": "2025-02-03", "description": "春节"},
    {"calendarDate": "2025-04-04", "description": "清明节"},
    {"calendarDate": "2025-04-05", "description": "清明节"},
    {"calendarDate": "2025-04-06", "description": "清明节"},
    {"calendarDate": "2025-05-01", "description": "劳动节"},
    {"calendarDate": "2025-05-02", "description": "劳动节"},
    {"calendarDate": "2025-05-03", "description": "劳动节"},
    {"calendarDate": "2025-05-31", "description": "端午节"},
    {"calendarDate": "2025-06-01", "description": "端午节"},
    {"calendarDate": "2025-06-02", "description": "端午节"},
    {"calendarDate": "2025-10-01", "description": "国庆节"},
    {"calendarDate": "2025-10-02", "description": "国庆节"},
    {"calendarDate": "2025-10-03", "description": "国庆节"},
    {"calendarDate": "2025-10-04", "description": "国庆节"},
    {"calendarDate": "2025-10-05", "description": "国庆节"},
    {"calendarDate": "2025-10-06", "description": "国庆节"},
    {"calendarDate": "2025-10-07", "description": "国庆节"}
  ],
  "extraWorkdays": [
    {"calendarDate": "2025-01-26", "description": "春节-调班"},
    {"calendarDate": "2025-02-08", "description": "春节-调班"},
    {"calendarDate": "2025-04-27", "description": "劳动节-调班"},
    {"calendarDate": "2025-09-28", "description": "国庆节-调班"},
    {"calendarDate": "2025-10-11", "description": "国庆节-调班"}
  ]
}
```

---

## ✅ 测试检查清单

- [ ] API配置显示正确
- [ ] 可以进入编辑模式
- [ ] 可以修改日期类型
- [ ] 可以添加描述
- [ ] 保存按钮可用
- [ ] 保存成功提示
- [ ] Console日志正确
- [ ] Network请求正确
- [ ] 后端接收数据正确
- [ ] 错误处理正常

---

## 🎯 成功标准

1. ✅ 可以成功保存节假日
2. ✅ 可以成功保存调班日
3. ✅ 请求格式符合API规范
4. ✅ 响应数据正确显示
5. ✅ 错误处理友好

---

## 💡 提示

- 使用Chrome DevTools查看详细日志
- 检查Network标签确认请求发送
- 查看Console确认数据转换正确
- 测试各种边界情况
- 验证错误处理逻辑

祝测试顺利！🎉
