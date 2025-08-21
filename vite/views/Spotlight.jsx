// Spotlight.jsx
import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  Fade,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import AnimatedDog from '../Components/ui/AnimatedDog';
import { useTheme } from '../Context/ThemeContext';
import sampleStories from '../assets/spotlight/sampleStories';

const Spotlight = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  const [visibleStories, setVisibleStories] = useState({});
  const storyRefs = useRef({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Enhanced Intersection Observer for story animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const storyId = entry.target.getAttribute('data-story-id');
          if (entry.isIntersecting && storyId) {
            setVisibleStories((prev) => ({
              ...prev,
              [storyId]: true
            }));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all story cards
    Object.values(storyRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(storyRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [sampleStories]);

  // Split stories into featured (first 2) and regular (next 3)
  const featuredStories = sampleStories.slice(0, 2);
  const regularStories = sampleStories.slice(2, 5);

  const renderStoryCard = (story, index, isFeatured = false) => (
    <div
      key={story.id}
      ref={el => storyRefs.current[story.id] = el}
      data-story-id={story.id}
    >
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          background: isFeatured 
            ? alpha(colors.glassWhite, 0.15)
            : alpha(colors.glassWhite, 0.1),
          backdropFilter: 'blur(20px)',
          border: isFeatured 
            ? `2px solid ${alpha(colors.accent, 0.5)}` 
            : `1px solid ${alpha(colors.primary, 0.2)}`,
          borderRadius: 3,
          opacity: visibleStories[story.id] ? 1 : 0,
          transform: visibleStories[story.id] 
            ? 'translateY(0)' 
            : 'translateY(30px)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDelay: `${index * 0.1}s`,
          // Extremely subtle floating animation
          animation: visibleStories[story.id] 
            ? `subtleFloat 6s ease-in-out infinite ${(index * 0.3)}s` 
            : 'none',
          '@keyframes subtleFloat': {
            '0%, 100%': { 
              transform: 'translateY(0px)',
            },
            '25%': { 
              transform: 'translateY(-1px)',
            },
            '50%': { 
              transform: 'translateY(-2px)',
            },
            '75%': { 
              transform: 'translateY(-1px)',
            },
          },
          '&:hover': {
            transform: 'translateY(-12px) scale(1.02)',
            boxShadow: isFeatured 
              ? `0 20px 60px ${alpha(colors.accent, 0.4)}`
              : `0 16px 48px ${alpha(colors.primary, 0.3)}`,
            border: isFeatured 
              ? `2px solid ${alpha(colors.accent, 0.8)}` 
              : `1px solid ${alpha(colors.primary, 0.5)}`,
            background: isFeatured 
              ? alpha(colors.glassWhite, 0.2)
              : alpha(colors.glassWhite, 0.15),
            animation: 'none', // Pause floating on hover
            '&::before': {
              opacity: 1,
            }
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
            borderRadius: 3,
          },
          // Featured badge for featured stories
          ...(isFeatured && {
            '&::after': {
              content: '"✨ Featured"',
              position: 'absolute',
              top: 16,
              right: 16,
              background: gradients.accentGradient,
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              padding: '4px 12px',
              borderRadius: 2,
              zIndex: 3,
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              boxShadow: `0 4px 15px ${alpha(colors.accent, 0.4)}`,
            }
          })
        }}
      >
        <CardMedia
          component="img"
          image={story.image}
          alt={story.title}
          height={isFeatured ? "280" : "220"}
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.5s ease, filter 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              filter: 'brightness(1.1) contrast(1.05)',
            },
          }}
        />
        <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontSize: '0.875rem',
              fontWeight: 500,
              color: alpha('#ffffff', 0.7),
              textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              mb: 1,
            }}
          >
            {story.date}
          </Typography>
          <Typography 
            variant={isFeatured ? "h5" : "h6"} 
            component="h3" 
            gutterBottom 
            sx={{
              fontWeight: 'bold',
              mb: 2,
              lineHeight: 1.3,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontFamily: fonts.heading,
              transition: 'all 0.3s ease',
              '&:hover': {
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))',
              }
            }}
          >
            {story.title}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
              fontSize: isFeatured ? '1rem' : '0.875rem',
              color: alpha('#ffffff', 0.85),
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              fontFamily: fonts.body,
            }}
          >
            {story.excerpt}
          </Typography>
          <Button
            component={RouterLink}
            to={story.link}
            variant="contained"
            startIcon={isFeatured ? <Star /> : <Bolt />}
            endIcon={<TrendingUp />}
            sx={{
              mt: 'auto',
              background: isFeatured 
                ? gradients.multiGradient 
                : gradients.primaryGradient,
              backgroundSize: '200% 200%',
              color: '#ffffff',
              fontWeight: 'bold',
              borderRadius: 2,
              px: 3,
              py: 1,
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              position: 'relative',
              overflow: 'hidden',
              animation: 'gradient-shift 4s ease infinite',
              '@keyframes gradient-shift': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
              '&:hover': {
                background: gradients.glowGradient,
                transform: 'scale(1.05)',
                boxShadow: `0 8px 32px ${alpha(isFeatured ? colors.accent : colors.primary, 0.5)}`,
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
              '&:hover::before': {
                left: '100%',
              },
            }}
          >
            Read Story
          </Button>
        </CardContent>
      </Card>
    </div>
  );

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
          backgroundImage: `${gradients.heroOverlay}, url("https://imgur.com/d6ZzdOS.png")`,
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
              Spotlight
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
            Amazing transformations, happy customers, and the stories that make our tails wag.
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
              Spotlight
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>
      
      {/* Stories Section */}
      <Box sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">

          {/* Featured Stories - 2 centered at top */}
          {featuredStories.length > 0 && (
            <Box sx={{ mb: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 4 }}>
                <Star sx={{ fontSize: 24, color: colors.accent }} />
                <Typography 
                  variant="h4" 
                  component="h2" 
                  align="center" 
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
                  Featured Stories
                </Typography>
                <Star sx={{ fontSize: 24, color: colors.primary }} />
              </Box>
              <Grid container spacing={4} justifyContent="center">
                {featuredStories.map((story, index) => (
                  <Grid item key={story.id} size={{ xs: 12, sm: 6, md: 5 }}>
                    {renderStoryCard(story, index, true)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Regular Stories - 3 underneath */}
          {regularStories.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 4 }}>
                <Star sx={{ fontSize: 20, color: colors.accent }} />
                <Typography 
                  variant="h4" 
                  component="h2" 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontFamily: fonts.heading,
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  More Stories
                </Typography>
                <Star sx={{ fontSize: 20, color: colors.primary }} />
              </Box>
              <Grid container spacing={4}>
                {regularStories.map((story, index) => (
                  <Grid item key={story.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    {renderStoryCard(story, index + featuredStories.length, false)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default Spotlight; 