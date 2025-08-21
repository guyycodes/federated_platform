// GitHub API endpoint for fetching registry.json from private repo
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const GITHUB_API_URL = 'https://api.github.com/repos/guyycodes/plugin-registry-staging/contents/registry.json';

// Enhanced plugin registry with comprehensive caching and filtering
const pluginRegistry = {
  byId: new Map(),           // Fast O(1) lookup by plugin ID
  byName: new Map(),         // Fast lookup by name
  chronological: [],         // Chronological order for listing
  byCategory: new Map(),     // Category groupings
  byIntegration: new Map(),  // Integration groupings
  lastUpdated: null,
  isLoading: false,
  rawRegistry: null          // Store raw registry data
};

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Function to save cache state to JSON file
async function saveCacheState() {
  try {
    const cacheState = {
      timestamp: new Date().toISOString(),
      lastUpdated: pluginRegistry.lastUpdated,
      cacheExpiry: pluginRegistry.lastUpdated ? 
        new Date(pluginRegistry.lastUpdated + CACHE_DURATION).toISOString() : null,
      stats: {
        totalPlugins: pluginRegistry.chronological.length,
        categories: getAllCategories(),
        integrations: getAllIntegrations(),
        modalities: getAllModalities(),
        pluginsByCategory: Object.fromEntries(pluginRegistry.byCategory),
        pluginsByIntegration: Object.fromEntries(pluginRegistry.byIntegration)
      },
      plugins: pluginRegistry.chronological.map(plugin => ({
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        categories: plugin.categories,
        integrations: plugin.integrations,
        price: plugin.configuration?.schema?.pricing?.initialCost || 0,
        lastUpdated: plugin.lastUpdated
      })),
      fullRegistry: pluginRegistry.rawRegistry
    };

    const cacheFilePath = join(__dirname, 'cacheState.json');
    await writeFile(cacheFilePath, JSON.stringify(cacheState, null, 2), 'utf-8');
    console.log('💾 Cache state saved to:', cacheFilePath);
  } catch (error) {
    console.error('Failed to save cache state:', error);
    // Don't throw - caching should not break the main flow
  }
}

// Main function to get all plugins (with caching)
export async function getAvailablePlugins() {
  // Check if cache is fresh
  if (pluginRegistry.lastUpdated && 
      Date.now() - pluginRegistry.lastUpdated < CACHE_DURATION &&
      pluginRegistry.chronological.length > 0) {
    console.log('🚀 Serving plugins from cache');
    return pluginRegistry.chronological;
  }

  // Prevent concurrent fetches
  if (pluginRegistry.isLoading) {
    while (pluginRegistry.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return pluginRegistry.chronological;
  }

  try {
    pluginRegistry.isLoading = true;
    console.log('📡 Fetching fresh plugin data from GitHub API...');
    
    // Fetch from GitHub API with authentication
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        'Authorization': `Bearer ${process.env.PLUGIN_REGISTRY_GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      cache: 'no-cache',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch registry: ${response.status}`);
    }

    const data = await response.json();
    
    // Decode base64 content from GitHub API
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const registry = JSON.parse(content);
    
    // Store raw registry
    pluginRegistry.rawRegistry = registry;
    
    // Clear existing cache
    pluginRegistry.byId.clear();
    pluginRegistry.byName.clear();
    pluginRegistry.byCategory.clear();
    pluginRegistry.byIntegration.clear();
    pluginRegistry.chronological = [];
    
    // Process and index plugins
    const plugins = registry.plugins || [];
    plugins.forEach((plugin) => {
      // ID lookup
      pluginRegistry.byId.set(plugin.id, plugin);
      
      // Name lookup (case-insensitive)
      pluginRegistry.byName.set(plugin.name.toLowerCase(), plugin);
      
      // Chronological order
      pluginRegistry.chronological.push(plugin);
      
      // Category index
      if (plugin.categories) {
        plugin.categories.forEach(category => {
          if (!pluginRegistry.byCategory.has(category)) {
            pluginRegistry.byCategory.set(category, []);
          }
          pluginRegistry.byCategory.get(category).push(plugin);
        });
      }
      
      // Integration index
      if (plugin.integrations) {
        plugin.integrations.forEach(integration => {
          if (!pluginRegistry.byIntegration.has(integration)) {
            pluginRegistry.byIntegration.set(integration, []);
          }
          pluginRegistry.byIntegration.get(integration).push(plugin);
        });
      }
    });
    
    pluginRegistry.lastUpdated = Date.now();
    console.log(`✅ Cached ${plugins.length} plugins from GitHub`);
    
    // Save cache state to file
    await saveCacheState();
    
    return pluginRegistry.chronological;
    
  } catch (error) {
    console.error('Failed to fetch plugin registry:', error);
    // Return cached data if available
    return pluginRegistry.chronological || [];
  } finally {
    pluginRegistry.isLoading = false;
  }
}

// 1. Filter by name (partial match, case-insensitive)
export function filterByName(searchTerm) {
  if (!searchTerm) return pluginRegistry.chronological;
  
  const lowercaseSearch = searchTerm.toLowerCase();
  return pluginRegistry.chronological.filter(plugin => 
    plugin.name.toLowerCase().includes(lowercaseSearch)
  );
}

// 2. Filter by price range
export function filterByPrice(minPrice = 0, maxPrice = Infinity) {
  return pluginRegistry.chronological.filter(plugin => {
    const price = plugin.configuration?.schema?.pricing?.initialCost || 0;
    return price >= minPrice && price <= maxPrice;
  });
}

// 3. Filter by keywords
export function filterByKeywords(keywords) {
  if (!keywords || keywords.length === 0) return pluginRegistry.chronological;
  
  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
  return pluginRegistry.chronological.filter(plugin => {
    if (!plugin.keywords) return false;
    const pluginKeywords = plugin.keywords.map(k => k.toLowerCase());
    return pluginKeywords.some(k => keywordSet.has(k));
  });
}

// 4. Filter by category
export function filterByCategory(category) {
  return pluginRegistry.byCategory.get(category) || [];
}

// 5. Filter by modality
export function filterByModality(modality) {
  return pluginRegistry.chronological.filter(plugin => {
    const models = plugin.configuration?.schema?.agent?.models || [];
    return models.some(model => 
      model.modalities && model.modalities.includes(modality)
    );
  });
}

// 6. Filter by integrations
export function filterByIntegration(integration) {
  return pluginRegistry.byIntegration.get(integration) || [];
}

// 7. Get remote entry production URL
export function getRemoteEntryProduction(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return plugin?.ui?.remoteEntry?.production || null;
}

// 8. Get remote entry staging URL
export function getRemoteEntryStaging(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return plugin?.ui?.remoteEntry?.staging || null;
}

// 9. Get app icons
export function getAppIcons(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return {
    large: plugin?.ui?.appIcons?.large || null,
    small: plugin?.ui?.appIcons?.small || null
  };
}

// 10. Get screenshots
export function getScreenshots(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return plugin?.ui?.screenshots || [];
}

// 11. Get manifest URL
export function getManifestUrl(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return plugin?.manifestUrl || null;
}

// 12. Get description
export function getDescription(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return plugin?.description || null;
}

// 13. Get configuration
export function getConfiguration(pluginId) {
  const plugin = pluginRegistry.byId.get(pluginId);
  return plugin?.configuration || null;
}

// 14. Get ID by name
export function getIdByName(name) {
  const plugin = pluginRegistry.byName.get(name.toLowerCase());
  return plugin?.id || null;
}

// 15. Get by ID
export function getPluginById(id) {
  return pluginRegistry.byId.get(id) || null;
}

// Advanced filtering with multiple criteria
export function filterPlugins(criteria = {}) {
  let results = [...pluginRegistry.chronological];
  
  // Apply filters in sequence
  if (criteria.name) {
    const searchTerm = criteria.name.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(searchTerm));
  }
  
  if (criteria.category) {
    results = results.filter(p => p.categories?.includes(criteria.category));
  }
  
  if (criteria.integration) {
    results = results.filter(p => p.integrations?.includes(criteria.integration));
  }
  
  if (criteria.keywords && criteria.keywords.length > 0) {
    const keywordSet = new Set(criteria.keywords.map(k => k.toLowerCase()));
    results = results.filter(p => 
      p.keywords?.some(k => keywordSet.has(k.toLowerCase()))
    );
  }
  
  if (criteria.modality) {
    results = results.filter(p => {
      const models = p.configuration?.schema?.agent?.models || [];
      return models.some(m => m.modalities?.includes(criteria.modality));
    });
  }
  
  if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
    const min = criteria.minPrice || 0;
    const max = criteria.maxPrice || Infinity;
    results = results.filter(p => {
      const price = p.configuration?.schema?.pricing?.initialCost || 0;
      return price >= min && price <= max;
    });
  }
  
  return results;
}

// Get all unique categories
export function getAllCategories() {
  return Array.from(pluginRegistry.byCategory.keys());
}

// Get all unique integrations
export function getAllIntegrations() {
  return Array.from(pluginRegistry.byIntegration.keys());
}

// Get all unique modalities
export function getAllModalities() {
  const modalities = new Set();
  pluginRegistry.chronological.forEach(plugin => {
    const models = plugin.configuration?.schema?.agent?.models || [];
    models.forEach(model => {
      model.modalities?.forEach(m => modalities.add(m));
    });
  });
  return Array.from(modalities);
}

// Get pricing info for all plugins
export function getPricingSummary() {
  return pluginRegistry.chronological.map(plugin => ({
    id: plugin.id,
    name: plugin.name,
    price: plugin.configuration?.schema?.pricing?.initialCost || 0,
    model: plugin.configuration?.schema?.pricing?.model || 'unknown',
    tier: plugin.configuration?.schema?.pricing?.subscriptionTier || 'unknown'
  }));
}

// Force refresh cache
export async function refreshPluginCache() {
  pluginRegistry.lastUpdated = null;
  return await getAvailablePlugins();
}

// Read cache state from file (for debugging/monitoring)
export async function readCacheState() {
  try {
    const { readFile } = await import('fs/promises');
    const cacheFilePath = join(__dirname, 'cacheState.json');
    const data = await readFile(cacheFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read cache state:', error);
    return null;
  }
}

// Get plugin stats
export function getPluginStats() {
  return {
    total: pluginRegistry.chronological.length,
    categories: getAllCategories().length,
    integrations: getAllIntegrations().length,
    modalities: getAllModalities().length,
    lastUpdated: pluginRegistry.lastUpdated,
    cacheExpiry: pluginRegistry.lastUpdated ? 
      new Date(pluginRegistry.lastUpdated + CACHE_DURATION) : null
  };
}