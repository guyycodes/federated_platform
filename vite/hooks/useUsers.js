import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useDataLayer } from '../Context/DataLayer';

export function useUsers() {
  const { user: clerkUser } = useUser();
  const { updateUserPlugins, getUserData } = useDataLayer();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch current user data including their created plugins
  const fetchCurrentUser = useCallback(async () => {
    if (!clerkUser?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/users/current');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      
      // Also update local state for this hook
      setCurrentUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching user:', err);
    } finally {
      setIsLoading(false);
    }
  }, [clerkUser?.id]);



  // Get user instantly from memory (no delays)
  const getCurrentUserInstant = useCallback(() => {
    return getUserData();
  }, [getUserData]);

  return {
    currentUser,
    isLoading,
    error,
    fetchCurrentUser,
    getCurrentUserInstant
  };
}