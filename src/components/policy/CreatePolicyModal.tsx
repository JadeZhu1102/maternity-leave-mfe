import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';
import { PolicyForm } from './forms/PolicyForm';
import { CreatePolicyPayload } from '../../types/policyApi';
import axios from 'axios';
import { useSnackbar } from 'notistack';

interface CreatePolicyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const CreatePolicyModal: React.FC<CreatePolicyModalProps> = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  
  // Reset form by incrementing the key to force re-render
  const resetForm = () => {
    setFormKey(prevKey => prevKey + 1);
  };

  const handleSubmit = async (data: CreatePolicyPayload) => {
    try {
      setLoading(true);
      
      // Format the payload to match the API requirements
      const payload = {
        ...data,
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
        abortionPolicy: {
          ...data.abortionPolicy,
          abortionRules: data.abortionPolicy.abortionRules.map(rule => ({
            ...rule,
            minRegnancyDays: Number(rule.minRegnancyDays),
            maxRegnancyDays: Number(rule.maxRegnancyDays),
            minLeaveDays: Number(rule.minLeaveDays),
            maxLeaveDays: Number(rule.maxLeaveDays),
            leaveDays: Number(rule.leaveDays),
          })),
        },
        allowancePolicy: {
          ...data.allowancePolicy,
          corpSalaryDetailList: data.allowancePolicy.corpSalaryDetailList.map(item => ({
            ...item,
            corpAverageSalary: Number(item.corpAverageSalary),
          })),
          numerator: Number(data.allowancePolicy.numerator),
          denominator: Number(data.allowancePolicy.denominator),
          allowanceDays: Number(data.allowancePolicy.allowanceDays),
          govAllowance: Number(data.allowancePolicy.govAllowance),
        },
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/policy/create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      enqueueSnackbar('政策创建成功', { variant: 'success' });
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset the form and close the modal
      resetForm();
      onClose();
    } catch (error) {
      console.error('创建政策失败:', error);
      
      let errorMessage = '创建政策失败';
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle id="create-policy-dialog-title" sx={{ color: 'black' }}>
        新增产假政策
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <PolicyForm 
            key={formKey} 
            onSubmit={handleSubmit} 
            loading={loading} 
            onCancel={() => {
              resetForm();
              onClose();
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
        >
          取消
        </Button>
        <Button 
          type="submit" 
          form="policy-form" 
          color="primary" 
          variant="contained"
          disabled={loading}
        >
          {loading ? '保存中...' : '保存'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePolicyModal;
