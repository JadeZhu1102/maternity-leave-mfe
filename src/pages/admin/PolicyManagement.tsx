/**
 * 政策管理页面
 * Policy Management Page Component
 */

import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import CreatePolicyModal from '../../components/policy/CreatePolicyModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { cn } from '../../utils/cn';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import EditPolicyModal from '../../components/policy/EditPolicyModal';
import { getAllPolicies, type PolicyData } from '../../services/policyService';

// Define the CityPolicy interface
interface CityPolicy {
  id: string;
  cityName: string;
  statutoryPolicy: {
    leaveDays: number;
    maxLeaveDays: number;
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
    bonusLeaveDays: number; // 添加奖励假字段
  };
  dystociaPolicy: {
    standardLeaveDays: number;
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
  };
  moreInfantPolicy: {
    leaveDays: number;
    delayForPublicHoliday: boolean;
    calendarDay: boolean;
  };
  isActive: boolean;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export function PolicyManagement() {
  const [policies, setPolicies] = useState<CityPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<CityPolicy | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setIsLoading(true);
    try {
      // 调用真实API获取所有政策
      const apiPolicies = await getAllPolicies();
      
      // 将API数据转换为组件需要的格式
      const formattedPolicies: CityPolicy[] = apiPolicies.map((policy, index) => ({
        id: String(index + 1),
        cityName: policy.cityName,
        statutoryPolicy: {
          leaveDays: policy.statutoryPolicy.leaveDays,
          maxLeaveDays: policy.statutoryPolicy.maxLeaveDays,
          delayForPublicHoliday: policy.statutoryPolicy.delayForPublicHoliday,
          calendarDay: policy.statutoryPolicy.calendarDay,
          bonusLeaveDays: policy.statutoryPolicy.maxLeaveDays - policy.statutoryPolicy.leaveDays
        },
        dystociaPolicy: {
          standardLeaveDays: policy.dystociaPolicy.standardLeaveDays,
          delayForPublicHoliday: policy.dystociaPolicy.delayForPublicHoliday,
          calendarDay: policy.dystociaPolicy.calendarDay
        },
        moreInfantPolicy: {
          leaveDays: policy.moreInfantPolicy.leaveDays,
          delayForPublicHoliday: policy.moreInfantPolicy.delayForPublicHoliday,
          calendarDay: policy.moreInfantPolicy.calendarDay
        },
        isActive: true,
        effectiveDate: policy.effectiveDate,
        createdAt: policy.lastUpdated,
        updatedAt: policy.lastUpdated
      }));

      setPolicies(formattedPolicies);
    } catch (error) {
      console.error('加载政策数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPolicy = () => {
    setShowCreateModal(true);
  };

  const handleEditPolicy = (policy: CityPolicy) => {
    setEditingPolicy(policy);
  };

  const handleDeleteClick = (policyId: string) => {
    setPolicyToDelete(policyId);
    setShowDeleteDialog(true);
  };

  const handleDeletePolicy = async () => {
    if (!policyToDelete) return;
    
    try {
      // TODO: 调用真实API删除政策
      // await deletePolicyAPI(policyToDelete);
      
      // 暂时使用本地删除，等待后端删除API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPolicies(prev => prev.filter(policy => policy.id !== policyToDelete));
      
      setPolicyToDelete(null);
      console.log('政策删除成功');
    } catch (error) {
      console.error('删除政策失败:', error);
      console.error('删除政策失败，请重试');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const handlePolicyCreated = () => {
    // 刷新政策列表
    loadPolicies();
    setShowCreateModal(false);
  };

  const normalizedTerm = (searchTerm ?? '').toLowerCase();
  const filteredPolicies = policies.filter(policy =>
    (policy.cityName ?? '').toLowerCase().includes(normalizedTerm)
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">政策管理</h1>
          <p className="text-gray-600">管理各城市的产假政策配置</p>
        </div>

        {/* 添加政策按钮 */}
        <button
          type="button"
          onClick={handleAddPolicy}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md   bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          添加政策
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1">
            {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div> */}
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="搜索城市或代码..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 政策列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <LoadingSpinner size="lg" text="加载中..." />
          </div>
        ) : filteredPolicies.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到匹配的政策</h3>
            <p className="mt-1 text-sm text-gray-500">尝试修改搜索条件或添加新政策。</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleAddPolicy}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md   bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                添加政策
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    城市
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    法定产假
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最长产假
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    难产假
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    多胎假
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    奖励假
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">操作</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{policy.cityName}</span>
                        <span className="text-xs text-gray-500">生效日: {policy.effectiveDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{policy.statutoryPolicy.leaveDays} 天</span>
                        <span className="text-xs text-gray-500">
                          {policy.statutoryPolicy.delayForPublicHoliday ? '日历日' : '工作日'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{policy.statutoryPolicy.maxLeaveDays} 天</span>
                        <span className="text-xs text-gray-500">
                          {policy.statutoryPolicy.calendarDay ? '日历日' : '工作日'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{policy.dystociaPolicy.standardLeaveDays} 天</span>
                        <span className="text-xs text-gray-500">
                          {policy.dystociaPolicy.delayForPublicHoliday ? '日历日' : '工作日'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{policy.moreInfantPolicy.leaveDays} 天</span>
                        <span className="text-xs text-gray-500">
                          {policy.moreInfantPolicy.delayForPublicHoliday ? '日历日' : '工作日'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-900">{policy.statutoryPolicy.bonusLeaveDays} 天</span>
                        <span className="text-xs text-gray-500">
                          奖励假
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                        )}
                      >
                        {policy.isActive ? '启用' : '禁用'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(policy.id)}
                        className="text-red-600 hover:text-red-900"
                        title="删除政策"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreatePolicyModal 
          open={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={handlePolicyCreated} 
        />
      )}
      
      {editingPolicy && (
        <EditPolicyModal
          open={!!editingPolicy}
          onClose={() => setEditingPolicy(null)}
          policy={editingPolicy}
          onSuccess={handlePolicyCreated}
        />
      )}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeletePolicy}
        title="确认删除"
        message="确定要删除这条政策吗？此操作不可撤销。"
        confirmText="确认删除"
        cancelText="取消"
        isDanger={true}
      />
    </div>
  );
}
