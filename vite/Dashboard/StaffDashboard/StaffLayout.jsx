// StaffLayout.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import { useUser } from '@clerk/clerk-react';
import { useTheme as useCustomTheme } from '../../Context/ThemeContext';
import { motion } from 'framer-motion';
import { WelcomeScreen } from './views/WelcomeScreen';
import { NewProjectModal } from './components/NewProjectModal';
import { useLocation } from 'react-router-dom';
import { useDataLayer } from '../../Context/DataLayer';

// Export the StaffBackgroundWrapper for use in other components
export const StaffBackgroundWrapper = ({ children, containerMaxWidth = "xl" }) => {
  const { gradients, theme, colors } = useCustomTheme();
  const muiTheme = useTheme();
  const isLightTheme = theme === 'light';
  const { remoteTrigger, setRemoteTrigger } = useDataLayer();

  React.useEffect(() => {
    setRemoteTrigger(remoteTrigger + 1);
  }, []);

  // Theme-aware background with sophisticated gradient
  const backgroundGradient = isLightTheme 
    ? `linear-gradient(135deg, ${alpha(colors.primary, 0.02)}, ${alpha(colors.secondary, 0.02)}, ${muiTheme.palette.grey[50]})`
    : gradients.darkGlass;

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      background: backgroundGradient,
      position: 'relative',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 },
      '&::before': isLightTheme ? {} : {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 50%, ${alpha(colors.accent, 0.05)}, transparent 50%), 
                     radial-gradient(circle at 80% 80%, ${alpha(colors.primary, 0.05)}, transparent 50%)`,
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth={containerMaxWidth}>
        {children}
      </Container>
    </Box>
  );
};

// ==================== COMPONENT ====================
const StaffDash = () => {
  const { user } = useUser();
  const location = useLocation();
  
  // State management
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [userProjects, setUserProjects] = useState([]);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Check if we're coming from the "Create New" sidebar option
  const isFromCreateNew = location.state?.fromCreateNew || false;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  return (
    <StaffBackgroundWrapper>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <WelcomeScreen 
          setShowNewProjectModal={setShowNewProjectModal} 
          customTitle={isFromCreateNew ? 'Create a new Plugin.' : null}
        />
      </motion.div>

      {/* New Project Modal */}
      <NewProjectModal 
        open={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        userProjects={userProjects}
        setUserProjects={setUserProjects}
        setIsFirstTime={setIsFirstTime}
      />
    </StaffBackgroundWrapper>
  );
};

export default StaffDash;