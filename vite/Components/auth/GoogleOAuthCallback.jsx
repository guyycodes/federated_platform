import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, alpha } from '@mui/material';
import { useSignIn, useClerk } from '@clerk/clerk-react';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import { useTheme } from '../../Context/ThemeContext';

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, setActive } = useSignIn();
  const { loaded: clerkLoaded } = useClerk();
  const { colors, gradients, fonts } = useTheme();
  const [message, setMessage] = useState('Processing authentication...');
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Wait for Clerk to be loaded
    if (!clerkLoaded) {
      console.log('Waiting for Clerk to load...');
      return;
    }
    
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) return;
    
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const state = params.get('state');
      const errorParam = params.get('error');
      
      if (errorParam) {
        setError(`OAuth Error: ${errorParam}`);
        return;
      }
      
      if (!code) {
        setError('No authorization code received');
        return;
      }
      
      // Mark as processed to prevent double execution
      hasProcessed.current = true;
      
      // Parse state to determine mode
      let stateData = {};
      try {
        stateData = state ? JSON.parse(state) : {};
      } catch (e) {
        console.error('Failed to parse state:', e);
      }
      
      console.log('OAuth Callback - Code received:', code);
      console.log('OAuth Callback - State data:', stateData);
      
      try {
        setMessage('Exchanging code for user information...');
        
        // Call your API route to exchange the code
        const response = await fetch('/api/auth/google-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            redirectUri: `${window.location.origin}/google-oauth-callback`,
            stateData
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to exchange authorization code');
        }
        
        // Log the user information to console
        console.log('=== GOOGLE USER INFORMATION ===');
        console.log('Full response:', data);
        
        if (data.user) {
          console.log('User ID:', data.user.id);
          console.log('Email:', data.user.email);
          console.log('First Name:', data.user.firstName);
          console.log('Last Name:', data.user.lastName);
          console.log('Clerk User ID:', data.user.clerkUserId);
          
          // Debug info
          if (data.user.dbFirstName !== undefined) {
            console.log('DB First Name:', data.user.dbFirstName);
            console.log('DB Last Name:', data.user.dbLastName);
            console.log('Clerk First Name:', data.user.clerkFirstName);
            console.log('Clerk Last Name:', data.user.clerkLastName);
          }
        }
        
        if (data.mode) {
          console.log('Mode:', data.mode);
        }
        
        if (data.ticket) {
          console.log('Clerk Ticket Received:', data.ticket);
        }
        
        console.log('==============================');
        
        // Handle the response based on the mode and result
        if (data.success && data.mode === 'signin' && data.ticket) {
          // SIGN-IN: Use the ticket to sign in
          setMessage('Signing you in...');
          
          console.log('Attempting to sign in with ticket...');
          console.log('SignIn hook loaded:', !!signIn);
          
          if (!signIn) {
            console.error('SignIn hook not available');
            setError('Authentication system not ready. Please refresh and try again.');
            return;
          }
          
          try {
            const signInResult = await signIn.create({
              strategy: 'ticket',
              ticket: data.ticket,
            });

            console.log('Sign-in result:', signInResult);

            if (signInResult.status === 'complete') {
              console.log('Activating session...');
              await setActive({ session: signInResult.createdSessionId });
              console.log('Session activated successfully');
              
              // Wait a moment for the context to update
              setMessage('Sign in successful! Redirecting...');
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              console.log('attempting to redirect using stateData:', stateData.redirectTo);
              
              const redirectTo = stateData.redirectTo || '/layout/dashboard';
              
              navigate(redirectTo, {
                state: {
                  customerData: data.user,
                  justSignedIn: true
                }
              });
            } else {
              setError('Sign in requires additional verification');
            }
          } catch (signInError) {
            console.error('Failed to sign in with ticket:', signInError);
            setError('Failed to complete sign in. Please try again.');
          }
          
        } else if (data.success && data.mode === 'register') {
          // REGISTRATION: Continue with your existing registration flow
          setMessage('Redirecting to complete registration...');
          
          // Store Google user data for the registration component
          sessionStorage.setItem('googleUserData', JSON.stringify(data.user));
          sessionStorage.setItem('oauth-flow-type', 'registration');
          
          setTimeout(() => {
            // Redirect to your existing registration callback
            window.location.href = `/registration-sso-callback?processed=true`;
          }, 1000);
          
        } else if (data.needsRegistration) {
          // User tried to sign in but doesn't have an account
          setMessage('No account found. Redirecting to registration...');
          
          sessionStorage.setItem('googleUserData', JSON.stringify(data.googleUser));
          setTimeout(() => {
            navigate('/register');
          }, 2000);
          
        } else {
          throw new Error('Unexpected response from server');
        }
        
      } catch (error) {
        console.error('OAuth callback error:', error);
        
        // Ignore the error if we already have a successful response
        if (hasProcessed.current && error.message.includes('Failed to exchange')) {
          console.log('Ignoring duplicate request error in development');
          return;
        }
        
        setError(error.message || 'Authentication failed');
      }
    };
    
    handleCallback();
  }, [location, navigate, signIn, clerkLoaded]);

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
            gutterBottom
            sx={{
              color: colors.accent,
              fontFamily: fonts.heading,
              fontWeight: 'medium',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Authentication Error
          </Typography>
          <Typography 
            variant="body1" 
            sx={{
              color: 'rgba(255,255,255,0.8)',
              fontFamily: fonts.body,
              mb: 3,
            }}
          >
            {error}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/login')}
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
            Return to Login
          </Button>
        </Box>
      </Box>
    );
  }

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
          {message}
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
  );
};

export default GoogleOAuthCallback; 