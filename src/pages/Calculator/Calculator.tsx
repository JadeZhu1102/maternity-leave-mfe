/**
 * 产假计算器主页面
 * Maternity Leave Calculator Main Page
 */

import React, { useState } from 'react';
import { useCalculator } from '../../hooks/useCalculator';
import { DatePicker } from '../../components/calculator/DatePicker';
import { Button } from '../../components/common/Button';
import { CITIES } from '../../constants/cities';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import type { City } from '../../types/common';
import { fetchPolicyByCity, type PolicyData } from '../../services/policyService';
import { ResultDisplay } from '../../components/calculator/ResultDisplay';

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
  const [policyData, setPolicyData] = useState<PolicyData | null>(null);
  const [isLoadingPolicy, setIsLoadingPolicy] = useState(false);
  const [policyError, setPolicyError] = useState<string | null>(null);

  // 获取城市政策
  const fetchCityPolicy = async (cityName: string) => {
    const city = CITIES.find(c => c.name === cityName);
    if (!city) {
      setPolicyData(null);
      return;
    }
    
    setIsLoadingPolicy(true);
    setPolicyError(null);
    try {
      const data = await fetchPolicyByCity(city.code);
      setPolicyData(data);
    } catch (error) {
      console.error('Failed to fetch policy:', error);
      setPolicyError('获取城市政策失败，请稍后重试');
      setPolicyData(null);
    } finally {
      setIsLoadingPolicy(false);
    }
  };

  // 处理城市变更
  const handleCityChange = (cityName: string) => {
    updateState({ cityName });
    fetchCityPolicy(cityName);
  };

  // 处理计算按钮点击
  const handleCalculate = async () => {
    await calculate();
  };

  // 处理重置按钮点击
  const handleReset = () => {
    resetState();
    setShowAdvancedOptions(false);
  };

  // 格式化日期显示 - 保留供后续使用
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'yyyy年MM月dd日', { locale: zhCN });
  };

  // 准备政策详情
  const policyDetails = React.useMemo(() => {
    if (!policyData) return [];
    
    const details: string[] = [
      `标准产假: ${policyData.statutoryPolicy.leaveDays}天`,
    ];

    if (policyData.dystociaPolicy.standardLeaveDays > 0) {
      details.push(`难产假: ${policyData.dystociaPolicy.standardLeaveDays}天`);
    }

    if (policyData.moreInfantPolicy.extraInfantLeaveDays > 0) {
      details.push(`多胞胎假: 每多一个婴儿增加${policyData.moreInfantPolicy.extraInfantLeaveDays}天`);
    }

    if (policyData.allowancePolicy) {
      details.push(`生育津贴: 按${policyData.allowancePolicy.numerator}/${policyData.allowancePolicy.denominator}比例发放`);
    }

    return details;
  }, [policyData]);

  // 准备计算结果
  const calculationResult = React.useMemo(() => {
    if (!result) return null;
    
    // Transform the result to match the expected CalculationResult type
    const transformedResult: any = {
      totalLeaveDays: result.totalDays || 0,
      startDate: result.startDate ? formatDate(new Date(result.startDate)) : '',
      endDate: result.endDate ? formatDate(new Date(result.endDate)) : '',
      policyDetails,
    };
    
    // Handle allowance transformation if it exists
    if (result.allowanceDetail) {
      transformedResult.allowance = {
        amount: result.allowanceDetail.allowance || 0,
        // Add other allowance details as needed
      };
    }
    
    return transformedResult;
  }, [result, policyDetails]);

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
                {/* 员工姓名 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    员工姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={state.staffName}
                    onChange={(e) => updateState({ staffName: e.target.value })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="请输入员工姓名"
                  />
                </div>

                {/* 预产期 */}
                <DatePicker
                  label="预产期"
                  value={state.childBirthdate}
                  onChange={(date) => updateState({ childBirthdate: date })}
                  required
                  minDate={new Date()}
                  helpText="请选择预产期"
                />

                {/* 休假开始日期 */}
                <DatePicker
                  label="休假开始日期"
                  value={state.leaveStartDate}
                  onChange={(date) => updateState({ leaveStartDate: date })}
                  required
                  minDate={state.childBirthdate || new Date()}
                  helpText="请选择休假开始日期"
                />

                {/* 所在城市 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    所在城市 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={state.cityName}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoadingPolicy}
                  >
                    <option value="">请选择城市</option>
                    {CITIES.map((city: City) => (
                      <option key={city.code} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {isLoadingPolicy && (
                    <p className="mt-1 text-sm text-gray-500">正在加载城市政策...</p>
                  )}
                  {policyError && (
                    <p className="mt-1 text-sm text-red-500">{policyError}</p>
                  )}
                  {policyData && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                      <p className="font-medium">当前城市政策:</p>
                      <ul className="list-disc list-inside">
                        {policyDetails.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* 婴儿数量 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    婴儿数量
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={state.infantNumber}
                    onChange={(e) => updateState({ infantNumber: parseInt(e.target.value) || 1 })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1"
                  />
                </div>

                {/* 分娩顺序 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    分娩顺序
                  </label>
                  <select
                    value={state.deliverySequence}
                    onChange={(e) => updateState({ deliverySequence: parseInt(e.target.value) })}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">第一胎</option>
                    <option value="2">第二胎</option>
                    <option value="3">第三胎及以上</option>
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
              </button>

              <div className="mt-6 space-y-4">
                {/* 多胞胎 */}
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <input
                      id="dystocia"
                      type="checkbox"
                      checked={state.dystocia}
                      onChange={(e) => updateState({ dystocia: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="dystocia" className="ml-2 block text-sm text-gray-700">
                      是否难产
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="abortion"
                      type="checkbox"
                      checked={state.abortion}
                      onChange={(e) => updateState({ abortion: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="abortion" className="ml-2 block text-sm text-gray-700">
                      是否流产
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="ectopicPregnancy"
                      type="checkbox"
                      checked={state.ectopicPregnancy}
                      onChange={(e) => updateState({ ectopicPregnancy: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="ectopicPregnancy" className="ml-2 block text-sm text-gray-700">
                      是否宫外孕
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
                </div>

                {/* 平均薪资 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    过去12个月平均薪资（元/月）
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">¥</span>
                    </div>
                    <input
                      type="number"
                      value={state.averageSalary || ''}
                      onChange={(e) => updateState({
                        averageSalary: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="例如：10000.00"
                    />
                  </div>
                </div>
                {/* 现薪资 */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    当前薪资（元/月）
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">¥</span>
                    </div>
                    <input
                      type="number"
                      value={state.averageSalary || ''}
                      onChange={(e) => updateState({
                        averageSalary: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      min="0"
                      step="0.01"
                      className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="例如：10000.00"
                    />
                  </div>
                  {/* <p className="text-sm text-gray-500">
                      输入平均月薪可计算生育津贴（按日计算）
                    </p> */}
                </div>
              </div>
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
            {calculationResult ? (
              <ResultDisplay result={calculationResult} />
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
