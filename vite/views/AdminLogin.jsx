import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  alpha
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  AdminPanelSettings, 
  Business, 
  Person,
  Star,
  Security,
  Lock
} from '@mui/icons-material';
import Lottie from 'lottie-react';
import verificationAnimation from '/public/red-blob.json';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useDataLayer } from '../Context/DataLayer';
import { useTheme } from '../Context/ThemeContext';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import { useStaffAuth } from '../hooks/useAuth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearError } = useDataLayer();
  const { colors, gradients, fonts, glassmorphism } = useTheme();
  const { checkForUser, signOut, signIn, setActive, isLoaded, clearUser } = useStaffAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Route guard handles authentication checking now

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear errors when user types
    if (localError) setLocalError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setLocalError('Email is required');
      return;
    }
    
    if (!formData.password) {
      setLocalError('Password is required');
      return;
    }

    if (!formData.adminCode) {
      setLocalError('Access code is required');
      return;
    }

    // Verify admin code (hardcoded for now)
    if (formData.adminCode !== '123456') {
      setLocalError('Invalid access code');
      return;
    }

    if (!isLoaded) {
      return;
    }
    
    setIsLoading(true);
    setLocalError('');
    
    // fetch from prisma/supabase
    const user = await checkForUser(formData.email);
    console.log('User:', user);
    
    if (!user) {
      setLocalError('This account does not have admin access. Please use the customer login.');
      clearUser(); // Clear cached user state
      setIsLoading(false);
      return;
    }
    
    if (user.role !== 'USER_ADMIN' && user.role !== 'USER') {
      clearUser(); // Clear cached user state
      setLocalError('Access denied. You do not have administrator privileges.');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('=== Admin Login Process Started ===');
      console.log('Form data:', { email: formData.email, passwordProvided: !!formData.password });
    
      // Step 1: Authenticate with Clerk
      console.log('Step 1: Attempting Clerk authentication...');
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });
    
      console.log('Clerk auth result status:', result.status);
      console.log('Clerk auth result:', {
        status: result.status,
        createdSessionId: result.createdSessionId,
        // Don't log sensitive data, just structure
        hasCreatedSessionId: !!result.createdSessionId
      });
    
      if (result.status === 'complete') {
        console.log('✅ Clerk authentication successful');
        
        // Set the active session
        console.log('Setting active session...');
        await setActive({ session: result.createdSessionId });
        console.log('✅ Active session set');
        
        // Success - redirect to dashboard
        window.location.href = '/staff/dash/start';
      }
    } catch (err) {
      console.error('❌ Clerk authentication failed:', err);
      
      // Clear Clerk cache on auth errors in development
        console.log('🧹 Clearing Clerk cache after auth error...');
        Object.keys(localStorage).forEach(key => {
          if (key.includes('clerk') || key.includes('__clerk')) {
            localStorage.removeItem(key);
          }
        });
    
      
      setLocalError('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
        // Step 2: Verify user exists in database with admin role
    //     console.log('Step 2: Verifying admin privileges...');
        
    //     const requestBody = {
    //       email: formData.email,
    //       userId: user.id
    //     };
    //     console.log('API request body:', requestBody);
    
    //     let response;
    //     try {
    //       console.log('Making API call to /api/auth/admin-verify...');
    //       response = await fetch('/api/auth/admin-verify', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(requestBody),
    //       });

    //       console.log('API response status:', response.status);
    //       console.log('API response ok:', response.ok);
    //       console.log('API response headers:', Object.fromEntries(response.headers.entries()));
          
    //     } catch (fetchError) {
    //       console.error('❌ Fetch request failed:', fetchError);
    //       console.error('Fetch error details:', {
    //         name: fetchError.name,
    //         message: fetchError.message,
    //         stack: fetchError.stack
    //       });
    //       await signOut();
    //       setLocalError('Network error. Please check your connection and try again.');
    //     }
       
    //     // Handle different response statuses
    //     if (!response.ok) {
    //       console.log('❌ API request failed with status:', response.status);

    //       let errorMessage = 'Access denied. You do not have administrator privileges.';
    //       let apiErrorData = null;
          
    //       try {
    //         // Try to get error details from response
    //         const contentType = response.headers.get('content-type');
    //         console.log('Response content type:', contentType);
            
    //         if (contentType && contentType.includes('application/json')) {
    //           apiErrorData = await response.json();
    //           console.log('API error response:', apiErrorData);
    //         } else {
    //           const textResponse = await response.text();
    //           console.log('API error response (text):', textResponse);
    //         }
    //       } catch (responseParseError) {
    //         console.error('Error parsing error response:', responseParseError);
    //       }
          
    //       // Handle specific error statuses
    //       switch (response.status) {
    //         case 401:
    //           console.log('Unauthorized - Clerk auth may have failed');
    //           errorMessage = 'Authentication failed. Please try logging in again.';
    //           break;
    //         case 403:
    //           console.log('Forbidden - User lacks admin privileges');
    //           errorMessage = 'Access denied. You do not have administrator privileges.';
    //           break;
    //         case 404:
    //           console.log('User not found in database');
    //           errorMessage = 'User account not found in the system. Please contact an administrator.';
    //           break;
    //         case 500:
    //           console.log('Server error occurred');
    //           errorMessage = apiErrorData?.error || 'Server error occurred. Please try again later.';
    //           break;
    //         default:
    //           console.log('Unexpected error status:', response.status);
    //           errorMessage = `Unexpected error (${response.status}). Please try again.`;
    //       }
    //       await signOut();
    //       setLocalError(errorMessage);
    //       return;
    //     }
    //     console.log('✅ API request successful');

    //     // Parse the response
    //     let data;
    //     try {
    //       data = await response.json();
    //       console.log('API response data structure:', {
    //         hasUser: !!data.user,
    //         userKeys: data.user ? Object.keys(data.user) : [],
    //         userRole: data.user?.role,
    //         userEmail: data.user?.email,
    //         isActive: data.user?.isActive
    //       });
    //     } catch (jsonParseError) {
    //       console.error('❌ Error parsing successful response JSON:', jsonParseError);
    //       await signOut();
    //       setLocalError('Invalid response from server. Please try again.');
    //       return;
    //     }
        
    //     // Validate response structure
    //     if (!data || !data.user) {
    //       console.error('❌ Invalid response structure - missing user data');
    //       console.log('Received data:', data);
    //       await signOut();
    //       setLocalError('Invalid response from server. Please contact support.');
    //       return;
    //     }
    
    //     if (!data.user.role) {
    //       console.error('❌ User data missing role information');
    //       console.log('User data:', data.user);
    //       await signOut();
    //       setLocalError('User role information missing. Please contact support.');
    //       return;
    //     }
    
    //     // Verify user has appropriate admin role
    //     const allowedRoles = ['USER_ADMIN', 'USER', 'LOCATION_ADMIN'];
    //     console.log('Checking role authorization...');
    //     console.log('User role:', data.user.role);
    //     console.log('Allowed roles:', allowedRoles);

    //     if (!allowedRoles.includes(data.user.role)) {
    //       console.log('❌ Role check failed - user does not have admin privileges');
    //       await signOut();
    //       setLocalError('Access denied. You do not have administrator privileges.');
    //       return;
    //     }
    
    //     console.log('✅ Role check passed');
    //     console.log('User authorized with role:', data.user.role);
    
    //     // Success - route guard will handle navigation
    //     console.log('✅ Admin login successful - redirecting to dashboard');
    //     console.log('=== Admin Login Process Completed Successfully ===');
    //     window.location.href = '/staff/dash/start';
        
    //   } else {
    //     // Handle other statuses if needed (e.g., requires 2FA)
    //     console.log('❌ Clerk auth incomplete - status:', result.status);
    //     console.log('Auth result details:', result);
        
    //     if (result.status === 'needs_second_factor') {
    //       setLocalError('Two-factor authentication required. This is not currently supported for admin login.');
    //     } else if (result.status === 'needs_identifier') {
    //       setLocalError('Additional identification required. Please try again.');
    //     } else {
    //       setLocalError(`Sign in requires additional verification (${result.status})`);
    //     }
    //   }
    // } catch (err) {
    //   console.error('=== CRITICAL ERROR in Admin Login ===');
    //   console.error('Error type:', err.constructor.name);
    //   console.error('Error message:', err.message);
    //   console.error('Error stack:', err.stack);
      
    //   // Log additional error properties
    //   console.error('Error details:', {
    //     name: err.name,
    //     message: err.message,
    //     errors: err.errors,
    //     code: err.code,
    //     status: err.status
    //   });
      
    //   // Handle Clerk-specific errors
    //   if (err.errors && Array.isArray(err.errors)) {
    //     console.error('Clerk error details:', err.errors);
    //     const clerkError = err.errors[0];
    //     console.error('Primary Clerk error:', {
    //       code: clerkError.code,
    //       message: clerkError.message,
    //       longMessage: clerkError.longMessage,
    //       meta: clerkError.meta
    //     });
        
    //     // Set user-friendly error message based on Clerk error code
    //     switch (clerkError.code) {
    //       case 'form_identifier_not_found':
    //         setLocalError('Email address not found. Please check your email and try again.');
    //         break;
    //       case 'form_password_incorrect':
    //         setLocalError('Incorrect password. Please try again.');
    //         break;
    //       case 'form_identifier_exists':
    //         setLocalError('This email is already associated with an account.');
    //         break;
    //       case 'too_many_requests':
    //         setLocalError('Too many login attempts. Please wait a few minutes and try again.');
    //         break;
    //       default:
    //         setLocalError(clerkError.message || 'Invalid email or password');
    //     }
    //   } else if (err.message) {
    //     // Handle other types of errors
    //     console.error('Non-Clerk error occurred');
    //     if (err.message.includes('fetch')) {
    //       setLocalError('Network error. Please check your connection and try again.');
    //     } else {
    //       setLocalError('An unexpected error occurred. Please try again.');
    //     }
    //   } else {
    //     setLocalError('Invalid email or password');
    //   }
      
    //   console.error('=== END CRITICAL ERROR ===');
    // } finally {
    //   console.log('Setting loading state to false');
    //   setIsLoading(false);
    // }
  // };

  return (
    <>
      <HeaderBar />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          background: gradients.darkGlass,
          py: 8,
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: '12%',
            right: '8%',
            width: 200,
            height: 200,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.4,
            animation: 'adminPulse 5s ease-in-out infinite',
            '@keyframes adminPulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
              '50%': { transform: 'scale(1.2)', opacity: 0.6 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: 160,
            height: 160,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.3,
            animation: 'adminPulse 6s ease-in-out infinite 2s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '40%',
            left: '2%',
            width: 120,
            height: 120,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.25,
            animation: 'adminPulse 7s ease-in-out infinite 1s',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '45%',
            width: 80,
            height: 80,
            background: gradients.glowGradient,
            borderRadius: '50%',
            opacity: 0.2,
            animation: 'adminPulse 8s ease-in-out infinite 3s',
          }}
        />

        <Container maxWidth="sm">
          {/* Main glassmorphism container */}
          <Box 
            sx={{ 
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              background: alpha(colors.glassWhite, 0.12),
              backdropFilter: 'blur(25px)',
              border: `1px solid ${alpha(colors.primary, 0.3)}`,
              boxShadow: `0 25px 80px ${alpha(colors.primary, 0.4)}`,
              position: 'relative',
              zIndex: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 30px 90px ${alpha(colors.primary, 0.5)}`,
              },
            }}
          >
            {/* Enhanced header section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              {/* Brand section with enhanced styling */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Box 
                  sx={{ 
                    width: 50, 
                    height: 50, 
                    mr: 2,
                    borderRadius: '50%',
                    background: alpha(colors.glassWhite, 0.15),
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${alpha(colors.accent, 0.4)}`,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -4,
                      left: -4,
                      right: -4,
                      bottom: -4,
                      background: gradients.accentGradient,
                      borderRadius: '50%',
                      opacity: 0.3,
                      animation: 'brandGlow 4s ease-in-out infinite',
                      '@keyframes brandGlow': {
                        '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                        '50%': { opacity: 0.5, transform: 'scale(1.05)' },
                      },
                    },
                  }}
                >
                  <Lottie 
                    animationData={verificationAnimation} 
                    loop={true}
                    autoplay={true}
                    style={{ width: '80%', height: '80%' }}
                    aria-hidden="true"
                  />
                </Box>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  fontWeight="bold"
                  sx={{
                    fontFamily: fonts.brand,
                    background: gradients.primaryGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))',
                  }}
                >
                  BlackCore AI
                </Typography>
              </Box>
              
              {/* Admin portal section with enhanced styling */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: alpha(colors.glassWhite, 0.15),
                    backdropFilter: 'blur(15px)',
                    border: `2px solid ${alpha(colors.secondary, 0.4)}`,
                    mr: 2,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -6,
                      left: -6,
                      right: -6,
                      bottom: -6,
                      background: gradients.primaryGradient,
                      borderRadius: '50%',
                      opacity: 0.3,
                      animation: 'adminIconGlow 3s ease-in-out infinite',
                      '@keyframes adminIconGlow': {
                        '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                        '50%': { opacity: 0.5, transform: 'scale(1.08)' },
                      },
                    },
                  }}
                >
                  <AdminPanelSettings 
                    sx={{ 
                      fontSize: 28, 
                      color: colors.secondary,
                      filter: `drop-shadow(0 2px 4px ${alpha(colors.secondary, 0.5)})`,
                      position: 'relative',
                      zIndex: 2,
                    }} 
                  />
                </Box>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  fontWeight="medium"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontFamily: fonts.heading,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Admin Portal
                </Typography>
              </Box>
              
              {/* Enhanced security notice */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                <Security sx={{ color: colors.accent, mr: 1, fontSize: 20 }} />
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: fonts.body,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                >
                  Restricted access for authorized personnel only
                </Typography>
              </Box>

              {/* Enhanced access level badges */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                justifyContent: 'center', 
                flexWrap: 'wrap',
                mb: 2
              }}>
                <Chip 
                  icon={<Person />} 
                  label="Administrators" 
                  size="small" 
                  sx={{ 
                    background: alpha(colors.lottieGreen, 0.2),
                    color: colors.lottieGreen,
                    border: `1px solid ${alpha(colors.lottieGreen, 0.3)}`,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': { color: colors.lottieGreen }
                  }}
                />
                <Chip 
                  icon={<Business />} 
                  label="Partners" 
                  size="small" 
                  sx={{ 
                    background: alpha(colors.primary, 0.2),
                    color: colors.primary,
                    border: `1px solid ${alpha(colors.primary, 0.3)}`,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': { color: colors.primary }
                  }}
                />
                <Chip 
                  icon={<AdminPanelSettings />} 
                  label="Partner Admin" 
                  size="small" 
                  sx={{ 
                    background: alpha(colors.secondary, 0.2),
                    color: colors.secondary,
                    border: `1px solid ${alpha(colors.secondary, 0.3)}`,
                    backdropFilter: 'blur(10px)',
                    '& .MuiChip-icon': { color: colors.secondary }
                  }}
                />
              </Box>

              {/* Decorative stars */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Star sx={{ 
                  color: colors.accent, 
                  fontSize: 16,
                  animation: 'starTwinkle 2s ease-in-out infinite',
                  '@keyframes starTwinkle': {
                    '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                    '50%': { opacity: 1, transform: 'scale(1.2)' },
                  },
                }} />
                <Star sx={{ 
                  color: colors.accent, 
                  fontSize: 12,
                  animation: 'starTwinkle 2s ease-in-out infinite 0.5s',
                }} />
                <Star sx={{ 
                  color: colors.accent, 
                  fontSize: 16,
                  animation: 'starTwinkle 2s ease-in-out infinite 1s',
                }} />
              </Box>
            </Box>

            {/* Enhanced error display */}
            {localError && (
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 2,
                  background: alpha('#ff5252', 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#ff5252', 0.3)}`,
                  boxShadow: `0 8px 32px ${alpha('#ff5252', 0.2)}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ff5252',
                    fontFamily: fonts.body,
                    textAlign: 'center',
                    fontWeight: 'medium',
                  }}
                >
                  {localError}
                </Typography>
              </Box>
            )}

            {/* Enhanced form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: fonts.body,
                      },
                      '& .MuiOutlinedInput-root': {
                        background: alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: alpha(colors.accent, 0.3),
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(colors.accent, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                          borderWidth: '2px',
                          boxShadow: `0 0 20px ${alpha(colors.accent, 0.3)}`,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'rgba(255,255,255,0.9)',
                        fontFamily: fonts.body,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.accent,
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                            disabled={isLoading}
                            sx={{
                              color: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                color: colors.accent,
                                background: alpha(colors.accent, 0.1),
                              }
                            }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: fonts.body,
                      },
                      '& .MuiOutlinedInput-root': {
                        background: alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: alpha(colors.secondary, 0.3),
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(colors.secondary, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.secondary,
                          borderWidth: '2px',
                          boxShadow: `0 0 20px ${alpha(colors.secondary, 0.3)}`,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'rgba(255,255,255,0.9)',
                        fontFamily: fonts.body,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.secondary,
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Access Code"
                    name="adminCode"
                    type="password"
                    autoComplete="off"
                    value={formData.adminCode}
                    onChange={handleChange}
                    disabled={isLoading}
                    helperText={
                      <span style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                        <Lock sx={{ fontSize: 14, mr: 0.5, color: colors.primary }} />
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                          Contact your administrator for access code
                        </Typography>
                      </span>
                    }
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255,255,255,0.7)',
                        fontFamily: fonts.body,
                      },
                      '& .MuiOutlinedInput-root': {
                        background: alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: alpha(colors.primary, 0.3),
                          borderWidth: '1px',
                        },
                        '&:hover fieldset': {
                          borderColor: alpha(colors.primary, 0.5),
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.primary,
                          borderWidth: '2px',
                          boxShadow: `0 0 20px ${alpha(colors.primary, 0.3)}`,
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: 'rgba(255,255,255,0.9)',
                        fontFamily: fonts.body,
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: colors.primary,
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      background: gradients.primaryGradient,
                      backgroundSize: '200% 200%',
                      color: '#ffffff',
                      py: 2,
                      fontWeight: 'bold',
                      fontFamily: fonts.body,
                      borderRadius: 3,
                      border: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      animation: 'gradient-shift 4s ease infinite',
                      '@keyframes gradient-shift': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' },
                      },
                      '&:hover': {
                        transform: 'translateY(-2px) scale(1.02)',
                        boxShadow: `0 15px 40px ${alpha(colors.secondary, 0.4)}`,
                      },
                      '&:disabled': {
                        opacity: 0.7,
                        transform: 'none',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: gradients.shimmerGradient,
                        transition: 'left 0.5s ease',
                      },
                      '&:hover::before': {
                        left: '100%',
                      }
                    }}
                  >
                    {isLoading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                        Authenticating...
                      </Box>
                    ) : 'Access Admin Portal'}
                  </Button>
                </Grid>
              </Grid>
            </Box>
            
            {/* Enhanced support section */}
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: fonts.body,
                }}
              >
                Need help accessing your account?
              </Typography>
              <Typography 
                variant="caption" 
                sx={{
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: fonts.body,
                }}
              >
                Contact: support@blackcoreai.com | (415) 555-0100
              </Typography>
            </Box>

            {/* Decorative gradient divider */}
            <Box
              sx={{
                mt: 4,
                height: 2,
                background: gradients.primaryGradient,
                borderRadius: 1,
                opacity: 0.6,
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 6s ease infinite',
              }}
            />
          </Box>
          
          {/* Enhanced back button */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              to="/"
              sx={{ 
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'none',
                fontFamily: fonts.body,
                fontWeight: 'medium',
                py: 1.5,
                px: 3,
                borderRadius: 2,
                background: alpha(colors.glassWhite, 0.05),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(colors.accent, 0.1),
                  borderColor: colors.accent,
                  color: '#ffffff',
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${alpha(colors.accent, 0.3)}`,
                }
              }}
            >
              ← Back to Home
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default AdminLogin; 