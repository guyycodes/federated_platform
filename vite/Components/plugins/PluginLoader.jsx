import React, { useState, useEffect } from 'react';
import { loadPlugin } from '../../lib/pluginLoader';  // 👈 Import the function
import { usePlugins } from '../../hooks/usePlugins';


export function PluginLoader({ manifest, userConfig }) {
  const [PluginComponent, setPluginComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPluginComponent() {
      try {
        setLoading(true);
        setError(null);
        
        const module = await loadPlugin(manifest);  // 👈 HERE - This calls the dynamic loading
        const Component = module.default || module.PluginApp;
        
        if (!Component) {
          throw new Error(`Component not found in module`);
        }
        
        setPluginComponent(() => Component);
      } catch (err) {
        console.error(`Failed to load plugin ${manifest.id}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPluginComponent();
  }, [manifest]);

  if (loading) {
    return (
      <div className="plugin-loading p-4 border rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="plugin-error p-4 border border-red-300 rounded-lg bg-red-50">
        <h3 className="font-semibold text-red-800">{manifest.name}</h3>
        <p className="text-red-600">Failed to load: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!PluginComponent) {
    return (
      <div className="plugin-empty p-4 border rounded-lg">
        <h3 className="font-semibold">{manifest.name}</h3>
        <p className="text-gray-600">Plugin component not available</p>
      </div>
    );
  }

  return (
    <div className="plugin-wrapper border rounded-lg overflow-hidden">
      <div className="plugin-header bg-gray-50 px-4 py-2 border-b">
        <h3 className="font-semibold">{manifest.name}</h3>
        <p className="text-sm text-gray-600">v{manifest.version}</p>
      </div>
      <div className="plugin-content p-4">
        <PluginComponent config={userConfig} />
      </div>
    </div>
  );
}