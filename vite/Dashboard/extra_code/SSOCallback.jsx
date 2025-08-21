// import React, { useState, useEffect } from 'react';
// import { Box, Typography, CircularProgress } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { useSignIn, useUser } from '@clerk/clerk-react';
// import Lottie from 'lottie-react';
// import verificationAnimation from '/public/verification-animation.json';

// const SSOCallback2 = () => {
//   const navigate = useNavigate();
//   const { signIn, isLoaded } = useSignIn();
//   const { user, isSignedIn, isLoaded: userLoaded } = useUser();
//   const [status, setStatus] = useState('processing'); // 'processing', 'success', 'needs_registration', 'error'
//   const [message, setMessage] = useState('Completing sign in...');

//   useEffect(() => {
//     const handleSSOCallback = async () => {
//       // Wait for both Clerk hooks to be loaded
//       if (!isLoaded || !userLoaded) return;

//       try {
//         // Give Clerk a moment to process the OAuth response
//         await new Promise(resolve => setTimeout(resolve, 2000));

//         console.log('SSO Callback - Auth state:', { 
//           isSignedIn, 
//           hasUser: !!user, 
//           userEmail: user?.emailAddresses?.[0]?.emailAddress 
//         });

//         if (isSignedIn && user) {
//           // Success - user is signed in
//           setStatus('success');
//           setMessage('Sign in successful! Redirecting...');
          
//           // Brief delay then redirect to dashboard
//           setTimeout(() => {
//             navigate('/layout/dashboard');
//           }, 1500);
          
//         } else {
//           // User is not signed in after OAuth - this typically means no account exists
//           console.log('No user signed in after OAuth - likely needs registration');
//           setStatus('needs_registration');
//           setMessage('No account found. Redirecting to registration...');
          
//           setTimeout(() => {
//             navigate('/register');
//           }, 2500);
//         }
//       } catch (error) {
//         console.error('SSO processing error:', error);
//         setStatus('error');
//         setMessage('Sign in failed. Redirecting to login...');
        
//         setTimeout(() => {
//           navigate('/login');
//         }, 2500);
//       }
//     };

//     handleSSOCallback();
//   }, [isLoaded, userLoaded, isSignedIn, user, navigate]);

//   // Color based on status
//   const getStatusColor = () => {
//     switch (status) {
//       case 'success':
//         return '#4CAF50';
//       case 'needs_registration':
//         return '#FF9800';
//       case 'error':
//         return '#f44336';
//       default:
//         return '#4CAF50';
//     }
//   };

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column',
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         bgcolor: '#f8f9fa'
//       }}
//     >
//       <Box sx={{ width: 80, height: 80, mb: 3 }}>
//         <Lottie 
//           animationData={verificationAnimation} 
//           loop={true}
//           autoplay={true}
//           style={{ width: '100%', height: '100%' }}
//         />
//       </Box>
//       <Typography variant="h5" component="div" color="#1A2238" fontWeight="medium" gutterBottom>
//         {message}
//       </Typography>
//       <CircularProgress sx={{ mt: 2, color: getStatusColor() }} />
      
//       {status === 'needs_registration' && (
//         <Typography variant="body2" color="#1A2238" sx={{ mt: 2, textAlign: 'center', maxWidth: 400 }}>
//           It looks like you don't have an account yet. We'll take you to the registration page to get started with Buster & Co!
//         </Typography>
//       )}
//     </Box>
//   );
// };

// export default SSOCallback2; 