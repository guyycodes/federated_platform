// index.js - Export all types for easy importing

// Core business entities
export * from './customer.js';
export * from './appointment.js';
export * from './order.js';
export * from './product.js';
export * from './subscription.js';

// User and location management
export * from './user.js';
export * from './location.js';
export * from './userAdministrator.js';

// Territory and franchise management
export * from './territory.js';
export * from './territoriesAvailable.js';
export * from './franchiseFee.js';

// Supporting entities
export * from './orderItem.js';
export * from './csi.js';

// Common enums that match Prisma schema
/**
 * @typedef {Object} Enums
 * @property {Object} UserRole - User role enumeration
 * @property {Object} AppointmentStatus - Appointment status enumeration
 * @property {Object} SubscriptionStatus - Subscription status enumeration
 * @property {Object} OrderStatus - Order status enumeration
 * @property {Object} CSISource - CSI source enumeration
 */

/**
 * User role enumeration
 * @enum {string}
 */
export const UserRole = {
  UNSET: 'UNSET',
  USER_ADMIN: 'USER_ADMIN',
  USER: 'USER',
  LOCATION_ADMIN: 'LOCATION_ADMIN',
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',
  ACCOUNTANT: 'ACCOUNTANT',
  OTHER: 'OTHER'
};

/**
 * Appointment status enumeration
 * @enum {string}
 */
export const AppointmentStatus = {
  SCHEDULED: 'SCHEDULED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW'
};

/**
 * Subscription status enumeration
 * @enum {string}
 */
export const SubscriptionStatus = {
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

/**
 * Order status enumeration
 * @enum {string}
 */
export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  FULFILLED: 'FULFILLED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

/**
 * CSI source enumeration
 * @enum {string}
 */
export const CSISource = {
  CUSTOMER: 'CUSTOMER',
  STAFF: 'STAFF',
  MYSTERY_SHOPPER: 'MYSTERY_SHOPPER',
  ONLINE_REVIEW: 'ONLINE_REVIEW',
  PHONE_SURVEY: 'PHONE_SURVEY',
  OTHER: 'OTHER'
}; 