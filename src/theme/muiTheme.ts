/**
 * Material-UI 主题配置
 * Material-UI Theme Configuration
 */

import { createTheme } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';

// OCBC 品牌色
const OCBC_RED = '#E21833';
const OCBC_DARK_RED = '#B30E23';
const OCBC_LIGHT_RED = '#FF4D5F';

// 创建 OCBC 主题
export const ocbcTheme = createTheme(
  {
    palette: {
      primary: {
        main: OCBC_RED,
        dark: OCBC_DARK_RED,
        light: OCBC_LIGHT_RED,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#4A5568',
        light: '#718096',
        dark: '#2D3748',
        contrastText: '#FFFFFF',
      },
      error: {
        main: OCBC_RED,
        light: OCBC_LIGHT_RED,
        dark: OCBC_DARK_RED,
      },
      warning: {
        main: '#F59E0B',
        light: '#FBBF24',
        dark: '#D97706',
      },
      info: {
        main: '#3B82F6',
        light: '#60A5FA',
        dark: '#2563EB',
      },
      success: {
        main: '#10B981',
        light: '#34D399',
        dark: '#059669',
      },
      background: {
        default: '#FFFFFF',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#1A202C',
        secondary: '#4A5568',
      },
      divider: '#E5E7EB',
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: [
      'none',
      '0 1px 3px rgba(0, 0, 0, 0.1)',
      '0 1px 3px rgba(0, 0, 0, 0.1)',
      '0 4px 6px rgba(0, 0, 0, 0.1)',
      '0 4px 6px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
      '0 10px 15px rgba(0, 0, 0, 0.1)',
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            },
          },
          containedPrimary: {
            '&:hover': {
              backgroundColor: OCBC_DARK_RED,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
          elevation1: {
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 500,
          },
          colorPrimary: {
            backgroundColor: OCBC_RED,
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: OCBC_DARK_RED,
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: OCBC_RED,
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: OCBC_RED,
            },
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: '#9CA3AF',
            '&.Mui-checked': {
              color: OCBC_RED,
            },
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: '#9CA3AF',
            '&.Mui-checked': {
              color: OCBC_RED,
            },
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            '&.Mui-checked': {
              color: OCBC_RED,
              '& + .MuiSwitch-track': {
                backgroundColor: OCBC_RED,
              },
            },
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
          },
          colorPrimary: {
            backgroundColor: '#FEE2E2',
          },
          barColorPrimary: {
            backgroundColor: OCBC_RED,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            backgroundColor: '#F9FAFB',
          },
        },
      },
    },
  },
  zhCN
);
