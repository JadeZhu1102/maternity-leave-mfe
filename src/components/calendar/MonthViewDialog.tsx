import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
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
}) => {

  // Get all days in the month
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return (
      days.find(d => d.date === dateStr) || {
        date: dateStr,
      }
    );
  });

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
          <Typography variant="h6">
            {year}年{month}月
          </Typography>
          <IconButton onClick={onClose} size="small">
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
            {monthDays.map((day) => {
              const isWeekend = [0, 6].includes(dayjs(day.date).day());
              const isToday = dayjs().format('YYYY-MM-DD') === day.date;
              
              // 判断是否为特殊日期
              const isHoliday = day.isWorkday === false; // 节假日
              const isAdjustedWorkday = day.isWorkday === true; // 调班（周末上班）
              
              return (
                <Box
                  key={day.date}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    p: 0.5,
                    border: isToday ? '2px solid' : '1px solid',
                    borderColor: isToday ? 'primary.main' : 'divider',
                    backgroundColor: isHoliday 
                      ? 'error.light' 
                      : isAdjustedWorkday 
                        ? 'warning.light'
                        : isWeekend 
                          ? 'action.hover' 
                          : 'background.paper',
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
                          ? 'text.secondary' 
                          : 'text.primary'}
                  >
                    {dayjs(day.date).date()}
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
              <Box width={16} height={16} bgcolor="action.hover" mr={1} borderRadius={1} />
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
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonthViewDialog;
