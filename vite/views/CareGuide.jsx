import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Breadcrumbs,
  Link,
  Stack,
  Paper,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import { useTheme } from '../Context/ThemeContext';

const CareGuide = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => window.scrollTo(0, 0), []);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Thanks for subscribing! You\'ll receive your first care guide and special offers within 24 hours.');
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

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
            top: '15%',
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
            top: '45%',
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
            bottom: '20%',
            right: '30%',
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
              Pet Care Guide
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
            Weekly care tips, grooming guides, and exclusive offers delivered to your inbox.
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
              Care Guide
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Newsletter Signup Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="md">
          {/* Enhanced Signup Form */}
          <Paper
            elevation={0}
            sx={{
              maxWidth: 480,
              mx: 'auto',
              textAlign: 'center',
              p: 4,
              mb: 8,
              background: alpha(colors.glassWhite, 0.1),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden',
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
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${alpha(colors.primary, 0.3)}`,
                border: `1px solid ${alpha(colors.primary, 0.4)}`,
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Star sx={{ fontSize: 20, color: colors.accent }} />
              <Typography 
                variant="h4" 
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
                Join Our Pack
              </Typography>
              <Star sx={{ fontSize: 20, color: colors.primary }} />
            </Box>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                color: alpha('#ffffff', 0.8),
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontFamily: fonts.body,
              }}
            >
              Get expert pet care tips and exclusive offers delivered weekly
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: alpha(colors.accent, 0.3)
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(colors.accent, 0.5),
                    boxShadow: `0 0 15px ${alpha(colors.accent, 0.2)}`,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                    borderWidth: '2px',
                    boxShadow: `0 0 20px ${alpha(colors.accent, 0.4)}`,
                  },
                  transition: 'all 0.3s ease',
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                  '&::placeholder': {
                    color: alpha('#ffffff', 0.6),
                    opacity: 1
                  }
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleSubscribe}
              disabled={isSubmitting || !email.trim()}
              startIcon={isSubmitting ? null : <Bolt />}
              endIcon={isSubmitting ? null : <TrendingUp />}
              sx={{
                background: isSubmitting 
                  ? alpha(colors.glassWhite, 0.1) 
                  : gradients.multiGradient,
                backgroundSize: '200% 200%',
                color: '#ffffff',
                fontWeight: 'bold',
                width: '100%',
                py: 1.5,
                borderRadius: 3,
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                position: 'relative',
                overflow: 'hidden',
                animation: !isSubmitting ? 'gradient-shift 4s ease infinite' : 'none',
                '@keyframes gradient-shift': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
                '&:hover': !isSubmitting ? {
                  background: gradients.glowGradient,
                  transform: 'scale(1.02)',
                  boxShadow: `0 8px 32px ${alpha(colors.accent, 0.5)}`,
                } : {},
                '&:disabled': {
                  color: alpha('#ffffff', 0.6),
                  background: alpha(colors.glassWhite, 0.05),
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
                '&:hover::before': !isSubmitting ? {
                  left: '100%',
                } : {},
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Free'}
            </Button>
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 2, 
                color: alpha('#ffffff', 0.6),
                display: 'block',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              No spam. Unsubscribe anytime.
            </Typography>
          </Paper>

          {/* Enhanced Benefits Cards */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            sx={{ justifyContent: 'center' }}
          >
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                maxWidth: 280,
                p: 3,
                background: alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(15px)',
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 16px 48px ${alpha(colors.accent, 0.3)}`,
                  border: `1px solid ${alpha(colors.accent, 0.5)}`,
                  background: alpha(colors.glassWhite, 0.15),
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
                  opacity: 1,
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: gradients.accentGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: `0 8px 32px ${alpha(colors.accent, 0.4)}`,
                  animation: 'iconPulse 3s ease-in-out infinite',
                  '@keyframes iconPulse': {
                    '0%, 100%': { boxShadow: `0 8px 32px ${alpha(colors.accent, 0.4)}` },
                    '50%': { boxShadow: `0 12px 40px ${alpha(colors.accent, 0.6)}` },
                  },
                }}
              >
                <PetsIcon sx={{ fontSize: 32, color: '#ffffff' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 1,
                  fontFamily: fonts.heading,
                }}
              >
                Expert Care Tips
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                  lineHeight: 1.6,
                }}
              >
                Weekly grooming guides, health tips, and seasonal care advice from certified pet professionals.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                maxWidth: 280,
                p: 3,
                background: alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(15px)',
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 16px 48px ${alpha(colors.primary, 0.3)}`,
                  border: `1px solid ${alpha(colors.primary, 0.5)}`,
                  background: alpha(colors.glassWhite, 0.15),
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
                  opacity: 1,
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: gradients.primaryGradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: `0 8px 32px ${alpha(colors.primary, 0.4)}`,
                  animation: 'iconPulse 3s ease-in-out infinite',
                }}
              >
                <FavoriteIcon sx={{ fontSize: 32, color: '#ffffff' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 1,
                  fontFamily: fonts.heading,
                }}
              >
                Personalized Guidance
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                  lineHeight: 1.6,
                }}
              >
                Tailored advice based on your pet's breed, age, and specific needs for optimal health and happiness.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                maxWidth: 280,
                p: 3,
                background: alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(15px)',
                border: `1px solid ${alpha(colors.secondary, 0.2)}`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-8px) scale(1.02)',
                  boxShadow: `0 16px 48px ${alpha(colors.secondary, 0.3)}`,
                  border: `1px solid ${alpha(colors.secondary, 0.5)}`,
                  background: alpha(colors.glassWhite, 0.15),
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
                  opacity: 1,
                },
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${colors.secondary}, ${colors.purple})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: `0 8px 32px ${alpha(colors.secondary, 0.4)}`,
                  animation: 'iconPulse 3s ease-in-out infinite',
                }}
              >
                <LocalOfferIcon sx={{ fontSize: 32, color: '#ffffff' }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold', 
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  mb: 1,
                  fontFamily: fonts.heading,
                }}
              >
                Exclusive Offers
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                  lineHeight: 1.6,
                }}
              >
                Special discounts on grooming services, premium products, and early access to new treatments.
              </Typography>
            </Paper>
          </Stack>
        </Container>
      </Box>

      <Footer />
      <ChatBot />
    </>
  );
};

export default CareGuide;
