import React, { useState, useEffect } from 'react';
import { PluginLoader } from '../Components/plugins/PluginLoader';

export default function PluginsPage() {
  const [plugins, setPlugins] = useState([]);
  const [enabledPlugins, setEnabledPlugins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function loadPlugins() {
      try {
        // ✅ NOW FETCHING FROM API ROUTE - NO MORE DIRECT IMPORTS
        const response = await fetch('/api/plugins');
        const data = await response.json();
        
        setPlugins(data.plugins);
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Failed to load plugins:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPlugins();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/plugins?refresh=true');
      const data = await response.json();
      setPlugins(data.plugins);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to refresh plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlugins = selectedCategory === 'all' 
    ? plugins 
    : plugins.filter(plugin => 
        plugin.categories && plugin.categories.includes(selectedCategory)
      );

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Plugins</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Plugins & Integrations</h1>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Refresh Cache
        </button>
      </div>
      
      {/* Category Filter */}
      <div className="mb-6">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Available Plugins ({filteredPlugins.length})
        </h2>
        <div className="grid gap-4">
          {filteredPlugins.map(plugin => (
            <div key={plugin.id} className="flex items-center justify-between border p-4 rounded-lg">
              <div>
                <h3 className="font-medium">{plugin.name}</h3>
                <p className="text-sm text-gray-600">v{plugin.version}</p>
                <p className="text-sm text-gray-500">{plugin.description}</p>
                {plugin.categories && (
                  <div className="flex gap-1 mt-1">
                    {plugin.categories.map(cat => (
                      <span key={cat} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  if (enabledPlugins.includes(plugin.id)) {
                    setEnabledPlugins(enabledPlugins.filter(id => id !== plugin.id));
                  } else {
                    setEnabledPlugins([...enabledPlugins, plugin.id]);
                  }
                }}
                className={`px-4 py-2 rounded font-medium ${
                  enabledPlugins.includes(plugin.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {enabledPlugins.includes(plugin.id) ? 'Disable' : 'Enable'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {enabledPlugins.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Plugins</h2>
          <div className="space-y-6">
            {plugins
              .filter(plugin => enabledPlugins.includes(plugin.id))
              .map(plugin => (
                <PluginLoader
                  key={plugin.id}
                  manifest={plugin}
                  userConfig={{}}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}