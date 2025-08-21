import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  alpha
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';

import { useDataLayer } from '../Context/DataLayer';
import { membershipPlans, oneTimeServices, giftCardOptions, sizeCategories, getPriceBySize } from '../assets/pricing/membershipPlans';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import GoogleLogin from '../Components/ui/GoogleLogin';
import { useTheme } from '../Context/ThemeContext';
import { useCustomerAuth } from '../hooks/useCustomerAuth';

const Login = () => {
  const { fonts, gradients, colors, glassmorphism } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlan, clearError } = useDataLayer();
  const { 
    checkForCustomer, 
    loginCustomer, 
    signIn, 
    setActive, 
    isLoaded, 
    user, 
    signOut  } = useCustomerAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Process plan information from currentPlan context
  useEffect(() => {
    if (currentPlan) {
      // Find the full plan details from our data sources
      const membershipPlan = membershipPlans.find(p => p.id === currentPlan.id);
      const oneTimePlan = oneTimeServices.find(p => p.id === currentPlan.id);
      const giftCardPlan = giftCardOptions.find(p => p.id === currentPlan.id);
      const planData = membershipPlan || oneTimePlan || giftCardPlan;
      
      if (planData) {
        // Handle different service types
        let serviceType, planType, planTitle, price;
        
        if (membershipPlan) {
          serviceType = 'membership';
          planType = 'membership';
          planTitle = planData.title;
          price = currentPlan.pricing || getPriceBySize(planData, currentPlan.selectedSize || 'small');
        } else if (oneTimePlan) {
          serviceType = 'one-time';
          planType = 'one-time';
          planTitle = planData.title;
          price = currentPlan.pricing || getPriceBySize(planData, currentPlan.selectedSize || 'small');
        } else if (giftCardPlan) {
          serviceType = 'gift-card';
          planType = 'gift-card';
          planTitle = currentPlan.title || planData.title;
          price = currentPlan.pricing;
        }
        
        setSelectedPlan({
          planId: currentPlan.id,
          planTitle: planTitle,
          planType: planType,
          selectedSize: currentPlan.selectedSize || 'small',
          selectedAmount: currentPlan.selectedAmount,
          price: price,
          serviceType: serviceType
        });
      }
    }
  }, [currentPlan]);

  // Check if there's a message from a password reset
  useEffect(() => {
    const resetMessage = localStorage.getItem('password_reset_message');
    if (resetMessage) {
      setLocalError({ message: resetMessage, type: 'success' });
      localStorage.removeItem('password_reset_message');
    }
  }, []);

  // Redirect if already signed in
  useEffect(() => {
    console.log('Login - User ID:', user?.id);
    console.log('Login - Location state:', location.state);
    
    if (user && !isTransitioning) {
      // Check if we have a redirect URL from navigation state (e.g., from checkout)
      if (location.state?.from) {
        console.log('Login - Redirecting to:', location.state.from);
        navigate(location.state.from);
      } else if (currentPlan) {
        // Navigate based on service type
        if (currentPlan.serviceType === 'gift-card') {
          // For gift cards, redirect to gift card purchase page
          navigate(`/gift-cards?amount=${currentPlan.selectedAmount}&type=${currentPlan.id}`);
        } else if (currentPlan.serviceType === 'one-time') {
          // For one-time services, redirect to book appointment
          navigate(`/book-appointment?service=${currentPlan.id}&size=${currentPlan.selectedSize || 'small'}`);
        } else {
          // For membership plans, redirect to subscriptions to complete
          navigate(`/subscriptions?plan=${currentPlan.id}&size=${currentPlan.selectedSize || 'small'}`);
        }
      } else {
        // Otherwise redirect to home or dashboard
        navigate('/layout/dashboard');
      }
    }
  }, [user, currentPlan, navigate, isTransitioning, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear errors when user types
    if (localError) setLocalError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckoutAsGuest = () => {
    // Navigate directly to appropriate checkout page without login
    if (selectedPlan) {
      if (selectedPlan.serviceType === 'one-time') {
        navigate(`/book-appointment?service=${selectedPlan.planId}&size=${selectedPlan.selectedSize}&checkout=true`);
      } else if (selectedPlan.serviceType === 'gift-card') {
        navigate(`/gift-cards?amount=${selectedPlan.selectedAmount}&type=${selectedPlan.planId}&checkout=true`);
      }
    }
  };

  const handleBackToPlanSelection = () => {
    // Navigate back to booking page
    navigate('/booking');
  };

  // Function to show transition UI and delay
  const showTransitionUI = async (message) => {
    setIsTransitioning(true);
    setTransitionMessage(message);
    
    // For Google OAuth, we don't want to wait the full second since we're redirecting
    if (message.includes('Google')) {
      // Just show the UI, don't wait - the redirect will happen
      return;
    }
    
    // For regular login, delay for 1 second
    await new Promise(resolve => setTimeout(resolve, 750));
    
    setIsTransitioning(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return;
    }
    
    if (!formData.password) {
      setLocalError('Password is required');
      return;
    }

    if (!isLoaded) {
      return;
    }
    
    setIsLoading(true);
    setLocalError('');

    const customer = await checkForCustomer(formData.email);
    console.log('Customer:', customer);
    if (!customer || (customer.role !== 'CUSTOMER')) {
      setLocalError('Internal error, please register before atempting to login...');
      setIsLoading(false);
      return;
    }
    
    try {
      // Use Clerk's signIn method
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === 'complete') {
        // Set the active session
        await setActive({ session: result.createdSessionId });
        
        const requestBody = {
          email: formData.email,
          userId: customer.id,
          login: true,
        };

        try {
          const response = await loginCustomer(requestBody);
          
          if (!response || !response.ok) {
            if (response?.status === 404) {
              setLocalError('Please register before attempting to login.');
            } else {
              setLocalError('Login failed. Please try again.');
            }
            setIsLoading(false);
            return;
          }

          console.log('API response status:', response.status);
          console.log('API response ok:', response.ok);
          
          // Show transition UI with success message
          await showTransitionUI('Login successful! Redirecting...');
          
          // Navigation will be handled by the useEffect above when user state updates
          // The useEffect will check location.state.from and redirect accordingly
        } catch (fetchError) {
          console.error('❌ Fetch request failed:', fetchError);
          console.error('Fetch error details:', {
            name: fetchError.name,
            message: fetchError.message,
            stack: fetchError.stack
          });
          await signOut();
          setLocalError('Network error. Please check your connection and try again');
        }

      }else {
        setLocalError('Internal error, please contact administrator....');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setLocalError(err.errors?.[0]?.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = (userData) => {
    // This will be handled by Clerk's OAuth flow

    // console.log('Google login will be handled by Clerk OAuth');
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
            top: '20%',
            right: -64,
            width: 160,
            height: 160,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(50px)',
            animation: 'pulse 5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.2 },
              '50%': { transform: 'scale(1.2)', opacity: 0.35 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            left: -48,
            width: 128,
            height: 128,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(40px)',
            animation: 'pulse 7s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '25%',
            width: 96,
            height: 96,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.1,
            filter: 'blur(30px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
      </Box>

      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          py: 8,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="sm">
          {/* Enhanced Transition overlay */}
          {isTransitioning && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: gradients.darkGlass,
                backdropFilter: 'blur(20px)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: isTransitioning ? 1 : 0,
                transition: 'opacity 0.5s ease-out',
              }}
            >
              {/* Animated gradient orbs for transition */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '10%',
                  right: '10%',
                  width: 200,
                  height: 200,
                  background: 'transparent',
                  borderRadius: '50%',
                  opacity: isTransitioning ? 0.4 : 0,
                  filter: 'blur(80px)',
                  transition: 'opacity 0.3s ease-out',
                  animation: isTransitioning ? 'transitionPulse 3s ease-in-out infinite' : 'none',
                  '@keyframes transitionPulse': {
                    '0%, 100%': { 
                      transform: 'scale(1)', 
                      opacity: 0.4,
                      background: gradients.primaryGradient,
                    },
                    '50%': { 
                      transform: 'scale(1.3)', 
                      opacity: 0.6,
                      background: gradients.primaryGradient,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradients.primaryGradient,
                    borderRadius: '50%',
                    opacity: isTransitioning ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '15%',
                  width: 150,
                  height: 150,
                  background: 'transparent',
                  borderRadius: '50%',
                  opacity: isTransitioning ? 0.3 : 0,
                  filter: 'blur(60px)',
                  transition: 'opacity 0.3s ease-out',
                  animation: isTransitioning ? 'transitionPulse2 4s ease-in-out infinite 1s' : 'none',
                  '@keyframes transitionPulse2': {
                    '0%, 100%': { 
                      transform: 'scale(1)', 
                      opacity: 0.3,
                    },
                    '50%': { 
                      transform: 'scale(1.3)', 
                      opacity: 0.5,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradients.accentGradient,
                    borderRadius: '50%',
                    opacity: isTransitioning ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '60%',
                  left: '5%',
                  width: 100,
                  height: 100,
                  background: 'transparent',
                  borderRadius: '50%',
                  opacity: isTransitioning ? 0.2 : 0,
                  filter: 'blur(40px)',
                  transition: 'opacity 0.3s ease-out',
                  animation: isTransitioning ? 'transitionPulse3 5s ease-in-out infinite 2s' : 'none',
                  '@keyframes transitionPulse3': {
                    '0%, 100%': { 
                      transform: 'scale(1)', 
                      opacity: 0.2,
                    },
                    '50%': { 
                      transform: 'scale(1.3)', 
                      opacity: 0.4,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradients.multiGradient,
                    borderRadius: '50%',
                    opacity: isTransitioning ? 1 : 0,
                    transition: 'opacity 0.3s ease-out',
                  }
                }}
              />

              {/* Main content container */}
              <Box 
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                  p: 4,
                  borderRadius: 3,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(15px)',
                  border: `1px solid ${alpha(colors.primary, 0.3)}`,
                  boxShadow: `0 20px 60px ${alpha(colors.primary, 0.4)}`,
                }}
              >
                {/* Enhanced Lottie animation container */}
                <Box 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 3,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      right: -10,
                      bottom: -10,
                      background: gradients.multiGradient,
                      borderRadius: '50%',
                      opacity: 0.3,
                      filter: 'blur(15px)',
                      animation: 'rotate 4s linear infinite',
                      '@keyframes rotate': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: -5,
                      left: -5,
                      right: -5,
                      bottom: -5,
                      background: gradients.accentGradient,
                      borderRadius: '50%',
                      opacity: 0.2,
                      filter: 'blur(10px)',
                      animation: 'rotate 6s linear infinite reverse',
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 3,
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: alpha(colors.glassWhite, 0.1),
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${alpha(colors.accent, 0.4)}`,
                    }}
                  >
                    <Lottie 
                      animationData={verificationAnimation} 
                      loop={true}
                      autoplay={true}
                      style={{ width: '70%', height: '70%' }}
                    />
                  </Box>
                </Box>

                {/* Enhanced typography */}
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{
                    fontWeight: 'bold',
                    fontFamily: fonts.heading,
                    background: gradients.primaryGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))',
                    mb: 2,
                    textAlign: 'center',
                    animation: 'textGlow 2s ease-in-out infinite',
                    '@keyframes textGlow': {
                      '0%, 100%': { filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))' },
                      '50%': { filter: 'drop-shadow(0 4px 8px rgba(246, 81, 30, 0.8))' },
                    },
                  }}
                >
                  {transitionMessage}
                </Typography>

                {/* Enhanced loading indicator */}
                <Box sx={{ position: 'relative' }}>
                  <CircularProgress 
                    size={40}
                    sx={{ 
                      color: colors.accent,
                    }} 
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      background: gradients.accentGradient,
                      opacity: 0.1,
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 3,
              background: alpha(colors.glassWhite, 0.1),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(colors.primary, 0.2)}`,
              boxShadow: `0 20px 60px ${alpha(colors.primary, 0.3)}`,
              position: 'relative',
              overflow: 'hidden',
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
                opacity: 0.05,
              },
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Star sx={{ fontSize: 24, color: colors.accent }} />
                <Box sx={{ width: 40, height: 40, mr: 1 }}>
                  <Lottie 
                    animationData={verificationAnimation} 
                    loop={true}
                    autoplay={true}
                    style={{ width: '100%', height: '90%' }}
                    aria-hidden="true"
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
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
                  Buster & Co.
                </Typography>
                <Star sx={{ fontSize: 24, color: colors.primary }} />
              </Box>
              
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{
                  fontWeight: 'medium',
                  mb: 1,
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  fontFamily: fonts.heading,
                }}
              >
                Login to Your Account
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{
                  color: alpha('#ffffff', 0.8),
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontFamily: fonts.body,
                }}
              >
                {selectedPlan 
                  ? selectedPlan.serviceType === 'one-time'
                    ? `Sign in to book your ${selectedPlan.planTitle} appointment`
                    : selectedPlan.serviceType === 'gift-card'
                    ? `Sign in to purchase your ${selectedPlan.planTitle}`
                    : `Complete your ${selectedPlan.planTitle} subscription`
                  : 'Sign in to continue'}
              </Typography>
              
              {/* Enhanced Selected Plan Card */}
              {selectedPlan && (
                <Paper
                  elevation={0}
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    background: alpha(colors.lottieGreen, 0.2),
                    backdropFilter: 'blur(15px)',
                    borderRadius: 3,
                    border: `2px solid ${alpha(colors.lottieGreen, 0.5)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 8px 32px ${alpha(colors.lottieGreen, 0.3)}`,
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
                  {/* Enhanced Back arrow */}
                  <IconButton 
                    onClick={handleBackToPlanSelection}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      left: 8,
                      background: alpha(colors.glassWhite, 0.1),
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      border: `1px solid ${alpha('#ffffff', 0.2)}`,
                      '&:hover': {
                        background: alpha(colors.glassWhite, 0.2),
                        transform: 'scale(1.1)',
                        boxShadow: `0 0 15px ${alpha(colors.lottieGreen, 0.5)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                    aria-label="change service selection"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                      <ShoppingCartIcon sx={{ color: '#ffffff' }} />
                      <Typography 
                        variant="body1" 
                        sx={{
                          fontWeight: 'bold',
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          fontFamily: fonts.heading,
                        }}
                      >
                        Selected {selectedPlan.serviceType === 'one-time' 
                          ? 'Service' 
                          : selectedPlan.serviceType === 'gift-card' 
                          ? 'Gift Card' 
                          : 'Plan'}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      component="div"
                      sx={{
                        mb: 1,
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        fontFamily: fonts.body,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <span>
                        {selectedPlan.planTitle}
                        {selectedPlan.serviceType !== 'gift-card' && ` - ${sizeCategories[selectedPlan.selectedSize]?.label} Dog`}
                      </span>
                      <Chip 
                        size="small" 
                        label={selectedPlan.serviceType === 'one-time' || selectedPlan.serviceType === 'gift-card' 
                          ? selectedPlan.price 
                          : selectedPlan.price + '/month'}
                        sx={{ 
                          background: gradients.accentGradient,
                          color: '#ffffff',
                          fontSize: '0.6rem',
                          fontWeight: 'bold',
                          border: `1px solid ${alpha('#ffffff', 0.3)}`,
                        }} 
                      />
                    </Typography>
                    
                    <Typography 
                      variant="caption" 
                      sx={{
                        display: 'block',
                        color: alpha('#ffffff', 0.9),
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        fontFamily: fonts.body,
                        mb: 2,
                      }}
                    >
                      {selectedPlan.serviceType === 'one-time' 
                        ? 'Sign in to book your appointment, or checkout as guest'
                        : selectedPlan.serviceType === 'gift-card'
                        ? 'Sign in to purchase your gift card, or checkout as guest'
                        : 'Sign in to complete your subscription'}
                    </Typography>
                    
                    {/* Enhanced Checkout as Guest Button */}
                    {(selectedPlan.serviceType === 'one-time' || selectedPlan.serviceType === 'gift-card') && (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                          onClick={handleCheckoutAsGuest}
                          variant="contained"
                          size="small"
                          startIcon={<Bolt />}
                          sx={{
                            background: gradients.multiGradient,
                            backgroundSize: '200% 200%',
                            color: '#ffffff',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            px: 3,
                            py: 1,
                            borderRadius: 2,
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
                              boxShadow: `0 0 20px ${alpha(colors.accent, 0.5)}`,
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Checkout as Guest
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}
            </Box>

            {/* Enhanced Display errors */}
            {localError && (
              <Alert 
                severity={localError?.type || 'error'} 
                sx={{ 
                  mb: 3,
                  background: localError?.type === 'success' 
                    ? alpha(colors.lottieGreen, 0.2)
                    : alpha(colors.primary, 0.2),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(localError?.type === 'success' ? colors.lottieGreen : colors.primary, 0.5)}`,
                  color: '#ffffff',
                  '& .MuiAlert-icon': {
                    color: localError?.type === 'success' ? colors.lottieGreen : colors.primary,
                  }
                }}
                onClose={() => setLocalError('')}
              >
                {localError.message || localError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ position: 'relative', zIndex: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading || isTransitioning}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: alpha('#ffffff', 0.7),
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.accent,
                      },
                      '& .MuiOutlinedInput-root': {
                        background: alpha(colors.glassWhite, 0.1),
                        backdropFilter: 'blur(10px)',
                        '& fieldset': {
                          borderColor: alpha(colors.accent, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(colors.accent, 0.5),
                          boxShadow: `0 0 15px ${alpha(colors.accent, 0.2)}`,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                          borderWidth: '2px',
                          boxShadow: `0 0 20px ${alpha(colors.accent, 0.4)}`,
                        },
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiInputBase-input': {
                        color: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading || isTransitioning}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                            disabled={isLoading || isTransitioning}
                            sx={{
                              color: alpha('#ffffff', 0.7),
                              '&:hover': {
                                color: colors.accent,
                                background: alpha(colors.glassWhite, 0.1),
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: alpha('#ffffff', 0.7),
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.accent,
                      },
                      '& .MuiOutlinedInput-root': {
                        background: alpha(colors.glassWhite, 0.1),
                        backdropFilter: 'blur(10px)',
                        '& fieldset': {
                          borderColor: alpha(colors.accent, 0.3),
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(colors.accent, 0.5),
                          boxShadow: `0 0 15px ${alpha(colors.accent, 0.2)}`,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                          borderWidth: '2px',
                          boxShadow: `0 0 20px ${alpha(colors.accent, 0.4)}`,
                        },
                        transition: 'all 0.3s ease',
                      },
                      '& .MuiInputBase-input': {
                        color: '#ffffff',
                      },
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Link 
                      component={RouterLink} 
                      to="/forgot-password" 
                      variant="body2" 
                      sx={{ 
                        color: colors.accent,
                        textDecoration: 'none',
                        fontFamily: fonts.body,
                        '&:hover': {
                          textShadow: `0 0 10px ${colors.accent}`,
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading || !isLoaded || isTransitioning}
                    startIcon={!isLoading ? <Bolt /> : null}
                    endIcon={!isLoading ? <TrendingUp /> : null}
                    sx={{
                      background: isLoading 
                        ? alpha(colors.glassWhite, 0.1) 
                        : gradients.multiGradient,
                      backgroundSize: '200% 200%',
                      color: '#ffffff',
                      py: 1.5,
                      fontWeight: 'bold',
                      borderRadius: 3,
                      border: `1px solid ${alpha('#ffffff', 0.2)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      animation: !isLoading ? 'gradient-shift 4s ease infinite' : 'none',
                      '@keyframes gradient-shift': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' },
                      },
                      '&:hover': !isLoading && !isTransitioning ? {
                        background: gradients.glowGradient,
                        transform: 'scale(1.02)',
                        boxShadow: `0 8px 32px ${alpha(colors.accent, 0.5)}`,
                      } : {},
                      '&:disabled': {
                        color: alpha('#ffffff', 0.6),
                        background: alpha(colors.glassWhite, 0.05),
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
                      '&:hover::before': !isLoading && !isTransitioning ? {
                        left: '100%',
                      } : {},
                    }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Signing In...
                      </Box>
                    ) : selectedPlan?.serviceType === 'one-time' 
                        ? 'Sign In & Book Appointment'
                        : selectedPlan?.serviceType === 'gift-card'
                        ? 'Sign In & Purchase Gift Card'
                        : selectedPlan 
                        ? 'Sign In to Continue' 
                        : 'Sign In'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {/* Enhanced Divider */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3, position: 'relative', zIndex: 2 }}>
              <Divider 
                sx={{ 
                  flexGrow: 1,
                  background: alpha('#ffffff', 0.2),
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  mx: 2,
                  color: alpha('#ffffff', 0.6),
                  fontFamily: fonts.body,
                }}
              >
                OR
              </Typography>
              <Divider 
                sx={{ 
                  flexGrow: 1,
                  background: alpha('#ffffff', 0.2),
                }} 
              />
            </Box>
            
            {/* Google Login Button */}
            <Box sx={{ mb: 1, position: 'relative', zIndex: 2 }}>
              {/* TODO: later we might want to pass selectedPlan to the GoogleLogin component to use for checkout */}
              <GoogleLogin 
                onSuccess={handleGoogleLoginSuccess} 
                showTransitionUI={showTransitionUI} 
                redirectTo={location.state?.from} 
              />
            </Box>
              
            <Box sx={{ mt: 3, textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <Typography 
                variant="body2" 
                sx={{
                  color: alpha('#ffffff', 0.8),
                  fontFamily: fonts.body,
                }}
              >
                Don't have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to={currentPlan ? `/register?from=${encodeURIComponent(location.state?.from || '')}` : "/register"} 
                  sx={{ 
                    color: colors.lottieGreen, 
                    fontWeight: 'medium',
                    textDecoration: 'none',
                    '&:hover': {
                      textShadow: `0 0 10px ${colors.lottieGreen}`,
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                color: alpha('#ffffff', 0.8),
                textTransform: 'none',
                fontFamily: fonts.body,
                background: alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                borderRadius: 2,
                px: 3,
                py: 1,
                '&:hover': {
                  background: alpha(colors.glassWhite, 0.2),
                  color: '#ffffff',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(colors.primary, 0.3)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Login; 