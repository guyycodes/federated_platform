import React, { useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography,
  Button,
  Paper
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';

const AccessDenied = () => {
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
            <BlockIcon 
              sx={{ 
                fontSize: 100,
                color: '#ff9800',
                mb: 3
              }} 
            />
            
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              403
            </Typography>
            
            <Typography variant="h4" component="h2" gutterBottom>
              Access Denied
            </Typography>
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              You don't have permission to access this page. 
              This might be because you need to log in first or you don't have the required access level.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Button
                component={RouterLink}
                to="/login"
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
                Sign In
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

export default AccessDenied; 