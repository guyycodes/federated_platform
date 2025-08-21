// A dynamic card component that displays a plugin's information

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Rating,
  Tooltip,
  alpha
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '../../Context/ThemeContext';
import { ShoppingCartComponents, useShoppingCart } from '../../Context/ShoppingCart';
import { usePlugins } from '../../hooks/usePlugins';


// Memoized ProductCard component - moved outside for proper ref handling
const PluginCard = React.memo(({ 
  product, 
  index, 
  visibleProducts, 
  toggleFavorite, 
  favorites, 
  handleAddToCart, 
  colorMap, 
  colors, 
  gradients, 
  alpha, 
  setProductRef 
}) => (
  <div
    ref={(el) => setProductRef(product.id, el)}
    data-product-id={product.id}
  >
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        background: alpha(colors.glassWhite, 0.1),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(colors.primary, 0.2)}`,
        borderRadius: 3,
        opacity: visibleProducts[product.id] ? 1 : 0,
        transform: visibleProducts[product.id]
          ? 'translateY(0)' 
          : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: `${index * 0.1}s`,
        // Extremely subtle floating animation
        animation: visibleProducts[product.id] 
          ? `subtleFloat 6s ease-in-out infinite ${(index * 0.3)}s` 
          : 'none',
        '@keyframes subtleFloat': {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px)',
          },
          '25%': { 
            transform: 'translateY(-1px) translateX(0.5px)',
          },
          '50%': { 
            transform: 'translateY(-2px) translateX(0px)',
          },
          '75%': { 
            transform: 'translateY(-1px) translateX(-0.5px)',
          },
        },
        '&:hover': {
          transform: 'translateY(-12px) scale(1.02)',
          boxShadow: `0 20px 60px ${alpha(colors.primary, 0.3)}`,
          border: `1px solid ${alpha(colors.primary, 0.5)}`,
          background: alpha(colors.glassWhite, 0.15),
          animation: 'none', // Pause floating on hover
          '&::before': {
            opacity: 1,
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: gradients.shimmerGradient,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          borderRadius: 3,
        }
      }}
    >
      {/* Favorite Button */}
      <IconButton
        onClick={() => toggleFavorite(product.id)}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: alpha(colors.glassBlack, 0.6),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(colors.primary, 0.3)}`,
          color: '#ffffff',
          zIndex: 2,
          '&:hover': {
            background: alpha(colors.primary, 0.8),
            transform: 'scale(1.1)',
            boxShadow: `0 0 20px ${alpha(colors.primary, 0.5)}`,
          },
          transition: 'all 0.3s ease'
        }}
      >
        {favorites.includes(product.id) ? 
          <FavoriteIcon sx={{ color: colors.accent }} /> : 
          <FavoriteBorderIcon />
        }
      </IconButton>

      {/* Product Image */}
      <CardMedia
        component="img"
        height="280"
        image={product.image}
        alt={product.title}
        sx={{
          objectFit: 'cover',
          bgcolor: '#f5f5f5'
        }}
      />

      {/* Stock Status Chip */}
      <Chip
        label={product.status}
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          fontWeight: 'bold',
          background: product.status === 'In Stock' 
            ? gradients.accentGradient 
            : product.status === 'Low Stock'
            ? gradients.primaryGradient
            : alpha(colors.glassWhite, 0.3),
          color: '#ffffff',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#ffffff', 0.2)}`,
          zIndex: 2,
          animation: product.status === 'In Stock' ? 'glow 2s ease-in-out infinite' : 'none',
          '@keyframes glow': {
            '0%, 100%': { boxShadow: `0 0 10px ${alpha(colors.accent, 0.5)}` },
            '50%': { boxShadow: `0 0 20px ${alpha(colors.accent, 0.8)}` },
          },
        }}
      />

      {/* Badge (Best Seller, New Arrival, etc.) */}
      {product.badge && (
        <Chip
          label={product.badge}
          size="small"
          sx={{
            position: 'absolute',
            top: 44, // Positioned below the stock status chip (16px top + ~20px height + 8px gap)
            left: 16,
            fontWeight: 'bold',
            background: gradients.primaryGradient,
            color: '#ffffff',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#ffffff', 0.2)}`,
            zIndex: 2,
            fontSize: '0.65rem',
            height: 20,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ 
              fontWeight: 'bold',
              color: '#ffffff',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: gradients.accentGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }
            }}
          >
            {product.title}
          </Typography>
          {/* Version badge instead of Shopify link */}
          {product.version && (
            <Chip
              label={`v${product.version}`}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                background: alpha(colors.glassWhite, 0.1),
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 'medium',
                border: `1px solid ${alpha(colors.primary, 0.2)}`,
              }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{ 
            mb: 1,
            color: 'rgba(255,255,255,0.8)',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          {product.description}
        </Typography>

        {/* Rating and Reviews */}
        {product.rating > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
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
              ({product.reviews} reviews)
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'baseline', mt: 'auto', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                background: gradients.primaryGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ${(product.price / 100).toFixed(2)}
            </Typography>
            {product.originalPrice && (
              <Typography
                variant="body2"
                sx={{
                  textDecoration: 'line-through',
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '0.9rem',
                }}
              >
                ${(product.originalPrice / 100).toFixed(2)}
              </Typography>
            )}
            {product.discount > 0 && (
              <Chip
                label={`${product.discount}% OFF`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.65rem',
                  background: alpha('#ff6b6b', 0.9),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            )}
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)'
              }}
            >
              {product.currency}
            </Typography>
          </Box>
          
          {/* Color Options Indicator */}
          {product.colors && product.colors.length > 1 && (
            <Chip
              label={`${product.colors.length} colors`}
              size="small"
              icon={<Star sx={{ fontSize: 12 }} />}
              sx={{
                height: 20,
                fontSize: '0.65rem',
                background: gradients.accentGradient,
                color: 'white',
                fontWeight: 'bold',
                '& .MuiChip-icon': {
                  fontSize: 12,
                  color: 'white'
                },
                '& .MuiChip-label': {
                  px: 0.5
                },
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.8 },
                  '50%': { opacity: 1 },
                },
              }}
            />
          )}
        </Box>

        {product.sizes && (
          <Typography 
            variant="caption" 
            sx={{ 
              mt: 1, 
              display: 'block',
              color: 'rgba(255,255,255,0.6)',
              textShadow: '0 1px 2px rgba(0,0,0,0.3)'
            }}
          >
            Available sizes: {product.sizes.join(', ')}
          </Typography>
        )}
        
        {/* Features */}
        {product.features && product.features.length > 0 && (
          <Box sx={{ mt: 1, mb: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {product.features.map((feature, index) => (
                <Chip
                  key={index}
                  label={feature}
                  size="small"
                  icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                  sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    background: alpha(colors.accent, 0.15),
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 'medium',
                    '& .MuiChip-icon': {
                      color: colors.accent,
                      fontSize: 14,
                    },
                    '& .MuiChip-label': {
                      px: 0.5
                    },
                    border: `1px solid ${alpha(colors.accent, 0.3)}`,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
        
        {product.colors && (
          <Box sx={{ mt: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'inline',
                color: 'rgba(255,255,255,0.6)',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                mr: 1
              }}
            >
              Colors:
            </Typography>
            <Box sx={{ display: 'inline-flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
              {product.colors.map((color, index) => {
                const displayColor = colorMap[color] || '#666666';
                
                return (
                  <Chip
                    key={color}
                    label={color}
                    size="small"
                    icon={
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: displayColor,
                          border: displayColor === '#FFFFFF' ? '1px solid rgba(0,0,0,0.2)' : 'none',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                          mr: 0.5
                        }}
                      />
                    }
                    sx={{
                      height: 22,
                      fontSize: '0.7rem',
                      background: alpha(colors.glassWhite, 0.1),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(colors.primary, 0.2)}`,
                      color: 'rgba(255,255,255,0.8)',
                      '& .MuiChip-label': {
                        px: 0.5
                      },
                      '& .MuiChip-icon': {
                        ml: 0.5
                      },
                      transition: 'all 0.2s ease',
                      animation: `fadeInScale 0.3s ease-out ${index * 0.05}s both`,
                      '@keyframes fadeInScale': {
                        from: { opacity: 0, transform: 'scale(0.8)' },
                        to: { opacity: 1, transform: 'scale(1)' }
                      },
                      '&:hover': {
                        background: alpha(colors.primary, 0.2),
                        border: `1px solid ${alpha(colors.primary, 0.4)}`,
                        transform: 'scale(1.05)',
                        boxShadow: `0 2px 8px ${alpha(colors.primary, 0.3)}`,
                      }
                    }}
                  />
                );
              })}
            </Box>
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, position: 'relative', zIndex: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={product.live ? <Bolt /> : <TrendingUp />}
          endIcon={product.live ? <ShoppingCartIcon /> : null}
          disabled={!product.live}
          onClick={() => product.live && handleAddToCart(product)}
          sx={{
            background: product.live 
              ? gradients.multiGradient 
              : alpha(colors.glassWhite, 0.1),
            backgroundSize: '200% 200%',
            color: '#ffffff',
            fontWeight: 'bold',
            py: 1.5,
            borderRadius: 2,
            border: `1px solid ${alpha(product.live ? colors.primary : '#ffffff', 0.3)}`,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            animation: product.live ? 'gradient-shift 4s ease infinite' : 'none',
            '@keyframes gradient-shift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
            '&:hover': product.live ? {
              transform: 'scale(1.05)',
              boxShadow: `0 8px 32px ${alpha(colors.secondary, 0.4)}`,
            } : {},
            '&:disabled': {
              color: 'rgba(255,255,255,0.5)',
              background: alpha(colors.glassWhite, 0.05),
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: gradients.shimmerGradient,
              transition: 'left 0.5s',
            },
            '&:hover::before': product.live ? {
              left: '100%',
            } : {},
          }}
        >
          <Typography variant="body1" fontWeight="bold">
            {product.live ? 'Add to Cart' : 'Coming Soon'}
          </Typography>
        </Button>
      </CardActions>
    </Card>
  </div>
));

export default PluginCard;