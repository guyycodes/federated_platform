// userAdministrator.js

/**
 * @typedef {Object} UserAdministrator
 * @property {string} id - Unique identifier
 * @property {string} userId - User ID
 * @property {string} locationId - Location ID
 * @property {boolean} canViewFinancials - Can view financials
 * @property {boolean} canManageStaff - Can manage staff
 * @property {boolean} canEditAppointments - Can edit appointments
 * @property {boolean} canViewReports - Can view reports
 * @property {Date} assignedAt - Assignment timestamp
 * @property {string} [assignedBy] - ID of user who granted access
 */

/**
 * @typedef {Object} CreateUserAdministratorDto
 * @property {string} userId - User ID
 * @property {string} locationId - Location ID
 * @property {boolean} [canViewFinancials] - Can view financials (defaults to false)
 * @property {boolean} [canManageStaff] - Can manage staff (defaults to false)
 * @property {boolean} [canEditAppointments] - Can edit appointments (defaults to true)
 * @property {boolean} [canViewReports] - Can view reports (defaults to true)
 * @property {string} [assignedBy] - ID of user who granted access
 */

/**
 * @typedef {Object} UpdateUserAdministratorDto
 * @property {boolean} [canViewFinancials] - Can view financials
 * @property {boolean} [canManageStaff] - Can manage staff
 * @property {boolean} [canEditAppointments] - Can edit appointments
 * @property {boolean} [canViewReports] - Can view reports
 */

/**
 * @typedef {Object} UserAdministratorSearchParams
 * @property {string} [userId] - Filter by user ID
 * @property {string} [locationId] - Filter by location ID
 * @property {boolean} [canViewFinancials] - Filter by financial access
 * @property {boolean} [canManageStaff] - Filter by staff management access
 * @property {boolean} [canEditAppointments] - Filter by appointment edit access
 * @property {boolean} [canViewReports] - Filter by report access
 * @property {Date} [startDate] - Filter assignments from this date
 * @property {Date} [endDate] - Filter assignments until this date
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} UserAdministratorWithRelations
 * @property {string} id - Unique identifier
 * @property {string} userId - User ID
 * @property {string} locationId - Location ID
 * @property {boolean} canViewFinancials - Can view financials
 * @property {boolean} canManageStaff - Can manage staff
 * @property {boolean} canEditAppointments - Can edit appointments
 * @property {boolean} canViewReports - Can view reports
 * @property {Date} assignedAt - Assignment timestamp
 * @property {string} [assignedBy] - ID of user who granted access
 * @property {Object} [user] - Associated user
 * @property {Object} [location] - Associated location
 */

export const UserAdministrator = {}; 