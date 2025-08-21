// import { useState, useEffect, useCallback } from 'react';

// export function useUserAdmin() {
//   const [userAdministrators, setUserAdministrators] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);




//   // user administrators
//   const fetchUserAdministrators = useCallback(async () => {
//     try {
//       const response = await fetch('/api/user-administrators');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       setUserAdministrators(data);
//     } catch (err) {
//       console.error('Error fetching user administrators:', err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   }, []);

//   const createUserAdministrator = useCallback(async (userAdministratorData) => {
//     try {
//       const response = await fetch('/api/user-administrators', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(userAdministratorData),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }

//       const newUserAdministrator = await response.json();

//       // Refresh the user administrators list
//       await fetchUserAdministrators();

//       return newUserAdministrator;
//     } catch (err) {
//       console.error('Error creating user administrator:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [fetchUserAdministrators]);

//   // delete user administrator
//   const deleteUserAdministrator = useCallback(async (userId) => {
//     try {
//       const response = await fetch(`/api/user-administrators?id=${userId}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }

//       // Remove from local state
//       setUserAdministrators(prevUserAdministrators => prevUserAdministrators.filter(userAdministrator => userAdministrator.id !== userId));

//       return true;
//     } catch (err) {
//       console.error('Error deleting user administrator:', err);
//       setError(err.message);
//       throw err;
//     }
//   }, [fetchUserAdministrators]);


//   return {


//   };
// } 