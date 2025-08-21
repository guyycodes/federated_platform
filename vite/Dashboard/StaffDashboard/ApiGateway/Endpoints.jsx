import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useTheme } from '../../../Context/ThemeContext';
import { StaffBackgroundWrapper } from '../StaffLayout';

const Endpoints = () => {
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
            API Endpoints
          </Typography>
          <Chip label="PRO" size="small" color="primary" />
        </Box>
        <Typography variant="body1" sx={{ color: textPrimary }}>
          Manage and monitor your API endpoints.
        </Typography>
      </Box>
    </StaffBackgroundWrapper>
  );
};

export default Endpoints;
