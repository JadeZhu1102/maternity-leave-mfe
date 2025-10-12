import React from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { CreatePolicyPayload } from '../../../types/policyApi';
import { 
  TextField, 
  Typography, 
  IconButton, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

interface PolicyFormProps {
  onSubmit: (data: CreatePolicyPayload) => Promise<void>;
  initialData?: Partial<CreatePolicyPayload>;
  loading?: boolean;
}

// Styled components
const SectionCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '&:last-child': {
    marginBottom: 0
  },
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
}));

const SectionHeader = styled(CardHeader)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1.5, 2),
  '& .MuiCardHeader-title': {
    fontSize: '1rem',
    fontWeight: 600,
    color: theme.palette.text.primary
  }
}));

const FormRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '& > *': {
    flex: 1
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(1.5)
  }
}));

const FormActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  padding: theme.spacing(2, 0)
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper
  }
}));

export const EnhancedPolicyForm: React.FC<PolicyFormProps> = ({
  onSubmit,
  initialData = {},
  loading = false
}) => {
  const defaultValues: CreatePolicyPayload = {
    cityName: '',
    statutoryPolicy: {
      leaveDays: 98,
      calendarDay: true, // 默认日历日
      maxLeaveDays: 180,
      bonusLeaveDays: 0, // 新增奖励假
    },
    dystociaPolicy: {
      calendarDay: true, // 默认日历日
      standardLeaveDays: 15,
    },
    moreInfantPolicy: {
      leaveDays: 15,
      calendarDay: true, // 默认日历日
    },
    otherExtendedPolicy: {
      leaveDays: 0,
      calendarDay: true, // 默认日历日
      maxLeaveDays: 180,
    },
    abortionPolicy: {
      calendarDay: true, // 默认日历日
      abortionRules: [
        {
          name: '宫外孕',
          ectopicPregnancy: true,
          minPregnancyDays: 0,
          maxPregnancyDays: 300,
          minLeaveDays: 15,
          maxLeaveDays: 42,
          leaveDays: 15
        }
      ]
    },
    allowancePolicy: {
      corpSalaryDetailList: [
        {
          companyName: '',
          corpAverageSalary: 0
        }
      ],
      numerator: 1,
      denominator: 1,
      allowanceDays: 98,
      targetAccountType: 'company',
      differenceCompensationRule: {
        ruleDescription: '',
        forceCompensation: 'none',
        otherCompensationRuleDesc: []
      },
      govAllowance: 0
    },
    ...initialData,
  };

  const { 
    register, 
    handleSubmit, 
    control, 
    formState: { errors },
    watch
  } = useForm<CreatePolicyPayload>({
    defaultValues,
  });

  const { fields: corpSalaryFields, append: appendCorpSalary, remove: removeCorpSalary } = 
    useFieldArray({
      control,
      name: 'allowancePolicy.corpSalaryDetailList',
    });

  const { fields: abortionRuleFields, append: appendAbortionRule, remove: removeAbortionRule } = 
    useFieldArray({
      control,
      name: 'abortionPolicy.abortionRules',
    });

  // Add a new abortion rule
  const handleAddAbortionRule = () => {
    appendAbortionRule({
      name: '',
      ectopicPregnancy: false,
      minPregnancyDays: 0,
      maxPregnancyDays: 300,
      minLeaveDays: 0,
      maxLeaveDays: 42,
      leaveDays: 0
    });
  };

  // Watch abortion rules for validation
  const abortionRules = watch('abortionPolicy.abortionRules') || [];

  const onSubmitHandler: SubmitHandler<CreatePolicyPayload> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form id="policy-form" onSubmit={handleSubmit(onSubmitHandler)}>
      <Box sx={{ py: 2 }}>
        {/* Basic Information Section */}
        <SectionCard>
          <SectionHeader title="基本信息" />
          <CardContent>
            <FormRow>
              <StyledTextField
                label="城市名称"
                variant="outlined"
                size="small"
                fullWidth
                {...register('cityName', { required: '城市名称为必填项' })}
                error={!!errors.cityName}
                helperText={errors.cityName?.message}
              />
            </FormRow>
          </CardContent>
        </SectionCard>

        {/* Abortion Policy Section */}
        <SectionCard>
          <SectionHeader 
            title="流产假政策" 
            action={
              <Button 
                size="small" 
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleAddAbortionRule}
              >
                添加流产规则
              </Button>
            }
          />
          <CardContent>
            {abortionRuleFields.length === 0 ? (
              <Box textAlign="center" py={2} color="text.secondary">
                暂无流产规则，请点击上方按钮添加
              </Box>
            ) : (
              <Box>
                {abortionRuleFields.map((field, index) => (
                  <Box key={field.id} mb={3} p={2} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle2">
                        流产规则 #{index + 1}
                      </Typography>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => removeAbortionRule(index)}
                        aria-label="删除规则"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          label="规则名称"
                          variant="outlined"
                          size="small"
                          fullWidth
                          {...register(`abortionPolicy.abortionRules.${index}.name` as const, {
                            required: '规则名称为必填项'
                          })}
                          error={!!errors.abortionPolicy?.abortionRules?.[index]?.name}
                          helperText={errors.abortionPolicy?.abortionRules?.[index]?.name?.message}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          label="默认休假天数"
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          {...register(`abortionPolicy.abortionRules.${index}.leaveDays` as const, {
                            valueAsNumber: true,
                            required: '休假天数为必填项',
                            min: { value: 0, message: '不能小于0' }
                          })}
                          error={!!errors.abortionPolicy?.abortionRules?.[index]?.leaveDays}
                          helperText={errors.abortionPolicy?.abortionRules?.[index]?.leaveDays?.message}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          label="最小怀孕天数"
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          {...register(`abortionPolicy.abortionRules.${index}.minPregnancyDays` as const, {
                            valueAsNumber: true,
                            required: '最小怀孕天数为必填项',
                            min: { value: 0, message: '不能小于0' }
                          })}
                          error={!!errors.abortionPolicy?.abortionRules?.[index]?.minPregnancyDays}
                          helperText={errors.abortionPolicy?.abortionRules?.[index]?.minPregnancyDays?.message}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <StyledTextField
                          label="最大怀孕天数"
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          {...register(`abortionPolicy.abortionRules.${index}.maxPregnancyDays` as const, {
                            valueAsNumber: true,
                            required: '最大怀孕天数为必填项',
                            min: { value: 0, message: '不能小于0' },
                            validate: (value) => 
                              value >= abortionRules[index]?.minPregnancyDays || 
                              '必须大于或等于最小怀孕天数'
                          })}
                          error={!!errors.abortionPolicy?.abortionRules?.[index]?.maxPregnancyDays}
                          helperText={errors.abortionPolicy?.abortionRules?.[index]?.maxPregnancyDays?.message}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...register(`abortionPolicy.abortionRules.${index}.ectopicPregnancy` as const)}
                            />
                          }
                          label="是否为宫外孕"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
        </SectionCard>

        {/* Statutory Policy Section */}
        <SectionCard>
          <SectionHeader title="法定产假政策" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="产假天数"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('statutoryPolicy.leaveDays', {
                    valueAsNumber: true,
                    required: '必填',
                  })}
                  error={!!errors.statutoryPolicy?.leaveDays}
                  helperText={errors.statutoryPolicy?.leaveDays?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  label="最长产假天数"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('statutoryPolicy.maxLeaveDays', {
                    valueAsNumber: true,
                    required: '必填',
                  })}
                  error={!!errors.statutoryPolicy?.maxLeaveDays}
                  helperText={errors.statutoryPolicy?.maxLeaveDays?.message}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>计算方式</InputLabel>
                  <Select
                    {...register('statutoryPolicy.calendarDay')}
                    defaultValue={true}
                    label="计算方式"
                  >
                    <MenuItem value="true">日历日</MenuItem>
                    <MenuItem value="false">工作日</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  label="奖励假（天）"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('statutoryPolicy.bonusLeaveDays', {
                    valueAsNumber: true,
                    min: { value: 0, message: '不能小于0' },
                  })}
                  error={!!errors.statutoryPolicy?.bonusLeaveDays}
                  helperText={errors.statutoryPolicy?.bonusLeaveDays?.message}
                />
              </Grid>
            </Grid>
            
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                onClick={() => window.history.back()}
                disabled={loading}
              >
                取消
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading}
              >
                {loading ? '保存中...' : '保存'}
              </Button>
            </Stack>
          </CardContent>
        </SectionCard>
      </Box>
    </form>
  );
};

export default EnhancedPolicyForm;
