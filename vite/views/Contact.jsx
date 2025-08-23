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
import { Star, Bolt, TrendingUp, Support, Business, Handshake, QuestionAnswer, AccessTime, HeadsetMic } from '@mui/icons-material';
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
            background: gradients.primaryGradient,
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
          backgroundImage: `${gradients.heroOverlay}, url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1350&q=80")`,
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
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
              }}
            >
              Contact BlackCore AI
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
            Questions about our audit automation platform? Want to schedule a demo? We're here to help transform your audit processes with cutting-edge AI technology.
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
      
      {/* Contact Options Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <HeadsetMic sx={{ fontSize: 24, color: colors.accent }} />
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
                Get in Touch
              </Typography>
              <HeadsetMic sx={{ fontSize: 24, color: colors.primary }} />
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
              Choose the best way to connect with our team based on your needs
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Sales & Demo Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <div
                ref={el => cardRefs.current['sales'] = el}
                data-card-id="sales"
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
                    opacity: visibleCards['sales'] ? 1 : 0,
                    transform: visibleCards['sales']
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
                  <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Business sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{
                        fontWeight: 'bold',
                        fontFamily: fonts.heading,
                        mb: 2,
                        background: gradients.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Sales & Demos
                    </Typography>
                    
                    <Typography 
                      variant="body2"
                      sx={{
                        color: alpha('#ffffff', 0.9),
                        mb: 3,
                        fontFamily: fonts.body,
                        lineHeight: 1.6,
                      }}
                    >
                      Schedule a personalized demo to see how BlackCore AI can transform your audit processes
                    </Typography>

                    <Box sx={{ textAlign: 'left' }}>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: alpha('#ffffff', 0.8),
                          mb: 1,
                          fontFamily: fonts.body,
                        }}
                      >
                        <strong>sales@blackcoreai.com</strong>
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: alpha('#ffffff', 0.7),
                          fontFamily: fonts.body,
                        }}
                      >
                        Response time: 1 business day
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </div>
            </Grid>
            
            {/* Technical Support Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <div
                ref={el => cardRefs.current['support'] = el}
                data-card-id="support"
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
                    opacity: visibleCards['support'] ? 1 : 0,
                    transform: visibleCards['support']
                      ? 'translateY(0)' 
                      : 'translateY(30px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.1s',
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
                  <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Support sx={{ fontSize: 48, color: colors.accent, mb: 2 }} />
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{
                        fontWeight: 'bold',
                        fontFamily: fonts.heading,
                        mb: 2,
                        color: '#ffffff',
                      }}
                    >
                      Technical Support
                    </Typography>
                    
                    <Typography 
                      variant="body2"
                      sx={{
                        color: alpha('#ffffff', 0.9),
                        mb: 3,
                        fontFamily: fonts.body,
                        lineHeight: 1.6,
                      }}
                    >
                      Get help with platform features, integrations, and technical questions
                    </Typography>

                    <Box sx={{ textAlign: 'left' }}>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: alpha('#ffffff', 0.8),
                          mb: 1,
                          fontFamily: fonts.body,
                        }}
                      >
                        <strong>support@blackcoreai.com</strong>
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: alpha('#ffffff', 0.7),
                          mb: 2,
                          fontFamily: fonts.body,
                        }}
                      >
                        Standard: 24-48 hours<br />
                        Enterprise: 4 hours / 24x7
                      </Typography>
                      <Typography 
                        variant="caption"
                        sx={{
                          color: alpha('#ffffff', 0.6),
                          fontFamily: fonts.body,
                          display: 'block',
                        }}
                      >
                        Visit our <Link sx={{ color: colors.accent, textDecoration: 'underline' }} href="#">Help Center</Link> for instant answers
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </div>
            </Grid>

            {/* Enterprise & Partnerships Card */}
            <Grid size={{ xs: 12, md: 4 }}>
              <div
                ref={el => cardRefs.current['enterprise'] = el}
                data-card-id="enterprise"
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
                    opacity: visibleCards['enterprise'] ? 1 : 0,
                    transform: visibleCards['enterprise']
                      ? 'translateY(0)' 
                      : 'translateY(30px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: '0.2s',
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
                  <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <Handshake sx={{ fontSize: 48, color: colors.primary, mb: 2 }} />
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      sx={{
                        fontWeight: 'bold',
                        fontFamily: fonts.heading,
                        mb: 2,
                        background: gradients.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      Enterprise & Partners
                    </Typography>
                    
                    <Typography 
                      variant="body2"
                      sx={{
                        color: alpha('#ffffff', 0.9),
                        mb: 3,
                        fontFamily: fonts.body,
                        lineHeight: 1.6,
                      }}
                    >
                      Custom solutions, volume licensing, and strategic partnership opportunities
                    </Typography>

                    <Box sx={{ textAlign: 'left' }}>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: alpha('#ffffff', 0.8),
                          mb: 1,
                          fontFamily: fonts.body,
                        }}
                      >
                        <strong>enterprise@blackcoreai.com</strong>
                      </Typography>
                      <Typography 
                        variant="body2"
                        sx={{
                          color: alpha('#ffffff', 0.7),
                          fontFamily: fonts.body,
                        }}
                      >
                        Dedicated account management<br />
                        Custom SLAs available
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </div>
            </Grid>
          </Grid>

          {/* FAQ Section */}
          <Box sx={{ mt: 8, mb: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <QuestionAnswer sx={{ fontSize: 24, color: colors.accent, mb: 1 }} />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#ffffff',
                  fontFamily: fonts.heading,
                  mb: 2,
                }}
              >
                Quick Resources
              </Typography>
            </Box>
            
            <Grid container spacing={2} sx={{ maxWidth: 800, mx: 'auto' }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Link 
                  href="#" 
                  sx={{ 
                    textDecoration: 'none',
                    display: 'block',
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    color: alpha('#ffffff', 0.9),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      border: `1px solid ${alpha(colors.primary, 0.4)}`,
                      background: alpha(colors.glassWhite, 0.05),
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: fonts.body }}>
                    Documentation →
                  </Typography>
                </Link>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Link 
                  href="#" 
                  sx={{ 
                    textDecoration: 'none',
                    display: 'block',
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(colors.accent, 0.2)}`,
                    color: alpha('#ffffff', 0.9),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      border: `1px solid ${alpha(colors.accent, 0.4)}`,
                      background: alpha(colors.glassWhite, 0.05),
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: fonts.body }}>
                    API Reference →
                  </Typography>
                </Link>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Link 
                  href="#" 
                  sx={{ 
                    textDecoration: 'none',
                    display: 'block',
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    color: alpha('#ffffff', 0.9),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      border: `1px solid ${alpha(colors.primary, 0.4)}`,
                      background: alpha(colors.glassWhite, 0.05),
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: fonts.body }}>
                    System Status →
                  </Typography>
                </Link>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Link 
                  href="#" 
                  sx={{ 
                    textDecoration: 'none',
                    display: 'block',
                    p: 2,
                    borderRadius: 1,
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                    color: alpha('#ffffff', 0.9),
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      border: `1px solid ${alpha(colors.primary, 0.4)}`,
                      background: alpha(colors.glassWhite, 0.05),
                    }
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontFamily: fonts.body }}>
                    FAQ →
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>

          {/* Call-to-Action Section */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
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
                  Ready to Transform Your Audit Process?
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
                Fill out the form below to request access or schedule a personalized demo
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