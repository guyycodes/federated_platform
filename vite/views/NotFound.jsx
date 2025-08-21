import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  Button,
  alpha
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import StarIcon from '@mui/icons-material/Star';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import { useTheme } from '../Context/ThemeContext';

const NotFound = () => {
  const { colors, gradients, fonts, glassmorphism } = useTheme();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <HeaderBar />
      
      <Box
        sx={{
          py: 12,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          background: gradients.darkGlass,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: 180,
            height: 180,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.4,
            animation: 'notFoundPulse 4s ease-in-out infinite',
            '@keyframes notFoundPulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
              '50%': { transform: 'scale(1.2)', opacity: 0.6 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '10%',
            width: 140,
            height: 140,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.3,
            animation: 'notFoundPulse 5.5s ease-in-out infinite 1.5s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '45%',
            left: '5%',
            width: 100,
            height: 100,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.25,
            animation: 'notFoundPulse 6s ease-in-out infinite 3s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '25%',
            right: '45%',
            width: 60,
            height: 60,
            background: gradients.glowGradient,
            borderRadius: '50%',
            opacity: 0.2,
            animation: 'notFoundPulse 7s ease-in-out infinite 2s',
          }}
        />

        <Container maxWidth="md">
          {/* Main glassmorphism container */}
          <Box
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 4,
              background: alpha(colors.glassWhite, 0.12),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(colors.primary, 0.3)}`,
              boxShadow: `0 25px 80px ${alpha(colors.primary, 0.4)}`,
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: `0 35px 100px ${alpha(colors.primary, 0.5)}`,
              },
            }}
          >
            {/* Enhanced PetsIcon with glass container */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: alpha(colors.glassWhite, 0.15),
                backdropFilter: 'blur(15px)',
                border: `2px solid ${alpha(colors.accent, 0.4)}`,
                mb: 4,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -8,
                  left: -8,
                  right: -8,
                  bottom: -8,
                  background: gradients.accentGradient,
                  borderRadius: '50%',
                  opacity: 0.3,
                  animation: 'iconGlow 3s ease-in-out infinite',
                  '@keyframes iconGlow': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.05)' },
                  },
                },
              }}
            >
              <PetsIcon 
                sx={{ 
                  fontSize: 70,
                  color: colors.accent,
                  filter: `drop-shadow(0 4px 8px ${alpha(colors.accent, 0.5)})`,
                  position: 'relative',
                  zIndex: 2,
                }} 
              />
            </Box>
            
            {/* Enhanced 404 heading with gradient text */}
            <Typography 
              variant="h1" 
              component="h1" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                fontSize: { xs: '4rem', md: '6rem' },
                fontFamily: fonts.heading,
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 8px rgba(246, 81, 30, 0.5))',
                mb: 2,
                animation: 'textPulse 3s ease-in-out infinite',
                '@keyframes textPulse': {
                  '0%, 100%': { filter: 'drop-shadow(0 4px 8px rgba(246, 81, 30, 0.5))' },
                  '50%': { filter: 'drop-shadow(0 6px 12px rgba(246, 81, 30, 0.8))' },
                },
              }}
            >
              404
            </Typography>
            
            {/* Enhanced subtitle with star decorations */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <StarIcon 
                sx={{ 
                  color: colors.accent, 
                  mr: 2,
                  animation: 'starTwinkle 2s ease-in-out infinite',
                  '@keyframes starTwinkle': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                  },
                }} 
              />
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: fonts.heading,
                  fontWeight: 'medium',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Page Not Found
              </Typography>
              <StarIcon 
                sx={{ 
                  color: colors.accent, 
                  ml: 2,
                  animation: 'starTwinkle 2s ease-in-out infinite 1s',
                }} 
              />
            </Box>
            
            {/* Enhanced description text */}
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 5, 
                maxWidth: 600, 
                mx: 'auto',
                color: 'rgba(255,255,255,0.8)',
                fontFamily: fonts.body,
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.6,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              Looks like this page took a walk and got lost! Don't worry though - 
              let's get you back on track to find exactly what you're looking for.
            </Typography>
            
            {/* Enhanced action buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 3, 
              flexWrap: 'wrap',
              '& > *': {
                minWidth: { xs: '100%', sm: 'auto' },
              }
            }}>
              <Button
                component={RouterLink}
                to="/"
                variant="contained"
                size="large"
                sx={{ 
                  background: gradients.multiGradient,
                  backgroundSize: '200% 200%',
                  color: '#ffffff',
                  py: 1.8,
                  px: 5,
                  fontWeight: 'bold',
                  fontFamily: fonts.body,
                  borderRadius: 3,
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'gradient-shift 4s ease infinite',
                  '@keyframes gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: `0 15px 40px ${alpha(colors.secondary, 0.4)}`,
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: gradients.shimmerGradient,
                    transition: 'left 0.5s ease',
                  },
                  '&:hover::before': {
                    left: '100%',
                  }
                }}
              >
                Back to Home
              </Button>
              
              <Button
                component={RouterLink}
                to="/care-guide"
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: colors.accent,
                  color: colors.accent,
                  py: 1.8,
                  px: 5,
                  fontWeight: 'bold',
                  fontFamily: fonts.body,
                  borderRadius: 3,
                  borderWidth: '2px',
                  background: alpha(colors.glassWhite, 0.05),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    background: alpha(colors.accent, 0.1),
                    borderColor: colors.accent,
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: `0 15px 40px ${alpha(colors.accent, 0.3)}`,
                    color: '#ffffff',
                  }
                }}
              >
                View Care Guide
              </Button>
            </Box>

            {/* Decorative gradient divider */}
            <Box
              sx={{
                mt: 4,
                height: 2,
                background: gradients.multiGradient,
                borderRadius: 1,
                opacity: 0.6,
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 6s ease infinite',
              }}
            />
          </Box>
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default NotFound; 