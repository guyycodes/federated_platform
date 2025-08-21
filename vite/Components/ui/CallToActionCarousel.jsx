// CallToActionCarousel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Container, IconButton, Button, Stack, alpha } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { carouselData, getCtaPath } from '../../assets/carousel/carouselData';

const CallToActionCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const maxIndex = carouselData.length - 1;
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

  // Auto advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prevCurrent => prevCurrent === maxIndex ? 0 : prevCurrent + 1);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrent(prevCurrent => (prevCurrent === 0 ? maxIndex : prevCurrent - 1));
  };

  const handleNext = () => {
    setCurrent(prevCurrent => (prevCurrent === maxIndex ? 0 : prevCurrent + 1));
  };

  const handleDotClick = (index) => {
    setCurrent(index);
  };

  const handleButtonClick = (item) => {
    const path = getCtaPath(item.ctaAction);
    navigate(path);
  };

  const currentItem = carouselData[current];

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        pt: 10,
        pb: 15,
        background: gradients.darkGlass,
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
        clipPath: {
          xs: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)',
          sm: 'polygon(0 0, 100% 0, 100% 92%, 50% 100%, 0 92%)',
          md: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)'
        },
        mb: { xs: -4, md: -6 },
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
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: -96,
            width: 192,
            height: 192,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.25,
            filter: 'blur(60px)',
            animation: 'pulse 6s ease-in-out infinite',
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
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            right: '25%',
            width: 160,
            height: 160,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(50px)',
            animation: 'pulse 7s ease-in-out infinite',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Enhanced Title with Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 6 }}>
          <Star 
            sx={{ 
              fontSize: { xs: 28, md: 40 }, 
              color: colors.primary,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.5)',
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.2s',
              animation: 'starGlow 3s ease-in-out infinite',
              '@keyframes starGlow': {
                '0%, 100%': { filter: `drop-shadow(0 0 8px ${colors.primary})` },
                '50%': { filter: `drop-shadow(0 0 16px ${colors.primary})` },
              },
            }} 
          />
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' },
              fontFamily: fonts.heading,
              background: gradients.multiGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              transitionDelay: '0.4s',
            }}
          >
            Happy Customers, Happier Pups
          </Typography>
          <Star 
            sx={{ 
              fontSize: { xs: 24, md: 36 }, 
              color: colors.accent,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0.5)',
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.6s',
              animation: 'starGlow 3s ease-in-out infinite 1.5s',
              '@keyframes starGlow': {
                '0%, 100%': { filter: `drop-shadow(0 0 8px ${colors.accent})` },
                '50%': { filter: `drop-shadow(0 0 16px ${colors.accent})` },
              },
            }} 
          />
        </Box>

        <Box
          sx={{
            maxWidth: 900,
            mx: 'auto',
            px: { xs: 2, md: 6 },
            py: { xs: 6, md: 8 },
            ...glassmorphism.strong,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease',
            transitionDelay: '0.8s',
            border: `2px solid ${alpha(colors.primary, 0.4)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: gradients.shimmerGradient,
              transition: 'left 0.8s',
              zIndex: 1,
              pointerEvents: 'none',
            },
            '&:hover::before': {
              left: '100%',
            },
          }}
        >
          {/* Floating Testimonial Icon */}
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
              transitionDelay: '1.2s',
              animation: 'iconPulse 3s ease-in-out infinite',
              '@keyframes iconPulse': {
                '0%, 100%': { boxShadow: `0 0 15px ${alpha(colors.accent, 0.6)}` },
                '50%': { boxShadow: `0 0 30px ${alpha(colors.accent, 0.9)}` },
              },
            }}
          >
            <TrendingUp sx={{ fontSize: 24, color: '#ffffff' }} />
          </Box>

          {/* Enhanced Navigation Arrows */}
          <IconButton
            onClick={handlePrev}
            sx={{
              position: 'absolute',
              left: { xs: -15, md: -25 },
              top: '50%',
              transform: 'translateY(-50%)',
              ...glassmorphism.card,
              color: colors.primary,
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                ...glassmorphism.strong,
                color: colors.accent,
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: `0 8px 32px ${alpha(colors.primary, 0.4)}`,
              },
            }}
            aria-label="Previous testimonial"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: { xs: -15, md: -25 },
              top: '50%',
              transform: 'translateY(-50%)',
              ...glassmorphism.card,
              color: colors.primary,
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                ...glassmorphism.strong,
                color: colors.accent,
                transform: 'translateY(-50%) scale(1.1)',
                boxShadow: `0 8px 32px ${alpha(colors.primary, 0.4)}`,
              },
            }}
            aria-label="Next testimonial"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>

          {/* Carousel Content */}
          <Box sx={{ overflow: 'hidden', position: 'relative', zIndex: 2 }}>
            <Box
              sx={{
                display: 'flex',
                transition: 'transform 0.6s ease-in-out',
                transform: `translateX(-${current * 100}%)`,
              }}
            >
              {carouselData.map((item, index) => (
                <Box
                  key={item.id}
                  sx={{
                    minWidth: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  {/* Enhanced Title */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 4 }}>
                    <Bolt 
                      sx={{ 
                        fontSize: { xs: 20, md: 24 }, 
                        color: colors.accent,
                        filter: `drop-shadow(0 0 8px ${colors.accent})`,
                      }} 
                    />
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        fontFamily: fonts.heading,
                        background: gradients.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 1px 2px rgba(246, 81, 30, 0.3))',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Bolt 
                      sx={{ 
                        fontSize: { xs: 16, md: 20 }, 
                        color: colors.primary,
                        filter: `drop-shadow(0 0 6px ${colors.primary})`,
                      }} 
                    />
                  </Box>

                  {/* Enhanced Quote */}
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      lineHeight: 1.8,
                      color: 'rgba(255,255,255,0.9)',
                      maxWidth: '85%',
                      fontStyle: 'italic',
                      fontFamily: fonts.body,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      position: 'relative',
                      '&::before': {
                        content: '"✨"',
                        position: 'absolute',
                        top: -10,
                        left: -20,
                        fontSize: '1.5rem',
                        animation: 'sparkle 2s ease-in-out infinite',
                        '@keyframes sparkle': {
                          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                          '50%': { opacity: 1, transform: 'scale(1.2)' },
                        },
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: -16,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: gradients.accentGradient,
                        borderRadius: 2,
                        opacity: 0.8,
                      }
                    }}
                  >
                    "{item.content}"
                  </Typography>

                  {/* Enhanced Author */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      color: '#ffffff',
                      fontFamily: fonts.body,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    - {item.author}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: colors.accent,
                      mb: 5,
                      fontWeight: 'medium',
                      fontFamily: fonts.body,
                      filter: `drop-shadow(0 0 8px ${alpha(colors.accent, 0.5)})`,
                    }}
                  >
                    {item.authorTitle}
                  </Typography>

                  {/* Enhanced CTA Button */}
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Star />}
                    endIcon={<TrendingUp />}
                    onClick={() => handleButtonClick(item)}
                    sx={{
                      background: gradients.multiGradient,
                      backgroundSize: '200% 200%',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      px: 4,
                      py: 1.5,
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
                    {item.cta}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Enhanced Radio Button Indicators */}
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            sx={{ mt: 5, position: 'relative', zIndex: 2 }}
          >
            {carouselData.map((item, i) => (
              <Box
                key={i}
                onClick={() => handleDotClick(i)}
                sx={{
                  width: current === i ? 16 : 12,
                  height: current === i ? 16 : 12,
                  borderRadius: '50%',
                  background: current === i 
                    ? gradients.primaryGradient 
                    : alpha(colors.glassWhite, 0.3),
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: current === i 
                    ? `2px solid ${alpha('#ffffff', 0.4)}` 
                    : `1px solid ${alpha('#ffffff', 0.2)}`,
                  backdropFilter: 'blur(10px)',
                  animation: current === i ? 'indicatorGlow 2s ease-in-out infinite' : 'none',
                  '@keyframes indicatorGlow': {
                    '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.primary, 0.5)}` },
                    '50%': { boxShadow: `0 0 20px ${alpha(colors.primary, 0.8)}` },
                  },
                  '&:hover': {
                    background: current === i 
                      ? gradients.glowGradient 
                      : alpha(colors.primary, 0.5),
                    transform: 'scale(1.3)',
                    boxShadow: `0 4px 15px ${alpha(colors.primary, 0.4)}`,
                  },
                }}
                role="button"
                aria-label={`Go to testimonial ${i + 1}`}
                tabIndex={0}
              />
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CallToActionCarousel; 