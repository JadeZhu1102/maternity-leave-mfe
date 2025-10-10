import React from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { CreatePolicyPayload } from '../../../types/policyApi';
import { TextField, Checkbox, FormControlLabel, Typography, IconButton, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface PolicyFormProps {
  onSubmit: (data: CreatePolicyPayload) => Promise<void>;
  initialData?: Partial<CreatePolicyPayload>;
  loading?: boolean;
}

export const PolicyForm: React.FC<PolicyFormProps> = ({
  onSubmit,
  initialData = {},
  // loading state is managed by the parent component
}) => {
  const defaultValues: CreatePolicyPayload = {
    cityName: '',
    statutoryPolicy: {
      leaveDays: 98,
      delayForPublicHoliday: false,
      calendarDay: false,
      maxLeaveDays: 180,
    },
    dystociaPolicy: {
      delayForPublicHoliday: false,
      calendarDay: false,
      standardLeaveDays: 15,
    },
    moreInfantPolicy: {
      leaveDays: 15,
      delayForPublicHoliday: false,
      calendarDay: false,
    },
    otherExtendedPolicy: {
      leaveDays: 0,
      delayForPublicHoliday: false,
      calendarDay: true,
      maxLeaveDays: 180,
    },
    abortionPolicy: {
      delayForPublicHoliday: false,
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
    ...initialData,
  };

  const { register, handleSubmit, control, formState: { errors } } = useForm<CreatePolicyPayload>({
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

  const onSubmitHandler: SubmitHandler<CreatePolicyPayload> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form id="policy-form" onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
      {/* City Name */}
      <div className="mb-6">
        <TextField
          label="城市名称"
          variant="outlined"
          fullWidth
          {...register('cityName', { required: '城市名称为必填项' })}
          error={!!errors.cityName}
          helperText={errors.cityName?.message}
          className="mb-4"
        />
      </div>

      {/* Statutory Policy */}
      <div className="border p-4 rounded-lg mb-6">
        <Typography variant="h6" className="mb-4">法定产假政策</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="基础产假天数"
            type="number"
            {...register('statutoryPolicy.leaveDays', { valueAsNumber: true, required: '必填' })}
            error={!!errors.statutoryPolicy?.leaveDays}
            helperText={errors.statutoryPolicy?.leaveDays?.message}
          />
          <TextField
            label="最长产假天数"
            type="number"
            {...register('statutoryPolicy.maxLeaveDays', { valueAsNumber: true, required: '必填' })}
            error={!!errors.statutoryPolicy?.maxLeaveDays}
            helperText={errors.statutoryPolicy?.maxLeaveDays?.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                {...register('statutoryPolicy.delayForPublicHoliday')}
                defaultChecked={defaultValues.statutoryPolicy?.delayForPublicHoliday}
              />
            }
            label="节假日顺延"
          />
          <FormControlLabel
            control={
              <Checkbox
                {...register('statutoryPolicy.calendarDay')}
                defaultChecked={defaultValues.statutoryPolicy?.calendarDay}
              />
            }
            label="按自然日计算"
          />
        </div>
      </div>

      {/* Dystocia Policy */}
      <div className="border p-4 rounded-lg mb-6">
        <Typography variant="h6" className="mb-4">难产政策</Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="标准难产假天数"
            type="number"
            {...register('dystociaPolicy.standardLeaveDays', { valueAsNumber: true, required: '必填' })}
            error={!!errors.dystociaPolicy?.standardLeaveDays}
            helperText={errors.dystociaPolicy?.standardLeaveDays?.message}
          />
          <div className="col-span-2">
            <FormControlLabel
              control={
                <Checkbox
                  {...register('dystociaPolicy.delayForPublicHoliday')}
                  defaultChecked={defaultValues.dystociaPolicy?.delayForPublicHoliday}
                />
              }
              label="节假日顺延"
            />
            <FormControlLabel
              control={
                <Checkbox
                  {...register('dystociaPolicy.calendarDay')}
                  defaultChecked={defaultValues.dystociaPolicy?.calendarDay}
                />
              }
              label="按自然日计算"
              className="ml-4"
            />
          </div>
        </div>
      </div>

      {/* Allowance Policy */}
      <div className="border p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">津贴政策</Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => appendCorpSalary({ companyName: '', corpAverageSalary: 0 })}
          >
            添加公司薪资
          </Button>
        </div>
        
        {corpSalaryFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
            <TextField
              label="公司名称"
              {...register(`allowancePolicy.corpSalaryDetailList.${index}.companyName` as const, {
                required: '必填',
              })}
              error={!!errors.allowancePolicy?.corpSalaryDetailList?.[index]?.companyName}
              helperText={errors.allowancePolicy?.corpSalaryDetailList?.[index]?.companyName?.message}
            />
            <TextField
              label="公司平均工资"
              type="number"
              {...register(`allowancePolicy.corpSalaryDetailList.${index}.corpAverageSalary` as const, {
                valueAsNumber: true,
                required: '必填',
                min: { value: 0, message: '必须大于等于0' },
              })}
              error={!!errors.allowancePolicy?.corpSalaryDetailList?.[index]?.corpAverageSalary}
              helperText={
                errors.allowancePolicy?.corpSalaryDetailList?.[index]?.corpAverageSalary?.message
              }
            />
            <div className="flex justify-end">
              <IconButton
                color="error"
                onClick={() => removeCorpSalary(index)}
                disabled={corpSalaryFields.length <= 1}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <TextField
            label="津贴天数"
            type="number"
            {...register('allowancePolicy.allowanceDays', { valueAsNumber: true, required: '必填' })}
            error={!!errors.allowancePolicy?.allowanceDays}
            helperText={errors.allowancePolicy?.allowanceDays?.message}
          />
          <TextField
            label="政府津贴"
            type="number"
            {...register('allowancePolicy.govAllowance', { valueAsNumber: true, required: '必填' })}
            error={!!errors.allowancePolicy?.govAllowance}
            helperText={errors.allowancePolicy?.govAllowance?.message}
          />
          <TextField
            label="目标账户类型"
            select
            SelectProps={{ native: true }}
            {...register('allowancePolicy.targetAccountType', { required: '必填' })}
            error={!!errors.allowancePolicy?.targetAccountType}
            helperText={errors.allowancePolicy?.targetAccountType?.message}
          >
            <option value="CORP">公司账户</option>
            <option value="PERSONAL">个人账户</option>
          </TextField>
        </div>
      </div>

      {/* Abortion Policy */}
      <div className="border p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">流产政策</Typography>
          <Button
            variant="outlined"
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
        </div>

        {abortionRuleFields.map((field, index) => (
          <div key={field.id} className="border p-4 rounded-lg mb-4 relative">
            <IconButton
              className="absolute top-2 right-2"
              color="error"
              onClick={() => removeAbortionRule(index)}
              disabled={abortionRuleFields.length <= 1}
            >
              <DeleteIcon />
            </IconButton>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormControlLabel
                control={
                  <Checkbox
                    {...register(`abortionPolicy.abortionRules.${index}.ectopicPregnancy` as const)}
                    defaultChecked={field.ectopicPregnancy}
                  />
                }
                label="宫外孕"
              />
              <TextField
                label="最小怀孕天数"
                type="number"
                {...register(`abortionPolicy.abortionRules.${index}.minRegnancyDays` as const, {
                  valueAsNumber: true,
                  required: '必填',
                })}
                error={
                  !!errors.abortionPolicy?.abortionRules?.[index]?.minRegnancyDays
                }
                helperText={
                  errors.abortionPolicy?.abortionRules?.[index]?.minRegnancyDays?.message
                }
              />
              <TextField
                label="最大怀孕天数"
                type="number"
                {...register(`abortionPolicy.abortionRules.${index}.maxRegnancyDays` as const, {
                  valueAsNumber: true,
                  required: '必填',
                })}
                error={
                  !!errors.abortionPolicy?.abortionRules?.[index]?.maxRegnancyDays
                }
                helperText={
                  errors.abortionPolicy?.abortionRules?.[index]?.maxRegnancyDays?.message
                }
              />
              <TextField
                label="最小休假天数"
                type="number"
                {...register(`abortionPolicy.abortionRules.${index}.minLeaveDays` as const, {
                  valueAsNumber: true,
                  required: '必填',
                })}
                error={
                  !!errors.abortionPolicy?.abortionRules?.[index]?.minLeaveDays
                }
                helperText={
                  errors.abortionPolicy?.abortionRules?.[index]?.minLeaveDays?.message
                }
              />
              <TextField
                label="最大休假天数"
                type="number"
                {...register(`abortionPolicy.abortionRules.${index}.maxLeaveDays` as const, {
                  valueAsNumber: true,
                  required: '必填',
                })}
                error={
                  !!errors.abortionPolicy?.abortionRules?.[index]?.maxLeaveDays
                }
                helperText={
                  errors.abortionPolicy?.abortionRules?.[index]?.maxLeaveDays?.message
                }
              />
              <TextField
                label="休假天数"
                type="number"
                {...register(`abortionPolicy.abortionRules.${index}.leaveDays` as const, {
                  valueAsNumber: true,
                  required: '必填',
                })}
                error={
                  !!errors.abortionPolicy?.abortionRules?.[index]?.leaveDays
                }
                helperText={
                  errors.abortionPolicy?.abortionRules?.[index]?.leaveDays?.message
                }
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};

export default PolicyForm;
