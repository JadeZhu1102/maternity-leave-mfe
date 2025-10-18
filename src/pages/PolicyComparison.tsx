/**
 * 政策对比页面 - 可视化对比多地政策
 * Policy Comparison Page
 */

import React, { useState, useMemo } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CompareArrows as CompareIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { SUPPORTED_CITIES } from '../constants/supportedCities';
import { getCityPolicy } from '../constants/policies';

interface ComparisonCity {
  code: string;
  name: string;
}

interface PolicyComparisonProps {}

const PolicyComparison: React.FC<PolicyComparisonProps> = () => {
  const [selectedCities, setSelectedCities] = useState<ComparisonCity[]>([
    { code: 'beijing', name: '北京' },
    { code: 'shanghai', name: '上海' },
  ]);

  const cityOptions = SUPPORTED_CITIES.map(city => ({
    code: city.code,
    name: city.name,
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
      const policy = getCityPolicy(city.code);
      return {
        city: city.name,
        cityCode: city.code,
        basicLeave: policy.basicMaternityLeave,
        extendedLeave: policy.extendedMaternityLeave,
        difficultBirthExtra: policy.difficultBirthExtraLeave,
        multipleBirthExtra: policy.multipleBirthExtraLeave,
        paternityLeave: policy.paternityLeave,
        lateMarriageLeave: policy.lateMarriageLeave || 0,
        totalLeave: policy.basicMaternityLeave + policy.extendedMaternityLeave,
      };
    });
  }, [selectedCities]);

  const getBestValue = (field: keyof typeof comparisonData[0], exclude: string[] = ['city', 'cityCode']) => {
    if (exclude.includes(field)) return null;
    const values = comparisonData.map(d => d[field] as number);
    return Math.max(...values);
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  总产假天数
                </Typography>
                <Tooltip title="基础产假 + 延长产假">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data.city}</Typography>
                  <Chip
                    label={`${data.totalLeave}天`}
                    color={data.totalLeave === getBestValue('totalLeave') ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  陪产假
                </Typography>
                <Tooltip title="配偶可享受的陪产假天数">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data.city}</Typography>
                  <Chip
                    label={`${data.paternityLeave}天`}
                    color={data.paternityLeave === getBestValue('paternityLeave') ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  难产额外假
                </Typography>
                <Tooltip title="难产情况下额外增加的假期">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              {comparisonData.map((data) => (
                <Box
                  key={data.cityCode}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  py={1}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{data.city}</Typography>
                  <Chip
                    label={`+${data.difficultBirthExtra}天`}
                    color={data.difficultBirthExtra === getBestValue('difficultBirthExtra') ? 'success' : 'default'}
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
              <TableRow>
                <TableCell>基础产假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data.basicLeave === getBestValue('basicLeave') ? 'success.light' : 'inherit',
                      fontWeight: data.basicLeave === getBestValue('basicLeave') ? 600 : 400,
                    }}
                  >
                    {data.basicLeave}天
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>延长产假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data.extendedLeave === getBestValue('extendedLeave') ? 'success.light' : 'inherit',
                      fontWeight: data.extendedLeave === getBestValue('extendedLeave') ? 600 : 400,
                    }}
                  >
                    {data.extendedLeave}天
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell sx={{ fontWeight: 600, bgcolor: 'action.hover' }}>
                  总产假天数
                </TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data.cityCode}
                    align="center"
                    sx={{
                      fontWeight: 600,
                      bgcolor: data.totalLeave === getBestValue('totalLeave') ? 'success.main' : 'action.hover',
                      color: data.totalLeave === getBestValue('totalLeave') ? 'success.contrastText' : 'inherit',
                    }}
                  >
                    {data.totalLeave}天
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>难产额外假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data.difficultBirthExtra === getBestValue('difficultBirthExtra') ? 'success.light' : 'inherit',
                      fontWeight: data.difficultBirthExtra === getBestValue('difficultBirthExtra') ? 600 : 400,
                    }}
                  >
                    +{data.difficultBirthExtra}天
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>多胎额外假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data.multipleBirthExtra === getBestValue('multipleBirthExtra') ? 'success.light' : 'inherit',
                      fontWeight: data.multipleBirthExtra === getBestValue('multipleBirthExtra') ? 600 : 400,
                    }}
                  >
                    +{data.multipleBirthExtra}天/胎
                  </TableCell>
                ))}
              </TableRow>

              <TableRow>
                <TableCell>陪产假</TableCell>
                {comparisonData.map((data) => (
                  <TableCell
                    key={data.cityCode}
                    align="center"
                    sx={{
                      bgcolor: data.paternityLeave === getBestValue('paternityLeave') ? 'success.light' : 'inherit',
                      fontWeight: data.paternityLeave === getBestValue('paternityLeave') ? 600 : 400,
                    }}
                  >
                    {data.paternityLeave}天
                  </TableCell>
                ))}
              </TableRow>

              {comparisonData.some(d => d.lateMarriageLeave > 0) && (
                <TableRow>
                  <TableCell>晚婚假</TableCell>
                  {comparisonData.map((data) => (
                    <TableCell
                      key={data.cityCode}
                      align="center"
                      sx={{
                        bgcolor: data.lateMarriageLeave === getBestValue('lateMarriageLeave') ? 'success.light' : 'inherit',
                        fontWeight: data.lateMarriageLeave === getBestValue('lateMarriageLeave') ? 600 : 400,
                      }}
                    >
                      {data.lateMarriageLeave > 0 ? `${data.lateMarriageLeave}天` : '-'}
                    </TableCell>
                  ))}
                </TableRow>
              )}
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
