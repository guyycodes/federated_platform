// ViewDetailsModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  alpha,
  Chip,
  Skeleton
} from '@mui/material';
import {
  GitHub,
  Close,
  Info,
  Code,
  Description,
  Settings
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitHub } from '../../../hooks/useGitHub';

// Text constants
const TEXT = {
  dialog: {
    title: (pluginName) => `Plugin Details: ${pluginName}`,
    subtitle: 'Configuration from app.config.json'
  },
  
  repository: {
    noRepo: 'No repository linked',
    fetchingDetails: 'Fetching repository details...'
  },
  
  config: {
    noConfig: 'No app.config.json found in repository',
    fetchingConfig: 'Loading configuration...',
    parseError: 'Failed to parse configuration file'
  },
  
  errors: {
    invalidRepo: 'Invalid GitHub repository URL',
    fetchFailed: (message) => `Failed to fetch repository: ${message}`,
    configFetchFailed: 'Failed to fetch app.config.json'
  },
  
  actions: {
    close: 'Close',
    viewOnGitHub: 'View on GitHub'
  }
};

// Glass Card Component (matching other modals)
const GlassCard = ({ children, variant = 'default', sx = {}, ...props }) => {
  const baseStyles = {
    background: variant === 'highlight' 
      ? alpha('#6366f1', 0.15)
      : alpha('#ffffff', 0.05),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${variant === 'highlight' ? alpha('#6366f1', 0.3) : alpha('#ffffff', 0.1)}`,
    borderRadius: 2,
    transition: 'all 0.3s ease',
    ...sx
  };

  return (
    <Box sx={baseStyles} {...props}>
      {children}
    </Box>
  );
};

const ViewDetailsModal = ({
  open,
  onClose,
  selectedPlugin,
  // Theme props
  isLightTheme,
  colors,
  glassmorphism,
  // Theme-aware colors
  textPrimary,
  textSecondary,
  borderColor,
}) => {
  // Get GitHub hook
  const { fetchSpecificRepo, parseGitHubUrl } = useGitHub();
  
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repoData, setRepoData] = useState(null);
  const [configData, setConfigData] = useState(null);
  const [configLoading, setConfigLoading] = useState(false);
  
  // Add scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .MuiDialog-paper::-webkit-scrollbar {
        width: 8px;
      }
      .MuiDialog-paper::-webkit-scrollbar-track {
        background: ${isLightTheme ? '#f1f1f1' : 'rgba(255, 255, 255, 0.1)'};
        border-radius: 4px;
      }
      .MuiDialog-paper::-webkit-scrollbar-thumb {
        background: ${isLightTheme ? '#c1c1c1' : 'rgba(255, 255, 255, 0.3)'};
        border-radius: 4px;
      }
      .MuiDialog-paper::-webkit-scrollbar-thumb:hover {
        background: ${isLightTheme ? '#a8a8a8' : 'rgba(255, 255, 255, 0.5)'};
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isLightTheme]);

  // Fetch repo details and config when modal opens
  useEffect(() => {
    if (open && selectedPlugin?.gitRepo) {
      fetchRepoDetails();
    } else if (open) {
      setError('No repository URL provided');
    }
    
    // Reset state when closing
    if (!open) {
      setRepoData(null);
      setConfigData(null);
      setError(null);
    }
  }, [open, selectedPlugin]);

  // Fetch repository details
  const fetchRepoDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch repo details
      const repo = await fetchSpecificRepo(selectedPlugin.gitRepo);
      if (repo) {
        setRepoData(repo);
        // Now fetch the app.config.json
        await fetchAppConfig(repo);
      } else {
        throw new Error('Failed to fetch repository details');
      }
    } catch (err) {
      console.error('Error fetching repo details:', err);
      setError(TEXT.errors.fetchFailed(err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch app.config.json from the repository
  const fetchAppConfig = async (repo) => {
    setConfigLoading(true);
    
    try {
      // Use GitHub API to fetch the file content
      const apiUrl = `https://api.github.com/repos/${repo.full_name}/contents/app.config.json`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (response.status === 404) {
        setConfigData(null);
        return;
      }
      
      if (!response.ok) {
        throw new Error(TEXT.errors.configFetchFailed);
      }
      
      const data = await response.json();
      
      // Decode base64 content
      const content = atob(data.content);
      const config = JSON.parse(content);
      
      setConfigData(config);
    } catch (err) {
      console.error('Error fetching app.config.json:', err);
      if (err.message.includes('JSON')) {
        setError(TEXT.config.parseError);
      } else {
        setError(TEXT.errors.configFetchFailed);
      }
      setConfigData(null);
    } finally {
      setConfigLoading(false);
    }
  };

  // Render JSON data in a nice format
  const renderConfigValue = (value, indent = 0) => {
    if (value === null || value === undefined) {
      return <Typography component="span" sx={{ color: '#9ca3af' }}>null</Typography>;
    }
    
    if (typeof value === 'boolean') {
      return <Typography component="span" sx={{ color: '#10b981' }}>{value.toString()}</Typography>;
    }
    
    if (typeof value === 'number') {
      return <Typography component="span" sx={{ color: '#3b82f6' }}>{value}</Typography>;
    }
    
    if (typeof value === 'string') {
      return <Typography component="span" sx={{ color: '#f59e0b' }}>"{value}"</Typography>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <Typography component="span">[]</Typography>;
      
      return (
        <Box sx={{ ml: indent > 0 ? 2 : 0 }}>
          <Typography component="span">[</Typography>
          {value.map((item, index) => (
            <Box key={index} sx={{ ml: 2 }}>
              {renderConfigValue(item, indent + 1)}
              {index < value.length - 1 && <Typography component="span">,</Typography>}
            </Box>
          ))}
          <Typography component="span">]</Typography>
        </Box>
      );
    }
    
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return <Typography component="span">{'{}'}</Typography>;
      
      return (
        <Box sx={{ ml: indent > 0 ? 2 : 0 }}>
          <Typography component="span">{'{'}</Typography>
          {entries.map(([key, val], index) => (
            <Box key={key} sx={{ ml: 2 }}>
              <Typography component="span" sx={{ color: textPrimary }}>"{key}"</Typography>
              <Typography component="span">: </Typography>
              {renderConfigValue(val, indent + 1)}
              {index < entries.length - 1 && <Typography component="span">,</Typography>}
            </Box>
          ))}
          <Typography component="span">{'}'}</Typography>
        </Box>
      );
    }
    
    return <Typography component="span">{JSON.stringify(value)}</Typography>;
  };

  const parsedUrl = parseGitHubUrl(selectedPlugin?.gitRepo);
  const repoFullName = parsedUrl ? `${parsedUrl.owner}/${parsedUrl.repo}` : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: isLightTheme ? 'rgba(255,255,255,0.98)' : alpha(colors.glassWhite, 0.1),
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${borderColor}`,
          boxShadow: isLightTheme 
            ? `0 20px 60px ${alpha(colors.primary, 0.1)}` 
            : `0 20px 60px ${alpha(colors.primary, 0.3)}`,
          maxHeight: '90vh',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1, borderBottom: `1px solid ${borderColor}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: textPrimary, mb: 0.5 }}>
              {TEXT.dialog.title(selectedPlugin?.name)}
            </Typography>
            <Typography variant="body2" sx={{ color: textSecondary }}>
              {TEXT.dialog.subtitle}
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ color: textSecondary }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, overflow: 'auto', maxHeight: 'calc(90vh - 160px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid sx={{ mt: 1 }} container spacing={3}>
              {/* Repository Info Box */}
              <Grid size={12}>
                <GlassCard 
                  variant="default" 
                  sx={{ p: 2.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <GitHub sx={{ color: colors.accent, fontSize: 24 }} />
                    <Box flex={1}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: textPrimary, fontFamily: 'monospace' }}>
                        {repoFullName || TEXT.repository.noRepo}
                      </Typography>
                      {repoData && (
                        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                          <Chip 
                            label={repoData.language || 'Unknown'} 
                            size="small" 
                            sx={{ 
                              background: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              border: `1px solid ${alpha(colors.primary, 0.3)}`,
                            }}
                          />
                          <Typography variant="caption" sx={{ color: textSecondary }}>
                            {repoData.stargazers_count} stars • {repoData.forks_count} forks
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </GlassCard>
              </Grid>

              {/* Error Alert */}
              {error && (
                <Grid size={12}>
                  <Alert 
                    severity="error" 
                    sx={{ 
                      background: alpha('#ef4444', 0.1),
                      color: '#ef4444',
                      border: `1px solid ${alpha('#ef4444', 0.3)}`,
                      '& .MuiAlert-icon': {
                        color: '#ef4444'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                </Grid>
              )}

              {/* Configuration Display */}
              <Grid size={12}>
                <GlassCard variant="default" sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Settings sx={{ mr: 1.5, color: colors.accent, fontSize: 28 }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
                        app.config.json
                      </Typography>
                      <Typography variant="caption" sx={{ color: textSecondary }}>
                        Plugin configuration file
                      </Typography>
                    </Box>
                  </Box>

                  {loading || configLoading ? (
                    <Box>
                      <Skeleton variant="text" width="100%" height={30} />
                      <Skeleton variant="text" width="80%" height={30} />
                      <Skeleton variant="text" width="90%" height={30} />
                      <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2, borderRadius: 1 }} />
                    </Box>
                  ) : configData ? (
                    <Box
                      sx={{
                        background: isLightTheme ? '#f8f9fa' : '#0d1117',
                        border: `1px solid ${borderColor}`,
                        borderRadius: 1,
                        p: 2,
                        fontFamily: 'SF Mono, Monaco, monospace',
                        fontSize: '0.875rem',
                        maxHeight: '500px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: isLightTheme ? '#e1e4e8' : '#30363d',
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: isLightTheme ? '#afb8c1' : '#484f58',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: isLightTheme ? '#8b949e' : '#58636d',
                          }
                        },
                      }}
                    >
                      {renderConfigValue(configData)}
                    </Box>
                  ) : (
                    <Alert 
                      severity="info"
                      icon={<Info />}
                      sx={{ 
                        background: alpha(colors.accent, 0.1),
                        color: textPrimary,
                        '& .MuiAlert-icon': {
                          color: colors.accent
                        }
                      }}
                    >
                      {TEXT.config.noConfig}
                    </Alert>
                  )}
                </GlassCard>
              </Grid>
            </Grid>
          </motion.div>
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${borderColor}`, background: isLightTheme ? '#f8f9fa' : alpha(colors.background, 0.5) }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          {repoData && (
            <Button
              startIcon={<GitHub />}
              onClick={() => window.open(repoData.html_url, '_blank')}
              sx={{
                textTransform: 'none',
                color: colors.accent,
                borderColor: colors.accent,
                '&:hover': {
                  background: alpha(colors.accent, 0.1),
                  borderColor: colors.accent
                }
              }}
              variant="outlined"
            >
              {TEXT.actions.viewOnGitHub}
            </Button>
          )}
          <Box sx={{ flex: 1 }} />
          <Button 
            onClick={onClose} 
            sx={{ 
              color: textSecondary,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            {TEXT.actions.close}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewDetailsModal;
