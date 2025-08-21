import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '../../../Context/ThemeContext';
import { StaffBackgroundWrapper } from '../StaffLayout';

const WhiteLabel = () => {
  const { colors, fonts, theme } = useTheme();
  const isLightTheme = theme === 'light';
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';

  return (
    <StaffBackgroundWrapper>
      <Box>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: fonts.heading,
              fontWeight: 600,
              color: textPrimary,
            }}
          >
            White-Label Options
          </Typography>
          <Chip label="PRO" size="small" color="primary" />
        </Box>
        <Typography variant="body1" sx={{ color: textPrimary }}>
          Customize branding and white-label settings for your plugins.
        </Typography>
      </Box>
    </StaffBackgroundWrapper>
  );
};

export default WhiteLabel;
