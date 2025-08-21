// csi.js

/**
 * @typedef {Object} CSI
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {number} score - CSI score (1-5 scale)
 * @property {string} [comment] - CSI comment
 * @property {string} source - CSI source (CUSTOMER, STAFF, MYSTERY_SHOPPER, ONLINE_REVIEW, PHONE_SURVEY, OTHER)
 * @property {string} [surveyType] - Survey type (e.g., "post-appointment", "monthly", "annual")
 * @property {string} [customerId] - Customer ID if from specific customer
 * @property {Date} recordedAt - Recording timestamp
 * @property {string} [recordedBy] - User ID who recorded it
 */

/**
 * @typedef {Object} CreateCSIDto
 * @property {string} locationId - Associated location ID
 * @property {number} score - CSI score (1-5 scale)
 * @property {string} [comment] - CSI comment
 * @property {string} source - CSI source
 * @property {string} [surveyType] - Survey type
 * @property {string} [customerId] - Customer ID if from specific customer
 * @property {string} [recordedBy] - User ID who recorded it
 */

/**
 * @typedef {Object} UpdateCSIDto
 * @property {number} [score] - CSI score (1-5 scale)
 * @property {string} [comment] - CSI comment
 * @property {string} [source] - CSI source
 * @property {string} [surveyType] - Survey type
 * @property {string} [recordedBy] - User ID who recorded it
 */

/**
 * @typedef {Object} CSISearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {string} [customerId] - Filter by customer ID
 * @property {string} [source] - Filter by source
 * @property {string} [surveyType] - Filter by survey type
 * @property {number} [minScore] - Minimum score
 * @property {number} [maxScore] - Maximum score
 * @property {Date} [startDate] - Filter from this date
 * @property {Date} [endDate] - Filter until this date
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} CSIWithRelations
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {number} score - CSI score (1-5 scale)
 * @property {string} [comment] - CSI comment
 * @property {string} source - CSI source
 * @property {string} [surveyType] - Survey type
 * @property {string} [customerId] - Customer ID if from specific customer
 * @property {Date} recordedAt - Recording timestamp
 * @property {string} [recordedBy] - User ID who recorded it
 * @property {Object} [location] - Associated location
 * @property {Object} [customer] - Associated customer
 */

export const CSI = {}; 