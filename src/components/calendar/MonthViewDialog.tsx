import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon, Undo as UndoIcon } from '@mui/icons-material';
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
  onUpdateDay: (date: string, updates: Partial<CalendarDay>) => void;
}

const MonthViewDialog: React.FC<MonthViewDialogProps> = ({
  open,
  onClose,
  year,
  month,
  days,
  onUpdateDay,
}) => {
  const [editingDay, setEditingDay] = useState<CalendarDay | null>(null);
  const [editedDay, setEditedDay] = useState<Partial<CalendarDay>>({});

  // Get the month name in Chinese
  const monthName = dayjs().month(month - 1).format('MMMM');

  // Get all days in the month
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (
      days.find(d => d.date === dateStr) || {
        date: dateStr,
        isWorkingDay: true,
        isHoliday: false,
      }
    );
  });

  const handleEditDay = (day: CalendarDay) => {
    setEditingDay(day);
    setEditedDay({ ...day });
  };

  const handleSaveDay = () => {
    if (editingDay) {
      onUpdateDay(editingDay.date, editedDay);
      setEditingDay(null);
      setEditedDay({});
    }
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setEditedDay({});
  };

  const handleToggleWorkingDay = (day: CalendarDay) => {
    const updates = {
      isWorkingDay: !day.isWorkingDay,
      isHoliday: day.isHoliday && !day.isWorkingDay ? false : day.isHoliday,
    };
    onUpdateDay(day.date, updates);
  };

  const handleToggleHoliday = (day: CalendarDay) => {
    const updates = {
      isHoliday: !day.isHoliday,
      isWorkingDay: day.isWorkingDay && day.isHoliday ? false : day.isWorkingDay,
    };
    onUpdateDay(day.date, updates);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedDay(prev => ({
      ...prev,
      description: e.target.value,
    }));
  };

  const getDayOfWeek = (date: string) => {
    const day = dayjs(date).day();
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[day];
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '80vh',
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {year}年{month}月
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={3}>
          {/* Calendar View */}
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
              {monthDays.map((day) => {
                const isWeekend = [0, 6].includes(dayjs(day.date).day());
                const isToday = dayjs().format('YYYY-MM-DD') === day.date;
                
                return (
                  <Box
                    key={day.date}
                    onClick={() => handleEditDay(day)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                      p: 0.5,
                      cursor: 'pointer',
                      position: 'relative',
                      border: isToday ? '2px solid' : '1px solid',
                      borderColor: isToday ? 'primary.main' : 'divider',
                      backgroundColor: day.isHoliday 
                        ? 'error.light' 
                        : !day.isWorkingDay 
                          ? 'action.hover' 
                          : isWeekend 
                            ? 'action.selected' 
                            : 'background.paper',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      fontWeight={isToday ? 'bold' : 'normal'}
                      color={day.isHoliday ? 'error.contrastText' : isWeekend ? 'primary.contrastText' : 'text.primary'}
                    >
                      {dayjs(day.date).date()}
                    </Typography>
                    {day.description && (
                      <Typography 
                        variant="caption" 
                        noWrap 
                        sx={{
                          width: '100%',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          textAlign: 'center',
                          color: day.isHoliday ? 'error.contrastText' : 'text.secondary',
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
                <Box width={16} height={16} bgcolor="action.hover" mr={1} borderRadius={1} />
                <Typography variant="caption">休息日</Typography>
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
          </Box>

          {/* Day Edit Form */}
          <Box>
            {editingDay ? (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {editingDay.date} 周{getDayOfWeek(editingDay.date)}
                  </Typography>
                  <Box>
                    <Tooltip title="取消">
                      <IconButton onClick={handleCancelEdit} size="small" sx={{ mr: 1 }}>
                        <UndoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="保存">
                      <IconButton 
                        onClick={handleSaveDay} 
                        color="primary" 
                        size="small"
                        disabled={JSON.stringify(editingDay) === JSON.stringify(editedDay)}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedDay.isWorkingDay ?? false}
                      onChange={(e) =>
                        setEditedDay(prev => ({
                          ...prev,
                          isWorkingDay: e.target.checked,
                          isHoliday: e.target.checked ? false : prev.isHoliday,
                        }))
                      }
                      color="primary"
                    />
                  }
                  label="工作日"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editedDay.isHoliday ?? false}
                      onChange={(e) =>
                        setEditedDay(prev => ({
                          ...prev,
                          isHoliday: e.target.checked,
                          isWorkingDay: e.target.checked ? false : prev.isWorkingDay,
                        }))
                      }
                      color="error"
                    />
                  }
                  label="节假日"
                />

                <Box mt={2}>
                  <TextField
                    fullWidth
                    label="说明（如：春节、国庆节等）"
                    value={editedDay.description || ''}
                    onChange={handleDescriptionChange}
                    variant="outlined"
                    size="small"
                    multiline
                    rows={3}
                  />
                </Box>

                <Box mt={2}>
                  <Typography variant="body2" color="textSecondary">
                    提示：节假日会自动设置为非工作日
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                height="100%"
                minHeight="300px"
              >
                <Typography variant="body1" color="textSecondary">
                  点击左侧日期进行编辑
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
        <Button 
          onClick={() => {
            // Apply changes to all weekends
            monthDays
              .filter(day => [0, 6].includes(dayjs(day.date).day()))
              .forEach(day => {
                onUpdateDay(day.date, { 
                  isWorkingDay: false, 
                  isHoliday: false,
                  description: '周末'
                });
              });
          }}
          variant="outlined"
          color="primary"
        >
          设置所有周末为休息日
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonthViewDialog;
