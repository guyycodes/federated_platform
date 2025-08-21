import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { usePlugins } from '../hooks/usePlugins';
import mockProjects from '../Dashboard/StaffDashboard/components/mockProjects.json';

// Create context
const DataLayerContext = createContext();

// Global notifications storage (persists across component remounts)
if (!window.__busterNotifications) {
  window.__busterNotifications = [];
}

export const DataLayerProvider = ({ children }) => {
  // Clerk hooks for authentication
  const { user, isLoaded: userLoaded, isSignedIn } = useUser();

  
  const { signOut } = useAuth();

  // Notifications - use global window storage for persistence and state for reactivity
  const [notificationsVersion, setNotificationsVersion] = useState(0); // Used to trigger re-renders
  const [remoteTrigger, setRemoteTrigger] = useState(0); // Used to trigger re-renders
  // Basic state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const userPluginsDataRef = useRef(null);
  const [userPlugins, setUserPlugins] = useState(null);
  // Plan selection state
  const [currentPlan, setCurrentPlan] = useState(null);
  // Getter for notifications that uses the global storage
  const notifications = window.__busterNotifications;
  // Sync authentication state with Clerk
  const isAuthenticated = isSignedIn && userLoaded;

  // Plugin state from usePlugins hook
  const {
    plugins,
    categories,
    integrations,
    modalities,
    isLoading: pluginsLoading,
    error: pluginsError,
    fetchPlugins,
    // filterByCategory,
    filterByIntegration,
    filterByPriceRange,
    searchPlugins,
    sortPlugins,
    getPluginById,
    refreshPlugins,
    createPlugin,
  } = usePlugins();

  // Simple in-memory user storage - instant updates without React lifecycle delays
  const updateUserPlugins = useCallback(async (pluginData) => {
    if (!pluginData) return false;
    
    try {
      // Store in memory ref for instant access
      userPluginsDataRef.current = pluginData;
      
      // Update React state for UI reactivity
      setUserPlugins(pluginData);
      
      console.log('User data updated in memory:', pluginData);
      return true;
    } catch (error) {
      console.error('Error updating user data:', error);
      return false;
    }
  }, []);

  // Get fetchUserPlugins from the usePlugins hook
  const { fetchUserPlugins } = usePlugins();

  // // Initialize from global storage on mount
  // useEffect(() => {
  //   // Force a re-render to pick up any existing notifications
  //   setNotificationsVersion(v => v + 1);
    
  //   // Initialize mock projects data with Date objects
  //   // later this would be an API call using a hook to fetch from the DB
  //   const initialProjects = mockProjects.map(project => ({
  //     ...project,
  //     createdAt: new Date(project.createdAt)
  //   }));
    
  //   // Update user plugins with mock data
  //   updateUserPlugins(initialProjects);
  // }, []);
  
  // // Initialize from global storage on mount
  useEffect(() => {   
    // Force a re-render to pick up any existing notifications
    setNotificationsVersion(v => v + 1);
    
    // Fetch actual user plugins from the API
    const loadUserPlugins = async () => {
      try {
        console.log('loadUserPlugins called with user?.id:', user?.id);
        const plugins = await fetchUserPlugins(user?.id);   //GET /api/users/current/plugins 401 in 4ms
        
        // Convert createdAt strings to Date objects
        const formattedPlugins = plugins.map(plugin => ({
          ...plugin,
          createdAt: new Date(plugin.createdAt)
        }));
        
        // Update user plugins with fetched data
        updateUserPlugins(formattedPlugins);
      } catch (error) {
        console.error('Failed to load user plugins:', error);
        // Optionally show an error notification
      }
    };
    
    // Only load plugins if user is authenticated
    if (isAuthenticated) {
      loadUserPlugins();
    }
  }, [remoteTrigger, isAuthenticated, user?.id]);

  // Get user data instantly from memory
  const getUserPlugins = useCallback(() => {
    return userPluginsDataRef.current;
  }, []);

  // Handle subscription plan selection
  const selectPlan = (planId, planData) => {
    const planDetails = typeof planData === 'object' ? planData : { id: planId, price: planData };
    setCurrentPlan({
      id: planId,
      ...planDetails
    });
  };

  // Clear plan selection
  const clearPlan = () => {
    setCurrentPlan(null);
  };

  // Login function (placeholder - Clerk handles this via their components)
  const login = async (email, password, adminCode, role) => {
    console.log('Login should be handled by Clerk SignIn component');
    // Admin login is now handled directly in AdminLogin component
    return false;
  };

  // Logout function
  const logout = async () => {
    await signOut();
    clearPlan();
  };

  // Get user initials for avatar display
  const getUserInitials = (customer = null) => {
    // First try customer data
    if (customer?.firstName && customer?.lastName) {
      return `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase();
    }
    // Then try Clerk user data
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    // Fallback to email
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress[0].toUpperCase();
    }
    // Default
    return 'U';
  };

  // Get display name for user
  const getDisplayName = (customer = null) => {
    // First try customer data
    if (customer?.firstName) {
      return customer.firstName;
    }
    // Then try Clerk user data
    if (user?.firstName) {
      return user.firstName;
    }
    // Fallback to email username
    if (user?.primaryEmailAddress?.emailAddress) {
      return user.primaryEmailAddress.emailAddress.split('@')[0];
    }
    // Default
    return 'Customer';
  };

      // Notification management functions
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(), // Simple ID generation
      timestamp: new Date().toISOString(),
      ...notification
    };
    window.__busterNotifications = [...window.__busterNotifications, newNotification];
    console.log('Notification added to DataLayer:', newNotification);
    console.log('Total notifications:', window.__busterNotifications.length);
    setNotificationsVersion(v => v + 1); // Trigger re-render
    return newNotification.id;
  };

  const removeNotification = (id) => {
    window.__busterNotifications = window.__busterNotifications.filter(n => n.id !== id);
    setNotificationsVersion(v => v + 1); // Trigger re-render
  };

  const clearNotificationsByType = (type) => {
    window.__busterNotifications = window.__busterNotifications.filter(n => n.type !== type);
    setNotificationsVersion(v => v + 1); // Trigger re-render
  };

  const getNotificationsByType = (type) => {
    const filtered = window.__busterNotifications.filter(n => n.type === type);
    console.log(`Getting notifications of type '${type}':`, filtered);
    console.log('All notifications in global storage:', window.__busterNotifications);
    return filtered;
  };

  const hasNotificationType = (type) => {
    return window.__busterNotifications.some(n => n.type === type);
  };

  // Memoize functions that don't change
  const clearError = useCallback(() => setError(null), []);
  
  // Memoize notification functions that only depend on stable values
  const memoizedAddNotification = useCallback(addNotification, []);
  const memoizedRemoveNotification = useCallback(removeNotification, []);
  const memoizedClearNotificationsByType = useCallback(clearNotificationsByType, []);
  const memoizedGetNotificationsByType = useCallback(getNotificationsByType, []);
  const memoizedHasNotificationType = useCallback(hasNotificationType, []);

  // Context value - memoized to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Authentication state
    isAuthenticated,
    isLoading,
    setIsLoading,
    user,
    error,
    
    // Plan state
    currentPlan,

    // Notifications state
    notifications,
    notificationsVersion, // Include version to trigger re-renders
    
    // Plugin state and functions from usePlugins hook
    plugins,
    pluginsLoading,
    pluginsError,
    categories,
    integrations,
    modalities,
    fetchPlugins,
    // filterByCategory,
    filterByIntegration,
    filterByPriceRange,
    searchPlugins,
    sortPlugins,
    getPluginById,
    refreshPlugins,
    createPlugin,
    
    // Authentication functions
    login,
    logout,
    clearError,
    
    // Plan functions
    selectPlan,
    clearPlan,
    
    // User utility functions
    getUserInitials,
    getDisplayName,
    
    // In-memory user data functions
    updateUserPlugins,
    getUserPlugins,
    userPlugins,
    userPluginsDataRef,
    setRemoteTrigger,
    remoteTrigger,
    
    // Notification functions
    addNotification: memoizedAddNotification,
    removeNotification: memoizedRemoveNotification,
    clearNotificationsByType: memoizedClearNotificationsByType,
    getNotificationsByType: memoizedGetNotificationsByType,
    hasNotificationType: memoizedHasNotificationType,
  }), [
    // Only include values that should trigger re-renders
    isAuthenticated,
    isLoading,
    user,
    error,
    currentPlan,
    notifications,
    notificationsVersion,
    plugins,
    pluginsLoading,
    pluginsError,
    categories,
    integrations,
    modalities,
    userPlugins,
    // Stable function references
    fetchPlugins,
    // filterByCategory,
    filterByIntegration,
    filterByPriceRange,
    searchPlugins,
    sortPlugins,
    getPluginById,
    refreshPlugins,
    createPlugin,
    login,
    logout,
    clearError,
    selectPlan,
    clearPlan,
    getUserInitials,
    getDisplayName,
    updateUserPlugins,
    remoteTrigger,
    getUserPlugins,
    setRemoteTrigger,
    memoizedAddNotification,
    memoizedRemoveNotification,
    memoizedClearNotificationsByType,
    memoizedGetNotificationsByType,
    memoizedHasNotificationType,
  ]);

  return (
    <DataLayerContext.Provider value={contextValue}>
      {children}
    </DataLayerContext.Provider>
  );
};

// Custom hook for using the data layer
export const useDataLayer = () => {
  const context = useContext(DataLayerContext);
  if (context === undefined) {
    throw new Error('useDataLayer must be used within a DataLayerProvider');
  }
  return context;
};