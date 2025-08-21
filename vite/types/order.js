// order.js

/**
 * @typedef {Object} Order
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} [customerId] - Customer ID (null for walk-in purchases)
 * @property {number} subtotal - Order subtotal
 * @property {number} tax - Tax amount
 * @property {number} total - Total amount
 * @property {string} status - Order status (PENDING, CONFIRMED, FULFILLED, CANCELLED, REFUNDED)
 * @property {string} [shippingAddress] - Shipping address
 * @property {Date} [fulfilledAt] - Fulfillment timestamp
 * @property {string} [squareOrderId] - Square order ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateOrderDto
 * @property {string} locationId - Associated location ID
 * @property {string} [customerId] - Customer ID
 * @property {number} subtotal - Order subtotal
 * @property {number} [tax] - Tax amount (defaults to 0)
 * @property {number} total - Total amount
 * @property {string} [shippingAddress] - Shipping address
 * @property {string} [squareOrderId] - Square order ID
 * @property {Array<CreateOrderItemDto>} items - Order items
 */

/**
 * @typedef {Object} UpdateOrderDto
 * @property {number} [subtotal] - Order subtotal
 * @property {number} [tax] - Tax amount
 * @property {number} [total] - Total amount
 * @property {string} [status] - Order status
 * @property {string} [shippingAddress] - Shipping address
 * @property {Date} [fulfilledAt] - Fulfillment timestamp
 * @property {string} [squareOrderId] - Square order ID
 */

/**
 * @typedef {Object} OrderSearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {string} [customerId] - Filter by customer ID
 * @property {string} [status] - Filter by status
 * @property {Date} [startDate] - Filter orders from this date
 * @property {Date} [endDate] - Filter orders until this date
 * @property {number} [minTotal] - Minimum total amount
 * @property {number} [maxTotal] - Maximum total amount
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} OrderWithRelations
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} [customerId] - Customer ID
 * @property {number} subtotal - Order subtotal
 * @property {number} tax - Tax amount
 * @property {number} total - Total amount
 * @property {string} status - Order status
 * @property {string} [shippingAddress] - Shipping address
 * @property {Date} [fulfilledAt] - Fulfillment timestamp
 * @property {string} [squareOrderId] - Square order ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Object} [location] - Associated location
 * @property {Object} [customer] - Associated customer
 * @property {Array<OrderItem>} [items] - Order items
 */

export const Order = {};