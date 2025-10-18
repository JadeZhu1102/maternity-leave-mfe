import React from 'react';
import { Box, Typography } from '@mui/material';
import { CalendarDay } from '../../types/calendar';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

interface CalendarMonthProps {
  year: number;
  month: number;
  days: CalendarDay[];
  onDayClick?: (day: CalendarDay) => void;
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

const CalendarMonth: React.FC<CalendarMonthProps> = ({ year, month, days, onDayClick }) => {
  // Get the first day of the month and the number of days in the month
  const firstDayOfMonth = dayjs(`${year}-${month}-01`);
  const daysInMonth = firstDayOfMonth.daysInMonth();
  const firstDayOfWeek = firstDayOfMonth.day();

  // Generate the days array including empty cells for days before the 1st of the month
  const calendarDays = [];
  
  // Add empty cells for days before the 1st of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add the days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayData = days.find(d => d.date === dateStr) || {
      date: dateStr,
    };
    calendarDays.push(dayData);
  }

  // Calculate number of rows needed (6 rows to accommodate all possible month layouts)
  const totalCells = 6 * 7; // 6 rows x 7 days
  const remainingCells = totalCells - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push(null);
  }

  const handleDayClick = (day: CalendarDay | null) => {
    if (day && onDayClick) {
      onDayClick(day);
    }
  };

  return (
    <Box>
      {/* Weekday headers */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" textAlign="center" mb={1}>
        {weekDays.map((day) => (
          <Typography key={day} variant="caption" fontWeight="medium">
            {day}
          </Typography>
        ))}
      </Box>

      {/* Calendar days */}
      <Box 
        display="grid" 
        gridTemplateColumns="repeat(7, 1fr)" 
        gap={0.5}
        sx={{ '& > *': { aspectRatio: '1' } }}
      >
        {calendarDays.map((day, index) => {
          if (!day) {
            return <Box key={`empty-${index}`} />;
          }

          const isWeekend = [0, 6].includes(dayjs(day.date).day());
          const isToday = dayjs().format('YYYY-MM-DD') === day.date;
          
          return (
            <Box
              key={day.date}
              onClick={() => handleDayClick(day)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                cursor: 'pointer',
                position: 'relative',
                fontSize: '0.8rem',
                fontWeight: isToday ? 'bold' : 'normal',
                backgroundColor: isWeekend ? 'action.hover' : 'background.paper',
                color: isWeekend ? 'text.secondary' : 'text.primary',
                border: isToday ? '2px solid' : '1px solid',
                borderColor: isToday ? 'primary.main' : 'divider',
                '&:hover': {
                  opacity: 0.8,
                },
              }}
            >
              {dayjs(day.date).date()}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default CalendarMonth;
