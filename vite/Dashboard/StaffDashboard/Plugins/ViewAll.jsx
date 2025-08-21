import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Skeleton,
  alpha,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Badge
} from '@mui/material';

// Icons
import ExtensionIcon from '@mui/icons-material/Extension';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PendingIcon from '@mui/icons-material/PendingActions';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BugReportIcon from '@mui/icons-material/BugReport';
import PublicIcon from '@mui/icons-material/Public';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import GitHubIcon from '@mui/icons-material/GitHub';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SearchIcon from '@mui/icons-material/Search';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Context and hooks
import { useTheme } from '../../../Context/ThemeContext';
import { useDataLayer } from '../../../Context/DataLayer';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/Buttons';
import { motion } from 'framer-motion';
import { StaffBackgroundWrapper } from '../StaffLayout';

const ViewAll = () => {
  const { colors, gradients, fonts, theme } = useTheme();
  const { user, userPlugins, userPluginsDataRef, remoteTrigger, setRemoteTrigger } = useDataLayer();
  const navigate = useNavigate();

  // State
  const [plugins, setPlugins] = useState({
    new: [],
    dev: [],
    staging: [],
    production: []
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('new');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // Force refresh trigger
  const [isRefreshing, setIsRefreshing] = useState(false); // Animation state

  // Theme-aware colors
  const isLightTheme = theme === 'light';
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const backgroundPaper = isLightTheme ? '#ffffff' : colors.background;
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);

  // Add pulse animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 0.5; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
        100% { opacity: 0.5; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Update plugins when userPluginsDataRef changes
  useEffect(() => {
    if (userPlugins && userPlugins.length > 0) {
      // Categorize plugins based on deployment status
      const categorized = {
        new: [],
        dev: [],
        staging: [],
        production: []
      };

      userPlugins.forEach(plugin => {
        if (plugin.deploymentStatus === 'NEW' || plugin.deploymentStatus === 'PENDING') {
          categorized.new.push(plugin);
        } else if (plugin.deploymentStatus === 'DEVELOPMENT') {
          categorized.dev.push(plugin);
        } else if (plugin.deploymentStatus === 'STAGING') {
          categorized.staging.push(plugin);
        } else if (plugin.deploymentStatus === 'PRODUCTION') {
          categorized.production.push(plugin);
        } else if (plugin.deploymentStatus === 'ERROR') {
          // Handle error state plugins - could go to dev or a separate category
          categorized.dev.push(plugin);
        }
      });

      setPlugins(categorized);
    }
  }, [userPlugins, userPluginsDataRef, refreshKey]); // Added refreshKey to dependencies

  // Get category config
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'new':
        return {
          icon: <PendingIcon />,
          color: colors.primary,
          gradient: gradients.primaryGradient,
          label: 'New',
          description: 'Recently created plugins'
        };
      case 'dev':
        return {
          icon: <BugReportIcon />,
          color: colors.secondary,
          gradient: gradients.secondaryGradient,
          label: 'Development',
          description: 'Plugins in development'
        };
      case 'staging':
        return {
          icon: <RocketLaunchIcon />,
          color: colors.accent,
          gradient: gradients.accentGradient,
          label: 'Staging',
          description: 'Testing before production'
        };
      case 'production':
        return {
          icon: <PublicIcon />,
          color: colors.lottieGreen,
          gradient: gradients.multiGradient,
          label: 'Production',
          description: 'Live and published'
        };
      default:
        return {
          icon: <ExtensionIcon />,
          color: textSecondary,
          gradient: gradients.primaryGradient,
          label: 'Unknown',
          description: 'Unknown category'
        };
    }
  };

  // Get status badge
  const getStatusBadge = (plugin) => {
    const status = plugin.deploymentStatus;
    const isPublished = plugin.isPublished;

    if (status === 'PRODUCTION' && isPublished) {
      return <Chip label="Live" size="small" color="success" />;
    } else if (status === 'STAGING') {
      return <Chip label="Staged" size="small" color="info" />;
    } else if (status === 'DEVELOPMENT') {
      return <Chip label="Development" size="small" color="primary" />;
    } else if (status === 'PENDING') {
      return <Chip label="Deploying" size="small" color="warning" />;
    } else if (status === 'ERROR') {
      return <Chip label="Failed" size="small" color="error" />;
    } else if (status === 'NEW') {
      return <Chip label="New" size="small" color="default" />;
    } else {
      return <Chip label="Unknown" size="small" color="default" />;
    }
  };

  // Filter plugins
  const getFilteredPlugins = () => {
    const selectedPlugins = plugins[selectedCategory] || [];

    if (searchTerm) {
      return selectedPlugins.filter(plugin =>
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return selectedPlugins;
  };

  // Handle menu actions
  const handleMenuOpen = (event, plugin) => {
    try {
      console.log('handleMenuOpen called with:', {
        event: event,
        plugin: plugin,
        currentTarget: event.currentTarget,
        anchorEl: anchorEl
      });
      
      if (!event || !event.currentTarget) {
        throw new Error('Invalid event or currentTarget');
      }
      
      if (!plugin) {
        throw new Error('No plugin provided');
      }
      
      setAnchorEl(event.currentTarget);
      setSelectedPlugin(plugin);
      
      console.log('Menu state updated:', {
        anchorEl: event.currentTarget,
        selectedPlugin: plugin
      });
    } catch (error) {
      console.error('Error in handleMenuOpen:', error);
      alert('Failed to open menu: ' + error.message);
    }
  };

  const handleMenuClose = () => {
    console.log('handleMenuClose called');
    setAnchorEl(null);
    setSelectedPlugin(null);
  };

  const handleCreateNew = () => {
    navigate('/staff/dash/new', { state: { fromCreateNew: true } });
  };

  // Render plugin list item (table row view)
  const renderPluginListItem = (plugin) => {
    const categoryConfig = getCategoryConfig(
      plugin.deploymentStatus === 'PRODUCTION' ? 'production' :
      plugin.deploymentStatus === 'STAGING' ? 'staging' :
      plugin.deploymentStatus === 'DEVELOPMENT' ? 'dev' :
      plugin.deploymentStatus === 'ERROR' ? 'dev' :
      'new'
    );

    return (
      <motion.div
        key={plugin.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard
          variant="default"
          sx={{
            p: 2.5,
            mb: 1.5,
            borderRadius: 2.5,
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer',
            border: `1px solid ${alpha(categoryConfig.color, 0.1)}`,
            // Theme-aware shadow for dimension
            boxShadow: isLightTheme
              ? `
                0 1px 3px ${alpha('#000', 0.06)},
                0 2px 8px ${alpha(categoryConfig.color, 0.04)},
                0 1px 1px ${alpha('#000', 0.03)}
              `
              : `
                0 0 12px ${alpha(categoryConfig.color, 0.1)},
                0 2px 8px ${alpha(colors.glassWhite, 0.08)},
                inset 0 1px 0 ${alpha(colors.glassWhite, 0.15)}
              `,
            // Subtle gradient for depth
            background: isLightTheme 
              ? `linear-gradient(to bottom right, ${alpha('#fff', 0.95)}, ${alpha('#fff', 0.98)})`
              : `linear-gradient(to bottom right, ${alpha(colors.glassWhite, 0.07)}, ${alpha(colors.glassWhite, 0.05)})`,
            '&:hover': {
              transform: 'translateX(8px) scale(1.01)',
              boxShadow: isLightTheme
                ? `
                  0 8px 24px ${alpha(categoryConfig.color, 0.2)},
                  0 4px 16px ${alpha('#000', 0.08)},
                  0 0 40px ${alpha(categoryConfig.color, 0.1)}
                `
                : `
                  0 0 24px ${alpha(categoryConfig.color, 0.25)},
                  0 4px 16px ${alpha(colors.glassWhite, 0.15)},
                  0 0 40px ${alpha(categoryConfig.color, 0.15)},
                  inset 0 1px 0 ${alpha(colors.glassWhite, 0.25)}
                `,
              border: `1px solid ${alpha(categoryConfig.color, 0.25)}`,
              '& .list-icon': {
                transform: 'rotate(10deg) scale(1.15)',
              },
              '& .revenue-text': {
                transform: 'scale(1.1)',
              },
              '&::before': {
                opacity: 1,
                transform: 'translateX(100%)',
              }
            },
            // Shimmer effect
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-100%',
              width: '200%',
              height: '200%',
              background: `linear-gradient(
                90deg,
                transparent,
                ${alpha(categoryConfig.color, 0.08)},
                ${alpha(categoryConfig.color, 0.15)},
                ${alpha(categoryConfig.color, 0.08)},
                transparent
              )`,
              transform: 'translateX(-100%)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: 0,
              pointerEvents: 'none',
            }
          }}
        >
          <Box display="flex" alignItems="center" gap={2.5}>
            {/* Status Icon */}
            <Box
              className="list-icon"
              sx={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(categoryConfig.color, 0.15)}, ${alpha(categoryConfig.color, 0.05)})`,
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${alpha(categoryConfig.color, 0.2)}`,
                flexShrink: 0,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: `
                  0 4px 12px ${alpha(categoryConfig.color, 0.15)},
                  inset 0 1px 2px ${alpha('#ffffff', 0.2)}
                `,
              }}
            >
              {React.cloneElement(categoryConfig.icon, {
                sx: { 
                  fontSize: 20, 
                  color: categoryConfig.color,
                  filter: `drop-shadow(0 2px 4px ${alpha(categoryConfig.color, 0.3)})`,
                }
              })}
            </Box>

            {/* Plugin Info */}
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1.5} mb={0.25}>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    fontWeight: 700, 
                    color: textPrimary,
                    fontSize: '1rem',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {plugin.name}
                </Typography>
                {getStatusBadge(plugin)}
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: textSecondary,
                  fontSize: '0.85rem',
                  lineHeight: 1.4,
                }}
              >
                {plugin.description}
              </Typography>
            </Box>

            {/* Stats */}
            <Box 
              display="flex" 
              gap={3} 
              alignItems="center" 
              sx={{ 
                flexShrink: 0,
                px: 2,
                py: 1,
                background: isLightTheme 
                  ? alpha('#000', 0.02) 
                  : alpha(colors.glassWhite, 0.03),
                borderRadius: 2,
                border: `1px solid ${alpha(borderColor, 0.2)}`,
              }}
            >
              <Box textAlign="center" sx={{ minWidth: 70 }}>
                <Box display="flex" alignItems="center" gap={0.5} justifyContent="center">
                  <GroupIcon sx={{ fontSize: 14, color: colors.primary }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: textPrimary, 
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {plugin.totalInstalls}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>
                  Installs
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  width: '1px', 
                  height: 30,
                  background: `linear-gradient(to bottom, transparent, ${alpha(borderColor, 0.3)}, transparent)`,
                }} 
              />
              
              <Box textAlign="center" sx={{ minWidth: 70 }}>
                <Box display="flex" alignItems="center" gap={0.5} justifyContent="center">
                  <TrendingUpIcon sx={{ fontSize: 14, color: colors.accent }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: textPrimary, 
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {plugin.monthlyActiveUsers}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>
                  MAU
                </Typography>
              </Box>
              
              <Box 
                sx={{ 
                  width: '1px', 
                  height: 30,
                  background: `linear-gradient(to bottom, transparent, ${alpha(borderColor, 0.3)}, transparent)`,
                }} 
              />
              
              <Box textAlign="center" sx={{ minWidth: 80 }}>
                <Typography 
                  variant="body2" 
                  className="revenue-text"
                  sx={{ 
                    color: colors.lottieGreen, 
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    textShadow: `0 0 12px ${alpha(colors.lottieGreen, 0.4)}`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  ${plugin.totalRevenue.toFixed(0)}
                </Typography>
                <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.7rem' }}>
                  Revenue
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <IconButton
              size="small"
              onClick={(e) => {
                try {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('IconButton clicked in list view for plugin:', plugin.name);
                  handleMenuOpen(e, plugin);
                } catch (error) {
                  console.error('Error opening menu:', error);
                  alert('Error opening menu: ' + error.message);
                }
              }}
              sx={{ 
                color: textSecondary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: categoryConfig.color,
                  background: alpha(categoryConfig.color, 0.1),
                  transform: 'scale(1.1)',
                }
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </GlassCard>
      </motion.div>
    );
  };

  // Render plugin card
  const renderPluginCard = (plugin) => {
    const categoryConfig = getCategoryConfig(
      plugin.deploymentStatus === 'PRODUCTION' ? 'production' :
      plugin.deploymentStatus === 'STAGING' ? 'staging' :
      plugin.deploymentStatus === 'DEVELOPMENT' ? 'dev' :
      plugin.deploymentStatus === 'ERROR' ? 'dev' :
      'new'
    );

    return (
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={plugin.id}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -6 }}
        >
          <GlassCard
            variant="strong"
            sx={{
              height: '100%',
              p: 0,
              borderRadius: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer',
              border: `1px solid ${alpha(categoryConfig.color, 0.08)}`,
              // Theme-aware shadow for dimension
              boxShadow: isLightTheme 
                ? `
                  0 2px 8px ${alpha('#000', 0.08)},
                  0 4px 16px ${alpha(categoryConfig.color, 0.06)},
                  0 1px 2px ${alpha('#000', 0.04)}
                `
                : `
                  0 0 20px ${alpha(categoryConfig.color, 0.15)},
                  0 4px 16px ${alpha(colors.glassWhite, 0.1)},
                  inset 0 1px 0 ${alpha(colors.glassWhite, 0.2)}
                `,
              // Subtle gradient overlay for depth
              background: isLightTheme 
                ? `linear-gradient(135deg, ${alpha('#fff', 0.9)}, ${alpha('#fff', 0.95)})`
                : `linear-gradient(135deg, ${alpha(colors.glassWhite, 0.08)}, ${alpha(colors.glassWhite, 0.06)})`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: isLightTheme
                  ? `
                    0 8px 32px ${alpha(categoryConfig.color, 0.15)},
                    0 12px 24px ${alpha('#000', 0.1)},
                    0 4px 8px ${alpha(categoryConfig.color, 0.08)}
                  `
                  : `
                    0 0 30px ${alpha(categoryConfig.color, 0.25)},
                    0 8px 32px ${alpha(colors.glassWhite, 0.15)},
                    inset 0 1px 0 ${alpha(colors.glassWhite, 0.3)}
                  `,
                border: `1px solid ${alpha(categoryConfig.color, 0.18)}`,
                '& .plugin-icon': {
                  transform: 'rotate(8deg) scale(1.1)',
                  filter: `drop-shadow(0 2px 6px ${alpha(categoryConfig.color, 0.3)})`,
                },
                '& .stats-container': {
                  transform: 'translateY(-1px)',
                },
                '&::before': {
                  opacity: 1,
                  transform: 'translateX(100%)',
                },
                '&::after': {
                  opacity: 0.3,
                }
              },
              // Shimmer effect
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-100%',
                width: '200%',
                height: '200%',
                background: `linear-gradient(
                  90deg,
                  transparent,
                  ${alpha(categoryConfig.color, 0.04)},
                  ${alpha(categoryConfig.color, 0.08)},
                  ${alpha(categoryConfig.color, 0.04)},
                  transparent
                )`,
                transform: 'translateX(-100%)',
                transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0,
                pointerEvents: 'none',
              },
              // Gradient border effect
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: -2,
                borderRadius: 'inherit',
                padding: 2,
                background: `linear-gradient(135deg, ${alpha(categoryConfig.color, 0.2)}, ${alpha(categoryConfig.color, 0.05)})`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Box
                    className="plugin-icon"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      background: isLightTheme 
                        ? alpha(categoryConfig.color, 0.08)
                        : alpha(categoryConfig.color, 0.12),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${alpha(categoryConfig.color, 0.15)}`,
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: `0 2px 4px ${alpha(categoryConfig.color, 0.08)}`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: -2,
                        borderRadius: '14px',
                        background: `radial-gradient(circle, ${alpha(categoryConfig.color, 0.1)}, transparent)`,
                        opacity: 0.4,
                        animation: 'pulse 3s ease-in-out infinite',
                      }
                    }}
                  >
                    {React.cloneElement(categoryConfig.icon, {
                      sx: { 
                        fontSize: 20, 
                        color: categoryConfig.color,
                      }
                    })}
                  </Box>
                  {getStatusBadge(plugin)}
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    try {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('IconButton clicked in card view for plugin:', plugin.name);
                      handleMenuOpen(e, plugin);
                    } catch (error) {
                      console.error('Error opening menu:', error);
                      alert('Error opening menu: ' + error.message);
                    }
                  }}
                  sx={{ 
                    color: textSecondary,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: categoryConfig.color,
                      background: alpha(categoryConfig.color, 0.1),
                    }
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Box>

              {/* Plugin Info */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: fonts.heading,
                  color: textPrimary,
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: '1.1rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {plugin.name}
              </Typography>

              <Typography 
                variant="body2" 
                sx={{ 
                  color: textSecondary,
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  fontSize: '0.875rem',
                }}
              >
                {plugin.description}
              </Typography>

              {/* Metadata */}
              <Box display="flex" flexDirection="column" gap={1} mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 400 }}>
                    Category:
                  </Typography>
                  <Chip 
                    label={plugin.category} 
                    size="small" 
                    sx={{ 
                      height: 20,
                      background: isLightTheme ? alpha(colors.primary, 0.08) : alpha(colors.primary, 0.12),
                      color: colors.primary,
                      border: `1px solid ${alpha(colors.primary, 0.15)}`,
                      fontWeight: 500,
                      fontSize: '0.72rem',
                      '& .MuiChip-label': {
                        px: 1,
                      }
                    }}
                  />
                </Box>

                <Box display="flex" gap={2} flexWrap="wrap">
                  {plugin.gitRepo && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <GitHubIcon sx={{ fontSize: 13, color: textSecondary }} />
                      <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 400, fontSize: '0.72rem' }}>
                        Connected
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" alignItems="center" gap={0.5}>
                    <AttachMoneyIcon sx={{ fontSize: 13, color: textSecondary }} />
                    <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 400, fontSize: '0.72rem' }}>
                      {plugin.pricingModel}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Stats Container */}
              <Box 
                className="stats-container"
                sx={{ 
                  background: isLightTheme 
                    ? alpha('#000', 0.01) 
                    : alpha(colors.glassWhite, 0.02),
                  borderRadius: 1.5,
                  p: 1.75,
                  border: `1px solid ${alpha(borderColor, 0.15)}`,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box display="flex" justifyContent="space-between">
                  <Box textAlign="center" flex={1}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: textPrimary, 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        mb: 0.25,
                      }}
                    >
                      {plugin.totalInstalls}
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.72rem', fontWeight: 400 }}>
                      Installs
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      width: '1px', 
                      background: `linear-gradient(to bottom, transparent, ${alpha(borderColor, 0.5)}, transparent)`,
                      mx: 1,
                    }} 
                  />
                  
                  <Box textAlign="center" flex={1}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: textPrimary, 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        mb: 0.25,
                      }}
                    >
                      {plugin.monthlyActiveUsers}
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.72rem', fontWeight: 400 }}>
                      MAU
                    </Typography>
                  </Box>
                  
                  <Box 
                    sx={{ 
                      width: '1px', 
                      background: `linear-gradient(to bottom, transparent, ${alpha(borderColor, 0.5)}, transparent)`,
                      mx: 1,
                    }} 
                  />
                  
                  <Box textAlign="center" flex={1}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: colors.lottieGreen, 
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        lineHeight: 1,
                        mb: 0.25,
                      }}
                    >
                      ${plugin.totalRevenue.toFixed(0)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.72rem', fontWeight: 400 }}>
                      Revenue
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </GlassCard>
        </motion.div>
      </Grid>
    );
  };

  if (loading) {
    return (
      <Box p={3}>
        <Skeleton variant="text" width={200} height={40} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {[...Array(8)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
              <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  const filteredPlugins = getFilteredPlugins();

  return (
    <StaffBackgroundWrapper>
      <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: fonts.heading,
            fontWeight: 600,
            color: textPrimary,
          }}
        >
          My Plugins
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateNew}
            sx={{
              background: gradients.primaryGradient,
              '&:hover': {
                background: gradients.primaryGradient,
                transform: 'scale(1.02)',
              }
            }}
          >
            Create New
          </Button>
          <IconButton 
            onClick={() => {
              // Trigger animation
              setIsRefreshing(true);
              
              // Force component to re-check DataLayer for updates
              setRefreshKey(prev => prev + 1);
              setRemoteTrigger(remoteTrigger + 1);
              // Stop animation after 600ms
              setTimeout(() => setIsRefreshing(false), 600);
            }} 
            sx={{ 
              color: textSecondary,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: colors.primary,
                transform: 'scale(1.1)',
              }
            }}
            title="Refresh plugins"
          >
            <RefreshIcon 
              sx={{ 
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isRefreshing ? 'rotate(360deg)' : 'rotate(0deg)',
              }} 
            />
          </IconButton>
        </Box>
      </Box>

      {/* Controls */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search plugins..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ 
            flex: 1, 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              background: isLightTheme ? alpha(backgroundPaper, 0.5) : alpha(colors.glassWhite, 0.05),
              backdropFilter: 'blur(10px)',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: textSecondary }} />
              </InputAdornment>
            ),
          }}
        />

        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={(e, newCategory) => newCategory && setSelectedCategory(newCategory)}
          sx={{
            '& .MuiToggleButton-root': {
              border: `2px solid ${borderColor}`,
              borderRadius: '50%',
              color: textSecondary,
              '&.Mui-selected': {
                background: alpha(colors.primary, 0.1),
                color: colors.primary,
                borderColor: colors.primary,
              }
            }
          }}
        >
          <ToggleButton value="new">
            <Badge badgeContent={plugins.new.length} color="primary">
              New
            </Badge>
          </ToggleButton>
          <ToggleButton value="dev">
            <Badge badgeContent={plugins.dev.length} color="secondary">
              Dev
            </Badge>
          </ToggleButton>
          <ToggleButton value="staging">
            <Badge badgeContent={plugins.staging.length} color="info">
              Staging
            </Badge>
          </ToggleButton>
          <ToggleButton value="production">
            <Badge badgeContent={plugins.production.length} color="success">
              Production
            </Badge>
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
        >
          <ToggleButton value="grid">
            <ViewModuleIcon />
          </ToggleButton>
          <ToggleButton value="list">
            <ViewListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Category Overview */}
      <Grid container spacing={2} mb={3}>
        {['new', 'dev', 'staging', 'production'].map((category) => {
          const config = getCategoryConfig(category);
          const count = plugins[category].length;
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category}>
              <Paper
                sx={{
                  p: 2,
                  background: isLightTheme ? alpha(backgroundPaper, 0.98) : alpha(colors.glassWhite, 0.08),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 16px ${alpha(config.color, 0.2)}`,
                    border: `1px solid ${alpha(config.color, 0.3)}`,
                  }
                }}
                onClick={() => setSelectedCategory(category)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: alpha(config.color, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${alpha(config.color, 0.3)}`,
                    }}
                  >
                    {config.icon}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" sx={{ color: config.color, fontWeight: 600 }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary }}>
                      {config.label}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Plugin Grid or List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredPlugins.length > 0 ? (
            filteredPlugins.map(renderPluginCard)
          ) : (
            <Grid size={12}>
              <Paper
                sx={{
                  p: 4,
                  textAlign: 'center',
                  background: isLightTheme ? alpha(backgroundPaper, 0.98) : alpha(colors.glassWhite, 0.08),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${borderColor}`,
                  borderRadius: 2,
                }}
              >
                <ExtensionIcon sx={{ fontSize: 64, color: textSecondary, mb: 2 }} />
                <Typography variant="h6" sx={{ color: textPrimary, mb: 1 }}>
                  No plugins found
                </Typography>
                <Typography variant="body2" sx={{ color: textSecondary, mb: 3 }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first plugin to get started'}
                </Typography>
                {!searchTerm && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleCreateNew}
                    sx={{
                      borderColor: colors.primary,
                      color: colors.primary,
                      '&:hover': {
                        borderColor: colors.primary,
                        background: alpha(colors.primary, 0.1),
                      }
                    }}
                  >
                    Create Plugin
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      ) : (
        <Box>
          {filteredPlugins.length > 0 ? (
            filteredPlugins.map(renderPluginListItem)
          ) : (
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                background: isLightTheme ? alpha(backgroundPaper, 0.98) : alpha(colors.glassWhite, 0.08),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
              }}
            >
              <ExtensionIcon sx={{ fontSize: 64, color: textSecondary, mb: 2 }} />
              <Typography variant="h6" sx={{ color: textPrimary, mb: 1 }}>
                No plugins found
              </Typography>
              <Typography variant="body2" sx={{ color: textSecondary, mb: 3 }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Create your first plugin to get started'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNew}
                  sx={{
                    borderColor: colors.primary,
                    color: colors.primary,
                    '&:hover': {
                      borderColor: colors.primary,
                      background: alpha(colors.primary, 0.1),
                    }
                  }}
                >
                  Create Plugin
                </Button>
              )}
            </Paper>
          )}
        </Box>
      )}

      {/* Context Menu */}
      {console.log('Menu render state:', { anchorEl, isOpen: Boolean(anchorEl), selectedPlugin })}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onOpen={() => console.log('Menu opened')}
        keepMounted
        PaperProps={{
          sx: {
            background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.1),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${borderColor}`,
            zIndex: 1400,
          }
        }}
      >
        <MenuItem onClick={() => {
          try {
            console.log('View Details clicked for plugin:', selectedPlugin);
            handleMenuClose();
            // Add your view details logic here
          } catch (error) {
            console.error('Error in View Details:', error);
            alert('Error viewing details: ' + error.message);
          }
        }}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          try {
            console.log('Edit clicked for plugin:', selectedPlugin);
            handleMenuClose();
            // Add your edit logic here
          } catch (error) {
            console.error('Error in Edit:', error);
            alert('Error editing: ' + error.message);
          }
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          try {
            console.log('View Code clicked for plugin:', selectedPlugin);
            if (selectedPlugin?.gitRepo) {
              window.open(selectedPlugin.gitRepo, '_blank');
            } else {
              alert('No GitHub repository linked to this plugin');
            }
            handleMenuClose();
          } catch (error) {
            console.error('Error in View Code:', error);
            alert('Error viewing code: ' + error.message);
          }
        }}>
          <ListItemIcon>
            <CodeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Code</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          try {
            console.log('Delete clicked for plugin:', selectedPlugin);
            if (confirm(`Are you sure you want to delete ${selectedPlugin?.name}?`)) {
              console.log('Deleting plugin:', selectedPlugin?.id);
              // Add your delete logic here
            }
            handleMenuClose();
          } catch (error) {
            console.error('Error in Delete:', error);
            alert('Error deleting: ' + error.message);
          }
        }} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
    </StaffBackgroundWrapper>
  );
};

export default ViewAll;