import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  alpha,
  Paper,
  TextField,
  Button,
  MenuItem,
  Divider,
  Grid
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Star, CalendarMonth, AccessTime, Videocam } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import MembershipPlans from '../Components/ui/MembershipPlans';
import { useTheme } from '../Context/ThemeContext';

const Booking = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    companySize: '',
    auditType: '',
    message: ''
  });
  
  useEffect(() => window.scrollTo(0, 0), []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Demo request submitted:', formData);
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
          backgroundImage: `${gradients.heroOverlay}, url("https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1350&q=80")`,
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
              Book a Demo
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
            Experience the power of AI-driven audit automation. Schedule a personalized demo to see how BlackCore AI can transform your audit processes.
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
              Book Demo
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Demo Booking Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          {/* Demo Booking Form */}
          <Grid container spacing={6} sx={{ mb: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(colors.primary, 0.2)}`,
                  borderRadius: 3,
                  height: '100%',
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    fontFamily: fonts.heading,
                    color: '#ffffff',
                    mb: 3,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Schedule Your Demo
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Work Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Job Title"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Company Size"
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      >
                        <MenuItem value="1-50">1-50 employees</MenuItem>
                        <MenuItem value="51-200">51-200 employees</MenuItem>
                        <MenuItem value="201-1000">201-1000 employees</MenuItem>
                        <MenuItem value="1000+">1000+ employees</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        select
                        label="Audit Type Interest"
                        name="auditType"
                        value={formData.auditType}
                        onChange={handleChange}
                        required
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      >
                        <MenuItem value="internal">Internal Audit</MenuItem>
                        <MenuItem value="external">External Audit</MenuItem>
                        <MenuItem value="both">Both</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Tell us about your audit challenges"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#ffffff',
                            '& fieldset': {
                              borderColor: alpha('#ffffff', 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha('#ffffff', 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.primary,
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha('#ffffff', 0.7),
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{
                          background: gradients.primaryGradient,
                          color: '#ffffff',
                          py: 2,
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
                          '&:hover': {
                            background: gradients.primaryGradient,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 6px 30px ${alpha(colors.primary, 0.4)}`,
                          },
                        }}
                      >
                        Request Demo
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Demo Benefits */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background: alpha(colors.glassWhite, 0.1),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(colors.accent, 0.2)}`,
                    borderRadius: 3,
                    flex: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      fontFamily: fonts.heading,
                      color: '#ffffff',
                      mb: 3,
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    What to Expect
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Videocam sx={{ color: colors.primary, fontSize: 28, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                          Live Product Demo
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                          See BlackCore AI in action with a personalized walkthrough of features relevant to your needs
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <AccessTime sx={{ color: colors.accent, fontSize: 28, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                          30-Minute Session
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                          Efficient demo covering key features, ROI analysis, and Q&A tailored to your audit requirements
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <CalendarMonth sx={{ color: colors.primary, fontSize: 28, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ color: '#ffffff', fontWeight: 'bold', mb: 0.5 }}>
                          Flexible Scheduling
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#ffffff', 0.8) }}>
                          We'll contact you within 24 hours to schedule at your convenience
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 4, p: 3, background: alpha(colors.primary, 0.1), borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center' }}>
                      <strong>Trusted by leading audit firms</strong><br />
                      Join organizations saving 60-80% on audit time
                    </Typography>
                  </Box>
                </Paper>

                {/* Quick Stats */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      flex: 1,
                      background: alpha(colors.glassWhite, 0.1),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(colors.primary, 0.2)}`,
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: colors.primary, fontWeight: 'bold' }}>
                      60-80%
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.7) }}>
                      Time Reduction
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      flex: 1,
                      background: alpha(colors.glassWhite, 0.1),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(colors.accent, 0.2)}`,
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" sx={{ color: colors.accent, fontWeight: 'bold' }}>
                      100%
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#ffffff', 0.7) }}>
                      Compliance
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider 
            sx={{ 
              my: 8,
              background: gradients.primaryGradient,
              height: 2,
              border: 'none',
              borderRadius: 1,
            }} 
          />

          {/* Licensing Options Section Title */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                fontFamily: fonts.heading,
                background: gradients.multiGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              Licensing Options
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: alpha('#ffffff', 0.8),
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Choose the perfect plan for your organization's audit automation needs
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


        </Container>
      </Box>

      <Footer />
      <ChatBot />
    </>
  );
};

export default Booking;
