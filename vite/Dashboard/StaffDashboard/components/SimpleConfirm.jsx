import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  alpha
} from '@mui/material';
import { PrimaryButton, GlassCard } from './Buttons';
import { useTheme as useCustomTheme } from '../../../Context/ThemeContext';

export const SimpleConfirm = ({ open, onClose, onConfirm, message, shouldHideCloseButton, confirmText = 'Yes' }) => {
  const { theme, colors } = useCustomTheme();
  const isLightTheme = theme === 'light';
  
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const backgroundPaper = isLightTheme ? '#ffffff' : colors.background;
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.1),
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${borderColor}`,
          borderRadius: 2,
          p: 2
        }
      }}
    >
      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body1" sx={{ color: textPrimary, textAlign: 'center' }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
        <PrimaryButton
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </PrimaryButton>
        
        {!shouldHideCloseButton && (
        <PrimaryButton
          onClick={() => {
            onConfirm();
          }}
          sx={{ minWidth: 100 }}
        >
          {confirmText}
        </PrimaryButton>
        )}

      </DialogActions>
    </Dialog>
  );
};