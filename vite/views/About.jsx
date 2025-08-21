// About.jsx
import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Breadcrumbs,
  Link,
  Divider,
  Paper,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import PetsIcon from '@mui/icons-material/Pets';
import StarIcon from '@mui/icons-material/Star';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import { useTheme } from '../Context/ThemeContext';
import story from '../assets/story/story';

const About = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  const [visibleSections, setVisibleSections] = useState({});
  const [visibleValues, setVisibleValues] = useState({});
  const sectionRefs = useRef({});
  const valueRefs = useRef({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Enhanced Intersection Observer for section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.getAttribute('data-section-id');
          if (entry.isIntersecting && sectionId) {
            setVisibleSections((prev) => ({
              ...prev,
              [sectionId]: true
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all section elements
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [story.sections]);

  // Enhanced Intersection Observer for values animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const valueId = entry.target.getAttribute('data-value-id');
          if (entry.isIntersecting && valueId) {
            setVisibleValues((prev) => ({
              ...prev,
              [valueId]: true
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all value elements
    Object.values(valueRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(valueRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [story.values]);

  // Icon mapping function
  const getIcon = (iconName, color) => {
    const iconProps = { fontSize: 32, color: '#ffffff' };
    
    switch (iconName) {
      case 'favorite':
        return <FavoriteIcon sx={iconProps} />;
      case 'home':
        return <HomeIcon sx={iconProps} />;
      case 'pets':
        return <PetsIcon sx={iconProps} />;
      case 'star':
        return <StarIcon sx={iconProps} />;
      default:
        return <PetsIcon sx={iconProps} />;
    }
  };

  // Content rendering function
  const renderContent = (contentItem) => {
    const { text, style } = contentItem;
    
    const getTypographyProps = (style) => {
      switch (style) {
        case 'primary-bold':
          return {
            variant: 'body1',
            paragraph: true,
            sx: { 
              lineHeight: 1.8,
              color: '#ffffff',
              fontWeight: 'medium',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontFamily: fonts.body,
            }
          };
        case 'secondary':
          return {
            variant: 'body1',
            paragraph: true,
            sx: { 
              lineHeight: 1.8,
              color: alpha('#ffffff', 0.85),
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontFamily: fonts.body,
            }
          };
        default:
          return {
            variant: 'body1',
            paragraph: true,
            sx: { 
              lineHeight: 1.8,
              color: alpha('#ffffff', 0.85),
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontFamily: fonts.body,
            }
          };
      }
    };

    return (
      <Typography key={text.substring(0, 20)} {...getTypographyProps(style)}>
        {text}
      </Typography>
    );
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
            top: '8%',
            right: -64,
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
            top: '40%',
            left: -48,
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
            bottom: '15%',
            right: '25%',
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
          backgroundImage: `${gradients.heroOverlay}, url("${story.hero.backgroundImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: '35% 35%',
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
              {story.hero.title}
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
            {story.hero.subtitle}
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
              About
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>
      
      {/* Enhanced Story Sections */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          {/* Dynamic Story Sections */}
          {story.sections.map((section, index) => (
            <div
              key={section.id}
              ref={el => sectionRefs.current[section.id] = el}
              data-section-id={section.id}
            >
              <Paper
                elevation={0}
                sx={{
                  mb: 8,
                  p: { xs: 3, md: 4 },
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(colors.primary, 0.2)}`,
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: visibleSections[section.id] ? 1 : 0,
                  transform: visibleSections[section.id]
                    ? 'translateY(0)' 
                    : 'translateY(30px)',
                  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                  transitionDelay: `${index * 0.2}s`,
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
                <Grid container spacing={6} alignItems="center">
                  <Grid 
                    size={{ xs: 12, md: 6 }} 
                    sx={{ 
                      order: section.imagePosition === 'left' ? { xs: 2, md: 1 } : 1 
                    }}
                  >
                    {section.imagePosition === 'left' ? (
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 3,
                          ...glassmorphism.card,
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: `0 12px 40px ${alpha(colors.accent, 0.3)}`,
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box
                          component="img"
                          src={section.image}
                          alt={section.imageAlt}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            transition: 'transform 0.5s ease, filter 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              filter: 'brightness(1.1) contrast(1.05)',
                            },
                          }}
                        />
                      </Box>
                    ) : (
                      <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                          <Star sx={{ fontSize: 20, color: colors.accent }} />
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
                            {section.title}
                          </Typography>
                          <Star sx={{ fontSize: 20, color: colors.primary }} />
                        </Box>
                        {section.content.map(renderContent)}
                      </Box>
                    )}
                  </Grid>
                  <Grid 
                    size={{ xs: 12, md: 6 }} 
                    sx={{ 
                      order: section.imagePosition === 'left' ? { xs: 1, md: 2 } : 2 
                    }}
                  >
                    {section.imagePosition === 'left' ? (
                      <Box sx={{ position: 'relative', zIndex: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                          <Star sx={{ fontSize: 20, color: colors.accent }} />
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
                            {section.title}
                          </Typography>
                          <Star sx={{ fontSize: 20, color: colors.primary }} />
                        </Box>
                        {section.content.map(renderContent)}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: 3,
                          ...glassmorphism.card,
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: `0 12px 40px ${alpha(colors.accent, 0.3)}`,
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <Box
                          component="img"
                          src={section.image}
                          alt={section.imageAlt}
                          sx={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            transition: 'transform 0.5s ease, filter 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              filter: 'brightness(1.1) contrast(1.05)',
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </div>
          ))}

          {/* Enhanced Memorial Section */}
          <Paper
            elevation={0}
            sx={{
              background: `linear-gradient(135deg, ${colors.lottieGreen}, ${colors.accent})`,
              color: '#ffffff',
              borderRadius: 3,
              p: 4,
              mt: 4,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: `2px solid ${alpha('#ffffff', 0.3)}`,
              boxShadow: `0 8px 32px ${alpha(colors.lottieGreen, 0.4)}`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 12px 40px ${alpha(colors.lottieGreen, 0.6)}`,
              },
              transition: 'all 0.3s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: gradients.shimmerGradient,
                animation: 'shimmer 3s ease-in-out infinite',
                '@keyframes shimmer': {
                  '0%': { left: '-100%' },
                  '100%': { left: '100%' },
                },
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Star sx={{ fontSize: 24, color: '#ffffff' }} />
                <Typography 
                  variant="h5" 
                  sx={{
                    fontWeight: 'bold',
                    fontFamily: fonts.heading,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  {story.memorial.title}
                </Typography>
                <Star sx={{ fontSize: 24, color: '#ffffff' }} />
              </Box>
              <Typography 
                variant="body1" 
                sx={{ 
                  maxWidth: 600, 
                  mx: 'auto',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                  lineHeight: 1.6,
                }}
              >
                {story.memorial.content}
              </Typography>
            </Box>
          </Paper>
          
          <Divider 
            sx={{ 
              my: 8,
              background: gradients.primaryGradient,
              height: 2,
              border: 'none',
              borderRadius: 1,
            }} 
          />
          
          {/* Enhanced Values Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Star sx={{ fontSize: 28, color: colors.accent }} />
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
                  filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
                }}
              >
                Our Values
              </Typography>
              <Star sx={{ fontSize: 28, color: colors.primary }} />
            </Box>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 6, 
                maxWidth: 800, 
                mx: 'auto',
                color: alpha('#ffffff', 0.8),
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                fontFamily: fonts.body,
                lineHeight: 1.6,
              }}
            >
              At Buster & Co., everything we do is guided by serving, family, & cultivating happiness; unconditionally.
            </Typography>
            
            <Grid container spacing={4}>
              {story.values.map((value, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={value.id}>
                  <div
                    ref={el => valueRefs.current[value.id] = el}
                    data-value-id={value.id}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        height: '100%',
                        background: alpha(colors.glassWhite, 0.1),
                        backdropFilter: 'blur(15px)',
                        border: `1px solid ${alpha(colors[value.color] || colors.primary, 0.3)}`,
                        borderRadius: 3,
                        position: 'relative',
                        overflow: 'hidden',
                        opacity: visibleValues[value.id] ? 1 : 0,
                        transform: visibleValues[value.id]
                          ? 'translateY(0) scale(1)' 
                          : 'translateY(30px) scale(0.9)',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        transitionDelay: `${index * 0.1}s`,
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: `0 16px 48px ${alpha(colors[value.color] || colors.primary, 0.4)}`,
                          border: `1px solid ${alpha(colors[value.color] || colors.primary, 0.6)}`,
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
                          height: 80, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${colors[value.color] || colors.primary}, ${colors.accent})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: `0 8px 32px ${alpha(colors[value.color] || colors.primary, 0.4)}`,
                            animation: 'iconPulse 3s ease-in-out infinite',
                            '@keyframes iconPulse': {
                              '0%, 100%': { boxShadow: `0 8px 32px ${alpha(colors[value.color] || colors.primary, 0.4)}` },
                              '50%': { boxShadow: `0 12px 40px ${alpha(colors[value.color] || colors.primary, 0.6)}` },
                            },
                          }}
                        >
                          {getIcon(value.icon, value.color)}
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        sx={{
                          fontWeight: 'medium',
                          mb: 2,
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          fontFamily: fonts.heading,
                        }}
                      >
                        {value.title}
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
                        {value.description}
                      </Typography>
                    </Paper>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default About; 