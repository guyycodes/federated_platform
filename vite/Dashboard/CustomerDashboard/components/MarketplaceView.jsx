import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  alpha,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme } from '../../../Context/ThemeContext';
import { ShoppingCartComponents, useShoppingCart } from '../../../Context/ShoppingCart';
import PluginCard from '../../../Components/plugins/PluginCard';
import { usePlugins } from '../../../hooks/usePlugins';

const MarketplaceView = () => {
  const { theme, colors, glassmorphism, gradients } = useTheme();
  const isDark = theme === 'dark';
  const { addItem } = useShoppingCart();
  const { plugins, isLoading, error } = usePlugins();
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [visibleProducts, setVisibleProducts] = useState({});
  const [favorites, setFavorites] = useState([]);

  // Get unique categories from plugins
  const categories = ['all', ...new Set(plugins.map(p => p.category).filter(Boolean))];

  // Filter and sort plugins
  const filteredPlugins = plugins
    .filter(plugin => {
      const matchesSearch = plugin.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || plugin.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popular':
        default:
          return (b.reviews || 0) - (a.reviews || 0);
      }
    });

  // Toggle favorite
  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const cartItem = {
      id: product.id,
      name: product.title,
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      status: product.status,
      category: product.category,
      currency: product.currency,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      features: product.features,
      sizes: product.sizes,
      colors: product.colors,
      selectedSize: product?.sizes ? undefined : null,
      selectedColor: product?.colors ? undefined : null,
      quantity: 1
    };
    
    addItem(cartItem);
  };

  // Set all products as visible for simplicity
  useEffect(() => {
    const newVisibleProducts = {};
    plugins.forEach(plugin => {
      newVisibleProducts[plugin.id] = true;
    });
    setVisibleProducts(newVisibleProducts);
  }, [plugins]);

  // Color map for product variations
  const colorMap = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Navy': '#001F3F',
    'Gray': '#808080',
    'Blue': '#0066CC',
    'Red': '#DC143C',
    'Pink': '#FFB6C1',
    'Green': '#228B22',
    'Yellow': '#FFD700',
    'Brown': '#8B4513',
    'Charcoal': '#36454F',
    'Natural': '#F5E6D3',
    'Khaki': '#C3B091'
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="700">
          Plugin Marketplace
        </Typography>
        
        {/* Active Filters Count */}
        {(searchQuery || categoryFilter !== 'all') && (
          <Chip
            label={`${filteredPlugins.length} results`}
            size="small"
            sx={{
              background: alpha(colors.primary, 0.1),
              color: colors.primary,
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>

      {/* Search and Filters Bar */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 4,
          flexWrap: 'wrap',
          p: 2,
          ...glassmorphism.container,
          borderRadius: 2
        }}
      >
        {/* Search Field */}
        <TextField
          placeholder="Search plugins..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: colors.secondary }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            flex: 1,
            minWidth: 250,
            '& .MuiOutlinedInput-root': {
              ...glassmorphism.container
            }
          }}
        />

        {/* Category Filter */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={categoryFilter}
            label="Category"
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.glassWhite
              }
            }}
          >
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.glassWhite
              }
            }}
          >
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {isLoading && (
        <Typography variant="h6" align="center" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          Loading plugins...
        </Typography>
      )}

      {/* Error State */}
      {error && (
        <Typography variant="h6" align="center" sx={{ color: '#ff6b6b' }}>
          Error loading plugins: {error}
        </Typography>
      )}

      {/* Plugin Grid */}
      {!isLoading && !error && (
        <Grid container spacing={3}>
          {filteredPlugins.map((product, index) => (
            <Grid 
              key={product.id} 
              item 
              xs={12}
              sm={6}
              md={4}
              lg={3}
            >
              <PluginCard 
                product={product} 
                index={index} 
                visibleProducts={visibleProducts} 
                toggleFavorite={toggleFavorite} 
                favorites={favorites} 
                handleAddToCart={handleAddToCart} 
                colorMap={colorMap} 
                colors={colors} 
                gradients={gradients} 
                alpha={alpha} 
                setProductRef={() => {}} // Not needed for marketplace view
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredPlugins.length === 0 && (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            ...glassmorphism.card,
            borderRadius: 2
          }}
        >
          <FilterListIcon sx={{ fontSize: 64, color: alpha(colors.secondary, 0.3), mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No plugins found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your filters or search terms
          </Typography>
        </Box>
      )}

      {/* Shopping Cart Components */}
      <ShoppingCartComponents />
    </Box>
  );
};

export default MarketplaceView; 