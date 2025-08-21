import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import posthog from 'posthog-js';

// Initialize PostHog
if (typeof window !== 'undefined' && import.meta.env.VITE_POSTHOG_API_KEY) {
  // Determine the API host based on environment
  const useProxy = import.meta.env.VITE_POSTHOG_USE_PROXY === 'true';
  const proxyHost = import.meta.env.VITE_POSTHOG_PROXY_HOST || 'https://40.233.15.6';
  const apiHost = useProxy 
    ? `${proxyHost}/plugin-telemetry`
    : (import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com');
  console.log('PostHog: Final API host:', apiHost);
  
  posthog.init(import.meta.env.VITE_POSTHOG_API_KEY, {
    api_host: apiHost,
    // IMPORTANT: ui_host must point to the real PostHog for toolbar authentication
    ui_host: 'https://us.posthog.com',
    // Enable debug mode in development
    debug: import.meta.env.NODE_ENV === 'development',
    // Capture pageviews automatically
    capture_pageview: true,
    // Capture sessions automatically
    autocapture: true,
    // Session recording configuration
    session_recording: {
      enabled: true,
      maskAllInputs: true, // Mask sensitive inputs
      maskTextContent: false
    },
    // Feature flags
    bootstrap: {
      featureFlags: {}
    },
    // Disable compression for better proxy compatibility
    disable_compression: true
  });
}

export function PostHogProvider({ children }) {
  const { userId, sessionId, user, isLoaded } = useAuth();
  const [hasIdentified, setHasIdentified] = useState(false);

  useEffect(() => {
    // Wait for Clerk to load before making decisions
    if (!isLoaded) {
      console.log('PostHog: Waiting for auth to load...');
      return;
    }

    // Identify the user when they log in
    if (userId && !hasIdentified) {
      console.log('PostHog: Identifying user', userId);
      // Alias links anonymous user to identified user
      posthog.alias(userId);
      posthog.identify(userId, {
        email: user?.emailAddresses?.[0]?.emailAddress,
        name: user?.fullName || user?.firstName || 'Unknown',
        createdAt: user?.createdAt
      });
      setHasIdentified(true);
    } else if (!userId && hasIdentified) {
      // Only reset when user explicitly logs out (was identified, now isn't)
      console.log('PostHog: User logged out, resetting session');
      posthog.reset();
      setHasIdentified(false);
    }
    // Don't reset for initial anonymous sessions
  }, [userId, user, isLoaded, hasIdentified]);

  // Track page views on route changes
  useEffect(() => {
    // This will be handled by the router integration
    const handleRouteChange = () => {
      posthog.capture('$pageview');
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return children;
}

// Export posthog instance for use in components
export { posthog }; 