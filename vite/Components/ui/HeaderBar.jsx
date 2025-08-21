import React from 'react';
import { AppBar, Toolbar, Box, Typography, Stack, Button, alpha } from '@mui/material';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import MobileMenu from './MobileMenu';
import { useDataLayer } from '../../Context/DataLayer';
import { useTheme } from '../../Context/ThemeContext';

const HeaderBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isAuthenticated, user } = useDataLayer();
  const { fonts, colors, gradients } = useTheme();
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Spotlight', path: '/spotlight' },
    { label: 'Shop', path: '/shop' },
    { label: 'Care Guide', path: '/care-guide' },
    { label: 'Booking', path: '/booking' },
    { label: 'About', path: '/about'},
    { label: 'Contact', path: '/contact' },
  ];

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
            <Star sx={{ fontSize: 20, color: colors.accent }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold', 
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: fonts.brand,
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                filter: 'drop-shadow(0 1px 2px rgba(246, 81, 30, 0.3))',
              }}
            >
              Buster & Co.
            </Typography>
            <Star sx={{ fontSize: 16, color: colors.primary }} />
          </Box>
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