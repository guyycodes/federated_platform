// franchiseFee.js

/**
 * @typedef {Object} FranchiseFee
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {number} month - Month (1-12)
 * @property {number} year - Year
 * @property {number} serviceRevenue - Service revenue
 * @property {number} productRevenue - Product revenue
 * @property {number} subscriptionRevenue - Subscription revenue
 * @property {number} totalRevenue - Total revenue
 * @property {number} franchiseFee - Calculated franchise fee
 * @property {number} royaltyFee - Calculated royalty fee
 * @property {number} totalFees - Total fees
 * @property {boolean} isPaid - Whether fees are paid
 * @property {Date} [paidAt] - Payment timestamp
 * @property {Date} dueDate - Due date
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * @typedef {Object} CreateFranchiseFeeDto
 * @property {string} locationId - Associated location ID
 * @property {number} month - Month (1-12)
 * @property {number} year - Year
 * @property {number} serviceRevenue - Service revenue
 * @property {number} productRevenue - Product revenue
 * @property {number} subscriptionRevenue - Subscription revenue
 * @property {number} totalRevenue - Total revenue
 * @property {number} franchiseFee - Calculated franchise fee
 * @property {number} royaltyFee - Calculated royalty fee
 * @property {number} totalFees - Total fees
 * @property {Date} dueDate - Due date
 */

/**
 * @typedef {Object} UpdateFranchiseFeeDto
 * @property {number} [serviceRevenue] - Service revenue
 * @property {number} [productRevenue] - Product revenue
 * @property {number} [subscriptionRevenue] - Subscription revenue
 * @property {number} [totalRevenue] - Total revenue
 * @property {number} [franchiseFee] - Calculated franchise fee
 * @property {number} [royaltyFee] - Calculated royalty fee
 * @property {number} [totalFees] - Total fees
 * @property {boolean} [isPaid] - Whether fees are paid
 * @property {Date} [paidAt] - Payment timestamp
 * @property {Date} [dueDate] - Due date
 */

/**
 * @typedef {Object} FranchiseFeeSearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {number} [month] - Filter by month
 * @property {number} [year] - Filter by year
 * @property {boolean} [isPaid] - Filter by payment status
 * @property {Date} [startDate] - Filter from this date
 * @property {Date} [endDate] - Filter until this date
 * @property {number} [minTotalFees] - Minimum total fees
 * @property {number} [maxTotalFees] - Maximum total fees
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} FranchiseFeeWithRelations
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {number} month - Month (1-12)
 * @property {number} year - Year
 * @property {number} serviceRevenue - Service revenue
 * @property {number} productRevenue - Product revenue
 * @property {number} subscriptionRevenue - Subscription revenue
 * @property {number} totalRevenue - Total revenue
 * @property {number} franchiseFee - Calculated franchise fee
 * @property {number} royaltyFee - Calculated royalty fee
 * @property {number} totalFees - Total fees
 * @property {boolean} isPaid - Whether fees are paid
 * @property {Date} [paidAt] - Payment timestamp
 * @property {Date} dueDate - Due date
 * @property {Date} createdAt - Creation timestamp
 * @property {Object} [location] - Associated location
 */

export const FranchiseFee = {}; 