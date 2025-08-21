// product.js

/**
 * @typedef {Object} Product
 * @property {string} id - Unique identifier
 * @property {string} [locationId] - Associated location ID (where stocked)
 * @property {string} name - Product name
 * @property {string} [description] - Product description
 * @property {string} category - Product category (e.g., "Shampoo", "Toys", "Apparel", "Accessories")
 * @property {number} price - Product price
 * @property {number} [cost] - Product cost (for profit margin tracking)
 * @property {number} stockQuantity - Current stock quantity
 * @property {number} lowStockThreshold - Low stock threshold
 * @property {string} [squareItemId] - Square item ID
 * @property {string} [imageUrl] - Product image URL
 * @property {boolean} isActive - Whether product is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateProductDto
 * @property {string} [locationId] - Associated location ID
 * @property {string} name - Product name
 * @property {string} [description] - Product description
 * @property {string} category - Product category
 * @property {number} price - Product price
 * @property {number} [cost] - Product cost
 * @property {number} [stockQuantity] - Initial stock quantity (defaults to 0)
 * @property {number} [lowStockThreshold] - Low stock threshold (defaults to 5)
 * @property {string} [squareItemId] - Square item ID
 * @property {string} [imageUrl] - Product image URL
 */

/**
 * @typedef {Object} UpdateProductDto
 * @property {string} [name] - Product name
 * @property {string} [description] - Product description
 * @property {string} [category] - Product category
 * @property {number} [price] - Product price
 * @property {number} [cost] - Product cost
 * @property {number} [stockQuantity] - Stock quantity
 * @property {number} [lowStockThreshold] - Low stock threshold
 * @property {string} [squareItemId] - Square item ID
 * @property {string} [imageUrl] - Product image URL
 * @property {boolean} [isActive] - Whether product is active
 */

/**
 * @typedef {Object} ProductSearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {string} [category] - Filter by category
 * @property {string} [name] - Filter by name (partial match)
 * @property {boolean} [isActive] - Filter by active status
 * @property {boolean} [lowStock] - Filter for low stock items
 * @property {number} [minPrice] - Minimum price
 * @property {number} [maxPrice] - Maximum price
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} ProductWithRelations
 * @property {string} id - Unique identifier
 * @property {string} [locationId] - Associated location ID
 * @property {string} name - Product name
 * @property {string} [description] - Product description
 * @property {string} category - Product category
 * @property {number} price - Product price
 * @property {number} [cost] - Product cost
 * @property {number} stockQuantity - Current stock quantity
 * @property {number} lowStockThreshold - Low stock threshold
 * @property {string} [squareItemId] - Square item ID
 * @property {string} [imageUrl] - Product image URL
 * @property {boolean} isActive - Whether product is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Object} [location] - Associated location
 * @property {Array<OrderItem>} [orderItems] - Order items containing this product
 */

export const Product = {};