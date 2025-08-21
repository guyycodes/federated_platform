import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  alpha,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Line,
  Bar,
  Doughnut
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SpeedIcon from '@mui/icons-material/Speed';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import SearchIcon from '@mui/icons-material/Search';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// Hooks
import { useTheme } from '../../../Context/ThemeContext';

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, change, subtitle, color }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Paper sx={{
      p: 3,
      height: '100%',
      background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 24px ${alpha(color || '#00FFFF', 0.2)}`
      }
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Icon sx={{ color: color || '#00FFFF', fontSize: 32 }} />
        {change !== undefined && (
          <Chip
            size="small"
            icon={change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={`${change > 0 ? '+' : ''}${change}%`}
            sx={{
              backgroundColor: alpha(change > 0 ? '#4ADE80' : '#FF4444', 0.1),
              color: change > 0 ? '#4ADE80' : '#FF4444',
              '& .MuiChip-icon': {
                color: change > 0 ? '#4ADE80' : '#FF4444'
              }
            }}
          />
        )}
      </Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Paper>
  );
};

// Main Analytics View Component
const AnalyticsView = () => {
  const { theme, colors } = useTheme();
  const muiTheme = useMuiTheme();
  const isDark = theme === 'dark';
  
  const [timeRange, setTimeRange] = useState('24h');
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: muiTheme.palette.text.primary
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        },
        ticks: {
          color: muiTheme.palette.text.secondary
        }
      },
      y: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
        },
        ticks: {
          color: muiTheme.palette.text.secondary
        }
      }
    }
  };

  // Mock data for charts
  const requestsData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [
      {
        label: 'Requests',
        data: [450, 520, 680, 920, 1150, 980, 750],
        borderColor: colors.accent,
        backgroundColor: alpha(colors.accent, 0.1),
        tension: 0.4
      }
    ]
  };

  const costData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Cost',
        data: [580, 620, 590, 640, 680, 620, 600],
        backgroundColor: colors.primary,
        borderRadius: 8
      }
    ]
  };

  const pluginUsageData = {
    labels: ['GPT Code Reviewer', 'Document Summarizer', 'Translation Engine', 'Security Scanner', 'Others'],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: [
          colors.primary,
          colors.accent,
          colors.secondary,
          '#9333EA',
          '#FFD700'
        ],
        borderWidth: 0
      }
    ]
  };

  // Mock request logs
  const requestLogs = [
    {
      id: 1,
      timestamp: '2024-01-20 14:32:15',
      plugin: 'GPT Code Reviewer',
      endpoint: '/api/gateway/code-review/analyze',
      status: 200,
      latency: 120,
      cost: 0.05,
      user: 'john.doe'
    },
    {
      id: 2,
      timestamp: '2024-01-20 14:31:48',
      plugin: 'Translation Engine',
      endpoint: '/api/gateway/translate/text',
      status: 200,
      latency: 95,
      cost: 0.03,
      user: 'jane.smith'
    },
    {
      id: 3,
      timestamp: '2024-01-20 14:31:12',
      plugin: 'Document Summarizer',
      endpoint: '/api/gateway/doc-summary/process',
      status: 429,
      latency: 45,
      cost: 0,
      user: 'mike.johnson'
    },
    {
      id: 4,
      timestamp: '2024-01-20 14:30:55',
      plugin: 'Security Scanner',
      endpoint: '/api/gateway/security-scan/analyze',
      status: 200,
      latency: 450,
      cost: 0.12,
      user: 'sarah.williams'
    }
  ];

  // Filter request logs
  const filteredLogs = requestLogs.filter(log =>
    log.plugin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="700">
          Analytics & Usage
        </Typography>
        
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{ borderColor: alpha('#000000', 0.2) }}
          >
            Export Report
          </Button>
          
          <IconButton sx={{ border: `1px solid ${alpha('#000000', 0.2)}` }}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Budget Alert */}
      <Alert
        severity="warning"
        icon={<WarningAmberIcon />}
        sx={{ mb: 3 }}
        action={
          <Button color="inherit" size="small">
            Set Limits
          </Button>
        }
      >
        <strong>High Usage Alert:</strong> Current burn rate projects $8,420 monthly spend (84% of budget). 
        Translation Engine Plus is consuming 45% of total costs.
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={ShowChartIcon}
            label="Total Requests"
            value="1.2M"
            change={15}
            subtitle="Last 24 hours"
            color={colors.accent}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={AttachMoneyIcon}
            label="Current Spend"
            value="$4,240"
            change={5}
            subtitle="$5,760 remaining"
            color="#FFD700"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={SpeedIcon}
            label="Avg Latency"
            value="138ms"
            change={-8}
            subtitle="P95: 180ms"
            color={colors.secondary}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            icon={ErrorOutlineIcon}
            label="Error Rate"
            value="0.8%"
            change={-15}
            subtitle="12 errors today"
            color="#FF4444"
          />
        </Grid>
      </Grid>

      {/* Charts Tabs */}
      <Paper sx={{
        mb: 4,
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Request Volume" icon={<ShowChartIcon />} iconPosition="start" />
          <Tab label="Cost Analysis" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Plugin Distribution" icon={<PieChartIcon />} iconPosition="start" />
        </Tabs>

        <Box p={3} height={400}>
          {selectedTab === 0 && (
            <Line data={requestsData} options={chartOptions} />
          )}
          {selectedTab === 1 && (
            <Bar data={costData} options={chartOptions} />
          )}
          {selectedTab === 2 && (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Box width={300} height={300}>
                <Doughnut data={pluginUsageData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      position: 'right',
                      labels: {
                        color: muiTheme.palette.text.primary
                      }
                    }
                  }
                }} />
              </Box>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Live Request Feed */}
      <Paper sx={{
        p: 3,
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="600">
            Live Request Feed
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Plugin</TableCell>
                <TableCell>Endpoint</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Latency</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{log.timestamp}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      {log.plugin}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                      {log.endpoint}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      icon={log.status === 200 ? <CheckCircleIcon /> : <CancelIcon />}
                      label={`${log.status} ${log.status === 200 ? 'OK' : log.status === 429 ? 'Rate Limited' : 'Error'}`}
                      sx={{
                        backgroundColor: alpha(log.status === 200 ? '#4ADE80' : '#FF4444', 0.1),
                        color: log.status === 200 ? '#4ADE80' : '#FF4444',
                        '& .MuiChip-icon': {
                          color: log.status === 200 ? '#4ADE80' : '#FF4444'
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography variant="body2">{log.latency}ms</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min((log.latency / 500) * 100, 100)}
                        sx={{
                          width: 50,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: alpha(colors.accent, 0.1),
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: log.latency > 300 ? '#FFA500' : colors.accent,
                            borderRadius: 2
                          }
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="500">
                      ${log.cost.toFixed(3)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {log.user}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box display="flex" justifyContent="center" mt={2}>
          <Button size="small" variant="text">
            Load More
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AnalyticsView; 