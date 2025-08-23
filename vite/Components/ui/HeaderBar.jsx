import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Box, Typography, Stack, Button, alpha } from '@mui/material';
import { Star, Bolt, TrendingUp, FiberManualRecord } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/red-blob.json';
import MobileMenu from './MobileMenu';
import { useDataLayer } from '../../Context/DataLayer';
import { useTheme } from '../../Context/ThemeContext';

const HeaderBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated, user } = useDataLayer();
  const { fonts, colors, gradients } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about'},
    { label: 'Book Demo', path: '/booking' },
    { label: 'Support', path: '/support' },
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time to display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Get dashboard path based on user type
  const getDashboardPath = () => {
    return '/layout/dashboard';
  };

  return (
    <>
    <AppBar 
      position="fixed" 
      component="header"
      aria-label="Main navigation"
      elevation={0}
      sx={{ 
        top: 0,
        left: 0,
        right: 0,
        background: `linear-gradient(135deg, ${alpha(colors.background, 0.95)}, ${alpha(colors.surface, 0.9)})`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(colors.primary, 0.2)}`,
        boxShadow: `0 8px 32px ${alpha(colors.primary, 0.2)}`,
        zIndex: 1300,
        height: '64px',
        position: 'fixed',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -30,
          right: -30,
          width: 80,
          height: 80,
          background: gradients.primaryGradient,
          borderRadius: '50%',
          opacity: 0.15,
          filter: 'blur(25px)',
          animation: 'pulse 6s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.15 },
            '50%': { transform: 'scale(1.3)', opacity: 0.25 },
          },
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 60,
          height: 60,
          background: gradients.accentGradient,
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(20px)',
          animation: 'pulse 8s ease-in-out infinite',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', height: '100%', position: 'relative', zIndex: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            background: alpha(colors.glassWhite, 0.05),
            backdropFilter: 'blur(10px)',
            // border: `1px solid ${alpha(colors.primary, 0.2)}`,
            borderRadius: 2,
            px: 2,
            py: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: alpha(colors.glassWhite, 0.1),
              border: `1px solid ${alpha(colors.primary, 0.4)}`,
              transform: 'scale(1.02)',
              boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
            }
          }}
          component={RouterLink}
          to="/"
          style={{ textDecoration: 'none' }}
          role="banner"
        >
          <Box sx={{ 
            width: 40, 
            height: 40, 
            mr: 1,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -3,
              background: gradients.accentGradient,
              borderRadius: '50%',
              opacity: 0.3,
              filter: 'blur(8px)',
              animation: 'glow 3s ease-in-out infinite',
              '@keyframes glow': {
                '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                '50%': { opacity: 0.6, transform: 'scale(1.1)' },
              },
            }
          }}>
            <Lottie 
              animationData={verificationAnimation} 
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '90%', position: 'relative', zIndex: 1 }}
              aria-hidden="true"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 900, 
                background: 'linear-gradient(90deg, #4A90FF 0%, #7B68EE 50%, #4A90FF 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
                fontSize: { xs: '1.4rem', sm: '1.8rem', md: '2rem' },
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                textShadow: '0 0 40px rgba(74, 144, 255, 0.5)',
                filter: 'drop-shadow(0 0 20px rgba(123, 104, 238, 0.4))',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #4A90FF, #7B68EE, transparent)',
                  opacity: 0.6,
                },
              }}
            >
              BLACKCORE AI
            </Typography>
           
          </Box>
        </Box>

        {/* Operational Status Indicator */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 2,
            px: 2,
            py: 0.75,
            background: alpha(colors.glassWhite, 0.03),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: `1px solid ${alpha(colors.primary, 0.1)}`,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: alpha(colors.glassWhite, 0.06),
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FiberManualRecord 
              sx={{ 
                fontSize: 10, 
                color: '#4CAF50',
                filter: 'drop-shadow(0 0 6px #4CAF50)',
                animation: 'pulse-green 2s ease-in-out infinite',
                '@keyframes pulse-green': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.6 },
                },
              }} 
            />
            <Typography
              sx={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: alpha('#ffffff', 0.7),
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Operational
            </Typography>
          </Box>
          
          <Box
            sx={{
              height: 16,
              width: 1,
              background: alpha(colors.primary, 0.2),
            }}
          />
          
          <Typography
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: alpha('#ffffff', 0.9),
              fontFamily: '"Roboto Mono", monospace',
              letterSpacing: '0.02em',
              minWidth: '110px',
              textAlign: 'right',
            }}
          >
            {formatTime(currentTime)}
          </Typography>
        </Box>
        
        <Stack 
          direction="row" 
          spacing={2} 
          component="nav"
          aria-label="Main menu"
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
        >
          {navItems.map((item) => {
            const isActive = 
              (item.path === '/' && currentPath === '/') || 
              (item.path !== '/' && currentPath.startsWith(item.path));
              
            return (
              <Box
                key={item.label}
                component={RouterLink}
                to={item.path}
                sx={{
                  textDecoration: 'none',
                  position: 'relative',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: isActive ? alpha(colors.glassWhite, 0.1) : 'transparent',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                  border: isActive 
                    ? `1px solid ${alpha(colors.accent, 0.3)}` 
                    : `1px solid transparent`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: alpha(colors.glassWhite, 0.15),
                    backdropFilter: 'blur(15px)',
                    border: `1px solid ${alpha(colors.primary, 0.4)}`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(colors.primary, 0.3)}`,
                  },
                  '&:focus': {
                    outline: `2px solid ${colors.accent}`,
                    outlineOffset: '2px',
                  },
                  '&::before': isActive ? {
                    content: '""',
                    position: 'absolute',
                    bottom: -1,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '2px',
                    background: gradients.accentGradient,
                    borderRadius: '2px',
                    animation: 'glow-line 2s ease-in-out infinite',
                    '@keyframes glow-line': {
                      '0%, 100%': { opacity: 0.7, transform: 'translateX(-50%) scaleX(1)' },
                      '50%': { opacity: 1, transform: 'translateX(-50%) scaleX(1.2)' },
                    },
                  } : {},
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Typography 
                  sx={{ 
                    color: isActive ? '#ffffff' : alpha('#ffffff', 0.8),
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    textShadow: isActive 
                      ? `0 0 10px ${colors.accent}` 
                      : '0 1px 2px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#ffffff',
                      textShadow: `0 0 15px ${colors.primary}`,
                    }
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
          
          {!isAuthenticated ? (
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="small"
              startIcon={<Bolt />}
              sx={{
                color: '#ffffff',
                background: alpha(colors.glassWhite, 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.accent, 0.3)}`,
                borderRadius: 2,
                py: 0.5,
                px: 2,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                ml: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.glassWhite, 0.15),
                  border: `1px solid ${alpha(colors.accent, 0.6)}`,
                  color: colors.accent,
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 20px ${alpha(colors.accent, 0.4)}`,
                  textShadow: `0 0 10px ${colors.accent}`,
                }
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to={getDashboardPath()}
              variant="contained"
              startIcon={<TrendingUp />}
              sx={{
                background: gradients.multiGradient,
                backgroundSize: '200% 200%',
                color: '#ffffff',
                fontWeight: 'bold',
                borderRadius: 2,
                px: 3,
                py: 1,
                ml: 2,
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                animation: 'gradient-shift 4s ease infinite',
                '@keyframes gradient-shift': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
                '&:hover': {
                  background: gradients.glowGradient,
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 25px ${alpha(colors.secondary, 0.6)}`,
                },
                transition: 'all 0.3s ease',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Dashboard
            </Button>
          )}
        </Stack>
        
        <MobileMenu 
          navItems={navItems} 
          showLoginButton={!isAuthenticated}
          showDashboardButton={isAuthenticated}
          dashboardPath={getDashboardPath()}
        />
      </Toolbar>
    </AppBar>
    
    {/* Spacer to prevent content from hiding behind fixed header */}
    <Box sx={{ height: '64px' }} />
    </>
  );
};

export default HeaderBar; 