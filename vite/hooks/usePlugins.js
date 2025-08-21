import { useState, useEffect, useCallback } from 'react';


export function usePlugins() {
  const [plugins, setPlugins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [modalities, setModalities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all plugins (with pagination support)
  const fetchPlugins = useCallback(async (page = 1, limit = 100) => {
    // fetches plugins for the shopping cart
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/plugins?page=${page}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch plugins');
      
      const data = await response.json();
      
      // Transform plugins to include product-like fields for the shopping cart
      const transformedPlugins = data.plugins.map(plugin => ({
        // Core product fields expected by shopping cart
        id: plugin.id,
        title: plugin.name,
        name: plugin.name,
        description: plugin.description,
        price: (plugin.configuration?.schema?.pricing?.initialCost || 0) * 100, // Convert to cents
        currency: plugin.configuration?.schema?.pricing?.currency || 'USD',
        image: plugin.ui?.appIcons?.large || '/images/products/default-plugin.png',
        status: 'In Stock',
        live: true, // Make all plugins purchasable
        
        // Additional plugin-specific data
        version: plugin.version,
        categories: plugin.categories || [],
        integrations: plugin.integrations || [],
        keywords: plugin.keywords || [],
        modalities: plugin.configuration?.schema?.modalities || [],
        
        // Features from plugin configuration
        features: [
          ...(plugin.categories || []).slice(0, 2).map(cat => `${cat} support`),
          ...(plugin.integrations || []).slice(0, 2).map(int => `${int} integration`)
        ].filter(Boolean),
        
        // Mock data for shopping cart compatibility
        rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5
        reviews: Math.floor(Math.random() * 100) + 10, // Random reviews 10-110
        
        // Screenshots for potential gallery
        screenshots: plugin.ui?.screenshots || [],
        
        // Icon for small displays
        icon: plugin.ui?.appIcons?.small || plugin.ui?.appIcons?.large,
        
        // Badge based on categories
        badge: plugin.categories?.includes('analytics') ? 'Analytics' :
               plugin.categories?.includes('automation') ? 'Automation' :
               plugin.categories?.includes('e-commerce') ? 'E-Commerce' :
               plugin.integrations?.length > 3 ? 'Popular' : null,
      }));
      
      setPlugins(transformedPlugins);
      setCategories(data.categories || []);
      setIntegrations(data.integrations || []);
      setModalities(data.modalities || []);
      
      return {
        plugins: transformedPlugins,
        total: data.total,
        page: data.page,
        limit: data.limit,
        hasMore: data.page * data.limit < data.total
      };
    } catch (err) {
      setError(err.message);
      console.error('Error fetching plugins:', err);
      return {
        plugins: [],
        total: 0,
        page: 1,
        limit: limit,
        hasMore: false
      };
    } finally {
      setIsLoading(false);
    }
  }, []);
////////////////////////////////////////////////////////////
/////Fetch User Plugins//////////////////////////////////////
  const fetchUserPlugins = useCallback(async (userId) => {
    try {
      console.log('fetchUserPlugins called with userId:', userId);
      if(!userId) {
        throw new Error('User ID is required to fetch user plugins');
      }
      
      const response = await fetch('/api/users/current/plugins', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch plugins');
      }

      const { plugins } = await response.json();
      return plugins;
    } catch (err) {
      console.error('Error fetching plugins:', err);
      throw err;
    }
  }, []);

  // Filter plugins by category
  // const filterByCategory = useCallback((category) => {
  //   return plugins.filter(plugin => 
  //     plugin.categories.includes(category)
  //   );
  // }, [plugins]);

  // Filter plugins by integration
  // const filterByIntegration = useCallback((integration) => {
  //   return plugins.filter(plugin => 
  //     plugin.integrations.includes(integration)
  //   );
  // }, [plugins]);

  // Filter plugins by price range
  // const filterByPriceRange = useCallback((minPrice, maxPrice) => {
  //   return plugins.filter(plugin => {
  //     const price = plugin.price / 100; // Convert back to dollars
  //     return price >= minPrice && price <= maxPrice;
  //   });
  // }, [plugins]);

  // Search plugins by name or description
  const searchPlugins = useCallback((query) => {
    const lowercaseQuery = query.toLowerCase();
    return plugins.filter(plugin => 
      plugin.name.toLowerCase().includes(lowercaseQuery) ||
      plugin.description?.toLowerCase().includes(lowercaseQuery) ||
      plugin.keywords?.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
    );
  }, [plugins]);

  // Sort plugins
  const sortPlugins = useCallback((sortBy = 'name') => {
    const sorted = [...plugins];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'popular':
        return sorted.sort((a, b) => b.reviews - a.reviews);
      default:
        return sorted;
    }
  }, [plugins]);

  // Get plugin by ID
  const getPluginById = useCallback((id) => {
    return plugins.find(plugin => plugin.id === id);
  }, [plugins]);

  // Refresh plugins from cache
  const refreshPlugins = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/plugins?refresh=true');
      if (!response.ok) throw new Error('Failed to refresh plugins');
      
      // Fetch the updated list
      return fetchPlugins();
    } catch (err) {
      setError(err.message);
      console.error('Error refreshing plugins:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPlugins]);

  // Create a new plugin
  const createNewPlugin = useCallback(async (pluginData) => {
    try {
      console.log('createNewPlugin called with:', pluginData);
      
      const response = await fetch('/api/users/current/plugins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'create',
          ...pluginData
        })
      });
      
      console.log('POST response status:', response.status);
      
      const result = await response.json();
      console.log('Plugin created successfully:', result);
      return result;
    } catch (err) {
      console.error('Error creating plugin:', err);
      throw err;
    }
  }, []);

  const deletePlugin = useCallback(async (pluginId, userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required to delete plugin');
      }
      
      const response = await fetch(`/api/plugins/${pluginId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`
        }
      });


      const result = await response.json();
      console.log('result: ', result);
      // Remove the plugin from local state
      setPlugins(prevPlugins => prevPlugins.filter(p => p.id !== pluginId));
      
      return result;
    } catch (error) {
      console.error('Error deleting plugin:', error);
      throw error;
    }
  }, []);

  const updatePlugin = useCallback(async (pluginId, pluginData, userId) => {
    try {
      // Validate inputs
      if (!pluginId) {
        throw new Error('Plugin ID is required to update plugin');
      }
      
      // userId is optional - if not provided, rely on session cookies
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (userId) {
        headers['Authorization'] = `Bearer ${userId}`;
      }
      
      const response = await fetch(`/api/plugins/${pluginId}`, {
        method: 'PUT',
        headers,
        credentials: 'include', // Include cookies for session auth
        body: JSON.stringify(pluginData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to update plugin: ${response.status}`);
      }

      const result = await response.json();
      console.log('Plugin updated successfully:', result);
      
      // Update local state with the updated plugin
      // setPlugins(prevPlugins => 
      //   prevPlugins.map(p => 
      //     p.id === pluginId 
      //       ? { ...p, ...pluginData } // Merge the updates
      //       : p
      //   )
      // );
      
      return result;
    } catch (error) {
      console.error('Error updating plugin:', error);
      throw error;
    }
  }, []);

  // Fetch plugins on mount
  // useEffect(() => {
  //   fetchPlugins();
  // }, [fetchPlugins]);

  return {
    // State
    plugins,
    categories,
    integrations,
    modalities,
    isLoading,
    error,
    
    // Actions
    fetchPlugins,
    // filterByCategory,
    // filterByIntegration,
    // filterByPriceRange,
    searchPlugins,
    sortPlugins,
    getPluginById,
    refreshPlugins,
    createNewPlugin,
    fetchUserPlugins,
    deletePlugin,
    updatePlugin,
  };
} 