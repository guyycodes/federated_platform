import { useUser, useClerk, useAuth, useSignIn } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

/**
 * This hook is for STAFF authentication.
 * Staff authenticate through Clerk and have User records in the database.
 * They do NOT have Customer records - Customer records are for customers only.
 */
export function useStaffAuth() {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { signIn, setActive, isLoaded} = useSignIn();
  
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  // Refresh user data
  const refreshUser = async () => {
    if (!isSignedIn || !clerkUser) return;
    
    try {
      // fetch from prisma/supabase
      const response = await fetch(`/api/auth/admin-verify?email=${encodeURIComponent(clerkUser.primaryEmailAddress?.emailAddress || '')}`);

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      setError(err.message);
    }
  };

  const checkForUser = async (email) => {
    try {
      const response = await fetch(`/api/auth/admin-verify?email=${encodeURIComponent(email || '')}`);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        return userData;
      } else if (response.status === 404) {
        // User not found - this is expected for customers
        console.log('User not found in staff database for email:', email);
        setUser(null);
        return null;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error checking for user:', err);
      setError(err.message);
      return null;
    }
  }

  return {
    user,
    error,
    signIn, setActive, isLoaded,
    signOut,
    refreshUser,
    checkForUser,
    clearUser: () => setUser(null)
  };
} 