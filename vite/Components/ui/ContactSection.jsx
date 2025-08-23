import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Container, Grid, TextField, Button, Stack, Paper, Select, MenuItem, FormControl, useTheme } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { useTheme as useCustomTheme } from '../../Context/ThemeContext';
import TrustedByMarquee from './TrustedByMarquee';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const sectionRef = useRef(null);
  const theme = useTheme();
  const { colors, gradients, glassmorphism } = useCustomTheme();
  const [formData, setFormData] = useState({
    workEmail: '',
    company: '',
    country: '',
    useCase: '',
    honeypot: '' // Anti-bot field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.honeypot) return;   // bot likely
    
    try {
      // TODO: Send to API endpoint to create Lead and PendingOrg records
      console.log('Access request submitted:', {
        workEmail: formData.workEmail,
        company: formData.company,
        country: formData.country,
        useCase: formData.useCase
      });
      
      // Reset form after submission
      setFormData({ workEmail: '', company: '', country: '', useCase: '', honeypot: '' });
      // Show success message
      setSnackOpen(true);
    } catch (error) {
      console.error('Error submitting access request:', error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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
        background: gradients.darkGlass,
        color: 'white',
        pt: { xs: 24, sm: 18, md: 18 },
        pb: { xs: 10, md: 10 },
        clipPath: {
          xs: 'polygon(0 5%, 50% 10%, 100% 5%, 100% 100%, 0 100%)',
          sm: 'polygon(0 3%, 50% 8%, 100% 3%, 100% 100%, 0 100%)',
          md: 'polygon(0 0, 50% 5%, 100% 0, 100% 100%, 0 100%)'
        },
        mt: { xs: -18, md: -6 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: gradients.primaryGradient,
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: 0.15,
          animation: 'float 6s ease-in-out infinite',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: gradients.accentGradient,
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.12,
          animation: 'float 8s ease-in-out infinite reverse',
          zIndex: 0,
        },
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
          },
          '50%': {
            transform: 'translateY(-20px) scale(1.05)',
          },
        },
      }}
    >
      {/* Additional animated orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '15%',
          width: '200px',
          height: '200px',
          background: gradients.multiGradient,
          borderRadius: '50%',
          filter: 'blur(60px)',
          opacity: 0.1,
          animation: 'float 10s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '30%',
          right: '20%',
          width: '180px',
          height: '180px',
          background: gradients.glowGradient,
          borderRadius: '50%',
          filter: 'blur(70px)',
          opacity: 0.08,
          animation: 'float 7s ease-in-out infinite reverse',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="stretch">
          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                pt: { xs: 4, sm: 2, md: 0 },
              }}
            >
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontWeight: 'bold',
                  mb: 4,
                  fontSize: { xs: '2.2rem', md: '3.5rem' },
                  pt: { xs: 2, md: 0 },
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradients.shimmerGradient,
                    backgroundSize: '200% 100%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    animation: 'shimmer 3s infinite',
                    zIndex: 1,
                  },
                  '@keyframes shimmer': {
                    '0%': {
                      backgroundPosition: '-200% 0',
                    },
                    '100%': {
                      backgroundPosition: '200% 0',
                    },
                  },
                }}
              >
                Request Access
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  mb: 5,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  lineHeight: 1.8,
                  maxWidth: '90%',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Join leading organizations using our AI-powered audit automation platform. Request access to streamline your compliance and audit processes.
              </Typography>

              <Stack spacing={4}>
                                    
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
                      <TrustedByMarquee isContactSection={true} />
                    </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease',
                    transitionDelay: '0.2s',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      ...glassmorphism.card,
                      background: `linear-gradient(135deg, rgba(89, 197, 197, 0.3), rgba(89, 197, 197, 0.1))`,
                      p: 1.5,
                      borderRadius: '50%',
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.accent}, transparent)`,
                        padding: '2px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                      },
                    }}
                  >
                    <LocationOnIcon sx={{ color: colors.accent, fontSize: 28, position: 'relative', zIndex: 1 }} />
                  </Paper>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                      Global Headquarters
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Enterprise compliance solutions worldwide
                    </Typography>
                  </Box>
                </Box>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease',
                    transitionDelay: '0.4s',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      ...glassmorphism.card,
                      background: `linear-gradient(135deg, rgba(111, 207, 151, 0.3), rgba(111, 207, 151, 0.1))`,
                      p: 1.5,
                      borderRadius: '50%',
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.lottieGreen}, transparent)`,
                        padding: '2px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                      },
                    }}
                  >
                    <PhoneIcon sx={{ color: colors.lottieGreen, fontSize: 28, position: 'relative', zIndex: 1 }} />
                  </Paper>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                      Enterprise Support
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      24/7 availability for enterprise clients
                    </Typography>
                  </Box>
                </Box>

                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease',
                    transitionDelay: '0.6s',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      ...glassmorphism.card,
                      background: `linear-gradient(135deg, rgba(89, 197, 197, 0.3), rgba(89, 197, 197, 0.1))`,
                      p: 1.5,
                      borderRadius: '50%',
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colors.accent}, transparent)`,
                        padding: '2px',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        maskComposite: 'exclude',
                        WebkitMaskComposite: 'xor',
                      },
                    }}
                  >
                    <EmailIcon sx={{ color: colors.accent, fontSize: 28, position: 'relative', zIndex: 1 }} />
                  </Paper>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                      Sales Inquiries
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      sales@auditplatform.com
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Grid>

          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                ...glassmorphism.container,
                background: 'rgba(255, 255, 255, 0.08)',
                p: 4,
                borderRadius: 4,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                transitionDelay: '0.3s',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: gradients.multiGradient,
                  borderRadius: '4px 4px 0 0',
                },
              }}
            >
              <TextField
                type="text"
                name="honeypot"
                value={formData.honeypot || ''}
                onChange={handleChange}
                sx={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />
              
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                  }}
                >
                  Work Email
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="workEmail"
                  type="email"
                  value={formData.workEmail}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="your.name@company.com"
                  InputProps={{
                    sx: {
                      ...glassmorphism.card,
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: 2,
                      height: 56,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.18)',
                        boxShadow: `0 0 0 2px ${colors.accent}40`,
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                  }}
                >
                  Company
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Your company name"
                  InputProps={{
                    sx: {
                      ...glassmorphism.card,
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: 2,
                      height: 56,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.18)',
                        boxShadow: `0 0 0 2px ${colors.accent}40`,
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                  }}
                >
                  Country/Region
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    displayEmpty
                    sx={{
                      ...glassmorphism.card,
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: 2,
                      height: 56,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '& .MuiSelect-select': {
                        p: 2
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.18)',
                        boxShadow: `0 0 0 2px ${colors.accent}40`,
                      },
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          ...glassmorphism.strong,
                          background: 'rgba(30, 30, 34, 0.95)',
                          mt: 0.5,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                          '& .MuiMenuItem-root': {
                            color: 'white',
                            '&:hover': {
                              background: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&.Mui-selected': {
                              background: `${colors.primary}40`,
                            },
                          },
                        }
                      }
                    }}
                  >
                    <MenuItem disabled value="" sx={{ fontStyle: 'italic', color: 'rgba(255, 255, 255, 0.5)' }}>
                      Select your country/region
                    </MenuItem>
                    <MenuItem value="US">United States</MenuItem>
                    <MenuItem value="CA">Canada</MenuItem>
                    <MenuItem value="UK">United Kingdom</MenuItem>
                    <MenuItem value="EU">European Union</MenuItem>
                    <MenuItem value="AU">Australia</MenuItem>
                    <MenuItem value="APAC">Asia Pacific</MenuItem>
                    <MenuItem value="LATAM">Latin America</MenuItem>
                    <MenuItem value="MEA">Middle East & Africa</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              
              <Box>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 1, 
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 500,
                  }}
                >
                  Use Case
                </Typography>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={6}
                  name="useCase"
                  value={formData.useCase}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Tell us about your audit and compliance needs. Which frameworks are you working with? What challenges are you looking to solve?"
                  InputProps={{
                    sx: {
                      ...glassmorphism.card,
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: 2,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none'
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.15)',
                      },
                      '&.Mui-focused': {
                        background: 'rgba(255, 255, 255, 0.18)',
                        boxShadow: `0 0 0 2px ${colors.accent}40`,
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.5)',
                        opacity: 1,
                      },
                    }
                  }}
                />
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                sx={{
                  background: gradients.primaryGradient,
                  color: 'white',
                  fontWeight: 'bold',
                  py: 1.5,
                  px: 4,
                  width: 'auto',
                  alignSelf: 'flex-start',
                  mt: 2,
                  borderRadius: 2,
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
                    transition: 'left 0.5s ease',
                  },
                  '&:hover': {
                    background: gradients.primaryGradient,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${colors.primary}40`,
                    '&::before': {
                      left: '100%',
                    },
                  },
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
              >
                Request Access
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackOpen(false)}
          severity="success"
          sx={{ 
            ...glassmorphism.strong,
            background: `linear-gradient(135deg, ${colors.lottieGreen}, ${colors.primary})`,
            color: '#fff',
            fontWeight: 500,
          }}
        >
          Access request received — we'll review and get back to you within 24 hours!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection; 