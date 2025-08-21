import React from 'react';
import { Box, Typography } from '@mui/material';

const petBrands = [
  // { id: 1, name: 'Purina', src: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/082011/dogui_logos_0.ai-converted.png?itok=bt_JTzBt', alt: 'Purina' },
  { id: 2, name: 'Pedigree', src: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/0015/6272/brand.gif?itok=Db1W4XGs" alt="Logo of pedigree', alt: 'Pedigree' },
  { id: 3, name: 'Royal Canin', src: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/0015/3880/brand.gif?itok=Qo53QnwF', alt: 'Royal Canin' },
  { id: 4, name: 'Blue Buffalo', src: 'https://cdn.brandfetch.io/idsN7MUy1F/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B', alt: 'Blue Buffalo' },
  // { id: 5, name: 'Hill\'s', src: 'https://logos-world.net/wp-content/uploads/2021/02/Hills-Pet-Nutrition-Logo.png', alt: 'Hill\'s Pet Nutrition' },
  { id: 6, name: 'Purina', src: 'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-original-577x577/s3/082011/dogui_logos_0.ai-converted.png?itok=bt_JTzBt', alt: 'Purina' },
  // { id: 7, name: 'Petco', src: 'https://logos-world.net/wp-content/uploads/2020/12/Petco-Logo.png', alt: 'Petco' },
  // { id: 8, name: 'PetSmart', src: 'https://logos-world.net/wp-content/uploads/2020/12/PetSmart-Logo.png', alt: 'PetSmart' }
];

const ScrollingMarquee = () => (
  <Box
    component="section"
    aria-label="Trusted pet brands"
    sx={{
      position: 'relative',
      width: '100%',
      bgcolor: '#f5f5f5',
      py: 4,
      overflow: 'hidden',
      // Create fade effects on both edges
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100px',
        height: '100%',
        background: 'linear-gradient(to right, #f5f5f5 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none'
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100%',
        background: 'linear-gradient(to left, #f5f5f5 0%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none'
      }
    }}
  >
    <Typography
      variant="h6"
      align="center"
      fontWeight="bold"
      sx={{ mb: 3, color: '#1A2238', zIndex: 3, position: 'relative' }}
    >
      Trusted by Pet Parents & Professionals
    </Typography>

    <Box
      sx={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: 'max-content',
        // Start from full width off-screen to the right, scroll to full width off-screen to the left
        animation: 'smoothScroll 45s linear infinite',
        '@keyframes smoothScroll': {
          '0%': { 
            transform: 'translateX(100vw)' 
          },
          '100%': { 
            transform: 'translateX(-100%)' 
          }
        },
        // Respect users who prefer reduced motion
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          transform: 'translateX(0)',
          justifyContent: 'center'
        },
        // Pause animation on hover for accessibility
        '&:hover': {
          animationPlayState: 'paused'
        }
      }}
    >
      {/* Render all logos */}
      {petBrands.map((brand) => (
        <Box
          key={brand.id}
          component="img"
          src={brand.src}
          alt={brand.alt}
          loading="lazy"
          draggable={false}
          onError={(e) => {
            // Fallback to text if image fails to load
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
          sx={{
            height: 50,
            maxWidth: 120,
            objectFit: 'contain',
            filter: 'grayscale(30%) brightness(0.9)',
            opacity: 0.8,
            transition: 'all 0.3s ease',
            flexShrink: 0,
            '&:hover': {
              filter: 'grayscale(0%) brightness(1)',
              opacity: 1,
              transform: 'scale(1.05)'
            }
          }}
        />
      ))}
      
      {/* Fallback text elements (hidden by default) */}
      {petBrands.map((brand) => (
        <Typography
          key={`text-${brand.id}`}
          variant="h6"
          sx={{
            display: 'none',
            color: '#1A2238',
            fontWeight: 'bold',
            px: 2,
            py: 1,
            bgcolor: 'white',
            borderRadius: 1,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            flexShrink: 0,
            minWidth: 'max-content'
          }}
        >
          {brand.name}
        </Typography>
      ))}
    </Box>
  </Box>
);

export default ScrollingMarquee;
