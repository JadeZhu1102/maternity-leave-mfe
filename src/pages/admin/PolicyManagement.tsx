/**
 * 政策管理页面
 * Policy Management Page Component
 */

import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { cn } from '../../utils/cn';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

interface CityPolicy {
  id: string;
  cityCode: string;
  cityName: string;
  baseMaternityDays: number;
  difficultBirthDays: number;
  multipleBirthDays: number;
  companionLeaveDays: number;
  miscarriageLeaveDays: number;
  effectiveDate: string;
  expiryDate?: string;
  isActive: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export function PolicyManagement() {
  const [policies, setPolicies] = useState<CityPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CityPolicy | null>(null);
  const [formData, setFormData] = useState<Partial<CityPolicy>>({});

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPolicies: CityPolicy[] = [
        {
          id: '1',
          cityCode: 'BJ',
          cityName: '北京市',
          baseMaternityDays: 128,
          difficultBirthDays: 15,
          multipleBirthDays: 15,
          companionLeaveDays: 15,
          miscarriageLeaveDays: 42,
          effectiveDate: '2023-01-01',
          isActive: true,
          description: '北京市最新产假政策',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          cityCode: 'SH',
          cityName: '上海市',
          baseMaternityDays: 158,
          difficultBirthDays: 15,
          multipleBirthDays: 15,
          companionLeaveDays: 10,
          miscarriageLeaveDays: 30,
          effectiveDate: '2023-01-01',
          isActive: true,
          description: '上海市产假政策规定',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '3',
          cityCode: 'GZ',
          cityName: '广州市',
          baseMaternityDays: 178,
          difficultBirthDays: 30,
          multipleBirthDays: 15,
          companionLeaveDays: 15,
          miscarriageLeaveDays: 30,
          effectiveDate: '2023-01-01',
          isActive: true,
          description: '广州市产假政策实施细则',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      setPolicies(mockPolicies);
    } catch (error) {
      console.error('加载政策失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPolicy = () => {
    setEditingPolicy(null);
    setFormData({
      cityCode: '',
      cityName: '',
      baseMaternityDays: 98,
      difficultBirthDays: 15,
      multipleBirthDays: 15,
      companionLeaveDays: 15,
      miscarriageLeaveDays: 42,
      effectiveDate: new Date().toISOString().split('T')[0],
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditPolicy = (policy: CityPolicy) => {
    setEditingPolicy(policy);
    setFormData({
      ...policy,
      effectiveDate: policy.effectiveDate.split('T')[0],
      expiryDate: policy.expiryDate?.split('T')[0],
    });
    setShowModal(true);
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm('确定要删除这个政策吗？')) return;

    try {
      // 这里应该调用实际的API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPolicies(prev => prev.filter(p => p.id !== policyId));
    } catch (error) {
      console.error('删除政策失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 这里应该调用实际的API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingPolicy) {
        // 更新政策
        setPolicies(prev => prev.map(p => 
          p.id === editingPolicy.id 
            ? { ...p, ...formData, updatedAt: new Date().toISOString() }
            : p
        ));
      } else {
        // 添加新政策
        const newPolicy: CityPolicy = {
          ...formData as CityPolicy,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setPolicies(prev => [...prev, newPolicy]);
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('保存政策失败:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const filteredPolicies = policies.filter(policy =>
    policy.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.cityCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">政策管理</h1>
          <p className="text-gray-600">管理各城市的产假政策配置</p>
        </div>
        <button
          onClick={handleAddPolicy}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          添加政策
        </button>
      </div>

      {/* 搜索框 */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            搜索城市
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="输入城市名称或代码..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 政策列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="正在加载政策..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    城市信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    基础产假
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    难产假期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    多胞胎假期
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    陪产假
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    生效时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {policy.cityName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {policy.cityCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {policy.baseMaternityDays} 天
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {policy.difficultBirthDays} 天
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {policy.multipleBirthDays} 天
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {policy.companionLeaveDays} 天
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(policy.effectiveDate).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                        policy.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}>
                        {policy.isActive ? '生效中' : '已停用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 添加/编辑政策模态框 */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center mb-4">
                    <DocumentTextIcon className="h-6 w-6 text-primary-600 mr-2" />
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {editingPolicy ? '编辑政策' : '添加政策'}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">城市代码</label>
                        <input
                          type="text"
                          name="cityCode"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.cityCode || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">城市名称</label>
                        <input
                          type="text"
                          name="cityName"
                          required
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.cityName || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">基础产假(天)</label>
                        <input
                          type="number"
                          name="baseMaternityDays"
                          required
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.baseMaternityDays || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">难产假期(天)</label>
                        <input
                          type="number"
                          name="difficultBirthDays"
                          required
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.difficultBirthDays || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">多胞胎假期(天)</label>
                        <input
                          type="number"
                          name="multipleBirthDays"
                          required
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.multipleBirthDays || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">陪产假(天)</label>
                        <input
                          type="number"
                          name="companionLeaveDays"
                          required
                          min="0"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={formData.companionLeaveDays || 0}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">流产假期(天)</label>
                      <input
                        type="number"
                        name="miscarriageLeaveDays"
                        required
                        min="0"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.miscarriageLeaveDays || 0}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">生效日期</label>
                      <input
                        type="date"
                        name="effectiveDate"
                        required
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.effectiveDate || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">政策描述</label>
                      <textarea
                        name="description"
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={formData.description || ''}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={formData.isActive || false}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        启用此政策
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingPolicy ? '更新' : '添加'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
