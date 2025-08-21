import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Paper,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  alpha,
  LinearProgress,
  Tooltip,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';

// Icons
import ExtensionIcon from '@mui/icons-material/Extension';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import BoltIcon from '@mui/icons-material/Bolt';
import SpeedIcon from '@mui/icons-material/Speed';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TuneIcon from '@mui/icons-material/Tune';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CodeIcon from '@mui/icons-material/Code';
import SettingsIcon from '@mui/icons-material/Settings';
import ShieldIcon from '@mui/icons-material/Shield';
import { useNavigate } from 'react-router-dom';

// Hooks
import { useTheme } from '../../../Context/ThemeContext';

// Plugin Health Badge Component
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
        '& .MuiChip-icon': {
          color: config.color
        }
      }}
      variant="outlined"
    />
  );
};

// Plugin Card Component
const PluginCard = ({ plugin, viewMode, onConfigure }) => {
  const { theme, colors, glassmorphism } = useTheme();
  const isDark = theme === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getUsageColor = (usage) => {
    if (usage > 80) return colors.primary;
    if (usage > 60) return colors.accent;
    return colors.lottieGreen;
  };

  if (viewMode === 'list') {
    return (
      <Paper
        sx={{
          p: 2,
          mb: 1,
          ...glassmorphism.container,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: `0 4px 16px ${alpha(colors.primary, 0.2)}`
          }
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box display="flex" alignItems="center" gap={2}>
              <ExtensionIcon sx={{ color: colors.primary, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">
                  {plugin.name}
                  {plugin.whiteLabel && (
                    <Tooltip title="White Label">
                      <ShieldIcon sx={{ ml: 1, fontSize: 16, color: colors.accent }} />
                    </Tooltip>
                  )}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  by {plugin.vendor} • v{plugin.version}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2}>
            <PluginHealthBadge status={plugin.status} />
          </Grid>
          <Grid item xs={6} sm={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">RPS / Latency</Typography>
              <Typography variant="body2" fontWeight="500">
                {plugin.metrics.rps} / {plugin.metrics.latency}ms
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">Monthly Cost</Typography>
              <Typography variant="body2" fontWeight="500">${plugin.metrics.cost}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={2}>
            <Box display="flex" gap={1} justifyContent="flex-end">
              <Button
                size="small"
                variant="outlined"
                onClick={() => onConfigure(plugin)}
                sx={{ 
                  minWidth: 'auto',
                  borderColor: colors.accent,
                  color: colors.accent,
                  '&:hover': {
                    borderColor: colors.accent,
                    backgroundColor: alpha(colors.accent, 0.1)
                  }
                }}
              >
                Configure
              </Button>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }

  // Grid view
  return (
    <Card
      sx={{
        height: '100%',
        ...glassmorphism.card,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(colors.primary, 0.2)}`
        }
      }}
    >
      <CardContent>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              {plugin.name}
              {plugin.whiteLabel && (
                <Tooltip title="White Label">
                  <ShieldIcon sx={{ ml: 1, fontSize: 18, color: colors.accent }} />
                </Tooltip>
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              by {plugin.vendor} • v{plugin.version}
            </Typography>
          </Box>
          <PluginHealthBadge status={plugin.status} />
        </Box>

        {/* Metrics */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6}>
            <Paper sx={{ 
              p: 1.5, 
              background: alpha(colors.surface, 0.5),
              border: `1px solid ${colors.glassWhite}`
            }}>
              <Box display="flex" alignItems="center" gap={1}>
                <ShowChartIcon sx={{ fontSize: 16, color: colors.secondary }} />
                <Typography variant="caption" color="text.secondary">RPS</Typography>
              </Box>
              <Typography variant="h6" fontWeight="600">{plugin.metrics.rps}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ 
              p: 1.5, 
              background: alpha(colors.surface, 0.5),
              border: `1px solid ${colors.glassWhite}`
            }}>
              <Box display="flex" alignItems="center" gap={1}>
                <SpeedIcon sx={{ fontSize: 16, color: colors.accent }} />
                <Typography variant="caption" color="text.secondary">Latency</Typography>
              </Box>
              <Typography variant="h6" fontWeight="600">{plugin.metrics.latency}ms</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Usage Bar */}
        <Box mb={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" color="text.secondary">
              Monthly Usage
            </Typography>
            <Typography variant="caption" fontWeight="600">
              {plugin.metrics.monthlyUsage}% • ${plugin.metrics.cost}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={plugin.metrics.monthlyUsage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: alpha(getUsageColor(plugin.metrics.monthlyUsage), 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: getUsageColor(plugin.metrics.monthlyUsage),
                borderRadius: 4
              }
            }}
          />
        </Box>

        {/* Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Last used {plugin.lastUsed}
          </Typography>
          <Box display="flex" gap={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onConfigure(plugin)}
              sx={{
                borderColor: colors.accent,
                color: colors.accent,
                '&:hover': {
                  borderColor: colors.accent,
                  backgroundColor: alpha(colors.accent, 0.1)
                }
              }}
            >
              Configure
            </Button>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              ...glassmorphism.strong,
              mt: 1
            }
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><PlayArrowIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Test Plugin</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><PauseIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Pause Plugin</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><RestartAltIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Restart Plugin</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><CodeIcon fontSize="small" /></ListItemIcon>
            <ListItemText>View API Docs</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Advanced Settings</ListItemText>
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

// Main Plugin Portfolio View Component
const PluginPortfolioView = () => {
  const navigate = useNavigate();
  const { theme, colors, glassmorphism, gradients } = useTheme();
  const isDark = theme === 'dark';
  
  const [selectedWorkspace, setSelectedWorkspace] = useState('production');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - replace with API call
  const [plugins, setPlugins] = useState([
    {
      id: 1,
      name: 'GPT Code Reviewer',
      vendor: 'TechCorp Solutions',
      status: 'healthy',
      workspace: 'production',
      version: '2.1.0',
      endpoint: 'code-review',
      metrics: {
        rps: 45,
        latency: 120,
        errorRate: 0.1,
        monthlyUsage: 68,
        cost: 1250
      },
      lastUsed: '2 min ago',
      whiteLabel: true
    },
    {
      id: 2,
      name: 'Document Summarizer Pro',
      vendor: 'AI Labs Inc',
      status: 'degraded',
      workspace: 'production',
      version: '3.0.0',
      endpoint: 'doc-summary',
      metrics: {
        rps: 28,
        latency: 200,
        errorRate: 2.5,
        monthlyUsage: 45,
        cost: 890
      },
      lastUsed: '10 min ago',
      whiteLabel: false
    },
    {
      id: 3,
      name: 'Translation Engine Plus',
      vendor: 'GlobalSpeak',
      status: 'rateLimited',
      workspace: 'development',
      version: '1.5.0',
      endpoint: 'translate',
      metrics: {
        rps: 150,
        latency: 95,
        errorRate: 0.05,
        monthlyUsage: 92,
        cost: 2100
      },
      lastUsed: 'Just now',
      whiteLabel: false
    },
    {
      id: 4,
      name: 'Security Scanner AI',
      vendor: 'SecureCode Inc',
      status: 'healthy',
      workspace: 'production',
      version: '1.8.2',
      endpoint: 'security-scan',
      metrics: {
        rps: 12,
        latency: 450,
        errorRate: 0.02,
        monthlyUsage: 35,
        cost: 750
      },
      lastUsed: '1 hour ago',
      whiteLabel: true
    }
  ]);

  // Mock workspaces
  const workspaces = [
    { id: 'production', name: 'Production', pluginCount: 12, budget: 10000, spent: 6500 },
    { id: 'development', name: 'Development', pluginCount: 8, budget: 5000, spent: 2100 },
    { id: 'customer-support', name: 'Customer Support', pluginCount: 5, budget: 3000, spent: 1800 }
  ];

  // Filter plugins
  const filteredPlugins = plugins.filter(plugin => {
    const matchesWorkspace = plugin.workspace === selectedWorkspace;
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plugin.status === filterStatus;
    
    return matchesWorkspace && matchesSearch && matchesStatus;
  });

  // Calculate workspace metrics
  const currentWorkspace = workspaces.find(ws => ws.id === selectedWorkspace);
  const totalRPS = filteredPlugins.reduce((sum, p) => sum + p.metrics.rps, 0);
  const avgLatency = filteredPlugins.length > 0 
    ? Math.round(filteredPlugins.reduce((sum, p) => sum + p.metrics.latency, 0) / filteredPlugins.length)
    : 0;
  const totalCost = filteredPlugins.reduce((sum, p) => sum + p.metrics.cost, 0);
  const avgErrorRate = filteredPlugins.length > 0
    ? (filteredPlugins.reduce((sum, p) => sum + p.metrics.errorRate, 0) / filteredPlugins.length).toFixed(2)
    : 0;

  const handleConfigure = (plugin) => {
    // Navigate to plugin configuration or open a modal
    console.log('Configure plugin:', plugin);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="700">
          Plugin Portfolio
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/layout/marketplace')}
          sx={{
            background: gradients.primaryGradient,
            '&:hover': {
              background: gradients.primaryGradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
            }
          }}
        >
          Browse Marketplace
        </Button>
      </Box>

      {/* Workspace Selector and Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Workspace</InputLabel>
          <Select
            value={selectedWorkspace}
            label="Workspace"
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.glassWhite
              }
            }}
          >
            {workspaces.map(ws => (
              <MenuItem key={ws.id} value={ws.id}>
                {ws.name} ({ws.pluginCount} plugins)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<FolderIcon />}
          sx={{ 
            borderColor: colors.glassWhite,
            color: colors.accent,
            '&:hover': {
              borderColor: colors.accent,
              backgroundColor: alpha(colors.accent, 0.1)
            }
          }}
        >
          Manage Workspaces
        </Button>

        <Box flex={1} />

        <TextField
          size="small"
          placeholder="Search plugins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              ...glassmorphism.container
            }
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.glassWhite
              }
            }}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="healthy">Healthy</MenuItem>
            <MenuItem value="degraded">Degraded</MenuItem>
            <MenuItem value="down">Down</MenuItem>
            <MenuItem value="rateLimited">Rate Limited</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              borderColor: colors.glassWhite,
              '&.Mui-selected': {
                backgroundColor: alpha(colors.accent, 0.2),
                color: colors.accent
              }
            }
          }}
        >
          <ToggleButton value="grid">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Workspace Metrics */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            p: 2,
            ...glassmorphism.card
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ShowChartIcon sx={{ color: colors.accent }} />
              <Typography variant="body2" color="text.secondary">Total RPS</Typography>
            </Box>
            <Typography variant="h5" fontWeight="700">{totalRPS}</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            p: 2,
            ...glassmorphism.card
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <SpeedIcon sx={{ color: colors.secondary }} />
              <Typography variant="body2" color="text.secondary">Avg Latency</Typography>
            </Box>
            <Typography variant="h5" fontWeight="700">{avgLatency}ms</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            p: 2,
            ...glassmorphism.card
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <AttachMoneyIcon sx={{ color: colors.primary }} />
              <Typography variant="body2" color="text.secondary">Monthly Cost</Typography>
            </Box>
            <Typography variant="h5" fontWeight="700">${totalCost}</Typography>
            <Typography variant="caption" color="text.secondary">
              Budget: ${currentWorkspace?.budget || 0}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{
            p: 2,
            ...glassmorphism.card
          }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <ErrorOutlineIcon sx={{ color: colors.darkOrange }} />
              <Typography variant="body2" color="text.secondary">Error Rate</Typography>
            </Box>
            <Typography variant="h5" fontWeight="700">{avgErrorRate}%</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Plugin List/Grid */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredPlugins.map(plugin => (
            <Grid item xs={12} sm={6} lg={4} key={plugin.id}>
              <PluginCard 
                plugin={plugin} 
                viewMode={viewMode}
                onConfigure={handleConfigure}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          {filteredPlugins.map(plugin => (
            <PluginCard 
              key={plugin.id}
              plugin={plugin} 
              viewMode={viewMode}
              onConfigure={handleConfigure}
            />
          ))}
        </Box>
      )}

      {/* Empty State */}
      {filteredPlugins.length === 0 && (
        <Paper sx={{
          p: 8,
          textAlign: 'center',
          ...glassmorphism.strong
        }}>
          <ExtensionIcon sx={{ fontSize: 64, color: alpha(colors.secondary, 0.3), mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No plugins found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your filters or search terms'
              : 'Get started by browsing the marketplace'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/layout/marketplace')}
            sx={{
              background: gradients.primaryGradient,
              '&:hover': {
                background: gradients.primaryGradient,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
              }
            }}
          >
            Browse Marketplace
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default PluginPortfolioView; 