import React, { useState, useEffect, useRef } from 'react';
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
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  alpha
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckIcon from '@mui/icons-material/Check';
import PetsIcon from '@mui/icons-material/Pets';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import GoogleRegister from '../Components/ui/GoogleRegister';
import { useDataLayer } from '../Context/DataLayer';
import { membershipPlans, oneTimeServices, sizeCategories, getPriceBySize } from '../assets/pricing/membershipPlans';
import { useSignUp } from '@clerk/clerk-react';
import { useTheme } from '../Context/ThemeContext';

// TextField styling with glassmorphism theme - moved inside component to access theme
const getTextFieldStyling = (colors) => ({
  '& .MuiInputLabel-root': {
    color: 'rgba(255,255,255,0.7)',
  },
  '& .MuiOutlinedInput-root': {
    color: '#ffffff',
    '& fieldset': {
      borderColor: `rgba(255,255,255,0.3)`,
    },
    '&:hover fieldset': {
      borderColor: colors.primary,
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.accent,
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: colors.accent,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: colors.accent,
  }
});

const Register = () => {
  const { isLoading: dataLayerLoading, error: dataLayerError, clearError, currentPlan, clearPlan } = useDataLayer();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { colors, gradients, fonts } = useTheme();
  const location = useLocation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    phone: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSize, setSelectedSize] = useState('small');
  const [serviceType, setServiceType] = useState('membership'); // 'membership' or 'one-time'
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState('');
  const navigate = useNavigate();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Prevent browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Check for plan from state or query params
    const planFromState = location.state?.plan;
    const queryParams = new URLSearchParams(location.search);
    const fromPath = location.state?.from || queryParams.get('from');
    
    // Set selected plan from context if available
    if (currentPlan) {
      // Extract the selectedSize from currentPlan if available
      const sizeFromContext = currentPlan.selectedSize || 'small';
      setSelectedSize(sizeFromContext); // Set the size state
      
      setSelectedPlan({
        planId: currentPlan.id,
        planTitle: currentPlan.title,
        planType: 'provider', // Default for subscription plans
        price: getPriceBySize(currentPlan, sizeFromContext), // Use the extracted size
        isAnnual: false, // Default to monthly
        serviceType: 'membership', // Default to membership
        selectedSize: sizeFromContext // Include the size in the selectedPlan
      });
    }
    // Or from route state/params
    else if (planFromState) {
      const plan = membershipPlans.find(p => p.id === planFromState);
      if (plan) {
        setSelectedPlan({
          planId: plan.id,
          planTitle: plan.title,
          planType: 'provider',
          isAnnual: false,
          price: getPriceBySize(plan, selectedSize),
          serviceType: 'membership',
          selectedSize: selectedSize
        });
      }
    }
    
    // Cleanup - restore default scroll behavior and clear plan selection
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
      // Clear the plan selection from context when navigating away
      clearPlan();
    };
  }, [location, currentPlan, clearPlan]); // Removed selectedSize from dependencies to avoid infinite loop

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const val = name === 'agreeTerms' ? checked : value;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: val
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear any global errors
    if (dataLayerError) clearError();
    if (localError) setLocalError('');
  };

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number is invalid';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
    }
    
    // Validate plan selection
    // if (!selectedPlan) {
    //   newErrors.plan = serviceType === 'membership' 
    //     ? 'Please select a membership plan' 
    //     : 'Please select a service';
    // }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSizeChange = (event, newSize) => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;
    
    if (newSize !== null) {
      setSelectedSize(newSize);
      // Update selected plan price if a plan is already selected
      if (selectedPlan) {
        const services = serviceType === 'membership' ? membershipPlans : oneTimeServices;
        const service = services.find(s => s.id === selectedPlan.planId);
        if (service) {
          setSelectedPlan(prev => ({
            ...prev,
            price: getPriceBySize(service, newSize)
          }));
        }
      }
      
      // Restore scroll position after state update
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }
  };

  const handleServiceTypeChange = (event, newType) => {
    // Save current scroll position
    scrollPositionRef.current = window.scrollY;
    
    if (newType !== null) {
      setServiceType(newType);
      // Clear selected plan when switching service types
      setSelectedPlan(null);
      // Clear any plan selection errors
      if (errors.plan) {
        setErrors(prev => ({
          ...prev,
          plan: ''
        }));
      }
      
      // Restore scroll position after state update
      setTimeout(() => {
        window.scrollTo(0, scrollPositionRef.current);
      }, 0);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan({
      planId: plan.id,
      planTitle: plan.title,
      planType: serviceType === 'membership' ? 'provider' : 'one-time',
      isAnnual: false,
      price: getPriceBySize(plan, selectedSize),
      selectedSize: selectedSize,
      serviceType: serviceType
    });
  };
  
  // Function to clear plan selection and return to plan selection view
  const handleBackToPlanSelection = () => {
    setSelectedPlan(null);
  };

  // Format phone number for Clerk (E.164 format)
  const formatPhoneForClerk = (phone) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // If it doesn't start with country code, assume US (+1)
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.startsWith('1') && cleaned.length === 11) {
      return `+${cleaned}`;
    } else if (phone.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return `+${cleaned}`;
  };

  const handleCheckoutOnly = () => {
    // Navigate directly to booking for one-time services without registration
    if (selectedPlan && selectedPlan.serviceType === 'one-time') {
      navigate(`/book-appointment?service=${selectedPlan.planId}&size=${selectedPlan.selectedSize}&checkout=true`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Clerk state:', { isLoaded, signUp: !!signUp, hasSignUpMethod: !!signUp?.create });
    
    if (!isLoaded) {
      console.log('Clerk is not loaded yet');
      return;
    }
    
    if (!signUp) {
      console.error('signUp object is not available');
      setLocalError('Authentication system is not ready. Please refresh the page.');
      return;
    }
    
    if (validateForm()) {
      try {
        setIsLoading(true);
        setLocalError('');
        
        // Show initial transition UI
        setIsTransitioning(true);
        setTransitionMessage('Creating your account...');
        
        const { firstName, lastName, email, password, phone } = formData;
        
        const formattedPhone = formatPhoneForClerk(phone);
        console.log('Phone formatting:', { original: phone, formatted: formattedPhone });
        
        // First, check if we can create a sign up
        if (!signUp.create) {
          throw new Error('Sign up functionality is not available');
        }
        
        let uname = email.replace(/@/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
        // Try creating the signup with all fields
        console.log('Creating signup with:', {
          email,
          phoneFormat: formattedPhone,
          passwordLength: password.length,
          passwordValue: password, // temporary for debugging
          username: uname,
        });
        
        try {
          // Step 1: Create Clerk user with all fields
          const signUpAttempt = await signUp.create({ // creates a workflow for a customer in Clerk, for validation
            emailAddress: email,
            password: password,
            phoneNumber: formattedPhone,
            firstName: firstName,
            lastName: lastName,
            username: uname,
          });
          
          // console.log('Initial signup response:', {
          //   id: signUpAttempt.id,
          //   status: signUpAttempt.status,
          //   requiredFields: signUpAttempt.requiredFields,
          //   unverifiedFields: signUpAttempt.unverifiedFields,
          //   hasPassword: signUpAttempt.hasPassword,
          //   emailAddress: signUpAttempt.emailAddress,
          //   phoneNumber: signUpAttempt.phoneNumber
          // });

          // Handle different statuses
          if (signUpAttempt.status === 'complete') {  
            // Show setting up account message
            setTransitionMessage('Setting up your account...');
            await new Promise(resolve => setTimeout(resolve, 750));
            
            // Set the session as active
            await setActive({ session: signUpAttempt.createdSessionId });
            
            // Create customer record in Supabase right after successful Clerk signup
            try {
              setTransitionMessage('Creating your profile...');
              const customerResponse = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  firstName,
                  lastName,
                  email,
                  phone,
                  // locationId is now optional - will be set later when user selects a location
                }),
              });

              if (!customerResponse.ok) {
                // Try to parse error response, but handle cases where it's not JSON
                let errorMessage = 'Failed to create customer record';
                try {
                  const errorData = await customerResponse.json();
                  errorMessage = errorData.error || errorMessage;
                } catch (e) {
                  // If response isn't JSON, use status text
                  errorMessage = `Failed to create customer record: ${customerResponse.statusText}`;
                }
                throw new Error(errorMessage);
              }
              
              // Show success message
              setTransitionMessage('Profile created successfully!');
              await new Promise(resolve => setTimeout(resolve, 750));
              
            } catch (customerError) {
              console.error('Error creating customer record:', customerError);
              // Note: We don't throw here to avoid breaking the flow since Clerk user was created successfully
              // The user can still access the dashboard, and we can create the customer record later
              console.warn('Customer record creation failed, but Clerk user was created successfully');
              setTransitionMessage('Account created! Finalizing setup...');
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Store plan info for redirect
            if (selectedPlan) {
              sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
              setTransitionMessage('Preparing your dashboard...');
            } else {
              setTransitionMessage('Welcome to Buster & Co!');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to dashboard
            navigate('/layout/dashboard');
            
          } else if (signUpAttempt.status === 'missing_requirements') {
            // Handle missing requirements...
            console.log('Missing requirements - full object:', signUpAttempt);
            
            // Try to understand what's missing
            const fields = {
              email: signUpAttempt.emailAddress,
              phone: signUpAttempt.phoneNumber,
              hasPassword: signUpAttempt.hasPassword,
            };
            console.log('Field values in response:', fields);
            
            // COMMENTED OUT EMAIL VERIFICATION LOGIC - Currently disabled but may be used later
            /*
            // Check if we need to verify email/phone
            if (signUpAttempt.unverifiedFields?.length > 0) {
              console.log('Unverified fields:', signUpAttempt.unverifiedFields);
              
              // If email needs verification
              if (signUpAttempt.unverifiedFields.includes('email_address')) {
                try {
                  // Show transitioning state
                  setIsTransitioning(true);
                  setTransitionMessage('Verifying security...');
                  
                  // Add delay to cover potential CAPTCHA
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  setTransitionMessage('Sending verification code to your email...');
                  await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                  
                  // Store signup data for after verification
                  sessionStorage.setItem('pendingSignup', JSON.stringify({
                    email,
                    phone,
                    firstName,
                    lastName,
                    selectedPlan
                  }));
                  
                  // Add a longer delay for better UX
                  await new Promise(resolve => setTimeout(resolve, 250));
                  setTransitionMessage('Verification code sent! Redirecting...');
                  await new Promise(resolve => setTimeout(resolve, 1500));
                  
                  // Navigate to verification page
                  navigate('/verify-email');
                  return;
                } catch (prepError) {
                  console.error('Error preparing email verification:', prepError);
                  setIsTransitioning(false);
                  throw new Error('Unable to send verification email. Please try again.');
                }
              }
            }
            */
            
            // Since email verification is disabled, treat missing_requirements as complete
            setTransitionMessage('Finalizing your account...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Set the session as active
            await setActive({ session: signUpAttempt.createdSessionId });
            
            // Create customer record in Supabase IF there is missing_requirement
            try {
              setTransitionMessage('Creating your profile...');
              const customerResponse = await fetch('/api/customers', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  firstName,
                  lastName,
                  email,
                  phone,
                  // locationId is now optional - will be set later when user selects a location
                }),
              });

              if (!customerResponse.ok) {
                let errorMessage = 'Failed to create customer record';
                try {
                  const errorData = await customerResponse.json();
                  errorMessage = errorData.error || errorMessage;
                } catch (e) {
                  errorMessage = `Failed to create customer record: ${customerResponse.statusText}`;
                }
                throw new Error(errorMessage);
              }
              
              // Show success message
              setTransitionMessage('Profile created successfully!');
              await new Promise(resolve => setTimeout(resolve, 750));
              
            } catch (customerError) {
              console.error('Error creating customer record:', customerError);
              console.warn('Customer record creation failed, but Clerk user was created successfully');
              setTransitionMessage('Account created! Finalizing setup...');
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Store plan info for redirect
            if (selectedPlan) {
              sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
              setTransitionMessage('Preparing your dashboard...');
            } else {
              setTransitionMessage('Welcome to Buster & Co!');
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Navigate to dashboard
            navigate('/layout/dashboard');
            
            // If password is missing, there might be an issue with how we're sending it
            if (!signUpAttempt.hasPassword) {
              console.error('Password was not accepted by Clerk');
              throw new Error('Password was not accepted. Please ensure it meets the requirements.');
            }
            
            throw new Error('Unable to complete registration. Please check your information and try again.');
          } else {
            // Handle other statuses
            console.log('Unexpected status:', signUpAttempt.status);
            throw new Error('Registration failed. Please try again.');
          }
        } catch (clerkError) {
          console.error('Clerk error details:', clerkError);
          
          // Check if it's a Clerk-specific error
          if (clerkError.errors) {
            const errorMessage = clerkError.errors[0]?.message || 'Registration failed';
            throw new Error(errorMessage);
          }
          
          throw clerkError;
        }
      } catch (err) {
        console.error('Registration error:', err);
        if (err.errors) {
          // Clerk-specific errors
          const clerkError = err.errors[0]?.message || 'Registration failed';
          setLocalError(clerkError);
        } else {
          setLocalError(err.message || 'Registration failed. Please try again.');
        }
      } finally {
        setIsLoading(false);
        setIsTransitioning(false);
      }
    }
  };

  // Get textFieldStyling using the theme colors
  const textFieldStyling = getTextFieldStyling(colors);

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
            top: -96,
            right: -96,
            width: 192,
            height: 192,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.3,
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
              '50%': { transform: 'scale(1.2)', opacity: 0.5 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: -48,
            width: 128,
            height: 128,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(40px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 96,
            right: '30%',
            width: 160,
            height: 160,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(50px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
      </Box>
      
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          position: 'relative',
          zIndex: 1,
          py: 8
        }}
      >
        <Container maxWidth="md">
          {/* Enhanced Transition overlay with glassmorphism */}
          {isTransitioning && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: gradients.darkGlass,
                // backdropFilter: 'blur(20px)',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {/* Animated gradient orbs for transition */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '15%',
                  right: '15%',
                  width: 180,
                  height: 180,
                  background: gradients.primaryGradient,
                  borderRadius: '50%',
                  opacity: 0.4,
                  // filter: 'blur(70px)',
                  animation: 'transitionPulse 3.5s ease-in-out infinite',
                  '@keyframes transitionPulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
                    '50%': { transform: 'scale(1.3)', opacity: 0.6 },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '10%',
                  width: 140,
                  height: 140,
                  background: gradients.accentGradient,
                  borderRadius: '50%',
                  opacity: 0.3,
                  // filter: 'blur(55px)',
                  animation: 'transitionPulse 4.5s ease-in-out infinite 1.5s',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '5%',
                  width: 100,
                  height: 100,
                  background: gradients.multiGradient,
                  borderRadius: '50%',
                  opacity: 0.25,
                  // filter: 'blur(45px)',
                  animation: 'transitionPulse 5.5s ease-in-out infinite 2.5s',
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
                  background: alpha(colors.glassWhite, 0.12),
                  // backdropFilter: 'blur(15px)',
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
                       top: -12,
                       left: -12,
                       right: -12,
                       bottom: -12,
                       background: gradients.multiGradient,
                       borderRadius: '50%',
                       opacity: 0.3,
                      //  filter: 'blur(20px)',
                       animation: 'rotate 4s linear infinite',
                       '@keyframes rotate': {
                         '0%': { transform: 'rotate(0deg)' },
                         '100%': { transform: 'rotate(360deg)' },
                       },
                     },
                     '&::after': {
                       content: '""',
                       position: 'absolute',
                       top: -6,
                       left: -6,
                       right: -6,
                       bottom: -6,
                       background: gradients.accentGradient,
                       borderRadius: '50%',
                       opacity: 0.25,
                      //  filter: 'blur(12px)',
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
                      // backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${alpha(colors.accent, 0.4)}`,
                      boxShadow: `inset 0 0 20px ${alpha(colors.accent, 0.2)}`,
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
                    background: gradients.accentGradient,
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
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.1, transform: 'scale(1)' },
                        '50%': { opacity: 0.3, transform: 'scale(1.1)' },
                      },
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
              boxShadow: `0 8px 32px ${alpha(colors.primary, 0.2)}`,
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
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
                  fontWeight="bold"
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
              </Box>
              <Typography 
                variant="h5" 
                component="h2" 
                fontWeight="medium" 
                gutterBottom
                sx={{
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {selectedPlan ? 'Create Your Account & Checkout' : 'Create Your Account'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {selectedPlan 
                  ? selectedPlan.serviceType === 'one-time'
                    ? `Complete registration for ${selectedPlan.planTitle} service`
                    : `Complete your ${selectedPlan.planTitle} membership registration`
                  : 'Choose a service option to continue'}
              </Typography>
              
              {selectedPlan ? (
                <Box 
                  sx={{ 
                    mt: 3, 
                    p: 2, 
                    background: alpha(colors.accent, 0.1),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    border: `1px solid ${alpha(colors.accent, 0.3)}`,
                    position: 'relative',
                    boxShadow: `0 4px 20px ${alpha(colors.accent, 0.2)}`,
                  }}
                >
                  {/* Back arrow to change plan selection */}
                  <IconButton 
                    onClick={handleBackToPlanSelection}
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      left: 8,
                      color: colors.accent,
                      background: alpha(colors.glassWhite, 0.1),
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        color: '#ffffff',
                        background: alpha(colors.accent, 0.2),
                        transform: 'scale(1.1)',
                      }
                    }}
                    aria-label="change service selection"
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                    <ShoppingCartIcon sx={{ color: colors.accent, mr: 1, filter: 'drop-shadow(0 2px 4px rgba(0,255,255,0.3))' }} />
                    <Typography variant="body1" fontWeight="bold" sx={{ color: '#ffffff' }}>
                      Selected {selectedPlan.serviceType === 'one-time' ? 'Service' : 'Plan'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" gutterBottom component="div" sx={{ color: '#ffffff' }}>
                    {selectedPlan.planTitle} - {sizeCategories[selectedSize]?.label} Dog
                    <Chip 
                      size="small" 
                      label={selectedPlan.serviceType === 'one-time' ? selectedPlan.price : selectedPlan.price + '/month'}
                      sx={{ 
                        ml: 1, 
                        background: gradients.accentGradient,
                        color: 'white',
                        fontSize: '0.6rem',
                        border: 'none',
                        fontWeight: 'bold',
                      }} 
                    />
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {selectedPlan.serviceType === 'one-time' 
                      ? 'Complete registration to book your appointment, or checkout as guest'
                      : 'Complete your registration to continue to checkout'}
                  </Typography>
                  
                  {/* Checkout Only Button - Only show for one-time services */}
                  {selectedPlan.serviceType === 'one-time' && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        onClick={handleCheckoutOnly}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: colors.accent,
                          color: colors.accent,
                          fontSize: '0.875rem',
                          px: 3,
                          py: 1,
                          backdropFilter: 'blur(10px)',
                          fontWeight: 'bold',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: alpha(colors.accent, 0.1),
                            borderColor: colors.accent,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 4px 20px ${alpha(colors.accent, 0.3)}`,
                          },
                        }}
                      >
                        Checkout as Guest
                      </Button>
                    </Box>
                  )}
                </Box>
              ) : (
                // Display service type selection, dog size selection and plan selection when no plan is selected
                <Box sx={{ mt: 4, mb: 3 }}>
                  {/* Service Type Selection */}
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2, color: '#ffffff' }}>
                    Choose service type:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <ToggleButtonGroup
                      value={serviceType}
                      exclusive
                      onChange={handleServiceTypeChange}
                      aria-label="service type selection"
                      orientation={isMobile ? 'vertical' : 'horizontal'}
                      sx={{
                        background: alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        border: `1px solid ${alpha(colors.primary, 0.2)}`,
                        flexDirection: isMobile ? 'column' : 'row',
                        '& .MuiToggleButton-root': {
                          color: 'rgba(255,255,255,0.8)',
                          borderColor: alpha(colors.primary, 0.2),
                          backgroundColor: 'transparent',
                          px: { xs: 2, sm: 4 },
                          py: { xs: 1, sm: 1.5 },
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          minWidth: { xs: '160px', sm: 'auto' },
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: alpha(colors.primary, 0.1),
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-selected': {
                            background: gradients.primaryGradient,
                            color: 'white',
                            '&:hover': {
                              background: gradients.primaryGradient,
                              filter: 'brightness(1.1)',
                            }
                          },
                          '&:focus': {
                            outline: 'none',
                          }
                        }
                      }}
                    >
                      <ToggleButton value="membership" type="button">
                        Monthly Plans
                      </ToggleButton>
                      <ToggleButton value="one-time" type="button">
                        One-time Services
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Box>

                  

                  {/* Plan/Service Selection */}
                  <Typography variant="body1" fontWeight="medium" sx={{ mb: 2, color: '#ffffff' }}>
                    {serviceType === 'membership' ? 'Select a membership plan:' : 'Select a service:'}
                  </Typography>
                  {errors.plan && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mb: 2,
                        color: colors.accent,
                        textShadow: `0 0 10px ${colors.accent}`,
                      }}
                    >
                      {errors.plan}
                    </Typography>
                  )}
                  <Grid container spacing={2} justifyContent="center">
                    {(serviceType === 'membership' ? membershipPlans : oneTimeServices).map((plan) => (
                      <Grid size={{ xs: 12, sm: serviceType === 'membership' ? 4 : 6}} key={plan.id}>
                        <Card 
                          onClick={() => handlePlanSelect(plan)}
                          sx={{ 
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            background: alpha(colors.glassWhite, 0.1),
                            backdropFilter: 'blur(20px)',
                            border: (serviceType === 'membership' && plan.popularFeature) 
                              ? `2px solid ${colors.accent}` 
                              : `1px solid ${alpha(colors.primary, 0.2)}`,
                            boxShadow: (serviceType === 'membership' && plan.popularFeature)
                              ? `0 8px 32px ${alpha(colors.accent, 0.3)}`
                              : `0 4px 20px ${alpha(colors.primary, 0.2)}`,
                            borderRadius: 3,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'visible',
                            '&:hover': {
                              transform: 'translateY(-8px) scale(1.02)',
                              boxShadow: `0 12px 40px ${alpha(colors.primary, 0.4)}`,
                              border: `1px solid ${alpha(colors.primary, 0.5)}`,
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
                            }
                          }}
                        >
                          {(serviceType === 'membership' && plan.popularFeature) && (
                            <Chip
                              label="Most Popular"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: 8,
                                background: gradients.accentGradient,
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.625rem',
                                border: 'none',
                                animation: 'glow 2s ease-in-out infinite',
                                '@keyframes glow': {
                                  '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.accent, 0.5)}` },
                                  '50%': { boxShadow: `0 0 20px ${alpha(colors.accent, 0.8)}` },
                                },
                              }}
                            />
                          )}
                          <CardContent sx={{ p: 2, flexGrow: 1, position: 'relative', zIndex: 1 }}>
                            <Typography 
                              variant="h6" 
                              component="div" 
                              fontWeight="bold" 
                              sx={{ 
                                mb: 1,
                                color: '#ffffff',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              }}
                            >
                              {plan.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                              <Typography 
                                variant="h5" 
                                component="div" 
                                fontWeight="bold"
                                sx={{
                                  background: gradients.primaryGradient,
                                  backgroundClip: 'text',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                }}
                              >
                                {getPriceBySize(plan, selectedSize)}
                              </Typography>
                              <Typography variant="caption" sx={{ ml: 0.5, color: 'rgba(255,255,255,0.7)' }}>
                                {serviceType === 'membership' ? plan.period : ''}
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ mb: 2, fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                              {plan.description}
                            </Typography>
                            <List disablePadding sx={{ mb: 1 }}>
                              {plan.features.slice(0, 2).map((feature, i) => (
                                <ListItem key={i} disablePadding disableGutters sx={{ py: 0.25 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckIcon sx={{ color: colors.accent, fontSize: '0.875rem', filter: `drop-shadow(0 0 3px ${colors.accent})` }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={feature}
                                    primaryTypographyProps={{ 
                                      variant: 'caption',
                                      color: 'rgba(255,255,255,0.9)',
                                      fontSize: '0.75rem'
                                    }}
                                  />
                                </ListItem>
                              ))}
                              {plan.features.length > 2 && (
                                <Typography variant="caption" sx={{ ml: 2.5, fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>
                                  +{plan.features.length - 2} more features
                                </Typography>
                              )}
                            </List>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {/* Dog Size Selection */}
                  <Typography variant="body1" fontWeight="medium" sx={{ my: 2, color: '#ffffff' }}>
                    Select your dog's size:
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <ToggleButtonGroup
                      value={selectedSize}
                      exclusive
                      onChange={handleSizeChange}
                      aria-label="dog size selection"
                      orientation={isMobile ? 'vertical' : 'horizontal'}
                      sx={{
                        background: alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 3,
                        border: `1px solid ${alpha(colors.primary, 0.2)}`,
                        flexDirection: isMobile ? 'column' : 'row',
                        '& .MuiToggleButton-root': {
                          color: 'rgba(255,255,255,0.8)',
                          borderColor: alpha(colors.primary, 0.2),
                          backgroundColor: 'transparent',
                          px: { xs: 2, sm: 3 },
                          py: { xs: 1, sm: 1.5 },
                          fontSize: { xs: '0.8rem', sm: '1rem' },
                          minWidth: { xs: '120px', sm: 'auto' },
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            backgroundColor: alpha(colors.accent, 0.1),
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-selected': {
                            background: gradients.accentGradient,
                            color: 'white',
                            '&:hover': {
                              background: gradients.accentGradient,
                              filter: 'brightness(1.1)',
                            }
                          },
                          '&:focus': {
                            outline: 'none',
                          }
                        }
                      }}
                    >
                      {Object.entries(sizeCategories).map(([key, category]) => (
                        <ToggleButton 
                          key={key}
                          value={key}
                          type="button"
                          // keeps the screen from flickerng when the weird scroll problem occurs on state update
                          disableFocusRipple
                          disableRipple
                        >
                          <PetsIcon sx={{ 
                            mr: { xs: 0.5, sm: 1 }, 
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                          }} />
                          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {category.label}
                            </Typography>
                            <Typography variant="caption" sx={{ ml: { xs: 0, sm: 0.5 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              ({category.description})
                            </Typography>
                          </Box>
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Display errors */}
            {(dataLayerError || localError) && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  background: alpha(colors.accent, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.accent, 0.3)}`,
                  color: colors.accent,
                  '& .MuiAlert-icon': {
                    color: colors.accent,
                  },
                  '& .MuiIconButton-root': {
                    color: colors.accent,
                  }
                }}
                onClose={() => {
                  if (dataLayerError) clearError();
                  if (localError) setLocalError('');
                }}
              >
                {dataLayerError || localError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    disabled={isLoading}
                    sx={textFieldStyling}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    disabled={isLoading}
                    sx={textFieldStyling}
                  />
                </Grid>
                
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
                    error={!!errors.email}
                    helperText={errors.email}
                    disabled={isLoading}
                    sx={textFieldStyling}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <TextField
                    required
                    fullWidth
                    label="10-digit US phone number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    disabled={isLoading}
                    sx={textFieldStyling}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => togglePasswordVisibility('password')}
                          edge="end"
                          disabled={isLoading}
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              backgroundColor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyling}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                          disabled={isLoading}
                          sx={{
                            color: 'rgba(255,255,255,0.7)',
                            '&:hover': {
                              backgroundColor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                            }
                          }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyling}
                  />
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        disabled={isLoading}
                        sx={{
                          color: 'rgba(255,255,255,0.7)',
                          '&.Mui-checked': {
                            color: colors.accent,
                          },
                          '&:hover': {
                            backgroundColor: alpha(colors.accent, 0.1),
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" component="span" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                        I agree to the{' '}
                        <Link 
                          component={RouterLink} 
                          to="/terms" 
                          sx={{ 
                            color: colors.accent,
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                              textShadow: `0 0 10px ${colors.accent}`,
                            }
                          }}
                        >
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link 
                          component={RouterLink} 
                          to="/privacy" 
                          sx={{ 
                            color: colors.accent,
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                              textShadow: `0 0 10px ${colors.accent}`,
                            }
                          }}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.agreeTerms && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        mt: 0.5,
                        color: colors.accent,
                        textShadow: `0 0 10px ${colors.accent}`,
                      }}
                    >
                      {errors.agreeTerms}
                    </Typography>
                  )}
                </Grid>
                
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      background: gradients.multiGradient,
                      backgroundSize: '200% 200%',
                      color: 'white',
                      py: 1.5,
                      fontWeight: 'bold',
                      border: `1px solid ${alpha(colors.primary, 0.3)}`,
                      backdropFilter: 'blur(10px)',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'gradient-shift 4s ease infinite',
                      '@keyframes gradient-shift': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' },
                      },
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: `0 8px 32px ${alpha(colors.secondary, 0.4)}`,
                      },
                      '&:disabled': {
                        background: alpha(colors.glassWhite, 0.1),
                        color: 'rgba(255,255,255,0.5)',
                      },
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
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Creating Account...
                      </Box>
                    ) : selectedPlan?.serviceType === 'one-time' 
                        ? 'Create Account & Book Appointment' 
                        : selectedPlan?.serviceType === 'membership' 
                          ? 'Create Your Account & Checkout' 
                          : 'Create Account'}
                  </Button>
                </Grid>
              </Grid>
              
              {/* Clerk CAPTCHA container - placed at the very end */}
              <Box id="clerk-captcha" sx={{ mt: 2 }}></Box>
            </Box>
            
            {/* Divider between traditional registration and social registration */}
            <Box sx={{ display: 'flex', alignItems: 'center', my: 3 }}>
              <Divider 
                sx={{ 
                  flexGrow: 1,
                  borderColor: alpha(colors.primary, 0.3),
                  borderStyle: 'solid',
                  borderWidth: '1px 0 0 0',
                  background: gradients.primaryGradient,
                  height: '1px',
                  border: 'none',
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  mx: 2,
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 'medium',
                }}
              >
                OR
              </Typography>
              <Divider 
                sx={{ 
                  flexGrow: 1,
                  borderColor: alpha(colors.primary, 0.3),
                  borderStyle: 'solid',
                  borderWidth: '1px 0 0 0',
                  background: gradients.primaryGradient,
                  height: '1px',
                  border: 'none',
                }} 
              />
            </Box>
            
            {/* Google Register Button */}
            <Box sx={{ mb: 1 }}>
              <GoogleRegister 
                onSuccess={() => {}} 
                showTransitionUI={(message) => {
                  setIsTransitioning(true);
                  setTransitionMessage(message);
                }} 
                selectedPlan={selectedPlan}
                agreeTerms={formData.agreeTerms}
              />
            </Box>
              
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Already have an account?{' '}
                <Link 
                  component={RouterLink} 
                  to="/login" 
                  sx={{ 
                    color: colors.accent,
                    fontWeight: 'medium',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                      textShadow: `0 0 10px ${colors.accent}`,
                    }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'none',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline',
                  color: colors.accent,
                  textShadow: `0 0 10px ${colors.accent}`,
                  transform: 'translateX(-4px)',
                }
              }}
            >
              ← Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default Register; 