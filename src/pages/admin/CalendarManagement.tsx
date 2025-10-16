import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  SelectChangeEvent,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import calendarApi from '../../services/calendarService';
import { Calendar, CalendarDay, UpdateCalendarDayPayload, GenerateDefaultCalendarPayload } from '../../types/calendar';
import CalendarMonth from '../../components/calendar/CalendarMonth';
import MonthViewDialog from '../../components/calendar/MonthViewDialog';

const CalendarManagement: React.FC = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState<number>(dayjs().year());
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openMonthView, setOpenMonthView] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month() + 1);
  const [newCalendarDialogOpen, setNewCalendarDialogOpen] = useState<boolean>(false);
  const [newCalendarName, setNewCalendarName] = useState<string>('');

  // Fetch calendar data
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const data = await calendarApi.getDefaultCalendar(year);
        setCalendar(data);
      } catch (err) {
        setError('Failed to load calendar');
        console.error('Error fetching calendar:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [year]);

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setYear(Number(event.target.value));
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    setOpenMonthView(true);
  };

  const handleUpdateDay = async (date: string, updates: Partial<CalendarDay>) => {
    if (!calendar?.id) return;

    try {
      setLoading(true);
      const payload: UpdateCalendarDayPayload = {
        calendarId: calendar.id,
        date,
        isWorkingDay: updates.isWorkingDay ?? false,
        isHoliday: updates.isHoliday ?? false,
        description: updates.description
      };
      const updatedCalendar = await calendarApi.updateCalendarDay(payload);
      setCalendar(updatedCalendar);
    } catch (err) {
      setError('Failed to update calendar day');
      console.error('Error updating calendar day:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewCalendar = async () => {
    try {
      setLoading(true);
      const payload: GenerateDefaultCalendarPayload = {
        year,
        countryCode: 'CN',
        region: 'shanghai'
      };
      const newCalendar = await calendarApi.generateDefaultCalendar(payload);
      setCalendar(newCalendar);
      setNewCalendarDialogOpen(false);
    } catch (err) {
      setError('Failed to create new calendar');
      console.error('Error creating new calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from({ length: 11 }, (_, i) => year - 5 + i);

  if (loading && !calendar) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1">
            工作日历管理
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>选择年份</InputLabel>
              <Select
                value={year}
                onChange={handleYearChange}
                label="选择年份"
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}年
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

          </Box>
        </Box>

        {calendar ? (
          <Grid container spacing={3}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={month}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                  onClick={() => handleMonthClick(month)}
                >
                  <Typography variant="h6" gutterBottom textAlign="center">
                    {month}月
                  </Typography>
                  <CalendarMonth 
                    year={year}
                    month={month}
                    days={calendar.months.find(m => m.month === month)?.days || []}
                    onDayClick={(day) => console.log('Day clicked:', day)}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box textAlign="center" py={6}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              没有找到{year}年的日历
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setNewCalendarDialogOpen(true)}
            >
              创建{year}年日历
            </Button>
          </Box>
        )}

        {/* Month View Dialog */}
        {calendar && (
          <MonthViewDialog
            open={openMonthView}
            onClose={() => setOpenMonthView(false)}
            year={year}
            month={selectedMonth}
            days={calendar.months.find(m => m.month === selectedMonth)?.days || []}
            onUpdateDay={handleUpdateDay}
          />
        )}

        {/* New Calendar Dialog */}
        <Dialog 
          open={newCalendarDialogOpen} 
          onClose={() => setNewCalendarDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>创建新日历</DialogTitle>
          <DialogContent>
            <Box py={2}>
              <TextField
                fullWidth
                label="日历名称"
                value={newCalendarName}
                onChange={(e) => setNewCalendarName(e.target.value)}
                variant="outlined"
                placeholder={`例如: ${year}年工作日历`}
              />
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  将基于{year}年的法定节假日和工作日安排生成新的日历
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewCalendarDialogOpen(false)}>取消</Button>
            <Button 
              onClick={handleCreateNewCalendar} 
              variant="contained" 
              color="primary"
              disabled={!newCalendarName.trim() || loading}
            >
              {loading ? '创建中...' : '创建'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Snackbar */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
};

export default CalendarManagement;
