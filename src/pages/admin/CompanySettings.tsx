/**
 * 公司设置页面
 * Company Settings Page Component
 */

import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Button } from '../../components/common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';
import {
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface CompanySettings {
  companyName: string;
  companyCode: string;
  defaultCity: string;
  baseSalary: number;
  socialSecurityBase: number;
  workingDaysPerWeek: number;
  workingHoursPerDay: number;
  allowanceCalculationMethod: 'salary' | 'socialSecurity';
  enableWeekendCalculation: boolean;
  enableHolidayCalculation: boolean;
  customHolidays: string[];
}

export function CompanySettings() {
  const { theme } = useTheme();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [savedCompanies, setSavedCompanies] = useState<CompanySettings[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadCompanySettings();
  }, []);

  const loadCompanySettings = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用 - 加载当前设置和已保存的公司列表
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 加载已保存的公司列表
      const mockSavedCompanies = [
        {
          companyName: '示例科技有限公司',
          companyCode: 'DEMO001',
          defaultCity: 'beijing',
          baseSalary: 8000,
          socialSecurityBase: 8000,
          workingDaysPerWeek: 5,
          workingHoursPerDay: 8,
          allowanceCalculationMethod: 'salary' as const,
          enableWeekendCalculation: false,
          enableHolidayCalculation: true,
          customHolidays: [],
        },
        {
          companyName: '中国建设银行',
          companyCode: 'CCB002',
          defaultCity: 'shanghai',
          baseSalary: 12000,
          socialSecurityBase: 15000,
          workingDaysPerWeek: 5,
          workingHoursPerDay: 8,
          allowanceCalculationMethod: 'socialSecurity' as const,
          enableWeekendCalculation: false,
          enableHolidayCalculation: true,
          customHolidays: [],
        }
      ];
      
      setSavedCompanies(mockSavedCompanies);
      
      // 设置当前编辑的公司信息（默认为第一个）
      setSettings(mockSavedCompanies[0]);
    } catch (error) {
      console.error('加载公司设置失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // 验证数据
      const newErrors: Record<string, string> = {};
      
      if (!settings.companyName.trim()) {
        newErrors.companyName = '公司名称不能为空';
      }
      
      if (!settings.companyCode.trim()) {
        newErrors.companyCode = '公司代码不能为空';
      }
      
      if (settings.baseSalary <= 0) {
        newErrors.baseSalary = '基础工资必须大于0';
      }
      
      if (settings.socialSecurityBase <= 0) {
        newErrors.socialSecurityBase = '社保基数必须大于0';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('公司设置保存成功！');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrors({ general: '保存失败，请稍后重试' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!settings) return;
    
    const { name, value, type } = e.target;
    
    setSettings(prev => prev ? {
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseFloat(value) || 0 : value,
    } : prev);
  };

  const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="正在加载公司设置..." />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载公司设置失败</p>
      </div>
    );
  }

  // 处理编辑公司
  const handleEditCompany = (company: CompanySettings, index: number) => {
    setSettings(company);
    setIsEditing(true);
    setEditingCompanyId(index.toString());
  };

  // 处理删除公司
  const handleDeleteCompany = async (index: number) => {
    if (window.confirm('确定要删除这个公司设置吗？')) {
      const newSavedCompanies = savedCompanies.filter((_, i) => i !== index);
      setSavedCompanies(newSavedCompanies);
      
      // 如果删除的是当前编辑的公司，则重置状态
      if (editingCompanyId === index.toString()) {
        setIsEditing(false);
        setEditingCompanyId(null);
        if (newSavedCompanies.length > 0) {
          setSettings(newSavedCompanies[0]);
        }
      }
      
      setSuccessMessage('公司设置删除成功！');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // 处理新增公司
  const handleAddNewCompany = () => {
    const newCompany: CompanySettings = {
      companyName: '',
      companyCode: '',
      defaultCity: 'beijing',
      baseSalary: 0,
      socialSecurityBase: 0,
      workingDaysPerWeek: 5,
      workingHoursPerDay: 8,
      allowanceCalculationMethod: 'salary',
      enableWeekendCalculation: false,
      enableHolidayCalculation: true,
      customHolidays: [],
    };
    setSettings(newCompany);
    setIsEditing(true);
    setEditingCompanyId('new');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-secondary)' }}>
      <div className="space-y-8 p-6">
        {/* 页面标题 */}
        <div className="theme-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>公司设置</h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>配置公司基本信息和计算参数</p>
            </div>
            <Button
              onClick={handleAddNewCompany}
              variant="primary"
              size="medium"
              leftIcon={<PlusIcon className="h-5 w-5" />}
            >
              新增公司
            </Button>
          </div>
        </div>

        {/* 已保存的公司列表 */}
        {savedCompanies.length > 0 && (
          <div className="theme-card p-6">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>已保存的公司</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCompanies.map((company, index) => (
                <div 
                  key={index}
                  className="theme-card p-4 border-2 transition-all duration-200 hover:shadow-lg"
                  style={{
                    borderColor: editingCompanyId === index.toString() ? 'var(--color-primary)' : 'var(--color-border)'
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
                        {company.companyName}
                      </h3>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        代码：{company.companyCode}
                      </p>
                      <p className="text-sm mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                        基础工资：¥{company.baseSalary.toLocaleString()}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        社保基数：¥{company.socialSecurityBase.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        onClick={() => handleEditCompany(company, index)}
                        variant="secondary"
                        size="small"
                        leftIcon={<PencilIcon className="h-4 w-4" />}
                      >
                        编辑
                      </Button>
                      <Button
                        onClick={() => handleDeleteCompany(index)}
                        variant="error"
                        size="small"
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                      >
                        删除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 公司设置表单 */}
        <div className="theme-card p-6">
          <h2 className="text-lg font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
            {isEditing ? (editingCompanyId === 'new' ? '新增公司设置' : '编辑公司设置') : '公司设置'}
          </h2>

        {/* 成功消息 */}
      {successMessage && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 错误消息 */}
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {errors.general}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <BuildingOfficeIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                基本信息
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  公司名称 *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  required
                  className={cn(
                    "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
                    errors.companyName && "border-red-300"
                  )}
                  value={settings.companyName}
                  onChange={handleInputChange}
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              <div>
                <label htmlFor="companyCode" className="block text-sm font-medium text-gray-700">
                  公司代码 *
                </label>
                <input
                  type="text"
                  id="companyCode"
                  name="companyCode"
                  required
                  className={cn(
                    "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
                    errors.companyCode && "border-red-300"
                  )}
                  value={settings.companyCode}
                  onChange={handleInputChange}
                />
                {errors.companyCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.companyCode}</p>
                )}
              </div>

              <div>
                <label htmlFor="defaultCity" className="block text-sm font-medium text-gray-700">
                  默认城市
                </label>
                <select
                  id="defaultCity"
                  name="defaultCity"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={settings.defaultCity}
                  onChange={handleInputChange}
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 薪资设置 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                薪资设置
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700">
                  基础工资 (元) *
                </label>
                <input
                  type="number"
                  id="baseSalary"
                  name="baseSalary"
                  required
                  min="0"
                  step="0.01"
                  className={cn(
                    "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
                    errors.baseSalary && "border-red-300"
                  )}
                  value={settings.baseSalary}
                  onChange={handleInputChange}
                />
                {errors.baseSalary && (
                  <p className="mt-1 text-sm text-red-600">{errors.baseSalary}</p>
                )}
              </div>

              <div>
                <label htmlFor="socialSecurityBase" className="block text-sm font-medium text-gray-700">
                  社保基数 (元) *
                </label>
                <input
                  type="number"
                  id="socialSecurityBase"
                  name="socialSecurityBase"
                  required
                  min="0"
                  step="0.01"
                  className={cn(
                    "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm",
                    errors.socialSecurityBase && "border-red-300"
                  )}
                  value={settings.socialSecurityBase}
                  onChange={handleInputChange}
                />
                {errors.socialSecurityBase && (
                  <p className="mt-1 text-sm text-red-600">{errors.socialSecurityBase}</p>
                )}
              </div>

              <div>
                <label htmlFor="allowanceCalculationMethod" className="block text-sm font-medium text-gray-700">
                  津贴计算方式
                </label>
                <select
                  id="allowanceCalculationMethod"
                  name="allowanceCalculationMethod"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={settings.allowanceCalculationMethod}
                  onChange={handleInputChange}
                >
                  <option value="salary">基于工资计算</option>
                  <option value="socialSecurity">基于社保基数计算</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 工作时间设置 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center mb-4">
              <CalendarIcon className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                工作时间设置
              </h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="workingDaysPerWeek" className="block text-sm font-medium text-gray-700">
                  每周工作天数
                </label>
                <input
                  type="number"
                  id="workingDaysPerWeek"
                  name="workingDaysPerWeek"
                  min="1"
                  max="7"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={settings.workingDaysPerWeek}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="workingHoursPerDay" className="block text-sm font-medium text-gray-700">
                  每日工作小时数
                </label>
                <input
                  type="number"
                  id="workingHoursPerDay"
                  name="workingHoursPerDay"
                  min="1"
                  max="24"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={settings.workingHoursPerDay}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableWeekendCalculation"
                  name="enableWeekendCalculation"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={settings.enableWeekendCalculation}
                  onChange={handleInputChange}
                />
                <label htmlFor="enableWeekendCalculation" className="ml-2 block text-sm text-gray-900">
                  计算中包含周末
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableHolidayCalculation"
                  name="enableHolidayCalculation"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={settings.enableHolidayCalculation}
                  onChange={handleInputChange}
                />
                <label htmlFor="enableHolidayCalculation" className="ml-2 block text-sm text-gray-900">
                  计算中包含法定节假日
                </label>
              </div>
            </div>
          </div>
        </div>



        {/* 操作按钮 */}
        <div className="flex justify-end space-x-4">
          {isEditing && (
            <Button
              type="button"
              variant="ghost"
              size="large"
              onClick={() => {
                setIsEditing(false);
                setEditingCompanyId(null);
                loadCompanySettings();
              }}
              leftIcon={<XMarkIcon className="h-5 w-5" />}
            >
              取消
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            size="large"
            loading={isSaving}
            leftIcon={!isSaving ? <CheckIcon className="h-5 w-5" /> : undefined}
          >
            {isSaving ? '保存中...' : (isEditing ? '更新设置' : '保存设置')}
          </Button>
        </div>
        </form>
        </div>
      </div>
    </div>
  );
}
