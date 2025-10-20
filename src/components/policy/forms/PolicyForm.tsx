import React, { useMemo, useCallback } from 'react';
import { useForm, SubmitHandler, useFieldArray, useWatch, Controller } from 'react-hook-form';
import { CreatePolicyPayload } from '../../../types/policyApi';
import {
  TextField,
  FormControl,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Box,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid';
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
  const defaultsWhenCreate = useMemo<CreatePolicyPayload>(() => ({
    cityName: '',
    cityCode: '',
    statutoryPolicy: {
      leaveDays: 98,
      calendarDay: true,
      delayForPublicHoliday: false,
    },
    dystociaPolicy: {
      standardLeaveDays: 15,
      delayForPublicHoliday: false,
      calendarDay: true,
    },
    moreInfantPolicy: {
      extraInfantLeaveDays: 15,
      delayForPublicHoliday: false,
      calendarDay: true,
    },
    otherExtendedPolicy: {
      leaveDays: 0,
      delayForPublicHoliday: false,
      calendarDay: true,
    },
    abortionPolicy: {
      delayForPublicHoliday: false,
      calendarDay: true,
      abortionRules: [],
    },
    allowancePolicy: {
      corpSalaryDetailList: [
        { companyName: '', corpAverageSalary: 0 },
      ],
      numerator: 1,
      denominator: 30,
      allowanceDaysRule: [],
      targetAccountType: 'CORP',
      differenceCompensationRule: {
        ruleDescription: '',
        forceCompensation: 'No',
        otherCompensationRuleDesc: [],
      },
      govAllowance: 0,
    },
  }), []);

  const defaultValues = useMemo<CreatePolicyPayload>(() => {
    // 如果提供了初始数据（编辑模式），完全使用它，避免填充默认/空数据
    if (initialData && Object.keys(initialData).length > 0) {
      return initialData as CreatePolicyPayload;
    }
    // 创建模式：使用默认模板
    return defaultsWhenCreate;
  }, [initialData, defaultsWhenCreate]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
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

  // Removed: bonusLeavePolicies form array (not in API type)

  // Watch the forceCompensation value
  const forceCompensationValue = useWatch({
    control,
    name: 'allowancePolicy.differenceCompensationRule.forceCompensation',
    defaultValue: 'No',
  });

  // Removed: global watch (unused)

  // Memoize event handlers with useCallback
  const handleForceCompensationChange = useCallback((event: any) => {
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

  // Map backend allowanceDaysRule codes to Chinese labels
  const getAllowanceRuleLabel = useCallback((code: string): string => {
    const c = (code || '').toLowerCase();
    if (c === 'dystocia' || code === '难产假') return '难产假';
    if (c === 'statutory' || code === '标准') return '标准';
    if (c === 'otherextended' || c === 'bonus' || code === '奖励假') return '奖励假';
    if (c === 'abortion' || code === '流产假') return '流产假';
    return code || '未知规则';
  }, []);

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

  // Removed unused FormSection styled component

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

        {/* Removed: 最长产假天数（不在类型中） */}

        {/* Statutory Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="法定产假政策" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name={"statutoryPolicy.calendarDay" as const}
                  control={control}
                  render={({ field }) => (
                    <FormControl size="small" sx={{ width: 100 }}>
                      <InputLabel>计算方式</InputLabel>
                      <Select
                        label="计算方式"
                        value={field.value ? 'true' : 'false'}
                        onChange={(e) => field.onChange(e.target.value === 'true')}
                      >
                        <MenuItem value="true">日历日</MenuItem>
                        <MenuItem value="false">工作日</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </SectionCard>

        {/* Dystocia Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="难产政策" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name={"dystociaPolicy.calendarDay" as const}
                  control={control}
                  render={({ field }) => (
                    <FormControl size="small" sx={{ width: 100 }}>
                      <InputLabel>计算方式</InputLabel>
                      <Select
                        label="计算方式"
                        value={field.value ? 'true' : 'false'}
                        onChange={(e) => field.onChange(e.target.value === 'true')}
                      >
                        <MenuItem value="true">日历日</MenuItem>
                        <MenuItem value="false">工作日</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </SectionCard>

        {/* More Infant Policy Section */}
        <SectionCard elevation={0} variant="outlined">
          <SectionHeader title="多胎政策" />
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="每多一胎增加天数"
                  type="number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  {...register('moreInfantPolicy.extraInfantLeaveDays', {
                    valueAsNumber: true,
                    required: '必填'
                  })}
                  error={!!errors.moreInfantPolicy?.extraInfantLeaveDays}
                  helperText={errors.moreInfantPolicy?.extraInfantLeaveDays?.message}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name={"moreInfantPolicy.calendarDay" as const}
                  control={control}
                  render={({ field }) => (
                    <FormControl size="small" sx={{ width: 100 }}>
                      <InputLabel>计算方式</InputLabel>
                      <Select
                        label="计算方式"
                        value={field.value ? 'true' : 'false'}
                        onChange={(e) => field.onChange(e.target.value === 'true')}
                      >
                        <MenuItem value="true">日历日</MenuItem>
                        <MenuItem value="false">工作日</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </SectionCard>

        {/* Other Extended Policy Section */}
        {initialData?.otherExtendedPolicy && (
          <SectionCard elevation={0} variant="outlined">
            <SectionHeader title="其他延长政策" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="延长假天数"
                    type="number"
                    variant="outlined"
                    size="small"
                    fullWidth
                    {...register('otherExtendedPolicy.leaveDays', {
                      valueAsNumber: true,
                      required: '必填'
                    })}
                    error={!!errors.otherExtendedPolicy?.leaveDays}
                    helperText={errors.otherExtendedPolicy?.leaveDays?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name={"otherExtendedPolicy.calendarDay" as const}
                    control={control}
                    render={({ field }) => (
                      <FormControl size="small" sx={{ width: 100 }}>
                        <InputLabel>计算方式</InputLabel>
                        <Select
                          label="计算方式"
                          value={field.value ? 'true' : 'false'}
                          onChange={(e) => field.onChange(e.target.value === 'true')}
                        >
                          <MenuItem value="true">日历日</MenuItem>
                          <MenuItem value="false">工作日</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <Controller
                    name={"otherExtendedPolicy.delayForPublicHoliday" as const}
                    control={control}
                    render={({ field }) => (
                      <FormControl size="small" sx={{ width: 180 }}>
                        <InputLabel>公共假期顺延</InputLabel>
                        <Select
                          label="公共假期顺延"
                          value={field.value ? 'true' : 'false'}
                          onChange={(e) => field.onChange(e.target.value === 'true')}
                        >
                          <MenuItem value="true">是</MenuItem>
                          <MenuItem value="false">否</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </SectionCard>
        )}
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
                    ruleCode: '',
                    description: '',
                    leaveDays: 0,
                  } as any)
                }
              >
                添加流产规则
              </Button>
            }
          />
          <CardContent>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 12, md: 3 }}>
                <Controller
                  name={"abortionPolicy.calendarDay" as const}
                  control={control}
                  render={({ field }) => (
                    <FormControl size="small" sx={{ width: 100 }}>
                      <InputLabel>计算方式</InputLabel>
                      <Select
                        label="计算方式"
                        value={field.value ? 'true' : 'false'}
                        onChange={(e) => field.onChange(e.target.value === 'true')}
                      >
                        <MenuItem value="true">日历日</MenuItem>
                        <MenuItem value="false">工作日</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
            {abortionRuleFields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    流产规则 #{index + 1}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => removeAbortionRule(index)}
                    disabled={abortionRuleFields.length <= 1}
                    size="small"
                  >
                    删除规则
                  </Button>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      label="规则描述"
                      variant="outlined"
                      size="small"
                      fullWidth
                      {...register(`abortionPolicy.abortionRules.${index}.description` as const, {
                        required: '必填',
                      })}
                      error={!!errors.abortionPolicy?.abortionRules?.[index]?.description}
                      helperText={errors.abortionPolicy?.abortionRules?.[index]?.description?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>是否为固定休假天数</InputLabel>
                      <Select
                        label="是否为固定休假天数"
                        value={
                          (getValues(`abortionPolicy.abortionRules.${index}.leaveDays` as const) ?? null) !== null
                            ? 'fixed'
                            : 'range'
                        }
                        onChange={(e) => {
                          const mode = e.target.value;
                          if (mode === 'fixed') {
                            // 默认设为0天，清空范围
                            setValue(`abortionPolicy.abortionRules.${index}.leaveDays` as const, 0 as any, { shouldValidate: true });
                            setValue(`abortionPolicy.abortionRules.${index}.minLeaveDays` as const, null as any);
                            setValue(`abortionPolicy.abortionRules.${index}.maxLeaveDays` as const, null as any);
                          } else {
                            // 设为范围模式，leaveDays 置为 null
                            setValue(`abortionPolicy.abortionRules.${index}.leaveDays` as const, null as any, { shouldValidate: true });
                          }
                        }}
                      >
                        <MenuItem value="fixed">是（固定天数）</MenuItem>
                        <MenuItem value="range">否（范围天数）</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {(() => {
                    const ld = getValues(`abortionPolicy.abortionRules.${index}.leaveDays` as const) as any;
                    const isFixed = ld !== null && ld !== undefined;
                    return isFixed ? (
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          label="休假天数"
                          type="number"
                          variant="outlined"
                          size="small"
                          fullWidth
                          {...register(`abortionPolicy.abortionRules.${index}.leaveDays` as const, {
                            valueAsNumber: true,
                            required: '必填',
                            min: { value: 0, message: '不能小于0' }
                          })}
                          error={!!errors.abortionPolicy?.abortionRules?.[index]?.leaveDays}
                          helperText={errors.abortionPolicy?.abortionRules?.[index]?.leaveDays?.message}
                        />
                      </Grid>
                    ) : (
                      <>
                        <Grid size={{ xs: 12, sm: 2 }}>
                          <TextField
                            label="最小休假天数"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...register(`abortionPolicy.abortionRules.${index}.minLeaveDays` as const, {
                              valueAsNumber: true,
                              required: '必填',
                              min: { value: 0, message: '不能小于0' }
                            })}
                            error={!!errors.abortionPolicy?.abortionRules?.[index]?.minLeaveDays}
                            helperText={errors.abortionPolicy?.abortionRules?.[index]?.minLeaveDays?.message}
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                          <TextField
                            label="最大休假天数"
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            {...register(`abortionPolicy.abortionRules.${index}.maxLeaveDays` as const, {
                              valueAsNumber: true,
                              required: '必填',
                              min: { value: 0, message: '不能小于0' }
                            })}
                            error={!!errors.abortionPolicy?.abortionRules?.[index]?.maxLeaveDays}
                            helperText={errors.abortionPolicy?.abortionRules?.[index]?.maxLeaveDays?.message}
                          />
                        </Grid>
                      </>
                    );
                  })()}
                </Grid>
              </Box>
            ))}
          </CardContent>
        </SectionCard>

        {/* Removed: 旧版津贴政策分组（statutory/dystocia/moreInfant/bonusLeave） */}
        <SectionCard>
          <SectionHeader
            title="公司薪资列表"
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
          {/* <Typography variant="subtitle2" gutterBottom>公司薪资列表</Typography> */}
          <CardContent>
            {corpSalaryFields.map((field, index) => (
              <Box key={field.id} sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Controller
                      name={`allowancePolicy.corpSalaryDetailList.${index}.companyName` as const}
                      control={control}
                      rules={{ required: '请选择公司' }}
                      render={({ field }) => (
                        <FormControl size="small" variant="outlined" error={!!errors.allowancePolicy?.corpSalaryDetailList?.[index]?.companyName} sx={{ minWidth: 300, width: 300 }}>
                          <InputLabel>公司名称</InputLabel>
                          <Select
                            {...field}
                            label="公司名称"
                            fullWidth
                          >
                            <MenuItem value="OCBC">OCBC</MenuItem>
                            <MenuItem value="E2P">E2P</MenuItem>
                          </Select>
                          {errors.allowancePolicy?.corpSalaryDetailList?.[index]?.companyName && (
                            <FormHelperText style={{ marginTop: 0, marginBottom: 0 }}>
                              {errors.allowancePolicy.corpSalaryDetailList[index]?.companyName?.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
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
                  <Grid size={{ xs: 12, md: 2 }} container justifyContent="flex-end">
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
              {/* Removed: allowancePolicy.allowanceDays（不在类型中） */}
              <Grid size={{ xs: 12, sm: 4 }}>
                <FormControl size="small" fullWidth>
                  <InputLabel>津贴方式</InputLabel>
                  <Select
                    {...register('allowancePolicy.targetAccountType')}
                    label="津贴方式"
                  >
                    <MenuItem value="CORP">公司发放 (CORP)</MenuItem>
                    <MenuItem value="GOV">政府发放 (GOV)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
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
              <Grid size={{ xs: 12, sm: 4 }}>
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
              <Grid size={12}>
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
                <Grid size={12}>
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
                <Grid size={12}>
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
