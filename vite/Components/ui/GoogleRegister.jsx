import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDataLayer } from '../../Context/DataLayer';

const GoogleRegister = ({ onSuccess, showTransitionUI, selectedPlan, agreeTerms }) => {
  const { setIsLoading } = useDataLayer();
  const [isInitiating, setIsInitiating] = useState(false);
  const [error, setError] = useState('');
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Load Google Identity Services library
  useEffect(() => {
    const loadGoogleScript = () => {
      if (window.google?.accounts?.oauth2) {
        setGoogleLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setGoogleLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services');
        setError('Failed to load Google authentication');
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  // Function to initiate Google OAuth registration
  const handleGoogleRegister = async () => {
    // Check if terms are agreed to
    if (!agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy to register with Google.');
      return;
    }
    
    if (!googleLoaded) {
      console.log('Google Identity Services not loaded yet');
      setError('Authentication system is not ready. Please refresh the page.');
      return;
    }

    try {
      setIsInitiating(true);
      setIsLoading(true);
      setError('');
      
      // Store selected plan in sessionStorage for after OAuth
      if (selectedPlan) {
        sessionStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      }
      
      // Set flag to indicate this is a registration flow (not just sign-in)
      sessionStorage.setItem('oauth-flow-type', 'registration');
      
      // Show transition UI
      if (showTransitionUI) {
        showTransitionUI('Redirecting to Google...');
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Get the Google client ID from environment variable
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }

      // Configure the OAuth2 client with the scopes you've set up in GCP
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        ux_mode: 'redirect',
        redirect_uri: `${window.location.origin}/registration-sso-callback`,
        state: JSON.stringify({
          type: 'registration',
          selectedPlan: selectedPlan || null,
          timestamp: Date.now()
        })
      });

      console.log('Initiating Google OAuth with redirect URL:', `${window.location.origin}/registration-sso-callback`);
      console.log('Current origin:', window.location.origin);
      
      // Request authorization
      client.requestCode();
      
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      setIsInitiating(false);
      setIsLoading(false);
      
      // More detailed error message
      const errorMessage = error?.message || 'Failed to connect to Google';
      setError(errorMessage);
      
      // Clear stored data on error
      sessionStorage.removeItem('selectedPlan');
      sessionStorage.removeItem('oauth-flow-type');
      
      if (showTransitionUI) {
        showTransitionUI('');
      }
    }
  };

  // Show initiating state
  if (isInitiating) {
    return (
      <Button
        variant="outlined"
        fullWidth
        disabled={true}
        startIcon={<CircularProgress size={18} sx={{ color: '#4CAF50' }} />}
        sx={{
          py: 1.25,
          border: '1px solid #dadce0',
          color: '#333333',
          textTransform: 'none',
          fontWeight: 500,
          background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          opacity: 0.8,
          position: 'relative',
          justifyContent: 'flex-start',
          paddingLeft: '18px',
        }}
      >
        <Typography 
          variant="body1" 
          component="span" 
          sx={{ 
            flex: 1, 
            textAlign: 'center', 
            pr: 3 
          }}
        >
          Redirecting to Google...
        </Typography>
      </Button>
    );
  }

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleGoogleRegister}
        disabled={!googleLoaded || isInitiating}
        startIcon={
          <Box component="img" 
            src="https://imgur.com/FOF6Hyq.png" 
            alt="Google logo" 
            sx={{ 
              width: 18, 
              height: 18, 
              objectFit: 'contain' 
            }} 
          />
        }
        sx={{
          py: 1.25,
          border: '1px solid #dadce0',
          color: '#333333',
          textTransform: 'none',
          fontWeight: 500,
          background: 'linear-gradient(to bottom, #ffffff, #f5f5f5)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          '&:hover': {
            background: 'linear-gradient(to bottom, #f8f9fa, #f1f1f1)',
            borderColor: '#dadce0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
          '&:disabled': {
            opacity: 0.6,
          },
          position: 'relative',
          justifyContent: 'flex-start',
          paddingLeft: '18px',
        }}
      >
        <Typography 
          variant="body1" 
          component="span" 
          sx={{ 
            flex: 1, 
            textAlign: 'center', 
            pr: 3 
          }}
        >
          Register with Google
        </Typography>
      </Button>
    </>
  );
};

export default GoogleRegister; 