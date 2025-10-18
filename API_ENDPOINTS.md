# API端点快速参考

## 🔧 基础配置

**API基础URL：** `http://localhost:8080`

**环境变量：** `VITE_API_BASE_URL`

---

## 📋 所有API端点

### 1. 产假计算

#### 计算产假日期
```
POST /api/v1/maternity-leave/calculateDate
```

**请求体：**
```json
{
  "staffName": "张三",
  "childBirthdate": "20231015",
  "infantNumber": 1,
  "deliverySequence": 1,
  "abortion": false,
  "dystocia": true,
  "cityName": "Shanghai",
  "companyName": "测试公司",
  "leaveStartDate": "2023-10-15",
  "calendarCode": "CN",
  "regnancyDays": 0,
  "ectopicPregnancy": false,
  "recommendAbortionLeaveDays": 0,
  "dystociaCodeList": ["standard"]
}
```

#### 计算生育津贴
```
POST /api/v1/maternity-leave/calculateMoney
```

**请求体：**
```json
{
  "staffName": "张三",
  "childBirthdate": "20231015",
  "infantNumber": 1,
  "deliverySequence": 1,
  "abortion": false,
  "dystocia": true,
  "cityName": "Shanghai",
  "companyName": "测试公司",
  "leaveStartDate": "2023-10-15",
  "leaveEndDate": "2024-04-16",
  "calendarCode": "CN",
  "regnancyDays": 0,
  "ectopicPregnancy": false,
  "recommendAbortionLeaveDays": 0,
  "dystociaCodeList": ["standard"],
  "averageSalary": 27000,
  "currentSalary": 18000,
  "hitForceCompensationRule": true
}
```

---

### 2. 计算历史

#### 获取所有历史记录
```
GET /api/v1/maternity-leave/getCalculateHistory
```

**查询参数（可选）：**
- `staffName` - 员工姓名
- `cityCode` - 城市代码
- `startDate` - 开始日期 (YYYY-MM-DD)
- `endDate` - 结束日期 (YYYY-MM-DD)
- `page` - 页码
- `pageSize` - 每页数量

**示例：**
```
GET /api/v1/maternity-leave/getCalculateHistory?staffName=张三&cityCode=Shanghai
```

---

### 3. 政策管理

#### 获取城市政策
```
GET /api/v1/policy/fetch?cityCode={cityCode}
```

**示例：**
```
GET /api/v1/policy/fetch?cityCode=Shanghai
```

#### 获取所有政策
```
GET /api/v1/policy/all
```

---

### 4. 日历管理

#### 获取特殊日期
```
GET /api/v1/calendar/special-dates/{calendarCode}?year={year}
```

**示例：**
```
GET /api/v1/calendar/special-dates/CN?year=2025
```

#### 保存日历配置
```
POST /v1/calendar/setup-calendar
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

---

## 🧪 测试命令

### 使用curl测试

#### 1. 计算产假日期
```bash
curl -X POST http://localhost:8080/api/v1/maternity-leave/calculateDate \
  -H "Content-Type: application/json" \
  -d '{
    "staffName": "张三",
    "childBirthdate": "20231015",
    "infantNumber": 1,
    "deliverySequence": 1,
    "abortion": false,
    "dystocia": true,
    "cityName": "Shanghai",
    "companyName": "测试公司",
    "leaveStartDate": "2023-10-15",
    "calendarCode": "CN",
    "regnancyDays": 0,
    "ectopicPregnancy": false,
    "recommendAbortionLeaveDays": 0,
    "dystociaCodeList": ["standard"]
  }'
```

#### 2. 获取历史记录
```bash
curl http://localhost:8080/api/v1/maternity-leave/getCalculateHistory
```

#### 3. 获取城市政策
```bash
curl http://localhost:8080/api/v1/policy/fetch?cityCode=Shanghai
```

#### 4. 获取特殊日期
```bash
curl http://localhost:8080/api/v1/calendar/special-dates/CN?year=2025
```

---

## 📝 响应格式

### 计算响应
```json
{
  "leaveDetail": {
    "leaveStartDate": "2023-10-15",
    "leaveEndDate": "2024-04-16",
    "currentLeaveDays": 184
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
  }
}
```

---

## ⚙️ 环境配置

### 开发环境
```bash
VITE_API_BASE_URL=http://localhost:8080
```

### 生产环境
```bash
VITE_API_BASE_URL=https://api.example.com
```

---

## 🔍 调试

### 查看API日志

打开浏览器开发者工具 → Console，查看：
```
[API] Calculate leave dates response: {...}
[API] Fetched policy for city: Shanghai {...}
[API] Fetched special dates: [...]
```

### 查看Network请求

打开浏览器开发者工具 → Network，筛选XHR查看所有API请求。

---

**最后更新：** 2025-10-18
