const cartConfig = {
  // Free shipping configuration
  shipping: {
    freeShippingThreshold: 5000, // Amount for free shipping (in cents = $50)
    standardShippingCost: 1000, // Standard shipping cost (in cents = $10)
    expressShippingCost: 2000, // Express shipping cost (in cents = $20)
    currency: 'USD',
    
    // Dynamic messages
    messages: {
      qualified: 'You\'ve unlocked FREE standard shipping!',
      progress: (amount) => `Add $${amount.toFixed(2)} more for free shipping`,
      savings: (amount) => `You\'re saving $${amount.toFixed(2)} on shipping`
    }
  },
  
  // Tax configuration
  tax: {
    rate: 0.08, // 8% tax rate
    displayName: 'Sales Tax',
    // Add state/region specific rates if needed
    regionalRates: {
      'CA': 0.0875,
      'NY': 0.08,
      'TX': 0.0625,
      'FL': 0.06
    }
  },
  
  // Cart behavior
  behavior: {
    persistCart: true, // Save cart to localStorage
    cartExpiry: 7, // Days before cart expires
    maxQuantityPerItem: 10,
    enableSaveForLater: true,
    enableWishlist: true,
    showRecommendations: true,
    recommendationsPosition: 'bottom', // 'top', 'bottom', 'sidebar'
  },
  
  // Promotional messages
  promotions: {
    enabled: true,
    messages: [
      {
        id: 'bundle-save',
        text: '🎉 Buy 2 items, get 10% off your order',
        condition: 'itemCount >= 2',
        badge: 'Limited Time'
      },
      {
        id: 'member-benefit',
        text: '⭐ Members get an extra 5% off',
        condition: 'always',
        badge: 'Member Perk'
      }
    ]
  },
  
  // UI Configuration
  ui: {
    showProductImages: true,
    imageSize: 120, // pixels
    showSavings: true,
    showStockStatus: true,
    enableQuickView: true,
    mobileBreakpoint: 768,
    
    // Animation settings
    animations: {
      addToCart: 'slide-in',
      removeFromCart: 'fade-out',
      updateQuantity: 'pulse'
    }
  }
};

export default cartConfig; 