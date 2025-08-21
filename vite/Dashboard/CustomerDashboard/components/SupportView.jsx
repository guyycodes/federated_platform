import React from 'react';
import { Box, Paper, Typography, alpha } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTheme } from '../../../Context/ThemeContext';

const SupportView = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Support Center
      </Typography>
      
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <SupportAgentIcon sx={{ fontSize: 64, color: alpha('#000000', 0.3), mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Support Center
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Get help from our team and plugin developers
        </Typography>
      </Paper>
    </Box>
  );
};

export default SupportView; 