import React, { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Badge,
  Button,
  LinearProgress,
  Divider,
  Alert,
  alpha,
  Zoom,
  Slide,
  Chip,
  Grid,
  Rating,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  Collapse,
  Snackbar,
  Popover,
} from '@mui/material';
import {
  ShoppingCart,
  Close,
  Add,
  Remove,
  Delete,
  LocalShipping,
  TrendingUp,
  Star,
  Bolt,
  BookmarkBorder,
  Bookmark,
  CheckCircle,
  Info,
  LocalOffer,
  ArrowForward,
  ShoppingBag,
  ExpandMore,
  ZoomIn,
} from '@mui/icons-material';
import recommendedProducts from '../assets/cart/recommendedProducts';
import cartConfig from '../assets/cart/cartConfig';
import { useTheme } from './ThemeContext';

// Create the shopping cart context
const ShoppingCartContext = createContext();

// Hook to use the shopping cart context
export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error('useShoppingCart must be used within a ShoppingCartProvider');
  }
  return context;
};

// Shopping Cart Provider Component
export const ShoppingCartProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [removingItem, setRemovingItem] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false); // Default to closed
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [descriptionAnchorEl, setDescriptionAnchorEl] = useState(null);
  const [selectedDescriptionItem, setSelectedDescriptionItem] = useState(null);
  const [imageAnchorEl, setImageAnchorEl] = useState(null);
  const [selectedImageItem, setSelectedImageItem] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  

  const { colors, gradients, glassmorphism } = useTheme();

  // Ref to track scroll container
  const scrollContainerRef = useRef(null);

  // Functions to handle popover opening without scrolling
  const openDescriptionPopover = useCallback((event, item) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Preserve current scroll position
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    const virtualEl = {
      nodeType: 1,
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: event.clientY,
        right: event.clientX,
        bottom: event.clientY,
        left: event.clientX,
        x: event.clientX,
        y: event.clientY,
        toJSON: () => {}
      })
    };
    
    setDescriptionAnchorEl(virtualEl);
    setSelectedDescriptionItem(item);
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  const openImagePopover = useCallback((event, item) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Preserve current scroll position
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    const virtualEl = {
      nodeType: 1,
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        top: event.clientY,
        right: event.clientX,
        bottom: event.clientY,
        left: event.clientX,
        x: event.clientX,
        y: event.clientY,
        toJSON: () => {}
      })
    };
    
    setImageAnchorEl(virtualEl);
    setSelectedImageItem(item);
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (cartConfig.behavior.persistCart) {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          const expiryDate = new Date(parsedCart.expiry);
          if (expiryDate > new Date()) {
            setCartItems(parsedCart.items);
            setSavedItems(parsedCart.savedItems || []);
          }
        } catch (error) {
          console.error('Error loading cart:', error);
        }
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartConfig.behavior.persistCart) {
      if (cartItems.length > 0 || savedItems.length > 0) {
        // Save cart data if there are items
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + cartConfig.behavior.cartExpiry);
        
        const cartData = {
          items: cartItems,
          savedItems: savedItems,
          expiry: expiryDate.toISOString()
        };
        
        localStorage.setItem('shoppingCart', JSON.stringify(cartData));
      } else {
        // Clear localStorage if cart and saved items are both empty
        localStorage.removeItem('shoppingCart');
      }
    }
  }, [cartItems, savedItems]);

  // Memoize cart calculations for performance
  const cartCalculations = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const memberDiscount = cartConfig.promotions.enabled ? subtotal * 0.05 : 0;
    const bundleDiscount = (cartConfig.promotions.enabled && itemCount >= 2) ? subtotal * 0.10 : 0;
    const totalDiscounts = memberDiscount + bundleDiscount;
    const discountedSubtotal = subtotal - totalDiscounts;
    const tax = discountedSubtotal * cartConfig.tax.rate;
    const shipping = discountedSubtotal >= cartConfig.shipping.freeShippingThreshold 
      ? 0 
      : cartConfig.shipping.standardShippingCost;
    const total = discountedSubtotal + tax + shipping;
    const savings = (discountedSubtotal >= cartConfig.shipping.freeShippingThreshold 
      ? cartConfig.shipping.standardShippingCost 
      : 0) + totalDiscounts;
    const freeShippingProgress = Math.min((discountedSubtotal / cartConfig.shipping.freeShippingThreshold) * 100, 100);
    const amountToFreeShipping = Math.max(cartConfig.shipping.freeShippingThreshold - discountedSubtotal, 0);

    return {
      itemCount,
      subtotal,
      memberDiscount,
      bundleDiscount,
      totalDiscounts,
      discountedSubtotal,
      tax,
      shipping,
      total,
      savings,
      freeShippingProgress,
      amountToFreeShipping
    };
  }, [cartItems]);

  // Destructure memoized calculations
  const {
    itemCount,
    subtotal,
    memberDiscount,
    bundleDiscount,
    totalDiscounts,
    discountedSubtotal,
    tax,
    shipping,
    total,
    savings,
    freeShippingProgress,
    amountToFreeShipping
  } = cartCalculations;

  // Get recommended products based on cart items - memoized for performance
  const getRecommendedProducts = useMemo(() => {
    const cartCategories = cartItems.map(item => item.category).filter(Boolean);
    const uniqueCategories = [...new Set(cartCategories)];
    
    let recommendedIds = [];
    if (uniqueCategories.length > 0) {
      uniqueCategories.forEach(category => {
        const categoryRecs = recommendedProducts.categoryRecommendations[category] || [];
        recommendedIds = [...recommendedIds, ...categoryRecs];
      });
    } else {
      recommendedIds = recommendedProducts.categoryRecommendations.default;
    }
    
    // Remove duplicates and items already in cart
    const cartItemIds = cartItems.map(item => item.id);
    recommendedIds = [...new Set(recommendedIds)].filter(id => !cartItemIds.includes(id));
    
    // Get product details and limit to maxDisplay
    return recommendedIds
      .map(id => recommendedProducts.products.find(p => p.id === id))
      .filter(Boolean)
      .slice(0, recommendedProducts.settings.maxDisplay);
  }, [cartItems]);

  // Cart actions - memoized with useCallback
  const updateQuantity = useCallback((id, change) => {
    // Preserve current scroll position before updating
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { 
              ...item, 
              quantity: Math.max(1, Math.min(item.quantity + change, cartConfig.behavior.maxQuantityPerItem)) 
            }
          : item
      )
    );
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  const updateItemAttribute = useCallback((id, attribute, value) => {
    // Preserve scroll position before updating
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, [attribute]: value }
          : item
      )
    );
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  const removeItem = useCallback((id) => {
    // Preserve current scroll position right before removal (like saveForLater)
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    setRemovingItem(id);

    setCartItems(items => items.filter(item => item.id !== id));
    setRemovingItem(null);
    // Temporarily disable notification to prevent re-render issues
    // setNotification({ open: true, message: 'Item removed from cart', severity: 'success' });
    
    // Restore scroll position after all state updates complete
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  const addItem = useCallback((item) => {
    // Preserve current scroll position before adding item
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    setCartItems(items => {
      const existingItem = items.find(i => i.id === item.id);
      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = Math.min(
          existingItem.quantity + (item.quantity || 1), 
          cartConfig.behavior.maxQuantityPerItem
        );

        return items.map(i =>
          i.id === item.id
            ? { ...i, quantity: newQuantity }
            : i
        );
      }

      return [...items, { ...item, quantity: item.quantity || 1 }];
    });
    
    // Restore scroll position after state update
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  const saveForLater = useCallback((id) => {
    // Preserve current scroll position before starting state updates
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    const item = cartItems.find(i => i.id === id);
    if (item) {
      setSavedItems(prev => [...prev, item]);
      
      console.log('🗑️ Setting removing state');
      // Set removing state and schedule removal (matching removeItem logic)
      setRemovingItem(id);
      setCartItems(items => items.filter(item => item.id !== id));
      setRemovingItem(null);
      // Restore scroll position after all state updates complete
      requestAnimationFrame(() => {
        console.log('📜 Restoring scroll position');
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollTop;
        }
    });
  }
  }, [cartItems]);

  const moveToCart = useCallback((id) => {
    // Preserve current scroll position before starting state updates
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    const item = savedItems.find(i => i.id === id);
    if (item) {
      addItem(item);
      setSavedItems(prev => prev.filter(i => i.id !== id));
      
      // Restore scroll position after state updates complete
      requestAnimationFrame(() => {
        console.log('📜 Restoring scroll position for moveToCart');
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollTop;
        }
      });
    }
  }, [savedItems, addItem]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('shoppingCart');
    setNotification({ open: true, message: 'Cart cleared', severity: 'success' });
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Cart Button Component - positioned in top right
  const FloatingCartButton = () => (
    <Zoom in={true} timeout={1000}>
      <Box
        onClick={openCart}
        sx={{
          position: 'fixed',
          top: '9%',
          right: 20,
          zIndex: 1000,
          background: gradients.multiGradient,
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: `0 8px 32px ${alpha(colors.primary, 0.3)}`,
          border: `3px solid ${alpha('#ffffff', 0.2)}`,
          backdropFilter: 'blur(10px)',
          '&:hover': {
            background: gradients.glowGradient,
            transform: 'scale(1.1)',
            boxShadow: `0 12px 40px ${alpha(colors.primary, 0.5)}`,
            border: `3px solid ${alpha('#ffffff', 0.4)}`,
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Badge
          badgeContent={itemCount}
          sx={{
            '& .MuiBadge-badge': {
              background: gradients.primaryGradient,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              border: '2px solid white',
              animation: itemCount > 0 ? 'bounce 2s infinite' : 'none',
              '@keyframes bounce': {
                '0%, 20%, 50%, 80%, 100%': {
                  transform: 'translateY(0)',
                },
                '40%': {
                  transform: 'translateY(-8px)',
                },
                '60%': {
                  transform: 'translateY(-4px)',
                },
              },
            }
          }}
        >
          <ShoppingCart 
            sx={{ 
              color: 'white', 
              fontSize: 28,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }} 
          />
        </Badge>
      </Box>
    </Zoom>
  );

  // Product Recommendation Card Component - memoized for performance
  const RecommendationCard = React.memo(({ product, index }) => (
    <Slide direction="up" in={true} timeout={500 + index * 100}>
      <Card
        sx={{
          height: '100%',
          ...glassmorphism.card,
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 24px ${alpha(colors.primary, 0.2)}`,
            border: `1px solid ${alpha(colors.primary, 0.3)}`,
          }
        }}
      >
          {product.badge && (
            <Chip
              label={product.badge}
              size="small"
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                zIndex: 1,
                background: gradients.primaryGradient,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                height: 20,
                boxShadow: `0 2px 8px ${alpha(colors.primary, 0.3)}`,
              }}
            />
          )}
          
          <CardMedia
            component="img"
            height="120"
            image={product.image}
            alt={product.title}
            sx={{ objectFit: 'cover' }}
          />
          
          <CardContent sx={{ p: 1.5 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: '0.85rem',
              }}
            >
              {product.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
              <Rating 
                value={product.rating} 
                size="small" 
                readOnly 
                precision={0.1}
                sx={{ 
                  color: colors.primary,
                  fontSize: '0.9rem' 
                }}
              />
              <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ fontSize: '0.7rem' }}>
                ({product.reviews})
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 'bold',
                  color: colors.primary,
                  fontSize: '1rem',
                }}
              >
                ${(product.price / 100).toFixed(2)}
              </Typography>
              {product.originalPrice && (
                <Typography
                  variant="caption"
                  sx={{
                    textDecoration: 'line-through',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '0.75rem',
                  }}
                >
                  ${(product.originalPrice / 100).toFixed(2)}
                </Typography>
              )}
            </Box>
            
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={() => addItem(product)}
              onMouseDown={(e) => e.preventDefault()} // Prevent focus
              disableRipple={true} // Disable ripple effect
              disableFocusRipple={true} // Disable focus ripple
              tabIndex={-1} // Make non-focusable
              sx={{
                background: gradients.primaryGradient,
                fontSize: '0.75rem',
                py: 0.5,
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(colors.primary, 0.9)}, ${colors.darkOrange})`,
                },
                // Prevent any focus-related styling
                '&:focus': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                },
                '&.Mui-focusVisible': {
                  outline: 'none !important',
                  boxShadow: 'none !important',
                },
              }}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Slide>
    ));

  // Cart Item Card Component - memoized for performance
  const CartItemCard = React.memo(({ item, index }) => {
    // Memoize completion check calculations
    const itemStatus = useMemo(() => {
      const hasSize = item.sizes && item.sizes.length > 0;
      const hasColor = item.colors && item.colors.length > 0;
      const needsSize = hasSize && !item.selectedSize;
      const needsColor = hasColor && !item.selectedColor;
      const isIncomplete = needsSize || needsColor;
      
      return { hasSize, hasColor, needsSize, needsColor, isIncomplete };
    }, [item.sizes, item.colors, item.selectedSize, item.selectedColor]);

    const { hasSize, hasColor, needsSize, needsColor, isIncomplete } = itemStatus;
    
    return (
    <Grid item xs={12} sm={6} sx={{ 
      // Force 2-column layout until 360px, then single column
      width: '40%',
      flexBasis: '40%',
      maxWidth: '40%',
      '@media (max-width: 360px)': {
        width: '100%',
        flexBasis: '100%',
        maxWidth: '100%',
      }
    }}> {/* 2-column layout */}
      <Slide
        direction="right"
        in={removingItem !== item.id}
        timeout={300}
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        <Card
          sx={{
            height: '100%',
            width: '95%',
            ...glassmorphism.container,
            transition: 'all 0.3s ease',
            position: 'relative',
            border: isIncomplete ? `1px solid ${alpha('#ff6b6b', 0.5)}` : `1px solid ${alpha('#ffffff', 0.1)}`,
            '&:hover': {
              border: isIncomplete 
                ? `1px solid ${alpha('#ff6b6b', 0.7)}`
                : `1px solid ${alpha(colors.primary, 0.3)}`,
              boxShadow: isIncomplete
                ? `0 4px 20px ${alpha('#ff6b6b', 0.2)}`
                : `0 4px 20px ${alpha(colors.primary, 0.1)}`,
            },
          }}
        >
          {/* Incomplete Item Badge */}
          {isIncomplete && (
            <Chip
              label="Incomplete"
              size="small"
              icon={<Info sx={{ fontSize: 14 }} />}
              sx={{
                position: 'absolute',
                top: 6,
                right: 6,
                zIndex: 1,
                background: alpha('#ff6b6b', 0.9),
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                height: 22,
                '& .MuiChip-icon': {
                  color: 'white',
                },
              }}
            />
          )}
          <CardContent sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Product Image */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Box
                tabIndex={-1}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  '&:hover .zoom-overlay': {
                    opacity: 1,
                  },
                  '&:hover img': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={(event) => openImagePopover(event, item)}
              >
                <CardMedia
                  component="img"
                  image={item.image || '/api/placeholder/120/120'}
                  alt={item.name || item.title}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: 'cover',
                    transition: 'all 0.3s ease',
                  }}
                />
                <Box
                  className="zoom-overlay"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: alpha('#000', 0.5),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <ZoomIn sx={{ color: 'white', fontSize: 24 }} />
                </Box>
              </Box>
            </Box>

            {/* Product Title */}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                mb: 1,
                textAlign: 'center',
                fontSize: '0.85rem',
                lineHeight: 1,
                minHeight: '1.2em', // Consistent height for title area
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.name || item.title}
            </Typography>
            <Chip
              label="Description"
              size="small"
              tabIndex={-1}
              onClick={(event) => openDescriptionPopover(event, item)}
              icon={<Info sx={{ fontSize: 14 }} />}
              sx={{
                background: gradients.primaryGradient,
                ...glassmorphism.chip,
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.65rem',
                height: 22,
                cursor: 'pointer',
                border: `1px solid ${alpha(colors.primary, 0.3)}`,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 2px 8px ${alpha(colors.primary, 0.3)}`,
                '&:hover': {
                  background: gradients.glowGradient,
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 20px ${alpha(colors.primary, 0.4)}`,
                },
                transition: 'all 0.3s ease',
              }}
            />
            
            {/* Product Options */}
            <Box sx={{ mb: 1.5, flex: 1 }}>
              {/* Size Selector */}
              {item.sizes && item.sizes.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ mb: 0.5, display: 'block' }}>
                    Size: {!item.selectedSize && <span style={{ color: '#ff6b6b' }}>*Required</span>}
                  </Typography>
                  <FormControl size="small" fullWidth error={!item.selectedSize}>
                    <Select
                      value={item.selectedSize || ''}
                      displayEmpty
                      onChange={(e) => updateItemAttribute(item.id, 'selectedSize', e.target.value)}
                      MenuProps={{
                        disableAutoFocus: true,
                        disableEnforceFocus: true,
                        disableRestoreFocus: true,
                        disableScrollLock: true,
                        container: () => document.body,
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      }}
                      sx={{
                        color: item.selectedSize ? 'white' : 'rgba(255,255,255,0.5)',
                        fontSize: '0.75rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: !item.selectedSize ? '#ff6b6b' : alpha('#ffffff', 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: !item.selectedSize ? '#ff5252' : alpha(colors.primary, 0.5),
                        },
                        '& .MuiSvgIcon-root': {
                          color: item.selectedSize ? 'white' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Select size...
                      </MenuItem>
                      {item.sizes.map((size) => (
                        <MenuItem key={size} value={size} sx={{ fontSize: '0.75rem' }}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Color Selector */}
              {item.colors && item.colors.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="caption" color="rgba(255,255,255,0.7)" sx={{ mb: 0.5, display: 'block' }}>
                    Color: {!item.selectedColor && <span style={{ color: '#ff6b6b' }}>*Required</span>}
                  </Typography>
                  <FormControl size="small" fullWidth error={!item.selectedColor}>
                    <Select
                      value={item.selectedColor || ''}
                      displayEmpty
                      onChange={(e) => updateItemAttribute(item.id, 'selectedColor', e.target.value)}
                      MenuProps={{
                        disableAutoFocus: true,
                        disableEnforceFocus: true,
                        disableRestoreFocus: true,
                        disableScrollLock: true,
                        container: () => document.body,
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                          },
                        },
                      }}
                      sx={{
                        color: item.selectedColor ? 'white' : 'rgba(255,255,255,0.5)',
                        fontSize: '0.75rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: !item.selectedColor ? '#ff6b6b' : alpha('#ffffff', 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: !item.selectedColor ? '#ff5252' : alpha(colors.primary, 0.5),
                        },
                        '& .MuiSvgIcon-root': {
                          color: item.selectedColor ? 'white' : 'rgba(255,255,255,0.5)',
                        },
                      }}
                    >
                      <MenuItem value="" disabled sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        Select color...
                      </MenuItem>
                      {item.colors.map((color) => (
                        <MenuItem key={color} value={color} sx={{ fontSize: '0.75rem' }}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}

              {/* Status chip if exists */}
              {item.status && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Chip 
                    label={item.status} 
                    size="small"
                    color={item.status === 'In Stock' ? 'success' : 'warning'}
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                </Box>
              )}

              {/* Price per item */}
              <Typography
                variant="caption"
                sx={{
                  color: colors.primary,
                  fontWeight: 'bold',
                  display: 'block',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                ${((item.price || 0) / 100).toFixed(2)} each
              </Typography>
            </Box>

            {/* Quantity Selector - smaller and centered */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: alpha('#000', 0.3),
                  borderRadius: 1,
                  border: `1px solid ${alpha('#fff', 0.1)}`,
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, -1)}
                  disabled={item.quantity <= 1}
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus
                  disableRipple={true} // Disable ripple effect
                  disableFocusRipple={true} // Disable focus ripple
                  tabIndex={-1} // Make non-focusable
                  sx={{
                    p: 0.25, // Much smaller padding
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      color: 'white',
                      background: alpha(colors.primary, 0.3),
                    },
                    // Prevent any focus-related styling
                    '&:focus': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                    '&.Mui-focusVisible': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                  }}
                >
                  <Remove sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography
                  sx={{ 
                    px: 1, 
                    fontWeight: 'bold', 
                    minWidth: 24, 
                    textAlign: 'center',
                    color: 'white',
                    fontSize: '0.8rem'
                  }}
                >
                  {item.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => updateQuantity(item.id, 1)}
                  disabled={item.quantity >= cartConfig.behavior.maxQuantityPerItem}
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus
                  disableRipple={true} // Disable ripple effect
                  disableFocusRipple={true} // Disable focus ripple
                  tabIndex={-1} // Make non-focusable
                  sx={{
                    p: 0.25,
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      color: 'white',
                      background: alpha(colors.primary, 0.3),
                    },
                    // Prevent any focus-related styling
                    '&:focus': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                    '&.Mui-focusVisible': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                  }}
                >
                  <Add sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 1.5 }}>
              <Button
                size="small"
                onClick={() => removeItem(item.id)}
                onMouseDown={(e) => e.preventDefault()} // Prevent focus
                disableRipple={true} // Disable ripple effect
                disableFocusRipple={true} // Disable focus ripple
                tabIndex={-1} // Make non-focusable
                sx={{
                  color: '#ff6b6b',
                  fontSize: '0.7rem',
                  p: '2px 6px',
                  '&:hover': {
                    color: '#ff5252',
                    background: alpha('#ff6b6b', 0.1),
                  },
                  // Prevent any focus-related styling
                  '&:focus': {
                    outline: 'none !important',
                    boxShadow: 'none !important',
                  },
                  '&.Mui-focusVisible': {
                    outline: 'none !important',
                    boxShadow: 'none !important',
                  },
                }}
              >
                Remove
              </Button>

              {cartConfig.behavior.enableSaveForLater && (
                <Button
                  size="small"
                  onClick={() => saveForLater(item.id)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent focus
                  disableRipple={true} // Disable ripple effect
                  disableFocusRipple={true} // Disable focus ripple
                  tabIndex={-1} // Make non-focusable
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.7rem',
                    p: '2px 6px',
                    '&:hover': {
                      color: 'white',
                      background: alpha('#fff', 0.1),
                    },
                    // Prevent any focus-related styling
                    '&:focus': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                    '&.Mui-focusVisible': {
                      outline: 'none !important',
                      boxShadow: 'none !important',
                    },
                  }}
                >
                  Save for later
                </Button>
              )}
            </Box>

            {/* Total Price - at bottom */}
            <Box sx={{ mt: 'auto', pt: 1, borderTop: `1px solid ${alpha('#ffffff', 0.1)}` }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 900,
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                  fontSize: '1.1rem',
                }}
              >
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </Typography>
              {item.quantity > 1 && (
                <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ display: 'block', textAlign: 'center' }}>
                  {item.quantity} × ${(item.price / 100).toFixed(2)}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Slide>
    </Grid>
    );
  });

  // Cart Drawer Component
  const CartDrawer = () => {
    const recommendedItems = getRecommendedProducts;

    return (
      <>
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={closeCart}
          onMouseDown={(e) => e.preventDefault()} // Prevent focus
          // disableRipple={true} // Disable ripple effect
          // disableFocusRipple={true} // Disable focus ripple
          tabIndex={-1} // Make non-focusable
          ModalProps={{
            keepMounted: true,
            disableEnforceFocus: true,
            disableAutoFocus: true,
            disableRestoreFocus: true,
            disableScrollLock: true,
            container: () => document.body,
            }}
          sx={{
            '& .MuiDrawer-paper': {
              width: { xs: '100%', sm: 500, md: 600 },
              background: gradients.darkGlass,
              color: 'white',
              top: { xs: '56px', sm: '64px' }, // Account for header bar height (mobile/desktop)
              height: { xs: 'calc(100% - 56px)', sm: 'calc(100% - 64px)' }, // Adjust height accordingly
            },
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            {/* Animated Background Orbs */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  background: gradients.multiGradient,
                  opacity: 0.05,
                  top: '10%',
                  left: '-50px',
                  filter: 'blur(40px)',
                  animation: 'float 20s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(180deg)' },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  background: gradients.accentGradient,
                  opacity: 0.03,
                  bottom: '20%',
                  right: '-100px',
                  animation: 'float 15s ease-in-out infinite reverse',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: gradients.glowGradient,
                  opacity: 0.04,
                  top: '50%',
                  left: '50%',
                  filter: 'blur(40px)',
                  transform: 'translate(-50%, -50%)',
                  animation: 'pulse 10s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)' },
                    '50%': { transform: 'translate(-50%, -50%) scale(1.2)' },
                  },
                }}
              />
            </Box>
            {/* Header */}
            <Box
              sx={{
                p: 2,
                borderBottom: `1px solid ${alpha(colors.primary, 0.2)}`,
                ...glassmorphism.overlay,
                position: 'relative',
                zIndex: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                {/* Shopping Cart Title */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    background: gradients.primaryGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Shopping </Box>Cart
                </Typography>

                {/* Center section - Item count & Progress */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                  <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ whiteSpace: 'nowrap' }}>
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </Typography>
                  
                  {/* Free Shipping Progress */}
                  {cartItems.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 200 }}>
                      <LocalShipping sx={{ fontSize: 16, color: shipping === 0 ? '#00FF00' : colors.primary }} />
                      <Box sx={{ flex: 1, minWidth: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontSize: '0.65rem',
                              color: shipping === 0 ? '#00FF00' : 'rgba(255,255,255,0.7)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {shipping === 0 
                              ? 'FREE shipping!'
                              : `$${(amountToFreeShipping / 100).toFixed(2)} to free`
                            }
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={freeShippingProgress}
                          sx={{
                            height: 3,
                            borderRadius: 2,
                            background: alpha('#000', 0.3),
                            '& .MuiLinearProgress-bar': {
                              background: shipping === 0 
                                ? 'linear-gradient(90deg, #00FF00, #00FF00)'
                                : 'linear-gradient(90deg, #FF8C37, #FF3D3D)',
                              borderRadius: 2,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Close Button */}
                <IconButton
                  onClick={closeCart}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    '&:hover': {
                      color: 'white',
                      transform: 'rotate(90deg)',
                      backgroundColor: alpha('#fff', 0.1),
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Close />
                </IconButton>
              </Box>
            </Box>

            {/* Main Content Area */}
            <Box 
              ref={scrollContainerRef}
              tabIndex={-1}
              onFocus={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onScroll={(e) => {
                // Only allow manual scrolling
                if (e.isTrusted && e.target === scrollContainerRef.current) {
                  // This is a legitimate user scroll, allow it
                  return;
                }
              }}
              sx={{ 
                flex: 1, 
                overflow: 'auto',
                position: 'relative',
                zIndex: 1,
                scrollBehavior: 'auto',
                overscrollBehavior: 'contain',
                // Prevent any focus-based scrolling
                '&:focus': {
                  outline: 'none',
                },
                '& *:focus': {
                  outline: 'none',
                },
                // Custom scrollbar styles
                '&::-webkit-scrollbar': {
                  width: '8px',
                  background: 'transparent',
                },
                '&::-webkit-scrollbar-track': {
                  background: alpha('#000', 0.1),
                  backdropFilter: 'blur(20px)',
                  borderRadius: '4px',
                  margin: '8px 0',
                  border: `1px solid ${alpha(colors.accent, 0.05)}`,
                  boxShadow: `inset 0 0 6px ${alpha(colors.accent, 0.1)}`,
                },
                '&::-webkit-scrollbar-thumb': {
                  background: gradients.accentGradient,
                  borderRadius: '4px',
                  border: `1px solid ${alpha(colors.accent, 0.2)}`,
                  backdropFilter: 'blur(20px)',
                  boxShadow: `0 2px 8px ${alpha(colors.accent, 0.3)}, inset 0 1px 2px ${alpha('#ffffff', 0.2)}`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(colors.accent, 0.8)}, ${alpha(colors.lightBlue, 0.6)})`,
                    border: `1px solid ${alpha(colors.accent, 0.4)}`,
                    boxShadow: `0 2px 12px ${alpha(colors.accent, 0.5)}, inset 0 1px 3px ${alpha('#ffffff', 0.3)}`,
                  },
                },
                // Firefox scrollbar
                scrollbarWidth: 'thin',
                scrollbarColor: `${alpha(colors.accent, 0.5)} ${alpha('#000', 0.2)}`,
              }}
            >
              {cartItems.length === 0 ? (
                // Empty Cart
                <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                  <ShoppingCart sx={{ fontSize: 80, color: 'rgba(255,255,255,0.3)', mb: 3 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Your cart is empty
                  </Typography>
                  <Typography variant="body1" color="rgba(255,255,255,0.6)" sx={{ mb: 4 }}>
                    Add some amazing products to get started!
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={closeCart}
                    startIcon={<ShoppingBag />}
                    sx={{
                      background: gradients.primaryGradient,
                      px: 4,
                      py: 1.5,
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(colors.primary, 0.9)}, ${colors.darkOrange})`,
                      },
                    }}
                  >
                    Add an item to get started!
                  </Button>
                </Box>
              ) : (
                <Box sx={{ p: 2 }}>
                  {/* Cart Items - 2 column grid */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Items in your cart
                    </Typography>
                    <Grid container spacing={1.5} tabIndex={-1}>
                      {cartItems.map((item, index) => (
                        <CartItemCard key={item.id} item={item} index={index} />
                      ))}
                    </Grid>
                  </Box>

                  {/* Saved for Later */}
                  {cartConfig.behavior.enableSaveForLater && savedItems.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Saved for later ({savedItems.length} items)
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          gap: 1,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          pb: 1,
                          // Custom horizontal scrollbar styles
                          '&::-webkit-scrollbar': {
                            height: '6px',
                            background: 'transparent',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: alpha('#000', 0.1),
                            backdropFilter: 'blur(20px)',
                            borderRadius: '3px',
                            border: `1px solid ${alpha(colors.accent, 0.05)}`,
                            boxShadow: `inset 0 0 4px ${alpha(colors.accent, 0.1)}`,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: gradients.accentGradient,
                            borderRadius: '3px',
                            border: `1px solid ${alpha(colors.accent, 0.2)}`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: `0 1px 6px ${alpha(colors.accent, 0.3)}, inset 0 1px 1px ${alpha('#ffffff', 0.2)}`,
                            '&:hover': {
                              background: `linear-gradient(90deg, ${alpha(colors.accent, 0.8)}, ${alpha(colors.lightBlue, 0.6)})`,
                              border: `1px solid ${alpha(colors.accent, 0.4)}`,
                              boxShadow: `0 1px 8px ${alpha(colors.accent, 0.5)}, inset 0 1px 2px ${alpha('#ffffff', 0.3)}`,
                            },
                          },
                          // Firefox scrollbar
                          scrollbarWidth: 'thin',
                          scrollbarColor: `${alpha(colors.accent, 0.5)} ${alpha('#000', 0.2)}`,
                          // Scroll behavior
                          scrollBehavior: 'smooth',
                          // Hide scrollbar on mobile for cleaner look
                          '@media (max-width: 600px)': {
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            scrollbarWidth: 'none',
                          },
                        }}
                      >
                        {savedItems.map((item) => (
                          <Card
                            key={item.id}
                            sx={{
                              minWidth: 250,
                              maxWidth: 250,
                              ...glassmorphism.container,
                            }}
                          >
                            <CardContent sx={{ p: 1.5 }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {/* Image and Title Row */}
                                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                  <CardMedia
                                    component="img"
                                    image={item.image || '/api/placeholder/60/60'}
                                    alt={item.name || item.title}
                                    sx={{
                                      width: 60,
                                      height: 60,
                                      objectFit: 'cover',
                                      borderRadius: 1,
                                      flexShrink: 0,
                                    }}
                                  />
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography 
                                      variant="caption" 
                                      fontWeight="bold" 
                                      sx={{ 
                                        fontSize: '0.8rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        lineHeight: 1.2,
                                        mb: 0.5,
                                      }}
                                    >
                                      {item.name || item.title}
                                    </Typography>
                                    <Typography variant="caption" color={colors.primary} sx={{ display: 'block', fontWeight: 'bold' }}>
                                      ${((item.price || 0) / 100).toFixed(2)}
                                    </Typography>
                                    {item.originalPrice && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          textDecoration: 'line-through',
                                          color: 'rgba(255,255,255,0.5)',
                                          fontSize: '0.7rem',
                                        }}
                                      >
                                        ${(item.originalPrice / 100).toFixed(2)}
                                      </Typography>
                                    )}
                                  </Box>
                                </Box>
                                
                                {/* Action Button */}
                                <Button
                                  fullWidth
                                  size="small"
                                  variant="outlined"
                                  onClick={() => moveToCart(item.id)}
                                  sx={{
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                    fontSize: '0.7rem',
                                    py: 0.5,
                                    '&:hover': {
                                      borderColor: alpha(colors.primary, 0.8),
                                      background: alpha(colors.primary, 0.1),
                                    },
                                  }}
                                >
                                  Move to Cart
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Recommended Products */}
                  {cartConfig.behavior.showRecommendations && recommendedItems.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Recommended for you
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'flex',
                          gap: 1,
                          overflowX: 'auto',
                          overflowY: 'hidden',
                          pb: 1,
                          // Custom horizontal scrollbar styles
                          '&::-webkit-scrollbar': {
                            height: '6px',
                            background: 'transparent',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: alpha('#000', 0.1),
                            backdropFilter: 'blur(20px)',
                            borderRadius: '3px',
                            border: `1px solid ${alpha(colors.accent, 0.05)}`,
                            boxShadow: `inset 0 0 4px ${alpha(colors.accent, 0.1)}`,
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: gradients.accentGradient,
                            borderRadius: '3px',
                            border: `1px solid ${alpha(colors.accent, 0.2)}`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: `0 1px 6px ${alpha(colors.accent, 0.3)}, inset 0 1px 1px ${alpha('#ffffff', 0.2)}`,
                            '&:hover': {
                              background: `linear-gradient(90deg, ${alpha(colors.accent, 0.8)}, ${alpha(colors.lightBlue, 0.6)})`,
                              border: `1px solid ${alpha(colors.accent, 0.4)}`,
                              boxShadow: `0 1px 8px ${alpha(colors.accent, 0.5)}, inset 0 1px 2px ${alpha('#ffffff', 0.3)}`,
                            },
                          },
                          // Firefox scrollbar
                          scrollbarWidth: 'thin',
                          scrollbarColor: `${alpha(colors.accent, 0.5)} ${alpha('#000', 0.2)}`,
                          // Scroll behavior
                          scrollBehavior: 'smooth',
                          // Hide scrollbar on mobile for cleaner look
                          '@media (max-width: 600px)': {
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            scrollbarWidth: 'none',
                          },
                        }}
                      >
                        {recommendedItems.map((product, index) => (
                          <Box 
                            key={product.id} 
                            sx={{ 
                              minWidth: { xs: '160px', sm: '180px', md: '200px' },
                              maxWidth: { xs: '160px', sm: '180px', md: '200px' },
                            }}
                          >
                            <RecommendationCard product={product} index={index} />
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Footer with Order Summary - with promotional messages */}
            {cartItems.length > 0 && (
              <Box
                sx={{
                  borderTop: `1px solid ${alpha(colors.primary, 0.2)}`,
                  p: 2,
                  ...glassmorphism.overlay,
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {/* Promotional Badges - all inline */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
                  {/* Member Discount Badge */}
                  {cartConfig.promotions.enabled && cartConfig.promotions.messages
                    .find(promo => promo.id === 'member-benefit') && (
                    <Tooltip 
                      title="Members get an extra 5% off all orders"
                      arrow
                      placement="top"
                    >
                      <Chip
                        icon={<Star sx={{ fontSize: 14 }} />}
                        label="5% Member"
                        size="small"
                        sx={{
                          background: alpha(colors.purple, 0.2),
                          border: `1px solid ${alpha(colors.purple, 0.4)}`,
                          color: colors.purple,
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          height: 24,
                          '& .MuiChip-icon': {
                            color: colors.purple,
                          },
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  )}

                  {/* Bundle Discount Badge */}
                  {cartConfig.promotions.enabled && itemCount >= 2 && cartConfig.promotions.messages
                    .find(promo => promo.id === 'bundle-save') && (
                    <Tooltip 
                      title="Buy 2 items, get 10% off your order"
                      arrow
                      placement="top"
                    >
                      <Chip
                        icon={<LocalOffer sx={{ fontSize: 14 }} />}
                        label="10% Bundle"
                        size="small"
                        sx={{
                          background: alpha(colors.accent, 0.2),
                          border: `1px solid ${alpha(colors.accent, 0.4)}`,
                          color: colors.accent,
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          height: 24,
                          '& .MuiChip-icon': {
                            color: colors.accent,
                          },
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  )}

                  {/* Free Shipping Badge */}
                  {shipping === 0 && (
                    <Tooltip 
                      title="You've unlocked FREE standard shipping!"
                      arrow
                      placement="top"
                    >
                      <Chip
                        icon={<LocalShipping sx={{ fontSize: 14 }} />}
                        label="Free Shipping"
                        size="small"
                        sx={{
                          background: alpha('#00FF00', 0.2),
                          border: `1px solid ${alpha('#00FF00', 0.4)}`,
                          color: '#00FF00',
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          height: 24,
                          '& .MuiChip-icon': {
                            color: '#00FF00',
                          },
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  )}

                  {/* Limited Time Badge - always show if promotions exist */}
                  {cartConfig.promotions.enabled && (itemCount >= 2 || true) && (
                    <Tooltip 
                      title="Limited time offers - act fast!"
                      arrow
                      placement="top"
                    >
                      <Chip
                        icon={<Bolt sx={{ fontSize: 14 }} />}
                        label="Limited Time"
                        size="small"
                        sx={{
                          background: alpha('#FF6B6B', 0.2),
                          border: `1px solid ${alpha('#FF6B6B', 0.4)}`,
                          color: '#FF6B6B',
                          fontWeight: 'bold',
                          fontSize: '0.65rem',
                          height: 24,
                          '& .MuiChip-icon': {
                            color: '#FF6B6B',
                          },
                          cursor: 'help',
                        }}
                      />
                    </Tooltip>
                  )}
                </Box>

                {/* Collapsible order summary - now for all screen sizes */}
                <Button
                  fullWidth
                  onClick={() => setOrderSummaryOpen(!orderSummaryOpen)}
                  sx={{ 
                    justifyContent: 'space-between',
                    color: 'white',
                    mb: 1,
                                          ...glassmorphism.container,
                    borderRadius: 1,
                    py: 1.2,
                    px: 2,
                    position: 'relative',
                    overflow: 'hidden',
                                          '&:hover': {
                        background: alpha('#ffffff', 0.06),
                        border: `1px solid ${alpha(colors.primary, 0.3)}`,
                        '& .expand-icon': {
                          color: colors.primary,
                        }
                      },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                                              background: `linear-gradient(90deg, transparent, ${alpha(colors.primary, 0.5)}, transparent)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      Order Summary
                    </Typography>
                    <Info sx={{ fontSize: 16, opacity: 0.7 }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: colors.primary,
                      }}
                    >
                      ${(total / 100).toFixed(2)}
                    </Typography>
                    <ArrowForward 
                      className="expand-icon"
                      sx={{ 
                        fontSize: 16, 
                        transform: orderSummaryOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'all 0.3s ease',
                        color: 'rgba(255,255,255,0.7)',
                      }} 
                    />
                  </Box>
                </Button>

                {/* Order details - condensed */}
                <Collapse in={orderSummaryOpen}>
                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.8)">
                        Subtotal ({itemCount} items)
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">${(subtotal / 100).toFixed(2)}</Typography>
                    </Box>
                    
                    {/* Show discounts if applicable */}
                    {cartConfig.promotions.enabled && (
                      <>
                        {/* Member discount */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color={colors.purple}>
                            Member Discount (5%)
                          </Typography>
                          <Typography variant="caption" fontWeight="bold" color={colors.purple}>
                            -${((subtotal * 0.05) / 100).toFixed(2)}
                          </Typography>
                        </Box>
                        
                        {/* Bundle discount */}
                        {itemCount >= 2 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color={colors.accent}>
                              Bundle Discount (10%)
                            </Typography>
                            <Typography variant="caption" fontWeight="bold" color={colors.accent}>
                              -${((subtotal * 0.10) / 100).toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                      </>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.8)">
                        {cartConfig.tax.displayName}
                      </Typography>
                      <Typography variant="caption" fontWeight="bold">${(tax / 100).toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" color="rgba(255,255,255,0.8)">Shipping</Typography>
                        {shipping === 0 && <CheckCircle sx={{ fontSize: 14, color: '#00FF00' }} />}
                      </Box>
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        sx={{ color: shipping === 0 ? '#00FF00' : 'white' }}
                      >
                        {shipping === 0 ? 'FREE' : `$${(shipping / 100).toFixed(2)}`}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1, borderColor: alpha(colors.primary, 0.2) }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body1" fontWeight="bold">Total</Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        background: gradients.primaryGradient,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      ${(total / 100).toFixed(2)}
                    </Typography>
                  </Box>
                </Collapse>

                {/* Action Buttons - Inline */}
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    size="medium"
                    endIcon={<ArrowForward />}
                    onClick={() => {
                      console.log('=== TODO: Implement the checkout functionality ===');
                      console.log('Total amount:', `$${(total / 100).toFixed(2)}`);
                      console.log('Number of items:', itemCount);
                      console.log('\n=== DETAILED CART ANALYSIS ===');
                      
                      const incompleteItems = [];
                      const completeItems = [];
                      
                      cartItems.forEach((item, index) => {
                        console.log(`--- Item ${index + 1}: ${item.name || item.title} ---`);
                        console.log('  Basic Info:');
                        console.log(`    • Name: ${item.name || item.title}`);
                        console.log(`    • Price: $${((item.price || 0) / 100).toFixed(2)} each`);
                        console.log(`    • Quantity: ${item.quantity}`);
                        console.log(`    • Line Total: $${(((item.price || 0) * item.quantity) / 100).toFixed(2)}`);
                        console.log(`    • Category: ${item.category || 'N/A'}`);
                        console.log(`    • Status: ${item.status || 'N/A'}`);
                        
                        // Check for size selection
                        const hasSize = item.sizes && item.sizes.length > 0;
                        const sizeSelected = item.selectedSize;
                        console.log('  Size Selection:');
                        if (hasSize) {
                          console.log(`    • Available sizes: [${item.sizes.join(', ')}]`);
                          console.log(`    • Selected size: ${sizeSelected || '⚠️  NOT SELECTED'}`);
                          if (!sizeSelected) {
                            console.log('    ❌ SIZE SELECTION REQUIRED');
                          } else {
                            console.log('    ✅ Size selected');
                          }
                        } else {
                          console.log('    • No size options available');
                        }
                        
                        // Check for color selection
                        const hasColor = item.colors && item.colors.length > 0;
                        const colorSelected = item.selectedColor;
                        console.log('  Color Selection:');
                        if (hasColor) {
                          console.log(`    • Available colors: [${item.colors.join(', ')}]`);
                          console.log(`    • Selected color: ${colorSelected || '⚠️  NOT SELECTED'}`);
                          if (!colorSelected) {
                            console.log('    ❌ COLOR SELECTION REQUIRED');
                          } else {
                            console.log('    ✅ Color selected');
                          }
                        } else {
                          console.log('    • No color options available');
                        }
                        
                        // Determine if item is complete
                        const needsSize = hasSize && !sizeSelected;
                        const needsColor = hasColor && !colorSelected;
                        const isComplete = !needsSize && !needsColor;
                        
                        if (isComplete) {
                          console.log('  ✅ ITEM READY FOR CHECKOUT');
                          completeItems.push({
                            name: item.name || item.title,
                            quantity: item.quantity,
                            price: item.price,
                            selectedSize: sizeSelected,
                            selectedColor: colorSelected,
                            lineTotal: (item.price * item.quantity)
                          });
                        } else {
                          console.log('  ❌ ITEM INCOMPLETE - MISSING SELECTIONS');
                          incompleteItems.push({
                            name: item.name || item.title,
                            missingSelections: [
                              ...(needsSize ? ['size'] : []),
                              ...(needsColor ? ['color'] : [])
                            ]
                          });
                        }
                        console.log(); // Empty line for spacing
                      });
                      
                      // Summary
                      console.log('=== CHECKOUT READINESS SUMMARY ===');
                      console.log(`✅ Complete items: ${completeItems.length}`);
                      console.log(`❌ Incomplete items: ${incompleteItems.length}`);
                      
                      if (incompleteItems.length > 0) {
                        console.log('\n🚫 CHECKOUT BLOCKED - The following items need selections:');
                        incompleteItems.forEach(item => {
                          console.log(`  • ${item.name}: Missing ${item.missingSelections.join(' and ')}`);
                        });
                        console.log('\n⚠️  Please complete all item selections before proceeding to checkout.');
                        
                        // Show UI notification for incomplete items
                        const missingMessage = incompleteItems.map(item => 
                          `${item.name}: Missing ${item.missingSelections.join(' and ')}`
                        ).join('\n');
                        
                        setNotification({ 
                          open: true, 
                          message: `Please complete all selections:\n${missingMessage}`,
                          severity: 'error'
                        });
                      } else {
                        console.log('\n🎉 ALL ITEMS READY FOR CHECKOUT!');
                        console.log('\nFinal order summary:');
                        completeItems.forEach(item => {
                          const details = [];
                          if (item.selectedSize) details.push(`Size: ${item.selectedSize}`);
                          if (item.selectedColor) details.push(`Color: ${item.selectedColor}`);
                          const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
                          console.log(`  • ${item.quantity}x ${item.name}${detailsStr} - $${(item.lineTotal / 100).toFixed(2)}`);
                        });
                        
                        // Show success notification
                        setNotification({ 
                          open: true, 
                          message: 'All items ready! Proceeding to checkout...',
                          severity: 'success'
                        });
                        
                        // Start transition animation
                        setIsTransitioning(true);
                        
                        // Navigate to checkout page after transition starts
                        setTimeout(() => {
                          // Using window.location to ensure clean navigation
                          // This will trigger a full page load which allows the cart to persist via localStorage
                          window.location.href = '/checkout';
                        }, 800); // Short delay for smooth transition
                      }
                      
                      console.log('=====================================');
                    }}
                    sx={{
                      background: alpha(colors.primary, 0.15),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(colors.primary, 0.3)}`,
                      color: colors.primary,
                      fontWeight: 'bold',
                      px: 3,
                      py: 1,
                      boxShadow: `0 4px 20px ${alpha(colors.primary, 0.2)}`,
                      '&:hover': {
                        background: alpha(colors.primary, 0.25),
                        border: `1px solid ${alpha(colors.primary, 0.5)}`,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 6px 24px ${alpha(colors.primary, 0.3)}`,
                      },
                      '&:active': {
                        transform: 'translateY(0)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Checkout
                  </Button>

                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={closeCart}
                    sx={{
                      borderColor: alpha('#ffffff', 0.2),
                      color: 'rgba(255,255,255,0.8)',
                      px: 3,
                      py: 1,
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: alpha('#ffffff', 0.4),
                        background: alpha('#ffffff', 0.05),
                        color: 'white',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Continue Shopping
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        </Drawer>

        {/* Checkout Transition Overlay */}
        {isTransitioning && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'fadeIn 0.3s ease-out',
              '@keyframes fadeIn': {
                from: { opacity: 0 },
                to: { opacity: 1 },
              },
            }}
          >
            {/* Animated cart icon */}
            <Box
              sx={{
                position: 'relative',
                mb: 3,
                animation: 'cartMove 0.8s ease-out forwards',
                '@keyframes cartMove': {
                  '0%': { 
                    transform: 'translateX(0) scale(1)',
                    opacity: 1,
                  },
                  '100%': { 
                    transform: 'translateX(50px) scale(0.8)',
                    opacity: 0.7,
                  },
                },
              }}
            >
              <ShoppingCart 
                sx={{ 
                  fontSize: 64,
                  color: colors.primary,
                  filter: `drop-shadow(0 0 20px ${alpha(colors.primary, 0.5)})`,
                }} 
              />
              {/* Animated arrow */}
              <ArrowForward
                sx={{
                  position: 'absolute',
                  right: -40,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: 32,
                  color: colors.primary,
                  opacity: 0,
                  animation: 'arrowFade 0.8s ease-out 0.2s forwards',
                  '@keyframes arrowFade': {
                    to: { opacity: 1 },
                  },
                }}
              />
            </Box>
            
            {/* Text */}
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                opacity: 0,
                animation: 'textFade 0.5s ease-out 0.3s forwards',
                '@keyframes textFade': {
                  to: { opacity: 1 },
                },
              }}
            >
              Proceeding to Checkout
            </Typography>
            
            {/* Loading dots */}
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                mt: 2,
              }}
            >
              {[0, 1, 2].map((index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: colors.primary,
                    opacity: 0,
                    animation: `dotPulse 1.2s ease-in-out ${index * 0.2}s infinite`,
                    '@keyframes dotPulse': {
                      '0%, 80%, 100%': { 
                        opacity: 0,
                        transform: 'scale(0.8)',
                      },
                      '40%': { 
                        opacity: 1,
                        transform: 'scale(1.2)',
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={notification.severity === 'error' ? 5000 : 3000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setNotification({ ...notification, open: false })}
            severity={notification.severity || 'success'}
            sx={{
              background: alpha('#000', 0.9),
              color: 'white',
              '& .MuiAlert-icon': {
                color: notification.severity === 'error' ? '#ff6b6b' : '#00FF00',
              },
              maxWidth: '500px',
              '& .MuiAlert-message': {
                whiteSpace: 'pre-line', // Allow line breaks in message
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {/* Description Popover */}
        <Popover
          open={Boolean(descriptionAnchorEl)}
          anchorEl={descriptionAnchorEl}
          onClose={() => {
            // Preserve scroll position before closing
            const scrollTop = scrollContainerRef.current?.scrollTop || 0;
            
            setDescriptionAnchorEl(null);
            setSelectedDescriptionItem(null);
            
            // Restore scroll position after state update
            requestAnimationFrame(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollTop;
              }
            });
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          disableScrollLock
          container={() => document.body}
          sx={{
            '& .MuiPopover-paper': {
              ...glassmorphism.card,
              maxWidth: 300,
              mt: 0.5,
              ml: 0.5,
              animation: 'fadeInScale 0.2s ease-out',
              '@keyframes fadeInScale': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.9)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                }
              }
            }
          }}
        >
          {selectedDescriptionItem && (
            <Box sx={{ p: 2 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'white',
                  mb: 1,
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {selectedDescriptionItem.name || selectedDescriptionItem.title}
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '0.75rem',
                  lineHeight: 1.5,
                  mb: 1,
                }}
              >
                {selectedDescriptionItem.description || `Premium quality ${selectedDescriptionItem.name || selectedDescriptionItem.title}. Carefully crafted with attention to detail and made from the finest materials.`}
              </Typography>
              
              {/* Rating and Reviews */}
              {selectedDescriptionItem.rating && selectedDescriptionItem.rating > 0 && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Rating 
                      value={selectedDescriptionItem.rating} 
                      size="small" 
                      readOnly 
                      precision={0.1}
                      sx={{ 
                        color: colors.primary,
                        fontSize: '0.8rem' 
                      }}
                    />
                    <Typography variant="caption" color="rgba(255,255,255,0.6)" sx={{ fontSize: '0.65rem' }}>
                      ({selectedDescriptionItem.reviews} reviews)
                    </Typography>
                  </Box>
                </>
              )}
              
              {selectedDescriptionItem.features && selectedDescriptionItem.features.length > 0 && (
                <>
                  <Divider sx={{ my: 1, borderColor: alpha('#fff', 0.2) }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: colors.primary,
                      display: 'block',
                      mb: 0.5,
                      fontSize: '0.7rem',
                    }}
                  >
                    Features:
                  </Typography>
                  {selectedDescriptionItem.features.map((feature, idx) => (
                    <Typography 
                      key={idx}
                      variant="caption" 
                      sx={{ 
                        display: 'block',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: '0.7rem',
                        pl: 1,
                        '&::before': {
                          content: '"• "',
                          color: colors.primary,
                        }
                      }}
                    >
                      {feature}
                    </Typography>
                  ))}
                </>
              )}
            </Box>
          )}
        </Popover>

        {/* Image Popover */}
        <Popover
          open={Boolean(imageAnchorEl)}
          anchorEl={imageAnchorEl}
          onClose={() => {
            // Preserve scroll position before closing
            const scrollTop = scrollContainerRef.current?.scrollTop || 0;
            
            setImageAnchorEl(null);
            setSelectedImageItem(null);
            
            // Restore scroll position after state update
            requestAnimationFrame(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = scrollTop;
              }
            });
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          disableScrollLock
          container={() => document.body}
          sx={{
            '& .MuiPopover-paper': {
              ...glassmorphism.card,
              p: 1,
              maxWidth: { xs: '90vw', sm: 500 },
              maxHeight: { xs: '90vh', sm: 600 },
              animation: 'fadeInScale 0.2s ease-out',
              '@keyframes fadeInScale': {
                '0%': {
                  opacity: 0,
                  transform: 'scale(0.9)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'scale(1)',
                }
              }
            }
          }}
        >
          {selectedImageItem && (
            <Box>
              <Box 
                sx={{ 
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: `0 8px 32px ${alpha(colors.primary, 0.2)}`,
                }}
              >
                <img
                  src={selectedImageItem.image || '/api/placeholder/500/500'}
                  alt={selectedImageItem.name || selectedImageItem.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                  }}
                />
                
                {/* Gradient overlay at bottom for text */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, ${alpha('#000', 0.8)}, transparent)`,
                    p: 2,
                    pt: 4,
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'white',
                      mb: 0.5,
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  >
                    {selectedImageItem.name || selectedImageItem.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: colors.primary,
                        fontWeight: 'bold',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      }}
                    >
                      ${((selectedImageItem.price || 0) / 100).toFixed(2)}
                    </Typography>
                    
                    {selectedImageItem.originalPrice && (
                      <Typography
                        variant="body2"
                        sx={{
                          textDecoration: 'line-through',
                          color: 'rgba(255,255,255,0.5)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}
                      >
                        ${(selectedImageItem.originalPrice / 100).toFixed(2)}
                      </Typography>
                    )}
                    
                    {selectedImageItem.selectedSize && (
                      <Chip
                        label={`Size: ${selectedImageItem.selectedSize}`}
                        size="small"
                        sx={{
                          background: alpha('#fff', 0.2),
                          color: 'white',
                          fontWeight: 'bold',
                          backdropFilter: 'blur(10px)',
                        }}
                      />
                    )}
                    
                    {selectedImageItem.selectedColor && (
                      <Chip
                        label={`Color: ${selectedImageItem.selectedColor}`}
                        size="small"
                        sx={{
                          background: alpha('#fff', 0.2),
                          color: 'white',
                          fontWeight: 'bold',
                          backdropFilter: 'blur(10px)',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
              
              {/* Close hint */}
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: 'center',
                  mt: 1,
                  color: 'rgba(255,255,255,0.6)',
                  fontSize: '0.7rem',
                }}
              >
                Click outside to close
              </Typography>
            </Box>
          )}
        </Popover>
      </>
    );
  };

  const contextValue = {
    // State
    cartItems,
    savedItems,
    isOpen,
    itemCount,
    subtotal,
    memberDiscount,
    bundleDiscount,
    totalDiscounts,
    discountedSubtotal,
    tax,
    shipping,
    total,
    savings,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    updateItemAttribute,
    saveForLater,
    moveToCart,
    clearCart,
    openCart,
    closeCart,
    
    // Components
    FloatingCartButton,
    CartDrawer,
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
};

// Shopping Cart Hook Component - Use this in pages where you want the cart
export const ShoppingCartComponents = () => {
  const { FloatingCartButton, CartDrawer } = useShoppingCart();
  
  return (
    <>
      <FloatingCartButton />
      <CartDrawer />
    </>
  );
};
