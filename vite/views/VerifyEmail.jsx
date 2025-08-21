import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSignUp, useUser } from '@clerk/clerk-react';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { user } = useUser();
  const [emailCode, setEmailCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingSignup, setPendingSignup] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');
  
  useEffect(() => {
    // Load pending signup data from sessionStorage
    const storedData = sessionStorage.getItem('pendingSignup');
    if (storedData) {
      setPendingSignup(JSON.parse(storedData));
    } else {
      // If no pending signup, redirect to register
      navigate('/register');
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Redirect if user is already signed in
    if (user) {
      navigate('/layout/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Countdown timer for resend functionality
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleEmailVerification = async () => {
    if (!emailCode.trim() || emailCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Attempt to verify the email with the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: emailCode,
      });

      console.log('Email verification response:', {
        status: completeSignUp.status,
      });

      if (completeSignUp.status === 'complete') {
        // Show setup transition
        setIsSettingUp(true);
        setSetupMessage('Email verified successfully!');
        await new Promise(resolve => setTimeout(resolve, 750));
        
        // Email verified and signup complete
        await handleSignupComplete(completeSignUp);
      } else {
        throw new Error('Unable to complete verification. Please try again.');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setError(err.errors?.[0]?.message || 'Invalid verification code. Please try again.');
      setIsSettingUp(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupComplete = async (completeSignUp) => {
    try {
      setSetupMessage('Setting up your account...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set the session as active
      await setActive({ session: completeSignUp.createdSessionId });
      
      setSetupMessage('Creating your profile...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // This is commented out because email verification is turned OFF in Clerk

      // Create customer record in supabase
      // const customerResponse = await fetch('/api/customers', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     firstName: pendingSignup?.firstName || '',
      //     lastName: pendingSignup?.lastName || '',
      //     email: pendingSignup?.email || '',
      //     phone: pendingSignup?.phone || '',
      //     // locationId is now optional - will be set later when user selects a location
      //   }),
      // });

      if (!customerResponse.ok) {
        // Try to parse error response, but handle cases where it's not JSON
        let errorMessage = 'Failed to create customer record after verification';
        try {
          const errorData = await customerResponse.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response isn't JSON, use status text
          errorMessage = `Failed to create customer record: ${customerResponse.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setSetupMessage('Almost done...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store plan info for redirect if available
      if (pendingSignup?.selectedPlan) {
        sessionStorage.setItem('selectedPlan', JSON.stringify(pendingSignup.selectedPlan));
      }

      // Clear pending signup data
      sessionStorage.removeItem('pendingSignup');
      
      setSetupMessage('Welcome to Buster & Co!');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to dashboard
      navigate('/layout/dashboard');
    } catch (err) {
      console.error('Error completing signup:', err);
      setError(err.message || 'Failed to complete registration. Please try again.');
      setIsSettingUp(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    setError('');

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setResendTimer(60); // 60 second cooldown
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleEmailVerification();
  };

  return (
    <>
      <HeaderBar />
      
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          bgcolor: '#f8f9fa',
          py: 8,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Account setup transition overlay */}
        {isSettingUp && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ width: 100, height: 100, mb: 3 }}>
              {setupMessage.includes('verified') ? (
                <CheckCircleIcon sx={{ fontSize: 100, color: '#4CAF50' }} />
              ) : (
                <Lottie 
                  animationData={verificationAnimation} 
                  loop={true}
                  autoplay={true}
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </Box>
            <Typography variant="h5" component="div" color="#1A2238" fontWeight="medium" gutterBottom>
              {setupMessage}
            </Typography>
            {!setupMessage.includes('Welcome') && (
              <CircularProgress sx={{ mt: 2, color: '#4CAF50' }} />
            )}
          </Box>
        )}
        
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              background: 'white'
            }}
          >
            {/* Back button */}
            <Box sx={{ mb: 2 }}>
              <IconButton 
                component={RouterLink}
                to="/register"
                sx={{ color: '#1A2238' }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>

            {/* Header */}
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
                <Typography variant="h4" component="h1" fontWeight="bold" color="#1A2238">
                  Buster & Co.
                </Typography>
              </Box>
              
              <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom color="#1A2238">
                Verify Your Email
              </Typography>
              <Typography variant="body2" color="rgba(113,122,144,0.8)">
                We've sent a verification code to your email address
              </Typography>
            </Box>

            {/* User info display */}
            {pendingSignup && (
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" color="#333333">
                  <EmailIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 1 }} />
                  Verification code sent to: <strong>{pendingSignup.email}</strong>
                </Typography>
              </Box>
            )}

            {/* Error message */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Verification form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Enter 6-digit email code"
                value={emailCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setEmailCode(value);
                }}
                placeholder="123456"
                disabled={isLoading}
                sx={{
                  mb: 3,
                  '& .MuiInputLabel-root': {
                    color: '#333333',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#333333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1A2238',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1A2238',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#333333',
                    fontSize: '1.2rem',
                    letterSpacing: '0.5rem',
                    textAlign: 'center'
                  },
                }}
                inputProps={{
                  maxLength: 6,
                  pattern: '[0-9]*',
                  inputMode: 'numeric'
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || emailCode.length !== 6}
                sx={{
                  bgcolor: '#4CAF50',
                  color: 'white',
                  py: 1.5,
                  mb: 2,
                  '&:hover': {
                    bgcolor: '#45a049',
                  },
                  fontWeight: 'bold'
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Verifying...
                  </Box>
                ) : (
                  'Verify Email'
                )}
              </Button>

              {/* Resend code button */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="rgba(113,122,144,0.8)">
                  Didn't receive a code?{' '}
                  <Button
                    onClick={handleResendCode}
                    disabled={isLoading || resendTimer > 0}
                    sx={{
                      color: '#4CAF50',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      p: 0,
                      minWidth: 'auto',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code'}
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ 
                color: '#1A2238',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'transparent',
                  textDecoration: 'underline'
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

export default VerifyEmail; 