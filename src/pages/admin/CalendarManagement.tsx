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
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import calendarApi from '../../services/calendarService';
import specialDateApi from '../../services/specialDateService';
import { Calendar, CalendarDay, GenerateDefaultCalendarPayload, SpecialDate } from '../../types/calendar';
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
  
  // 编辑模式状态
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedCalendar, setEditedCalendar] = useState<Calendar | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Fetch calendar data and special dates
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        
        // 获取基础日历数据
        const calendarData = await calendarApi.getDefaultCalendar(year);
        
        // 获取特殊日期（节假日和调班）
        const specialDates = await specialDateApi.getSpecialDates('CN', year);
        
        // 将特殊日期合并到日历数据中
        const updatedCalendar = mergeSpecialDatesIntoCalendar(calendarData, specialDates);
        
        setCalendar(updatedCalendar);
        setEditedCalendar(updatedCalendar);
        setIsEditMode(false);
        setHasUnsavedChanges(false);
      } catch (err) {
        setError('Failed to load calendar');
        console.error('Error fetching calendar:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [year]);
  
  // 将特殊日期合并到日历数据中
  const mergeSpecialDatesIntoCalendar = (calendar: Calendar, specialDates: SpecialDate[]): Calendar => {
    const updatedMonths = calendar.months.map(month => {
      const updatedDays = month.days.map(day => {
        const specialDate = specialDates.find(sd => sd.calendarDate === day.date);
        if (specialDate) {
          return {
            ...day,
            isWorkday: specialDate.isWorkday,
            description: specialDate.description,
          };
        }
        return day;
      });
      
      // 添加月份中还没有的特殊日期
      specialDates.forEach(sd => {
        const sdDate = new Date(sd.calendarDate);
        if (sdDate.getFullYear() === month.year && sdDate.getMonth() + 1 === month.month) {
          const exists = updatedDays.some(d => d.date === sd.calendarDate);
          if (!exists) {
            updatedDays.push({
              date: sd.calendarDate,
              isWorkday: sd.isWorkday,
              description: sd.description,
            });
          }
        }
      });
      
      // 按日期排序
      updatedDays.sort((a, b) => a.date.localeCompare(b.date));
      
      return {
        ...month,
        days: updatedDays,
      };
    });
    
    return {
      ...calendar,
      months: updatedMonths,
    };
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setYear(Number(event.target.value));
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    setOpenMonthView(true);
  };

  // 进入编辑模式
  const handleEnterEditMode = () => {
    setIsEditMode(true);
    setEditedCalendar(calendar ? JSON.parse(JSON.stringify(calendar)) : null);
    setHasUnsavedChanges(false);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('您有未保存的更改，确定要取消吗？')) {
        return;
      }
    }
    setIsEditMode(false);
    setEditedCalendar(calendar);
    setHasUnsavedChanges(false);
  };

  // 保存整年的日历修改
  const handleSaveCalendar = async () => {
    if (!editedCalendar) return;

    try {
      setLoading(true);
      
      // TODO: Call batch save API
      // const savedCalendar = await calendarApi.batchUpdateCalendar(editedCalendar);
      
      // Mock: 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving calendar:', editedCalendar);
      
      setCalendar(editedCalendar);
      setIsEditMode(false);
      setHasUnsavedChanges(false);
      setError(null);
      
      // 显示成功消息
      alert('日历保存成功！');
    } catch (err) {
      setError('保存日历失败');
      console.error('Error saving calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  // 更新单个日期（在编辑模式下）
  const handleUpdateDay = (date: string, updates: Partial<CalendarDay>) => {
    if (!editedCalendar || !isEditMode) return;

    const updatedMonths = editedCalendar.months.map(month => {
      const dayIndex = month.days.findIndex(d => d.date === date);
      if (dayIndex !== -1) {
        const updatedDays = [...month.days];
        updatedDays[dayIndex] = {
          ...updatedDays[dayIndex],
          ...updates,
        };
        return {
          ...month,
          days: updatedDays,
        };
      }
      return month;
    });

    setEditedCalendar({
      ...editedCalendar,
      months: updatedMonths,
    });
    setHasUnsavedChanges(true);
  };

  const handleCreateNewCalendar = async () => {
    try {
      setLoading(true);
      const payload: GenerateDefaultCalendarPayload = {
        year,
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
          <Box>
            <Typography variant="h4" component="h1">
              工作日历管理
            </Typography>
            {isEditMode && (
              <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                ⚠️ 编辑模式 {hasUnsavedChanges && '(有未保存的更改)'}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={2} alignItems="center">
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>选择年份</InputLabel>
              <Select
                value={year}
                onChange={handleYearChange}
                label="选择年份"
                disabled={isEditMode}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}年
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {!isEditMode ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEnterEditMode}
                disabled={!calendar}
              >
                编辑日历
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveCalendar}
                  disabled={loading || !hasUnsavedChanges}
                >
                  {loading ? '保存中...' : '保存整年'}
                </Button>
              </>
            )}
          </Box>
        </Box>

        {(isEditMode ? editedCalendar : calendar) ? (
          <Grid container spacing={3}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
              const displayCalendar = isEditMode ? editedCalendar : calendar;
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={month}>
                  <Paper 
                    elevation={isEditMode ? 3 : 2}
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      minHeight: '320px',
                      display: 'flex',
                      flexDirection: 'column',
                      border: isEditMode ? '2px solid' : 'none',
                      borderColor: isEditMode ? 'warning.main' : 'transparent',
                      '&:hover': {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handleMonthClick(month)}
                  >
                    <Typography variant="h6" gutterBottom textAlign="center">
                      {month}月
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <CalendarMonth 
                        year={year}
                        month={month}
                        days={displayCalendar?.months.find(m => m.month === month)?.days || []}
                        onDayClick={(day) => console.log('Day clicked:', day)}
                      />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
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
        {(isEditMode ? editedCalendar : calendar) && (
          <MonthViewDialog
            open={openMonthView}
            onClose={() => setOpenMonthView(false)}
            year={year}
            month={selectedMonth}
            days={(isEditMode ? editedCalendar : calendar)?.months.find(m => m.month === selectedMonth)?.days || []}
            onUpdateDay={handleUpdateDay}
            isEditMode={isEditMode}
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
                placeholder={`例如: ${year}年日历`}
              />
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  将生成{year}年的标准日历
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
