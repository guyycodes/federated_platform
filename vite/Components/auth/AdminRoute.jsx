// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useUser } from '@clerk/clerk-react';

// export const AdminRoute = ({ children, redirectIfAuthenticated = false }) => {
//   const { user, isLoaded, isSignedIn } = useUser();
//   const [isAdmin, setIsAdmin] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkAdminStatus = async () => {
//       if (!isLoaded) return;

//       if (!isSignedIn) {
//         setIsAdmin(false);
//         setIsLoading(false);
//         return;
//       }

//       try {
//         // Check if user exists in users table with admin role
//         const response = await fetch(`/api/users?email=${encodeURIComponent(user.primaryEmailAddress?.emailAddress)}`);
        
//         if (response.ok) {
//           const users = await response.json();
//           const adminUser = users.find(u => 
//             u.email === user.primaryEmailAddress?.emailAddress &&
//             ['USER_ADMIN', 'USER'].includes(u.role)
//           );
//           setIsAdmin(!!adminUser);
//         } else {
//           setIsAdmin(false);
//         }
//       } catch (error) {
//         console.error('Error checking admin status:', error);
//         setIsAdmin(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkAdminStatus();
//   }, [isLoaded, isSignedIn, user]);

//   if (isLoading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '200px' 
//       }}>
//         <div>Loading...</div>
//       </div>
//     );
//   }

//   // For admin login page - redirect if already authenticated admin
//   if (redirectIfAuthenticated) {
//     if (isAdmin) {
//       return <Navigate to="/staff/dash" replace />;
//     }
//     // If not admin, show the login form (children)
//     return children;
//   }

//   // For protected admin routes - redirect if not admin
//   if (!isAdmin) {
//     return <Navigate to="/admin-login" replace />;
//   }

//   return children;
// }; 