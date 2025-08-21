// WelcomeScreen.jsx

import React from 'react';
import { Box, Typography, Chip, Fade, alpha } from '@mui/material';
import { 
  Info, 
  RocketLaunch, 
  Bolt, 
  Security, 
  AttachMoney, 
  Language, 
  Add,
  Code as CodeIcon
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { AccentButton } from '../components/Buttons';
import { useTheme } from '../../../Context/ThemeContext';

// Text content - easy to edit here
const WELCOME_TEXT = {
  title: 'Welcome to the Plugin Marketplace!',
  subtitle: 'Launch ML/LLM plugins in minutes with one‑click scaffolding, GPU or Managed inference with scaling.',
  features: [
    { text: 'Run Local or Managed' },
    { text: 'Zero per‑inference cost' },
    { text: 'Predictable pricing' },
    { text: 'Data privacy' },
    { text: 'No external API calls' },
    { text: 'End‑to‑end scaffolding & CI' },
    { text: 'Federation‑ready plugin architecture' }
  ],
  buttonText: 'Create',
  infoText: 'Only 3 plugin slots remaining this week – secure yours now!'
};

export const WelcomeScreen = ({ setShowNewProjectModal, customTitle }) => {
  const { theme, colors, gradients, glassmorphism } = useTheme();
  const isLightTheme = theme === 'light';
  
  // Theme-aware colors
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  
  // Use custom title if provided, otherwise use default
  const displayTitle = customTitle || WELCOME_TEXT.title;
  
  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
          maxWidth: 800,
          mx: 'auto'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: gradients.multiGradient,
              backdropFilter: 'blur(15px)',
              border: `2px solid ${alpha(colors.primary, 0.3)}`,
              boxShadow: isLightTheme 
                ? `0 8px 32px ${alpha(colors.primary, 0.3)}` 
                : `0 8px 32px ${alpha(colors.primary, 0.5)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 4,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -4,
                borderRadius: '50%',
                background: gradients.multiGradient,
                opacity: 0.3,
                filter: 'blur(20px)',
                animation: 'pulse 3s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                  '50%': { opacity: 0.5, transform: 'scale(1.1)' },
                },
              },
            }}
          >
            <RocketLaunch sx={{ fontSize: 60, color: '#fff', position: 'relative', zIndex: 1 }} />
          </Box>
        </motion.div>

        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: '"Playfair Display", serif',
            fontWeight: 700,
            mb: 2,
            background: gradients.primaryGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 2px 4px ${alpha(colors.primary, 0.3)})`,
          }}
        >
          {displayTitle}
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            color: textSecondary,
            mb: 6,
            lineHeight: 1.6
          }}
        >
          {WELCOME_TEXT.subtitle}
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mb: 6,
          maxWidth: 700,
          mx: 'auto'
        }}>
          {[
            { icon: <Bolt />, text: WELCOME_TEXT.features[0].text },
            { icon: <Security />, text: WELCOME_TEXT.features[1].text },
            { icon: <AttachMoney />, text: WELCOME_TEXT.features[2].text },
            { icon: <Language />, text: WELCOME_TEXT.features[3].text },
            { icon: <CloseIcon/>, text: WELCOME_TEXT.features[4].text },
            { icon: <CodeIcon />, text: WELCOME_TEXT.features[5].text },
            { icon: <CodeIcon />, text: WELCOME_TEXT.features[6].text }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              style={{ display: 'flex' }}
            >
              <Chip
                icon={feature.icon}
                label={feature.text}
                sx={{
                  py: 2.5,
                  px: 2,
                  fontSize: '14px',
                  width: '100%',
                  justifyContent: 'flex-start',
                  background: isLightTheme 
                    ? alpha(colors.glassWhite, 0.8)
                    : alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isLightTheme 
                    ? alpha(colors.accent, 0.2)
                    : alpha(colors.glassWhite, 0.2)}`,
                  color: isLightTheme ? colors.secondary : '#fff',
                  boxShadow: isLightTheme 
                    ? `0 4px 16px ${alpha(colors.accent, 0.1)}` 
                    : `0 4px 16px ${alpha(colors.glassWhite, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '& .MuiChip-icon': {
                    color: colors.accent,
                    marginRight: 1
                  },
                  '& .MuiChip-label': {
                    textAlign: 'left',
                    whiteSpace: 'normal',
                    display: 'block',
                    lineHeight: 1.4
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: isLightTheme 
                      ? `0 8px 24px ${alpha(colors.accent, 0.2)}` 
                      : `0 8px 24px ${alpha(colors.glassWhite, 0.3)}`,
                  }
                }}
              />
            </motion.div>
          ))}
        </Box>

        <AccentButton
          size="large"
          startIcon={<Add />}
          onClick={() => setShowNewProjectModal(true)}
          sx={{ px: 6, py: 2, fontSize: '18px' }}
        >
          {WELCOME_TEXT.buttonText}
        </AccentButton>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" sx={{ color: textSecondary }}>
            <Info sx={{ fontSize: 16, verticalAlign: 'middle', mr: 1 }} />
            {WELCOME_TEXT.infoText}
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};