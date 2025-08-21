// AboutSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, alpha } from '@mui/material';
import { Star, Bolt, TrendingUp, Pets } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const { colors, gradients, fonts, glassmorphism } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: gradients.darkGlass,
        color: '#ffffff',
        overflow: 'hidden',
        pt: { xs: 8, md: 0 },
        pb: { xs: 10, md: 8 },
        marginBottom: '-2px',
      }}
    >
      {/* Animated Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Animated gradient orbs - positioned for visual flow from Pillars */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: -96,
            width: 192,
            height: 192,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.25,
            filter: 'blur(60px)',
            animation: 'pulse 5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.25 },
              '50%': { transform: 'scale(1.3)', opacity: 0.4 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: -48,
            width: 128,
            height: 128,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(40px)',
            animation: 'pulse 7s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: 160,
            height: 160,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(50px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
      </Box>

      {/* Wave divider at the top */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '90px',
          transform: 'rotateX(180deg)',
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: '100%' }}
        >
          <path
            fill={'#ffffff'}
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </Box>

      <Container 
        maxWidth="lg"
        sx={{
          paddingBottom: '5rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Grid container spacing={6} alignItems="center">
          {/* Image Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                overflow: 'hidden',
                borderRadius: 4,
                position: 'relative',
                ...glassmorphism.card,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0) rotateY(0)' : 'translateX(-100px) rotateY(-5deg)',
                transition: 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                '&:hover': {
                  ...glassmorphism.strong,
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 20px 60px ${alpha(colors.primary, 0.4)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: gradients.shimmerGradient,
                  transition: 'left 0.6s',
                  zIndex: 1,
                  pointerEvents: 'none',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              {/* Floating Service Icon */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  zIndex: 3,
                  background: gradients.accentGradient,
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  transitionDelay: '0.6s',
                  animation: 'iconPulse 3s ease-in-out infinite',
                  '@keyframes iconPulse': {
                    '0%, 100%': { boxShadow: `0 0 15px ${alpha(colors.accent, 0.6)}` },
                    '50%': { boxShadow: `0 0 30px ${alpha(colors.accent, 0.9)}` },
                  },
                }}
              >
                <Star sx={{ fontSize: 24, color: '#ffffff' }} />
              </Box>

              <Box
                component="img"
                src="https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1350&q=80"
                alt="Professional dog grooming services"
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transition: 'transform 0.5s ease, filter 0.3s ease',
                  objectFit: 'cover',
                  position: 'relative',
                  zIndex: 2,
                  '&:hover': {
                    transform: 'scale(1.03)',
                    filter: 'brightness(1.1) contrast(1.05)',
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Content Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                pl: { md: 4 },
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(100px)',
                transition: 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transitionDelay: '0.3s',
              }}
            >
              {/* Enhanced Title with Icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                <Star 
                  sx={{ 
                    fontSize: { xs: 24, md: 28 }, 
                    color: colors.primary,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.5)',
                    transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transitionDelay: '0.8s',
                  }} 
                />
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: '2.2rem', md: '3.5rem' },
                    fontFamily: fonts.heading,
                    background: gradients.multiGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                    filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
                  }}
                >
                  Where Every Pup Feels Pampered
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                  fontFamily: fonts.body,
                  color: 'rgba(255,255,255,0.9)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -16,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: gradients.primaryGradient,
                    borderRadius: 2,
                  }
                }}
              >
                Professional grooming services that keep your furry friend looking and feeling their best. From quick washes to full spa treatments, we've got your pup covered.
              </Typography>

              <Box 
                component="ul" 
                sx={{ 
                  pl: 2, 
                  mb: 4, 
                  lineHeight: 1.8,
                  '& li': {
                    mb: 1,
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: fonts.body,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#ffffff',
                      transform: 'translateX(8px)',
                    },
                    '&::marker': {
                      color: colors.accent,
                    }
                  }
                }}
              >
                <Typography component="li">Professional grooming services for all dog sizes</Typography>
                <Typography component="li">Flexible monthly membership plans with exclusive savings</Typography>
                <Typography component="li">Premium retail products & gift cards available</Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                startIcon={<Bolt />}
                endIcon={<TrendingUp />}
                onClick={() => navigate('/book-appointment')}
                sx={{
                  background: gradients.multiGradient,
                  backgroundSize: '200% 200%',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  padding: '12px 32px',
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  border: `2px solid ${alpha('#ffffff', 0.2)}`,
                  position: 'relative',
                  overflow: 'hidden',
                  animation: 'gradient-shift 4s ease infinite',
                  '@keyframes gradient-shift': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                  },
                  '&:hover': {
                    background: gradients.glowGradient,
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: `0 12px 40px ${alpha(colors.primary, 0.5)}`,
                  },
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: gradients.shimmerGradient,
                    transition: 'left 0.5s',
                  },
                  '&:hover::before': {
                    left: '100%',
                  },
                }}
              >
                Book Your Appointment
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Wave divider at the bottom */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 6,
          left: 0,
          width: '100%',
          height: '40px',
          zIndex: 1,
        }}
      >
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', height: '100%' }}
          preserveAspectRatio="none"
        >
          <path
            fill={'#ffffff'}
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
          ></path>
        </svg>
      </Box>
    </Box>
  );
};

export default AboutSection; 