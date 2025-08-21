import { useSidebar } from "../../Context/SideBarContext";
import { useTheme } from "../../Context/ThemeContext";
import React from "react";
import { Box } from "@mui/material";

const Backdrop = () => {
  const { isMobileOpen, toggleMobileSidebar, isMobile } = useSidebar();
  const { theme } = useTheme();

  // Only show backdrop on mobile when sidebar is open
  if (!isMobile || !isMobileOpen) return null;

  // Theme-aware colors
  const isLightTheme = theme === 'light';
  const backdropColor = isLightTheme ? "rgba(0, 0, 0, 0.5)" : "rgba(17, 24, 39, 0.5)";

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1190, // Below sidebar (1200) but above content
        bgcolor: backdropColor,
        backdropFilter: "blur(2px)",
      }}
      onClick={toggleMobileSidebar}
      role="presentation"
    />
  );
};

export default Backdrop;