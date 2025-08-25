/**
 * 产假计算器主页面
 * Maternity Leave Calculator Main Page
 */

import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import { DatePicker } from '../../components/calculator/DatePicker';
import { PolicySelector } from '../../components/calculator/PolicySelector';
import { ResultDisplay } from '../../components/calculator/ResultDisplay';
import { Button } from '../../components/common/Button';
import { EMPLOYMENT_TYPE_OPTIONS } from '../../constants/policies';

/**
 * 产假计算器页面组件
 * 提供完整的产假计算功能，包括参数输入、计算和结果展示
 * 
 * @returns React 组件
 */
export const Calculator: React.FC = () => {
  const {
    state,
    result,
    errors,
    isCalculating,
    isValid,
    completionPercentage,
    nextStepHint,
    updateState,
    resetState,
    calculate,
  } = useCalculator();

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  // 处理计算按钮点击
  const handleCalculate = async () => {
    await calculate();
  };

  // 处理重置按钮点击
  const handleReset = () => {
    resetState();
    setShowAdvancedOptions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            产假计算器
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于最新政策法规，精确计算您的产假天数和生育津贴，支持全国主要城市政策
          </p>
        </div>

        {/* 进度指示器 */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">填写进度</span>
              <span className="text-sm font-medium text-primary-600">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {nextStepHint && (
              <p className="text-sm text-gray-600 mt-2">{nextStepHint}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：输入表单 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">基本信息</h2>
              
              <div className="space-y-6">
                {/* 入职日期 */}
                <DatePicker
                  label="入职日期"
                  value={state.employmentDate}
                  onChange={(date) => updateState({ employmentDate: date })}
                  required
                  maxDate={new Date()}
                  helpText="请选择您开始工作的日期"
                />

                {/* 预产期/生产日期 */}
                <DatePicker
                  label="预产期/生产日期"
                  value={state.startDate}
                  onChange={(date) => updateState({ startDate: date })}
                  required
                  minDate={state.employmentDate || undefined}
                  helpText="请选择预产期或实际生产日期"
                />

                {/* 所在地区 */}
                <PolicySelector
                  label="所在地区"
                  value={state.region}
                  onChange={(region) => updateState({ region })}
                  required
                  helpText="选择您工作所在的城市，将应用对应的产假政策"
                />

                {/* 就业类型 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    就业类型
                  </label>
                  <select
                    value={state.employmentType}
                    onChange={(e) => updateState({ employmentType: e.target.value as any })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {EMPLOYMENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 高级选项 */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                type="button"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">高级选项</h3>
                <svg 
                  className={`h-5 w-5 text-gray-500 transition-transform ${showAdvancedOptions ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showAdvancedOptions && (
                <div className="mt-6 space-y-4">
                  {/* 多胞胎 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="multipleBirth"
                      checked={state.isMultipleBirth || false}
                      onChange={(e) => updateState({ isMultipleBirth: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="multipleBirth" className="ml-2 text-sm text-gray-700">
                      多胞胎（双胞胎、三胞胎等）
                    </label>
                  </div>

                  {/* 难产 */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="difficultBirth"
                      checked={state.isDifficultBirth || false}
                      onChange={(e) => updateState({ isDifficultBirth: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="difficultBirth" className="ml-2 text-sm text-gray-700">
                      难产（剖腹产、产钳助产等）
                    </label>
                  </div>

                  {/* 年龄 */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      年龄（可选）
                    </label>
                    <input
                      type="number"
                      value={state.age || ''}
                      onChange={(e) => updateState({ age: e.target.value ? parseInt(e.target.value) : undefined })}
                      min="18"
                      max="50"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="请输入年龄"
                    />
                    <p className="text-sm text-gray-500">部分地区对晚育有额外假期政策</p>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <Button
                onClick={handleCalculate}
                disabled={!isValid}
                loading={isCalculating}
                size="large"
                className="flex-1"
              >
                {isCalculating ? '计算中...' : '计算产假'}
              </Button>
              
              <Button
                onClick={handleReset}
                variant="ghost"
                size="large"
              >
                重置
              </Button>
            </div>

            {/* 错误信息 */}
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">请修正以下问题：</h3>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：计算结果 */}
          <div className="space-y-6">
            {result ? (
              <ResultDisplay result={result} />
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">等待计算</h3>
                <p className="text-gray-500">
                  请填写左侧表单信息，然后点击"计算产假"按钮查看结果
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 页面底部说明 */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">计算依据</h4>
              <ul className="space-y-1">
                <li>• 基于《女职工劳动保护特别规定》</li>
                <li>• 各地最新人口与计划生育条例</li>
                <li>• 社会保险相关政策法规</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">注意事项</h4>
              <ul className="space-y-1">
                <li>• 计算结果仅供参考，以实际政策为准</li>
                <li>• 津贴金额需根据实际缴费基数计算</li>
                <li>• 如有疑问请咨询当地社保部门</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
