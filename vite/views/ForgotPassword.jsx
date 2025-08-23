import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  alpha
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/red-blob.json';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import { useTheme } from '../Context/ThemeContext';

const ForgotPassword = () => {
  const { colors, gradients, fonts, glassmorphism } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate API call to request password reset
      console.log('Password reset requested for:', email);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitted(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <HeaderBar />
      
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: gradients.darkGlass,
          py: 8,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: 150,
            height: 150,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.4,
            animation: 'forgotPulse 5s ease-in-out infinite',
            '@keyframes forgotPulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
              '50%': { transform: 'scale(1.2)', opacity: 0.6 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '15%',
            width: 120,
            height: 120,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.3,
            animation: 'forgotPulse 6s ease-in-out infinite 2s',
          }}
        />
        
        <Container maxWidth="sm">
          <Box 
            sx={{ 
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: alpha(colors.glassWhite, 0.12),
              backdropFilter: 'blur(25px)',
              border: `1px solid ${alpha(colors.primary, 0.3)}`,
              boxShadow: `0 25px 80px ${alpha(colors.primary, 0.4)}`,
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 30px 90px ${alpha(colors.primary, 0.5)}`,
              },
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    mr: 2,
                    borderRadius: '50%',
                    background: alpha(colors.glassWhite, 0.15),
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
                    style={{ width: '80%', height: '80%' }}
                    aria-hidden="true"
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight="bold"
                  sx={{
                    fontFamily: fonts.brand,
                    background: gradients.primaryGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(79, 172, 254, 0.5))',
                  }}
                >
                  BlackCore AI
                </Typography>
              </Box>
              
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: alpha(colors.glassWhite, 0.15),
                  backdropFilter: 'blur(15px)',
                  border: `2px solid ${alpha(colors.secondary, 0.4)}`,
                  mb: 3,
                }}
              >
                <LockResetIcon sx={{ fontSize: 35, color: colors.secondary }} />
              </Box>
              
              <Typography 
                variant="h5" 
                component="h2" 
                fontWeight="medium" 
                gutterBottom
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: fonts.heading,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                Reset Your Password
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: fonts.body,
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}
              >
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
            </Box>

            {submitted ? (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  background: alpha('#4CAF50', 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#4CAF50', 0.3)}`,
                  boxShadow: `0 8px 32px ${alpha('#4CAF50', 0.2)}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#4CAF50',
                    fontFamily: fonts.body,
                    textAlign: 'center',
                    fontWeight: 'medium',
                  }}
                >
                  If an account exists for {email}, you will receive password reset instructions in your email shortly.
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      borderRadius: 2,
                      background: alpha('#ff5252', 0.1),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#ff5252', 0.3)}`,
                      boxShadow: `0 8px 32px ${alpha('#ff5252', 0.2)}`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#ff5252',
                        fontFamily: fonts.body,
                        textAlign: 'center',
                        fontWeight: 'medium',
                      }}
                    >
                      {error}
                    </Typography>
                  </Box>
                )}
                
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  margin="normal"
                  sx={{
                    mb: 3,
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: fonts.body,
                    },
                    '& .MuiOutlinedInput-root': {
                      background: alpha(colors.glassWhite, 0.05),
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: alpha(colors.accent, 0.3),
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: alpha(colors.accent, 0.5),
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: colors.accent,
                        borderWidth: '2px',
                        boxShadow: `0 0 20px ${alpha(colors.accent, 0.3)}`,
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: fonts.body,
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: colors.accent,
                    }
                  }}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    background: gradients.primaryGradient,
                    backgroundSize: '200% 200%',
                    color: '#ffffff',
                    py: 2,
                    mb: 2,
                    fontWeight: 'bold',
                    fontFamily: fonts.body,
                    borderRadius: 3,
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                    animation: 'gradient-shift 4s ease infinite',
                    '@keyframes gradient-shift': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' },
                    },
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: `0 15px 40px ${alpha(colors.secondary, 0.4)}`,
                    },
                    '&:disabled': {
                      opacity: 0.7,
                      transform: 'none',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: gradients.shimmerGradient,
                      transition: 'left 0.5s ease',
                    },
                    '&:hover::before': {
                      left: '100%',
                    }
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                      Sending Reset Email...
                    </Box>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </Box>
            )}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: fonts.body,
                }}
              >
                Remember your password?{' '}
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: colors.accent, 
                    fontWeight: 'medium',
                    textTransform: 'none',
                    fontFamily: fonts.body,
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline',
                      color: '#ffffff',
                    }
                  }}
                >
                  Back to Sign In
                </Button>
              </Typography>
            </Box>

            {/* Decorative gradient divider */}
            <Box
              sx={{
                mt: 4,
                height: 2,
                background: gradients.primaryGradient,
                borderRadius: 1,
                opacity: 0.6,
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 6s ease infinite',
              }}
            />
          </Box>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'none',
                fontFamily: fonts.body,
                fontWeight: 'medium',
                py: 1.5,
                px: 3,
                borderRadius: 2,
                background: alpha(colors.glassWhite, 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.accent, 0.1),
                  borderColor: colors.accent,
                  color: '#ffffff',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(colors.accent, 0.3)}`,
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

export default ForgotPassword; 