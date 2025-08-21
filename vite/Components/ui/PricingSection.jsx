// PricingSection.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Tabs,
  Tab,
  useMediaQuery
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Link as RouterLink } from 'react-router-dom';
import { providerPlans, facilityPlans } from '../../data/pricingData';

const PricingSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 = Providers, 1 = Facilities
  const sectionRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Choose which plans to display
  const displayedPlans = tabValue === 0 
    ? providerPlans.slice(0, isMobile ? 2 : 3) // Show fewer plans on mobile
    : facilityPlans.slice(0, isMobile ? 2 : 3);

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        py: 10,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          component="h2"
          align="center"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            fontSize: { xs: '2rem', md: '3rem' },
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          Credential Passport Pricing
        </Typography>

        <Typography
          variant="h6"
          component="p"
          align="center"
          sx={{
            mb: 5,
            color: 'text.secondary',
            maxWidth: '800px',
            mx: 'auto',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            transitionDelay: '0.2s',
          }}
        >
          Secure, streamlined credential management with options for both healthcare providers and facilities
        </Typography>

        {/* Tabs */}
        <Box sx={{ 
          width: '100%', 
          display: 'flex',
          justifyContent: 'center',
          mb: 6,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
          transitionDelay: '0.3s',
        }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ 
              '& .MuiTab-root': {
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                px: { xs: 2, md: 4 },
                py: 1.5,
              },
              '& .Mui-selected': {
                color: '#1A2238',
                fontWeight: 'bold',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#F9BF29',
                height: 3,
              }
            }}
          >
            <Tab 
              icon={<PersonIcon sx={{ mr: 1 }} />} 
              label="For Providers" 
              iconPosition="start"
            />
            <Tab 
              icon={<BusinessIcon sx={{ mr: 1 }} />} 
              label="For Facilities" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {displayedPlans.map((plan, index) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={plan.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'visible',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                  border: plan.popularFeature ? '2px solid #F9BF29' : '1px solid #e0e0e0',
                  transition: 'transform 0.5s ease, box-shadow 0.5s ease',
                  position: 'relative',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible 
                    ? 'translateY(0)' 
                    : `translateY(${50 + (index * 20)}px)`,
                  transition: `opacity 0.7s ease, transform 0.7s ease`,
                  transitionDelay: `${index * 0.15}s`,
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                {plan.popularFeature && (
                  <Chip
                    label="Popular"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      right: 20,
                      bgcolor: '#F9BF29',
                      color: 'black',
                      fontWeight: 'bold',
                      zIndex: 1,
                    }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography
                    variant="h5"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 'bold', mb: 2 }}
                  >
                    {plan.title}
                  </Typography>
                  
                  <Typography variant="h3" component="div" sx={{ 
                    fontWeight: 'bold', 
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'flex-end'
                  }}>
                    {plan.price}
                    <Typography variant="body2" component="span" sx={{ 
                      ml: 1, 
                      mb: 0.8,
                      color: 'text.secondary'
                    }}>
                      {plan.period}
                    </Typography>
                  </Typography>
                  
                  <Button
                    component={RouterLink}
                    to="/pricing"
                    variant={plan.popularFeature ? "contained" : "outlined"}
                    fullWidth
                    sx={
                      plan.popularFeature 
                        ? {
                            bgcolor: '#F9BF29',
                            color: 'black',
                            py: 1.5,
                            mt: 2,
                            mb: 3,
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: '#e5ad25',
                            },
                          }
                        : {
                            borderColor: '#1A2238',
                            color: '#1A2238',
                            py: 1.5,
                            mt: 2,
                            mb: 3,
                            fontWeight: 'bold',
                            '&:hover': {
                              bgcolor: 'rgba(26, 34, 56, 0.1)',
                            },
                          }
                    }
                  >
                    View Details
                  </Button>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    {plan.description}
                  </Typography>
                  
                  <List disablePadding>
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <ListItem 
                        key={i} 
                        disablePadding 
                        disableGutters
                        sx={{ mb: 1 }}
                      >
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckIcon sx={{ color: '#F9BF29' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: feature.includes('All') ? { fontWeight: 'medium' } : {}
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  {plan.features.length > 4 && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 1, 
                        fontStyle: 'italic',
                        textAlign: 'center'
                      }}
                    >
                      +{plan.features.length - 4} more features
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 6,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            transitionDelay: '0.6s',
          }}
        >
          <Button
            component={RouterLink}
            to="/pricing"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#1A2238',
              color: 'white',
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#131b2f',
              },
            }}
          >
            See All Pricing Options
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default PricingSection; 