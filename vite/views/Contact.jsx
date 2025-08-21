// Contact.jsx
import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  Breadcrumbs,
  Link,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Star, Bolt, TrendingUp, LocationOn, Schedule, Phone, Email } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import ContactSection from '../Components/ui/ContactSection';
import { useTheme } from '../Context/ThemeContext';

const Contact = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  const [visibleCards, setVisibleCards] = useState({});
  const cardRefs = useRef({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Enhanced Intersection Observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          if (entry.isIntersecting && cardId) {
            setVisibleCards((prev) => ({
              ...prev,
              [cardId]: true
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all card elements
    Object.values(cardRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(cardRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

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
            top: '10%',
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
              Contact Buster & Co.
            </Typography>
            <Star sx={{ fontSize: 28, color: colors.accent }} />
          </Box>
          
          <Typography 
            variant="h6" 
            component="p"
            sx={{ 
              maxWidth: { md: '70%' }, 
              mb: 4,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              fontWeight: 500,
              fontFamily: fonts.body,
            }}
          >
            Questions about our grooming services? Want to schedule an appointment? We're here to help make your pet look and feel their best.
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
              Contact
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>
      
      {/* Enhanced Location Information Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <LocationOn sx={{ fontSize: 24, color: colors.accent }} />
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
                Visit Our Studio
              </Typography>
              <LocationOn sx={{ fontSize: 24, color: colors.primary }} />
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
              Professional grooming services in a comfortable, modern studio designed for your pet's comfort
            </Typography>
          </Box>

          <Grid container spacing={5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <div
                ref={el => cardRefs.current['studio'] = el}
                data-card-id="studio"
              >
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    background: alpha(colors.glassWhite, 0.1),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: visibleCards['studio'] ? 1 : 0,
                    transform: visibleCards['studio']
                      ? 'translateY(0)' 
                      : 'translateY(30px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 48px ${alpha(colors.primary, 0.3)}`,
                      border: `1px solid ${alpha(colors.primary, 0.4)}`,
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
                      opacity: 0.1,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <Star sx={{ fontSize: 20, color: colors.accent }} />
                      <Typography 
                        variant="h4" 
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
                        Our Grooming Studio
                      </Typography>
                      <Star sx={{ fontSize: 20, color: colors.primary }} />
                    </Box>
                    
                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LocationOn sx={{ fontSize: 18, color: colors.accent }} />
                        <Typography 
                          variant="h6" 
                          sx={{
                            fontWeight: 'bold',
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            fontFamily: fonts.heading,
                          }}
                        >
                          Address
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{
                          color: alpha('#ffffff', 0.9),
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          fontFamily: fonts.body,
                          lineHeight: 1.8,
                          ml: 3,
                        }}
                      >
                        <strong>Buster & Co. Pet Grooming</strong><br />
                        123 Pet Street #1<br />
                        Your City, State 12345
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Phone sx={{ fontSize: 18, color: colors.accent }} />
                        <Typography 
                          variant="h6" 
                          sx={{
                            fontWeight: 'bold',
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            fontFamily: fonts.heading,
                          }}
                        >
                          Contact Info
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{
                          color: alpha('#ffffff', 0.9),
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          fontFamily: fonts.body,
                          lineHeight: 1.8,
                          ml: 3,
                        }}
                      >
                        Phone: (555) 867-5309<br />
                        Email: hello@busterandco.com
                      </Typography>
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Schedule sx={{ fontSize: 18, color: colors.accent }} />
                        <Typography 
                          variant="h6" 
                          sx={{
                            fontWeight: 'bold',
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            fontFamily: fonts.heading,
                          }}
                        >
                          Business Hours
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1"
                        sx={{
                          color: alpha('#ffffff', 0.9),
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                          fontFamily: fonts.body,
                          lineHeight: 1.8,
                          ml: 3,
                        }}
                      >
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 5:00 PM<br />
                        Sunday: 10:00 AM - 4:00 PM<br />
                        <em>Appointments recommended</em>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </div>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <div
                ref={el => cardRefs.current['map'] = el}
                data-card-id="map"
              >
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    background: alpha(colors.glassWhite, 0.1),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha(colors.accent, 0.2)}`,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: visibleCards['map'] ? 1 : 0,
                    transform: visibleCards['map']
                      ? 'translateY(0)' 
                      : 'translateY(30px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 48px ${alpha(colors.accent, 0.3)}`,
                      border: `1px solid ${alpha(colors.accent, 0.4)}`,
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
                      opacity: 0.1,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <Star sx={{ fontSize: 20, color: colors.accent }} />
                      <Typography 
                        variant="h4" 
                        component="h2" 
                        sx={{
                          fontWeight: 'bold',
                          fontFamily: fonts.heading,
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}
                      >
                        Find Us
                      </Typography>
                      <Star sx={{ fontSize: 20, color: colors.primary }} />
                    </Box>
                    
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: 3,
                        overflow: 'hidden',
                        mb: 3,
                        ...glassmorphism.card,
                        '&:hover': {
                          transform: 'scale(1.02)',
                          boxShadow: `0 12px 40px ${alpha(colors.accent, 0.3)}`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Box 
                        component="iframe"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.822873401838!2d-74.00799358459249!3d40.72820097932924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25991b4d2fb85%3A0xf86c7812e4838bdb!2s123%20Pet%20Street%2C%20Your%20City%2C%20State%2012345!5e0!3m2!1sen!2sus!4v1683898200000!5m2!1sen!2sus"
                        width="100%"
                        height="300"
                        style={{ border: 0, display: 'block' }}
                        allowFullScreen=""
                        loading="lazy"
                        title="Buster & Co. Pet Grooming Location"
                      />
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: alpha('#ffffff', 0.85),
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        fontFamily: fonts.body,
                        lineHeight: 1.6,
                      }}
                    >
                      Our full-service grooming studio is conveniently located with easy parking and a comfortable waiting area for pet parents.
                    </Typography>
                  </Box>
                </Paper>
              </div>
            </Grid>
          </Grid>

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
                  Ready to Schedule an Appointment?
                </Typography>
                <TrendingUp sx={{ fontSize: 20, color: colors.primary }} />
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                }}
              >
                Use our contact form below or give our chatbot a try to book your pet's grooming session
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Enhanced ContactSection Wrapper */}
      <Box
        sx={{
          position: 'relative',
          background: alpha(colors.glassWhite, 0.05),
          backdropFilter: 'blur(10px)',
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
        <ContactSection />
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default Contact; 