import React from 'react';
import { Box, Paper, Typography, alpha } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import { useTheme } from '../../../Context/ThemeContext';

const TeamManagementView = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        Team Management
      </Typography>
      
      <Paper sx={{
        p: 8,
        textAlign: 'center',
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <GroupIcon sx={{ fontSize: 64, color: alpha('#000000', 0.3), mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Team & Access Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage team members, roles, and permissions
        </Typography>
      </Paper>
    </Box>
  );
};

export default TeamManagementView; 