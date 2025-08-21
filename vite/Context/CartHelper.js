// // CartHelper.js
// import cartConfig from '../assets/cart/cartConfig';

// // This helper observes the cartStateRef from ShoppingCart.jsx and syncs it to localStorage
// // This approach prevents re-renders caused by localStorage operations

// class CartObserver {
//   constructor() {
//     this.lastState = null;
//     this.observerInterval = null;
//     this.cartStateRef = null;
//   }

//   // Initialize the observer with the cart state ref
//   init(cartStateRef) {
//     this.cartStateRef = cartStateRef;
//     this.lastState = JSON.stringify(cartStateRef.current);
    
//     // Start observing changes every 100ms
//     this.startObserving();
//   }

//   startObserving() {
//     // Clear any existing interval
//     if (this.observerInterval) {
//       clearInterval(this.observerInterval);
//     }

//     // Check for changes periodically
//     this.observerInterval = setInterval(() => {
//       if (!this.cartStateRef || !cartConfig.behavior.persistCart) return;

//       const currentState = JSON.stringify(this.cartStateRef.current);
      
//       // Only update localStorage if the state has actually changed
//       if (currentState !== this.lastState) {
//         this.lastState = currentState;
//         this.syncToLocalStorage();
//       }
//     }, 100); // Check every 100ms for changes
//   }

//   syncToLocalStorage() {
//     try {
//       const { cartItems, savedItems } = this.cartStateRef.current;
      
//       if (cartItems.length > 0 || savedItems.length > 0) {
//         // Save cart data if there are items
//         const expiryDate = new Date();
//         expiryDate.setDate(expiryDate.getDate() + cartConfig.behavior.cartExpiry);
        
//         const cartData = {
//           items: cartItems,
//           savedItems: savedItems,
//           expiry: expiryDate.toISOString()
//         };
        
//         // Use requestIdleCallback if available to avoid blocking the main thread
//         if ('requestIdleCallback' in window) {
//           requestIdleCallback(() => {
//             localStorage.setItem('shoppingCart', JSON.stringify(cartData));
//           });
//         } else {
//           // Fallback for browsers that don't support requestIdleCallback
//           setTimeout(() => {
//             localStorage.setItem('shoppingCart', JSON.stringify(cartData));
//           }, 0);
//         }
//       } else {
//         // Clear localStorage if cart and saved items are both empty
//         if ('requestIdleCallback' in window) {
//           requestIdleCallback(() => {
//             localStorage.removeItem('shoppingCart');
//           });
//         } else {
//           setTimeout(() => {
//             localStorage.removeItem('shoppingCart');
//           }, 0);
//         }
//       }
//     } catch (error) {
//       console.error('Error syncing cart to localStorage:', error);
//     }
//   }

//   // Clean up the observer
//   destroy() {
//     if (this.observerInterval) {
//       clearInterval(this.observerInterval);
//       this.observerInterval = null;
//     }
//   }
// }

// // Create a singleton instance
// export const cartHelper = new CartObserver();

// // Auto-initialize when the module loads
// if (typeof window !== 'undefined') {
//   // Wait for the cart state ref to be available
//   const checkForRef = setInterval(() => {
//     try {
//       // Try to import the cartStateRef
//       import('./ShoppingCart.jsx').then(module => {
//         if (module.cartStateRef) {
//           clearInterval(checkForRef);
//           cartHelper.init(module.cartStateRef);
//         }
//       });
//     } catch (error) {
//       // Ignore errors during initialization
//     }
//   }, 100);
// }