import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, alpha } from '@mui/material';
import { useSignUp } from '@clerk/clerk-react';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import { useDataLayer } from '../../Context/DataLayer';
import { useTheme } from '../../Context/ThemeContext';

const RegistrationSSOCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, isLoaded, setActive } = useSignUp();
  const { addNotification } = useDataLayer();
  const { colors, gradients, fonts } = useTheme();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [transitionMessage, setTransitionMessage] = useState('Processing Google authentication...');
  const hasProcessedRef = useRef(false);
  const [googleUserData, setGoogleUserData] = useState(null);
  const hasCreatedAccountRef = useRef(false);

  // Transition UI helper
  const showTransitionUI = (message) => {
    setTransitionMessage(message);
  };

  const generateDefaultPhone = (userId) => {
    // Use a clearly fake area code (555) with user ID
    const paddedId = userId.toString().padStart(7, '0').slice(-7);
    return `+1555${paddedId}`;
  };

  // Format phone number for Clerk (E.164 format)
  const formatPhoneForClerk = (phone) => {
    // If no phone or it's the default, return null to skip phone number
    if (!phone || phone === '0000000000') {
      return null;
    }
    
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

  // Effect to create Clerk account once Clerk is loaded and we have Google data
  useEffect(() => {
    if (isLoaded && googleUserData && !error && !hasCreatedAccountRef.current) {
      console.log('Clerk is now loaded, creating account with Google data');
      hasCreatedAccountRef.current = true;
      createClerkAccount(googleUserData);
    }
  }, [isLoaded, googleUserData, error]);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessedRef.current) {
      console.log('Already processed OAuth callback, skipping...');
      return;
    }

    // Extract OAuth parameters from URL
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');
    const errorDescription = params.get('error_description');

    console.log('RegistrationSSOCallback mounted');
    console.log('Current URL:', window.location.href);
    console.log('OAuth params:', { code, state, error, errorDescription });

    if (error) {
      handleError(`OAuth Error: ${error} - ${errorDescription || 'Unknown error'}`);
      return;
    }

    if (!code) {
      handleError('No authorization code received');
      return;
    }

    // Mark as processed to prevent double execution
    hasProcessedRef.current = true;

    // Parse state to get additional info
    let stateData = {};
    try {
      if (state) {
        stateData = JSON.parse(state);
        console.log('State data:', stateData);
      }
    } catch (e) {
      console.error('Failed to parse state:', e);
    }

    // Exchange authorization code for tokens
    exchangeCodeForTokens(code, stateData);
  }, [location]);

  const exchangeCodeForTokens = async (code, stateData) => {
    try {
      console.log('Authorization code received:', code);
      console.log('State data:', stateData);
      
      showTransitionUI('Exchanging authorization code...');
      
      // Extract scopes from URL params
      const params = new URLSearchParams(location.search);
      const scopeParam = params.get('scope');
      const scopes = scopeParam ? scopeParam.split(' ') : [];
      
      // Call backend to exchange code for tokens and get user info
      try {
        // Use relative URL so it works in both development and production
        const backendUrl = '/api/auth/google-callback';
        console.log('Calling backend at:', backendUrl);
        
        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            redirectUri: `${window.location.origin}/registration-sso-callback`,
            stateData
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Backend response received:', data);
          
        if(data.alreadyExists){
            showTransitionUI('Redirecting to login...');
            setTimeout(() => {
            navigate('/login');
            }, 2000);
            return;
        }

          if (data.user) {
            // Store Google user data - Clerk account will be created when Clerk is loaded
            setGoogleUserData(data.user);
            showTransitionUI('Preparing to create your account...');
          }
        } else {
          const errorData = await response.json();
          // Check if it's an authorization code already used error
          if (errorData.details?.error === 'invalid_grant') {
            throw new Error('This authorization code has already been used. Please try signing in with Google again.');
          }
          throw new Error(errorData.message || 'Failed to exchange authorization code');
        }
      } catch (backendError) {
        console.error('Backend error:', backendError);
        throw backendError;
      }

    } catch (error) {
      console.error('Error processing authorization code:', error);
      handleError(error.message || 'Failed to process Google authentication');
    }
  };

  // Generate a secure temporary password
  const generateTempPassword = () => {
    // Use crypto API to generate a secure random password
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    // Convert to base64 and make it URL safe, then add some special chars for complexity
    const base64 = btoa(String.fromCharCode.apply(null, array))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    // Ensure it has uppercase, lowercase, number and special char
    return `Temp${base64.substring(0, 10)}!1`;
  };

  const createClerkAccount = async (googleUser) => {
    if (!isLoaded || !signUp) {
      console.error('Clerk not loaded');
      handleError('Authentication system not ready');
      return;
    }

    try {
      showTransitionUI('Creating your account...');
      console.log('Creating Clerk account with Google data:', googleUser);

      // Extract first and last names from Google user data
      const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || '';
      const lastName = googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';

      // Format phone number if available, or use a default placeholder
      const formattedPhone = formatPhoneForClerk(googleUser.phone);
      // Clerk requires a phone number, so provide a default if none from Google
      const phoneForClerk = formattedPhone || generateDefaultPhone(googleUser.id); // Default placeholder phone
      
      // Generate temporary password for the user
      const tempPassword = generateTempPassword();
      console.log('Generated temporary password for OAuth user');
      
      // Store the temporary password and user data in sessionStorage for dashboard notification
      sessionStorage.setItem('tempAuthData', JSON.stringify({
        tempPassword,
        isOAuthUser: true,
        provider: 'google',
        createdAt: new Date().toISOString()
      }));
      
      // Add persistent notification to DataLayer
      console.log('About to add temp password notification with password:', tempPassword);
      const notificationId = addNotification({
        type: 'temp-password',
        severity: 'warning',
        title: 'Security Alert: Change Your Password',
        message: 'Your account was created with a temporary password. Please change it immediately.',
        data: {
          tempPassword,
          isOAuthUser: true,
          provider: 'google',
        },
        persistent: true, // Won't auto-dismiss
      });
      console.log('Notification added with ID:', notificationId);
      
      // Create the Clerk user account
      const result = await signUp.create({
        emailAddress: googleUser.email,
        password: tempPassword,
        phoneNumber: phoneForClerk, // Always provide a phone number
        firstName: firstName,
        lastName: lastName,
        username: googleUser.email.replace(/@/g, '_').replace(/[^a-zA-Z0-9_-]/g, ''),
      });

      console.log('Clerk account creation result:', result);

      // Handle different Clerk statuses
      if (result.status === 'complete') {
        // Account creation is complete
        console.log('Clerk account creation complete');
      } else if (result.status === 'missing_requirements') {
        // Since email verification is disabled, we can proceed
        console.log('Clerk account has missing requirements, but email verification is disabled, proceeding...');
        showTransitionUI('Finalizing your account...');
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Set the session as active
      showTransitionUI('Setting up your session...');
      await setActive({ session: result.createdSessionId });

      // Create customer record in your database
      showTransitionUI('Creating customer profile...');
      await createCustomerRecord(googleUser);

      // Get selected plan from session storage if it exists
      const selectedPlan = sessionStorage.getItem('selectedPlan');
      if (selectedPlan) {
        try {
          const planData = JSON.parse(selectedPlan);
          console.log('Selected plan found:', planData);
          showTransitionUI('Preparing your selected plan...');
        } catch (e) {
          console.error('Error parsing selected plan:', e);
        }
      }

      // Success - navigate to dashboard
      showTransitionUI('Success! Redirecting to dashboard...');
      
      // Clear session storage
      sessionStorage.removeItem('oauth-flow-type');
      sessionStorage.removeItem('selectedPlan');
      console.log('Google user:', googleUser);
      setTimeout(() => {
        navigate('/layout/dashboard', {
            state: {
              customerData: googleUser,
              justSignedIn: true
            }
          });
      }, 1500);

    } catch (error) {
      console.error('Error creating Clerk account:', error);
      
      // Check if user already exists
      if (error.errors?.[0]?.code === 'form_identifier_exists') {
        showTransitionUI('Account already exists. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        handleError(error.errors?.[0]?.message || error.message || 'Failed to create account');
      }
    }
  };

  const createCustomerRecord = async (googleUser) => {
    try {
      // Extract first and last names from Google user data
      const firstName = googleUser.given_name || googleUser.name?.split(' ')[0] || '';
      const lastName = googleUser.family_name || googleUser.name?.split(' ').slice(1).join(' ') || '';
      
      console.log('Creating customer record with:', {
        firstName,
        lastName,
        email: googleUser.email,
        phone: googleUser.phone || '0000000000'
      });
      
      const customerResponse = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: googleUser.email,
          phone: googleUser.phone || '0000000000',
          // locationId is now optional - will be set later when user selects a location
        }),
      });

      if (!customerResponse.ok) {
        // Handle 409 conflict (user already exists) as non-blocking
        if (customerResponse.status === 409) {
          console.log('Customer already exists, proceeding to dashboard');
          return;
        }
        
        // Try to parse error response
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
      
      const customerData = await customerResponse.json();
      console.log('Customer record created successfully:', customerData);
      
    } catch (error) {
      console.error('Error creating customer record:', error);
      // Note: We don't throw here to avoid breaking the flow since Clerk user was created successfully
      // The user can still access the dashboard, and we can create the customer record later
      console.warn('Customer record creation failed, but Clerk user was created successfully');
      // Optionally show a brief warning in the UI
      showTransitionUI('Account created! Finalizing setup...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleError = (errorMessage) => {
    console.error('RegistrationSSOCallback error:', errorMessage);
    setError(errorMessage);
    setIsProcessing(false);
  };

  // Show error state
  if (error) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          background: gradients.darkGlass,
          p: 3,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs for error state */}
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            right: '20%',
            width: 120,
            height: 120,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.3,
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
            bottom: '25%',
            left: '15%',
            width: 80,
            height: 80,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            animation: 'pulse 6s ease-in-out infinite 2s',
          }}
        />

        {/* Error content container */}
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha(colors.glassWhite, 0.1),
            border: `1px solid ${alpha(colors.primary, 0.3)}`,
            boxShadow: `0 20px 60px ${alpha(colors.primary, 0.4)}`,
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <Typography 
            variant="h5" 
            component="div" 
            fontWeight="medium" 
            gutterBottom
            sx={{
              color: colors.accent,
              fontFamily: fonts.heading,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Authentication Error
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 1, 
              mb: 3,
              color: 'rgba(255,255,255,0.8)',
              fontFamily: fonts.body,
            }}
          >
            {error}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/register')}
              sx={{ 
                background: gradients.multiGradient,
                backgroundSize: '200% 200%',
                color: '#ffffff',
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                animation: 'gradient-shift 4s ease infinite',
                '@keyframes gradient-shift': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '50%': { backgroundPosition: '100% 50%' },
                  '100%': { backgroundPosition: '0% 50%' },
                },
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 8px 32px ${alpha(colors.secondary, 0.4)}`,
                },
              }}
            >
              Back to Registration
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: colors.accent,
                color: colors.accent,
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.accent, 0.1),
                  borderColor: colors.accent,
                  transform: 'scale(1.05)',
                  boxShadow: `0 8px 32px ${alpha(colors.accent, 0.4)}`,
                },
              }}
            >
              Return to Login
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // Show processing state with transition UI
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: gradients.darkGlass,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated gradient orbs for processing state */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          right: '15%',
          width: 160,
          height: 160,
          background: gradients.primaryGradient,
          borderRadius: '50%',
          opacity: 0.4,
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
          width: 120,
          height: 120,
          background: gradients.accentGradient,
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'transitionPulse 4.5s ease-in-out infinite 1.5s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          width: 90,
          height: 90,
          background: gradients.multiGradient,
          borderRadius: '50%',
          opacity: 0.25,
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
        <Box sx={{ position: 'relative', mt: 2 }}>
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
  );
};

export default RegistrationSSOCallback; 