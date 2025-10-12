import type { DateCalculateRequest, AllowanceCalculateRequest, CalculateResponse } from '../maternityLeaveService';

// Mock data for calculateDate API
export const mockCalculateDate = async (data: DateCalculateRequest): Promise<CalculateResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Default leave days based on conditions
  let leaveDays = 98; // Standard maternity leave
  const descriptionList: string[] = [];
  
  // Adjust leave days based on conditions
  if (data.infantNumber > 1) {
    leaveDays += 15; // Additional 15 days for multiple births
    descriptionList.push(`多胞胎增加15天产假`);
  }
  
  if (data.dystocia) {
    leaveDays += 15; // Additional 15 days for difficult birth
    descriptionList.push(`难产增加15天产假`);
  }
  
  // Calculate end date based on start date and leave days
  const startDate = new Date(data.leaveStartDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + leaveDays);
  
  // Format dates
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  return {
    leaveDetail: {
      leaveStartDate: formatDate(startDate),
      leaveEndDate: formatDate(endDate),
      currentLeaveDays: leaveDays
    },
    allowanceDetail: {
      allowance: null,
      compensation: null,
      firstMonthSalary: null,
      lastMonthSalary: null,
      otherMonthSalary: null,
      totalSalary: null
    },
    calculateComments: {
      descriptionList: [
        `根据${data.cityName}的产假政策`,
        `标准产假为98天`,
        ...descriptionList,
        `总计产假: ${leaveDays}天`,
        `休假时间: ${formatDate(startDate)} 至 ${formatDate(endDate)}`
      ]
    }
  };
};

// Mock data for calculateMoney API
export const mockCalculateMoney = async (data: AllowanceCalculateRequest): Promise<CalculateResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Calculate allowance based on average salary
  const averageSalary = data.averageSalary || 0;
  const currentSalary = data.currentSalary || 0;
  const startDate = new Date(data.leaveStartDate);
  const endDate = new Date(data.leaveEndDate);
  
  // Calculate number of months (approximate)
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                (endDate.getMonth() - startDate.getMonth()) + 1;
  
  // Calculate allowance (example calculation)
  const baseAllowance = averageSalary * months;
  const compensation = data.hitForceCompensationRule ? baseAllowance * 0.3 : 0;
  const totalAllowance = baseAllowance + compensation;
  
  return {
    leaveDetail: {
      leaveStartDate: data.leaveStartDate,
      leaveEndDate: data.leaveEndDate,
      currentLeaveDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    },
    allowanceDetail: {
      allowance: Math.round(baseAllowance * 100) / 100,
      compensation: Math.round(compensation * 100) / 100,
      firstMonthSalary: Math.round(averageSalary * 100) / 100,
      lastMonthSalary: Math.round(averageSalary * 100) / 100,
      otherMonthSalary: Math.round(averageSalary * 100) / 100,
      totalSalary: Math.round(totalAllowance * 100) / 100
    },
    calculateComments: {
      descriptionList: [
        `产假津贴计算基准: ${averageSalary}元/月`,
        `产假津贴总额: ${Math.round(baseAllowance * 100) / 100}元`,
        data.hitForceCompensationRule ? `符合生育津贴补偿条件，额外补偿30%: ${Math.round(compensation * 100) / 100}元` : "",
        `总计应发津贴: ${Math.round(totalAllowance * 100) / 100}元`
      ].filter(Boolean)
    }
  };
};

// Export the mock functions with the same interface as the real API
export const calculateLeaveDates = process.env.NODE_ENV === 'test' 
  ? mockCalculateDate 
  : async (data: DateCalculateRequest) => {
      // In development, you can use the mock or real API based on your needs
      if (process.env.NODE_ENV === 'development') {
        return mockCalculateDate(data);
      }
      // In production, use real API
      const response = await fetch('/api/v1/maternity-leave/calculateDate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    };

export const calculateAllowance = process.env.NODE_ENV === 'test'
  ? mockCalculateMoney
  : async (data: AllowanceCalculateRequest) => {
      // In development, you can use the mock or real API based on your needs
      if (process.env.NODE_ENV === 'development') {
        return mockCalculateMoney(data);
      }
      // In production, use real API
      const response = await fetch('/api/v1/maternity-leave/calculateMoney', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    };
