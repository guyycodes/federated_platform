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

// Footer Configuration
const COMPANY_INFO = {
  name: 'BlackCore AI',
  tagline: 'AI-powered audit automation platform delivering 60-80% time reduction for Federal and Commercial audits.',
  copyright: (year) => `© ${year} BlackCore AI. Audit Automation Platform. All rights reserved.`
};

const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/blackcoreai', icon: '/images/linkedin-color-svgrepo-com.svg', colorKey: 'accent' },
  { name: 'Instagram', url: 'https://www.instagram.com/blackcoreai', icon: '/images/instagram-svgrepo-com.svg', colorKey: 'primary' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@blackcoreai', icon: '/images/tiktok-svgrepo-com.svg', colorKey: 'purple' }
];

const QUICK_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Book Demo', path: '/booking' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' }
];

const PLATFORM_LINKS = [
  { label: 'Demo', path: '/booking' },
  { label: 'Login', path: '/login' },
  { label: 'Admin Portal', path: '/admin-login' }
];

const NEWSLETTER_INFO = {
  title: 'Audit Industry Insights',
  description: 'Subscribe for audit automation insights, compliance updates, and industry best practices.',
  placeholder: 'Your email address',
  buttonText: 'Subscribe'
};

const LEGAL_LINKS = [
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Service', path: '/terms' },
  { label: 'Cookie Policy', path: '/cookies' }
];

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
                {COMPANY_INFO.name}
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
              {COMPANY_INFO.tagline}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {SOCIAL_LINKS.map((social) => (
                <IconButton 
                  key={social.name}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name} 
                  sx={{ 
                    p: 1,
                    background: alpha(colors.glassWhite, 0.1),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(colors[social.colorKey], 0.3)}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'scale(1.15) translateY(-2px)',
                      background: alpha(colors.glassWhite, 0.2),
                      boxShadow: `0 8px 25px ${alpha(colors[social.colorKey], 0.4)}`,
                      border: `1px solid ${alpha(colors[social.colorKey], 0.6)}`,
                    } 
                  }}
                >
                  <Box
                    component="img"
                    src={social.icon}
                    alt={social.name}
                    sx={{ 
                      width: 24, 
                      height: 24,
                      filter: 'brightness(0) invert(1)',
                    }}
                  />
                </IconButton>
              ))}
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
              {QUICK_LINKS.map((link, index) => (
                <Link 
                  key={link.path}
                  component={RouterLink} 
                  to={link.path} 
                  underline="hover" 
                  sx={{ 
                    color: alpha('#ffffff', 0.8), 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: index % 2 === 0 ? colors.accent : index % 3 === 0 ? colors.secondary : colors.primary,
                      textShadow: `0 0 10px ${index % 2 === 0 ? colors.accent : index % 3 === 0 ? colors.secondary : colors.primary}`,
                      transform: 'translateX(4px)',
                    } 
                  }}
                >
                  {link.label}
                </Link>
              ))}
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
                Platform
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {PLATFORM_LINKS.map((link, index) => (
                <Link 
                  key={link.path}
                  component={RouterLink} 
                  to={link.path} 
                  underline="hover" 
                  sx={{ 
                    color: alpha('#ffffff', 0.8), 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      color: index === 0 ? colors.lottieGreen : index === 1 ? colors.accent : index === 2 ? colors.primary : index === 3 ? colors.secondary : colors.purple,
                      textShadow: `0 0 10px ${index === 0 ? colors.lottieGreen : index === 1 ? colors.accent : index === 2 ? colors.primary : index === 3 ? colors.secondary : colors.purple}`,
                      transform: 'translateX(4px)',
                    } 
                  }}
                >
                  {link.label}
                </Link>
              ))}
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
                {NEWSLETTER_INFO.title}
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
              {NEWSLETTER_INFO.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                variant="outlined"
                placeholder={NEWSLETTER_INFO.placeholder}
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
                {NEWSLETTER_INFO.buttonText}
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
              {COMPANY_INFO.copyright(currentYear)}
            </Typography>
            <Star sx={{ fontSize: 16, color: colors.primary }} />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            {LEGAL_LINKS.map((link, index) => (
              <Link 
                key={link.path}
                component={RouterLink} 
                to={link.path} 
                underline="hover" 
                sx={{ 
                  color: alpha('#ffffff', 0.7), 
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    color: index === 0 ? colors.accent : index === 1 ? colors.primary : colors.secondary,
                    textShadow: `0 0 8px ${index === 0 ? colors.accent : index === 1 ? colors.primary : colors.secondary}`,
                    transform: 'translateY(-1px)',
                  } 
                }}
              >
                {link.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>

    </Box>
  );
};

export default Footer; 