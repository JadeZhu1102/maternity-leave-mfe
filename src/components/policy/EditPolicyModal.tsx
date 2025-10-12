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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const EditPolicyModal: React.FC<EditPolicyModalProps> = ({ 
  open, 
  onClose, 
  policy,
  onSuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const { enqueueSnackbar } = useSnackbar();
  
  // Format the policy data to match the form's initial values
  useEffect(() => {
    if (policy) {
      const formattedPolicy = {
        ...policy,
        // Map basic fields
        cityName: policy.cityName || '',
        effectiveDate: policy.effectiveDate?.split('T')[0] || '',
        expiryDate: policy.expiryDate?.split('T')[0] || '',
        
        // Map statutory policy
        statutoryPolicy: {
          ...policy.statutoryPolicy,
          leaveDays: policy.statutoryPolicy?.leaveDays || 0,
          maxLeaveDays: policy.statutoryPolicy?.maxLeaveDays || 0,
          calendarDay: policy.statutoryPolicy?.calendarDay ?? true, // Default to 日历日
          delayForPublicHoliday: policy.statutoryPolicy?.delayForPublicHoliday ?? false,
          bonusLeaveDays: policy.statutoryPolicy?.bonusLeaveDays || 0,
        },
        
        // Map dystocia policy
        dystociaPolicy: {
          ...policy.dystociaPolicy,
          standardLeaveDays: policy.dystociaPolicy?.standardLeaveDays || 0,
          calendarDay: policy.dystociaPolicy?.calendarDay ?? true,
          delayForPublicHoliday: policy.dystociaPolicy?.delayForPublicHoliday ?? false,
        },
        
        // Map more infant policy
        moreInfantPolicy: {
          ...policy.moreInfantPolicy,
          leaveDays: policy.moreInfantPolicy?.leaveDays || 0,
          calendarDay: policy.moreInfantPolicy?.calendarDay ?? true,
          delayForPublicHoliday: policy.moreInfantPolicy?.delayForPublicHoliday ?? false,
        },
        
        // Map allowance policy (if it exists, otherwise use defaults)
        allowancePolicy: policy.allowancePolicy || {
          statutory: { govAllowance: 0, allowanceDaysRule: '' },
          dystocia: { govAllowance: 0, allowanceDaysRule: '' },
          moreInfant: { govAllowance: 0, allowanceDaysRule: '' },
          bonusLeave: { govAllowance: 0, allowanceDaysRule: '' },
        },
        
        // Map bonus leave policies (if any)
        bonusLeavePolicies: policy.bonusLeavePolicies || [],
      };
      
      setInitialValues(formattedPolicy);
    }
  }, [policy]);

  const handleSubmit = async (data: CreatePolicyPayload) => {
    try {
      setLoading(true);
      
      // Format the payload to match the API requirements
      const payload = {
        ...data,
        id: policy.id, // Ensure we keep the same ID
        // Ensure all number fields are properly converted
        statutoryPolicy: {
          ...data.statutoryPolicy,
          leaveDays: Number(data.statutoryPolicy.leaveDays),
          maxLeaveDays: Number(data.statutoryPolicy.maxLeaveDays),
        },
        dystociaPolicy: {
          ...data.dystociaPolicy,
          standardLeaveDays: Number(data.dystociaPolicy.standardLeaveDays),
        },
        moreInfantPolicy: {
          ...data.moreInfantPolicy,
          leaveDays: Number(data.moreInfantPolicy.leaveDays),
        },
        otherExtendedPolicy: {
          ...data.otherExtendedPolicy,
          leaveDays: Number(data.otherExtendedPolicy.leaveDays),
          maxLeaveDays: Number(data.otherExtendedPolicy.maxLeaveDays),
        },
        allowancePolicy: {
          ...data.allowancePolicy,
          // Format allowance policy data
          statutory: {
            govAllowance: Number(data.allowancePolicy.statutory?.govAllowance) || 0,
            allowanceDaysRule: data.allowancePolicy.statutory?.allowanceDaysRule || '',
          },
          dystocia: {
            govAllowance: Number(data.allowancePolicy.dystocia?.govAllowance) || 0,
            allowanceDaysRule: data.allowancePolicy.dystocia?.allowanceDaysRule || '',
          },
          moreInfant: {
            govAllowance: Number(data.allowancePolicy.moreInfant?.govAllowance) || 0,
            allowanceDaysRule: data.allowancePolicy.moreInfant?.allowanceDaysRule || '',
          },
          bonusLeave: {
            govAllowance: Number(data.allowancePolicy.bonusLeave?.govAllowance) || 0,
            allowanceDaysRule: data.allowancePolicy.bonusLeave?.allowanceDaysRule || '',
          },
        },
      };

      // Call your API to update the policy
      await axios.put(`${API_BASE_URL}/api/policies/${policy.id}`, payload);
      
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
        {initialValues ? (
          <PolicyForm 
            key={policy?.id} // Force re-render when policy changes
            onSubmit={handleSubmit} 
            initialValues={initialValues}
            isEditMode={true}
          />
        ) : (
          <Box py={4} textAlign="center">
            加载中...
          </Box>
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
