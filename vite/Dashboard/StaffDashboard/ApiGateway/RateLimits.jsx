import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../../../Context/ThemeContext';
import { StaffBackgroundWrapper } from '../StaffLayout';

const RateLimits = () => {
  const { colors, fonts, theme } = useTheme();
  const isLightTheme = theme === 'light';
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';

  return (
    <StaffBackgroundWrapper>
      <Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: fonts.heading,
            fontWeight: 600,
            color: textPrimary,
            mb: 3
          }}
        >
          Rate Limits
        </Typography>
        <Typography variant="body1" sx={{ color: textPrimary }}>
          Configure and monitor API rate limits.
        </Typography>
      </Box>
    </StaffBackgroundWrapper>
  );
};

export default RateLimits;
