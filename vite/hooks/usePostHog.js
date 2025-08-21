import { posthog } from '../Context/PostHogProvider';

export function usePostHog() {
  return {
    // Track custom events
    trackEvent: (eventName, properties = {}) => {
      if (posthog) {
        posthog.capture(eventName, properties);
      }
    },
    
    // Track clicks with automatic element info
    trackClick: (elementName, properties = {}) => {
      if (posthog) {
        posthog.capture('clicked', {
          element: elementName,
          ...properties
        });
      }
    },
    
    // Track form submissions
    trackFormSubmit: (formName, properties = {}) => {
      if (posthog) {
        posthog.capture('form_submitted', {
          form_name: formName,
          ...properties
        });
      }
    },
    
    // Track purchases/conversions
    trackPurchase: (orderData) => {
      if (posthog) {
        posthog.capture('purchase', {
          revenue: orderData.total,
          currency: orderData.currency || 'USD',
          products: orderData.items,
          order_id: orderData.orderId,
          ...orderData
        });
      }
    },
    
    // Track feature usage
    trackFeatureUsage: (featureName, properties = {}) => {
      if (posthog) {
        posthog.capture('feature_used', {
          feature: featureName,
          ...properties
        });
      }
    },
    
    // Get feature flags
    getFeatureFlag: (flagName) => {
      return posthog?.getFeatureFlag(flagName);
    },
    
    // Check if feature flag is enabled
    isFeatureEnabled: (flagName) => {
      return posthog?.isFeatureEnabled(flagName) || false;
    },
    
    // Direct access to posthog instance for advanced usage
    posthog
  };
} 