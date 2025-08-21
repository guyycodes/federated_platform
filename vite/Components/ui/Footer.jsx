import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider,
  Stack,
  TextField,
  Button,
  IconButton,
  alpha
} from '@mui/material';
import { Star, Bolt, TrendingUp, Email } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
// import CredentialsWizard from '../authenticated/components/CredentialsWizard';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { colors, gradients, fonts } = useTheme();
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleOpenWizard = () => {
    setWizardOpen(true);
  };

  const handleCloseWizard = () => {
    setWizardOpen(false);
  };
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        background: gradients.darkGlass,
        color: '#ffffff',
        pt: 8,
        pb: 6,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -40,
          left: -40,
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
          bottom: -30,
          right: -30,
          width: 100,
          height: 100,
          background: gradients.accentGradient,
          borderRadius: '50%',
          opacity: 0.15,
          filter: 'blur(35px)',
          animation: 'pulse 6s ease-in-out infinite',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Star sx={{ fontSize: 28, color: colors.primary }} />
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: fonts.heading,
                }}
              >
                Buster & Co.
              </Typography>
              <Star sx={{ fontSize: 24, color: colors.accent }} />
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                color: alpha('#ffffff', 0.8), 
                maxWidth: 300,
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                lineHeight: 1.6,
              }}
            >
              Professional mobile pet grooming services bringing stress-free care directly to your home.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <IconButton 
                component="a"
                href="https://www.linkedin.com/company/busterandco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn" 
                sx={{ 
                  p: 1,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.accent, 0.3)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.15) translateY(-2px)',
                    background: alpha(colors.glassWhite, 0.2),
                    boxShadow: `0 8px 25px ${alpha(colors.accent, 0.4)}`,
                    border: `1px solid ${alpha(colors.accent, 0.6)}`,
                  } 
                }}
              >
                <Box
                  component="img"
                  src="/images/linkedin-color-svgrepo-com.svg"
                  alt="LinkedIn"
                  sx={{ 
                    width: 24, 
                    height: 24,
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </IconButton>
              <IconButton 
                component="a"
                href="https://www.instagram.com/busterandco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram" 
                sx={{ 
                  p: 1,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.primary, 0.3)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.15) translateY(-2px)',
                    background: alpha(colors.glassWhite, 0.2),
                    boxShadow: `0 8px 25px ${alpha(colors.primary, 0.4)}`,
                    border: `1px solid ${alpha(colors.primary, 0.6)}`,
                  } 
                }}
              >
                <Box
                  component="img"
                  src="/images/instagram-svgrepo-com.svg"
                  alt="Instagram"
                  sx={{ 
                    width: 24, 
                    height: 24,
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </IconButton>
              <IconButton 
                component="a"
                href="https://www.facebook.com/busterandco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook" 
                sx={{ 
                  p: 1,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.secondary, 0.3)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.15) translateY(-2px)',
                    background: alpha(colors.glassWhite, 0.2),
                    boxShadow: `0 8px 25px ${alpha(colors.secondary, 0.4)}`,
                    border: `1px solid ${alpha(colors.secondary, 0.6)}`,
                  } 
                }}
              >
                <Box
                  component="img"
                  src="/images/facebook-svgrepo-com.svg"
                  alt="Facebook"
                  sx={{ 
                    width: 24, 
                    height: 24,
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </IconButton>
              <IconButton 
                component="a"
                href="https://www.tiktok.com/@busterandco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok" 
                sx={{ 
                  p: 1,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.purple, 0.3)}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'scale(1.15) translateY(-2px)',
                    background: alpha(colors.glassWhite, 0.2),
                    boxShadow: `0 8px 25px ${alpha(colors.purple, 0.4)}`,
                    border: `1px solid ${alpha(colors.purple, 0.6)}`,
                  } 
                }}
              >
                <Box
                  component="img"
                  src="/images/tiktok-svgrepo-com.svg"
                  alt="TikTok"
                  sx={{ 
                    width: 24, 
                    height: 24,
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </IconButton>
            </Box>
          </Grid>
          
          {/* Quick Links */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Bolt sx={{ fontSize: 20, color: colors.accent }} />
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{
                  background: gradients.accentGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Quick Links
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              <Link 
                component={RouterLink} 
                to="/" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.accent,
                    textShadow: `0 0 10px ${colors.accent}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Home
              </Link>
              <Link 
                component={RouterLink} 
                to="/booking" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.primary,
                    textShadow: `0 0 10px ${colors.primary}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Book Appointment
              </Link>
              {/* <Link 
                component={RouterLink} 
                to="/admin-login" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.secondary,
                    textShadow: `0 0 10px ${colors.secondary}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Admin Portal
              </Link> */}
              <Link 
                component={RouterLink} 
                to="/care-guide" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.accent,
                    textShadow: `0 0 10px ${colors.accent}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Care Guide
              </Link>
              <Link 
                component={RouterLink} 
                to="/about" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.primary,
                    textShadow: `0 0 10px ${colors.primary}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                About
              </Link>
              <Link 
                component={RouterLink} 
                to="/contact" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.secondary,
                    textShadow: `0 0 10px ${colors.secondary}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Contact
              </Link>
            </Stack>
          </Grid>
          
          {/* Services */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp sx={{ fontSize: 20, color: colors.primary }} />
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                More
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              <Link 
                component={RouterLink} 
                to="/register" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.lottieGreen,
                    textShadow: `0 0 10px ${colors.lottieGreen}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Register
              </Link>
              <Link 
                component={RouterLink} 
                to="/spotlight" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.accent,
                    textShadow: `0 0 10px ${colors.accent}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Spotlight
              </Link>
              <Link 
                component={RouterLink} 
                to="/booking" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.primary,
                    textShadow: `0 0 10px ${colors.primary}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Booking
              </Link>
              <Link 
                component={RouterLink} 
                to="/login" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.secondary,
                    textShadow: `0 0 10px ${colors.secondary}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Login
              </Link>
              <Link 
                component={RouterLink} 
                to="/admin-login" 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.8), 
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: colors.purple,
                    textShadow: `0 0 10px ${colors.purple}`,
                    transform: 'translateX(4px)',
                  } 
                }}
              >
                Admin Portal
              </Link>
            </Stack>
          </Grid>
          
          {/* Newsletter */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Email sx={{ fontSize: 20, color: colors.accent }} />
              <Typography 
                variant="h6" 
                fontWeight="bold"
                sx={{
                  background: gradients.accentGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Get Pet Care Tips
              </Typography>
              <Star sx={{ fontSize: 16, color: colors.primary }} />
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 3, 
                color: alpha('#ffffff', 0.8),
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                lineHeight: 1.6,
              }}
            >
              Subscribe for weekly grooming tips and special offers for your furry family.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Your email address"
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    background: alpha(colors.glassWhite, 0.1),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    '& fieldset': { 
                      borderColor: alpha(colors.accent, 0.3),
                      borderWidth: '1px'
                    },
                    '&:hover fieldset': { 
                      borderColor: alpha(colors.accent, 0.5),
                      boxShadow: `0 0 10px ${alpha(colors.accent, 0.2)}`,
                    },
                    '&.Mui-focused fieldset': { 
                      borderColor: colors.accent,
                      borderWidth: '2px',
                      boxShadow: `0 0 15px ${alpha(colors.accent, 0.4)}`,
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
                startIcon={<Bolt />}
                sx={{
                  background: gradients.multiGradient,
                  backgroundSize: '200% 200%',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 3,
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
                    boxShadow: `0 0 20px ${alpha(colors.accent, 0.6)}`,
                  },
                  transition: 'all 0.3s ease',
                  minWidth: 'auto',
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        <Box
          sx={{
            mt: 6,
            mb: 4,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${alpha(colors.primary, 0.3)}, ${alpha(colors.accent, 0.5)}, ${alpha(colors.secondary, 0.3)}, transparent)`,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 5,
              background: gradients.multiGradient,
              borderRadius: 3,
              filter: 'blur(2px)',
              opacity: 0.6,
            },
          }}
        />
        
        {/* Copyright & Bottom Links */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', sm: 'flex-start' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, sm: 0 } }}>
            <Star sx={{ fontSize: 16, color: colors.accent }} />
            <Typography 
              variant="body2" 
              sx={{ 
                color: alpha('#ffffff', 0.7), 
                textAlign: { xs: 'center', sm: 'left' },
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              © {currentYear} Buster & Co. Pet Grooming Services. All rights reserved.
            </Typography>
            <Star sx={{ fontSize: 16, color: colors.primary }} />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              component={RouterLink} 
              to="/privacy" 
              underline="hover" 
              sx={{ 
                color: alpha('#ffffff', 0.7), 
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  color: colors.accent,
                  textShadow: `0 0 8px ${colors.accent}`,
                  transform: 'translateY(-1px)',
                } 
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              component={RouterLink} 
              to="/terms" 
              underline="hover" 
              sx={{ 
                color: alpha('#ffffff', 0.7), 
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  color: colors.primary,
                  textShadow: `0 0 8px ${colors.primary}`,
                  transform: 'translateY(-1px)',
                } 
              }}
            >
              Terms of Service
            </Link>
            <Link 
              component={RouterLink} 
              to="/cookies" 
              underline="hover" 
              sx={{ 
                color: alpha('#ffffff', 0.7), 
                fontSize: '0.875rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  color: colors.secondary,
                  textShadow: `0 0 8px ${colors.secondary}`,
                  transform: 'translateY(-1px)',
                } 
              }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>

    </Box>
  );
};

export default Footer; 