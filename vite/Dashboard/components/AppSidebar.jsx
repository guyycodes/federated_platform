import React, { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";

// MUI Components
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { alpha } from "@mui/material/styles";

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import AppsIcon from "@mui/icons-material/Apps";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import SupportIcon from "@mui/icons-material/Support";
import LogoutIcon from "@mui/icons-material/Logout";
import Star from "@mui/icons-material/Star";
import PetsIcon from "@mui/icons-material/Pets";
import CloseIcon from "@mui/icons-material/Close";
import ExtensionIcon from '@mui/icons-material/Extension';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RouterIcon from '@mui/icons-material/Router';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CloudIcon from '@mui/icons-material/Cloud';
import DocumentationIcon from '@mui/icons-material/Description';
import BuildIcon from '@mui/icons-material/Build';
import SecurityIcon from '@mui/icons-material/Security';

// Your context for open/closed states and theme
import { useSidebar } from "../../Context/SideBarContext";
import { useTheme } from "../../Context/ThemeContext";

// Navigation data for customer dashboard
const customerNavItems = [
  {
    icon: <DashboardIcon />,
    name: "Dashboard",
    path: "/layout/dashboard"
  },
  {
    icon: <ExtensionIcon />,
    name: "My Plugins",
    path: "/layout/plugins"
  },
  {
    icon: <AnalyticsIcon />,
    name: "Analytics",
    path: "/layout/analytics"
  },
  {
    icon: <RouterIcon />,
    name: "API Gateway",
    path: "/layout/gateway"
  },
  {
    icon: <AccountTreeIcon />,
    name: "Workflows",
    path: "/layout/workflows"
  },
  {
    icon: <GroupIcon />,
    name: "Team",
    path: "/layout/team"
  },
  {
    icon: <PaymentIcon />,
    name: "Billing",
    path: "/layout/billing"
  },
  {
    icon: <StorefrontIcon />,
    name: "Marketplace",
    path: "/layout/marketplace"
  }
];

// Navigation data for ML/LLM plugin developer dashboard (staff)
const staffNavItems = [
  {
    icon: <DashboardIcon />,
    name: "Dashboard",
    path: "/staff/dash"
  },
  {
    name: "Plugins",
    icon: <ExtensionIcon />,
    subItems: [
      { name: "View All", path: "/staff/plugins" },
      { name: "Create New", path: "/staff/dash/new", new: true, state: { fromCreateNew: true } },
      { name: "Browse Catalog", path: "/staff/plugins/catalog" },
      { name: "Community Plugins", path: "/staff/plugins/community" },
    ],
  },
  {
    name: "API Gateway",
    icon: <RouterIcon />,
    subItems: [
      { name: "API Keys", path: "/staff/api/keys" },
      { name: "Rate Limits", path: "/staff/api/limits" },
      { name: "Endpoints", path: "/staff/api/endpoints", pro: true  },
    ],
  },
  {
    name: "Analytics",
    icon: <AnalyticsIcon />,
    subItems: [
      { name: "Usage", path: "/staff/analytics/usage", new: true, },
      { name: "Performance", path: "/staff/analytics/performance" },
      { name: "Telemetry", path: "/staff/analytics/telemetry", pro: true  },
      { name: "Revenue", path: "/staff/analytics/revenue" },
    ],
  },
  {
    name: "Platform",
    icon: <CloudIcon />,
    subItems: [
      { name: "Deployments", path: "/staff/platform/deployments" },
      { name: "Rollback", path: "/staff/platform/rollback" },
      { name: "Monitoring", path: "/staff/platform/monitoring", pro: true  },
      { name: "Review Queue", path: "/staff/platform/review" },
    ],
  },
  {
    name: "Admin Panel",
    icon: <SettingsIcon />,
    subItems: [
      { name: "Settings", path: "/staff/admin/settings" },
      { name: "Payouts", path: "/staff/admin/payouts", pro: true },
      { name: "White-Label", path: "/staff/admin/whitelabel", pro: true },
    ],
  },
];

const othersItems = [
  {
    name: "Documentation",
    icon: <DocumentationIcon />,
    path: "/layout/docs"
  },
  {
    name: "Developer Tools",
    icon: <BuildIcon />,
    path: "/layout/devtools",
  }
];

export default function AppSidebar({ isStaff = true }) {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, isMobile, toggleMobileSidebar, isVerySmallScreen } = useSidebar();
  const { colors, gradients, fonts, glassmorphism, theme } = useTheme();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // Select navigation items based on user type
  const navItems = isStaff ? staffNavItems : customerNavItems;

  // Theme-aware colors
  const isLightTheme = theme === 'light';
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const textDisabled = isLightTheme ? 'rgba(0,0,0,0.38)' : 'rgba(255,255,255,0.5)';
  const backgroundPaper = isLightTheme ? '#ffffff' : colors.background;
  const backgroundDefault = isLightTheme ? '#f5f5f5' : colors.surface;
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);

  // Check if a path is active, highlight the option if it is active
  const isActive = useCallback(
    (path) => {
      if (!path) return false;
      
      // For dashboard, only match exact path to avoid highlighting on /staff/dash/new
      if (path === '/staff/dash') {
        return location.pathname === path;
      }
      
      // For other paths, either exact match or starts with the path (for nested routes)
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    },
    [location]
  );

  // Open the submenu if the current path is in there
  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  // Dynamically set the submenu height for smooth collapse
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.menuType}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key].scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.menuType === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { menuType: menuType, index };
    });
  };

  // Render a list of items (both main and others)
  const renderMenuItems = (items, menuType) => {
    // Use the same width calculation as the main drawer
    const drawerWidth = (() => {
      if (isMobile) {
        return isMobileOpen ? 290 : 90;
      } else {
        return (isExpanded || isHovered) ? 290 : 90;
      }
    })();

    return (
      <List>
        {items.map((nav, index) => {
          const isThisSubmenuOpen =
            openSubmenu?.menuType === menuType && openSubmenu?.index === index && drawerWidth > 90;
          
          const isItemActive = isActive(nav.path);

          return (
            <React.Fragment key={nav.name}>
              {/* If it has subItems, it's a collapsible section */}
              {nav.subItems ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleSubmenuToggle(index, menuType)}
                      sx={{
                        background: isThisSubmenuOpen ? alpha(colors.secondary, 0.1) : 'transparent',
                        backdropFilter: isThisSubmenuOpen ? 'blur(10px)' : 'none',
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        border: isThisSubmenuOpen ? `1px solid ${alpha(colors.secondary, 0.3)}` : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: alpha(colors.secondary, 0.15),
                          backdropFilter: 'blur(15px)',
                          transform: 'scale(1.02)',
                          boxShadow: `0 4px 16px ${alpha(colors.secondary, 0.2)}`,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 36, 
                        color: isThisSubmenuOpen ? colors.secondary : textSecondary,
                        filter: isThisSubmenuOpen ? `drop-shadow(0 2px 4px ${alpha(colors.secondary, 0.5)})` : 'none',
                      }}>
                        {nav.icon}
                      </ListItemIcon>
                      {drawerWidth > 90 && (
                        <ListItemText 
                          primary={nav.name} 
                          primaryTypographyProps={{ 
                            sx: { 
                              fontWeight: isThisSubmenuOpen ? 600 : 400,
                              color: isThisSubmenuOpen ? colors.secondary : textPrimary,
                              fontFamily: fonts.body,
                            } 
                          }} 
                        />
                      )}
                      {drawerWidth > 90 && (
                        <KeyboardArrowDownIcon
                          sx={{
                            transform: isThisSubmenuOpen ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform 0.3s ease',
                            color: isThisSubmenuOpen ? colors.secondary : textSecondary,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={isThisSubmenuOpen} timeout="auto" unmountOnExit>
                    <Box
                      ref={(el) => {
                        subMenuRefs.current[`${menuType}-${index}`] = el;
                      }}
                      sx={{ pl: 4 }}
                    >
                      <List component="div" disablePadding>
                        {nav.subItems.map((subItem) => {
                          const isSubItemActive = isActive(subItem.path);
                          
                          return (
                            <ListItem
                              key={subItem.name}
                              disablePadding
                            >
                              <ListItemButton 
                                component={Link} 
                                to={subItem.path}
                                state={subItem.state}
                                sx={{
                                  background: isSubItemActive ? alpha(colors.accent, 0.15) : 'transparent',
                                  backdropFilter: isSubItemActive ? 'blur(10px)' : 'none',
                                  borderRadius: 2,
                                  mx: 1,
                                  my: 0.25,
                                  border: isSubItemActive ? `1px solid ${alpha(colors.accent, 0.3)}` : 'none',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    background: alpha(colors.accent, 0.1),
                                    backdropFilter: 'blur(10px)',
                                    transform: 'scale(1.02)',
                                    boxShadow: `0 4px 16px ${alpha(colors.accent, 0.2)}`,
                                  },
                                }}
                              >
                                <ListItemText
                                  primary={
                                    <Box display="flex" alignItems="center">
                                      <Typography 
                                        variant="body2" 
                                        sx={{ 
                                          fontWeight: isSubItemActive ? 600 : 400,
                                          color: isSubItemActive ? colors.accent : textPrimary,
                                          fontFamily: fonts.body,
                                        }}
                                      >
                                        {subItem.name}
                                      </Typography>
                                      {/* Show badges (new / pro) if needed */}
                                      {subItem.new && (
                                        <Typography
                                          variant="caption"
                                          sx={{ 
                                            ml: "auto", 
                                            pl: 1,
                                            background: gradients.primaryGradient,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold',
                                          }}
                                        >
                                          new
                                        </Typography>
                                      )}
                                      {subItem.pro && (
                                        <Typography
                                          variant="caption"
                                          sx={{ 
                                            ml: "auto", 
                                            pl: 1,
                                            background: gradients.multiGradient,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            fontWeight: 'bold',
                                          }}
                                        >
                                          pro
                                        </Typography>
                                      )}
                                    </Box>
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Box>
                  </Collapse>
                </>
              ) : (
                // If it doesn't have subItems, it's a direct link
                nav.path && (
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={nav.path}
                      sx={{
                        background: isItemActive ? alpha(colors.primary, 0.15) : 'transparent',
                        backdropFilter: isItemActive ? 'blur(10px)' : 'none',
                        borderRadius: 2,
                        mx: 1,
                        my: 0.5,
                        border: isItemActive ? `1px solid ${alpha(colors.primary, 0.3)}` : 'none',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: alpha(colors.primary, 0.1),
                          backdropFilter: 'blur(10px)',
                          transform: 'scale(1.02)',
                          boxShadow: `0 4px 16px ${alpha(colors.primary, 0.2)}`,
                        },
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: 36, 
                        color: isItemActive ? colors.primary : textSecondary,
                        filter: isItemActive ? `drop-shadow(0 2px 4px ${alpha(colors.primary, 0.5)})` : 'none',
                      }}>
                        {nav.icon}
                      </ListItemIcon>
                      {drawerWidth > 90 && (
                        <ListItemText 
                          primary={nav.name} 
                          primaryTypographyProps={{ 
                            sx: { 
                              fontWeight: isItemActive ? 600 : 400,
                              color: isItemActive ? colors.primary : textPrimary,
                              fontFamily: fonts.body,
                            } 
                          }} 
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                )
              )}
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  // Decide how wide the drawer should be based on screen size and state
  const drawerWidth = (() => {
    if (isMobile) {
      // On mobile, drawer is always collapsed unless explicitly opened
      return isMobileOpen ? 290 : 90;
    } else {
      // On desktop, use expand/hover states
      return (isExpanded || isHovered) ? 290 : 90;
    }
  })();

  return (
    <Drawer
      variant="permanent"
      open={isMobile ? isMobileOpen : isExpanded}
      onMouseEnter={() => !isMobile && !isExpanded && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: 'fixed',
        zIndex: 1200,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: 'width 0.2s ease-in-out',
          border: 'none',
          position: 'fixed',
          height: '100%',
          background: isLightTheme ? alpha(backgroundDefault, 0.98) : alpha(colors.glassWhite, 0.08),
          backdropFilter: 'blur(25px)',
          borderRight: `1px solid ${borderColor}`,
          boxShadow: isLightTheme ? `8px 0 32px ${alpha(colors.secondary, 0.1)}` : `8px 0 32px ${alpha(colors.accent, 0.3)}`,
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: gradients.shimmerGradient,
            opacity: 0.05,
            animation: 'sidebarShimmer 4s ease-in-out infinite',
            '@keyframes sidebarShimmer': {
              '0%': { transform: 'translateY(-100%)' },
              '100%': { transform: 'translateY(100%)' },
            },
          },
        },
      }}
    >
      {/* Enhanced Top logo/brand area */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ 
          p: 2,
          position: 'relative',
          zIndex: 2,
          background: isLightTheme ? alpha(colors.primary, 0.05) : alpha(colors.glassWhite, 0.1),
          backdropFilter: 'blur(15px)',
          borderBottom: `1px solid ${alpha(colors.lottieGreen, 0.2)}`,
          boxShadow: `0 4px 16px ${alpha(colors.lottieGreen, 0.2)}`,
        }}
      >
        {drawerWidth > 90 ? (
          <>
            <Box display="flex" alignItems="center">
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  my: -0.7,
                  borderRadius: '50%',
                  background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.15),
                  backdropFilter: 'blur(15px)',
                  border: `2px solid ${alpha(colors.lottieGreen, 0.4)}`,
                  mr: 1,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -4,
                    left: -4,
                    right: -4,
                    bottom: -4,
                    background: gradients.accentGradient,
                    borderRadius: '50%',
                    opacity: 0.3,
                    animation: 'sidebarLogoGlow 4s ease-in-out infinite',
                    '@keyframes sidebarLogoGlow': {
                      '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                      '50%': { opacity: 0.5, transform: 'scale(1.05)' },
                    },
                  },
                }}
              >
                <PetsIcon sx={{ 
                  color: colors.lottieGreen, 
                  fontSize: 28,
                  filter: `drop-shadow(0 2px 4px ${alpha(colors.lottieGreen, 0.5)})`,
                  position: 'relative',
                  zIndex: 2,
                }} />
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 0,
                  fontFamily: fonts.brand,
                  background: gradients.accentGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 255, 255, 0.5))',
                  fontWeight: 'bold',
                }}
              >
                Buster & Co.
              </Typography>
            </Box>
            {/* Close button for mobile */}
            {isMobile && isMobileOpen && (
              <IconButton
              onClick={toggleMobileSidebar}
              sx={{
                color: textPrimary,
                background: isLightTheme ? alpha(colors.primary, 0.1) : alpha(colors.glassWhite, 0.1),
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isLightTheme ? alpha(colors.primary, 0.2) : alpha(colors.glassWhite, 0.2)}`,
                mx: isVerySmallScreen ? 3 : 'none', // Reduce spacing on very small screens
                '&:hover': {
                  background: isLightTheme ? alpha(colors.primary, 0.2) : alpha(colors.glassWhite, 0.2),
                  color: isLightTheme ? colors.primary : colors.white,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
              }}
              >
                
              <CloseIcon />

              </IconButton>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              my: -0.7,
              ...(isMobile && !isMobileOpen && {
                borderRadius: '50%',
                left: 10,
                background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.15),
                backdropFilter: 'blur(15px)',
                border: `2px solid ${alpha(colors.lottieGreen, 0.4)}`,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  background: gradients.accentGradient,
                  borderRadius: '50%',
                  opacity: 0.3,
                  animation: 'sidebarLogoGlow 4s ease-in-out infinite',
                  '@keyframes sidebarLogoGlow': {
                    '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                    '50%': { opacity: 0.5, transform: 'scale(1.05)' },
                  },
                },
              }),
            }}
          >
            {isMobile && !isMobileOpen && (
              <PetsIcon sx={{ 
                color: colors.lottieGreen, 
                fontSize: 28,
                filter: `drop-shadow(0 2px 4px ${alpha(colors.lottieGreen, 0.5)})`,
                position: 'relative',
                zIndex: 2,
              }} />
            )}
          </Box>
        )}
      </Box>

      {/* Enhanced Main navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", position: 'relative', zIndex: 2 }}>
        {/* Enhanced "Menu" header */}
        <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center' }}>
          {drawerWidth > 90 ? (
            <>
              <Typography 
                variant="caption" 
                sx={{ 
                  textTransform: "uppercase",
                  color: textDisabled,
                  fontFamily: fonts.body,
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}
              >
                Menu
              </Typography>
              <Star sx={{ 
                color: colors.accent, 
                ml: 1,
                fontSize: 12,
                animation: 'starTwinkle 2s ease-in-out infinite',
                '@keyframes starTwinkle': {
                  '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                  '50%': { opacity: 1, transform: 'scale(1.2)' },
                },
              }} />
            </>
          ) : (
            <MoreHorizIcon sx={{ color: textDisabled }} />
          )}
        </Box>
        {renderMenuItems(navItems, "main")}

        {/* Enhanced "Others" header */}
        <Box sx={{ px: 2, py: 2, mt: 2, display: 'flex', alignItems: 'center' }}>
          {drawerWidth > 90 ? (
            <>
              <Typography 
                variant="caption" 
                sx={{ 
                  textTransform: "uppercase",
                  color: textDisabled,
                  fontFamily: fonts.body,
                  fontWeight: 'bold',
                  letterSpacing: 1,
                }}
              >
                Others
              </Typography>
              <Star sx={{ 
                color: colors.primary, 
                ml: 1,
                fontSize: 12,
                animation: 'starTwinkle 2s ease-in-out infinite 1s',
              }} />
            </>
          ) : (
            <MoreHorizIcon sx={{ color: textDisabled }} />
          )}
        </Box>
        {renderMenuItems(othersItems, "others")}
      </Box>
    </Drawer>
  );
}
