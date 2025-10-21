import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Chip,
} from '@mui/material';
import { Close as CloseIcon, Work as WorkIcon, BeachAccess as HolidayIcon } from '@mui/icons-material';
import { CalendarDay } from '../../types/calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface MonthViewDialogProps {
  open: boolean;
  onClose: () => void;
  year: number;
  month: number;
  days: CalendarDay[];
  onUpdateDay?: (date: string, updates: Partial<CalendarDay>) => void;
  isEditMode?: boolean;
  initialSelectedDate?: string | null;
}

const MonthViewDialog: React.FC<MonthViewDialogProps> = ({
  open,
  onClose,
  year,
  month,
  days,
  onUpdateDay,
  isEditMode = false,
  initialSelectedDate = null,
}) => {

  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [dayType, setDayType] = useState<'holiday' | 'workday' | 'normal'>('normal');
  const [description, setDescription] = useState<string>('');

  // Get all days in the month (use native Date to avoid string parsing issues)
  const firstDayOfMonth = dayjs(new Date(year, month - 1, 1));
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (
      days.find(d => d.date === dateStr) || {
        date: dateStr,
      }
    );
  });

  // Build calendar with leading nulls to align weekdays
  const firstDayOfWeek = firstDayOfMonth.day();
  const calendarDays: Array<CalendarDay | null> = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  calendarDays.push(...monthDays);

  // Helpers: safer weekday and date object from parts
  const getWeekday = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).getDay();
  };

  const getDayjsFromParts = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return dayjs(new Date(y, m - 1, d));
  };

  // 当提供 initialSelectedDate 时，自动选中该日期
  useEffect(() => {
    if (!open || !initialSelectedDate) return;
    const d = monthDays.find(d => d.date === initialSelectedDate);
    if (d) {
      setSelectedDay(d);
      setDayType(
        d.isWorkday === false ? 'holiday' :
        d.isWorkday === true ? 'workday' :
        'normal'
      );
      setDescription(d.description || '');
    }
  }, [open, initialSelectedDate, monthDays]);

  const handleDayClick = (day: CalendarDay) => {
    if (!isEditMode) {
      // 查看模式：显示日期详情
      setSelectedDay(day);
      setDayType(
        day.isWorkday === false ? 'holiday' : 
        day.isWorkday === true ? 'workday' : 
        'normal'
      );
      setDescription(day.description || '');
    } else {
      // 编辑模式：选择日期进行编辑
      setSelectedDay(day);
      setDayType(
        day.isWorkday === false ? 'holiday' : 
        day.isWorkday === true ? 'workday' : 
        'normal'
      );
      setDescription(day.description || '');
    }
  };

  const handleDayTypeChange = (_event: React.MouseEvent<HTMLElement>, newType: 'holiday' | 'workday' | 'normal' | null) => {
    if (newType !== null) {
      setDayType(newType);
    }
  };

  const handleApplyChanges = () => {
    if (!selectedDay || !onUpdateDay) return;

    const updates: Partial<CalendarDay> = {
      isWorkday: dayType === 'holiday' ? false : dayType === 'workday' ? true : undefined,
      description: description.trim() || undefined,
    };

    onUpdateDay(selectedDay.date, updates);
    setSelectedDay(null);
  };

  const handleCloseDialog = () => {
    setSelectedDay(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '60vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6">
              {year}年{month}月
            </Typography>
            {isEditMode && (
              <Chip 
                label="编辑模式" 
                color="warning" 
                size="small" 
                sx={{ mt: 0.5 }}
              />
            )}
          </Box>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box>
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(7, 1fr)" 
            gap={1}
            textAlign="center"
            mb={1}
          >
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <Typography key={day} variant="subtitle2" fontWeight="bold">
                {day}
              </Typography>
            ))}
          </Box>
          
          <Box 
            display="grid" 
            gridTemplateColumns="repeat(7, 1fr)" 
            gap={1}
            sx={{ '& > *': { aspectRatio: '1' } }}
          >
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <Box key={`empty-${idx}`} />;
              }
              const isWeekend = [0, 6].includes(getWeekday(day.date));
              const isToday = dayjs().format('YYYY-MM-DD') === day.date;
              const isSelected = selectedDay?.date === day.date;
              
              // 判断是否为特殊日期
              const isHoliday = day.isWorkday === false; // 节假日
              const isAdjustedWorkday = day.isWorkday === true; // 调班（周末上班）
              
              return (
                <Box
                  key={day.date}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    p: 0.5,
                    cursor: isEditMode ? 'pointer' : 'default',
                    border: isSelected ? '3px solid' : isToday ? '2px solid' : '1px solid',
                    borderColor: isSelected ? 'primary.main' : isToday ? 'primary.main' : 'divider',
                    backgroundColor: isHoliday 
                      ? 'error.light' 
                      : isAdjustedWorkday 
                        ? 'warning.light'
                        : isWeekend 
                          ? 'success.light' 
                          : 'background.paper',
                    '&:hover': isEditMode ? {
                      boxShadow: 2,
                      transform: 'scale(1.05)',
                    } : {},
                    transition: 'all 0.2s',
                  }}
                  title={day.description || ''}
                >
                  <Typography 
                    variant="body2" 
                    fontWeight={isToday ? 'bold' : 'normal'}
                    color={isHoliday 
                      ? 'error.contrastText' 
                      : isAdjustedWorkday
                        ? 'warning.contrastText'
                        : isWeekend 
                          ? 'success.dark' 
                          : 'text.primary'}
                  >
                    {getDayjsFromParts(day.date).date()}
                  </Typography>
                  {day.description && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.65rem',
                        textAlign: 'center',
                        color: isHoliday 
                          ? 'error.contrastText' 
                          : isAdjustedWorkday
                            ? 'warning.contrastText'
                            : 'text.secondary',
                      }}
                    >
                      {day.description}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
          
          <Box mt={2} display="flex" gap={2} flexWrap="wrap">
            <Box display="flex" alignItems="center">
              <Box width={16} height={16} bgcolor="error.light" mr={1} borderRadius={1} />
              <Typography variant="caption">节假日</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box width={16} height={16} bgcolor="warning.light" mr={1} borderRadius={1} />
              <Typography variant="caption">调班</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box width={16} height={16} bgcolor="success.light" mr={1} borderRadius={1} />
              <Typography variant="caption">周末</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box 
                width={16} 
                height={16} 
                bgcolor="background.paper" 
                border={1} 
                borderColor="divider" 
                mr={1} 
                borderRadius={1} 
              />
              <Typography variant="caption">工作日</Typography>
            </Box>
          </Box>

          {/* 编辑/查看面板 */}
          {selectedDay && (
            <Box 
              mt={3} 
              p={2} 
              border={1} 
              borderColor="divider" 
              borderRadius={1}
              bgcolor="background.default"
            >
              <Typography variant="subtitle1" gutterBottom>
                {getDayjsFromParts(selectedDay.date).format('YYYY年MM月DD日')} 
                （周{['日', '一', '二', '三', '四', '五', '六'][getWeekday(selectedDay.date)]}）
              </Typography>

              {isEditMode ? (
                <>
                  <Box mt={2}>
                    <Typography variant="body2" gutterBottom>
                      日期类型：
                    </Typography>
                    <ToggleButtonGroup
                      value={dayType}
                      exclusive
                      onChange={handleDayTypeChange}
                      size="small"
                      fullWidth
                    >
                      <ToggleButton value="normal">
                        <WorkIcon sx={{ mr: 0.5 }} fontSize="small" />
                        工作日
                      </ToggleButton>
                      <ToggleButton value="holiday" color="error">
                        <HolidayIcon sx={{ mr: 0.5 }} fontSize="small" />
                        节假日
                      </ToggleButton>
                      <ToggleButton value="workday" color="warning">
                        <WorkIcon sx={{ mr: 0.5 }} fontSize="small" />
                        调班
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  <Box mt={2}>
                    <TextField
                      fullWidth
                      label="说明"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="例如：春节、国庆-调班"
                      size="small"
                      helperText="可选，用于标注节假日名称或调班说明"
                    />
                  </Box>

                  <Box mt={2} display="flex" gap={1} justifyContent="flex-end">
                    <Button 
                      size="small" 
                      onClick={() => setSelectedDay(null)}
                    >
                      取消
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={handleApplyChanges}
                    >
                      应用
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      类型：
                      {selectedDay.isWorkday === false ? (
                        <Chip label="节假日" color="error" size="small" sx={{ ml: 1 }} />
                      ) : selectedDay.isWorkday === true ? (
                        <Chip label="调班" color="warning" size="small" sx={{ ml: 1 }} />
                      ) : (
                        <Chip label="工作日" size="small" sx={{ ml: 1 }} />
                      )}
                    </Typography>
                  </Box>
                  {selectedDay.description && (
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        说明：{selectedDay.description}
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonthViewDialog;
