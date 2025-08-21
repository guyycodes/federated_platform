import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress, 
  Alert,
  Stepper,
  Step,
  StepLabel,
  Divider
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDataLayer } from '../Context/DataLayer';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/verification-animation.json';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// Initialize Stripe (replace with your actual publishable key)
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

// Plan definitions - should match the ones in MembershipPlans.jsx
const planDetails = {
  free: { id: 'free', title: 'Free Tier', price: '$0' },
  insider: { id: 'insider', title: 'Insider', price: '$7' },
  pro: { id: 'pro', title: 'Pro Toolkit', price: '$19' }
};

// Common styling for form fields
const textFieldStyling = {
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
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { 
    isAuthenticated, 
    selectPlan, 
    initiateCheckout, 
    paymentProcessing, 
    paymentError,
    clearPaymentError
  } = useDataLayer();

  // Extract plan ID from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get('plan');
    
    if (!planId || !planDetails[planId]) {
      setError('Invalid plan selected');
      return;
    }
    
    setSelectedPlan(planDetails[planId]);
  }, [location]);

  // Handle checkout process
  const handleCheckout = async () => {
    if (!selectedPlan) return;
    
    setProcessingCheckout(true);
    setError(null);
    
    try {
      // For free tier, just redirect to login/register
      if (selectedPlan.id === 'free') {
        // Record the selection in DataLayer
        selectPlan(selectedPlan.id, 0);
        
        // Redirect based on authentication status
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/register', { state: { from: '/dashboard', plan: selectedPlan.id } });
        }
        return;
      }
      
      // For paid plans
      // Check if user is logged in first
      if (!isAuthenticated) {
        // Save plan selection and redirect to login
        selectPlan(selectedPlan.id, selectedPlan.id === 'insider' ? 7 : 19);
        navigate('/login', { state: { from: `/checkout?plan=${selectedPlan.id}` } });
        return;
      }
      
      // User is authenticated, initiate Stripe checkout
      const result = await initiateCheckout({
        planId: selectedPlan.id,
        price: selectedPlan.id === 'insider' ? 7 : 19
      });
      
      if (result.success) {
        setActiveStep(1); // Move to success step
      } else {
        setError('Checkout failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setProcessingCheckout(false);
    }
  };

  return (
    <>
      <HeaderBar />
      <Box sx={{ py: 8, minHeight: '100vh', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="md">
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 2, 
              bgcolor: 'rgba(61, 63, 67, 0.8)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25), 0 6px 10px rgba(0,0,0,0.22), 0 1px 2px rgba(255,255,255,0.1) inset',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, rgba(249,191,41,0.2), rgba(249,191,41,0.8), rgba(249,191,41,0.2))',
              }
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="white">
              Complete Your Subscription
            </Typography>
            
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                my: 4,
                '& .MuiStepConnector-line': {
                  borderColor: 'white'
                }
              }}
            >
              <Step>
                <StepLabel StepIconProps={{ style: { color: activeStep >= 0 ? 'white' : undefined } }}>
                  <Typography color="white">Select Plan</Typography>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel StepIconProps={{ style: { color: activeStep >= 1 ? 'white' : undefined } }}>
                  <Typography color="white">Confirmation</Typography>
                </StepLabel>
              </Step>
            </Stepper>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}
            
            {paymentError && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                onClose={() => clearPaymentError()}
              >
                {paymentError}
              </Alert>
            )}
            
            {activeStep === 0 ? (
              // Step 1: Plan selection and checkout
              <>
                {selectedPlan ? (
                  <Box sx={{ textAlign: 'center', my: 4 }}>
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
                      <Typography variant="h5" component="span" fontWeight="bold" color="white">
                        Reality Check
                      </Typography>
                    </Box>
                    
                    <Typography variant="h5" gutterBottom color="white">
                      Selected Plan: {selectedPlan.title}
                    </Typography>
                    <Typography variant="h3" color="#F9BF29" fontWeight="bold">
                      {selectedPlan.price}
                      {selectedPlan.id !== 'free' && (
                        <Typography component="span" variant="body1" color="white">
                          /month
                        </Typography>
                      )}
                    </Typography>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Button
                      variant="contained"
                      size="large"
                      disabled={processingCheckout || paymentProcessing}
                      onClick={handleCheckout}
                      sx={{
                        bgcolor: '#2A3A58',
                        color: 'white',
                        py: 1.5,
                        px: 4,
                        mt: 2,
                        '&:hover': {
                          bgcolor: '#364a6e',
                        },
                        border: '2px solid #F9BF29',
                        fontWeight: 'bold'
                      }}
                    >
                      {(processingCheckout || paymentProcessing) ? (
                        <>
                          <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                          Processing...
                        </>
                      ) : (
                        selectedPlan.id === 'free' ? 'Continue to Account Creation' : 'Proceed to Payment'
                      )}
                    </Button>
                    
                    <Button
                      variant="text"
                      sx={{ mt: 2, display: 'block', mx: 'auto', color: '#F9BF29' }}
                      onClick={() => navigate('/booking')}
                    >
                      Back to Plans
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', my: 4 }}>
                    <Typography color="rgba(113,122,144,0.8)">
                      No plan selected. Please choose a plan from our booking page.
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{ 
                        mt: 2, 
                        bgcolor: '#2A3A58', 
                        color: 'white',
                        border: '2px solid #F9BF29',
                        '&:hover': {
                          bgcolor: '#364a6e'
                        }
                      }}
                      onClick={() => navigate('/booking')}
                    >
                      View Plans
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              // Step 2: Confirmation
              <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography variant="h5" gutterBottom color="#F9BF29" fontWeight="bold">
                  Subscription Confirmed!
                </Typography>
                <Typography paragraph color="rgba(113,122,144,0.8)">
                  Thank you for subscribing to our {selectedPlan?.title} plan.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    bgcolor: '#2A3A58',
                    color: 'white',
                    border: '2px solid #F9BF29',
                    '&:hover': {
                      bgcolor: '#364a6e',
                    },
                  }}
                >
                  Go to Dashboard
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default Checkout; 