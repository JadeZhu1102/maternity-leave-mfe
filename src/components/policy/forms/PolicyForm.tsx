import React, { useMemo, useCallback } from 'react';
import { useForm, SubmitHandler, useFieldArray, useWatch } from 'react-hook-form';
import { CreatePolicyPayload } from '../../../types/policyApi';
import {
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

interface PolicyFormProps {
  onSubmit: (data: CreatePolicyPayload) => Promise<void>;
  initialData?: Partial<CreatePolicyPayload>;
  loading?: boolean;
  onCancel?: () => void;
}

export const PolicyForm: React.FC<PolicyFormProps> = ({
  onSubmit,
  initialData = {},
  // loading state is managed by the parent component
}) => {
  // Memoize default values to prevent recreation on every render
  const defaultValues = useMemo<CreatePolicyPayload>(() => ({
    cityName: '',
    statutoryPolicy: {
      leaveDays: 98,
      calendarDay: true,
      maxLeaveDays: 180,
      bonusLeaveDays: 0,
    },
    dystociaPolicy: {
      calendarDay: true,
      standardLeaveDays: 15,
    },
    moreInfantPolicy: {
      leaveDays: 15,
      calendarDay: true,
    },
    otherExtendedPolicy: {
      leaveDays: 0,
      calendarDay: true,
      maxLeaveDays: 180,
    },
    abortionPolicy: {
      calendarDay: true,
      abortionRules: [
        {
          ectopicPregnancy: true,
          minRegnancyDays: 0,
          maxRegnancyDays: 300,
          minLeaveDays: 14,
          maxLeaveDays: 30,
          leaveDays: 30,
        },
      ],
    },
    allowancePolicy: {
      corpSalaryDetailList: [
        {
          companyName: '',
          corpAverageSalary: 0,
        },
      ],
      numerator: 1,
      denominator: 30,
      allowanceDays: 98,
      targetAccountType: 'CORP',
      differenceCompensationRule: {
        ruleDescription: '如政府发放低于企业产假工资，差额由企业补足',
        forceCompensation: 'Yes',
        otherCompensationRuleDesc: [],
      },
      govAllowance: 0,
    },
    bonusLeavePolicies: [],
    ...initialData,
  }), [initialData]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
    watch,
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

  const { fields: bonusLeaveFields, append: appendBonusLeave, remove: removeBonusLeave } =
    useFieldArray({
      control,
      name: 'bonusLeavePolicies',
    });

  // Watch the forceCompensation value
  const forceCompensationValue = useWatch({
    control,
    name: 'allowancePolicy.differenceCompensationRule.forceCompensation',
    defaultValue: 'No',
  });

  // Watch for form values
  const watchAllFields = useWatch({
    control,
  });

  // Memoize event handlers with useCallback
  const handleForceCompensationChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setValue('allowancePolicy.differenceCompensationRule.forceCompensation', value, { shouldValidate: true });
    // Clear other compensation rules when not 'Only if'
    if (value !== 'Only if') {
      setValue('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc', []);
    }
  }, [setValue]);

  const handleAddRuleDescription = useCallback(() => {
    const currentRules = getValues('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc') || [];
    setValue('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc', [...currentRules, ''], { shouldValidate: true });
  }, [getValues, setValue]);

  const handleRuleDescriptionChange = useCallback((index: number, value: string) => {
    const currentRules = [...(getValues('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc') || [])];
    currentRules[index] = value;
    setValue('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc', currentRules, { shouldValidate: true });
  }, [getValues, setValue]);

  const handleRemoveRuleDescription = useCallback((index: number) => {
    const currentRules = [...(getValues('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc') || [])];
    currentRules.splice(index, 1);
    setValue('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc', currentRules, { shouldValidate: true });
  }, [getValues, setValue]);

  const onSubmitHandler: SubmitHandler<CreatePolicyPayload> = useCallback(async (data) => {
    await onSubmit(data);
  }, [onSubmit]);

  // Memoize styled components to prevent recreation on every render
  const SectionCard = useMemo(() => styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    '&:last-child': {
      marginBottom: 0
    }
  })), []);

  const SectionHeader = useMemo(() => styled(CardHeader)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(1.5, 2),
    '& .MuiCardHeader-title': {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: theme.palette.text.primary
    }
  })), []);

  const FormRow = useMemo(() => styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& > *': {
      flex: 1
    }
  })), []);

  const FormSection = useMemo(() => styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    '&:last-child': {
      marginBottom: 0
    }
  })), []);

  return (
    <form id="policy-form" onSubmit={handleSubmit(onSubmitHandler)}>
      <Box sx={{ py: 2 }}>
        {/* City Name Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="基本信息" />
          <CardContent>
            <FormRow>
              <TextField
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

        {/* Maximum Maternity Leave Days Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="最长产假天数" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
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
            </Grid>
          </CardContent>
        </SectionCard>

        {/* Statutory Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="法定产假政策" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
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
            </Grid>
          </CardContent>
        </SectionCard>

        {/* Dystocia Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="难产政策" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="标准难产假天数"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('dystociaPolicy.standardLeaveDays', {
                    valueAsNumber: true,
                    required: '必填'
                  })}
                  error={!!errors.dystociaPolicy?.standardLeaveDays}
                  helperText={errors.dystociaPolicy?.standardLeaveDays?.message}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>计算方式</InputLabel>
                  <Select
                    {...register('dystociaPolicy.calendarDay')}
                    defaultValue={true}
                    label="计算方式"
                  >
                    <MenuItem value="true">日历日</MenuItem>
                    <MenuItem value="false">工作日</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </SectionCard>
        {/* Abortion Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader
            title="流产政策"
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() =>
                  appendAbortionRule({
                    ectopicPregnancy: false,
                    minRegnancyDays: 0,
                    maxRegnancyDays: 0,
                    minLeaveDays: 0,
                    maxLeaveDays: 0,
                    leaveDays: 0,
                  })
                }
              >
                添加流产规则
              </Button>
            }
          />
          <CardContent>
            {abortionRuleFields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1, position: 'relative' }}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeAbortionRule(index)}
                  disabled={abortionRuleFields.length <= 1}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register(`abortionPolicy.abortionRules.${index}.ectopicPregnancy` as const)}
                          defaultChecked={field.ectopicPregnancy}
                          size="small"
                        />
                      }
                      label="宫外孕"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="最小怀孕天数"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`abortionPolicy.abortionRules.${index}.minRegnancyDays` as const, {
                        valueAsNumber: true,
                        required: '必填',
                      })}
                      error={!!errors.abortionPolicy?.abortionRules?.[index]?.minRegnancyDays}
                      helperText={
                        errors.abortionPolicy?.abortionRules?.[index]?.minRegnancyDays?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="最大怀孕天数"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`abortionPolicy.abortionRules.${index}.maxRegnancyDays` as const, {
                        valueAsNumber: true,
                        required: '必填',
                      })}
                      error={!!errors.abortionPolicy?.abortionRules?.[index]?.maxRegnancyDays}
                      helperText={
                        errors.abortionPolicy?.abortionRules?.[index]?.maxRegnancyDays?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="最小休假天数"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`abortionPolicy.abortionRules.${index}.minLeaveDays` as const, {
                        valueAsNumber: true,
                        required: '必填',
                      })}
                      error={!!errors.abortionPolicy?.abortionRules?.[index]?.minLeaveDays}
                      helperText={
                        errors.abortionPolicy?.abortionRules?.[index]?.minLeaveDays?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="最大休假天数"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`abortionPolicy.abortionRules.${index}.maxLeaveDays` as const, {
                        valueAsNumber: true,
                        required: '必填',
                      })}
                      error={!!errors.abortionPolicy?.abortionRules?.[index]?.maxLeaveDays}
                      helperText={
                        errors.abortionPolicy?.abortionRules?.[index]?.maxLeaveDays?.message
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      label="休假天数"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`abortionPolicy.abortionRules.${index}.leaveDays` as const, {
                        valueAsNumber: true,
                        required: '必填',
                      })}
                      error={!!errors.abortionPolicy?.abortionRules?.[index]?.leaveDays}
                      helperText={
                        errors.abortionPolicy?.abortionRules?.[index]?.leaveDays?.message
                      }
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </SectionCard>
        {/* Bonus Leave Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader
            title="奖励假政策"
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendBonusLeave({ description: '', days: 0 })}
              >
                添加奖励假
              </Button>
            }
          />
          <CardContent>
            {bonusLeaveFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  mb: 3,
                  p: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  position: 'relative'
                }}
              >
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => removeBonusLeave(index)}
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <TextField
                      label="奖励描述"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`bonusLeavePolicies.${index}.description` as const, {
                        required: '必填',
                      })}
                      error={!!errors.bonusLeavePolicies?.[index]?.description}
                      helperText={errors.bonusLeavePolicies?.[index]?.description?.message}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      label="奖励天数"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`bonusLeavePolicies.${index}.days` as const, {
                        valueAsNumber: true,
                        required: '必填',
                        min: { value: 0, message: '必须大于等于0' },
                      })}
                      error={!!errors.bonusLeavePolicies?.[index]?.days}
                      helperText={errors.bonusLeavePolicies?.[index]?.days?.message}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            {bonusLeaveFields.length === 0 && (
              <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 2 }}>
                暂无奖励假政策，点击上方按钮添加
              </Typography>
            )}
          </CardContent>
        </SectionCard>

        {/* Allowance Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader
            title="津贴政策"
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => appendCorpSalary({ companyName: '', corpAverageSalary: 0 })}
              >
                添加公司薪资
              </Button>
            }
          />
          <CardContent>
            {corpSalaryFields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="公司名称"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`allowancePolicy.corpSalaryDetailList.${index}.companyName` as const, {
                        required: '必填',
                      })}
                      error={!!errors.allowancePolicy?.corpSalaryDetailList?.[index]?.companyName}
                      helperText={errors.allowancePolicy?.corpSalaryDetailList?.[index]?.companyName?.message}
                      FormHelperTextProps={{
                        style: { marginTop: 0, marginBottom: 0 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <TextField
                      label="公司平均工资"
                      type="number"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`allowancePolicy.corpSalaryDetailList.${index}.corpAverageSalary` as const, {
                        valueAsNumber: true,
                        required: '必填',
                        min: { value: 0, message: '必须大于等于0' },
                      })}
                      error={!!errors.allowancePolicy?.corpSalaryDetailList?.[index]?.corpAverageSalary}
                      helperText={
                        errors.allowancePolicy?.corpSalaryDetailList?.[index]?.corpAverageSalary?.message
                      }
                      FormHelperTextProps={{
                        style: { marginTop: 0, marginBottom: 0 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} container justifyContent="flex-end">
                    <IconButton
                      color="error"
                      onClick={() => removeCorpSalary(index)}
                      disabled={corpSalaryFields.length <= 1}
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </CardContent>
        </SectionCard>

        {/* Allowance Details Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="津贴计算参数" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="津贴天数"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('allowancePolicy.allowanceDays', {
                    valueAsNumber: true,
                    required: '必填',
                    min: { value: 0, message: '必须大于等于0' },
                  })}
                  error={!!errors.allowancePolicy?.allowanceDays}
                  helperText={errors.allowancePolicy?.allowanceDays?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="分子"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('allowancePolicy.numerator', {
                    valueAsNumber: true,
                    required: '必填',
                    min: { value: 1, message: '必须大于0' },
                  })}
                  error={!!errors.allowancePolicy?.numerator}
                  helperText={errors.allowancePolicy?.numerator?.message}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="分母"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('allowancePolicy.denominator', {
                    valueAsNumber: true,
                    required: '必填',
                    min: { value: 1, message: '必须大于0' },
                  })}
                  error={!!errors.allowancePolicy?.denominator}
                  helperText={errors.allowancePolicy?.denominator?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl
                  fullWidth
                  size="small"
                  margin="normal"
                  sx={{
                    '& .MuiInputBase-root': {
                      height: '40px', // Match height with other form fields
                      display: 'flex',
                      alignItems: 'center'
                    }
                  }}
                >
                  <InputLabel id="force-compensation-label">强制补足差额</InputLabel>
                  <Select
                    labelId="force-compensation-label"
                    label="强制补足差额"
                    value={forceCompensationValue || 'No'}
                    onChange={handleForceCompensationChange}
                    sx={{
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: '24px' // Ensure minimum height for the select
                      }
                    }}
                  >
                    <MenuItem value="Yes">是 (Yes)</MenuItem>
                    <MenuItem value="No">否 (No)</MenuItem>
                    <MenuItem value="Only if">仅满足以下条件 (Only if)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {forceCompensationValue === 'Only if' && (
                <Grid item xs={12}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      条件规则描述 (Condition Rules)
                    </Typography>

                    {(getValues('allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc') || []).map((rule: string, index: number) => (
                      <Box key={index} display="flex" alignItems="center" mb={1}>
                        <TextField
                          fullWidth
                          variant="outlined"
                          size="small"
                          value={rule}
                          onChange={(e) => handleRuleDescriptionChange(index, e.target.value)}
                          placeholder="输入条件规则描述"
                        />
                        <IconButton
                          onClick={() => handleRemoveRuleDescription(index)}
                          size="small"
                          color="error"
                          sx={{ ml: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={handleAddRuleDescription}
                      sx={{ mt: 1 }}
                    >
                      添加条件规则 (Add Condition Rule)
                    </Button>
                  </Box>
                </Grid>
              )}

              {forceCompensationValue === 'Only if' && (
                <Grid item xs={12}>
                  <Box mb={2}>
                    <Typography variant="subtitle2" gutterBottom>
                      规则描述 (Rule Description)
                    </Typography>
                    <TextField
                      variant="outlined"
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="输入规则描述"
                      {...register('allowancePolicy.differenceCompensationRule.ruleDescription')}
                      error={!!errors.allowancePolicy?.differenceCompensationRule?.ruleDescription}
                      helperText={
                        errors.allowancePolicy?.differenceCompensationRule?.ruleDescription?.message ||
                        '此描述将作为一般规则说明'
                      }
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </SectionCard>
      </Box>
    </form>
  );
};

export default PolicyForm;
