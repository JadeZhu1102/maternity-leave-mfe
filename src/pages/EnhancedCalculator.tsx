/**
 * 增强版产假计算器 - 优化UI，操作简单快速，完整展示所有条件
 * Enhanced Maternity Leave Calculator
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  LocationCity as CityIcon,
  ChildCare as BabyIcon,
  LocalHospital as HospitalIcon,
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import { SUPPORTED_CITIES } from '../constants/supportedCities';
import { fetchPolicyByCity, type PolicyData } from '../services/policyService';
import { calculateLeaveDates, calculateAllowance, type CalculateResponse } from '../services/maternityLeaveService';

dayjs.locale('zh-cn');

interface CalculatorState {
  // 基本信息
  staffName: string;
  cityCode: string;
  expectedDate: Dayjs | null;
  leaveStartDate: Dayjs | null;
  
  // 生育情况
  birthType: 'normal' | 'difficult' | 'multiple' | 'abortion';
  infantNumber: number;
  deliverySequence: number;
  
  // 特殊情况
  isDifficultBirth: boolean;
  difficultBirthType: string;
  isMultipleBirth: boolean;
  isAbortion: boolean;
  abortionWeeks: number;
  
  // 社保信息
  socialSecurityBase: number;
  companyBase: number;
}

const EnhancedCalculator: React.FC = () => {
  const [state, setState] = useState<CalculatorState>({
    staffName: '',
    cityCode: '',
    expectedDate: null,
    leaveStartDate: null,
    birthType: 'normal',
    infantNumber: 1,
    deliverySequence: 1,
    isDifficultBirth: false,
    difficultBirthType: '',
    isMultipleBirth: false,
    isAbortion: false,
    abortionWeeks: 0,
    socialSecurityBase: 0,
    companyBase: 0,
  });

  const [result, setResult] = useState<CalculateResponse | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);

  const steps = ['基本信息', '生育情况', '社保信息', '计算结果'];

  // 获取选中城市的政策
  useEffect(() => {
    if (state.cityCode) {
      fetchPolicyByCity(state.cityCode)
        .then(data => setPolicyData(data))
        .catch(err => console.error('Failed to fetch policy:', err));
    }
  }, [state.cityCode]);

  // 计算完成度
  const completionPercentage = useMemo(() => {
    let completed = 0;
    const total = 4;
    
    if (state.cityCode) completed++;
    if (state.expectedDate) completed++;
    if (state.leaveStartDate) completed++;
    if (state.staffName) completed++;
    
    return Math.round((completed / total) * 100);
  }, [state]);

  // 验证当前步骤
  const isStepValid = (step: number) => {
    switch (step) {
      case 0: // 基本信息
        return state.cityCode && state.expectedDate && state.leaveStartDate && state.staffName;
      case 1: // 生育情况
        return true; // 生育情况有默认值
      case 2: // 社保信息
        return true; // 社保信息可选
      default:
        return true;
    }
  };

  // 计算产假
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

  const handleReset = () => {
    setState({
      staffName: '',
      cityCode: '',
      expectedDate: null,
      leaveStartDate: null,
      birthType: 'normal',
      infantNumber: 1,
      deliverySequence: 1,
      isDifficultBirth: false,
      difficultBirthType: '',
      isMultipleBirth: false,
      isAbortion: false,
      abortionWeeks: 0,
      socialSecurityBase: 0,
      companyBase: 0,
    });
    setResult(null);
    setActiveStep(0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 页面标题 */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={600}>
            产假计算器
          </Typography>
          <Typography variant="body1" color="text.secondary">
            快速计算产假天数和生育津贴，所有条件一目了然
          </Typography>
        </Box>

        {/* 进度指示器 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1" fontWeight={500}>
              填写进度
            </Typography>
            <Chip 
              label={`${completionPercentage}%`} 
              color={completionPercentage === 100 ? 'success' : 'primary'}
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionPercentage} 
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Stepper activeStep={activeStep} sx={{ mt: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        <Grid container spacing={3}>
          {/* 左侧：输入表单 */}
          <Grid item xs={12} md={7}>
            {/* 第一步：基本信息 */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <CalendarIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    基本信息
                  </Typography>
                  {isStepValid(0) && <CheckIcon color="success" sx={{ ml: 'auto' }} />}
                </Box>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="员工姓名"
                    value={state.staffName}
                    onChange={(e) => setState({ ...state, staffName: e.target.value })}
                    placeholder="请输入员工姓名"
                    required
                  />

                  <TextField
                    fullWidth
                    select
                    label="所在城市"
                    value={state.cityCode}
                    onChange={(e) => setState({ ...state, cityCode: e.target.value })}
                    required
                    helperText={policyData ? `标准产假：${policyData.statutoryPolicy.leaveDays + (policyData.statutoryPolicy.maxLeaveDays - policyData.statutoryPolicy.leaveDays)}天` : '请选择城市查看政策'}
                  >
                    {SUPPORTED_CITIES.map((city) => (
                      <MenuItem key={city.code} value={city.code}>
                        {city.name} ({city.province})
                      </MenuItem>
                    ))}
                  </TextField>

                  <DatePicker
                    label="预产期"
                    value={state.expectedDate}
                    onChange={(date) => setState({ ...state, expectedDate: date })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: '请选择预计分娩日期'
                      }
                    }}
                  />

                  <DatePicker
                    label="休假开始日期"
                    value={state.leaveStartDate}
                    onChange={(date) => setState({ ...state, leaveStartDate: date })}
                    minDate={state.expectedDate?.subtract(90, 'day')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: '可在预产期前90天开始休假'
                      }
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* 第二步：生育情况 */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <BabyIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    生育情况
                  </Typography>
                  <Tooltip title="选择实际生育情况，系统会自动计算额外假期">
                    <IconButton size="small" sx={{ ml: 1 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Stack spacing={3}>
                  {/* 生育类型 */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      生育类型 *
                    </Typography>
                    <ToggleButtonGroup
                      value={state.birthType}
                      exclusive
                      onChange={(_, value) => {
                        if (value) {
                          setState({
                            ...state,
                            birthType: value,
                            isDifficultBirth: value === 'difficult',
                            isMultipleBirth: value === 'multiple',
                            isAbortion: value === 'abortion',
                          });
                        }
                      }}
                      fullWidth
                    >
                      <ToggleButton value="normal">
                        <Box textAlign="center">
                          <Typography variant="body2">正常分娩</Typography>
                          <Typography variant="caption" color="text.secondary">
                            顺产
                          </Typography>
                        </Box>
                      </ToggleButton>
                      <ToggleButton value="difficult">
                        <Box textAlign="center">
                          <Typography variant="body2">难产</Typography>
                          <Typography variant="caption" color="text.secondary">
                            +{policyData?.dystociaPolicy?.standardLeaveDays || 15}天
                          </Typography>
                        </Box>
                      </ToggleButton>
                      <ToggleButton value="multiple">
                        <Box textAlign="center">
                          <Typography variant="body2">多胎</Typography>
                          <Typography variant="caption" color="text.secondary">
                            +{policyData?.moreInfantPolicy?.extraInfantLeaveDays || 15}天/胎
                          </Typography>
                        </Box>
                      </ToggleButton>
                      <ToggleButton value="abortion">
                        <Box textAlign="center">
                          <Typography variant="body2">流产</Typography>
                          <Typography variant="caption" color="text.secondary">
                            按周数计算
                          </Typography>
                        </Box>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  {/* 难产详情 */}
                  {state.isDifficultBirth && (
                    <Alert severity="info" icon={<HospitalIcon />}>
                      <Typography variant="body2" gutterBottom>
                        <strong>难产额外假期：{policyData?.dystociaPolicy?.standardLeaveDays || 15}天</strong>
                      </Typography>
                      <Typography variant="caption">
                        包括：剖宫产、产钳助产、胎头吸引、臀位助产等情况
                      </Typography>
                    </Alert>
                  )}

                  {/* 多胎详情 */}
                  {state.isMultipleBirth && (
                    <Box>
                      <TextField
                        fullWidth
                        type="number"
                        label="婴儿数量"
                        value={state.infantNumber}
                        onChange={(e) => setState({ ...state, infantNumber: parseInt(e.target.value) || 1 })}
                        inputProps={{ min: 2, max: 5 }}
                        helperText={`每多一个婴儿增加${policyData?.moreInfantPolicy?.extraInfantLeaveDays || 15}天，共增加${(state.infantNumber - 1) * (policyData?.moreInfantPolicy?.extraInfantLeaveDays || 15)}天`}
                      />
                    </Box>
                  )}

                  {/* 流产详情 */}
                  {state.isAbortion && (
                    <Box>
                      <TextField
                        fullWidth
                        type="number"
                        label="怀孕周数"
                        value={state.abortionWeeks}
                        onChange={(e) => setState({ ...state, abortionWeeks: parseInt(e.target.value) || 0 })}
                        inputProps={{ min: 0, max: 40 }}
                        helperText="请输入流产时的怀孕周数"
                      />
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          流产假期规定：
                        </Typography>
                        <Typography variant="caption" component="div">
                          • 怀孕不满4个月：15天<br />
                          • 怀孕满4个月：42天<br />
                          • 怀孕满7个月：98天
                        </Typography>
                      </Alert>
                    </Box>
                  )}

                  {/* 分娩顺序 */}
                  <TextField
                    fullWidth
                    select
                    label="分娩顺序"
                    value={state.deliverySequence}
                    onChange={(e) => setState({ ...state, deliverySequence: parseInt(e.target.value) })}
                  >
                    <MenuItem value={1}>第一胎</MenuItem>
                    <MenuItem value={2}>第二胎</MenuItem>
                    <MenuItem value={3}>第三胎及以上</MenuItem>
                  </TextField>
                </Stack>
              </CardContent>
            </Card>

            {/* 第三步：社保信息（可选） */}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center">
                  <Typography variant="h6" fontWeight={600}>
                    社保信息（可选）
                  </Typography>
                  <Chip label="用于计算生育津贴" size="small" sx={{ ml: 2 }} />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="社保缴费基数"
                    value={state.socialSecurityBase || ''}
                    onChange={(e) => setState({ ...state, socialSecurityBase: parseFloat(e.target.value) || 0 })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
                    }}
                    helperText="单位上年度职工月平均工资"
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="公司实际工资基数"
                    value={state.companyBase || ''}
                    onChange={(e) => setState({ ...state, companyBase: parseFloat(e.target.value) || 0 })}
                    InputProps={{
                      startAdornment: <Typography sx={{ mr: 1 }}>¥</Typography>,
                    }}
                    helperText="用于计算公司补差（如果高于社保基数）"
                  />

                  {state.socialSecurityBase > 0 && (
                    <Alert severity="info">
                      <Typography variant="body2">
                        生育津贴 = 社保基数 ÷ 30 × 产假天数
                      </Typography>
                      {state.companyBase > state.socialSecurityBase && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          公司补差 = (公司基数 - 社保基数) ÷ 30 × 产假天数
                        </Typography>
                      )}
                    </Alert>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>

            {/* 操作按钮 */}
            <Box display="flex" gap={2} mt={3}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<CalculateIcon />}
                onClick={handleCalculate}
                disabled={!isStepValid(0)}
              >
                计算产假
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Box>
          </Grid>

          {/* 右侧：政策说明和结果 */}
          <Grid item xs={12} md={5}>
            {/* 政策说明 */}
            {policyData && (
              <Card sx={{ mb: 3, position: 'sticky', top: 16 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {SUPPORTED_CITIES.find(c => c.code === state.cityCode)?.name} 政策说明
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        基础产假
                      </Typography>
                      <Typography variant="body2">
                        {policyData.statutoryPolicy.leaveDays}天（国家规定）
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        延长产假
                      </Typography>
                      <Typography variant="body2">
                        {policyData.statutoryPolicy.maxLeaveDays - policyData.statutoryPolicy.leaveDays}天（地方规定）
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        总产假天数
                      </Typography>
                      <Typography variant="h5" color="success.main" fontWeight={600}>
                        {policyData.statutoryPolicy.maxLeaveDays}天
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        额外假期
                      </Typography>
                      <Typography variant="body2">
                        • 难产：+{policyData.dystociaPolicy.standardLeaveDays}天
                      </Typography>
                      <Typography variant="body2">
                        • 多胎：+{policyData.moreInfantPolicy.extraInfantLeaveDays}天/胎
                      </Typography>
                      <Typography variant="body2">
                        • 陪产假：{policyData.paternityLeavePolicy?.leaveDays || 0}天
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* 计算结果 */}
            {result && (
              <Card sx={{ bgcolor: 'success.light' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600} color="success.dark">
                    计算结果
                  </Typography>
                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        总产假天数
                      </Typography>
                      <Typography variant="h3" color="success.dark" fontWeight={700}>
                        {result.leaveDetail.currentLeaveDays}天
                      </Typography>
                    </Box>

                    <Divider />

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

                    {result.allowanceDetail && result.allowanceDetail.allowance !== null && result.allowanceDetail.allowance > 0 && (
                      <>
                        <Divider />
                        <Box>
                          <Typography variant="subtitle2" color="text.secondary">
                            生育津贴
                          </Typography>
                          <Typography variant="h5" color="success.dark" fontWeight={600}>
                            ¥{result.allowanceDetail.allowance.toLocaleString()}
                          </Typography>
                          {result.allowanceDetail.compensation !== null && result.allowanceDetail.compensation > 0 && (
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
          </Grid>
        </Grid>
      </Container>
    </LocalizationProvider>
  );
};

export default EnhancedCalculator;
