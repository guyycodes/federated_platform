// Client-side Module Federation

const pluginCache = new Map();

export async function loadPlugin(manifest) {
  if (typeof window === 'undefined') {
    throw new Error('loadPlugin can only be called on the client side');
  }

  if (pluginCache.has(manifest.id)) {
    return pluginCache.get(manifest.id);
  }

  try {
    // 🔥 THIS IS WHERE THE DYNAMIC SCRIPT LOADING HAPPENS:
    const script = document.createElement('script');
    script.src = manifest.ui.remoteEntry; // e.g., https://<your cdn etc..>/remoteEntry.js
    script.type = 'text/javascript';
    script.async = true;
    
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${manifest.ui.remoteEntry}`));
      document.head.appendChild(script); // 👈 Inject the script
    });

    // Get the remote container
    const containerName = manifest.id.replace(/[^a-zA-Z0-9]/g, '');
    const container = window[containerName];  // 👈 Access the global container
    
    if (!container) {
      throw new Error(`Container ${containerName} not found`);
    }


    // // For Vite, you might need different shared scope handling
    // Since you're using Vite (not Webpack), this might not work as expected.
    // Vite-compatible version:
    // await container.init({
    //   // Vite's module sharing might work differently
    //   // You may need to configure this based on your Vite setup
    // });
    
    // Initialize the container
    if (container.init) {
      await container.init(window.__webpack_share_scopes__?.default || {});
    }
    
    // Get the exposed module
    const factory = await container.get(manifest.ui.expose.replace('./', ''));  // 👈 Get './PluginApp'
    const Module = factory();
    
    pluginCache.set(manifest.id, Module);
    return Module;
    
  } catch (error) {
    console.error(`Failed to load plugin ${manifest.id}:`, error);
    throw error;
  }
}