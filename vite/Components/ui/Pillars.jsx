// Pillars.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent, useMediaQuery, useTheme as useMUITheme, alpha } from '@mui/material';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { serviceItems } from '../../../public/ServicePillars/servicePillars.js';
import { useTheme } from '../../Context/ThemeContext';

const Pillars = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const muiTheme = useMUITheme();
  const { colors, gradients, fonts, glassmorphism } = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section becomes 20% visible, trigger animation
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <Box 
      component="section" 
      ref={sectionRef}
      sx={{ 
        minHeight: { xs: 'auto', md: '100vh' }, // Responsive height
        height: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: gradients.darkGlass,
        color: '#ffffff',
        py: { xs: 6, md: 8 }, // More padding on mobile
        perspective: '1000px', // Adds depth to the animations
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="services-heading"
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
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: -96,
            left: -96,
            width: 192,
            height: 192,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.3,
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
              '50%': { transform: 'scale(1.2)', opacity: 0.5 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            right: -48,
            width: 128,
            height: 128,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(40px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: '30%',
            width: 160,
            height: 160,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.25,
            filter: 'blur(50px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
      </Box>

      <Container 
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Enhanced Title with Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: { xs: 3, md: 5 } }}>
          <Star 
            sx={{ 
              fontSize: { xs: 28, md: 40 }, 
              color: colors.primary,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.5)',
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.2s',
            }} 
          />
          <Typography 
            id="services-heading"
            variant="h2" 
            component="h2" 
            align="center" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3.5rem' },
              fontFamily: fonts.heading,
              background: gradients.multiGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              transitionDelay: '0.4s',
            }}
          >
            What We Do
          </Typography>
          <Star 
            sx={{ 
              fontSize: { xs: 24, md: 36 }, 
              color: colors.accent,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0.5)',
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.6s',
            }} 
          />
        </Box>
        
        <Grid 
          container 
          spacing={{ xs: 3, md: 5 }}
          sx={{ 
            alignItems: 'center',
          }}
        >
          {serviceItems.map((item, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  ...glassmorphism.card,
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? 'translateY(0) rotateX(0deg)' 
                    : `translateY(80px) rotateX(10deg) translateX(${(index-1) * 15}px)`,
                  transition: `opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                  transitionDelay: `${index * 0.3 + 0.8}s`,
                  '&:hover': {
                    transform: isVisible ? 'translateY(-15px) scale(1.03)' : 'translateY(80px)',
                    transition: 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    ...glassmorphism.strong,
                    boxShadow: `0 20px 60px ${alpha(colors.primary, 0.3)}`,
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
                {/* Service Icon */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 3,
                    background: gradients.accentGradient,
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    transitionDelay: `${index * 0.3 + 1.2}s`,
                    animation: 'iconPulse 3s ease-in-out infinite',
                    '@keyframes iconPulse': {
                      '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.accent, 0.5)}` },
                      '50%': { boxShadow: `0 0 20px ${alpha(colors.accent, 0.8)}` },
                    },
                  }}
                >
                  {index === 0 && <Bolt sx={{ fontSize: 20, color: '#ffffff' }} />}
                  {index === 1 && <TrendingUp sx={{ fontSize: 20, color: '#ffffff' }} />}
                  {index === 2 && <Star sx={{ fontSize: 20, color: '#ffffff' }} />}
                </Box>

                <CardMedia
                  component="img"
                  image={item.image || 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=1350&q=80'}
                  alt={item.title}
                  height={isMobile ? "200" : "300"}
                  sx={{ 
                    borderRadius: 3,
                    transition: 'all 0.4s ease',
                    mb: { xs: 2, md: 3 },
                    boxShadow: `0 10px 20px ${alpha(colors.primary, 0.3)}`,
                    objectFit: 'cover',
                    position: 'relative',
                    zIndex: 2,
                    '&:hover': {
                      boxShadow: `0 15px 30px ${alpha(colors.primary, 0.5)}`,
                      filter: 'brightness(1.1) contrast(1.1)',
                    }
                  }}
                />
                <CardContent 
                  sx={{ 
                    p: { xs: 2, md: 3 },
                    flexGrow: 1,
                    background: alpha(colors.glassBlack, 0.6),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    position: 'relative',
                    zIndex: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(colors.glassBlack, 0.8),
                      border: `1px solid ${alpha(colors.primary, 0.4)}`,
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1, md: 2 } }}>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1.3rem', md: '1.8rem' },
                        fontFamily: fonts.heading,
                        background: gradients.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        filter: 'drop-shadow(0 1px 2px rgba(246, 81, 30, 0.3))',
                        mb: 0,
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: { xs: '0.9rem', md: '1.1rem' },
                      lineHeight: 1.6,
                      fontFamily: fonts.body,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: -8,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: gradients.accentGradient,
                        borderRadius: 2,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      },
                      '&:hover::before': {
                        opacity: 1,
                      }
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pillars; 