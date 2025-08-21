#!/usr/bin/env node

// Test script for plugin registry
// Run with: node scripts/testPluginRegistry.js

async function testPluginRegistry() {
  const baseUrl = 'http://localhost:3000/api/plugins';
  
  console.log('🧪 Testing Plugin Registry API...\n');

  try {
    // Test 1: Get all plugins
    console.log('1️⃣ Fetching all plugins...');
    const allPlugins = await fetch(baseUrl).then(r => r.json());
    console.log(`✅ Found ${allPlugins.plugins.length} plugins`);
    console.log(`   Categories: ${allPlugins.categories.join(', ')}`);
    console.log(`   Integrations: ${allPlugins.integrations.join(', ')}\n`);

    // Test 2: Get metadata
    console.log('2️⃣ Fetching metadata...');
    const metadata = await fetch(`${baseUrl}?metadata=true`).then(r => r.json());
    console.log(`✅ Metadata loaded`);
    console.log(`   Modalities: ${metadata.modalities.join(', ')}\n`);

    // Test 3: Filter by category
    console.log('3️⃣ Testing category filter...');
    const categoryPlugins = await fetch(`${baseUrl}?category=analytics`).then(r => r.json());
    console.log(`✅ Found ${categoryPlugins.plugins.length} analytics plugins\n`);

    // Test 4: Filter by price
    console.log('4️⃣ Testing price filter...');
    const pricePlugins = await fetch(`${baseUrl}?minPrice=0&maxPrice=5`).then(r => r.json());
    console.log(`✅ Found ${pricePlugins.plugins.length} plugins under $5\n`);

    // Test 5: Get single plugin details
    if (allPlugins.plugins.length > 0) {
      const testPlugin = allPlugins.plugins[0];
      console.log(`5️⃣ Testing single plugin lookup (${testPlugin.name})...`);
      const singlePlugin = await fetch(`${baseUrl}?id=${testPlugin.id}`).then(r => r.json());
      console.log(`✅ Plugin details loaded`);
      console.log(`   Name: ${singlePlugin.plugin.name}`);
      console.log(`   Remote Entry (prod): ${singlePlugin.remoteEntry.production}`);
      console.log(`   Icons: ${JSON.stringify(singlePlugin.icons)}\n`);
    }

    // Test 6: Search by name
    console.log('6️⃣ Testing name search...');
    const nameSearch = await fetch(`${baseUrl}?filterName=agent`).then(r => r.json());
    console.log(`✅ Found ${nameSearch.plugins.length} plugins matching "agent"\n`);

    // Test 7: Multiple filters
    console.log('7️⃣ Testing multiple filters...');
    const multiFilter = await fetch(`${baseUrl}?category=analytics&integration=shopify`).then(r => r.json());
    console.log(`✅ Found ${multiFilter.plugins.length} analytics plugins with Shopify integration\n`);

    // Test 8: Pagination
    console.log('8️⃣ Testing pagination...');
    const page1 = await fetch(`${baseUrl}?page=1&limit=5`).then(r => r.json());
    console.log(`✅ Page 1: ${page1.plugins.length} plugins`);
    console.log(`   Total pages: ${page1.pagination.totalPages}\n`);

    // Test 9: POST endpoint
    if (allPlugins.plugins.length > 0) {
      const testPlugin = allPlugins.plugins[0];
      console.log('9️⃣ Testing POST endpoint...');
      const postResponse = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pluginId: testPlugin.id,
          fields: ['description', 'configuration', 'screenshots']
        })
      }).then(r => r.json());
      console.log(`✅ POST response received`);
      console.log(`   Description: ${postResponse.description}`);
      console.log(`   Screenshots: ${postResponse.screenshots?.length || 0} images\n`);
    }

    // Test 10: Stats
    console.log('🔟 Getting plugin stats...');
    const stats = await fetch(`${baseUrl}?stats=true`).then(r => r.json());
    console.log(`✅ Stats loaded`);
    console.log(`   Total plugins: ${stats.stats.total}`);
    console.log(`   Last updated: ${new Date(stats.stats.lastUpdated).toLocaleString()}`);
    console.log(`   Cache expires: ${new Date(stats.stats.cacheExpiry).toLocaleString()}\n`);

    console.log('✅ All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testPluginRegistry(); 