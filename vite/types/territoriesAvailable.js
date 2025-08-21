// territoriesAvailable.js

/**
 * @typedef {Object} TerritoriesAvailable
 * @property {string} id - Unique identifier
 * @property {string} territoryCode - Unique territory code (e.g., "TX-AUSTIN-NORTH", "CA-LA-WEST")
 * @property {string} territoryName - Territory name (e.g., "North Austin", "West Los Angeles")
 * @property {string} state - State
 * @property {string} [city] - City (null if covers multiple cities)
 * @property {Array<string>} zipCodes - Array of zip codes covered
 * @property {string} [county] - County
 * @property {number} [estimatedPopulation] - Estimated population
 * @property {number} [averageIncome] - Average income
 * @property {number} [competitorCount] - Number of competitors (defaults to 0)
 * @property {string} [marketPotential] - Market potential (HIGH, MEDIUM, LOW)
 * @property {number} franchiseFee - Initial franchise fee (defaults to 45000)
 * @property {number} [minimumInvestment] - Estimated startup cost
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {boolean} isAvailable - Whether territory is available (defaults to true)
 * @property {Date} [reservedUntil] - Hold period for interested prospects
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateTerritoriesAvailableDto
 * @property {string} territoryCode - Unique territory code
 * @property {string} territoryName - Territory name
 * @property {string} state - State
 * @property {string} [city] - City
 * @property {Array<string>} zipCodes - Array of zip codes covered
 * @property {string} [county] - County
 * @property {number} [estimatedPopulation] - Estimated population
 * @property {number} [averageIncome] - Average income
 * @property {number} [competitorCount] - Number of competitors
 * @property {string} [marketPotential] - Market potential
 * @property {number} [franchiseFee] - Initial franchise fee
 * @property {number} [minimumInvestment] - Estimated startup cost
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {boolean} [isAvailable] - Whether territory is available
 * @property {Date} [reservedUntil] - Hold period for interested prospects
 */

/**
 * @typedef {Object} UpdateTerritoriesAvailableDto
 * @property {string} [territoryName] - Territory name
 * @property {string} [state] - State
 * @property {string} [city] - City
 * @property {Array<string>} [zipCodes] - Array of zip codes covered
 * @property {string} [county] - County
 * @property {number} [estimatedPopulation] - Estimated population
 * @property {number} [averageIncome] - Average income
 * @property {number} [competitorCount] - Number of competitors
 * @property {string} [marketPotential] - Market potential
 * @property {number} [franchiseFee] - Initial franchise fee
 * @property {number} [minimumInvestment] - Estimated startup cost
 * @property {number} [exclusiveRadius] - Miles of exclusivity
 * @property {boolean} [isAvailable] - Whether territory is available
 * @property {Date} [reservedUntil] - Hold period for interested prospects
 */

/**
 * @typedef {Object} TerritoriesAvailableSearchParams
 * @property {string} [territoryCode] - Filter by territory code
 * @property {string} [territoryName] - Filter by territory name
 * @property {string} [state] - Filter by state
 * @property {string} [city] - Filter by city
 * @property {string} [county] - Filter by county
 * @property {boolean} [isAvailable] - Filter by availability
 * @property {string} [marketPotential] - Filter by market potential
 * @property {number} [minPopulation] - Minimum estimated population
 * @property {number} [maxPopulation] - Maximum estimated population
 * @property {number} [minFranchiseFee] - Minimum franchise fee
 * @property {number} [maxFranchiseFee] - Maximum franchise fee
 * @property {number} [limit] - Number of results to return
 * @property {number} [offset] - Number of results to skip
 */

export const TerritoriesAvailable = {}; 