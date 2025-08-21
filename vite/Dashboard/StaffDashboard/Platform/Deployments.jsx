// Deployments.jsx

import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme as useCustomTheme } from '../../../Context/ThemeContext';
import { useDataLayer } from '../../../Context/DataLayer';
// import { useGitHub } from '../../../hooks/useGitHub';
import { 
  Box, 
  Typography, 
  Button,
  Chip,
  IconButton,
  Alert,
  Tooltip,
  Menu,
  MenuItem,
  alpha,
  useTheme,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Grid,
  Paper,
  Skeleton,
  Badge,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  RocketLaunch,
  Code,
  CloudUpload,
  MoreVert,
  ArrowForward,
  GitHub,
  Visibility,
  Delete,
  Refresh,
  AutoAwesome,
  TrendingUp,
  Public,
  Close,
  Add as AddIcon,
  Search as SearchIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  Extension as ExtensionIcon,
  Group as GroupIcon,
  Edit as EditIcon,
  AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GlassCard } from '../components/Buttons';
import { SimpleConfirm } from '../components/SimpleConfirm';
import { githubConfig } from '../../../config/github';
import DeploymentsModal from './DeploymentsModal';
import { StaffBackgroundWrapper } from '../StaffLayout';
import DeleteProjectModal from '../components/DeleteProjectModal';
import ViewDetailsModal from '../components/ViewDetailsModal';
import EditAppConfig from '../components/EditAppConfig';

// Deployment stage configuration - using ViewAll colors
const DEPLOYMENT_STAGES = {
  NEW: {
    label: 'New',
    icon: AutoAwesome,
    color: '#F59E0B', // Yellow from ViewAll
    nextStage: 'DEVELOPMENT',
    nextAction: 'Deploy to Development',
    description: 'Recently created plugins'
  },
  DEVELOPMENT: {
    label: 'Development',
    icon: Code,
    color: '#8B5CF6', // Purple
    nextStage: 'STAGING',
    nextAction: 'Push to Staging',
    description: 'Plugins in development'
  },
  STAGING: {
    label: 'Staging',
    icon: RocketLaunch,
    color: '#3B82F6', // Blue
    nextStage: 'PRODUCTION',
    nextAction: 'Submit for Production',
    description: 'Testing before production'
  },
  PRODUCTION: {
    label: 'Production',
    icon: Public,
    color: '#10B981', // Green
    nextStage: null,
    nextAction: null,
    description: 'Live and published'
  }
};

// Get status badge
const getStatusBadge = (plugin) => {
  const status = plugin.deploymentStatus;
  const statusConfig = {
    'PRODUCTION': { label: 'Production', color: 'success' },
    'STAGING': { label: 'Staging', color: 'info' },
    'DEVELOPMENT': { label: 'Development', color: 'primary' },
    'NEW': { label: 'New', color: 'warning' }
  };
  
  const config = statusConfig[status] || { label: 'Unknown', color: 'default' };
  return <Chip label={config.label} size="small" color={config.color} />;
};

// Render plugin list item (table row view)
const renderPluginListItem = (plugin, stage, onDeploy, onAction, handleMenuOpen, isLightTheme, colors, textPrimary, textSecondary, borderColor) => {
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
          borderRadius: 2,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          border: `1px solid ${alpha(stage.color, 0.08)}`,
          // Theme-aware shadow for dimension
          boxShadow: isLightTheme
            ? `
              0 1px 3px ${alpha('#000', 0.06)},
              0 2px 8px ${alpha(stage.color, 0.04)},
              0 1px 1px ${alpha('#000', 0.03)}
            `
            : `
              0 0 12px ${alpha(stage.color, 0.1)},
              0 2px 8px ${alpha(colors.glassWhite, 0.08)},
              inset 0 1px 0 ${alpha(colors.glassWhite, 0.15)}
            `,
          // Subtle gradient for depth
          background: isLightTheme 
            ? `linear-gradient(to bottom right, ${alpha('#fff', 0.95)}, ${alpha('#fff', 0.98)})`
            : `linear-gradient(to bottom right, ${alpha(colors.glassWhite, 0.07)}, ${alpha(colors.glassWhite, 0.05)})`,
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: isLightTheme
              ? `
                0 4px 16px ${alpha(stage.color, 0.12)},
                0 8px 24px ${alpha('#000', 0.08)},
                0 2px 4px ${alpha(stage.color, 0.08)}
              `
              : `
                0 0 20px ${alpha(stage.color, 0.2)},
                0 4px 16px ${alpha(colors.glassWhite, 0.12)},
                inset 0 1px 0 ${alpha(colors.glassWhite, 0.25)}
              `,
            border: `1px solid ${alpha(stage.color, 0.18)}`,
            '& .list-icon': {
              transform: 'rotate(6deg) scale(1.08)',
            },
            '& .revenue-text': {
              transform: 'scale(1.05)',
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
              ${alpha(stage.color, 0.04)},
              ${alpha(stage.color, 0.08)},
              ${alpha(stage.color, 0.04)},
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
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: isLightTheme 
                ? alpha(stage.color, 0.08)
                : alpha(stage.color, 0.12),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${alpha(stage.color, 0.15)}`,
              flexShrink: 0,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 2px 4px ${alpha(stage.color, 0.08)}`,
            }}
          >
            <stage.icon sx={{ 
              fontSize: 18, 
              color: stage.color,
            }} />
          </Box>

          {/* Plugin Info */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1.5} mb={0.25}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
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
              {plugin.description || 'No description available'}
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
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {plugin.totalInstalls || 0}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.68rem' }}>
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
                <TrendingUp sx={{ fontSize: 14, color: colors.accent }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: textPrimary, 
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}
                >
                  {plugin.monthlyActiveUsers || 0}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.68rem' }}>
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
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'transform 0.3s ease',
                }}
              >
                ${plugin.totalRevenue?.toFixed(0) || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.68rem' }}>
                Revenue
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box display="flex" alignItems="center" gap={1}>
            {stage.nextStage && (
              <Button
                className="deploy-button"
                variant="contained"
                size="small"
                startIcon={<ArrowForward />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeploy(plugin, stage.nextStage);
                }}
                sx={{
                  background: `linear-gradient(135deg, ${stage.color}, ${alpha(stage.color, 0.8)})`,
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  px: 2.5,
                  py: 0.75,
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px ${alpha(stage.color, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(stage.color, 0.9)}, ${stage.color})`,
                    boxShadow: `0 6px 20px ${alpha(stage.color, 0.4)}`,
                  }
                }}
              >
                {stage.nextAction}
              </Button>
            )}
            
            <IconButton
              size="small"
              onClick={(e) => handleMenuOpen(e, plugin)}
              sx={{ 
                color: textSecondary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: stage.color,
                  background: alpha(stage.color, 0.1),
                  transform: 'scale(1.1)',
                }
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </GlassCard>
    </motion.div>
  );
};

// Render plugin card for grid view
const renderPluginCard = (plugin, stage, onDeploy, onAction, handleMenuOpen, isLightTheme, colors, fonts, textPrimary, textSecondary, borderColor) => {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={plugin.id}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -6 }}
        onClick={() => onDeploy(plugin, stage.nextStage)}
        style={{ cursor: 'pointer' }}
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
            border: `1px solid ${alpha(stage.color, 0.08)}`,
            // Theme-aware shadow for dimension
            boxShadow: isLightTheme 
              ? `
                0 2px 8px ${alpha('#000', 0.08)},
                0 4px 16px ${alpha(stage.color, 0.06)},
                0 1px 2px ${alpha('#000', 0.04)}
              `
              : `
                0 0 20px ${alpha(stage.color, 0.15)},
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
                  0 8px 32px ${alpha(stage.color, 0.15)},
                  0 12px 24px ${alpha('#000', 0.1)},
                  0 4px 8px ${alpha(stage.color, 0.08)}
                `
                : `
                  0 0 30px ${alpha(stage.color, 0.25)},
                  0 8px 32px ${alpha(colors.glassWhite, 0.15)},
                  inset 0 1px 0 ${alpha(colors.glassWhite, 0.3)}
                `,
              border: `1px solid ${alpha(stage.color, 0.18)}`,
              '& .plugin-icon': {
                transform: 'rotate(8deg) scale(1.1)',
                filter: `drop-shadow(0 2px 6px ${alpha(stage.color, 0.3)})`,
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
                ${alpha(stage.color, 0.04)},
                ${alpha(stage.color, 0.08)},
                ${alpha(stage.color, 0.04)},
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
              background: `linear-gradient(135deg, ${alpha(stage.color, 0.2)}, ${alpha(stage.color, 0.05)})`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              opacity: 0,
              transition: 'opacity 0.4s ease',
              pointerEvents: 'none',
            }
          }}
        >
          <Box sx={{ p: 2.5 }}>
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
                      ? alpha(stage.color, 0.08)
                      : alpha(stage.color, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${alpha(stage.color, 0.15)}`,
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 2px 4px ${alpha(stage.color, 0.08)}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '14px',
                      background: `radial-gradient(circle, ${alpha(stage.color, 0.1)}, transparent)`,
                      opacity: 0.4,
                      animation: 'pulse 3s ease-in-out infinite',
                    }
                  }}
                >
                  <stage.icon sx={{ 
                    fontSize: 20, 
                    color: stage.color,
                  }} />
                </Box>
                {getStatusBadge(plugin)}
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(e, plugin);
                }}
                sx={{ 
                  color: textSecondary,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: stage.color,
                    background: alpha(stage.color, 0.1),
                  }
                }}
              >
                <MoreVert />
              </IconButton>
            </Box>

            {/* Plugin Info */}
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: fonts.heading,
                color: textPrimary,
                fontWeight: 600,
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
              {plugin.description || 'No description available'}
            </Typography>

            {/* Metadata */}
            <Box display="flex" flexDirection="column" gap={1} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 400 }}>
                  Category:
                </Typography>
                <Chip 
                  label={plugin.category || 'General'} 
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
                    <GitHub sx={{ fontSize: 13, color: textSecondary }} />
                    <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 400, fontSize: '0.72rem' }}>
                      Connected
                    </Typography>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={0.5}>
                  <AttachMoneyIcon sx={{ fontSize: 13, color: textSecondary }} />
                  <Typography variant="caption" sx={{ color: textSecondary, fontWeight: 400, fontSize: '0.72rem' }}>
                    {plugin.pricingModel || 'Free'}
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
                    {plugin.totalInstalls || 0}
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
                    {plugin.monthlyActiveUsers || 0}
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
                    ${plugin.totalRevenue?.toFixed(0) || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: textSecondary, fontSize: '0.72rem', fontWeight: 400 }}>
                    Revenue
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Deploy Button */}
            {stage.nextStage && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<ArrowForward />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeploy(plugin, stage.nextStage);
                }}
                sx={{
                  mt: 2,
                  background: `linear-gradient(135deg, ${stage.color}, ${alpha(stage.color, 0.8)})`,
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  py: 1,
                  transition: 'all 0.3s ease',
                  boxShadow: `0 4px 12px ${alpha(stage.color, 0.3)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(stage.color, 0.9)}, ${stage.color})`,
                    boxShadow: `0 6px 20px ${alpha(stage.color, 0.4)}`,
                  }
                }}
              >
                {stage.nextAction}
              </Button>
            )}
          </Box>
        </GlassCard>
      </motion.div>
    </Grid>
  );
};

// Main Deployments component
export default function Deployments() {
  const navigate = useNavigate();
  const muiTheme = useTheme();
  const { theme, colors, gradients, glassmorphism, fonts } = useCustomTheme();
  const isLightTheme = theme === 'light';
  
  // Use DataLayer for plugin data
  const { userPlugins, user, userPluginsDataRef, updateUserPlugins, remoteTrigger, setRemoteTrigger } = useDataLayer();
  const [projects, setProjects] = useState([]);
  
  // GitHub hook for operations
  // const { 
  //   triggerPluginPush, 
  //   checkCallbackStatus,
  //   fetchSpecificRepo,
  //   parseGitHubUrl 
  // } = useGitHub();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [showEditConfigModal, setShowEditConfigModal] = useState(false);
  // Add ViewAll-style state
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('NEW');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Deployment dialog state
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);
  


  // Theme-aware colors - matching ViewAll
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const backgroundPaper = isLightTheme ? '#ffffff' : colors.background;
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);

  // Update projects when userPluginsDataRef changes
  useEffect(() => {
    if (userPlugins) {
      setProjects(userPlugins);
      setLoading(false);
    }
  }, [userPlugins, userPluginsDataRef, refreshKey]);



  const handleRefresh = () => {
    // Trigger animation
    setIsRefreshing(true);
    
    // Force component to re-check DataLayer for updates
    setRefreshKey(prev => prev + 1);
    setRemoteTrigger(remoteTrigger + 1);
    // Stop animation after 600ms
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter plugins
  const getFilteredPlugins = () => {
    const selectedPlugins = projects.filter(plugin => 
      plugin.deploymentStatus === selectedCategory
    );

    if (searchTerm) {
      return selectedPlugins.filter(plugin =>
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return selectedPlugins;
  };

  // Group plugins by deployment status
  const groupedPlugins = projects.reduce((acc, plugin) => {
    const status = plugin.deploymentStatus || 'NEW';
    if (!acc[status]) acc[status] = [];
    acc[status].push(plugin);
    return acc;
  }, {});

  // Handle deployment push - opens deployment dialog
  const handleDeploy = async (plugin, nextStage) => {
    setSelectedPlugin(plugin);
    setActionType(`deploy-${nextStage}`);
    setShowDeploymentDialog(true);
  };
  


  // Handle other actions
  const handleAction = (action, plugin) => {
    setSelectedPlugin(plugin);
    setActionType(action);
    
    if (action === 'delete') {
      setShowConfirm(true);
    } else if (action === 'view') {
      setShowViewDetailsModal(true);
    } else if (action === 'edit') {
      setShowEditConfigModal(true);
    }
  };


  

  
  // Confirm action (for delete)
  const confirmAction = async () => {
    if (!selectedPlugin || !actionType) return;

    try {
      if (actionType === 'delete') {
        // Close confirm dialog and open delete modal
        setShowConfirm(false);
        setShowDeleteModal(true);
      }
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      if (actionType !== 'delete') {
        setShowConfirm(false);
        setSelectedPlugin(null);
        setActionType(null);
      }
    }
  };

  // Get confirmation message
  const getConfirmMessage = () => {
    if (!actionType || !selectedPlugin) return '';
    
    if (actionType === 'delete') {
      return `Are you sure you want to delete "${selectedPlugin.name}"? This action cannot be undone.`;
    } else if (actionType.startsWith('deploy-')) {
      const nextStage = actionType.split('-')[1];
      const stageInfo = DEPLOYMENT_STAGES[nextStage];
      return `Deploy "${selectedPlugin.name}" to ${stageInfo.label}? ${
        nextStage === 'PRODUCTION' 
          ? 'This will submit your plugin for review before going live.' 
          : 'You can rollback this change later if needed.'
      }`;
    }
    return '';
  };

  // Menu handlers
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuOpen = (event, plugin) => {
    setAnchorEl(event.currentTarget);
    setSelectedPlugin(plugin);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const filteredPlugins = getFilteredPlugins();

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

  return (
    <StaffBackgroundWrapper>
      <Box>
      {/* Error Alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
      
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
          Deployments
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/staff/dash/new')}
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
            onClick={handleRefresh} 
            sx={{ 
              color: textSecondary,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: colors.primary,
                transform: 'scale(1.1)',
              }
            }}
            title="Refresh deployments"
          >
            <Refresh 
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
          <ToggleButton value="NEW">
            <Badge badgeContent={groupedPlugins.NEW?.length || 0} color="warning">
              New
            </Badge>
          </ToggleButton>
          <ToggleButton value="DEVELOPMENT">
            <Badge badgeContent={groupedPlugins.DEVELOPMENT?.length || 0} color="primary">
              Dev
            </Badge>
          </ToggleButton>
          <ToggleButton value="STAGING">
            <Badge badgeContent={groupedPlugins.STAGING?.length || 0} color="info">
              Staging
            </Badge>
          </ToggleButton>
          <ToggleButton value="PRODUCTION">
            <Badge badgeContent={groupedPlugins.PRODUCTION?.length || 0} color="success">
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
      <Grid container spacing={2} mb={0}>
        {Object.entries(DEPLOYMENT_STAGES).map(([key, stage]) => {
          const count = (groupedPlugins[key] || []).length;
          
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={key}>
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
                    boxShadow: `0 4px 16px ${alpha(stage.color, 0.2)}`,
                    border: `1px solid ${alpha(stage.color, 0.3)}`,
                  }
                }}
                onClick={() => setSelectedCategory(key)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '12px',
                      background: alpha(stage.color, 0.08),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${alpha(stage.color, 0.15)}`,
                    }}
                  >
                    <stage.icon sx={{ color: stage.color }} />
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h4" sx={{ color: stage.color, fontWeight: 600 }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textSecondary }}>
                      {stage.label}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Progress Indicator */}
      {projects && projects.length > 0 && (
        <Box sx={{ mt: 0, p: 1 }}>
          {/* <Typography variant="subtitle2" sx={{ color: textSecondary, mb: 2 }}>
            Deployment Pipeline Progress
          </Typography> */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {Object.entries(DEPLOYMENT_STAGES).map(([status, stageInfo], index) => {
              const count = (groupedPlugins[status] || []).length;
              const hasPlugins = count > 0;
              
              return (
                <Fragment key={status}>
                  <Tooltip title={`${count} plugin${count !== 1 ? 's' : ''} in ${stageInfo.label}`}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: hasPlugins ? stageInfo.color : alpha(stageInfo.color, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: hasPlugins ? '#ffffff' : stageInfo.color,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      {hasPlugins ? count : <stageInfo.icon sx={{ fontSize: 20 }} />}
                    </Box>
                  </Tooltip>
                  {index < Object.keys(DEPLOYMENT_STAGES).length - 1 && (
                    <Box
                      sx={{
                        flex: 1,
                        height: 2,
                        background: alpha(colors.accent, 0.2),
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
                          animation: 'slide 3s linear infinite'
                        }}
                      />
                    </Box>
                  )}
                </Fragment>
              );
            })}
          </Box>
        </Box>
      )}
      {/* Plugin Grid or List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {filteredPlugins.length > 0 ? (
            filteredPlugins.map(plugin => {
              const stage = DEPLOYMENT_STAGES[plugin.deploymentStatus || 'NEW'];
              return renderPluginCard(plugin, stage, handleDeploy, handleAction, handleMenuOpen, isLightTheme, colors, fonts, textPrimary, textSecondary, borderColor);
            })
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
                    onClick={() => navigate('/staff/dash/new')}
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
            filteredPlugins.map(plugin => {
              const stage = DEPLOYMENT_STAGES[plugin.deploymentStatus || 'NEW'];
              return renderPluginListItem(plugin, stage, handleDeploy, handleAction, handleMenuOpen, isLightTheme, colors, textPrimary, textSecondary, borderColor);
            })
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
                  onClick={() => navigate('/staff/dash/new')}
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.1),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${borderColor}`,
          }
        }}
      >
        {/* View Details */}
        <MenuItem onClick={() => {
          handleMenuClose();
          handleAction('view', selectedPlugin);
        }}>
          <ListItemIcon>
            <Visibility fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            View Details
          </ListItemText>
        </MenuItem>
        {/* Edit */}
        <MenuItem onClick={() => {
          handleMenuClose();
          handleAction('edit', selectedPlugin);
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            Edit
          </ListItemText>
        </MenuItem>
        {/* View Code */}
        <MenuItem onClick={() => {
          handleMenuClose();
          // Show repo link
          if (selectedPlugin?.gitRepo) {
            window.open(selectedPlugin.gitRepo, '_blank');
          }
        }}>
          <ListItemIcon>
            <Code fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            View Code
          </ListItemText>
        </MenuItem>
        <Divider />
        {/* Delete */}
        <MenuItem 
        sx={{ color: 'error.main' }}
        onClick={() => {
          handleMenuClose();
          handleAction('delete', selectedPlugin);
        }} 
        >
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Confirmation Dialog */}
      <SimpleConfirm
        open={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setSelectedPlugin(null);
          setActionType(null);
        }}
        onConfirm={confirmAction}
        message={getConfirmMessage()}
      />

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes slide {
            from { left: -100%; }
            to { left: 100%; }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Deployment Modal */}
      <DeploymentsModal
        open={showDeploymentDialog}
        onClose={() => setShowDeploymentDialog(false)}
        selectedPlugin={selectedPlugin}
        actionType={actionType}
        onConfirm={() => {}}
        // Theme props
        isLightTheme={isLightTheme}
        colors={colors}
        glassmorphism={glassmorphism}
        // Theme-aware colors
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        borderColor={borderColor}
        // GitHub config
        githubConfig={githubConfig}
        // DataLayer
        updateUserPlugins={updateUserPlugins}
        projects={projects}
        // For navigation
        navigate={navigate}
        user={user}
      />

      {/* Delete Project Modal */}
      <DeleteProjectModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        selectedPlugin={selectedPlugin}
        // Theme props
        isLightTheme={isLightTheme}
        colors={colors}
        glassmorphism={glassmorphism}
        // Theme-aware colors
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        borderColor={borderColor}
        // GitHub config
        githubConfig={githubConfig}
        // DataLayer
        updateUserPlugins={updateUserPlugins}
        projects={projects}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        open={showViewDetailsModal}
        onClose={() => setShowViewDetailsModal(false)}
        selectedPlugin={selectedPlugin}
        // Theme props
        isLightTheme={isLightTheme}
        colors={colors}
        glassmorphism={glassmorphism}
        // Theme-aware colors
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        borderColor={borderColor}
      />

      {/* Edit Config Modal */}
      <EditAppConfig
        open={showEditConfigModal}
        onClose={() => setShowEditConfigModal(false)}
        selectedPlugin={selectedPlugin}
        // Theme props
        isLightTheme={isLightTheme}
        colors={colors}
        glassmorphism={glassmorphism}
        // Theme-aware colors
        textPrimary={textPrimary}
        textSecondary={textSecondary}
        borderColor={borderColor}
        // GitHub config
        githubConfig={githubConfig}
        // DataLayer
        updateUserPlugins={updateUserPlugins}
        projects={projects}
      />

    </Box>
    </StaffBackgroundWrapper>
  );
}
