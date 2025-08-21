// MembershipPlans.jsx
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
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Paper,
  TextField,
  alpha
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PetsIcon from '@mui/icons-material/Pets';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDataLayer } from '../../Context/DataLayer';
import { useTheme } from '../../Context/ThemeContext';
import { membershipPlans, oneTimeServices, giftCardOptions, sizeCategories, getPriceBySize } from '../../assets/pricing/membershipPlans';

const MembershipPlans = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState('small');
  const [serviceType, setServiceType] = useState('membership'); // 'membership', 'one-time', 'gift-cards'
  const [customAmount, setCustomAmount] = useState('');
  const sectionRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { selectPlan, isAuthenticated } = useDataLayer();
  const { colors, gradients, fonts, glassmorphism } = useTheme();

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

  const handleSizeChange = (event, newSize) => {
    if (newSize !== null) {
      setSelectedSize(newSize);
    }
  };

  const handleServiceTypeChange = (event, newType) => {
    if (newType !== null) {
      setServiceType(newType);
    }
  };

  const handlePlanSelection = (plan) => {
    // Store the selected plan with size info in DataLayer context
    selectPlan(plan.id, {
      ...plan,
      selectedSize,
      pricing: getPriceBySize(plan, selectedSize)
    });
    
    // Navigate to login page - the plan info will be available in DataLayer context
    navigate('/login');
  };

  const handleOneTimeBooking = (service) => {
    // Store the selected service with size info in DataLayer context
    selectPlan(service.id, {
      ...service,
      selectedSize,
      pricing: getPriceBySize(service, selectedSize)
    });
    
    // Navigate to login page - the service info will be available in DataLayer context
    navigate('/login');
  };

  const handleGiftCardPurchase = (giftCard) => {
    const amount = giftCard.id === 'gift-custom' ? customAmount : giftCard.value.replace('$', '');
    
    // Store the selected gift card info in DataLayer context
    selectPlan(giftCard.id, {
      ...giftCard,
      selectedAmount: amount,
      pricing: `$${amount}`,
      title: giftCard.id === 'gift-custom' ? `Custom Gift Card` : `${giftCard.value} Gift Card`,
      serviceType: 'gift-card'
    });
    
    // Navigate to login page - the gift card info will be available in DataLayer context
    navigate('/login');
  };

  return (
    <Box
      component="section"
      ref={sectionRef}
      sx={{
        py: 4,
        background: gradients.darkGlass,
        position: 'relative',
        overflow: 'hidden',
        color: '#ffffff',
      }}
    >
      {/* Animated Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            left: -96,
            width: 192,
            height: 192,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.25,
            filter: 'blur(60px)',
            animation: 'pulse 5s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.25 },
              '50%': { transform: 'scale(1.3)', opacity: 0.4 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: -48,
            width: 128,
            height: 128,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(40px)',
            animation: 'pulse 7s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20%',
            left: '30%',
            width: 160,
            height: 160,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.15,
            filter: 'blur(50px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Enhanced Title with Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
          <Star 
            sx={{ 
              fontSize: { xs: 28, md: 40 }, 
              color: colors.primary,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(-180deg) scale(0.5)',
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.2s',
            }} 
          />
          <Typography
            variant="h2"
            component="h2"
            align="center"
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '3rem' },
              fontFamily: fonts.heading,
              background: gradients.multiGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              transitionDelay: '0.4s',
            }}
          >
            Grooming Options
          </Typography>
          <Star 
            sx={{ 
              fontSize: { xs: 24, md: 36 }, 
              color: colors.accent,
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(180deg) scale(0.5)',
              transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: '0.6s',
            }} 
          />
        </Box>

        <Typography
          variant="h6"
          component="p"
          align="center"
          sx={{
            mb: 3,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '800px',
            mx: 'auto',
            fontFamily: fonts.body,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            transitionDelay: '0.2s',
          }}
        >
          Choose from monthly plans, one-time appointments, or give the perfect gift
        </Typography>

        {/* Size Toggle - Only show for membership and one-time services */}
        {serviceType !== 'gift-cards' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <ToggleButtonGroup
              value={selectedSize}
              exclusive
              onChange={handleSizeChange}
              aria-label="dog size selection"
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
                transitionDelay: '0.3s',
                ...glassmorphism.card,
                borderRadius: 3,
                flexDirection: isMobile ? 'column' : 'row',
                '& .MuiToggleButton-root': {
                  color: '#ffffff',
                  borderColor: alpha(colors.primary, 0.3),
                  background: alpha(colors.glassWhite, 0.05),
                  backdropFilter: 'blur(10px)',
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  minWidth: { xs: '120px', sm: 'auto' },
                  fontFamily: fonts.body,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: alpha(colors.primary, 0.2),
                    transform: 'scale(1.02)',
                    boxShadow: `0 4px 12px ${alpha(colors.primary, 0.3)}`,
                  },
                  '&.Mui-selected': {
                    background: gradients.primaryGradient,
                    color: '#ffffff',
                    fontWeight: 'bold',
                    border: `1px solid ${alpha(colors.primary, 0.6)}`,
                    '&:hover': {
                      background: gradients.glowGradient,
                      transform: 'scale(1.05)',
                    }
                  }
                }
              }}
            >
              {Object.entries(sizeCategories).map(([key, category]) => (
                <ToggleButton 
                  key={key}
                  value={key}
                >
                  <PetsIcon sx={{ mr: { xs: 0.5, sm: 1 }, fontSize: { xs: '1rem', sm: '1.2rem' } }} />
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {category.label}
                    </Typography>
                    <Typography variant="caption" sx={{ ml: { xs: 0, sm: 0.5 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      ({category.description})
                    </Typography>
                  </Box>
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        )}

        {/* Service Type Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
          <ToggleButtonGroup
            value={serviceType}
            exclusive
            onChange={handleServiceTypeChange}
            aria-label="service type selection"
            orientation={isMobile ? 'vertical' : 'horizontal'}
            sx={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 0.8s ease, transform 0.8s ease',
              transitionDelay: '0.4s',
              ...glassmorphism.strong,
              borderRadius: 3,
              flexDirection: isMobile ? 'column' : 'row',
              '& .MuiToggleButton-root': {
                color: '#ffffff',
                borderColor: alpha(colors.accent, 0.3),
                background: alpha(colors.glassWhite, 0.05),
                backdropFilter: 'blur(15px)',
                px: { xs: 2, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.9rem', sm: '1rem' },
                minWidth: { xs: '160px', sm: 'auto' },
                fontFamily: fonts.body,
                fontWeight: '500',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.accent, 0.2),
                  transform: 'scale(1.02)',
                  boxShadow: `0 4px 12px ${alpha(colors.accent, 0.3)}`,
                },
                '&.Mui-selected': {
                  background: gradients.accentGradient,
                  color: '#ffffff',
                  fontWeight: 'bold',
                  border: `1px solid ${alpha(colors.accent, 0.6)}`,
                  '&:hover': {
                    background: gradients.multiGradient,
                    transform: 'scale(1.05)',
                  }
                }
              }
            }}
          >
            <ToggleButton value="membership">
              <CalendarViewMonthIcon sx={{ mr: 1 }} />
              Monthly Plans
            </ToggleButton>
            <ToggleButton value="one-time">
              <CalendarTodayIcon sx={{ mr: 1 }} />
              Book Once
            </ToggleButton>
            <ToggleButton value="gift-cards">
              <CardGiftcardIcon sx={{ mr: 1 }} />
              Gift Cards
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {serviceType === 'membership' ? (
          // Monthly Membership Plans
          <Grid container spacing={4} justifyContent="center">
            {membershipPlans.map((plan, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={plan.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ...glassmorphism.card,
                    border: plan.popularFeature 
                      ? `2px solid ${colors.primary}` 
                      : `1px solid ${alpha(colors.primary, 0.3)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible 
                      ? 'translateY(0)' 
                      : `translateY(${50 + (index * 20)}px)`,
                    transition: `transform 0.7s ease, box-shadow 0.5s ease, opacity 0.7s ease`,
                    transitionDelay: `${index * 0.15 + 0.5}s`,
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      ...glassmorphism.strong,
                      boxShadow: `0 20px 60px ${alpha(colors.primary, 0.4)}`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: gradients.shimmerGradient,
                      transition: 'left 0.6s',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                  }}
                >
                  {plan.popularFeature && (
                    <Chip
                      label="Most Popular"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        background: gradients.primaryGradient,
                        color: '#ffffff',
                        fontWeight: 'bold',
                        zIndex: 2,
                        animation: 'glow 2s ease-in-out infinite',
                        '@keyframes glow': {
                          '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.primary, 0.5)}` },
                          '50%': { boxShadow: `0 0 20px ${alpha(colors.primary, 0.8)}` },
                        },
                      }}
                    />
                  )}

                  {/* Floating Service Icon */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 3,
                      background: gradients.accentGradient,
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
                      transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      transitionDelay: `${index * 0.3 + 1.2}s`,
                      animation: 'iconPulse 3s ease-in-out infinite',
                      '@keyframes iconPulse': {
                        '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.accent, 0.5)}` },
                        '50%': { boxShadow: `0 0 20px ${alpha(colors.accent, 0.8)}` },
                      },
                    }}
                  >
                    {index === 0 && <Bolt sx={{ fontSize: 20, color: '#ffffff' }} />}
                    {index === 1 && <TrendingUp sx={{ fontSize: 20, color: '#ffffff' }} />}
                    {index === 2 && <Star sx={{ fontSize: 20, color: '#ffffff' }} />}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 2 }}>
                    <Typography
                      variant="h5"
                      component="h3"
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 2,
                        color: '#ffffff',
                        fontFamily: fonts.heading,
                        background: gradients.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 1px 2px rgba(246, 81, 30, 0.3))',
                      }}
                    >
                      {plan.title}
                    </Typography>
                    
                    <Typography variant="h3" component="div" sx={{ 
                      fontWeight: 'bold', 
                      mb: 0.5,
                      display: 'flex',
                      alignItems: 'flex-end',
                      background: gradients.accentGradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 1px 2px rgba(0, 255, 255, 0.3))',
                    }}>
                      {getPriceBySize(plan, selectedSize)}
                      <Typography variant="body2" component="span" sx={{ 
                        ml: 1, 
                        mb: 0.8,
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: fonts.body,
                      }}>
                        {plan.period}
                      </Typography>
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.lottieGreen,
                        fontWeight: 'bold',
                        mb: 2,
                        textShadow: `0 0 10px ${alpha(colors.lottieGreen, 0.5)}`,
                      }}
                    >
                      {plan.savings[selectedSize]}
                    </Typography>
                    
                    <Button
                      onClick={() => handlePlanSelection(plan)}
                      variant="contained"
                      fullWidth
                      startIcon={<Bolt />}
                      sx={{
                        background: plan.button.variant === "contained"
                          ? gradients.multiGradient
                          : alpha(colors.glassWhite, 0.1),
                        backgroundSize: '200% 200%',
                        color: '#ffffff',
                        py: 1.5,
                        mt: 2,
                        mb: 3,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        border: `1px solid ${alpha('#ffffff', 0.2)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        animation: plan.button.variant === "contained" ? 'gradient-shift 4s ease infinite' : 'none',
                        '@keyframes gradient-shift': {
                          '0%': { backgroundPosition: '0% 50%' },
                          '50%': { backgroundPosition: '100% 50%' },
                          '100%': { backgroundPosition: '0% 50%' },
                        },
                        '&:hover': {
                          background: gradients.glowGradient,
                          transform: 'scale(1.05)',
                          boxShadow: `0 8px 32px ${alpha(colors.primary, 0.5)}`,
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: gradients.shimmerGradient,
                          transition: 'left 0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                      }}
                    >
                      {plan.button.label}
                    </Button>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 3,
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: fonts.body,
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {plan.description}
                    </Typography>
                    
                    <List disablePadding>
                      {plan.features.map((feature, i) => (
                        <ListItem 
                          key={i} 
                          disablePadding 
                          disableGutters
                          sx={{ 
                            mb: 1,
                            transition: 'transform 0.2s ease',
                            '&:hover': {
                              transform: 'translateX(4px)',
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckIcon sx={{ 
                              color: colors.lottieGreen,
                              filter: `drop-shadow(0 0 5px ${colors.lottieGreen})`,
                            }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: {
                                color: 'rgba(255,255,255,0.9)',
                                fontFamily: fonts.body,
                                fontWeight: feature.includes('Full Groom') || feature.includes('Priority') ? 'medium' : 'normal'
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : serviceType === 'one-time' ? (
          // One-time Services
          <Grid container spacing={4} justifyContent="center">
            {oneTimeServices.map((service, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={service.id}>
                <Paper
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ...glassmorphism.card,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'transform 0.7s ease, opacity 0.7s ease',
                    transitionDelay: `${index * 0.2 + 0.5}s`,
                    '&:hover': {
                      ...glassmorphism.strong,
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 20px 60px ${alpha(colors.secondary, 0.3)}`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: gradients.shimmerGradient,
                      transition: 'left 0.6s',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                  }}
                >
                  {/* Floating Service Icon */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 3,
                      background: gradients.multiGradient,
                      borderRadius: '50%',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'iconPulse 3s ease-in-out infinite',
                    }}
                  >
                    {index === 0 ? <Star sx={{ fontSize: 24, color: '#ffffff' }} /> : <TrendingUp sx={{ fontSize: 24, color: '#ffffff' }} />}
                  </Box>

                  <Typography variant="h4" component="h3" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    color: '#ffffff',
                    fontFamily: fonts.heading,
                    background: gradients.multiGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))',
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    {service.title}
                  </Typography>
                  
                  <Typography variant="h3" component="div" sx={{ 
                    fontWeight: 'bold', 
                    mb: 2,
                    background: gradients.primaryGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 1px 2px rgba(246, 81, 30, 0.3))',
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    {getPriceBySize(service, selectedSize)}
                  </Typography>
                  
                  <Typography variant="body1" sx={{ 
                    mb: 3, 
                    color: 'rgba(255,255,255,0.8)',
                    fontFamily: fonts.body,
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    {service.description}
                  </Typography>
                  
                  <List disablePadding sx={{ mb: 3, position: 'relative', zIndex: 2 }}>
                    {service.features.map((feature, i) => (
                      <ListItem key={i} disablePadding disableGutters sx={{ mb: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckIcon sx={{ 
                            color: colors.lottieGreen,
                            filter: `drop-shadow(0 0 5px ${colors.lottieGreen})`,
                          }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            sx: {
                              color: 'rgba(255,255,255,0.9)',
                              fontFamily: fonts.body,
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button
                    onClick={() => handleOneTimeBooking(service)}
                    variant="contained"
                    size="large"
                    startIcon={<Bolt />}
                    endIcon={<TrendingUp />}
                    sx={{
                      background: gradients.multiGradient,
                      backgroundSize: '200% 200%',
                      color: '#ffffff',
                      py: 2,
                      mt: 'auto',
                      fontWeight: 'bold',
                      borderRadius: 2,
                      border: `1px solid ${alpha('#ffffff', 0.2)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      zIndex: 2,
                      animation: 'gradient-shift 4s ease infinite',
                      '&:hover': {
                        background: gradients.glowGradient,
                        transform: 'scale(1.05)',
                        boxShadow: `0 8px 32px ${alpha(colors.secondary, 0.5)}`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: gradients.shimmerGradient,
                        transition: 'left 0.5s',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                    }}
                  >
                    Book Now
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Gift Cards
          <Grid container spacing={4} justifyContent="center">
            {giftCardOptions.map((giftCard, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={giftCard.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ...glassmorphism.card,
                    border: giftCard.popular 
                      ? `2px solid ${colors.accent}` 
                      : `1px solid ${alpha(colors.accent, 0.3)}`,
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
                    transition: 'transform 0.7s ease, opacity 0.7s ease',
                    transitionDelay: `${index * 0.15 + 0.5}s`,
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      ...glassmorphism.strong,
                      boxShadow: `0 20px 60px ${alpha(colors.accent, 0.4)}`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: gradients.shimmerGradient,
                      transition: 'left 0.6s',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                  }}
                >
                  {giftCard.popular && (
                    <Chip
                      label="Popular"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        right: 20,
                        background: gradients.accentGradient,
                        color: '#ffffff',
                        fontWeight: 'bold',
                        zIndex: 2,
                        animation: 'glow 2s ease-in-out infinite',
                        '@keyframes glow': {
                          '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.accent, 0.5)}` },
                          '50%': { boxShadow: `0 0 20px ${alpha(colors.accent, 0.8)}` },
                        },
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative', zIndex: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CardGiftcardIcon sx={{ 
                        fontSize: 32, 
                        color: colors.accent,
                        mr: 1,
                        filter: `drop-shadow(0 0 10px ${colors.accent})`,
                      }} />
                      <Typography variant="h4" component="h3" sx={{ 
                        fontWeight: 'bold',
                        background: gradients.accentGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 1px 2px rgba(0, 255, 255, 0.3))',
                      }}>
                        {giftCard.value}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" sx={{ 
                      mb: 3, 
                      color: 'rgba(255,255,255,0.8)',
                      fontFamily: fonts.body,
                    }}>
                      {giftCard.description}
                    </Typography>
                    
                    {giftCard.id === 'gift-custom' && (
                      <TextField
                        label="Enter amount ($25 minimum)"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        type="number"
                        fullWidth
                        sx={{ 
                          mb: 3,
                          '& .MuiInputBase-root': {
                            ...glassmorphism.container,
                            color: '#ffffff',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255,255,255,0.7)',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: colors.accent,
                          },
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: alpha(colors.accent, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha(colors.accent, 0.5),
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: colors.accent,
                              boxShadow: `0 0 10px ${alpha(colors.accent, 0.3)}`,
                            }
                          }
                        }}
                        inputProps={{ min: 25 }}
                      />
                    )}
                    
                    <List disablePadding sx={{ mb: 3 }}>
                      {giftCard.features.map((feature, i) => (
                        <ListItem key={i} disablePadding disableGutters sx={{ mb: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckIcon sx={{ 
                              color: colors.lottieGreen,
                              filter: `drop-shadow(0 0 5px ${colors.lottieGreen})`,
                            }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature} 
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              sx: {
                                color: 'rgba(255,255,255,0.9)',
                                fontFamily: fonts.body,
                              }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Button
                      onClick={() => handleGiftCardPurchase(giftCard)}
                      variant="contained"
                      fullWidth
                      startIcon={<Star />}
                      endIcon={<CardGiftcardIcon />}
                      disabled={giftCard.id === 'gift-custom' && (!customAmount || customAmount < 25)}
                      sx={{
                        background: gradients.multiGradient,
                        backgroundSize: '200% 200%',
                        color: '#ffffff',
                        py: 2,
                        mt: 'auto',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        border: `1px solid ${alpha('#ffffff', 0.2)}`,
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'gradient-shift 4s ease infinite',
                        '&:hover': {
                          background: gradients.glowGradient,
                          transform: 'scale(1.05)',
                          boxShadow: `0 8px 32px ${alpha(colors.accent, 0.5)}`,
                        },
                        '&:disabled': {
                          background: alpha(colors.glassWhite, 0.1),
                          color: 'rgba(255,255,255,0.5)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: gradients.shimmerGradient,
                          transition: 'left 0.5s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                      }}
                    >
                      Purchase Gift Card
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MembershipPlans; 