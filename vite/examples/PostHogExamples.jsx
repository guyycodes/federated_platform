// Example: How to use PostHog in your components

import React from 'react';
import { usePostHog } from '../hooks/usePostHog';

// Example 1: Basic event tracking
export function ProductCard({ product }) {
  const { trackClick, trackEvent } = usePostHog();

  const handleAddToCart = () => {
    // Track the add to cart event
    trackEvent('add_to_cart', {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      category: product.category
    });
    
    // Your existing add to cart logic
    // addToCart(product);
  };

  const handleProductClick = () => {
    // Track product view
    trackClick('product_card', {
      product_id: product.id,
      product_name: product.name
    });
  };

  return (
    <div onClick={handleProductClick}>
      <h3>{product.name}</h3>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}

// Example 2: Form tracking
export function ContactForm() {
  const { trackFormSubmit, trackEvent } = usePostHog();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Track form submission
    trackFormSubmit('contact_form', {
      subject: e.target.subject.value,
      has_phone: !!e.target.phone.value
    });
    
    // Your form submission logic
  };

  const handleFieldFocus = (fieldName) => {
    // Track when users interact with specific fields
    trackEvent('form_field_focused', {
      form: 'contact_form',
      field: fieldName
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="subject" 
        onFocus={() => handleFieldFocus('subject')}
      />
      <input 
        name="phone" 
        onFocus={() => handleFieldFocus('phone')}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// Example 3: Feature flags
export function BetaFeature() {
  const { isFeatureEnabled, trackFeatureUsage } = usePostHog();

  // Check if beta feature is enabled for this user
  const showBetaFeature = isFeatureEnabled('beta-grooming-scheduler');

  if (!showBetaFeature) {
    return null;
  }

  const handleFeatureUse = () => {
    trackFeatureUsage('beta-grooming-scheduler', {
      action: 'opened'
    });
  };

  return (
    <div onClick={handleFeatureUse}>
      <h2>New Beta Feature!</h2>
      {/* Your beta feature content */}
    </div>
  );
}

// Example 4: E-commerce tracking
export function CheckoutComplete({ order }) {
  const { trackPurchase } = usePostHog();

  React.useEffect(() => {
    // Track the successful purchase
    trackPurchase({
      orderId: order.id,
      total: order.total,
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        category: item.category
      })),
      shipping_method: order.shippingMethod,
      payment_method: order.paymentMethod
    });
  }, [order]);

  return <div>Thank you for your purchase!</div>;
}

// Example 5: Page view tracking with custom properties
export function ServicePage({ serviceName }) {
  const { trackEvent } = usePostHog();

  React.useEffect(() => {
    // Track page view with additional context
    trackEvent('service_page_viewed', {
      service_name: serviceName,
      referrer: document.referrer,
      time_of_day: new Date().getHours() < 12 ? 'morning' : 'afternoon'
    });
  }, [serviceName]);

  return <div>{/* Your service page content */}</div>;
} 