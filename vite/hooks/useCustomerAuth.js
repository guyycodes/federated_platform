import { useUser, useClerk, useAuth, useSignIn } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

/**
 * This hook is for CUSTOMER authentication.
 * Customers authenticate through Clerk and have Customer records in the database.
 * They do NOT have User records - User records are for staff/admins only.
 */
export function useCustomerAuth() {
  const { user, isLoaded: isClerkLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication state when Clerk loads
  useEffect(() => {
    if (isClerkLoaded) {
      // If user is signed in, try to fetch their customer record
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        checkForCustomer(user.primaryEmailAddress.emailAddress).then(() => {
          setIsLoading(false);
        }).catch(() => {
          setIsLoading(false);
        });
      } else {
        // No user signed in, stop loading
        console.log('No user signed in, stopping loading');
        setIsLoading(false);
      }
    }
  }, [isClerkLoaded, isSignedIn, user]);

  // Refresh customer data
  const refreshCustomer = async () => {
    if (!isSignedIn || !user) return;
    
    try {
      const response = await fetch(`/api/customers?email=${encodeURIComponent(user.primaryEmailAddress?.emailAddress || '')}`);

      if (response.ok) {
        // array based response (might need this later, google oauth returns a single object, may not need it - save for now)
        // const customers = await response.json();
        // const customerRecord = customers.find(c => c.email === user.primaryEmailAddress?.emailAddress);
        // setCustomer(customerRecord || null);

        const customerData = await response.json();
        // The API returns a single customer object, not an array
        setCustomer(customerData);
      } else if (response.status === 404) {
        // Customer not found
        setCustomer(null);
      }
    } catch (err) {
      console.error('Error refreshing customer:', err);
      setError(err.message);
    }
  };

  const loginCustomer = async (reqBody) => {
    if (!isClerkLoaded) return;
        
    if (isSignedIn && user) {
      try {
        console.log('Making API call to /api/customers...');
        const response = await fetch('/api/customers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reqBody),
        });
    
        if (!response.ok) {
          if (response.status === 404) {
            // Customer record not found - might be a new customer
            setCustomer(null);
            setError(null);
            return { ok: false, status: 404 };
          } else {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        } else {
          const customers = await response.json();
          // Find the customer record for this email
          const customerRecord = customers.find(c => c.email === user.primaryEmailAddress?.emailAddress);
          setCustomer(customerRecord || null);
          setError(null);
          return { ok: true, status: response.status, data: customerRecord };
        }
      } catch (err) {
        console.error('Error logging in customer:', err);
        setError(err.message);
        // Re-throw so the calling component can handle it
        throw err;
      } finally {
        setIsLoading(false);
      }
    } else {
      setCustomer(null);
      setIsLoading(false);
      return { ok: false, status: 401 };
    }
  };

  const checkForCustomer = async (email) => {
    try {
      const response = await fetch(`/api/customers?email=${encodeURIComponent(email || '')}`);
      
      if (response.ok) {
        const userData = await response.json();
        setCustomer(userData);
        return userData;
      } else if (response.status === 404) {
        // Customer not found - this is expected for non-customer users
        console.log('Customer record not found for email:', email);
        setCustomer(null);
        return null;
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error checking for user:', err);
      setError(err.message);
      return null;
    }
  };

  return {
    customer,
    user,
    isLoading: isLoading || !isClerkLoaded,
    isSignedIn,
    error,
    signOut,
    signIn, 
    setActive, 
    isLoaded ,
    
    // Helper properties
    hasCustomerRecord: !!customer,
    customerLocation: customer?.location,
    
    refreshCustomer,
    checkForCustomer,
    loginCustomer,
  };
} 