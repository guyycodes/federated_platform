import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  Alert,
  CircularProgress
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';

const ForgotPassword = () => {
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
          bgcolor: '#f8f9fa',
          py: 8,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 2,
              background: 'white'
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
                <Typography variant="h4" component="h1" fontWeight="bold" color="#1A2238">
                  Buster & Co.
                </Typography>
              </Box>
              
              <LockResetIcon sx={{ fontSize: 50, color: '#4CAF50', my: 2 }} />
              
              <Typography variant="h5" component="h2" fontWeight="medium" gutterBottom color="#1A2238">
                Reset Your Password
              </Typography>
              <Typography variant="body2" color="rgba(113,122,144,0.8)">
                Enter your email address and we'll send you instructions to reset your password.
              </Typography>
            </Box>

            {submitted ? (
              <Alert severity="success" sx={{ mb: 3 }}>
                If an account exists for {email}, you will receive password reset instructions in your email shortly.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
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
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1A2238',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#1A2238',
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
                      Sending Reset Email...
                    </Box>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </Box>
            )}
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="rgba(113,122,144,0.8)">
                Remember your password?{' '}
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: '#4CAF50', 
                    fontWeight: 'medium',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'transparent',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Back to Sign In
                </Button>
              </Typography>
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

export default ForgotPassword; 