# EnhancedCalculator API集成指南

## ✅ 需要更新的内容

EnhancedCalculator.tsx文件需要更新以调用真实API，而不是使用Mock数据。

---

## 📋 更新步骤

### 1. 导入真实API服务

```typescript
import { fetchPolicyByCity, type PolicyData } from '../services/policyService';
import { calculateLeaveDates, calculateAllowance, type CalculateResponse } from '../services/maternityLeaveService';
```

### 2. 更新状态管理

```typescript
const [result, setResult] = useState<CalculateResponse | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [policyData, setPolicyData] = useState<PolicyData | null>(null);
```

### 3. 获取城市政策

```typescript
useEffect(() => {
  if (state.cityCode) {
    fetchPolicyByCity(state.cityCode)
      .then(data => setPolicyData(data))
      .catch(err => console.error('Failed to fetch policy:', err));
  }
}, [state.cityCode]);
```

### 4. 更新计算函数

```typescript
const handleCalculate = async () => {
  if (!state.expectedDate || !state.leaveStartDate || !state.cityCode) return;

  setLoading(true);
  setError(null);

  try {
    // 第一步：计算产假日期
    const dateResponse = await calculateLeaveDates({
      staffName: state.staffName || '员工',
      childBirthdate: state.expectedDate.format('YYYYMMDD'),
      infantNumber: state.infantNumber,
      deliverySequence: state.deliverySequence,
      abortion: state.isAbortion,
      dystocia: state.isDifficultBirth,
      cityName: state.cityCode,
      companyName: '公司',
      leaveStartDate: state.leaveStartDate.format('YYYY-MM-DD'),
      calendarCode: 'CN',
      regnancyDays: 0,
      ectopicPregnancy: false,
      recommendAbortionLeaveDays: 0,
      dystociaCodeList: state.isDifficultBirth ? ['standard'] : [],
    });

    // 第二步：如果填写了社保信息，计算生育津贴
    if (state.socialSecurityBase > 0 || state.companyBase > 0) {
      const allowanceResponse = await calculateAllowance({
        staffName: state.staffName || '员工',
        childBirthdate: state.expectedDate.format('YYYYMMDD'),
        infantNumber: state.infantNumber,
        deliverySequence: state.deliverySequence,
        abortion: state.isAbortion,
        dystocia: state.isDifficultBirth,
        cityName: state.cityCode,
        companyName: '公司',
        leaveStartDate: dateResponse.leaveDetail.leaveStartDate,
        leaveEndDate: dateResponse.leaveDetail.leaveEndDate,
        calendarCode: 'CN',
        regnancyDays: 0,
        ectopicPregnancy: false,
        recommendAbortionLeaveDays: 0,
        dystociaCodeList: state.isDifficultBirth ? ['standard'] : [],
        averageSalary: state.socialSecurityBase || 0,
        currentSalary: state.companyBase || 0,
        hitForceCompensationRule: true,
      });
      setResult(allowanceResponse);
    } else {
      setResult(dateResponse);
    }

    setActiveStep(3);
  } catch (err: any) {
    setError(err.message || '计算失败，请检查输入信息');
    console.error('Calculate error:', err);
  } finally {
    setLoading(false);
  }
};
```

### 5. 更新结果显示

```typescript
{result && (
  <Card sx={{ bgcolor: 'success.light' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
        计算结果
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {/* 总产假天数 */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            总产假天数
          </Typography>
          <Typography variant="h3" color="success.dark" fontWeight={700}>
            {result.leaveDetail.currentLeaveDays}天
          </Typography>
        </Box>

        <Divider />

        {/* 休假时间 */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            休假时间
          </Typography>
          <Typography variant="body2">
            开始：{result.leaveDetail.leaveStartDate}
          </Typography>
          <Typography variant="body2">
            结束：{result.leaveDetail.leaveEndDate}
          </Typography>
        </Box>

        {/* 生育津贴 */}
        {result.allowanceDetail && result.allowanceDetail.allowance > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                生育津贴
              </Typography>
              <Typography variant="h5" color="success.dark" fontWeight={600}>
                ¥{result.allowanceDetail.allowance.toLocaleString()}
              </Typography>
              {result.allowanceDetail.compensation > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  公司补差：¥{result.allowanceDetail.compensation.toLocaleString()}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                总工资：¥{result.allowanceDetail.totalSalary?.toLocaleString()}
              </Typography>
            </Box>
          </>
        )}

        {/* 计算说明 */}
        {result.calculateComments && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                计算说明
              </Typography>
              <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                {result.calculateComments.descriptionList.map((desc, index) => (
                  <Typography key={index} variant="caption" display="block" sx={{ py: 0.5 }}>
                    {desc}
                  </Typography>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Stack>
    </CardContent>
  </Card>
)}
```

---

## 🔧 API响应格式

### CalculateResponse

```typescript
{
  leaveDetail: {
    leaveStartDate: string;      // "2023-10-15"
    leaveEndDate: string;         // "2024-04-16"
    currentLeaveDays: number;     // 184
  },
  allowanceDetail: {
    allowance: number;            // 142200.00
    compensation: number;         // 29504.31
    firstMonthSalary: number;     // 8608.71
    lastMonthSalary: number;      // 14086.98
    otherMonthSalary: number;     // 90000
    totalSalary: number;          // 112695.69
  },
  calculateComments: {
    descriptionList: string[];    // 计算步骤说明
  }
}
```

---

## 📝 注意事项

### 1. 移除Mock逻辑

删除所有本地计算逻辑，完全依赖API返回的数据。

### 2. 错误处理

添加完整的错误处理和用户提示：

```typescript
{error && (
  <Alert severity="error" sx={{ mb: 2 }}>
    {error}
  </Alert>
)}
```

### 3. 加载状态

显示加载指示器：

```typescript
<Button
  onClick={handleCalculate}
  disabled={loading}
  startIcon={loading ? <CircularProgress size={20} /> : <CalculateIcon />}
>
  {loading ? '计算中...' : '开始计算'}
</Button>
```

### 4. 政策显示

使用policyData替代cityPolicy：

```typescript
{policyData && (
  <Typography>
    标准产假：{policyData.statutoryPolicy.leaveDays}天
  </Typography>
)}
```

---

## ✅ 完成检查清单

- [ ] 导入真实API服务
- [ ] 更新状态管理
- [ ] 实现fetchPolicyByCity调用
- [ ] 更新handleCalculate函数
- [ ] 更新结果显示组件
- [ ] 移除所有Mock计算逻辑
- [ ] 添加错误处理
- [ ] 添加加载状态
- [ ] 测试完整流程

---

## 🎉 完成后

EnhancedCalculator将完全使用真实API，与Calculator保持一致的API调用逻辑。

**访问地址：** `http://localhost:5173/calculator`
