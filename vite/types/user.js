/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [phone] - User's phone number
 * @property {string} clerkUserId - Clerk user ID (required for business users)
 * @property {string} role - User role (UNSET, USER_ADMIN, USER, LOCATION_ADMIN, CUSTOMER, STAFF, ACCOUNTANT, OTHER)
 * @property {boolean} isActive - Whether user is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateUserDto
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [phone] - User's phone number
 * @property {string} clerkUserId - Clerk user ID
 * @property {string} [role] - User role (defaults to UNSET)
 * @property {boolean} [isActive] - Whether user is active (defaults to true)
 */

/**
 * @typedef {Object} UpdateUserDto
 * @property {string} [email] - User's email address
 * @property {string} [firstName] - User's first name
 * @property {string} [lastName] - User's last name
 * @property {string} [phone] - User's phone number
 * @property {string} [role] - User role
 * @property {boolean} [isActive] - Whether user is active
 */

/**
 * @typedef {Object} UserSearchParams
 * @property {string} [email] - Filter by email
 * @property {string} [role] - Filter by role
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [firstName] - Filter by first name
 * @property {string} [lastName] - Filter by last name
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} UserWithRelations
 * @property {string} id - Unique identifier
 * @property {string} email - User's email address
 * @property {string} firstName - User's first name
 * @property {string} lastName - User's last name
 * @property {string} [phone] - User's phone number
 * @property {string} clerkUserId - Clerk user ID
 * @property {string} role - User role
 * @property {boolean} isActive - Whether user is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Array<Location>} [ownedLocations] - Locations owned by this user
 * @property {Array<UserAdministrator>} [locationAccess] - Location access permissions
 * @property {Object} [customerAccount] - Customer account if user is also a customer
 */

export const User = {}; 