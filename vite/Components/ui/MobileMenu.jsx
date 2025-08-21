import React, { useState, useEffect, useRef } from 'react';
import { 
  Drawer, 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Typography,
  Divider,
  Button,
  alpha
} from '@mui/material';
import { Star, Bolt, TrendingUp, Menu, Close } from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';

const MobileMenu = ({ navItems, showLoginButton, showDashboardButton, dashboardPath }) => {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const { colors, gradients, fonts } = useTheme();

  useEffect(() => {
    if (animationRef.current) {
      if (open) {
        // animate to X
        animationRef.current.style.transform = 'rotate(90deg)';
        animationRef.current.querySelectorAll('span').forEach((span, index) => {
          if (index === 0) span.style.transform = 'translateY(8px) rotate(45deg)';
          if (index === 1) span.style.opacity = '0';
          if (index === 2) span.style.transform = 'translateY(-8px) rotate(-45deg)';
        });
      } else {
        // animate to hamburger
        animationRef.current.style.transform = 'rotate(0deg)';
        animationRef.current.querySelectorAll('span').forEach((span, index) => {
          span.style.transform = 'none';
          span.style.opacity = '1';
        });
      }
    }
  }, [open]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label={open ? "close menu" : "open menu"}
        onClick={toggleDrawer}
        sx={{ 
          display: { xs: 'flex', md: 'none' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 48,
          height: 48,
          position: 'relative',
          background: alpha(colors.glassWhite, 0.1),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(colors.primary, 0.3)}`,
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            background: alpha(colors.glassWhite, 0.2),
            border: `1px solid ${alpha(colors.primary, 0.5)}`,
            transform: 'scale(1.05)',
            boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: -2,
            background: gradients.primaryGradient,
            borderRadius: 2,
            opacity: 0,
            transition: 'opacity 0.3s ease',
            zIndex: -1,
          },
          '&:hover::before': {
            opacity: 0.1,
          }
        }}
      >
        <Box 
          ref={animationRef}
          sx={{ 
            width: 28, 
            height: 28, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            transition: 'transform 0.3s ease-in-out'
          }}
        >
          <span style={{
            display: 'block',
            width: '100%',
            height: '3px',
            background: gradients.primaryGradient,
            borderRadius: '3px',
            transition: 'transform 0.3s ease-in-out, opacity 0.2s ease-in-out',
            boxShadow: `0 0 8px ${alpha(colors.primary, 0.4)}`
          }}></span>
          <span style={{
            display: 'block',
            width: '100%',
            height: '3px',
            background: gradients.accentGradient,
            borderRadius: '3px',
            transition: 'opacity 0.2s ease-in-out',
            boxShadow: `0 0 8px ${alpha(colors.accent, 0.4)}`
          }}></span>
          <span style={{
            display: 'block',
            width: '100%',
            height: '3px',
            background: gradients.primaryGradient,
            borderRadius: '3px',
            transition: 'transform 0.3s ease-in-out',
            boxShadow: `0 0 8px ${alpha(colors.primary, 0.4)}`
          }}></span>
        </Box>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer}
        sx={{
          '& .MuiDrawer-paper': { 
            width: 320, 
            background: gradients.darkGlass,
            backdropFilter: 'blur(20px)',
            boxSizing: 'border-box',
            color: '#ffffff',
            border: `1px solid ${alpha(colors.primary, 0.2)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -60,
              right: -60,
              width: 120,
              height: 120,
              background: gradients.primaryGradient,
              borderRadius: '50%',
              opacity: 0.2,
              filter: 'blur(40px)',
              animation: 'pulse 8s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.2 },
                '50%': { transform: 'scale(1.3)', opacity: 0.4 },
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -40,
              left: -40,
              width: 100,
              height: 100,
              background: gradients.accentGradient,
              borderRadius: '50%',
              opacity: 0.15,
              filter: 'blur(35px)',
              animation: 'pulse 6s ease-in-out infinite',
            },
          },
        }}
      >
        <Box
          sx={{ width: '100%', p: 3, position: 'relative', zIndex: 1 }}
          role="presentation"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Star sx={{ fontSize: 24, color: colors.accent }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: gradients.accentGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: fonts.heading,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Menu
            </Typography>
            <Star sx={{ fontSize: 20, color: colors.primary }} />
          </Box>
          <Box
            sx={{
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${alpha(colors.primary, 0.4)}, ${alpha(colors.accent, 0.6)}, ${alpha(colors.secondary, 0.4)}, transparent)`,
              borderRadius: '2px',
              mb: 2,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -1,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 40,
                height: 4,
                background: gradients.multiGradient,
                borderRadius: 2,
                filter: 'blur(2px)',
                opacity: 0.8,
              },
            }}
          />
          <List>
            {navItems.map((item, index) => {
              const isActive = 
                (item.path === '/' && currentPath === '/') || 
                (item.path !== '/' && currentPath.startsWith(item.path));
                
              return (
                <ListItem 
                  key={item.label} 
                  disablePadding
                  component={RouterLink}
                  to={item.path}
                  onClick={toggleDrawer}
                  sx={{ 
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    borderRadius: 2,
                    textDecoration: 'none',
                    background: isActive 
                      ? alpha(colors.glassWhite, 0.15) 
                      : alpha(colors.glassWhite, 0.05),
                    backdropFilter: 'blur(10px)',
                    border: isActive 
                      ? `1px solid ${alpha(colors.accent, 0.4)}` 
                      : `1px solid ${alpha(colors.glassWhite, 0.1)}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      background: alpha(colors.glassWhite, 0.2),
                      border: `1px solid ${alpha(colors.primary, 0.5)}`,
                      transform: 'translateX(8px)',
                      boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
                    },
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: gradients.accentGradient,
                      borderRadius: '0 2px 2px 0',
                      animation: 'glow-pulse 2s ease-in-out infinite',
                      '@keyframes glow-pulse': {
                        '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.accent, 0.5)}` },
                        '50%': { boxShadow: `0 0 20px ${alpha(colors.accent, 0.8)}` },
                      },
                    } : {},
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontSize: '1.1rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? '#ffffff' : alpha('#ffffff', 0.9),
                      textShadow: isActive 
                        ? `0 0 15px ${colors.accent}` 
                        : '0 1px 2px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                  {isActive && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Star sx={{ fontSize: 16, color: colors.accent }} />
                      <Box 
                        sx={{ 
                          width: 8, 
                          height: 8,
                          background: gradients.accentGradient,
                          borderRadius: '50%',
                          animation: 'pulse-dot 1.5s ease-in-out infinite',
                          '@keyframes pulse-dot': {
                            '0%, 100%': { transform: 'scale(1)', opacity: 0.8 },
                            '50%': { transform: 'scale(1.3)', opacity: 1 },
                          },
                        }}
                      />
                    </Box>
                  )}
                </ListItem>
              );
            })}
          </List>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Box
              sx={{
                height: '2px',
                background: `linear-gradient(90deg, transparent, ${alpha(colors.primary, 0.4)}, ${alpha(colors.accent, 0.6)}, ${alpha(colors.secondary, 0.4)}, transparent)`,
                borderRadius: '2px',
                mb: 3,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -1,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 4,
                  background: gradients.multiGradient,
                  borderRadius: 2,
                  filter: 'blur(2px)',
                  opacity: 0.8,
                },
              }}
            />
            {showLoginButton && (
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={toggleDrawer}
                startIcon={<Bolt />}
                sx={{
                  color: '#ffffff',
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.accent, 0.4)}`,
                  borderRadius: 2,
                  py: 1,
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha(colors.glassWhite, 0.2),
                    border: `1px solid ${alpha(colors.accent, 0.6)}`,
                    color: colors.accent,
                    transform: 'scale(1.02)',
                    boxShadow: `0 0 25px ${alpha(colors.accent, 0.4)}`,
                    textShadow: `0 0 10px ${colors.accent}`,
                  }
                }}
              >
                Login
              </Button>
            )}
            
            {showDashboardButton && (
              <Button
                component={RouterLink}
                to={dashboardPath || '/dashboard'}
                variant="contained"
                fullWidth
                onClick={toggleDrawer}
                startIcon={<TrendingUp />}
                sx={{
                  background: gradients.multiGradient,
                  backgroundSize: '200% 200%',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  py: 1.5,
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                  animation: 'gradient-shift 4s ease infinite',
                  '@keyframes gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                  '&:hover': {
                    background: gradients.glowGradient,
                    transform: 'scale(1.02)',
                    boxShadow: `0 0 30px ${alpha(colors.secondary, 0.6)}`,
                  },
                  transition: 'all 0.3s ease',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                Dashboard
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileMenu; 