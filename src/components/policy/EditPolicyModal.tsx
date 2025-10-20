import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { PolicyForm } from './forms/PolicyForm';
import { CreatePolicyPayload, UpdatePolicyPayload } from '../../types/policyApi';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface EditPolicyModalProps {
  open: boolean;
  onClose: () => void;
  policy: any; // Replace 'any' with your policy type
  onSuccess?: () => void;
}

// API配置 - 使用相对路径，通过Vite代理访问
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({ 
  open, 
  onClose, 
  policy,
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<CreatePolicyPayload> | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  
  // Map API policy data to PolicyForm initialData aligned with CreatePolicyPayload
  useEffect(() => {
    if (policy) {
      const formatted: Partial<CreatePolicyPayload> = {
        cityName: policy.cityName,
        cityCode: policy.cityCode,
        statutoryPolicy: {
          leaveDays: policy.statutoryPolicy?.leaveDays,
          calendarDay: policy.statutoryPolicy?.calendarDay,
          delayForPublicHoliday: policy.statutoryPolicy?.delayForPublicHoliday,
        },
        dystociaPolicy: {
          standardLeaveDays: policy.dystociaPolicy?.standardLeaveDays,
          delayForPublicHoliday: policy.dystociaPolicy?.delayForPublicHoliday,
          calendarDay: policy.dystociaPolicy?.calendarDay,
        },
        moreInfantPolicy: {
          extraInfantLeaveDays: policy.moreInfantPolicy?.extraInfantLeaveDays,
          delayForPublicHoliday: policy.moreInfantPolicy?.delayForPublicHoliday,
          calendarDay: policy.moreInfantPolicy?.calendarDay,
        },
        otherExtendedPolicy: policy.otherExtendedPolicy
          ? {
              leaveDays: (policy.otherExtendedPolicy.leaveDays ?? policy.otherExtendedPolicy.standardLeaveDays) ?? 0,
              delayForPublicHoliday: policy.otherExtendedPolicy.delayForPublicHoliday,
              calendarDay: policy.otherExtendedPolicy.calendarDay,
            }
          : undefined,
        abortionPolicy: {
          delayForPublicHoliday: policy.abortionPolicy?.delayForPublicHoliday ?? false,
          calendarDay: policy.abortionPolicy?.calendarDay ?? true,
          abortionRules: Array.isArray(policy.abortionPolicy?.abortionRules)
            ? policy.abortionPolicy.abortionRules.map((r: any) => ({
                ruleCode: r.ruleCode,
                description: r.description,
                leaveDays: r.leaveDays ?? 0,
              }))
            : [],
        },
        allowancePolicy: {
          corpSalaryDetailList: Array.isArray(policy.allowancePolicy?.corpSalaryDetailList)
            ? policy.allowancePolicy.corpSalaryDetailList.map((c: any) => ({
                companyName: c.companyName,
                corpAverageSalary: c.corpAverageSalary,
              }))
            : [],
          numerator: policy.allowancePolicy?.numerator ?? 1,
          denominator: policy.allowancePolicy?.denominator ?? 30,
          allowanceDaysRule: Array.isArray(policy.allowancePolicy?.allowanceDaysRule)
            ? policy.allowancePolicy.allowanceDaysRule
            : [],
          targetAccountType: policy.allowancePolicy?.targetAccountType ?? 'CORP',
          differenceCompensationRule: {
            ruleDescription: policy.allowancePolicy?.differenceCompensationRule?.ruleDescription ?? '',
            forceCompensation: policy.allowancePolicy?.differenceCompensationRule?.forceCompensation ?? 'No',
            otherCompensationRuleDesc: Array.isArray(policy.allowancePolicy?.differenceCompensationRule?.otherCompensationRuleDesc)
              ? policy.allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc
              : [],
          },
          govAllowance: policy.allowancePolicy?.govAllowance ?? 0,
        },
      };

      setInitialData(formatted);
    }
  }, [policy]);

  const handleSubmit = async (data: CreatePolicyPayload) => {
    try {
      setLoading(true);
      
      // Build UpdatePolicyPayload strictly aligned with types
      const payload: UpdatePolicyPayload = {
        id: Number(policy.id) || 0,
        cityCode: data.cityCode || policy.cityCode,
        statutoryPolicy: {
          leaveDays: Number(data.statutoryPolicy.leaveDays) || 0,
          delayForPublicHoliday: !!data.statutoryPolicy.delayForPublicHoliday,
          calendarDay: !!data.statutoryPolicy.calendarDay,
        },
        dystociaPolicy: {
          standardLeaveDays: Number(data.dystociaPolicy.standardLeaveDays) || 0,
          delayForPublicHoliday: !!data.dystociaPolicy.delayForPublicHoliday,
          calendarDay: !!data.dystociaPolicy.calendarDay,
        },
        moreInfantPolicy: {
          extraInfantLeaveDays: Number(data.moreInfantPolicy.extraInfantLeaveDays) || 0,
          delayForPublicHoliday: !!data.moreInfantPolicy.delayForPublicHoliday,
          calendarDay: !!data.moreInfantPolicy.calendarDay,
        },
        otherExtendedPolicy: {
          leaveDays: Number(data.otherExtendedPolicy.leaveDays) || 0,
          delayForPublicHoliday: !!data.otherExtendedPolicy.delayForPublicHoliday,
          calendarDay: !!data.otherExtendedPolicy.calendarDay,
        },
        abortionPolicy: {
          delayForPublicHoliday: !!data.abortionPolicy.delayForPublicHoliday,
          calendarDay: !!data.abortionPolicy.calendarDay,
          abortionRules: (data.abortionPolicy.abortionRules || []).map(r => ({
            ruleCode: r.ruleCode,
            description: r.description,
            leaveDays: Number(r.leaveDays) || 0,
          })),
        },
        allowancePolicy: {
          corpSalaryDetailList: (data.allowancePolicy.corpSalaryDetailList || []).map(r => ({
            companyName: r.companyName,
            corpAverageSalary: Number(r.corpAverageSalary) || 0,
          })),
          numerator: Number(data.allowancePolicy.numerator) || 1,
          denominator: Number(data.allowancePolicy.denominator) || 30,
          allowanceDaysRule: data.allowancePolicy.allowanceDaysRule || [],
          targetAccountType: data.allowancePolicy.targetAccountType || 'CORP',
          differenceCompensationRule: {
            ruleDescription: data.allowancePolicy.differenceCompensationRule.ruleDescription || '',
            forceCompensation: data.allowancePolicy.differenceCompensationRule.forceCompensation || 'No',
            otherCompensationRuleDesc: data.allowancePolicy.differenceCompensationRule.otherCompensationRuleDesc || [],
          },
          govAllowance: Number(data.allowancePolicy.govAllowance) || 0,
        },
      };

      // Call the API to update the policy
      await axios.post(`${API_BASE_URL}/api/v1/policy/update`, payload);
      
      enqueueSnackbar('政策更新成功', { variant: 'success' });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
    } catch (error) {
      console.error('更新政策失败:', error);
      enqueueSnackbar('更新政策失败，请重试', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      aria-labelledby="edit-policy-dialog-title"
    >
      <DialogTitle id="edit-policy-dialog-title">编辑政策</DialogTitle>
      <DialogContent dividers>
        {initialData ? (
          <PolicyForm
            key={policy?.id}
            onSubmit={handleSubmit}
            initialData={initialData}
          />
        ) : (
          <Box py={4} textAlign="center">加载中...</Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={handleClose} 
          color="inherit"
          disabled={loading}
        >
          取消
        </Button>
        <Button 
          type="submit" 
          form="policy-form" 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? '保存中...' : '保存更改'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPolicyModal;
