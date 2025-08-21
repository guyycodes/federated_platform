// territory.js

/**
 * @typedef {Object} Territory
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} territoryCode - Unique territory code
 * @property {string} territoryName - Territory name
 * @property {string} [territoryAddress] - Territory address
 * @property {string} [territoryCity] - Territory city
 * @property {string} [territoryState] - Territory state
 * @property {string} [territoryZipCode] - Territory ZIP code
 * @property {string} [territoryPhone] - Territory phone
 * @property {string} [territoryEmail] - Territory email
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {number} [populationServed] - Population served
 * @property {number} [marketPenetration] - Percentage of market captured
 * @property {Date} assignedAt - Assignment timestamp
 */

/**
 * @typedef {Object} CreateTerritoryDto
 * @property {string} locationId - Associated location ID
 * @property {string} territoryCode - Unique territory code
 * @property {string} territoryName - Territory name
 * @property {string} [territoryAddress] - Territory address
 * @property {string} [territoryCity] - Territory city
 * @property {string} [territoryState] - Territory state
 * @property {string} [territoryZipCode] - Territory ZIP code
 * @property {string} [territoryPhone] - Territory phone
 * @property {string} [territoryEmail] - Territory email
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {number} [populationServed] - Population served
 * @property {number} [marketPenetration] - Percentage of market captured
 */

/**
 * @typedef {Object} UpdateTerritoryDto
 * @property {string} [territoryName] - Territory name
 * @property {string} [territoryAddress] - Territory address
 * @property {string} [territoryCity] - Territory city
 * @property {string} [territoryState] - Territory state
 * @property {string} [territoryZipCode] - Territory ZIP code
 * @property {string} [territoryPhone] - Territory phone
 * @property {string} [territoryEmail] - Territory email
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {number} [populationServed] - Population served
 * @property {number} [marketPenetration] - Percentage of market captured
 */

/**
 * @typedef {Object} TerritorySearchParams
 * @property {string} [territoryCode] - Filter by territory code
 * @property {string} [territoryName] - Filter by territory name
 * @property {string} [territoryState] - Filter by state
 * @property {string} [territoryCity] - Filter by city
 * @property {number} [minPopulation] - Minimum population served
 * @property {number} [maxPopulation] - Maximum population served
 * @property {Date} [startDate] - Filter assignments from this date
 * @property {Date} [endDate] - Filter assignments until this date
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

/**
 * @typedef {Object} TerritoryWithRelations
 * @property {string} id - Unique identifier
 * @property {string} locationId - Associated location ID
 * @property {string} territoryCode - Unique territory code
 * @property {string} territoryName - Territory name
 * @property {string} [territoryAddress] - Territory address
 * @property {string} [territoryCity] - Territory city
 * @property {string} [territoryState] - Territory state
 * @property {string} [territoryZipCode] - Territory ZIP code
 * @property {string} [territoryPhone] - Territory phone
 * @property {string} [territoryEmail] - Territory email
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {number} [populationServed] - Population served
 * @property {number} [marketPenetration] - Percentage of market captured
 * @property {Date} assignedAt - Assignment timestamp
 * @property {Object} [location] - Associated location
 */

export const Territory = {}; 