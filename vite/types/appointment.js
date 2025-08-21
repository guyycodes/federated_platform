// appointment.js

/**
 * @typedef {Object} Appointment
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} customerId - Customer ID
 * @property {string} serviceType - Type of service (e.g., "Full Groom", "Bath Only", "Nail Trim")
 * @property {Date} scheduledAt - Scheduled appointment time
 * @property {number} duration - Duration in minutes
 * @property {number} price - Service price
 * @property {string} [notes] - Additional notes
 * @property {string} [assignedTo] - Staff member assigned
 * @property {string} status - Appointment status (SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW)
 * @property {Date} [completedAt] - Completion timestamp
 * @property {string} [squareOrderId] - Square order ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateAppointmentDto
 * @property {string} locationId - Associated location ID
 * @property {string} customerId - Customer ID
 * @property {string} serviceType - Type of service
 * @property {Date} scheduledAt - Scheduled appointment time
 * @property {number} duration - Duration in minutes
 * @property {number} price - Service price
 * @property {string} [notes] - Additional notes
 * @property {string} [assignedTo] - Staff member assigned
 * @property {string} [squareOrderId] - Square order ID
 */

/**
 * @typedef {Object} UpdateAppointmentDto
 * @property {string} [serviceType] - Type of service
 * @property {Date} [scheduledAt] - Scheduled appointment time
 * @property {number} [duration] - Duration in minutes
 * @property {number} [price] - Service price
 * @property {string} [notes] - Additional notes
 * @property {string} [assignedTo] - Staff member assigned
 * @property {string} [status] - Appointment status
 * @property {Date} [completedAt] - Completion timestamp
 * @property {string} [squareOrderId] - Square order ID
 */

/**
 * @typedef {Object} AppointmentSearchParams
 * @property {string} [locationId] - Filter by location ID
 * @property {string} [customerId] - Filter by customer ID
 * @property {string} [serviceType] - Filter by service type
 * @property {string} [status] - Filter by status
 * @property {string} [assignedTo] - Filter by assigned staff
 * @property {Date} [startDate] - Filter appointments from this date
 * @property {Date} [endDate] - Filter appointments until this date
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} AppointmentWithRelations
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} customerId - Customer ID
 * @property {string} serviceType - Type of service
 * @property {Date} scheduledAt - Scheduled appointment time
 * @property {number} duration - Duration in minutes
 * @property {number} price - Service price
 * @property {string} [notes] - Additional notes
 * @property {string} [assignedTo] - Staff member assigned
 * @property {string} status - Appointment status
 * @property {Date} [completedAt] - Completion timestamp
 * @property {string} [squareOrderId] - Square order ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Object} [location] - Associated location
 * @property {Object} [customer] - Associated customer
 */

export const Appointment = {};