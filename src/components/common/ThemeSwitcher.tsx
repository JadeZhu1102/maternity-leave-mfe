/**
 * 主题切换器组件
 * Theme Switcher Component
 */

import { useState } from 'react';
import { useTheme, ThemeType } from '../../contexts/ThemeContext';
import { cn } from '../../utils/cn';

export function ThemeSwitcher() {
  const { currentTheme, setTheme, themes, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // If theme data isn't loaded yet, show a loading state
  if (!theme || !themes || !currentTheme) {
    return (
      <div className="px-4 py-2 rounded-lg bg-white/10 animate-pulse">
        <div className="w-24 h-6 rounded bg-white/20"></div>
      </div>
    );
  }

  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  const getThemeIcon = (themeId: ThemeType) => {
    const icons = {
      fresh: '🌱',
      modern: '💼',
      tech: '⚡',
      warm: '🌸'
    };
    return icons[themeId];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
          "bg-white/10 backdrop-blur-sm border border-white/20",
          "hover:bg-white/20 hover:scale-105",
          "text-sm font-medium"
        )}
        style={{
          color: 'var(--color-text)',
          borderColor: 'var(--color-border)'
        }}
      >
        <span className="text-lg">{getThemeIcon(currentTheme)}</span>
        <span>{theme?.name || currentTheme}</span>
        <svg 
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 主题选择面板 */}
          <div 
            className={cn(
              "absolute right-0 top-full mt-2 w-80 z-50",
              "bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl",
              "border border-white/20 overflow-hidden",
              "animate-in slide-in-from-top-2 duration-200"
            )}
            style={{
              background: 'var(--gradient-card)',
              borderColor: 'var(--color-border)',
              boxShadow: 'var(--shadow-large)'
            }}
          >
            <div className="p-4">
              <h3 
                className="text-lg font-semibold mb-3"
                style={{ color: 'var(--color-text)' }}
              >
                选择主题风格
              </h3>
              
              <div className="space-y-2">
                {Object.values(themes).map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={cn(
                      "w-full p-3 rounded-lg transition-all duration-200",
                      "flex items-center gap-3 text-left",
                      "hover:scale-[1.02] hover:shadow-md",
                      currentTheme === theme.id 
                        ? "ring-2 ring-opacity-50 shadow-md" 
                        : "hover:bg-white/50"
                    )}
                    style={{
                      backgroundColor: currentTheme === theme.id 
                        ? `${theme.colors.primary}20` 
                        : 'transparent'
                    }}
                  >
                    <div className="flex-shrink-0">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                        style={{ 
                          background: theme.gradients.primary,
                          color: 'white'
                        }}
                      >
                        {getThemeIcon(theme.id)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-medium text-sm"
                        style={{ color: 'var(--color-text)' }}
                      >
                        {theme.name}
                      </div>
                      <div 
                        className="text-xs mt-1 opacity-70"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {theme.description}
                      </div>
                    </div>
                    
                    {currentTheme === theme.id && (
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-5 h-5" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                          style={{ color: theme.colors.primary }}
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* 预览区域 */}
            <div 
              className="border-t p-4"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div 
                className="text-xs mb-2 opacity-70"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                当前主题预览
              </div>
              <div className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: themes[currentTheme].colors.primary }}
                />
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: themes[currentTheme].colors.secondary }}
                />
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: themes[currentTheme].colors.accent }}
                />
                <div className="flex-1" />
                <div 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: `${themes[currentTheme].colors.primary}20`,
                    color: themes[currentTheme].colors.primary
                  }}
                >
                  {themes[currentTheme].name}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
