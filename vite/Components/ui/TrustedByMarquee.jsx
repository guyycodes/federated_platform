import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../Context/ThemeContext';

// Sample organizations - replace with actual client logos/names
const trustedOrganizations = [
  { id: 1, name: 'Deloitte', type: 'Big 4 Audit', initials: 'D' },
  { id: 2, name: 'JP Morgan', type: 'Financial Services', initials: 'JPM' },
  { id: 3, name: 'Anthem Health', type: 'Healthcare', initials: 'AH' },
  { id: 4, name: 'US Treasury', type: 'Federal Agency', initials: 'UST' },
  { id: 5, name: 'HSBC', type: 'Global Banking', initials: 'H' },
  { id: 6, name: 'Target Corp', type: 'Retail', initials: 'T' },
  { id: 7, name: 'Chevron', type: 'Energy', initials: 'C' },
  { id: 8, name: 'Accenture', type: 'Consulting', initials: 'A' },
];

const TrustedByMarquee = ({ isContactSection }) => {
  const { colors, glassmorphism } = useTheme();
  
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        py: 2,
        overflow: 'hidden',
        borderRadius: 1.5,
        background: 'rgba(255, 255, 255, 0.02)',
        // border: '1px solid rgba(255, 255, 255, 0.08)',
        // Create fade effects on both edges
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '40px',
          height: '100%',
          background: 'linear-gradient(to right, rgba(20, 20, 30, 1) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          width: '40px',
          height: '100%',
          background: 'linear-gradient(to left, rgba(20, 20, 30, 1) 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none'
        }
      }}
    >
      <Typography
        variant="caption"
        align="center"
        sx={{ 
          mb: 1.5, 
          display: 'block',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          fontWeight: 600,
        }}
      >
        {isContactSection ? '' : 'Trusted by Leading Organizations'}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          width: 'max-content',
          // Continuous scrolling animation
          animation: 'compactScroll 25s linear infinite',
          '@keyframes compactScroll': {
            '0%': { 
              transform: 'translateX(0)' 
            },
            '100%': { 
              transform: 'translateX(-50%)' 
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
        {/* Render organizations twice for seamless loop */}
        {[...trustedOrganizations, ...trustedOrganizations].map((org, index) => (
          <Box
            key={`${org.id}-${index}`}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 'max-content',
              px: 1.5,
            }}
          >
            {/* Organization Icon/Logo Placeholder */}
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}15)`,
                // border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  borderColor: colors.accent,
                  boxShadow: `0 3px 8px ${colors.accent}20`,
                },
              }}
            >
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: org.initials?.length > 1 ? '0.75rem' : '1rem',
                  fontWeight: 'bold',
                }}
              >
                {org.initials || org.name.charAt(0)}
              </Typography>
            </Box>
            
            {/* Organization Name */}
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.65rem',
                fontWeight: 500,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {org.name}
            </Typography>
            
            {/* Organization Type */}
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontSize: '0.6rem',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                lineHeight: 1.2,
              }}
            >
              {org.type}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TrustedByMarquee;
