// Banner.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Button, Container, Stack, alpha } from '@mui/material';
// import CredentialsWizard from '../authenticated/components/CredentialsWizard';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { useTheme } from '../../Context/ThemeContext';
import AnimatedDog from './AnimatedDog';

const Banner = () => {
  // const [wizardOpen, setWizardOpen] = useState(false);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { colors, gradients, fonts } = useTheme();
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleVideoLoad = async () => {
      if (videoRef.current) {
        videoRef.current.playbackRate = 0.70;
        
        // Try to play the video, handling iOS restrictions
        try {
          await videoRef.current.play();
        } catch (error) {
          console.log('Autoplay failed (likely on iOS):', error);
          // Optionally, you could show a play button here for mobile users
        }
      }
    };

    // Small delay to ensure video is loaded
    const timer = setTimeout(handleVideoLoad, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle user interaction to enable video playback on iOS
  useEffect(() => {
    const enableVideoPlayback = async () => {
      if (!userInteracted && videoRef.current) {
        try {
          await videoRef.current.play();
          setUserInteracted(true);
        } catch (error) {
          console.log('Video play after interaction failed:', error);
        }
      }
    };

    const handleInteraction = () => {
      enableVideoPlayback();
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };

    // Add event listeners for user interaction
    document.addEventListener('touchstart', handleInteraction, { passive: true });
    document.addEventListener('click', handleInteraction);

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
    };
  }, [userInteracted]);
  
  const handleBookAppointment = () => {
    navigate('/booking');
  };

  const handleVisitShop = () => {
    navigate('/shop');
  };

  return (
    <Box
      component="section"
      aria-label="Main banner"
      sx={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 64px)', // 64px is the standard AppBar height
        overflow: 'hidden',
        backgroundColor: 'rgba(30,30,34, 1)',
      }}
    >


      {/* White Fade Overlay - Top - Only on screens 600px+ */}
      <Box
        sx={{
          position: 'absolute',
          top: 65,
          left: 0,
          right: 0,
          width: '100%',
          height: '15%',
          background: 'linear-gradient(to bottom, rgba(30,30,34, 1) 0%, rgba(30,30,34, 0.8) 40%, rgba(30,30,34, 0) 100%)',
          pointerEvents: 'none',
          zIndex: 10,
          // Only show on screens 600px and wider (sm and up)
          display: { xs: 'block', sm: 'none' },
        }}
      />

      {/* Background Video */}
      <Box
        component="video"
        ref={videoRef}
        // src="https://download.samplelib.com/mp4/sample-15s.mp4"
        src="https://imgur.com/N1PB9qP.mp4"
        alt="grooming van background"
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        aria-hidden="true"
        sx={{
          width: '100%',
          height: { xs: '80%', sm: '100%' },
          objectFit: 'fill',
          transform: { 
            xs: 'translate(0%, 10%)',  // Apply transform for screens <= 420px
            sm: 'none'                 // No transform for screens > 600px
          },
          filter: 'brightness(0.7)',
          // Custom breakpoint for 420px and below
          '@media (max-width: 420px)': {
            height: '80%',
            transform: 'translate(0%, 10%)',
          },
          // Custom breakpoint for 421px to 600px
          '@media (min-width: 421px) and (max-width: 600px)': {
            height: '80%',
            transform: 'translate(0%, 10%)',
          },
        }}
      />
      
      {/* White Fade Overlay - Bottom - Responsive to video positioning */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          width: '100%',
          background: 'linear-gradient(to bottom, rgba(30,30,34, 0.01) 0%, rgba(30,30,34, 1) 50%, rgba(30,30,34, 1) 100%)',
          pointerEvents: 'none', // Allow clicks to pass through
          zIndex: 1, // Above video but below content
          // Responsive positioning to match video
          top: { 
            xs: 'calc(80% * 0.85 + 10%)', // For mobile: 80% video height * 85% + 10% transform offset
            sm: '85%' // For larger screens: standard 85% from top
          },
          height: { 
            xs: 'calc(80% * 0.15)', // For mobile: 15% of the 80% video height
            sm: '15%' // For larger screens: standard 15%
          },
          // Custom breakpoints to match video behavior
          '@media (max-width: 420px)': {
            top: 'calc(80% * 0.85 + 10%)', // 80% video height * 85% position + 10% transform
            height: 'calc(80% * 0.15)', // 15% of 80% video height
          },
          '@media (min-width: 421px) and (max-width: 600px)': {
            top: 'calc(80% * 0.85 + 10%)', // 80% video height * 85% position (no transform)
            height: 'calc(80% * 0.15)', // 15% of 80% video height
          },
        }}
      />
      
      {/* Content Overlay */}
      <Container
        component="div"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          color: 'white',
          paddingLeft: { xs: 2, md: 8 },
          paddingRight: { xs: 2, md: 0 },
          maxWidth: { xs: '100%', md: '60%' },
          zIndex: 2, // Above the white fade overlay
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Star sx={{ fontSize: { xs: 24, md: 32 }, color: colors.primary }} />
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 'bold',
              mb: 0,
              fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
              background: gradients.multiGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
              fontFamily: fonts.heading,
            }}
          >
            Premium Pet Care,
          </Typography>
          <Star sx={{ fontSize: { xs: 20, md: 28 }, color: colors.accent }} />
        </Box>
        
        <Typography
          variant="h1"
          component="span"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2rem', sm: '3rem', md: '4rem' },
            background: gradients.accentGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 8px rgba(0,0,0,0.5)',
            filter: 'drop-shadow(0 2px 4px rgba(0,255,255,0.3))',
            fontFamily: fonts.heading,
          }}
        >
          At Your Door.
        </Typography>
        
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 3,
            fontWeight: 'normal',
            fontSize: { xs: '1.2rem', md: '1.5rem' },
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0,0,0,0.6)',
            fontFamily: fonts.body,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: -8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 4,
              height: '80%',
              background: gradients.primaryGradient,
              borderRadius: 2,
            }
          }}
        >
          Professional mobile grooming services that bring stress-free care directly to your home.
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          gap: 2,
          mb: 4
        }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Bolt />}
            endIcon={<PetsIcon />}
            aria-label="Book Appointment"
            onClick={handleBookAppointment}
            sx={{
              background: gradients.multiGradient,
              backgroundSize: '200% 200%',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '12px 30px',
              borderRadius: 3,
              border: `2px solid ${alpha('#ffffff', 0.2)}`,
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
                boxShadow: `0 8px 32px ${alpha(colors.primary, 0.5)}`,
              },
              '&:focus': {
                outline: `3px solid ${colors.accent}`,
                outlineOffset: '2px',
              },
              width: { xs: '100%', sm: 'fit-content' },
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
            Book Appointment
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={ <TrendingUp />}
            endIcon={<ShoppingBagIcon />}
            aria-label="Shop Pet Products"
            onClick={handleVisitShop}
            sx={{
              borderColor: alpha('#ffffff', 0.3),
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '12px 30px',
              borderRadius: 3,
              background: alpha(colors.glassWhite, 0.1),
              backdropFilter: 'blur(15px)',
              border: `2px solid ${alpha('#ffffff', 0.3)}`,
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                background: alpha(colors.glassWhite, 0.2),
                borderColor: colors.accent,
                color: colors.accent,
                transform: 'scale(1.05)',
                boxShadow: `0 8px 32px ${alpha(colors.accent, 0.3)}`,
              },
              '&:focus': {
                outline: `3px solid ${colors.accent}`,
                outlineOffset: '2px',
              },
              width: { xs: '100%', sm: 'fit-content' },
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
            Shop Pet Products
          </Button>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Star sx={{ fontSize: 16, color: colors.lottieGreen }} />
          <Typography
            variant="body1"
            component="p"
            sx={{
              fontSize: { xs: '0.9rem', md: '1.1rem' },
              opacity: 0.9,
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.6)',
              fontFamily: fonts.body,
              fontWeight: 500,
            }}
          >
            Licensed. Insured. Your pet's comfort is our priority.
          </Typography>
          <Star sx={{ fontSize: 16, color: colors.lottieTeal }} />
        </Box>
      </Container>

      {/* Animated Dog positioned below video area */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: '7%', sm: '5%' },
          left: 0,
          right: 0,
          zIndex: 3, // Above all other content
          pointerEvents: 'none', // Don't interfere with interactions
        }}
      >
        <AnimatedDog />
      </Box>

      {/* Credentials Wizard Modal */}
      {/* <CredentialsWizard open={wizardOpen} onClose={handleCloseWizard} /> */}
    </Box>
  );
};

export default Banner;
