// HomeScreen.jsx
import React from 'react';
import { Box, Button } from '@mui/material';
import Banner from './Components/ui/Banner';
import HeaderBar from './Components/ui/HeaderBar';
import Pillars from './Components/ui/Pillars';
import AboutSection from './Components/ui/AboutSection';
import MembershipPlans from './Components/ui/MembershipPlans';
import CallToActionCarousel from './Components/ui/CallToActionCarousel';
import ContactSection from './Components/ui/ContactSection';
import ChatBot from './Components/ui/ChatBot';
import Footer from './Components/ui/Footer';
import ScrollingMarquee from './Components/ui/ScrollingMarquee';
import { usePostHog } from './hooks/usePostHog';
import { posthog } from './Context/PostHogProvider';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './Context/ThemeContext';

const Home = () => {
  const navigate = useNavigate();
  const { fonts, colors, animations, shadows, gradients } = useTheme();
  const { trackEvent } = usePostHog();
  const location = useLocation();

  // Add this test function
  const testPostHog = () => {
    trackEvent('test_posthog_click', {
      timestamp: new Date().toISOString(),
      page: 'home',
      distinct_id: posthog.get_distinct_id()
    });
    console.log('PostHog Distinct ID:', posthog.get_distinct_id());
    alert(`PostHog event sent! Distinct ID: ${posthog.get_distinct_id()}`);
  };

  return (
    <Box 
      component="main"
      role="main"
      id="main-content"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh', 
        bgcolor: '#f8f9fa',
        position: 'relative'
      }}
    >
      <HeaderBar />
      
      {/* Temporary test button - remove after testing */}
      <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
        <Button 
          onClick={testPostHog}
          variant="contained" 
          color="secondary"
          size="small"
        >
          Test PostHog
        </Button>
      </Box>

      {/* Hero Section */}
      <Banner />
      {/* <ScrollingMarquee /> */}
      <Pillars />
      <AboutSection />
      <MembershipPlans />
      <CallToActionCarousel />
      <ContactSection />
      <Footer />
      <ChatBot />
    </Box>
  );
};

export default Home;
