// AppHeader.jsx
import React, { useState, useEffect, useMemo } from "react";
import { 
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  useTheme as useMuiTheme,
  useMediaQuery,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  ListItemIcon,
  Alert,
  Button,
  Badge,
  alpha
} from "@mui/material";

// Import MUI icons
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import PetsIcon from "@mui/icons-material/Pets";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import WarningIcon from "@mui/icons-material/Warning";
import SecurityIcon from "@mui/icons-material/Security";
import Star from "@mui/icons-material/Star";
import SupportIcon from "@mui/icons-material/Support";

// Import from your custom contexts and hooks
import { useTheme } from "../../Context/ThemeContext";
import { useSidebar } from "../../Context/SideBarContext";
import { useDataLayer } from "../../Context/DataLayer";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import { useStaffAuth } from "../../hooks/useAuth";

const AppHeader = ({ isStaff }) => {
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar, isMobile, isExpanded } = useSidebar();
  const muiTheme = useMuiTheme();
  const { colors, gradients, fonts, glassmorphism, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  

  
  // Conditionally use the appropriate auth hook based on isStaff prop
  const customerAuth = isStaff ? null : useCustomerAuth();
  const staffAuth = isStaff ? useStaffAuth() : null;
  


  // Extract the needed values based on which auth is being used
  const customer = isStaff ? null : customerAuth?.customer;
  const user = isStaff ? staffAuth?.user : null;
  const signOut = isStaff ? staffAuth?.signOut : customerAuth?.signOut;
  const refreshData = isStaff ? staffAuth?.refreshUser : customerAuth?.refreshCustomer;



  const { 
    getUserInitials, 
    getDisplayName, 
    notifications,
    notificationsVersion, // This will trigger re-renders when notifications change
    removeNotification,
    clearNotificationsByType,
    getNotificationsByType,
    hasNotificationType
  } = useDataLayer();

  // For theme toggle
  const isDarkMode = theme === 'dark';
  
  // Theme-aware colors
  const isLightTheme = theme === 'light';
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const textDisabled = isLightTheme ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.5)';
  const backgroundPaper = isLightTheme ? '#ffffff' : colors.background;
  const backgroundDefault = isLightTheme ? '#f5f5f5' : colors.surface;
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);

  // For notification dropdown
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const openNotificationMenu = Boolean(notificationAnchorEl);
  
  // For user dropdown
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const openUserMenu = Boolean(userAnchorEl);
  
  // For temporary password notification from DataLayer - memoized to prevent unnecessary calls
  const tempPasswordNotifications = useMemo(() => {
    return getNotificationsByType('temp-password');
  }, [getNotificationsByType, notificationsVersion]); // Only recalculate when notifications change
  
  const hasTempPasswordNotification = tempPasswordNotifications.length > 0;
  const tempPasswordNotification = tempPasswordNotifications[0]; // Get the first one
  const [showPasswordAlert, setShowPasswordAlert] = useState(true); // Default to show if notification exists
  
  // Debug logging - only log when values actually change
  useEffect(() => {
    console.log('AppHeader - Temp password notifications:', tempPasswordNotifications);
    console.log('AppHeader - Has temp password notification:', hasTempPasswordNotification);
    console.log('AppHeader - Notifications version:', notificationsVersion);
  }, [tempPasswordNotifications, hasTempPasswordNotification, notificationsVersion]);
  
  // Always show alert if temp password notification exists and user hasn't dismissed it
  useEffect(() => {
    if (hasTempPasswordNotification && !showPasswordAlert) {
      setShowPasswordAlert(true);
    }
  }, [hasTempPasswordNotification, notificationsVersion]); // Re-check when notifications change
  
  // Check for legacy temp password in sessionStorage on mount (for backwards compatibility)
  useEffect(() => {
    const tempData = sessionStorage.getItem('tempAuthData');
    if (tempData && !hasTempPasswordNotification) {
      try {
        const parsedData = JSON.parse(tempData);
        // Migration: move from sessionStorage to DataLayer if not already there
        console.log('Migrating temp password from sessionStorage to DataLayer');
        sessionStorage.removeItem('tempAuthData');
      } catch (error) {
        console.error('Error parsing temp auth data:', error);
      }
    }
  }, [hasTempPasswordNotification]);

  // Get customer data from navigation state (for immediate display after sign-in)
  const navigationCustomerData = location.state?.customerData;
  const justSignedIn = location.state?.justSignedIn;

  console.log("location state: ", location);
  
  // Use navigation data if available and customer/user data hasn't loaded yet
  const displayCustomer = customer || (justSignedIn && navigationCustomerData);
  const displayUser = user || displayCustomer;  // For staff, use user data; fallback to customer data
  
  // Refresh data after sign-in
  useEffect(() => {
    if (justSignedIn && !customer && !user && refreshData) {
      console.log('AppHeader - Just signed in, refreshing data...');
      refreshData();
    }
  }, [justSignedIn, customer, user, refreshData]);

  const handleToggle = () => {
    // Use isMobile from SideBarContext to ensure consistency
    if (isMobile) {
      // Mobile: toggle mobile sidebar
      toggleMobileSidebar();
    } else {
      // Desktop: toggle regular sidebar
      toggleSidebar();
    }
  };
  
  // Handle dismissing the password alert
  const handleDismissPasswordAlert = () => {
    setShowPasswordAlert(false);
    // Don't remove from sessionStorage yet - user might refresh
  };
  
  // Handle navigating to change password
  const handleChangePassword = () => {
    navigate('/dashboard/settings');
    setShowPasswordAlert(false);
    // Clear the temp password notifications from DataLayer
    clearNotificationsByType('temp-password');
    // Also clear from sessionStorage for backwards compatibility
    sessionStorage.removeItem('tempAuthData');
  };

  // Notification handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  // User dropdown handlers
  const handleUserMenuClick = (event) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  // Navigation handlers
  const handleNavigate = (path) => {
    navigate(path);
    handleUserMenuClose();
  };

  // Logout handler using Clerk
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      {/* Enhanced Temporary Password Alert */}
      {showPasswordAlert && hasTempPasswordNotification && tempPasswordNotification && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            p: 2,
            background: alpha(colors.primary, 0.1),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(colors.primary, 0.3)}`,
            boxShadow: `0 -8px 32px ${alpha(colors.primary, 0.4)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ color: colors.primary, mr: 2, fontSize: 24 }} />
              <Box>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: fonts.heading,
                  }}
                >
                  {tempPasswordNotification.title || 'Welcome! Your account was created with a temporary password'}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mt: 0.5,
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: fonts.body,
                  }}
                >
                  {tempPasswordNotification.message || 'For security, please change your password immediately.'} 
                  {tempPasswordNotification.data?.tempPassword && (
                    <> Your temporary password is: <strong>{tempPasswordNotification.data.tempPassword}</strong></>
                  )}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small" 
                variant="contained"
                onClick={handleChangePassword}
                sx={{ 
                  background: gradients.primaryGradient,
                  color: '#ffffff',
                  fontWeight: 'bold',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 4px 16px ${alpha(colors.primary, 0.4)}`,
                  }
                }}
              >
                Change Password
              </Button>
              <Button 
                size="small" 
                onClick={handleDismissPasswordAlert}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    background: alpha(colors.glassWhite, 0.1),
                  }
                }}
              >
                Later
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* Enhanced AppBar with glassmorphism */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: isLightTheme ? alpha(backgroundPaper, 0.95) : alpha(colors.glassWhite, 0.1),
          backdropFilter: 'blur(20px)',
          border: `1px solid ${borderColor}`,
          boxShadow: isLightTheme ? `0 8px 32px ${alpha(colors.primary, 0.1)}` : `0 8px 32px ${alpha(colors.primary, 0.3)}`,
          zIndex: 1100,
          top: 0,
          left: 'auto', // Respect container's positioning
          right: 0,
          width: '100%', // Take full width of its container
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradients.shimmerGradient,
            opacity: 0.1,
            animation: 'shimmer 3s ease-in-out infinite',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' },
            },
          },
        }}
      >
        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          minHeight: '64px', 
          px: { xs: 2, md: 3 },
          position: 'relative',
          zIndex: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Enhanced Sidebar Toggle Button */}
            <IconButton
              color="inherit"
              aria-label="Toggle Sidebar"
              onClick={handleToggle}
              edge="start"
              sx={{ 
                mr: 2,
                background: isLightTheme ? alpha(colors.accent, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                color: isLightTheme ? colors.accent : textPrimary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.accent, 0.2),
                  color: colors.accent,
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${alpha(colors.accent, 0.3)}`,
                }
              }}
            >
              {isMobileOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>

          {/* Enhanced Logo and Title */}
          { !isExpanded && !isMobile && 
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  display: isMobile ? 'none' : 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.15),
                  backdropFilter: 'blur(15px)',
                  border: `2px solid ${alpha(colors.lottieGreen, 0.4)}`,
                  mr: 1,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    left: -4,
                    right: -4,
                    bottom: -4,
                    background: gradients.accentGradient,
                    borderRadius: '50%',
                    opacity: 0.3,
                    animation: 'logoGlow 4s ease-in-out infinite',
                    '@keyframes logoGlow': {
                      '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.05)' },
                    },
                  },
                }}
              >
                <PetsIcon sx={{ 
                  color: colors.lottieGreen, 
                  fontSize: 28,
                  filter: `drop-shadow(0 2px 4px ${alpha(colors.lottieGreen, 0.5)})`,
                  position: 'relative',
                  zIndex: 2,
                }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: { xs: 0, sm: 1 }, 
                  fontWeight: 600,
                  fontFamily: fonts.brand,
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))',
                }}
              >
                Buster & Co
              </Typography>
            </Box>
          }
          </Box>

          {/* Enhanced Right side menu items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Enhanced Quick Actions */}
            <IconButton
              color="inherit"
              aria-label="Support"
              onClick={() => navigate('/layout/support')}
              sx={{ 
                display: { xs: 'none', sm: 'inline-flex' },
                background: isLightTheme ? alpha(colors.lottieGreen, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.lottieGreen, 0.2)}`,
                color: isLightTheme ? colors.lottieGreen : textPrimary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.lottieGreen, 0.2),
                  color: colors.lottieGreen,
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${alpha(colors.lottieGreen, 0.3)}`,
                }
              }}
            >
              <SupportIcon />
            </IconButton>

            <IconButton
              color="inherit"
              aria-label="Gift Cards"
              onClick={() => navigate('/layout/shop')}
              sx={{ 
                display: { xs: 'none', sm: 'inline-flex' },
                background: isLightTheme ? alpha(colors.lottieGreen, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.lottieGreen, 0.2)}`,
                color: isLightTheme ? colors.lottieGreen : textPrimary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.lottieGreen, 0.2),
                  color: colors.lottieGreen,
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${alpha(colors.lottieGreen, 0.3)}`,
                }
              }}
            >
              <CardGiftcardIcon />
            </IconButton>

            {/* Enhanced Theme Toggle */}
            <IconButton 
              color="inherit" 
              onClick={toggleTheme}
              sx={{ 
                background: isLightTheme ? alpha(colors.accent, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                color: isLightTheme ? colors.accent : textPrimary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.accent, 0.2),
                  color: colors.accent,
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${alpha(colors.accent, 0.3)}`,
                }
              }}
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Enhanced Notifications */}
            <IconButton
              color="inherit"
              aria-label="Notifications"
              onClick={handleNotificationClick}
              sx={{ 
                background: isLightTheme ? alpha(colors.secondary, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.secondary, 0.2)}`,
                color: isLightTheme ? colors.secondary : textPrimary,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.secondary, 0.2),
                  color: colors.secondary,
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 16px ${alpha(colors.secondary, 0.3)}`,
                }
              }}
            >
              <Badge 
                badgeContent={hasTempPasswordNotification && showPasswordAlert ? 1 : 0} 
                color="warning"
                sx={{
                  '& .MuiBadge-badge': {
                    background: gradients.primaryGradient,
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Enhanced Notification Menu */}
            <Menu
              anchorEl={notificationAnchorEl}
              open={openNotificationMenu}
              onClose={handleNotificationClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  width: 320,
                  maxHeight: 450,
                  mt: 1.5,
                  background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.12),
                  backdropFilter: 'blur(25px)',
                  border: `1px solid ${borderColor}`,
                  boxShadow: isLightTheme ? `0 20px 60px ${alpha(colors.secondary, 0.1)}` : `0 20px 60px ${alpha(colors.secondary, 0.4)}`,
                  borderRadius: 3,
                  overflow: 'auto',
                  '& .MuiList-root': {
                    padding: 1
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                <Typography sx={{ 
                  fontWeight: 500,
                  color: textPrimary,
                  fontFamily: fonts.heading,
                }}>
                  Notifications
                </Typography>
                <Star sx={{ 
                  color: colors.accent, 
                  ml: 1,
                  fontSize: 16,
                  animation: 'starTwinkle 2s ease-in-out infinite',
                  '@keyframes starTwinkle': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                  },
                }} />
              </Box>
              <Divider sx={{ borderColor: borderColor }} />
              {hasTempPasswordNotification && showPasswordAlert && tempPasswordNotification && (
                <MenuItem 
                  onClick={() => {
                    handleChangePassword();
                    handleNotificationClose();
                  }}
                  sx={{ 
                    background: alpha(colors.primary, 0.1),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    borderRadius: 2,
                    m: 1,
                    '&:hover': { 
                      background: alpha(colors.primary, 0.2),
                      transform: 'scale(1.02)',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <WarningIcon sx={{ fontSize: 20, mr: 1, mt: 0.5, color: colors.primary }} />
                    <Box>
                      <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        color: textPrimary,
                        fontFamily: fonts.body,
                      }}>
                        {tempPasswordNotification.title}
                      </Typography>
                      <Typography variant="caption" sx={{ 
                        display: 'block', 
                        mt: 0.5,
                        color: textSecondary,
                        fontFamily: fonts.body,
                      }}>
                        {tempPasswordNotification.message.substring(0, 50)}... Click to change password.
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              )}
              {hasTempPasswordNotification && showPasswordAlert && <Divider sx={{ borderColor: borderColor }} />}
              <MenuItem 
                onClick={handleNotificationClose}
                sx={{
                  background: isLightTheme ? alpha(colors.lottieGreen, 0.05) : alpha(colors.glassWhite, 0.05),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  m: 1,
                  '&:hover': {
                    background: alpha(colors.lottieGreen, 0.1),
                  }
                }}
              >
                <Typography variant="body2" sx={{ 
                  color: textPrimary,
                  fontFamily: fonts.body,
                }}>
                  <PetsIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle', color: colors.lottieGreen }} />
                  Your next grooming appointment is tomorrow!
                </Typography>
              </MenuItem>
            </Menu>

            {/* Enhanced User Profile */}
            <Box 
              onClick={handleUserMenuClick}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                borderRadius: 2,
                padding: '6px 12px',
                background: isLightTheme ? alpha(colors.accent, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: alpha(colors.accent, 0.2),
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 16px ${alpha(colors.accent, 0.3)}`,
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  background: gradients.accentGradient,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.9rem',
                  border: `2px solid ${alpha(colors.accent, 0.4)}`,
                  boxShadow: `0 4px 16px ${alpha(colors.accent, 0.3)}`,
                }}
              >
                {getUserInitials(displayUser)}
              </Avatar>
              <Typography sx={{ 
                ml: 1, 
                display: { xs: 'none', sm: 'block' }, 
                fontWeight: 500,
                color: textPrimary,
                fontFamily: fonts.body,
              }}>
                {getDisplayName(displayUser)}
              </Typography>
            </Box>

            {/* Enhanced User Menu */}
            <Menu
              anchorEl={userAnchorEl}
              open={openUserMenu}
              onClose={handleUserMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  width: 220,
                  mt: 1.5,
                  background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.12),
                  backdropFilter: 'blur(25px)',
                  border: `1px solid ${borderColor}`,
                  boxShadow: isLightTheme ? `0 20px 60px ${alpha(colors.accent, 0.1)}` : `0 20px 60px ${alpha(colors.accent, 0.4)}`,
                  borderRadius: 3,
                  '& .MuiList-root': {
                    padding: 1
                  }
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem 
                onClick={() => handleNavigate('/dashboard/profile')}
                sx={{
                  background: isLightTheme ? alpha(colors.secondary, 0.05) : alpha(colors.glassWhite, 0.05),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  m: 0.5,
                  '&:hover': {
                    background: alpha(colors.secondary, 0.1),
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: colors.secondary }} />
                </ListItemIcon>
                <Typography sx={{ color: textPrimary, fontFamily: fonts.body }}>
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem 
                onClick={() => handleNavigate('/dashboard/settings')}
                sx={{
                  background: isLightTheme ? alpha(colors.accent, 0.05) : alpha(colors.glassWhite, 0.05),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  m: 0.5,
                  '&:hover': {
                    background: alpha(colors.accent, 0.1),
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" sx={{ color: colors.accent }} />
                </ListItemIcon>
                <Typography sx={{ color: textPrimary, fontFamily: fonts.body }}>
                  Settings
                </Typography>
              </MenuItem>
              <Divider sx={{ borderColor: borderColor, my: 1 }} />
              <MenuItem 
                onClick={handleLogout}
                sx={{
                  background: isLightTheme ? alpha('#ff5252', 0.05) : alpha(colors.glassWhite, 0.05),
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  m: 0.5,
                  '&:hover': {
                    background: alpha('#ff5252', 0.1),
                    transform: 'scale(1.02)',
                  }
                }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" sx={{ color: '#ff5252' }} />
                </ListItemIcon>
                <Typography sx={{ color: textPrimary, fontFamily: fonts.body }}>
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppHeader;