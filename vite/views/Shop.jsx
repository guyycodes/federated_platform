import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Star, Bolt, Extension } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import HeaderBar from '../Components/ui/HeaderBar';
import Footer from '../Components/ui/Footer';
import ChatBot from '../Components/ui/ChatBot';
import PluginCard from '../Components/plugins/PluginCard';
import { useTheme } from '../Context/ThemeContext';
import { ShoppingCartComponents, useShoppingCart } from '../Context/ShoppingCart';
import { usePlugins } from '../hooks/usePlugins';

const Shop = () => {
  const [visibleProducts, setVisibleProducts] = useState({});
  const [favorites, setFavorites] = useState([]);
  const productRefs = useRef({});
  const { fonts, gradients, colors } = useTheme();
  const { addItem } = useShoppingCart();
  const { plugins, isLoading, error } = usePlugins();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Memoize color mapping to avoid recreating it on every render
  const colorMap = useMemo(() => ({
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
  }), []);

  // Memoized ref setter function
  const setProductRef = useCallback((productId, el) => {
    productRefs.current[productId] = el;
  }, []);

  // Intersection Observer for product animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const productId = entry.target.getAttribute('data-product-id');
          if (entry.isIntersecting && productId) {
            setVisibleProducts((prev) => ({
              ...prev,
              [productId]: true
            }));
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Small delay to ensure refs are set
    const timeoutId = setTimeout(() => {
      Object.values(productRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref);
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      Object.values(productRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [plugins]);

  // Memoize toggleFavorite function with useCallback
  const toggleFavorite = useCallback((productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }, []);

  // Handle add to cart - memoized with useCallback
  const handleAddToCart = useCallback((product) => {
    // Convert the product to match cart item format
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
  }, [addItem]);

  return (
    <>
      <HeaderBar />

      {/* Animated Background Effects */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -2,
          background: gradients.darkGlass,
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient orbs */}
        <Box
          sx={{
            position: 'absolute',
            top: -96,
            right: -96,
            width: 192,
            height: 192,
            background: gradients.primaryGradient,
            borderRadius: '50%',
            opacity: 0.3,
            filter: 'blur(60px)',
            animation: 'pulse 4s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.3 },
              '50%': { transform: 'scale(1.2)', opacity: 0.5 },
            },
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '30%',
            left: -48,
            width: 128,
            height: 128,
            background: gradients.accentGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(40px)',
            animation: 'pulse 6s ease-in-out infinite',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 96,
            right: '20%',
            width: 160,
            height: 160,
            background: gradients.multiGradient,
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(50px)',
            animation: 'pulse 8s ease-in-out infinite',
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          color: '#ffffff',
          py: 8,
          position: 'relative',
          backgroundImage: `${gradients.heroOverlay}, url("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced gradient overlay for glassmorphism effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${alpha(colors.background, 0.3)}, ${alpha(colors.surface, 0.2)})`,
            backdropFilter: 'blur(2px)',
            zIndex: 1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Star sx={{ fontSize: 28, color: colors.primary }} />
            <Typography 
              variant="h2" 
              component="h1" 
              fontWeight="bold" 
              sx={{
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                filter: 'drop-shadow(0 2px 4px rgba(246, 81, 30, 0.5))',
              }}
            >
              Plugin Marketplace
            </Typography>
            <Star sx={{ fontSize: 28, color: colors.accent }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              maxWidth: { md: '70%' },
              mb: 4,
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 8px rgba(0,0,0,0.6)',
              fontWeight: 500,
              fontFamily: fonts.body,
            }}
          >
            Discover powerful plugins to enhance your platform and workflow.
          </Typography>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" sx={{ color: colors.accent }} />}
            aria-label="breadcrumb"
            sx={{
              color: '#ffffff',
              '& a': { 
                color: 'rgba(255,255,255,0.8)',
                textDecoration: 'none',
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                '&:hover': { 
                  color: colors.accent,
                  textShadow: `0 0 10px ${colors.accent}`,
                  transform: 'translateY(-1px)',
                }
              },
              '& .MuiBreadcrumbs-separator': {
                filter: `drop-shadow(0 0 5px ${colors.accent})`,
              }
            }}
          >
            <Link component={RouterLink} to="/">
              Home
            </Link>
            <Typography color="#ffffff" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              Shop
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Product Cards Section */}
      <Box 
        sx={{ 
          py: 8, 
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="lg">
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
            <Grid container spacing={4}>
              {plugins.map((product, index) => (
                <Grid 
                  key={product.id} 
                  item 
                  xs={12}
                  sm={6}
                  md={4}
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
                    setProductRef={setProductRef} 
                  />
                </Grid>
              ))}
            </Grid>
          )}

          {/* Plugin Marketplace Link */}
          <Box sx={{ mt: 8, textAlign: 'center', position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <Star sx={{ fontSize: 20, color: colors.accent }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'rgba(255,255,255,0.8)',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Need help integrating plugins?
              </Typography>
              <Star sx={{ fontSize: 20, color: colors.primary }} />
            </Box>
            
            <Link 
              href="/contact"
              component={RouterLink}
              sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                px: 4,
                py: 2,
                borderRadius: 3,
                background: alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(20px)',
                color: '#ffffff',
                textDecoration: 'none',
                border: `2px solid ${alpha(colors.primary, 0.3)}`,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: alpha(colors.glassWhite, 0.2),
                  transform: 'translateY(-4px) scale(1.02)',
                  boxShadow: `0 12px 40px ${alpha(colors.primary, 0.4)}`,
                  border: `2px solid ${alpha(colors.primary, 0.6)}`,
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: gradients.shimmerGradient,
                  transition: 'left 0.6s',
                },
                '&:hover::before': {
                  left: '100%',
                },
              }}
            >
              <Extension sx={{ fontSize: 32, color: colors.primary }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bolt sx={{ fontSize: 20, color: colors.accent }} />
                <Typography variant="body1" fontWeight="bold" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  Contact Our Integration Team
                </Typography>
                <Bolt sx={{ fontSize: 20, color: colors.primary }} />
              </Box>
            </Link>
          </Box>
        </Container>
      </Box>

      <Footer />
      <ChatBot />
      
      {/* Shopping Cart Components */}
      <ShoppingCartComponents />
    </>
  );
};

export default Shop;
