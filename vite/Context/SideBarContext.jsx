import React, { createContext, useContext, useState, useEffect } from "react";
import { Box } from "@mui/material";

// Create the context with default values instead of undefined
const SidebarContext = createContext({
  isExpanded: false,
  isMobileOpen: false,
  isHovered: false,
  activeItem: null,
  openSubmenu: null,
  toggleSidebar: () => {},
  toggleMobileSidebar: () => {},
  setIsHovered: () => {},
  setActiveItem: () => {},
  toggleSubmenu: () => {},
});

// Custom hook to use the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// SidebarProvider component
export const SidebarProvider = ({ children }) => {
  // Default to collapsed on mobile and medium screens, expanded on larger screens
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1280);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isHovered, setIsHovered] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [isVerySmallScreen, setIsVerySmallScreen] = useState(window.innerWidth < 300);


  useEffect(() => {
    const handleResize = () => {
      const verySmallScreen = window.innerWidth < 300;
      const mobile = window.innerWidth < 768;
      const largeScreen = window.innerWidth >= 1280;

      setIsMobile(mobile);
      setIsVerySmallScreen(verySmallScreen);
      
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 1280 && isExpanded) {
        setIsExpanded(false);
      }
      
      if (!mobile) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const toggleSubmenu = (item) => {
    setOpenSubmenu((prev) => (prev === item ? null : item));
  };

  // Provide the context values
  return (
    <SidebarContext.Provider
      value={{
        isExpanded,
        isMobileOpen,
        isHovered,
        activeItem,
        openSubmenu,
        isMobile,
        isVerySmallScreen,
        toggleSidebar,
        toggleMobileSidebar,
        setIsHovered,
        setActiveItem,
        toggleSubmenu,
      }}
    >
      <Box sx={{ display: 'flex' }}>
        {children}
      </Box>
    </SidebarContext.Provider>
  );
};

export default SidebarProvider;