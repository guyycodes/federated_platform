import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSidebar } from '../Context/SideBarContext';
import AppHeader from './components/AppHeader';
import AppSidebar from './components/AppSidebar';
import Backdrop from './components/Backdrop';
import { Outlet } from 'react-router-dom';
import SidebarProvider from '../Context/SideBarContext';

const LayoutContent = ({ isStaff }) => {
  const { isExpanded, isHovered, isMobileOpen, isMobile } = useSidebar();
  const theme = useTheme();

  // Calculate sidebar width based on screen size and state
  const getSidebarWidth = () => {
    if (isMobile) {
      // On mobile, use isMobileOpen state
      return isMobileOpen ? 290 : 90;
    } else {
      // On desktop, use isExpanded/isHovered states
      return (isExpanded || isHovered) ? 290 : 90;
    }
  };

  const sidebarWidth = getSidebarWidth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        width: '100%',
        position: 'relative'
      }}
    >
      {/* Sidebar and Backdrop */}
      <AppSidebar isStaff={isStaff} />
      <Backdrop />

      {/* Main Content Area - ALWAYS account for sidebar width */}
      <Box
        sx={{
          flexGrow: 1,
          // ALWAYS subtract sidebar width from total width
          width: `calc(100% - ${sidebarWidth}px)`,
          // ALWAYS apply left margin equal to sidebar width
          ml: `${sidebarWidth}px`,
          transition: 'all 0.2s ease-in-out', // Match sidebar transition timing
          position: 'relative',
          minHeight: '100vh',
          // Ensure content never goes behind sidebar
          minWidth: 0, // Allow flex item to shrink below its content width
          overflow: 'hidden', // Prevent horizontal scroll
        }}
      >
        {/* Header */}
        <AppHeader isStaff={isStaff} />
        
        {/* Page Content */}
        <Box
          sx={{
            p: { xs: 2, sm: 2, md: 3 },
            width: '100%',
            minHeight: 'calc(100vh - 64px)', // Account for header height
            // Add overflow handling for small screens
            overflowX: 'auto',
            overflowY: 'visible',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

// Wrap the layout with the SidebarProvider
export const ProfileContainer = ({ isStaff }) => (
  <SidebarProvider>
    <LayoutContent isStaff={isStaff} />
  </SidebarProvider>
);