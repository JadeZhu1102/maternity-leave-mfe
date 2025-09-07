/**
 * 计算历史页面
 * Calculation History Page Component
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { cn } from '../utils/cn';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

interface CalculationRecord {
  id: string;
  userName: string;
  city: string;
  baseMaternityDays: number;
  additionalDays: number;
  totalDays: number;
  allowanceAmount: number;
  calculationType: string;
  createdAt: string;
  updatedAt: string;
}

export function CalculationHistory() {
  const { hasRole } = useAuth();
  const { theme } = useTheme();
  const [records, setRecords] = useState<CalculationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const isAdmin = hasRole('ADMIN') || hasRole('SUPER_ADMIN');

  useEffect(() => {
    loadCalculationHistory();
  }, [currentPage, searchTerm, selectedCity, dateRange]);

  const loadCalculationHistory = async () => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecords: CalculationRecord[] = [
        {
          id: '1',
          userName: '张三',
          city: '北京市',
          baseMaternityDays: 98,
          additionalDays: 30,
          totalDays: 128,
          allowanceAmount: 15600,
          calculationType: '标准产假',
          createdAt: '2024-01-15',
          updatedAt: '2024-01-15',
        },
        {
          id: '2',
          userName: '李四',
          city: '上海市',
          baseMaternityDays: 98,
          additionalDays: 60,
          totalDays: 158,
          allowanceAmount: 18900,
          calculationType: '难产产假',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10',
        },
        {
          id: '3',
          userName: '王五',
          city: '广州市',
          baseMaternityDays: 98,
          additionalDays: 15,
          totalDays: 113,
          allowanceAmount: 13560,
          calculationType: '标准产假',
          createdAt: '2024-01-08',
          updatedAt: '2024-01-08',
        },
      ];
      
      setRecords(mockRecords);
      setTotalPages(1);
    } catch (error) {
      console.error('加载计算历史失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // 导出功能实现
    console.log('导出计算历史');
  };

  const handleViewDetail = (recordId: string) => {
    // 查看详情功能实现
    console.log('查看详情:', recordId);
  };

  const cities = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南京市'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="正在加载计算历史..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-secondary)' }}>
      <div className="space-y-8 p-6">
        {/* 页面标题 */}
        <div className="theme-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>计算历史</h1>
              <p style={{ color: 'var(--color-text-secondary)' }}>查看和管理产假计算记录</p>
            </div>
            <Button
              onClick={handleExport}
              variant="primary"
              size="medium"
              leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
            >
              导出记录
            </Button>
          </div>
        </div>

        {/* 搜索和筛选 */}
        <div className="theme-card p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 搜索框 */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                搜索用户
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
                </div>
                <input
                  type="text"
                  id="search"
                  className="theme-input pl-10"
                  placeholder="输入用户名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* 城市筛选 */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                城市
              </label>
              <select
                id="city"
                className="theme-input"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">全部城市</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* 日期范围 */}
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
                时间范围
              </label>
              <select
                id="dateRange"
                className="theme-input"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="">全部时间</option>
                <option value="today">今天</option>
                <option value="week">最近一周</option>
                <option value="month">最近一月</option>
                <option value="quarter">最近三月</option>
              </select>
            </div>

            {/* 筛选按钮 */}
            <div className="flex items-end">
              <Button
                onClick={() => console.log('应用筛选')}
                variant="secondary"
                size="medium"
                leftIcon={<FunnelIcon className="h-5 w-5" />}
              >
                应用筛选
              </Button>
            </div>
          </div>
        </div>

        {/* 计算记录表格 */}
        <div className="theme-card p-6">
          <div className="overflow-x-auto">
            <table className="theme-table">
              <thead>
                <tr>
                  <th>用户姓名</th>
                  <th>城市</th>
                  <th>基础产假</th>
                  <th>额外天数</th>
                  <th>总天数</th>
                  <th>津贴金额</th>
                  <th>计算类型</th>
                  <th>创建时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="font-medium">{record.userName}</td>
                    <td>{record.city}</td>
                    <td>{record.baseMaternityDays}天</td>
                    <td>{record.additionalDays}天</td>
                    <td className="font-semibold">{record.totalDays}天</td>
                    <td className="font-semibold">¥{record.allowanceAmount.toLocaleString()}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {record.calculationType}
                      </span>
                    </td>
                    <td>{record.createdAt}</td>
                    <td>
                      <Button
                        onClick={() => handleViewDetail(record.id)}
                        variant="ghost"
                        size="small"
                        leftIcon={<EyeIcon className="h-4 w-4" />}
                      >
                        查看
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-6 mt-6" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex-1 flex justify-between sm:hidden">
                <Button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  variant="secondary"
                  size="small"
                >
                  上一页
                </Button>
                <Button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  variant="secondary"
                  size="small"
                >
                  下一页
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    显示第 <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> 到{' '}
                    <span className="font-medium">{Math.min(currentPage * 10, records.length)}</span> 条，
                    共 <span className="font-medium">{records.length}</span> 条记录
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                          page === currentPage
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                          page === 1 ? 'rounded-l-md' : '',
                          page === totalPages ? 'rounded-r-md' : ''
                        )}
                      >
                        {page}
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
