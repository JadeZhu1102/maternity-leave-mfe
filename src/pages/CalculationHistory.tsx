/**
 * 计算历史页面
 * Calculation History Page Component
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  DocumentArrowDownIcon,
  CalendarIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import calculationHistoryService, { CalculationHistoryRecord } from '../services/calculationHistoryService';
import { SUPPORTED_CITIES } from '../constants/supportedCities';

export function CalculationHistory() {
  const { hasRole } = useAuth();
  const [records, setRecords] = useState<CalculationHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Date range state
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // Detail dialog state
  const [selectedRecord, setSelectedRecord] = useState<CalculationHistoryRecord | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Admin role check (commented out for future use)
  // const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');

  useEffect(() => {
    loadCalculationHistory();
  }, [currentPage, searchTerm, selectedCity, dateRange]);

  const loadCalculationHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 调用真实API
      const params = {
        staffName: searchTerm || undefined,
        cityCode: selectedCity || undefined,
        startDate: startDate ? startDate.toISOString().split('T')[0] : undefined,
        endDate: endDate ? endDate.toISOString().split('T')[0] : undefined,
        page: currentPage,
        pageSize: 10,
      };

      const data = await calculationHistoryService.getCalculateHistory(params);
      setRecords(data);
      
      // 计算总页数（假设后端返回所有数据，前端分页）
      setTotalPages(Math.ceil(data.length / 10));
    } catch (err: any) {
      const errorMessage = err.message || '加载计算历史失败';
      setError(errorMessage);
      console.error('加载计算历史失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  const handleViewDetail = (record: CalculationHistoryRecord) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  const handleCloseDetail = () => {
    setShowDetailDialog(false);
    setSelectedRecord(null);
  };

  // 获取城市名称
  const getCityName = (cityCode: string) => {
    const city = SUPPORTED_CITIES.find(c => c.code.toLowerCase() === cityCode.toLowerCase());
    return city ? city.name : cityCode;
  };

  // 获取计算类型
  const getCalculationType = (record: CalculationHistoryRecord) => {
    if (record.abortion) return '流产假';
    if (record.leaveDetail.dystociaLeaveDays > 0) return '难产产假';
    if (record.leaveDetail.moreInfantLeaveDays > 0) return '多胎产假';
    return '标准产假';
  };

  const cities = SUPPORTED_CITIES;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="正在加载计算历史..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* 错误提示 */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">错误：</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1 sm:mb-2">计算历史记录</h1>
          <p className="text-xs sm:text-sm text-gray-500">查看和管理产假计算记录</p>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
          <div className="space-y-4">
            {/* Search and Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <input
                  type="text"
                  placeholder="搜索记录..."
                  className="block w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Date Range */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate || new Date()}
                  placeholderText="开始日期"
                  className="block w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  wrapperClassName="w-full"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  maxDate={new Date()}
                  placeholderText="结束日期"
                  className="block w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  wrapperClassName="w-full"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
              
              {/* City Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FunnelIcon className="h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <select
                  className="block w-full pl-12 pr-10 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">所有城市</option>
                  {cities.map(city => (
                    <option key={city.code} value={city.code}>{city.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div className="relative">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">最近一周</option>
                  <option value="month">最近一月</option>
                  <option value="quarter">最近三月</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap min-w-[100px]"
                >
                  <FunnelIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                  <span>更多筛选</span>
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap min-w-[100px]"
                  onClick={handleExport}
                >
                  <DocumentArrowDownIcon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-gray-700" />
                  <span>导出数据</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    计算ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    用户
                  </th>
                  <th scope="col" className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    城市
                  </th>
                  <th scope="col" className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    产假类型
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    总天数
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    津贴金额
                  </th>
                  <th scope="col" className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    计算时间
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.length > 0 ? (
                  records.map((record) => {
                    const calculationType = getCalculationType(record);
                    const cityName = getCityName(record.cityCode);
                    
                    return (
                      <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            #{record.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {record.staffName.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{record.staffName}</div>
                              <div className="text-xs text-gray-500 sm:hidden">{cityName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{cityName}</div>
                        </td>
                        <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            calculationType === '标准产假' 
                              ? 'bg-green-100 text-green-800' 
                              : calculationType === '流产假'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {calculationType}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                          {record.leaveDetail.currentLeaveDays}天
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-blue-600">
                          ¥{record.allowanceDetail.allowance.toLocaleString()}
                        </td>
                        <td className="hidden lg:table-cell px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {record.leaveStartDate}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetail(record)}
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors inline-flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            查看
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>没有找到匹配的记录</p>
                        <p className="text-xs text-gray-400">尝试调整筛选条件或搜索关键词</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {records.length > 0 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  上一页
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  下一页
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-700">
                    显示 <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> 到{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, records.length)}
                    </span>{' '}
                    条，共 <span className="font-medium">{records.length}</span> 条结果
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">上一页</span>
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-3 py-1.5 border text-xs font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">下一页</span>
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 详情对话框 */}
        {showDetailDialog && selectedRecord && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={handleCloseDetail}>
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
              {/* 对话框标题 */}
              <div className="flex justify-between items-center pb-3 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  计算详情 - {selectedRecord.staffName}
                </h3>
                <button
                  onClick={handleCloseDetail}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* 对话框内容 */}
              <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                {/* 基本信息 */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">基本信息</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">员工姓名：</span>
                      <span className="font-medium">{selectedRecord.staffName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">城市：</span>
                      <span className="font-medium">{getCityName(selectedRecord.cityCode)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">休假开始日期：</span>
                      <span className="font-medium">{selectedRecord.leaveStartDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">计算类型：</span>
                      <span className="font-medium">{getCalculationType(selectedRecord)}</span>
                    </div>
                  </div>
                </div>

                {/* 假期详情 */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">假期详情</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">休假开始：</span>
                      <span className="font-medium">{selectedRecord.leaveDetail.leaveStartDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">休假结束：</span>
                      <span className="font-medium">{selectedRecord.leaveDetail.leaveEndDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">当前休假天数：</span>
                      <span className="font-medium text-green-600">{selectedRecord.leaveDetail.currentLeaveDays}天</span>
                    </div>
                    <div>
                      <span className="text-gray-600">法定产假：</span>
                      <span className="font-medium">{selectedRecord.leaveDetail.statutoryLeaveDays}天</span>
                    </div>
                    <div>
                      <span className="text-gray-600">难产假：</span>
                      <span className="font-medium">{selectedRecord.leaveDetail.dystociaLeaveDays}天</span>
                    </div>
                    <div>
                      <span className="text-gray-600">多胎假：</span>
                      <span className="font-medium">{selectedRecord.leaveDetail.moreInfantLeaveDays}天</span>
                    </div>
                    <div>
                      <span className="text-gray-600">其他延长假：</span>
                      <span className="font-medium">{selectedRecord.leaveDetail.otherExtendedLeaveDays}天</span>
                    </div>
                    {selectedRecord.abortion && (
                      <div>
                        <span className="text-gray-600">流产假：</span>
                        <span className="font-medium">{selectedRecord.leaveDetail.abortionLeaveDays}天</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 津贴详情 */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">津贴详情</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">生育津贴：</span>
                      <span className="font-medium text-purple-600">¥{selectedRecord.allowanceDetail.allowance.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">补差金额：</span>
                      <span className="font-medium">¥{selectedRecord.allowanceDetail.compensation.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">第一个月工资：</span>
                      <span className="font-medium">¥{selectedRecord.allowanceDetail.firstMonthSalary.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">最后一个月工资：</span>
                      <span className="font-medium">¥{selectedRecord.allowanceDetail.lastMonthSalary.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">其他月份工资：</span>
                      <span className="font-medium">¥{selectedRecord.allowanceDetail.otherMonthSalary.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">总工资：</span>
                      <span className="font-medium text-purple-600">¥{selectedRecord.allowanceDetail.totalSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* 计算说明 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">计算说明</h4>
                  <div className="space-y-1 text-xs text-gray-700 max-h-60 overflow-y-auto">
                    {selectedRecord.calculateComments.descriptionList.map((desc, index) => (
                      <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                        {index + 1}. {desc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 对话框底部 */}
              <div className="mt-4 pt-3 border-t flex justify-end">
                <button
                  onClick={handleCloseDetail}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
