// Banner.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  Bolt, TrendingUp, Shield, AutoAwesome,
  BarChart, CheckCircle, ChevronRight 
} from '@mui/icons-material';
import { useTheme } from '../../Context/ThemeContext';
import TrustedByMarquee from './TrustedByMarquee';

const Banner = () => {
  const navigate = useNavigate();
  const { colors, gradients, fonts } = useTheme();
  const [counters, setCounters] = useState({ automation: 0, speed: 0, accuracy: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Animate counters
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCounters({
        automation: Math.floor(97 * easeOut),
        speed: Math.floor(15 * easeOut * 10) / 10,
        accuracy: Math.floor(99.8 * easeOut * 10) / 10
      });
      
      if (currentStep >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleBookAppointment = () => {
    navigate('/booking');
  };

  const handleVisitDemo = () => {
    navigate('/demo');
  };

  const stats = [
    {
      value: `${counters.automation}%`,
      label: 'Automation Rate',
      icon: Bolt,
      color: colors.primary,
      gradient: gradients.primaryGradient,
    },
    {
      value: `${counters.speed}x`,
      label: 'Faster Audits',
      icon: TrendingUp,
      color: colors.accent,
      gradient: gradients.accentGradient,
    },
    {
      value: `${counters.accuracy}%`,
      label: 'Accuracy',
      icon: Shield,
      color: colors.lottieGreen,
      gradient: gradients.multiGradient,
    }
  ];

  return (
    <Box
      component="section"
      aria-label="Main banner"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        background: `linear-gradient(to bottom right, #0f0f11, #1a1a1f, #0f0f11)`,
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box sx={{ position: 'absolute', inset: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            top: '80px',
            left: '40px',
            width: '288px',
            height: '288px',
            background: `${alpha(colors.primary, 0.2)}`,
            borderRadius: '50%',
            filter: 'blur(48px)',
            // animation: 'pulse 3s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
              '50%': { opacity: 0.8, transform: 'scale(1.1)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '80px',
            right: '40px',
            width: '384px',
            height: '384px',
            background: `${alpha(colors.accent, 0.2)}`,
            borderRadius: '50%',
            filter: 'blur(48px)',
            animation: 'pulse 3s ease-in-out infinite',
            // animationDelay: '2s',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
              '60%': { opacity: 0.9, transform: 'scale(1.1)' },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '500px',
            background: `${alpha(colors.lottieTeal, 0.1)}`,
            borderRadius: '50%',
            filter: 'blur(48px)',
            animation: 'pulse 3s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
      </Box>

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 10, 
          py: { xs: 8, md: 8 } 
        }}
      >
        {/* Main content */}
        <Box
          sx={{
            textAlign: 'center',
            maxWidth: 'auto',
            mx: 'auto',
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 1s ease-out',
          }}
        >

          {/* Title */}
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              fontWeight: 'bold',
              mb: 2,
              background: gradients.multiGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1.2,
              fontFamily: fonts.heading,
            }}
          >
            BlackCore AI
            
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            sx={{
              color: alpha('#ffffff', 0.8),
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontFamily: fonts.body,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
            }}
          >
            Leverage cutting-edge AI to automate your entire audit lifecycle.
          </Typography>

          {/* CTA Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={handleBookAppointment}
              endIcon={<ChevronRight />}
              sx={{
                background: gradients.primaryGradient,
                color: '#ffffff',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 8px 32px ${alpha(colors.primary, 0.5)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  transition: 'left 0.5s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              Start Free Trial
            </Button>
            
            <Button
              variant="outlined"
              size="large"
              onClick={handleVisitDemo}
              startIcon={<BarChart />}
              sx={{
                color: '#ffffff',
                borderColor: alpha('#ffffff', 0.3),
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                background: alpha('#ffffff', 0.05),
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha('#ffffff', 0.1),
                  borderColor: colors.accent,
                  color: colors.accent,
                  transform: 'scale(1.05)',
                },
              }}
            >
              View Demo
            </Button>
          </Box>

          {/* Stats Cards */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
              maxWidth: '900px',
              mx: 'auto',
            }}
          >
            {stats.map((stat, index) => (
              <Box
                key={index}
                sx={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                  opacity: isVisible ? 1 : 0,
                  transition: 'all 0.7s ease-out',
                  transitionDelay: `${index * 100}ms`,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    background: alpha('#ffffff', 0.05),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#ffffff', 0.1)}`,
                    borderRadius: 3,
                    p: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha('#ffffff', 0.1),
                      boxShadow: `0 8px 32px ${alpha(stat.color, 0.3)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: 2,
                      background: stat.gradient,
                      mb: 1,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 28, color: '#ffffff' }} />
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 'bold',
                      color: '#ffffff',
                      mb: 0,
                      fontFamily: fonts.heading,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: alpha('#ffffff', 0.6),
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontFamily: fonts.body,
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Trust indicators */}
          <Box
            sx={{
              mt: 4,
              pt: 6,
              borderTop: `1px solid ${alpha('#ffffff', 0.1)}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                opacity: 0.7,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ fontSize: 20, color: colors.lottieGreen }} />
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  SOC 2 Certified
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ fontSize: 20, color: colors.lottieGreen }} />
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  ISO 27001 Compliant
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ fontSize: 20, color: colors.lottieGreen }} />
                <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.6) }}>
                  Enterprise Ready
                </Typography>
              </Box>
                                  
            </Box>
            {/* Trusted By Marquee - nested under Sales Inquiries */}
            <Box
              sx={{
                mt: 2,
                maxWidth: 'auto', // Constrain width to match the contact info area
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                transitionDelay: '0.8s',
              }}
            >
              <TrustedByMarquee />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Banner;
