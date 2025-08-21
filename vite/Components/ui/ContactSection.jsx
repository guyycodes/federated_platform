import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Container, Grid, TextField, Button, Stack, Paper, Select, MenuItem, FormControl, useTheme } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { useTheme as useCustomTheme } from '../../Context/ThemeContext';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const sectionRef = useRef(null);
  const theme = useTheme();
  const { colors, gradients, glassmorphism } = useCustomTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: '',
    company: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.company) return;   // bot likely
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', reason: '', message: '', company: '' });
    // Show success message
    setSnackOpen(true);
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
          md: 'polygon(0 0, 50% 10%, 100% 0, 100% 100%, 0 100%)'
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
                Let's Talk About Your Pet
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
                Book an appointment, ask about our services, or just say hello. We're here to help your furry friend look and feel their best.
              </Typography>

              <Stack spacing={4}>
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
                      Our Salon
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      123 Pet Paradise Lane, Brooklyn, NY 11201
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
                      Call or Text
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      (555) PAW-CUTS
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
                      Email Us
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      hello@busterandco.com
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
                name="company"
                value={formData.company || ''}
                onChange={handleChange}
                sx={{ display: 'none' }}
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
                  Name
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Your name"
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
                  Email
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="your.email@example.com"
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
                  Contact Reason
                </Typography>
                <FormControl fullWidth required>
                  <Select
                    name="reason"
                    value={formData.reason}
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
                      How can we help you?
                    </MenuItem>
                    <MenuItem value="appointment">Book an Appointment</MenuItem>
                    <MenuItem value="services">Ask About Services</MenuItem>
                    <MenuItem value="care-guide">Pet Care Question</MenuItem>
                    <MenuItem value="grooming">Grooming Consultation</MenuItem>
                    <MenuItem value="other">General Inquiry</MenuItem>
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
                  Message
                </Typography>
                <TextField
                  required
                  fullWidth
                  multiline
                  rows={6}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  variant="outlined"
                  placeholder="Tell us about your pet and how we can help..."
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
                Send Message
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
          Message sent — we'll get back to you soon! 🐾
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default ContactSection; 