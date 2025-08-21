// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useUser } from '@clerk/clerk-react';

// export const CustomerRoute = ({ children }) => {
//   const { user, isLoaded, isSignedIn } = useUser();
//   const [isAdmin, setIsAdmin] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const checkUserStatus = async () => {
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
//             ['CUSTOMER'].includes(u.role)
//           );
//           setIsAdmin(!!adminUser);
//         } else {
//           // No admin user found, they're a customer
//           setIsAdmin(false);
//         }
//       } catch (error) {
//         console.error('Error checking user status:', error);
//         // If error, assume they're a customer
//         setIsAdmin(false);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     checkUserStatus();
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

//   // If not signed in with Clerk, redirect to login
//   if (!isSignedIn) {
//     return <Navigate to="/login" replace />;
//   }

//   // If signed in but is admin, redirect to admin area
//   if (isAdmin) {
//     return <Navigate to="/staff/dash" replace />;
//   }

//   // If signed in with Clerk but not an admin, they're a customer
//   return children;
// }; 