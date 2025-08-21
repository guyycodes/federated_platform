// customer.js

/**
 * @typedef {Object} Customer
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} [userId] - Optional user account ID
 * @property {string} firstName - Customer's first name
 * @property {string} lastName - Customer's last name
 * @property {string} email - Customer's email address
 * @property {string} phone - Customer's phone number
 * @property {string} [dogName] - Dog's name
 * @property {string} [dogBreed] - Dog's breed
 * @property {number} [dogAge] - Dog's age
 * @property {number} [dogWeight] - Dog's weight
 * @property {string} [allergies] - Dog's allergies
 * @property {string} [preferredGroomer] - Preferred groomer
 * @property {string} [notes] - Additional notes
 * @property {string} [squareCustomerId] - Square customer ID
 * @property {boolean} isActive - Whether customer is active
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateCustomerDto
 * @property {string} locationId - Associated location ID
 * @property {string} [userId] - Optional user account ID
 * @property {string} firstName - Customer's first name
 * @property {string} lastName - Customer's last name
 * @property {string} email - Customer's email address
 * @property {string} phone - Customer's phone number
 * @property {string} [dogName] - Dog's name
 * @property {string} [dogBreed] - Dog's breed
 * @property {number} [dogAge] - Dog's age
 * @property {number} [dogWeight] - Dog's weight
 * @property {string} [allergies] - Dog's allergies
 * @property {string} [preferredGroomer] - Preferred groomer
 * @property {string} [notes] - Additional notes
 * @property {string} [squareCustomerId] - Square customer ID
 */

/**
 * @typedef {Object} UpdateCustomerDto
 * @property {string} [firstName] - Customer's first name
 * @property {string} [lastName] - Customer's last name
 * @property {string} [email] - Customer's email address
 * @property {string} [phone] - Customer's phone number
 * @property {string} [dogName] - Dog's name
 * @property {string} [dogBreed] - Dog's breed
 * @property {number} [dogAge] - Dog's age
 * @property {number} [dogWeight] - Dog's weight
 * @property {string} [allergies] - Dog's allergies
 * @property {string} [preferredGroomer] - Preferred groomer
 * @property {string} [notes] - Additional notes
 * @property {boolean} [isActive] - Whether customer is active
 */

/**
 * @typedef {Object} CustomerRegistrationDto
 * @property {string} firstName - Customer's first name
 * @property {string} lastName - Customer's last name
 * @property {string} email - Customer's email address
 * @property {string} phone - Customer's phone number
 * @property {string} locationId - Associated location ID
 * @property {string} [dogName] - Dog's name
 * @property {string} [dogBreed] - Dog's breed
 * @property {number} [dogAge] - Dog's age
 * @property {number} [dogWeight] - Dog's weight
 * @property {string} [allergies] - Dog's allergies
 * @property {string} [preferredGroomer] - Preferred groomer
 * @property {string} [notes] - Additional notes
 */

/**
 * @typedef {Object} CustomerSearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {string} [email] - Filter by email
 * @property {string} [phone] - Filter by phone
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [dogBreed] - Filter by dog breed
 * @property {string} [preferredGroomer] - Filter by preferred groomer
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

export const Customer = {}; 