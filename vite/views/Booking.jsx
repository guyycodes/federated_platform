import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import MembershipPlans from '../Components/ui/MembershipPlans';
import AnimatedDog from '../Components/ui/AnimatedDog';
import { useTheme } from '../Context/ThemeContext';

const Booking = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <>
      <HeaderBar />

      {/* Animated Background Effects */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          background: gradients.darkGlass,
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '12%',
            right: -80,
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
            top: '50%',
            left: -64,
            width: 160,
            height: 160,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(50px)',
            animation: 'pulse 7s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '35%',
            width: 128,
            height: 128,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(40px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          color: '#ffffff',
          py: 8,
          position: 'relative',
          backgroundImage: `${gradients.heroOverlay}, url("https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1350&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced gradient overlay for glassmorphism effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(colors.background, 0.3)}, ${alpha(colors.surface, 0.2)})`,
            backdropFilter: 'blur(2px)',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Star sx={{ fontSize: 28, color: colors.primary }} />
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="bold" 
              sx={{
                fontFamily: fonts.heading,
                background: gradients.multiGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
              }}
            >
              Book Now
            </Typography>
            <Star sx={{ fontSize: 28, color: colors.accent }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              maxWidth: { md: '70%' },
              mb: 4,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              fontWeight: 500,
              fontFamily: fonts.body,
            }}
          >
            Choose from monthly membership plans for ongoing savings, one-time appointments or gift cards.
          </Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: colors.accent }} />}
            aria-label="breadcrumb"
            sx={{
              color: '#ffffff',
              '& a': { 
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                '&:hover': { 
                  color: colors.accent,
                  textShadow: `0 0 10px ${colors.accent}`,
                  transform: 'translateY(-1px)',
                }
              },
              '& .MuiBreadcrumbs-separator': {
                filter: `drop-shadow(0 0 5px ${colors.accent})`,
              }
            }}
          >
            <Link component={RouterLink} to="/">
              Home
            </Link>
            <Typography color="#ffffff" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              Booking
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Enhanced Membership Plans Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Star sx={{ fontSize: 24, color: colors.accent }} />
              <Typography 
                variant="h3" 
                component="h2"
                sx={{ 
                  fontWeight: 'bold',
                  fontFamily: fonts.heading,
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))',
                }}
              >
                Choose Your Plan
              </Typography>
              <Star sx={{ fontSize: 24, color: colors.primary }} />
            </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: alpha('#ffffff', 0.8),
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontFamily: fonts.body,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              From premium memberships to gift cards, find the perfect grooming solution for your furry friend
            </Typography>
          </Box>

          {/* Enhanced Container for MembershipPlans */}
          <Box
            sx={{
              position: 'relative',
              background: alpha(colors.glassWhite, 0.05),
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: { xs: 2, md: 4 },
              border: `1px solid ${alpha(colors.primary, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(colors.primary, 0.1)}`,
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: gradients.shimmerGradient,
                opacity: 0.1,
                animation: 'shimmer 8s ease-in-out infinite',
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '50%': { left: '100%' },
                  '100%': { left: '-100%' },
                },
              },
            }}
          >
            <MembershipPlans />
          </Box>

          {/* Call-to-Action Section */}
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Box
              sx={{
                display: 'inline-block',
                background: alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(15px)',
                borderRadius: 3,
                p: 4,
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                boxShadow: `0 8px 32px ${alpha(colors.accent, 0.2)}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 40px ${alpha(colors.accent, 0.3)}`,
                  border: `1px solid ${alpha(colors.accent, 0.4)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: gradients.shimmerGradient,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                },
                '&:hover::before': {
                  opacity: 0.1,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Bolt sx={{ fontSize: 20, color: colors.accent }} />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    fontFamily: fonts.heading,
                  }}
                >
                  Questions About Our Services?
                </Typography>
                <TrendingUp sx={{ fontSize: 20, color: colors.primary }} />
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                  mb: 2,
                }}
              >
                Our friendly team is here to help you choose the perfect grooming plan for your pet
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#ffffff', 0.6),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                }}
              >
                Use our chat assistant below or contact us directly
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Footer />
      <ChatBot />
    </>
  );
};

export default Booking;
