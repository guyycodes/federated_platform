// orderItem.js

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Unique identifier
 * @property {string} orderId - Associated order ID
 * @property {string} productId - Associated product ID
 * @property {string} [discount] - Discount code or percentage
 * @property {number} quantity - Quantity ordered
 * @property {number} price - Price at time of purchase
 */

/**
 * @typedef {Object} CreateOrderItemDto
 * @property {string} orderId - Associated order ID
 * @property {string} productId - Associated product ID
 * @property {string} [discount] - Discount code or percentage
 * @property {number} quantity - Quantity ordered
 * @property {number} price - Price at time of purchase
 */

/**
 * @typedef {Object} UpdateOrderItemDto
 * @property {string} [discount] - Discount code or percentage
 * @property {number} [quantity] - Quantity ordered
 * @property {number} [price] - Price at time of purchase
 */

/**
 * @typedef {Object} OrderItemWithRelations
 * @property {string} id - Unique identifier
 * @property {string} orderId - Associated order ID
 * @property {string} productId - Associated product ID
 * @property {string} [discount] - Discount code or percentage
 * @property {number} quantity - Quantity ordered
 * @property {number} price - Price at time of purchase
 * @property {Object} [order] - Associated order
 * @property {Object} [product] - Associated product
 */

export const OrderItem = {}; 