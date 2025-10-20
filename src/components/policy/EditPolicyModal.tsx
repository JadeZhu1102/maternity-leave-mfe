import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { PolicyForm } from './forms/PolicyForm';
import { CreatePolicyPayload } from '../../types/policyApi';
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
  
  // Map API policy data to PolicyForm initialData without injecting defaults
  useEffect(() => {
    if (policy) {
      const formatted: Partial<CreatePolicyPayload> = {
        // Basic
        cityName: policy.cityName,
        // Statutory: map API top-level maxLeaveDays into form field path
        statutoryPolicy: {
          leaveDays: policy.statutoryPolicy?.leaveDays,
          calendarDay: policy.statutoryPolicy?.calendarDay,
          delayForPublicHoliday: policy.statutoryPolicy?.delayForPublicHoliday,
          // The form binds maxLeaveDays under statutoryPolicy
          // Use API's maxLeaveDays without defaulting
          // @ts-ignore - PolicyForm expects this field in defaultValues; we supply it to override defaults
          maxLeaveDays: policy.maxLeaveDays,
        } as any,
        // Dystocia
        dystociaPolicy: {
          standardLeaveDays: policy.dystociaPolicy?.standardLeaveDays,
          calendarDay: policy.dystociaPolicy?.calendarDay,
          delayForPublicHoliday: policy.dystociaPolicy?.delayForPublicHoliday,
        },
        // More infant: map extraInfantLeaveDays -> leaveDays for the form
        moreInfantPolicy: {
          leaveDays: policy.moreInfantPolicy?.extraInfantLeaveDays as any,
          calendarDay: policy.moreInfantPolicy?.calendarDay,
          delayForPublicHoliday: policy.moreInfantPolicy?.delayForPublicHoliday,
        } as any,
        // Other extended: map standardLeaveDays -> leaveDays for the form
        otherExtendedPolicy: policy.otherExtendedPolicy
          ? {
              leaveDays: (policy.otherExtendedPolicy.standardLeaveDays as any),
              calendarDay: policy.otherExtendedPolicy.calendarDay,
              delayForPublicHoliday: policy.otherExtendedPolicy.delayForPublicHoliday,
            } as any
          : { leaveDays: undefined as any },
        // Abortion: if API没有规则，提供空数组以覆盖默认规则
        abortionPolicy: { abortionRules: [] } as any,
        // Allowance: 覆盖默认公司薪资列表避免出现默认项
        allowancePolicy: { corpSalaryDetailList: [] } as any,
      };

      setInitialData(formatted);
    }
  }, [policy]);

  const handleSubmit = async (data: any) => {
    try {
      setLoading(true);
      
      // Format the payload according to the new API requirements
      const payload = {
        id: policy.id,
        cityCode: data.cityName, // Assuming cityName maps to cityCode
        statutoryPolicy: {
          leaveDays: Number(data.statutoryPolicy?.leaveDays) || 0,
          delayForPublicHoliday: data.statutoryPolicy?.delayForPublicHoliday || false,
          calendarDay: data.statutoryPolicy?.calendarDay ?? true
        },
        dystociaPolicy: {
          standardLeaveDays: Number(data.dystociaPolicy?.standardLeaveDays) || 0,
          delayForPublicHoliday: data.dystociaPolicy?.delayForPublicHoliday || false,
          calendarDay: data.dystociaPolicy?.calendarDay ?? true
        },
        moreInfantPolicy: {
          extraInfantLeaveDays: Number(data.moreInfantPolicy?.leaveDays) || 0,
          delayForPublicHoliday: data.moreInfantPolicy?.delayForPublicHoliday || false,
          calendarDay: data.moreInfantPolicy?.calendarDay ?? true
        },
        otherExtendedPolicy: {
          leaveDays: Number(data.otherExtendedPolicy?.leaveDays) || 0,
          delayForPublicHoliday: data.otherExtendedPolicy?.delayForPublicHoliday || false,
          calendarDay: data.otherExtendedPolicy?.calendarDay ?? true
        },
        abortionPolicy: {
          delayForPublicHoliday: data.abortionPolicy?.delayForPublicHoliday || false,
          calendarDay: data.abortionPolicy?.calendarDay ?? true,
          abortionRules: data.abortionPolicy?.abortionRules || []
        },
        allowancePolicy: {
          corpSalaryDetailList: data.allowancePolicy?.corpSalaryDetailList || [],
          numerator: data.allowancePolicy?.numerator || 1,
          denominator: data.allowancePolicy?.denominator || 30,
          allowanceDaysRule: data.allowancePolicy?.allowanceDaysRule || [],
          targetAccountType: data.allowancePolicy?.targetAccountType || 'CORP',
          differenceCompensationRule: {
            ruleDescription: data.allowancePolicy?.differenceCompensationRule?.ruleDescription || '',
            forceCompensation: data.allowancePolicy?.differenceCompensationRule?.forceCompensation || 'Only if',
            otherCompensationRuleDesc: data.allowancePolicy?.differenceCompensationRule?.otherCompensationRuleDesc || []
          },
          govAllowance: Number(data.allowancePolicy?.govAllowance) || 0
        }
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
