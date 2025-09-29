/**
 * 政策编辑弹框组件
 * Policy Edit Modal Component
 */

import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CityPolicy {
  id?: string;
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
}

interface PolicyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  policy: Partial<CityPolicy>;
  onSave: (updatedPolicy: Partial<CityPolicy>) => void;
  title?: string;
}

export function PolicyEditModal({
  isOpen,
  onClose,
  policy,
  onSave,
  title = '编辑政策'
}: PolicyEditModalProps) {
  const [formData, setFormData] = React.useState<Partial<CityPolicy>>(policy);

  // Update form data when policy prop changes
  React.useEffect(() => {
    setFormData(policy);
  }, [policy]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : 
             type === 'checkbox' ? (e.target as HTMLInputElement).checked :
             value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                    {title}
                  </Dialog.Title>
                  <div className="mt-3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* 城市代码 */}
                        <div>
                          <label htmlFor="cityCode" className="block text-sm font-medium text-gray-700">
                            城市代码
                          </label>
                          <input
                            type="text"
                            name="cityCode"
                            id="cityCode"
                            value={formData.cityCode || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 城市名称 */}
                        <div>
                          <label htmlFor="cityName" className="block text-sm font-medium text-gray-700">
                            城市名称
                          </label>
                          <input
                            type="text"
                            name="cityName"
                            id="cityName"
                            value={formData.cityName || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 基础产假天数 */}
                        <div>
                          <label htmlFor="baseMaternityDays" className="block text-sm font-medium text-gray-700">
                            基础产假天数
                          </label>
                          <input
                            type="number"
                            name="baseMaternityDays"
                            id="baseMaternityDays"
                            value={formData.baseMaternityDays || ''}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 难产增加天数 */}
                        <div>
                          <label htmlFor="difficultBirthDays" className="block text-sm font-medium text-gray-700">
                            难产增加天数
                          </label>
                          <input
                            type="number"
                            name="difficultBirthDays"
                            id="difficultBirthDays"
                            value={formData.difficultBirthDays || ''}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 多胞胎增加天数 */}
                        <div>
                          <label htmlFor="multipleBirthDays" className="block text-sm font-medium text-gray-700">
                            多胞胎增加天数/每孩
                          </label>
                          <input
                            type="number"
                            name="multipleBirthDays"
                            id="multipleBirthDays"
                            value={formData.multipleBirthDays || ''}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 配偶陪产假天数 */}
                        <div>
                          <label htmlFor="companionLeaveDays" className="block text-sm font-medium text-gray-700">
                            配偶陪产假天数
                          </label>
                          <input
                            type="number"
                            name="companionLeaveDays"
                            id="companionLeaveDays"
                            value={formData.companionLeaveDays || ''}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 流产假天数 */}
                        <div>
                          <label htmlFor="miscarriageLeaveDays" className="block text-sm font-medium text-gray-700">
                            流产假天数
                          </label>
                          <input
                            type="number"
                            name="miscarriageLeaveDays"
                            id="miscarriageLeaveDays"
                            value={formData.miscarriageLeaveDays || ''}
                            onChange={handleChange}
                            min="0"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 生效日期 */}
                        <div>
                          <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                            生效日期
                          </label>
                          <input
                            type="date"
                            name="effectiveDate"
                            id="effectiveDate"
                            value={formData.effectiveDate || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            required
                          />
                        </div>

                        {/* 失效日期 */}
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                            失效日期（可选）
                          </label>
                          <input
                            type="date"
                            name="expiryDate"
                            id="expiryDate"
                            value={formData.expiryDate || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                        </div>

                        {/* 是否启用 */}
                        <div className="flex items-center">
                          <input
                            id="isActive"
                            name="isActive"
                            type="checkbox"
                            checked={!!formData.isActive}
                            onChange={handleChange}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                            是否启用此政策
                          </label>
                        </div>
                      </div>

                      {/* 政策描述 */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          政策描述（可选）
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            value={formData.description || ''}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* 按钮组 */}
                      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2"
                        >
                          保存更改
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={onClose}
                        >
                          取消
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
