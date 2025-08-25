/**
 * 主应用组件
 * Main Application Component
 */

import { Calculator } from './pages/Calculator';
import './styles/globals.css';

/**
 * 产假计算器主应用
 * 提供完整的产假计算功能和用户界面
 * 
 * @returns React 应用组件
 */
function App() {
  return (
    <div className="App">
      {/* 应用头部 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg 
                  className="h-8 w-8 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-semibold text-gray-900">
                  产假计算器
                </h1>
                <p className="text-sm text-gray-500">
                  基于最新政策的专业计算工具
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="min-h-screen">
        <Calculator />
      </main>

      {/* 应用底部 */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                关于我们
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                专业的产假计算工具，基于最新的国家和地方政策法规，
                为准妈妈们提供准确的产假天数和津贴计算服务。
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                政策依据
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>《女职工劳动保护特别规定》</li>
                <li>各地人口与计划生育条例</li>
                <li>社会保险相关政策法规</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                免责声明
              </h3>
              <p className="mt-4 text-sm text-gray-600">
                本工具提供的计算结果仅供参考，实际执行请以当地
                人力资源和社会保障部门的最新政策为准。
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              © 2024 产假计算器. 保留所有权利.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
