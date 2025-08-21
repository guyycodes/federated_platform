import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  Button,
  Paper
} from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';

const ServerError = () => {
  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <HeaderBar />
      
      <Box
        sx={{
          py: 12,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#f8f9fa'
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={2}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <ErrorIcon 
              sx={{ 
                fontSize: 100,
                color: '#ff5252',
                mb: 3
              }} 
            />
            
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              500
            </Typography>
            
            <Typography variant="h4" component="h2" gutterBottom>
              Server Error
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              We're sorry, but something went wrong on our server. 
              Our team has been notified and is working to fix the issue.
              Please try again later or contact our support team for assistance.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                onClick={refreshPage}
                variant="contained"
                size="large"
                sx={{ 
                  bgcolor: '#1A2238',
                  color: 'white',
                  py: 1.5,
                  px: 4,
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#131b2f' }
                }}
              >
                Try Again
              </Button>
              
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: '#1A2238',
                  color: '#1A2238',
                  py: 1.5,
                  px: 4,
                  fontWeight: 'bold',
                  '&:hover': { 
                    bgcolor: 'rgba(26, 34, 56, 0.05)',
                    borderColor: '#1A2238'
                  }
                }}
              >
                Back to Home
              </Button>
              
              <Button
                component={RouterLink}
                to="/contact"
                variant="outlined"
                size="large"
                sx={{ 
                  borderColor: '#1A2238',
                  color: '#1A2238',
                  py: 1.5,
                  px: 4,
                  fontWeight: 'bold',
                  '&:hover': { 
                    bgcolor: 'rgba(26, 34, 56, 0.05)',
                    borderColor: '#1A2238'
                  }
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
      <ChatBot />
    </>
  );
};

export default ServerError; 