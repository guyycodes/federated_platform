// Buttons.jsx

import React from 'react';
import { Button, Card, alpha, useTheme as useMUITheme } from '@mui/material';
import { useTheme } from '../../../Context/ThemeContext';

// Color configuration - easy to control here
const BUTTON_COLORS = {
  // Glass card variants
  glass: {
    default: {
      backgroundOpacity: 0.05,
      backdropBlur: '10px',
      borderOpacity: 0.1,
    },
    strong: {
      backgroundOpacity: 0.15,
      backdropBlur: '20px',
      borderOpacity: 0.3,
    },
    highlight: {
      backgroundOpacity: 0.1,
      backdropBlur: '15px',
      borderOpacity: 0.3,
    }
  },
  // Button styles
  primary: {
    textColor: '#fff',
    fontWeight: 600,
  },
  accent: {
    textColor: '#000',
    fontWeight: 600,
  }
};

// Custom styled glass card component
export const GlassCard = ({ children, variant = 'default', ...props }) => {
  const muiTheme = useMUITheme();
  const { colors } = useTheme();
  
  const variants = {
    default: {
      background: alpha(muiTheme.palette.common.white, BUTTON_COLORS.glass.default.backgroundOpacity),
      backdropFilter: `blur(${BUTTON_COLORS.glass.default.backdropBlur})`,
      border: `1px solid ${alpha(muiTheme.palette.common.white, BUTTON_COLORS.glass.default.borderOpacity)}`,
    },
    strong: {
      background: alpha(muiTheme.palette.common.white, BUTTON_COLORS.glass.strong.backgroundOpacity),
      backdropFilter: `blur(${BUTTON_COLORS.glass.strong.backdropBlur})`,
      border: `1px solid ${alpha(muiTheme.palette.common.white, BUTTON_COLORS.glass.strong.borderOpacity)}`,
    },
    highlight: {
      background: `linear-gradient(135deg, ${alpha(colors.primary, BUTTON_COLORS.glass.highlight.backgroundOpacity)}, ${alpha(colors.secondary, BUTTON_COLORS.glass.highlight.backgroundOpacity)})`,
      backdropFilter: `blur(${BUTTON_COLORS.glass.highlight.backdropBlur})`,
      border: `1px solid ${alpha(colors.primary, BUTTON_COLORS.glass.highlight.borderOpacity)}`,
    }
  };

  return (
    <Card 
      {...props}
      sx={{
        ...variants[variant],
        borderRadius: 2,
        overflow: 'visible',
        ...props.sx
      }}
    >
      {children}
    </Card>
  );
};

// Primary button with gradient background and glassmorphism
export const PrimaryButton = ({ children, ...props }) => {
  const { gradients, theme, colors, glassmorphism } = useTheme();
  const isLightTheme = theme === 'light';
  
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        background: gradients.primaryGradient,
        color: BUTTON_COLORS.primary.textColor,
        fontWeight: BUTTON_COLORS.primary.fontWeight,
        textTransform: 'none',
        borderRadius: 2,
        px: 3,
        py: 1.5,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(colors.primary, 0.3)}`,
        boxShadow: isLightTheme 
          ? `0 4px 16px ${alpha(colors.primary, 0.2)}` 
          : `0 4px 16px ${alpha(colors.primary, 0.4)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: gradients.primaryGradient,
          transform: 'translateY(-2px)',
          boxShadow: isLightTheme 
            ? `0 8px 24px ${alpha(colors.primary, 0.3)}` 
            : `0 8px 24px ${alpha(colors.primary, 0.5)}`,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx
      }}
    >
      {children}
    </Button>
  );
};

// Accent button with cyan gradient and glassmorphism
export const AccentButton = ({ children, ...props }) => {
  const { gradients, theme, colors, glassmorphism } = useTheme();
  const isLightTheme = theme === 'light';
  
  return (
    <Button
      variant="contained"
      {...props}
      sx={{
        background: gradients.accentGradient,
        color: BUTTON_COLORS.accent.textColor,
        fontWeight: BUTTON_COLORS.accent.fontWeight,
        textTransform: 'none',
        borderRadius: 2,
        px: 3,
        py: 1.5,
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(colors.accent, 0.3)}`,
        boxShadow: isLightTheme 
          ? `0 4px 16px ${alpha(colors.accent, 0.2)}` 
          : `0 4px 16px ${alpha(colors.accent, 0.4)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: gradients.accentGradient,
          transform: 'translateY(-2px)',
          boxShadow: isLightTheme 
            ? `0 8px 24px ${alpha(colors.accent, 0.3)}` 
            : `0 8px 24px ${alpha(colors.accent, 0.5)}`,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx
      }}
    >
      {children}
    </Button>
  );
};

// Glass button with pure glassmorphism effect
export const GlassButton = ({ children, variant = 'default', ...props }) => {
  const { theme, colors, glassmorphism } = useTheme();
  const isLightTheme = theme === 'light';
  
  return (
    <Button
      {...props}
      sx={{
        background: isLightTheme 
          ? alpha(colors.glassWhite, 0.8)
          : alpha(colors.glassWhite, 0.1),
        backdropFilter: 'blur(15px)',
        border: `1px solid ${isLightTheme 
          ? alpha(colors.primary, 0.2)
          : alpha(colors.glassWhite, 0.2)}`,
        color: isLightTheme ? colors.primary : '#fff',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
        px: 3,
        py: 1.5,
        boxShadow: isLightTheme 
          ? `0 4px 16px ${alpha(colors.primary, 0.1)}` 
          : `0 4px 16px ${alpha(colors.glassWhite, 0.2)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          background: isLightTheme 
            ? alpha(colors.glassWhite, 0.9)
            : alpha(colors.glassWhite, 0.15),
          transform: 'translateY(-2px)',
          boxShadow: isLightTheme 
            ? `0 8px 24px ${alpha(colors.primary, 0.2)}` 
            : `0 8px 24px ${alpha(colors.glassWhite, 0.3)}`,
          border: `1px solid ${isLightTheme 
            ? alpha(colors.primary, 0.3)
            : alpha(colors.glassWhite, 0.3)}`,
        },
        '&:active': {
          transform: 'translateY(0)',
        },
        ...props.sx
      }}
    >
      {children}
    </Button>
  );
};
