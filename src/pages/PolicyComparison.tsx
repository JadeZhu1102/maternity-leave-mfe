/**
 * 政策对比页面 - 可视化对比多地政策
 * Policy Comparison Page
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Autocomplete,
  TextField,
  Card,
  CardContent,
  Grid,
  Alert,
  Tooltip,
  IconButton,
  CircularProgress,
  Collapse,
} from '@mui/material';
import {
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { SUPPORTED_CITIES } from '../constants/supportedCities';
import { getAllPolicies, type PolicyData } from '../services/policyService';

interface ComparisonCity {
  code: string;
  name: string;
}

interface PolicyComparisonProps {}

const PolicyComparison: React.FC<PolicyComparisonProps> = () => {
  const [selectedCities, setSelectedCities] = useState<ComparisonCity[]>([]);
  const [allPolicies, setAllPolicies] = useState<PolicyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // 获取城市名称的辅助函数
  const getCityName = (cityCode: string | null | undefined): string => {
    if (!cityCode) return '未知城市';
    const city = SUPPORTED_CITIES.find(c => c.code.toLowerCase() === cityCode.toLowerCase());
    return city?.name || cityCode;
  };

  // 加载所有政策数据
  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true);
        const policies = await getAllPolicies();
        setAllPolicies(policies);
        
        // 默认选择前两个城市
        if (policies.length >= 2) {
          const defaultCities = policies.slice(0, 2).map(p => ({
            code: p.cityCode,
            name: getCityName(p.cityCode),
          }));
          setSelectedCities(defaultCities);
        }
      } catch (err: any) {
        setError(err.message || '加载政策数据失败');
        console.error('Failed to load policies:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPolicies();
  }, []);

  const cityOptions = allPolicies.map(policy => ({
    code: policy.cityCode,
    name: getCityName(policy.cityCode),
  }));

  const handleAddCity = (city: ComparisonCity | null) => {
    if (city && !selectedCities.find(c => c.code === city.code)) {
      if (selectedCities.length < 4) {
        setSelectedCities([...selectedCities, city]);
      }
    }
  };

  const handleRemoveCity = (cityCode: string) => {
    if (selectedCities.length > 2) {
      setSelectedCities(selectedCities.filter(c => c.code !== cityCode));
    }
  };

  const comparisonData = useMemo(() => {
    return selectedCities.map(city => {
      const policy = allPolicies.find(p => p.cityCode.toLowerCase() === city.code.toLowerCase());
      if (!policy) return null;
      
      return {
        city: city.name,
        cityCode: city.code,
        policy: policy,
        // 基础数据
        statutoryLeave: policy.statutoryPolicy.leaveDays,
        dystociaLeave: policy.dystociaPolicy.standardLeaveDays,
        moreInfantLeave: policy.moreInfantPolicy.extraInfantLeaveDays,
        otherExtendedLeave: policy.otherExtendedPolicy?.standardLeaveDays || 0,
        // 规则数据
        dystociaRules: (policy as any).dystociaRules || [],
        abortionRules: (policy as any).abortionRules || [],
        otherExtendedRules: (policy as any).otherExtendedRules || [],
        // 津贴政策
        allowancePolicy: policy.allowancePolicy,
        // 日历类型
        isCalendarDay: policy.statutoryPolicy.calendarDay,
        delayForPublicHoliday: policy.statutoryPolicy.delayForPublicHoliday,
      };
    }).filter(Boolean);
  }, [selectedCities, allPolicies]);

  const getBestValue = (field: string) => {
    const values = comparisonData.map(d => {
      const value = (d as any)[field];
      return typeof value === 'number' ? value : 0;
    });
    return Math.max(...values);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const exportComparison = () => {
    // TODO: 实现导出功能
    console.log('Export comparison data:', comparisonData);
    alert('导出功能开发中...');
  };

  const shareComparison = () => {
    // TODO: 实现分享功能
    const url = `${window.location.origin}/policy-comparison?cities=${selectedCities.map(c => c.code).join(',')}`;
    navigator.clipboard.writeText(url);
    alert('对比链接已复制到剪贴板！');
  };

  // 显示加载状态但不阻塞页面渲染
  const showLoadingOverlay = loading && allPolicies.length === 0;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 加载状态提示 */}
      {showLoadingOverlay && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* 页面标题 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            政策对比
          </Typography>
          <Typography variant="body2" color="text.secondary">
            对比不同城市的产假政策，帮助您做出最佳选择
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={shareComparison}
          >
            分享
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportComparison}
          >
            导出
          </Button>
        </Box>
      </Box>

      {/* 城市选择器 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="subtitle1" sx={{ minWidth: 100 }}>
            选择城市：
          </Typography>
          
          {selectedCities.map((city) => (
            <Chip
              key={city.code}
              label={city.name}
              onDelete={selectedCities.length > 2 ? () => handleRemoveCity(city.code) : undefined}
              color="primary"
              variant="outlined"
            />
          ))}

          {selectedCities.length < 4 && (
            <Autocomplete
              options={cityOptions.filter(c => !selectedCities.find(sc => sc.code === c.code))}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => handleAddCity(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="添加城市对比"
                  size="small"
                  sx={{ minWidth: 200 }}
                />
              )}
              sx={{ minWidth: 200 }}
            />
          )}

          <Typography variant="caption" color="text.secondary">
            最多对比4个城市
          </Typography>
        </Box>
      </Paper>

      {/* 快速对比卡片 */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  法定产假
                </Typography>
                <Tooltip title="国家规定的基础产假天数">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data!.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data!.city}</Typography>
                  <Chip
                    label={`${data!.statutoryLeave}天`}
                    color={data!.statutoryLeave === getBestValue('statutoryLeave') ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  难产假
                </Typography>
                <Tooltip title="难产情况下额外增加的假期">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data!.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data!.city}</Typography>
                  <Chip
                    label={data!.dystociaLeave > 0 ? `+${data!.dystociaLeave}天` : '见规则'}
                    color={data!.dystociaLeave === getBestValue('dystociaLeave') && data!.dystociaLeave > 0 ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  多胎假
                </Typography>
                <Tooltip title="每多一个婴儿增加的假期">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data!.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data!.city}</Typography>
                  <Chip
                    label={`+${data!.moreInfantLeave}天/胎`}
                    color={data!.moreInfantLeave === getBestValue('moreInfantLeave') ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  其他延长假
                </Typography>
                <Tooltip title="地方政策额外延长的假期">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data!.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data!.city}</Typography>
                  <Chip
                    label={data!.otherExtendedLeave > 0 ? `+${data!.otherExtendedLeave}天` : '见规则'}
                    color={data!.otherExtendedLeave === getBestValue('otherExtendedLeave') && data!.otherExtendedLeave > 0 ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 详细对比表格 */}
      <Paper sx={{ mb: 3 }}>
        <Box p={2} borderBottom={1} borderColor="divider">
          <Typography variant="h6">详细对比</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>政策项目</TableCell>
                {selectedCities.map((city) => (
                  <TableCell key={city.code} align="center" sx={{ fontWeight: 600 }}>
                    {city.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/* 法定产假 */}
              <TableRow>
                <TableCell>法定产假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data!.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data!.statutoryLeave === getBestValue('statutoryLeave') ? 'success.light' : 'inherit',
                      fontWeight: data!.statutoryLeave === getBestValue('statutoryLeave') ? 600 : 400,
                    }}
                  >
                    {data!.statutoryLeave}天
                  </TableCell>
                ))}
              </TableRow>

              {/* 难产假 */}
              <TableRow>
                <TableCell>难产假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell key={data!.cityCode} align="center">
                    {data!.dystociaLeave > 0 ? `+${data!.dystociaLeave}天` : '见规则'}
                  </TableCell>
                ))}
              </TableRow>

              {/* 多胎假 */}
              <TableRow>
                <TableCell>多胎假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data!.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data!.moreInfantLeave === getBestValue('moreInfantLeave') ? 'success.light' : 'inherit',
                      fontWeight: data!.moreInfantLeave === getBestValue('moreInfantLeave') ? 600 : 400,
                    }}
                  >
                    +{data!.moreInfantLeave}天/胎
                  </TableCell>
                ))}
              </TableRow>

              {/* 其他延长假 */}
              <TableRow>
                <TableCell>其他延长假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell key={data!.cityCode} align="center">
                    {data!.otherExtendedLeave > 0 ? `+${data!.otherExtendedLeave}天` : '见规则'}
                  </TableCell>
                ))}
              </TableRow>

              {/* 日历类型 */}
              <TableRow>
                <TableCell>日历类型</TableCell>
                {comparisonData.map((data) => (
                  <TableCell key={data!.cityCode} align="center">
                    {data!.isCalendarDay ? '自然日' : '工作日'}
                  </TableCell>
                ))}
              </TableRow>

              {/* 节假日顺延 */}
              <TableRow>
                <TableCell>节假日顺延</TableCell>
                {comparisonData.map((data) => (
                  <TableCell key={data!.cityCode} align="center">
                    {data!.delayForPublicHoliday ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <CancelIcon color="disabled" fontSize="small" />
                    )}
                  </TableCell>
                ))}
              </TableRow>

              {/* 津贴计算公式 */}
              <TableRow>
                <TableCell>津贴计算公式</TableCell>
                {comparisonData.map((data) => (
                  <TableCell key={data!.cityCode} align="center">
                    {data!.allowancePolicy ? (
                      <Typography variant="caption">
                        {data!.allowancePolicy.numerator}/{data!.allowancePolicy.denominator}
                      </Typography>
                    ) : '-'}
                  </TableCell>
                ))}
              </TableRow>

              {/* 补差规则 */}
              <TableRow>
                <TableCell>补差规则</TableCell>
                {comparisonData.map((data) => (
                  <TableCell key={data!.cityCode} align="center">
                    {(data!.allowancePolicy as any)?.differenceCompensationRule ? (
                      <Chip
                        label={(data!.allowancePolicy as any).differenceCompensationRule.forceCompensation === 'Yes' ? '强制补差' : 
                               (data!.allowancePolicy as any).differenceCompensationRule.forceCompensation === 'Only if' ? '条件补差' : '无需补差'}
                        size="small"
                        color={(data!.allowancePolicy as any).differenceCompensationRule.forceCompensation === 'Yes' ? 'success' : 'default'}
                      />
                    ) : '-'}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 说明信息 */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>对比说明：</strong>
        </Typography>
        <Typography variant="body2" component="ul" sx={{ pl: 2, mb: 0 }}>
          <li>绿色高亮表示该项目在对比城市中最优</li>
          <li>数据基于各地最新政策，实际执行可能有差异</li>
          <li>建议结合当地具体政策文件进行确认</li>
        </Typography>
      </Alert>
    </Container>
  );
};

export default PolicyComparison;
