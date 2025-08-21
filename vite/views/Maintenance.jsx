import React from 'react';
import { 
  Box, 
  Container, 
  Typography,
  Button,
  Paper
} from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useEffect } from 'react';
const Maintenance = () => {
  // Function to check if the site is back up
  const checkSiteStatus = () => {
    window.location.href = '/';
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box
      sx={{
        py: 12,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#1A2238'
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'white'
          }}
        >
          <ConstructionIcon 
            sx={{ 
              fontSize: 100,
              color: '#F9BF29',
              mb: 3
            }} 
          />
          
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            We'll Be Back Soon
          </Typography>
          
          <Typography variant="h6" component="h2" gutterBottom>
            Scheduled Maintenance in Progress
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            We're currently performing scheduled maintenance to improve our services.
            Our site will be back online shortly. Thank you for your patience.
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="medium">
              Expected Completion:
            </Typography>
            <Typography variant="body1" color="primary.main" fontWeight="bold">
              {new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString()}
            </Typography>
          </Box>
          
          <Button
            onClick={checkSiteStatus}
            variant="contained"
            size="large"
            sx={{ 
              bgcolor: '#F9BF29',
              color: 'black',
              py: 1.5,
              px: 4,
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#e5ad25' }
            }}
          >
            Check if We're Back
          </Button>
          
          <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #eaeaea' }}>
            <Typography variant="subtitle2" color="text.secondary">
              For urgent matters, please contact us at{" "}
              <a href="mailto:support@medcredpro.com">
                support@medcredpro.com
              </a>{" "}
              for urgent matters.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Maintenance; 