// Checkout.jsx
// Flexible checkout component with comprehensive logging and Stripe integration

import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Collapse,
  IconButton,
  alpha,
  Snackbar,
} from '@mui/material';
import {
  CheckCircle,
  Error as ErrorIcon,
  ExpandMore,
  ExpandLess,
  ShoppingCart,
  Lock,
  CreditCard,
  LocalShipping,
  Info,
  ArrowForward,
} from '@mui/icons-material';
import { useShoppingCart } from '../../Context/ShoppingCart';
import { useTheme } from '../../Context/ThemeContext';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Main Checkout Component
const Checkout = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const { colors, gradients, glassmorphism } = useTheme();
  const {
    cartItems,
    itemCount,
    subtotal,
    memberDiscount,
    bundleDiscount,
    totalDiscounts,
    discountedSubtotal,
    tax,
    shipping,
    total,
    clearCart,
  } = useShoppingCart();

  const [activeStep, setActiveStep] = useState(0);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [cartLoaded, setCartLoaded] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  // Check if returning from Stripe success
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      console.log('🎉 Returning from Stripe with session:', sessionId);
      setActiveStep(2); // Go to confirmation step
      
      // Clear cart after successful payment
      setTimeout(() => {
        clearCart();
      }, 2000);
    }
  }, [searchParams, clearCart]);

  // Comprehensive cart analysis (preserved from ShoppingCart.jsx)
  const cartAnalysis = useMemo(() => {
    // console.log('🛒 === CHECKOUT COMPONENT LOADED ===');
    // console.log('Total amount:', `$${(total / 100).toFixed(2)}`);
    // console.log('Number of items:', itemCount);
    // console.log('\n=== DETAILED CART ANALYSIS ===');
    
    const incompleteItems = [];
    const completeItems = [];
    
    // cartItems.forEach((item, index) => {
    //   console.log(`--- Item ${index + 1}: ${item.name || item.title} ---`);
    //   console.log('  Basic Info:');
    //   console.log(`    • Name: ${item.name || item.title}`);
    //   console.log(`    • Price: $${((item.price || 0) / 100).toFixed(2)} each`);
    //   console.log(`    • Quantity: ${item.quantity}`);
    //   console.log(`    • Line Total: $${(((item.price || 0) * item.quantity) / 100).toFixed(2)}`);
    //   console.log(`    • Category: ${item.category || 'N/A'}`);
    //   console.log(`    • Status: ${item.status || 'N/A'}`);
      
    //   // Check for size selection
    //   const hasSize = item.sizes && item.sizes.length > 0;
    //   const sizeSelected = item.selectedSize;
    //   console.log('  Size Selection:');
    //   if (hasSize) {
    //     console.log(`    • Available sizes: [${item.sizes.join(', ')}]`);
    //     console.log(`    • Selected size: ${sizeSelected || '⚠️  NOT SELECTED'}`);
    //     if (!sizeSelected) {
    //       console.log('    ❌ SIZE SELECTION REQUIRED');
    //     } else {
    //       console.log('    ✅ Size selected');
    //     }
    //   } else {
    //     console.log('    • No size options available');
    //   }
      
    //   // Check for color selection
    //   const hasColor = item.colors && item.colors.length > 0;
    //   const colorSelected = item.selectedColor;
    //   console.log('  Color Selection:');
    //   if (hasColor) {
    //     console.log(`    • Available colors: [${item.colors.join(', ')}]`);
    //     console.log(`    • Selected color: ${colorSelected || '⚠️  NOT SELECTED'}`);
    //     if (!colorSelected) {
    //       console.log('    ❌ COLOR SELECTION REQUIRED');
    //     } else {
    //       console.log('    ✅ Color selected');
    //     }
    //   } else {
    //     console.log('    • No color options available');
    //   }
      
    //   // Determine if item is complete
    //   const needsSize = hasSize && !sizeSelected;
    //   const needsColor = hasColor && !colorSelected;
    //   const isComplete = !needsSize && !needsColor;
      
    //   if (isComplete) {
    //     console.log('  ✅ ITEM READY FOR CHECKOUT');
    //     completeItems.push({
    //       ...item,
    //       name: item.name || item.title,
    //       needsSize: false,
    //       needsColor: false,
    //       lineTotal: (item.price * item.quantity)
    //     });
    //   } else {
    //     console.log('  ❌ ITEM INCOMPLETE - MISSING SELECTIONS');
    //     incompleteItems.push({
    //       ...item,
    //       name: item.name || item.title,
    //       needsSize,
    //       needsColor,
    //       missingSelections: [
    //         ...(needsSize ? ['size'] : []),
    //         ...(needsColor ? ['color'] : [])
    //       ]
    //     });
    //   }
    //   console.log(); // Empty line for spacing
    // });
    
    // // Summary
    // console.log('=== CHECKOUT READINESS SUMMARY ===');
    // console.log(`✅ Complete items: ${completeItems.length}`);
    // console.log(`❌ Incomplete items: ${incompleteItems.length}`);
    
    if (incompleteItems.length > 0) {
      console.log('\n🚫 CHECKOUT BLOCKED - The following items need selections:');
      incompleteItems.forEach(item => {
        console.log(`  • ${item.name}: Missing ${item.missingSelections.join(' and ')}`);
      });
      console.log('\n⚠️  Please complete all item selections before proceeding to checkout.');
    } else {
      console.log('\n🎉 ALL ITEMS READY FOR CHECKOUT!');
      console.log('\nFinal order summary:');
      completeItems.forEach(item => {
        const details = [];
        if (item.selectedSize) details.push(`Size: ${item.selectedSize}`);
        if (item.selectedColor) details.push(`Color: ${item.selectedColor}`);
        const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
        console.log(`  • ${item.quantity}x ${item.name}${detailsStr} - $${(item.lineTotal / 100).toFixed(2)}`);
      });
    }
    
    console.log('=====================================');

    return { completeItems, incompleteItems };
  }, [cartItems, itemCount, total]);

  // Check authentication
  useEffect(() => {
    console.log("user object", user, "userLoaded", userLoaded, "isSignedIn", isSignedIn);
    
    if (userLoaded && !isSignedIn) {
      console.log('❌ User not authenticated, redirecting to login...');
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [userLoaded, isSignedIn, navigate]);

  // Mark cart as loaded after a short delay to allow localStorage to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartLoaded(true);
      console.log('✅ Cart loading complete');
    }, 500); // Give localStorage time to load

    return () => clearTimeout(timer);
  }, []);

  // Handle Stripe Checkout
  const handleStripeCheckout = useCallback(async () => {
    setProcessingCheckout(true);
    console.log('💳 === INITIATING STRIPE CHECKOUT ===');
    
    try {
      // Create checkout session
      console.log('📡 Creating checkout session...');
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userId: user?.id,
          successUrl: `${window.location.origin}/checkout?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/checkout`,
          metadata: {
            memberDiscount: memberDiscount.toString(),
            bundleDiscount: bundleDiscount.toString(),
            shipping: shipping.toString(),
            tax: tax.toString(),
          }
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      console.log('✅ Checkout session created:', data.sessionId);
      console.log('🚀 Redirecting to Stripe Checkout...');

      // Redirect to Stripe Checkout
      window.location.href = data.url;
      
    } catch (err) {
      console.error('❌ Checkout error:', err);
      setNotification({
        open: true,
        message: err.message || 'Failed to initiate checkout. Please try again.',
        severity: 'error'
      });
      setProcessingCheckout(false);
    }
  }, [cartItems, user, memberDiscount, bundleDiscount, shipping, tax]);

  // Redirect if cart is empty (only after cart has loaded)
  useEffect(() => {
    if (cartLoaded && cartItems.length === 0 && activeStep === 0) {
      console.log('🛒 Cart is empty, redirecting to shop...');
      setNotification({
        open: true,
        message: 'Your cart is empty. Redirecting to shop...',
        severity: 'info'
      });
      setTimeout(() => {
        navigate('/shop');
      }, 2000);
    }
  }, [cartLoaded, cartItems.length, activeStep, navigate]);

  const steps = ['Review Order', 'Payment', 'Confirmation'];

  // Don't render until user is loaded and cart is loaded
  if (!userLoaded || !cartLoaded) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          {!userLoaded ? 'Checking authentication...' : 'Loading cart...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        py: 4, 
        background: `linear-gradient(135deg, 
          rgba(59, 130, 246, 0.08) 0%, 
          rgba(147, 51, 234, 0.12) 35%, 
          rgba(246, 81, 30, 0.08) 100%
        )`,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(246, 81, 30, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 2 },
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: gradients.shimmerGradient,
              opacity: 0.6,
            }
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              Checkout
            </Typography>

          </Box>

          {/* User Identification */}
          {user && (
            <Card 
              sx={{ 
                mb: 4,
                ...glassmorphism.container,
                background: 'rgba(255, 255, 255, 0.08)',
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
              }}
            >
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {user.imageUrl && (
                    <Box
                      component="img"
                      src={user.imageUrl}
                      alt={user.fullName || user.firstName || 'User'}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        border: `2px solid ${colors.primary}`,
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Ordering as:
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      {user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.primaryEmailAddress?.emailAddress}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label="Verified"
                    sx={{
                      background: alpha(colors.accent, 0.2),
                      color: colors.accent,
                      border: `1px solid ${alpha(colors.accent, 0.3)}`,
                      '& .MuiChip-icon': {
                        color: colors.accent,
                      }
                    }}
                    icon={<CheckCircle fontSize="small" />}
                  />
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Stepper */}
          <Stepper 
            activeStep={activeStep} 
            sx={{ 
              mb: 4,
              '& .MuiStepLabel-root': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
              '& .MuiStepLabel-active': {
                color: colors.primary,
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255, 255, 255, 0.3)',
                '&.MuiStepIcon-active': {
                  color: colors.primary,
                },
                '&.MuiStepIcon-completed': {
                  color: colors.accent,
                }
              },
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '& .MuiStepConnector-root.MuiStepConnector-active .MuiStepConnector-line': {
                borderColor: colors.primary,
              },
              '& .MuiStepConnector-root.MuiStepConnector-completed .MuiStepConnector-line': {
                borderColor: colors.accent,
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Content based on step */}
          {activeStep === 0 && (
            // Step 1: Review Order
            <Box>
              {cartAnalysis.incompleteItems.length > 0 && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    background: 'rgba(255, 107, 107, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 107, 107, 0.3)',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: '#ff6b6b',
                    },
                    '& .MuiAlert-message': {
                      color: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Please complete all item selections before proceeding:
                  </Typography>
                  {cartAnalysis.incompleteItems.map((item, index) => (
                    <Typography key={index} variant="body2">
                      • {item.name}: Missing {item.missingSelections.join(' and ')}
                    </Typography>
                  ))}
                </Alert>
              )}

              {/* Order Summary */}
              <Card 
                sx={{ 
                  mb: 3,
                  ...glassmorphism.container,
                  background: 'rgba(255, 255, 255, 0.06)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${alpha(colors.primary, 0.2)}`,
                  }
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => setOrderDetailsOpen(!orderDetailsOpen)}
                  >
                    <Typography variant="h6">
                      Order Summary ({itemCount} items)
                    </Typography>
                    <IconButton size="small">
                      {orderDetailsOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>

                  <Collapse in={orderDetailsOpen}>
                    <List>
                      {cartItems.map((item) => {
                        const isIncomplete = cartAnalysis.incompleteItems.find(i => i.id === item.id);
                        return (
                          <ListItem
                            key={item.id}
                            divider
                            sx={{
                              opacity: isIncomplete ? 0.6 : 1,
                              position: 'relative',
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body1">
                                    {item.quantity}x {item.name || item.title}
                                  </Typography>
                                  {isIncomplete && (
                                    <Chip
                                      size="small"
                                      label="Incomplete"
                                      color="error"
                                      icon={<ErrorIcon />}
                                    />
                                  )}
                                </Box>
                              }
                              secondary={
                                <React.Fragment>
                                  {item.selectedSize && (
                                    <Typography variant="caption" component="span">
                                      Size: {item.selectedSize}
                                    </Typography>
                                  )}
                                  {item.selectedSize && item.selectedColor && ' • '}
                                  {item.selectedColor && (
                                    <Typography variant="caption" component="span">
                                      Color: {item.selectedColor}
                                    </Typography>
                                  )}
                                </React.Fragment>
                              }
                            />
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              ${((item.price * item.quantity) / 100).toFixed(2)}
                            </Typography>
                          </ListItem>
                        );
                      })}
                    </List>

                    <Divider sx={{ my: 2 }} />

                    {/* Price Breakdown */}
                    <Box sx={{ px: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Subtotal</Typography>
                        <Typography variant="body2">${(subtotal / 100).toFixed(2)}</Typography>
                      </Box>
                      
                      {memberDiscount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="primary">
                            Member Discount (5%)
                          </Typography>
                          <Typography variant="body2" color="primary">
                            -${(memberDiscount / 100).toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                      
                      {bundleDiscount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="primary">
                            Bundle Discount (10%)
                          </Typography>
                          <Typography variant="body2" color="primary">
                            -${(bundleDiscount / 100).toFixed(2)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Tax</Typography>
                        <Typography variant="body2">${(tax / 100).toFixed(2)}</Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            Shipping
                          </Typography>
                          {shipping === 0 && (
                            <Chip
                              size="small"
                              label="FREE"
                              color="success"
                              sx={{ height: 20 }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2">
                          {shipping === 0 ? 'FREE' : `$${(shipping / 100).toFixed(2)}`}
                        </Typography>
                      </Box>
                      
                      <Divider sx={{ my: 1 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6">Total</Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            background: gradients.primaryGradient,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          ${(total / 100).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>

              {/* Continue Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/shop')}
                  size="large"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                    }
                  }}
                >
                  Back to Shop
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (cartAnalysis.incompleteItems.length === 0) {
                      console.log('✅ Proceeding to payment');
                      handleStripeCheckout();
                    } else {
                      setNotification({
                        open: true,
                        message: 'Please complete all item selections before proceeding',
                        severity: 'error'
                      });
                    }
                  }}
                  disabled={cartAnalysis.incompleteItems.length > 0 || processingCheckout}
                  size="large"
                  endIcon={processingCheckout ? <CircularProgress size={20} /> : <CreditCard />}
                  sx={{
                    background: gradients.primaryGradient,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(246, 81, 30, 0.3)',
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${alpha(colors.primary, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(colors.primary, 0.9)}, ${colors.darkOrange})`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 24px ${alpha(colors.primary, 0.4)}`,
                    },
                    '&:disabled': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'rgba(255, 255, 255, 0.4)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  {processingCheckout ? 'Processing...' : 'Proceed to Payment'}
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            // Step 2: Payment (This step is now handled by Stripe Checkout)
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={60} />
              <Typography variant="h5" sx={{ mt: 3, mb: 1 }}>
                Redirecting to Secure Payment...
              </Typography>
              <Typography variant="body1" color="text.secondary">
                You will be redirected to Stripe's secure checkout page.
              </Typography>
            </Box>
          )}

          {activeStep === 2 && (
            // Step 3: Confirmation
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Payment Successful!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Thank you for your purchase. Your order has been confirmed.
              </Typography>
              
              {searchParams.get('session_id') && (
                <Card sx={{ 
                  maxWidth: 600, 
                  mx: 'auto', 
                  mb: 3,
                  ...glassmorphism.container,
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(0, 255, 255, 0.2)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Details
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Session ID: {searchParams.get('session_id')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      A confirmation email has been sent to your registered email address.
                    </Typography>
                  </CardContent>
                </Card>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/shop')}
                  size="large"
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: 2,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate('/layout/dashboard')}
                  size="large"
                  sx={{
                    background: gradients.accentGradient,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 255, 255, 0.3)',
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${alpha(colors.accent, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(90deg, ${alpha(colors.accent, 0.9)}, ${colors.lightBlue})`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 24px ${alpha(colors.accent, 0.4)}`,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Checkout;