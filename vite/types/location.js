// location.js

/**
 * @typedef {Object} Location
 * @property {string} id - Unique identifier
 * @property {string} name - Location name (e.g., "Downtown Paws", "Westside Grooming")
 * @property {string} address - Street address
 * @property {string} city - City
 * @property {string} state - State
 * @property {string} zipCode - ZIP code
 * @property {string} phone - Phone number
 * @property {string} email - Email address
 * @property {boolean} isActive - Whether location is active
 * @property {string} [franchiseId] - Unique franchise identifier
 * @property {string} [ownerId] - Franchisee user ID
 * @property {number} [franchiseFeeRate] - Franchise fee rate (defaults to 0.06)
 * @property {number} [royaltyRate] - Royalty rate (defaults to 0.04)
 * @property {string} timezone - Timezone (defaults to "America/Chicago")
 * @property {Object} [businessHours] - Business hours stored as JSON
 * @property {number} [currentCSIAverage] - Current CSI average
 * @property {Date} [lastCSIUpdate] - Last CSI update timestamp
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateLocationDto
 * @property {string} name - Location name
 * @property {string} address - Street address
 * @property {string} city - City
 * @property {string} state - State
 * @property {string} zipCode - ZIP code
 * @property {string} phone - Phone number
 * @property {string} email - Email address
 * @property {string} [franchiseId] - Unique franchise identifier
 * @property {string} [ownerId] - Franchisee user ID
 * @property {number} [franchiseFeeRate] - Franchise fee rate
 * @property {number} [royaltyRate] - Royalty rate
 * @property {string} [timezone] - Timezone
 * @property {Object} [businessHours] - Business hours
 */

/**
 * @typedef {Object} UpdateLocationDto
 * @property {string} [name] - Location name
 * @property {string} [address] - Street address
 * @property {string} [city] - City
 * @property {string} [state] - State
 * @property {string} [zipCode] - ZIP code
 * @property {string} [phone] - Phone number
 * @property {string} [email] - Email address
 * @property {boolean} [isActive] - Whether location is active
 * @property {string} [franchiseId] - Unique franchise identifier
 * @property {string} [ownerId] - Franchisee user ID
 * @property {number} [franchiseFeeRate] - Franchise fee rate
 * @property {number} [royaltyRate] - Royalty rate
 * @property {string} [timezone] - Timezone
 * @property {Object} [businessHours] - Business hours
 */

/**
 * @typedef {Object} LocationSearchParams
 * @property {string} [name] - Filter by name
 * @property {string} [city] - Filter by city
 * @property {string} [state] - Filter by state
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [ownerId] - Filter by owner
 * @property {string} [franchiseId] - Filter by franchise ID
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} LocationWithRelations
 * @property {string} id - Unique identifier
 * @property {string} name - Location name
 * @property {string} address - Street address
 * @property {string} city - City
 * @property {string} state - State
 * @property {string} zipCode - ZIP code
 * @property {string} phone - Phone number
 * @property {string} email - Email address
 * @property {boolean} isActive - Whether location is active
 * @property {string} [franchiseId] - Unique franchise identifier
 * @property {string} [ownerId] - Franchisee user ID
 * @property {number} [franchiseFeeRate] - Franchise fee rate
 * @property {number} [royaltyRate] - Royalty rate
 * @property {string} timezone - Timezone
 * @property {Object} [businessHours] - Business hours
 * @property {number} [currentCSIAverage] - Current CSI average
 * @property {Date} [lastCSIUpdate] - Last CSI update timestamp
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Object} [owner] - Location owner
 * @property {Object} [territory] - Associated territory
 * @property {Array<CSI>} [csiRecords] - CSI records
 * @property {Array<UserAdministrator>} [adminUsers] - Admin users
 * @property {Array<Customer>} [customers] - Customers
 * @property {Array<Appointment>} [appointments] - Appointments
 * @property {Array<Subscription>} [subscriptions] - Subscriptions
 * @property {Array<Order>} [orders] - Orders
 * @property {Array<Product>} [products] - Products
 * @property {Array<FranchiseFee>} [franchiseFees] - Franchise fees
 */

export const Location = {}; 