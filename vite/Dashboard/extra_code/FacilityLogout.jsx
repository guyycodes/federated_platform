// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { 
//   Box, 
//   Typography, 
//   CircularProgress, 
//   Paper, 
//   Container,
//   Card,
//   CardContent,
//   Divider,
//   useTheme as useMuiTheme,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   DialogContentText,
//   LinearProgress
// } from '@mui/material';
// import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { useTheme } from '../../Context/ThemeContext';

// const FacilityLogout = () => {
//   const [isRedirecting, setIsRedirecting] = useState(false);
//   const [countdown, setCountdown] = useState(3);
//   const { theme, toggleTheme } = useTheme();
//   const muiTheme = useMuiTheme();
  
//   // Confirmation dialog states
//   const [showConfirmation, setShowConfirmation] = useState(true);
//   const [confirmationCountdown, setConfirmationCountdown] = useState(5);
//   const [logoutConfirmed, setLogoutConfirmed] = useState(false);
//   const [showLogoutScreen, setShowLogoutScreen] = useState(false);
  
//   // Handle the confirmation dialog countdown
//   useEffect(() => {
//     if (!showConfirmation || logoutConfirmed) return;
    
//     const timer = setInterval(() => {
//       setConfirmationCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           handleLogoutConfirm();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     return () => clearInterval(timer);
//   }, [showConfirmation]);
  
//   // Handle user confirmation
//   const handleLogoutConfirm = () => {
//     setLogoutConfirmed(true);
//     setShowConfirmation(false);
//     setShowLogoutScreen(true);
//   };
  
//   // Handle user cancellation
//   const handleLogoutCancel = () => {
//     setShowConfirmation(false);
//     // Redirect to dashboard
//     window.location.href = '/facility/dashboard';
//   };
  
//   // Handle the actual logout process after confirmation
//   useEffect(() => {
//     if (!showLogoutScreen) return;
    
//     // Handle the actual logout
//     const performLogout = async () => {
//       try {
//         // Reset theme to light mode if currently in dark mode
//         if (theme === 'dark') {
//           toggleTheme();
//         }
        
//         // Ensure theme is explicitly set to light in localStorage
//         localStorage.setItem('theme', 'light');
        
//         // In a real app, you would perform actions like:
//         // 1. Clear auth tokens from localStorage
//         localStorage.removeItem('auth_token');
//         localStorage.removeItem('user_data');
        
//         // 2. Call the logout API endpoint
//         // await api.post('/auth/logout');
        
//         // 3. Clear any app state or context
//         // dispatch({ type: 'LOGOUT' });
        
//         // Simulate API delay
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       } catch (error) {
//         console.error('Error during logout:', error);
//       }
//     };
    
//     // Start the logout process
//     performLogout();
    
//     // Set up countdown timer for the final redirect
//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setIsRedirecting(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
    
//     // Clean up
//     return () => clearInterval(timer);
//   }, [theme, toggleTheme, showLogoutScreen]);
  
//   // Redirect to login page
//   if (isRedirecting) {
//     return <Navigate to="/" replace />;
//   }
  
//   // Render confirmation dialog
//   if (showConfirmation) {
//     return (
//       <Dialog
//         open={showConfirmation}
//         aria-labelledby="logout-confirmation-dialog-title"
//         sx={{
//           '& .MuiDialog-paper': {
//             borderRadius: 2,
//             width: '100%',
//             maxWidth: 500
//           }
//         }}
//       >
//         <DialogTitle 
//           id="logout-confirmation-dialog-title"
//           sx={{ 
//             bgcolor: '#218838', 
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             gap: 1
//           }}
//         >
//           <ExitToAppIcon />
//           <Typography variant="h6">Confirm Logout</Typography>
//         </DialogTitle>
        
//         <DialogContent sx={{ mt: 2, p: 3 }}>
//           <DialogContentText>
//             Are you sure you want to log out of the MedCredPro Facility Management System?
//           </DialogContentText>
          
//           <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
//             <HealthAndSafetyIcon sx={{ color: '#218838', fontSize: 40 }} />
//             <Typography variant="body1" sx={{ fontWeight: 500 }}>
//               Your session will end and any unsaved work may be lost.
//             </Typography>
//           </Box>
          
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" color="text.secondary" gutterBottom>
//               Auto-confirming in {confirmationCountdown} seconds...
//             </Typography>
//             <LinearProgress 
//               variant="determinate" 
//               value={(confirmationCountdown / 5) * 100} 
//               sx={{ 
//                 height: 8, 
//                 borderRadius: 1,
//                 bgcolor: muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e0e0e0'
//               }} 
//             />
//           </Box>
//         </DialogContent>
        
//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button 
//             onClick={handleLogoutCancel}
//             variant="outlined"
//             color="error"
//             startIcon={<CancelIcon />}
//           >
//             Cancel
//           </Button>
//           <Button 
//             onClick={handleLogoutConfirm}
//             variant="contained"
//             sx={{ 
//               bgcolor: '#218838',
//               '&:hover': {
//                 bgcolor: '#1e7e34'
//               }
//             }}
//             startIcon={<ExitToAppIcon />}
//             autoFocus
//           >
//             Yes, Log Out
//           </Button>
//         </DialogActions>
//       </Dialog>
//     );
//   }
  
//   // Render the actual logout screen after confirmation
//   return (
//     <Container maxWidth="sm" sx={{ mt: 8 }}>
//       <Card 
//         elevation={4}
//         sx={{ 
//           borderRadius: 2,
//           overflow: 'hidden'
//         }}
//       >
//         <Box 
//           sx={{ 
//             bgcolor: '#218838', 
//             color: 'white', 
//             p: 2, 
//             display: 'flex', 
//             alignItems: 'center',
//             gap: 1
//           }}
//         >
//           <LockOutlinedIcon />
//           <Typography variant="h6">
//             Facility Session Logout
//           </Typography>
//         </Box>
        
//         <CardContent sx={{ p: 4, textAlign: 'center' }}>
//           <HealthAndSafetyIcon sx={{ color: "#218838", fontSize: 64, mb: 2 }} />
          
//           <Typography variant="h5" sx={{ mb: 2 }}>
//             Securely Signing Out
//           </Typography>
          
//           <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
//             Thank you for using MedCredPro Facility Management System
//           </Typography>
          
//           <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//             <CircularProgress 
//               size={48} 
//               thickness={4} 
//               sx={{ color: '#218838' }} 
//             />
//           </Box>
          
//           <Divider sx={{ my: 2 }} />
          
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="body2" color="text.secondary">
//               You will be redirected to the login page in <strong>{countdown}</strong> seconds...
//             </Typography>
//           </Box>
          
//           <Box 
//             sx={{ 
//               mt: 4, 
//               bgcolor: muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa', 
//               p: 2.5, 
//               borderRadius: 1,
//               border: `1px solid ${muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#e0e0e0'}`,
//               display: 'flex',
//               alignItems: 'flex-start',
//               gap: 1.5
//             }}
//           >
//             <InfoOutlinedIcon 
//               fontSize="small" 
//               sx={{ 
//                 color: muiTheme.palette.mode === 'dark' ? '#90caf9' : '#218838',
//                 mt: 0.3
//               }} 
//             />
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: muiTheme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.7)',
//                 fontWeight: 500
//               }}
//             >
//               For security reasons, please close your browser after being redirected.
//             </Typography>
//           </Box>
//         </CardContent>
//       </Card>
//     </Container>
//   );
// };

// export default FacilityLogout; 