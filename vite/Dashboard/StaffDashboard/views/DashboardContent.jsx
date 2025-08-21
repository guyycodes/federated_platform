// DashboardContent.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  CardContent,
  Grid,
  IconButton,
  Chip,
  Container,
  useTheme,
  alpha,
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import { 
  CheckCircle,
  Settings,
  Add,
  ShowChart,
  AutoAwesome,
  FolderOpen,
  Refresh as RefreshCw,
  MoreVert as MoreVertical,
  Error as ErrorIcon,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useUser } from '@clerk/clerk-react';
import { useTheme as useCustomTheme } from '../../../Context/ThemeContext';
import { useDataLayer } from '../../../Context/DataLayer';
import { motion } from 'framer-motion';
import { GlassCard, PrimaryButton, AccentButton } from '../components/Buttons';
import { NewProjectModal } from '../components/NewProjectModal';
import DashboardMetricsGrid from '../components/DashboardMetricsGrid';
import { useNavigate } from 'react-router-dom';

// ==================== MOCK DATA ====================
// Data is now managed through DataLayer context

// ==================== TEXT CONFIGURATION ====================
const TEXT_CONFIG = {
  // Header Section
  header: {
    welcomeMessage: (firstName) => `Welcome back, ${firstName || 'Developer'}! 👋`,
    subtitle: 'Manage your ML/LLM plugins and track their performance',
    eaxmple: "Example Dashboard:"
  },

  // Quick Stats Cards
  stats: {
    activePlugins: {
      title: 'Active Plugins',
      change: '+2 this week',
    },
    apiRequests: {
      title: 'API Requests',
      value: '45.2k',
      change: '+12.5%',
    },
    revenue: {
      title: 'Revenue',
      value: '$2,847',
      change: '+8.3%',
    },
    activeUsers: {
      title: 'Active Users',
      value: '1,283',
      change: '+24 today',
    },
  },

  // Action Buttons
  buttons: {
    newPlugin: 'New Plugin',
    browseTemplates: 'Browse Templates',
    createPlugin: 'Create Plugin',
    view: 'View',
    settings: 'Settings',
  },

  // Plugins Section
  plugins: {
    sectionTitle: 'Your Plugins',
    emptyState: {
      title: 'No plugins yet',
      description: 'Create your first ML/LLM plugin and start earning',
    },
  },

  // Project Status
  status: {
    deploying: 'deploying',
    active: 'active',
  },
};

// ==================== STATUS CONFIGURATION ====================
const STATUS_CONFIG = {
  NEW: {
    label: 'New',
    color: '#9333EA', // Purple
    icon: <Add />,
    animateIcon: false,
  },
  PENDING: {
    label: 'Pending',
    color: '#FFA500', // Orange
    icon: <RefreshCw sx={{ animation: 'spin 1s linear infinite' }} />,
    animateIcon: true,
  },
  DEVELOPMENT: {
    label: 'Development',
    color: '#3B82F6', // Blue
    icon: <Settings />,
    animateIcon: false,
  },
  STAGING: {
    label: 'Staging',
    color: '#10B981', // Emerald
    icon: <ShowChart />,
    animateIcon: false,
  },
  PRODUCTION: {
    label: 'Production',
    color: '#4ADE80', // Green
    icon: <CheckCircle />,
    animateIcon: false,
  },
  ERROR: {
    label: 'Error',
    color: '#EF4444', // Red
    icon: <ErrorIcon />,
    animateIcon: false,
  },
};

// ==================== METRICS COMPONENT ====================
// Metrics component has been extracted to DashboardMetricsGrid.jsx

// ==================== COMPONENT ====================
const DashboardContent = () => {
  const { user } = useUser();
  const { gradients, theme, colors, glassmorphism } = useCustomTheme();
  const { userPlugins, userPluginsDataRef,remoteTrigger, setRemoteTrigger } = useDataLayer();
  const muiTheme = useTheme();
  const isLightTheme = theme === 'light';
  const navigate = useNavigate();
  
  // Theme-aware colors
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);

  React.useEffect(() => {
    setRemoteTrigger(remoteTrigger - 1);
  }, []);

  // Add keyframe animation for spinning icons
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  
  // State management
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [expandedGroups, setExpandedGroups] = useState({
    NEW: true,
    PENDING: true,
    DEVELOPMENT: true,
    STAGING: true,
    PRODUCTION: true,
    ERROR: true,
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Group projects by deployment status
  // Update userProjects when userPluginsDataRef changes
  useEffect(() => {
    if (userPlugins) {
      setUserProjects(userPlugins);
    }
  }, [userPlugins, userPluginsDataRef]);

  const groupedProjects = userProjects.reduce((acc, project) => {
    const status = project.deploymentStatus;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(project);
    return acc;
  }, {});
  
  // Toggle group expansion
  const toggleGroup = (status) => {
    setExpandedGroups(prev => ({ ...prev, [status]: !prev[status] }));
  };

  // Menu handlers
  const handleMenuOpen = (event, project) => {
    event.stopPropagation(); // Prevent card click
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleViewProject = () => {
    navigate('/staff/platform/deployments');
    handleMenuClose();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };



  // Theme-aware background with sophisticated gradient
  const backgroundGradient = isLightTheme 
    ? `linear-gradient(135deg, ${alpha(colors.primary, 0.02)}, ${alpha(colors.secondary, 0.02)}, ${muiTheme.palette.grey[50]})`
    : gradients.darkGlass;

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      background: backgroundGradient,
      position: 'relative',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 },
      '&::before': isLightTheme ? {} : {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 50%, ${alpha(colors.accent, 0.05)}, transparent 50%), 
                     radial-gradient(circle at 80% 80%, ${alpha(colors.primary, 0.05)}, transparent 50%)`,
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth="xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 0, color: textPrimary }}>
                {TEXT_CONFIG.header.welcomeMessage(user?.firstName)}
              </Typography>
              <Typography variant="body1" sx={{ color: textSecondary }}>
                {TEXT_CONFIG.header.subtitle}
              </Typography>
            </Box>

            {/* Metrics Grid */}
            <DashboardMetricsGrid 
              colors={colors}
              isLightTheme={isLightTheme}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <PrimaryButton
                startIcon={<Add />}
                onClick={() => navigate('/staff/dash/new', { state: { fromCreateNew: true } })}
              >
                {TEXT_CONFIG.buttons.newPlugin}
              </PrimaryButton>
              <Button
                variant="outlined"
                startIcon={<FolderOpen />}
                onClick={() => navigate('/staff/templates')}
                sx={{
                  borderColor: borderColor,
                  color: textPrimary,
                  '&:hover': {
                    borderColor: alpha(colors.primary, 0.5),
                    background: isLightTheme 
                      ? alpha(colors.primary, 0.05)
                      : alpha(colors.glassWhite, 0.05)
                  }
                }}
              >
                {TEXT_CONFIG.buttons.browseTemplates}
              </Button>
            </Box>

            {/* Plugins Grouped by Status */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: textPrimary }}>
              {TEXT_CONFIG.plugins.sectionTitle}
            </Typography>
            
            {userProjects.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard 
                  sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: `0 12px 28px ${alpha(colors.accent, 0.15)}`,
                      '& .empty-icon': {
                        transform: 'rotate(360deg) scale(1.2)',
                        filter: `drop-shadow(0 4px 8px ${alpha(colors.accent, 0.5)})`,
                      }
                    },
                    // Animated gradient border
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 'inherit',
                      padding: '2px',
                      background: gradients.multiGradient,
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      opacity: 0.3,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 0.6,
                    }
                  }}
                >
                  <AutoAwesome 
                    className="empty-icon"
                    sx={{ 
                      fontSize: 48, 
                      color: colors.accent, 
                      mb: 2,
                      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }} 
                  />
                  <Typography variant="h6" sx={{ mb: 1, color: textPrimary, fontWeight: 600 }}>
                    {TEXT_CONFIG.plugins.emptyState.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: textSecondary, mb: 3 }}>
                    {TEXT_CONFIG.plugins.emptyState.description}
                  </Typography>
                  <AccentButton
                    startIcon={<Add />}
                    onClick={() => navigate('/staff/dash/new', { state: { fromCreateNew: true } })}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '0',
                        height: '0',
                        borderRadius: '50%',
                        background: alpha('#ffffff', 0.3),
                        transform: 'translate(-50%, -50%)',
                        transition: 'width 0.6s, height 0.6s',
                      },
                      '&:hover::after': {
                        width: '300px',
                        height: '300px',
                      }
                    }}
                  >
                    {TEXT_CONFIG.buttons.createPlugin}
                  </AccentButton>
                </GlassCard>
              </motion.div>
            ) : (
              <Box>
                {/* Render groups in order */}
                {['NEW', 'PENDING', 'DEVELOPMENT', 'STAGING', 'PRODUCTION', 'ERROR'].map((status) => {
                  const projects = groupedProjects[status];
                  if (!projects || projects.length === 0) return null;
                  
                  const statusConfig = STATUS_CONFIG[status];
                  const isExpanded = expandedGroups[status];
                  
                  return (
                    <Box key={status} sx={{ mb: 3 }}>
                      {/* Group Header */}
                      <Box 
                        onClick={() => toggleGroup(status)}
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          mb: 2,
                          cursor: 'pointer',
                          p: 2,
                          borderRadius: 2,
                          background: alpha(statusConfig.color, 0.05),
                          border: `1px solid ${alpha(statusConfig.color, 0.2)}`,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: alpha(statusConfig.color, 0.1),
                            borderColor: alpha(statusConfig.color, 0.3),
                          }
                        }}
                      >
                        {React.cloneElement(statusConfig.icon, { 
                          sx: { 
                            color: statusConfig.color,
                            fontSize: 20
                          } 
                        })}
                        <Typography variant="h6" sx={{ flex: 1, color: textPrimary, fontWeight: 600 }}>
                          {statusConfig.label} ({projects.length})
                        </Typography>
                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                      </Box>
                      
                      {/* Collapsible Content */}
                      <Collapse in={isExpanded}>
                        <Grid container spacing={2}>
                          {projects.map((project, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <GlassCard 
                                  sx={{ 
                                    height: '100%',
                                    p: 2,
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                      transform: 'translateY(-4px)',
                                      boxShadow: `0 8px 16px ${alpha(statusConfig.color, 0.2)}`,
                                    }
                                  }}
                                >
                                  {/* Compact Card Content */}
                                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ color: textPrimary, fontWeight: 600, fontSize: '0.9rem' }}>
                                      {project.name}
                                    </Typography>
                                    <IconButton 
                                      size="small" 
                                      sx={{ p: 0.5 }}
                                      onClick={(e) => handleMenuOpen(e, project)}
                                    >
                                      <MoreVertical sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  </Box>
                                  
                                  <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 1, lineHeight: 1.4 }}>
                                    {project.description.length > 60 ? project.description.substring(0, 60) + '...' : project.description}
                                  </Typography>
                                  
                                  {/* Compact metrics */}
                                  {(project.deploymentStatus === 'STAGING' || project.deploymentStatus === 'PRODUCTION' || project.deploymentStatus === 'ERROR') && (
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                      <Typography variant="caption" sx={{ color: textSecondary }}>
                                        {project.totalInstalls} installs
                                      </Typography>
                                      {project.totalRevenue > 0 && (
                                        <Typography variant="caption" sx={{ color: '#4ADE80' }}>
                                          ${project.totalRevenue.toLocaleString()}
                                        </Typography>
                                      )}
                                    </Box>
                                  )}
                                  
                                  {/* Compact Actions */}
                                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                                    <Button
                                      size="small"
                                      onClick={() => navigate(`/staff/platform/deployments`)}
                                      sx={{ 
                                        fontSize: '0.75rem',
                                        py: 0.5,
                                        px: 1,
                                        minWidth: 'auto',
                                        color: statusConfig.color,
                                        border: `1px solid ${alpha(statusConfig.color, 0.3)}`,
                                        '&:hover': {
                                          background: alpha(statusConfig.color, 0.1),
                                          borderColor: statusConfig.color,
                                        }
                                      }}
                                    >
                                      {TEXT_CONFIG.buttons.view}
                                    </Button>
                                  </Box>
                                </GlassCard>
                              </motion.div>
                            </Grid>
                          ))}
                        </Grid>
                      </Collapse>
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        </motion.div>
      </Container>

      {/* New Project Modal - only shown when explicitly opened */}
      <NewProjectModal 
        open={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        setIsFirstTime={() => {}}
      />

      {/* Project Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            background: isLightTheme ? '#ffffff' : alpha(colors.glassWhite, 0.1),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${borderColor}`,
          }
        }}
      >
        <MenuItem onClick={handleViewProject}>
          View
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DashboardContent; 