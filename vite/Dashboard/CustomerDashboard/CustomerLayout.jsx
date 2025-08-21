import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  alpha,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
  LinearProgress,
  Skeleton
} from '@mui/material';

// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExtensionIcon from '@mui/icons-material/Extension';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RouterIcon from '@mui/icons-material/Router';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SpeedIcon from '@mui/icons-material/Speed';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import BoltIcon from '@mui/icons-material/Bolt';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

// Import components
import PluginPortfolioView from './components/PluginPortfolioView';
import AnalyticsView from './components/AnalyticsView';
import APIGatewayView from './components/APIGatewayView';
import WorkflowBuilderView from './components/WorkflowBuilderView';
import TeamManagementView from './components/TeamManagementView';
import BillingView from './components/BillingView';
import MarketplaceView from './components/MarketplaceView';
import SupportView from './components/SupportView';

// Hooks and context
import { useCustomerAuth } from '../../hooks/useCustomerAuth';
import { useTheme } from '../../Context/ThemeContext';
import { useSidebar } from '../../Context/SideBarContext';

// Metric Card Component
const MetricCard = ({ icon: Icon, label, value, trend, color, onClick }) => {
  const { theme, colors, glassmorphism, gradients } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Card
      onClick={onClick}
      sx={{
        ...glassmorphism.card,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 32px ${alpha(color || colors.accent, 0.3)}`,
          border: `1px solid ${alpha(color || colors.accent, 0.4)}`
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(color || colors.accent, 0.5)}, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
        },
        '&:hover::before': onClick ? {
          opacity: 1,
        } : {}
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: alpha(color || colors.accent, 0.1),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(color || colors.accent, 0.2)}`
            }}
          >
            <Icon sx={{ color: color || colors.accent, fontSize: 28 }} />
          </Box>
          {trend !== undefined && (
            <Box display="flex" alignItems="center" gap={0.5}>
              {trend > 0 ? (
                <TrendingUpIcon sx={{ color: colors.lottieGreen, fontSize: 16 }} />
              ) : (
                <TrendingDownIcon sx={{ color: colors.darkOrange, fontSize: 16 }} />
              )}
              <Typography variant="caption" sx={{ 
                color: trend > 0 ? colors.lottieGreen : colors.darkOrange,
                fontWeight: 600
              }}>
                {Math.abs(trend)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Typography 
          variant="h4" 
          fontWeight="700" 
          gutterBottom
          sx={{
            background: trend > 10 ? gradients.glowGradient : 'inherit',
            backgroundClip: trend > 10 ? 'text' : 'inherit',
            WebkitBackgroundClip: trend > 10 ? 'text' : 'inherit',
            WebkitTextFillColor: trend > 10 ? 'transparent' : 'inherit',
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Plugin Status Badge Component
const PluginHealthBadge = ({ status }) => {
  const { colors } = useTheme();
  
  const statusConfig = {
    healthy: { color: colors.lottieGreen, icon: CheckCircleIcon, text: 'Healthy' },
    degraded: { color: colors.primary, icon: WarningAmberIcon, text: 'Degraded' },
    down: { color: colors.darkOrange, icon: ErrorOutlineIcon, text: 'Down' },
    rateLimited: { color: colors.purple, icon: BoltIcon, text: 'Rate Limited' }
  };

  const config = statusConfig[status] || statusConfig.down;
  const Icon = config.icon;

  return (
    <Chip
      icon={<Icon />}
      label={config.text}
      size="small"
      sx={{
        backgroundColor: alpha(config.color, 0.1),
        color: config.color,
        borderColor: config.color,
        backdropFilter: 'blur(10px)',
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
      variant="outlined"
    />
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, color }) => {
  const { theme, colors, glassmorphism, gradients } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <Paper
      onClick={onClick}
      sx={{
        p: 3,
        cursor: 'pointer',
        ...glassmorphism.container,
        transition: 'all 0.3s ease',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 16px 40px ${alpha(color || colors.accent, 0.3)}`,
          borderColor: color || colors.accent,
          background: alpha(color || colors.accent, 0.05),
          '& .action-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            color: color || colors.accent,
            filter: `drop-shadow(0 4px 8px ${alpha(color || colors.accent, 0.4)})`
          },
          '&::after': {
            opacity: 1,
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          left: -2,
          right: -2,
          bottom: -2,
          background: `linear-gradient(45deg, ${color || colors.accent}, ${colors.primary})`,
          borderRadius: 'inherit',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: -1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: gradients.shimmerGradient,
          opacity: 0,
          transition: 'left 0.6s, opacity 0.3s',
        },
        '&:hover::after': {
          left: '100%',
        }
      }}
    >
      <Icon 
        className="action-icon"
        sx={{ 
          fontSize: 40, 
          mb: 2, 
          color: 'rgba(255,255,255,0.6)',
          transition: 'all 0.3s ease'
        }} 
      />
      <Typography variant="body1" fontWeight="500">
        {label}
      </Typography>
    </Paper>
  );
};

// Main Customer Dashboard Component
const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customer, clerkUser, isLoading, refreshCustomer } = useCustomerAuth();
  const { theme, fonts, gradients, colors, glassmorphism } = useTheme();
  const { setActiveRoute } = useSidebar();
  
  const [selectedView, setSelectedView] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  
  // Get customer data
  const navigationCustomerData = location.state?.customerData;
  const justSignedIn = location.state?.justSignedIn;
  const displayCustomer = customer || (justSignedIn && navigationCustomerData);
  const displayName = displayCustomer?.firstName || 'Customer';

  // Theme-aware styling
  const isDark = theme === 'dark';

  // Update sidebar active route
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'dashboard') {
      setSelectedView(path);
    }
  }, [location]);

  // Mock data for dashboard overview
  const mockMetrics = {
    activePlugins: 12,
    monthlyRequests: '1.2M',
    avgLatency: '95ms',
    monthlyCost: '$4,240',
    errorRate: '0.8%',
    uptime: '99.9%'
  };

  const recentActivity = [
    { plugin: 'GPT Code Reviewer', action: 'Analyzed PR #234', time: '2 min ago', status: 'success' },
    { plugin: 'Document Summarizer', action: 'Processed 50 documents', time: '15 min ago', status: 'success' },
    { plugin: 'Translation Engine', action: 'Rate limit warning', time: '1 hour ago', status: 'warning' },
    { plugin: 'Security Scanner', action: 'Completed scan', time: '2 hours ago', status: 'success' }
  ];

  const topPlugins = [
    { name: 'GPT Code Reviewer', usage: 450000, cost: 1250, trend: 12 },
    { name: 'Document Summarizer', usage: 380000, cost: 890, trend: -5 },
    { name: 'Translation Engine', usage: 320000, cost: 2100, trend: 28 }
  ];

  // Handle navigation from overview
  const handleNavigate = (view) => {
    navigate(`/layout/${view}`);
  };

  // Render dashboard overview
  const renderDashboardOverview = () => (
    <Box sx={{ position: 'relative' }}>
      {/* Animated Background Effects */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '-10%',
            width: '40%',
            height: '40%',
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.05,
            filter: 'blur(100px)',
            animation: 'float 20s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
              '50%': { transform: 'translateY(-30px) rotate(180deg)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '-5%',
            width: '30%',
            height: '30%',
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.03,
            filter: 'blur(80px)',
            animation: 'float 15s ease-in-out infinite reverse',
          }}
        />
      </Box>

      {/* Welcome Header */}
      <Box mb={4}>
        <Typography 
          variant="h4" 
          fontWeight="700" 
          gutterBottom
          sx={{
            background: gradients.primaryGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.3))',
          }}
        >
          Welcome back, {displayName}!
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Here's an overview of your plugin ecosystem
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            icon={ExtensionIcon}
            label="Active Plugins"
            value={mockMetrics.activePlugins}
            trend={8}
            color={colors.primary}
            onClick={() => handleNavigate('plugins')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            icon={AutoGraphIcon}
            label="Monthly Requests"
            value={mockMetrics.monthlyRequests}
            trend={15}
            color={colors.accent}
            onClick={() => handleNavigate('analytics')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            icon={SpeedIcon}
            label="Avg Latency"
            value={mockMetrics.avgLatency}
            trend={-12}
            color={colors.secondary}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            icon={MonetizationOnIcon}
            label="Monthly Cost"
            value={mockMetrics.monthlyCost}
            trend={5}
            color={colors.purple}
            onClick={() => handleNavigate('billing')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            icon={ErrorOutlineIcon}
            label="Error Rate"
            value={mockMetrics.errorRate}
            trend={-20}
            color={colors.darkOrange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <MetricCard
            icon={CheckCircleIcon}
            label="Uptime"
            value={mockMetrics.uptime}
            color={colors.lottieGreen}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Typography 
        variant="h5" 
        fontWeight="600" 
        gutterBottom 
        sx={{ 
          mb: 3,
          color: 'rgba(255,255,255,0.9)'
        }}
      >
        Quick Actions
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <QuickActionButton
            icon={StorefrontIcon}
            label="Browse Plugins"
            onClick={() => handleNavigate('marketplace')}
            color={colors.primary}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <QuickActionButton
            icon={AccountTreeIcon}
            label="Create Workflow"
            onClick={() => handleNavigate('workflows')}
            color={colors.secondary}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <QuickActionButton
            icon={RouterIcon}
            label="API Playground"
            onClick={() => handleNavigate('gateway')}
            color={colors.accent}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 3 }}>
          <QuickActionButton
            icon={SupportAgentIcon}
            label="Get Support"
            onClick={() => handleNavigate('support')}
            color={colors.purple}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{
            p: 3,
            ...glassmorphism.card,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Typography 
              variant="h6" 
              fontWeight="600" 
              gutterBottom
              sx={{
                background: gradients.accentGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity, index) => (
                <ListItem
                  key={index}
                  sx={{
                    borderBottom: index < recentActivity.length - 1 
                      ? `1px solid ${alpha(colors.glassWhite, 0.5)}` 
                      : 'none',
                    px: 0,
                    py: 2,
                    transition: 'all 0.2s ease',
                    borderRadius: 1,
                    '&:hover': {
                      background: alpha(colors.glassWhite, 0.05),
                      pl: 1
                    }
                  }}
                >
                  <ListItemIcon>
                    {activity.status === 'success' ? (
                      <CheckCircleIcon sx={{ color: colors.lottieGreen }} />
                    ) : (
                      <WarningAmberIcon sx={{ color: colors.primary }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.plugin}
                    secondary={activity.action}
                    primaryTypographyProps={{ 
                      fontWeight: 500,
                      color: 'rgba(255,255,255,0.9)'
                    }}
                    secondaryTypographyProps={{
                      color: 'rgba(255,255,255,0.6)'
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: colors.accent,
                      fontWeight: 500
                    }}
                  >
                    {activity.time}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top Plugins by Usage */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{
            p: 3,
            ...glassmorphism.card,
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography 
                variant="h6" 
                fontWeight="600"
                sx={{
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Top Plugins by Usage
              </Typography>
              <Button
                size="small"
                onClick={() => handleNavigate('analytics')}
                endIcon={<TrendingUpIcon />}
                sx={{
                  color: colors.accent,
                  borderColor: colors.accent,
                  '&:hover': {
                    background: alpha(colors.accent, 0.1),
                    borderColor: colors.accent
                  }
                }}
                variant="outlined"
              >
                View All
              </Button>
            </Box>
            {topPlugins.map((plugin, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography 
                    variant="body2" 
                    fontWeight="500"
                    sx={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    {plugin.name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.purple,
                        fontWeight: 600
                      }}
                    >
                      ${plugin.cost}/mo
                    </Typography>
                    <Chip
                      size="small"
                      label={`${plugin.trend > 0 ? '+' : ''}${plugin.trend}%`}
                      sx={{
                        backgroundColor: alpha(plugin.trend > 0 ? colors.lottieGreen : colors.darkOrange, 0.15),
                        color: plugin.trend > 0 ? colors.lottieGreen : colors.darkOrange,
                        fontWeight: 'bold',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(plugin.usage / 450000) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: alpha(colors.surface, 0.5),
                    '& .MuiLinearProgress-bar': {
                      background: index === 0 ? gradients.glowGradient : gradients.accentGradient,
                      borderRadius: 4,
                      boxShadow: `0 2px 8px ${alpha(colors.accent, 0.4)}`
                    }
                  }}
                />
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 0.5,
                    color: 'rgba(255,255,255,0.6)',
                    display: 'block'
                  }}
                >
                  {(plugin.usage / 1000).toFixed(0)}k requests
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );

  // Loading state
  if (isLoading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={300} height={40} sx={{ mb: 2 }} />
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Routes>
        <Route path="/" element={renderDashboardOverview()} />
        <Route path="/dashboard" element={renderDashboardOverview()} />
        <Route path="/plugins" element={<PluginPortfolioView />} />
        <Route path="/analytics" element={<AnalyticsView />} />
        <Route path="/gateway" element={<APIGatewayView />} />
        <Route path="/workflows" element={<WorkflowBuilderView />} />
        <Route path="/team" element={<TeamManagementView />} />
        <Route path="/billing" element={<BillingView />} />
        <Route path="/marketplace" element={<MarketplaceView />} />
        <Route path="/support" element={<SupportView />} />
        <Route path="*" element={<Navigate to="/layout/dashboard" replace />} />
      </Routes>
    </Box>
  );
};

export default CustomerDashboard; 