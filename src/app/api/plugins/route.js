//  THese routes are for the PLUGIN REGISTRY
import { NextResponse } from 'next/server';
import { 
  getAvailablePlugins, 
  getPluginById,
  getIdByName,
  filterByName,
  filterByPrice,
  filterByKeywords,
  filterByCategory,
  filterByModality,
  filterByIntegration,
  filterPlugins,
  getAllCategories,
  getAllIntegrations,
  getAllModalities,
  getPricingSummary,
  getPluginStats,
  refreshPluginCache,
  readCacheState,
  getRemoteEntryProduction,
  getRemoteEntryStaging,
  getAppIcons,
  getScreenshots,
  getManifestUrl,
  getDescription,
  getConfiguration
} from '../lib/pluginRegistry';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check for cache refresh request
    if (searchParams.get('refresh') === 'true') {
      await refreshPluginCache();
    }

    // Get cache state (for debugging)
    if (searchParams.get('cacheState') === 'true') {
      const cacheState = await readCacheState();
      return NextResponse.json({ cacheState });
    }

    // Single plugin lookup by ID
    const id = searchParams.get('id');
    if (id) {
      const plugin = getPluginById(id);
      if (!plugin) {
        return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
      }
      
      // Return comprehensive plugin data
      return NextResponse.json({ 
        plugin,
        remoteEntry: {
          production: getRemoteEntryProduction(id),
          staging: getRemoteEntryStaging(id)
        },
        icons: getAppIcons(id),
        screenshots: getScreenshots(id),
        manifestUrl: getManifestUrl(id)
      });
    }

    // Lookup plugin by name
    const name = searchParams.get('name');
    if (name) {
      const pluginId = getIdByName(name);
      if (!pluginId) {
        return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
      }
      const plugin = getPluginById(pluginId);
      return NextResponse.json({ plugin });
    }

    // Get plugin stats
    if (searchParams.get('stats') === 'true') {
      const stats = getPluginStats();
      return NextResponse.json({ stats });
    }

    // Get pricing summary
    if (searchParams.get('pricing') === 'true') {
      const pricing = getPricingSummary();
      return NextResponse.json({ pricing });
    }

    // Get all categories/integrations/modalities
    if (searchParams.get('metadata') === 'true') {
      return NextResponse.json({
        categories: getAllCategories(),
        integrations: getAllIntegrations(),
        modalities: getAllModalities()
      });
    }

    // Advanced filtering with multiple criteria
    const filterCriteria = {};
    
    // Parse filter parameters
    if (searchParams.has('filterName')) {
      filterCriteria.name = searchParams.get('filterName');
    }
    
    if (searchParams.has('category')) {
      filterCriteria.category = searchParams.get('category');
    }
    
    if (searchParams.has('integration')) {
      filterCriteria.integration = searchParams.get('integration');
    }
    
    if (searchParams.has('modality')) {
      filterCriteria.modality = searchParams.get('modality');
    }
    
    if (searchParams.has('keywords')) {
      filterCriteria.keywords = searchParams.get('keywords').split(',');
    }
    
    if (searchParams.has('minPrice')) {
      filterCriteria.minPrice = parseFloat(searchParams.get('minPrice'));
    }
    
    if (searchParams.has('maxPrice')) {
      filterCriteria.maxPrice = parseFloat(searchParams.get('maxPrice'));
    }

    // Apply filtering if criteria exist
    let plugins;
    if (Object.keys(filterCriteria).length > 0) {
      plugins = filterPlugins(filterCriteria);
    } else {
      // No filters, return all plugins
      plugins = await getAvailablePlugins();
    }

    // Apply sorting if requested
    const sortBy = searchParams.get('sortBy');
    if (sortBy === 'name') {
      plugins.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      plugins.sort((a, b) => {
        const priceA = a.configuration?.schema?.pricing?.initialCost || 0;
        const priceB = b.configuration?.schema?.pricing?.initialCost || 0;
        return priceA - priceB;
      });
    } else if (sortBy === 'updated') {
      plugins.sort((a, b) => {
        const dateA = new Date(a.lastUpdated || 0);
        const dateB = new Date(b.lastUpdated || 0);
        return dateB - dateA;
      });
    }

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPlugins = plugins.slice(startIndex, endIndex);

    return NextResponse.json({ 
      plugins: paginatedPlugins,
      pagination: {
        page,
        limit,
        total: plugins.length,
        totalPages: Math.ceil(plugins.length / limit)
      },
      filters: filterCriteria,
      categories: getAllCategories(),
      integrations: getAllIntegrations(),
      modalities: getAllModalities()
    });
    
  } catch (error) {
    console.error('Plugin API error:', error);
    return NextResponse.json(
      { error: 'Failed to load plugins', details: error.message }, 
      { status: 500 }
    );
  }
}
////////////////////////////////////////////////////////////
// POST endpoint for getting specific plugin details
export async function POST(request) {
  try {
    const body = await request.json();
    const { pluginId, fields = [] } = body;

    if (!pluginId) {
      return NextResponse.json({ error: 'Plugin ID required' }, { status: 400 });
    }

    const plugin = getPluginById(pluginId);
    if (!plugin) {
      return NextResponse.json({ error: 'Plugin not found' }, { status: 404 });
    }

    // Build response with requested fields
    const response = { id: pluginId };

    fields.forEach(field => {
      switch(field) {
        case 'remoteEntryProduction':
          response.remoteEntryProduction = getRemoteEntryProduction(pluginId);
          break;
        case 'remoteEntryStaging':
          response.remoteEntryStaging = getRemoteEntryStaging(pluginId);
          break;
        case 'icons':
          response.icons = getAppIcons(pluginId);
          break;
        case 'screenshots':
          response.screenshots = getScreenshots(pluginId);
          break;
        case 'manifestUrl':
          response.manifestUrl = getManifestUrl(pluginId);
          break;
        case 'description':
          response.description = getDescription(pluginId);
          break;
        case 'configuration':
          response.configuration = getConfiguration(pluginId);
          break;
        case 'full':
          response.plugin = plugin;
          break;
      }
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('Plugin detail API error:', error);
    return NextResponse.json(
      { error: 'Failed to get plugin details', details: error.message }, 
      { status: 500 }
    );
  }
}