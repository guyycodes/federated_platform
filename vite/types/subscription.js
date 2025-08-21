// subscription.js

/**
 * @typedef {Object} Subscription
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} customerId - Customer ID
 * @property {string} packageType - Package type (e.g., "Monthly Groom", "Bi-weekly Bath")
 * @property {number} price - Price per billing cycle
 * @property {string} billingInterval - Billing interval (e.g., "monthly", "weekly")
 * @property {string} status - Subscription status (ACTIVE, PAUSED, CANCELLED, EXPIRED)
 * @property {Date} startDate - Subscription start date
 * @property {Date} [nextBillingDate] - Next billing date
 * @property {Date} [canceledAt] - Cancellation timestamp
 * @property {string} [squareSubscriptionId] - Square subscription ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateSubscriptionDto
 * @property {string} locationId - Associated location ID
 * @property {string} customerId - Customer ID
 * @property {string} packageType - Package type
 * @property {number} price - Price per billing cycle
 * @property {string} billingInterval - Billing interval
 * @property {Date} startDate - Subscription start date
 * @property {Date} [nextBillingDate] - Next billing date
 * @property {string} [squareSubscriptionId] - Square subscription ID
 */

/**
 * @typedef {Object} UpdateSubscriptionDto
 * @property {string} [packageType] - Package type
 * @property {number} [price] - Price per billing cycle
 * @property {string} [billingInterval] - Billing interval
 * @property {string} [status] - Subscription status
 * @property {Date} [nextBillingDate] - Next billing date
 * @property {Date} [canceledAt] - Cancellation timestamp
 * @property {string} [squareSubscriptionId] - Square subscription ID
 */

/**
 * @typedef {Object} SubscriptionSearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {string} [customerId] - Filter by customer ID
 * @property {string} [packageType] - Filter by package type
 * @property {string} [status] - Filter by status
 * @property {string} [billingInterval] - Filter by billing interval
 * @property {Date} [startDate] - Filter subscriptions from this date
 * @property {Date} [endDate] - Filter subscriptions until this date
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} SubscriptionWithRelations
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} customerId - Customer ID
 * @property {string} packageType - Package type
 * @property {number} price - Price per billing cycle
 * @property {string} billingInterval - Billing interval
 * @property {string} status - Subscription status
 * @property {Date} startDate - Subscription start date
 * @property {Date} [nextBillingDate] - Next billing date
 * @property {Date} [canceledAt] - Cancellation timestamp
 * @property {string} [squareSubscriptionId] - Square subscription ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Object} [location] - Associated location
 * @property {Object} [customer] - Associated customer
 */

export const Subscription = {};