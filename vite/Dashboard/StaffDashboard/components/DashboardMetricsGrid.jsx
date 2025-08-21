// DashboardMetricsGrid.jsx

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import { 
  People,
  AttachMoney,
  Speed as SpeedIcon,
  Token as TokenIcon,
  Api as ApiIcon,
  Memory as MemoryIcon,
  Paid as PaidIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { GlassCard } from './Buttons';
import { useDataLayer } from '../../../Context/DataLayer';

const DashboardMetricsGrid = ({ colors, isLightTheme, textPrimary, textSecondary }) => {
  const { userPlugins, userPluginsDataRef } = useDataLayer();
  const [projects, setProjects] = useState([]);
  
  // Update projects when userPluginsDataRef changes
  useEffect(() => {
    if (userPlugins) {
      setProjects(userPlugins);
    }
  }, [userPlugins, userPluginsDataRef]);
  
  // Calculate aggregated metrics
  const metrics = {
    activeUsers: projects.reduce((sum, p) => sum + p.monthlyActiveUsers, 0),
    monthlyRevenue: projects.reduce((sum, p) => sum + p.totalRevenue, 0),
    monthlyTokens: projects.reduce((sum, p) => sum + p.totalInstalls * 1000, 0), // Mock calculation
    apiRequests: projects.reduce((sum, p) => sum + p.monthlyActiveUsers * 150, 0), // Mock calculation
    monthlyCompute: projects.reduce((sum, p) => sum + p.monthlyActiveUsers * 2.5, 0), // Mock GB calculation
    estimatedCost: projects.reduce((sum, p) => sum + p.totalRevenue * 0.15, 0), // Mock 15% platform fee
  };

  const metricConfigs = [
    { key: 'activeUsers', label: 'Active Users', value: metrics.activeUsers.toLocaleString(), icon: <People />, color: '#3B82F6', maxValue: 5000 },
    { key: 'monthlyRevenue', label: 'Monthly Revenue', value: `$${metrics.monthlyRevenue.toLocaleString()}`, icon: <AttachMoney />, color: '#4ADE80', maxValue: 50000 },
    { key: 'monthlyTokens', label: 'Monthly Tokens', value: `${(metrics.monthlyTokens / 1000).toFixed(1)}k`, icon: <TokenIcon />, color: '#F59E0B', maxValue: 1000000 },
    { key: 'apiRequests', label: 'API Requests', value: `${(metrics.apiRequests / 1000).toFixed(1)}k`, icon: <ApiIcon />, color: '#8B5CF6', maxValue: 500000 },
    { key: 'monthlyCompute', label: 'Compute', value: `${metrics.monthlyCompute.toFixed(1)}GB`, icon: <MemoryIcon />, color: '#EC4899', maxValue: 10000 },
    { key: 'estimatedCost', label: 'Est. Monthly Cost', value: `$${metrics.estimatedCost.toFixed(0)}`, icon: <PaidIcon />, color: '#00FFFF', maxValue: 10000 },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {metricConfigs.map((metric, index) => {
        const percentage = (metrics[metric.key] / metric.maxValue) * 100;
        
        return (
          <Grid size={{ xs: 6, sm: 4, md: 2 }} key={metric.key}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard
                className="stats-box"
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  height: '100%',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: `0 12px 28px ${alpha(metric.color, 0.25)}`,
                    '& .stats-value': {
                      transform: 'scale(1.1)',
                    },
                    '&::before': {
                      opacity: 1,
                      transform: 'translateX(100%)',
                    }
                  },
                  // Shimmer effect
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-100%',
                    width: '200%',
                    height: '200%',
                    background: `linear-gradient(
                      90deg,
                      transparent,
                      ${alpha(metric.color, 0.1)},
                      ${alpha(metric.color, 0.2)},
                      ${alpha(metric.color, 0.1)},
                      transparent
                    )`,
                    transform: 'translateX(-100%)',
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: 0,
                    pointerEvents: 'none',
                  },
                  // Gradient border
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -1,
                    borderRadius: 'inherit',
                    padding: 1,
                    background: `linear-gradient(135deg, ${alpha(metric.color, 0.4)}, ${alpha(metric.color, 0.1)})`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    opacity: 0.5,
                    transition: 'opacity 0.3s ease',
                  },
                  '&:hover::after': {
                    opacity: 1,
                  }
                }}
              >
                {/* Icon */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  mb: 1,
                  p: 1,
                  borderRadius: 2,
                  background: alpha(metric.color, 0.1),
                  border: `1px solid ${alpha(metric.color, 0.2)}`,
                }}>
                  {React.cloneElement(metric.icon, { 
                    sx: { 
                      fontSize: { xs: 24, sm: 28 }, 
                      color: metric.color,
                      filter: `drop-shadow(0 2px 4px ${alpha(metric.color, 0.3)})`,
                    } 
                  })}
                </Box>
                
                {/* Value */}
                <Typography 
                  variant="h5" 
                  className="stats-value"
                  sx={{ 
                    color: metric.color, 
                    fontWeight: 700, 
                    textAlign: 'center',
                    mb: 0.5,
                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                    transition: 'transform 0.3s ease',
                    textShadow: `0 2px 8px ${alpha(metric.color, 0.3)}`,
                  }}
                >
                  {metric.value}
                </Typography>
                
                {/* Label */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: textSecondary, 
                    textAlign: 'center',
                    display: 'block',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    lineHeight: 1.2,
                  }}
                >
                  {metric.label}
                </Typography>
                
                {/* Progress bar */}
                <Box sx={{ 
                  mt: 1, 
                  height: 4, 
                  borderRadius: 2,
                  background: alpha(metric.color, 0.1),
                  overflow: 'hidden',
                  position: 'relative',
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: `${Math.min(percentage, 100)}%`,
                    background: `linear-gradient(90deg, ${metric.color}, ${alpha(metric.color, 0.6)})`,
                    borderRadius: 2,
                    transition: 'width 0.5s ease-in-out',
                    boxShadow: `0 0 10px ${alpha(metric.color, 0.5)}`,
                  }} />
                </Box>
              </GlassCard>
            </motion.div>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DashboardMetricsGrid;