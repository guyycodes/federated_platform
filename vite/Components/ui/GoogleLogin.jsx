import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useDataLayer } from '../../Context/DataLayer';

const GoogleLogin = ({ onSuccess, showTransitionUI, redirectTo }) => {
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

  // Function to initiate Google OAuth sign-in
  const handleGoogleLogin = async () => {
    if (!googleLoaded) {
      console.log('Google Identity Services not loaded yet');
      setError('Authentication system is not ready. Please refresh the page.');
      return;
    }

    try {
      setIsInitiating(true);
      setIsLoading(true);
      setError('');
      
      // Show transition UI if provided
      if (showTransitionUI) {
        showTransitionUI('Redirecting to Google...');
        await new Promise(resolve => setTimeout(resolve, 1250));
      }
      
      // Get the Google client ID from environment variable
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        throw new Error('Google Client ID not configured');
      }

      // Configure the OAuth2 client with the same scopes as registration
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
        ux_mode: 'redirect',
        redirect_uri: `${window.location.origin}/google-oauth-callback`,
        state: JSON.stringify({  // gets parsed by google-callback.jsx line 51
          mode: 'signin', // This tells the backend it's a sign-in flow
          timestamp: Date.now(),
          redirectTo: redirectTo || null // pass the redirect if the user is trying to checkout
        })
      });

      console.log('Initiating Google OAuth sign-in with redirect URL:', `${window.location.origin}/google-oauth-callback`);
      console.log('Current origin:', window.location.origin);
      
      // Request authorization
      client.requestCode();
      
    } catch (error) {
      console.error('Google OAuth initiation error:', error);
      setIsInitiating(false);
      setIsLoading(false);
      
      const errorMessage = error?.message || 'Failed to connect to Google';
      setError(errorMessage);
      
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
        startIcon={<CircularProgress size={18} sx={{ color: '#4CAF50' }} /> }
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
        onClick={handleGoogleLogin}
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
          Sign in with Google
        </Typography>
      </Button>
    </>
  );
};

export default GoogleLogin; 