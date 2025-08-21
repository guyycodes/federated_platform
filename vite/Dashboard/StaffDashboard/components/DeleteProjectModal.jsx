// DeleteProjectModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  alpha,
  Fade,
} from '@mui/material';
import {
  GitHub,
  Close,
  Delete as DeleteIcon,
  Warning,
  Info,
  Security,
  CheckCircle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitHub } from '../../../hooks/useGitHub';
import { usePlugins } from '../../../hooks/usePlugins';
import VideoOverlay from './VideoOverlay';
import { useDataLayer } from '../../../Context/DataLayer';
import { SimpleConfirm } from './SimpleConfirm';

// Text constants for internationalization and easy maintenance
const TEXT = {
  dialog: {
    title: (pluginName) => `Delete ${pluginName}`,
    subtitle: 'This action will permanently delete the repository'
  },
  
  loadingMessages: [
    'Initiating deletion sequence...',
    'Allocating resources...',
    'Authenticating with Dispatch...',
    'Presenting token to Github...',   
    'Verifying repository access...',
    'Locating repository...',
    'Removing repository from Github...',
    'Cleaning up resources...',
    'Almost there...',
    'Finalizing deletion...'
  ],
  
  repository: {
    noRepo: 'No repository linked',
    willDelete: 'Repository to be deleted:'
  },
  
  authentication: {
    title: 'GitHub Authentication',
    subtitle: 'Required to delete your repository',
    createTokenButton: 'Create Token',
    fields: {
      token: {
        label: 'GitHub Personal Access Token',
        placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
        helperText: 'Required scopes: workflow, read:org, repo, delete_repo'
      },
      repoName: {
        label: 'Repository Name',
        placeholder: 'Enter repository name to confirm',
        helperText: 'Type the repository name exactly as shown:'
      },

    },
    securityNote: 'Your credentials are encrypted and never stored'
  },
  
  errors: {
    invalidRepo: 'Invalid GitHub repository URL',
    repoNameMismatch: 'Repository name does not match',
    deletionFailed: (message) => `Deletion failed: ${message}`,
    missingCredentials: 'Please provide both token and repository name'
  },
  
  actions: {
    cancel: 'Cancel',
    delete: 'Delete Repository',
    deleting: 'Deleting...',
    deletionSuccess: 'Repository deleted successfully!',
    close: 'Close'
  },
  
  warnings: {
    permanent: 'This action cannot be undone',
    dataLoss: 'All code, issues, and history will be permanently deleted'
  }
};

// Glass Card Component (matching NewProjectModal style)
const GlassCard = ({ children, variant = 'default', sx = {}, ...props }) => {
  const baseStyles = {
    background: variant === 'highlight' 
      ? alpha('#ef4444', 0.15)
      : alpha('#ffffff', 0.05),
    backdropFilter: 'blur(10px)',
    border: `1px solid ${variant === 'highlight' ? alpha('#ef4444', 0.3) : alpha('#ffffff', 0.1)}`,
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

const DeleteProjectModal = ({
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
  // GitHub config
  githubConfig,
  // DataLayer
  updateUserPlugins,
  projects,
}) => {
  // Get GitHub hook
  const { triggerPluginDeletion, checkCallbackStatus, parseGitHubUrl } = useGitHub();
  const { deletePlugin } = usePlugins();
  const { user } = useDataLayer();
  // Form state
  const [deleteForm, setDeleteForm] = useState({
    githubToken: '',
    repoName: '',

  });
  
  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletionComplete, setDeletionComplete] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [showPreVideoMessage, setShowPreVideoMessage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [userWantsVideo, setUserWantsVideo] = useState(null); // null = not asked, true = yes, false = no
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  
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

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setDeleteForm({
        githubToken: '',
        repoName: '',

      });
      setError(null);
      setDeletionComplete(false);
      setLoading(false);
      setVideoHidden(false);
      setShowPreVideoMessage(false);
      setShowVideo(false);
      setUserWantsVideo(null);
      setCurrentMessageIndex(0);
    }
  }, [open, selectedPlugin]);

  // Rotate messages when loading and user doesn't want video
  useEffect(() => {
    if (!loading || userWantsVideo !== false || !TEXT.loadingMessages.length) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % TEXT.loadingMessages.length);
    }, 7700); // Match the video overlay interval

    return () => clearInterval(interval);
  }, [loading, userWantsVideo]);

  // Handle deletion
  const handleDelete = async () => {
    const expectedRepoName = parseGitHubUrl(selectedPlugin?.gitRepo)?.owner + '/' + parseGitHubUrl(selectedPlugin?.gitRepo)?.repo;
    
    // Validate inputs
    if (!deleteForm.githubToken || !deleteForm.repoName) {
      setError(TEXT.errors.missingCredentials);
      return;
    }
    
    // Validate repo name matches
    if (deleteForm.repoName !== expectedRepoName) {
      setError(TEXT.errors.repoNameMismatch);
      return;
    }
    
    setLoading(true);
    setError(null);
    setShowPreVideoMessage(true); // This will now show the prompt
    
    try {
      // Parse repo URL selectedPlugin?.gitRepo
      console.log('will try and match:', selectedPlugin?.gitRepo);
      const parsedRepo = parseGitHubUrl(selectedPlugin?.gitRepo);
      if (!parsedRepo) {
        throw new Error(TEXT.errors.invalidRepo);
      }
      
      const { owner, repo } = parsedRepo;
      console.log('...deleteForm...', deleteForm);
      console.log('...githubConfig...', githubConfig);

      // Trigger deletion workflow
      const dispatchResult = await triggerPluginDeletion({
        userId: user.id,
        githubToken: deleteForm.githubToken,
        pluginConfig: {
          repo_name: repo.replace(/\.git$/, ''),
          repo_owner: owner,
          full_repo: `${owner}/${repo.replace(/\.git$/, '')}`
        },
        dispatchOwner: githubConfig.dispatchOwner,
        dispatchRepo: githubConfig.dispatchRepo,
        enableCallback: true
      });
      
      console.log('Deletion triggered:', dispatchResult);
      
      // Poll for completion
      if (dispatchResult.callbackId) {
        const pollInterval = setInterval(async () => {
          try {
            const callbackResponse = await checkCallbackStatus(dispatchResult.callbackId);
            console.log('Callback response:', callbackResponse);
            
            if (callbackResponse) {
              const expectedRepo = `${parseGitHubUrl(selectedPlugin?.gitRepo)?.owner}/${parseGitHubUrl(selectedPlugin?.gitRepo)?.repo}`;
              console.log('expectedRepo: ', expectedRepo);
              console.log('callbackResponse: ', callbackResponse);
              // Check the status from the GitHub workflow callback
              if (callbackResponse.status === 'success' && callbackResponse.repository === expectedRepo) {
                clearInterval(pollInterval);
                
                try {
                  // call the database and delete the plugin
                  const response = await deletePlugin(selectedPlugin.id, user?.id);
                  console.log('Database deletion response:', response);
                  
                  if(response.success) {
                    // Only mark as complete if database deletion was successful
                    setDeletionComplete(true);
                    setLoading(false);
                  } else {
                    setError(response.error);
                    setLoading(false);
                  }
                  
                  // Remove from local state (already handled by deletePlugin)
                  const updatedPlugins = projects.filter(p => p.id !== selectedPlugin.id);
                  updateUserPlugins(updatedPlugins);
                } catch (dbError) {
                  console.error('Failed to delete plugin from database:', dbError);
                  setError('Repository deleted from GitHub but failed to update database. Please refresh the page.');
                  setLoading(false);
                }
                
              } else if (callbackResponse.status === 'success' && callbackResponse.repository !== expectedRepo) {
                clearInterval(pollInterval);
                setError(`Repository mismatch: Expected ${expectedRepo} but got ${callbackResponse.repository}`);
                setLoading(false);
              } else if (callbackResponse.status === 'failed') {
                clearInterval(pollInterval);
                setError(callbackResponse.message || 'Failed to delete repository');
                setLoading(false);
              } else if (callbackResponse.status === 'not_found') {
                clearInterval(pollInterval);
                setError(callbackResponse.message || 'Repository not found');
                setLoading(false);
              }
            }
          } catch (err) {
            console.error('Error checking callback:', err);
          }
        }, 5000); // Poll every 10 seconds
        
        // Stop polling after 2 minutes (GitHub workflows can take time)
        setTimeout(() => clearInterval(pollInterval), 120000); // 2 minutes
      }
    } catch (error) {
      console.error('Error deleting repository:', error);
      setError(TEXT.errors.deletionFailed(error.message));
      setLoading(false);
    }
  };

  const repoName = parseGitHubUrl(selectedPlugin?.gitRepo)?.owner + '/' + parseGitHubUrl(selectedPlugin?.gitRepo)?.repo;

  // Handle close attempts
  const handleCloseAttempt = () => {
    if (loading) {
      // Show confirmation dialog if deletion is in progress
      setShowCloseConfirm(true);
    } else {
      // Safe to close directly
      onClose();
    }
  };

  // Handle confirmed close
  const handleConfirmClose = () => {
    setShowCloseConfirm(false);
    onClose();
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: isLightTheme ? 'rgba(255,255,255,0.98)' : alpha(colors.glassWhite, 0.1),
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: deletionComplete 
            ? `2px solid ${alpha('#10B981', 0.6)}`
            : `1px solid ${borderColor}`,
          boxShadow: deletionComplete
            ? isLightTheme 
              ? `0 0 40px ${alpha('#10B981', 0.3)}, 0 20px 60px ${alpha('#10B981', 0.2)}` 
              : `0 0 40px ${alpha('#10B981', 0.5)}, 0 20px 60px ${alpha('#10B981', 0.3)}`
            : isLightTheme 
              ? `0 20px 60px ${alpha('#ef4444', 0.1)}` 
              : `0 20px 60px ${alpha('#ef4444', 0.3)}`,
          overflow: 'hidden',
          transition: 'all 0.5s ease-in-out'
        }
      }}
    >
      <DialogTitle sx={{ 
        pb: 1, 
        borderBottom: deletionComplete 
          ? `1px solid ${alpha('#10B981', 0.3)}`
          : `1px solid ${borderColor}`,
        transition: 'all 0.5s ease-in-out'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: textPrimary, mb: 0.5 }}>
              {TEXT.dialog.title(selectedPlugin?.name)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ef4444' }}>
              {TEXT.dialog.subtitle}
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseAttempt} 
            size="small"
            sx={{ color: textSecondary }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3 }}>
        {deletionComplete ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: alpha(colors.success || '#10B981', 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: colors.success || '#10B981' }} />
                </Box>
                <Typography variant="h6" sx={{ color: textPrimary, mb: 1 }}>
                  {TEXT.actions.deletionSuccess}
                </Typography>
                <Typography variant="body2" sx={{ color: textSecondary }}>
                  The repository has been permanently deleted.
                </Typography>
              </Box>
            </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid sx={{ mt: 0 }} container spacing={3}>
                {/* Warning Box */}
                <Grid size={12}>
                  <GlassCard 
                    variant="highlight" 
                    sx={{ p: 2, mt: 1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Warning sx={{ color: '#ef4444', fontSize: 28, flexShrink: 0, mt: 0.5 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#ef4444', mb: 0.5 }}>
                          {TEXT.warnings.permanent}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textSecondary }}>
                          {TEXT.warnings.dataLoss}
                        </Typography>
                      </Box>
                    </Box>
                  </GlassCard>
                </Grid>

                {/* Repository Info Box */}
                <Grid size={12}>
                  <GlassCard 
                    variant="default" 
                    sx={{ p: 2 }}
                  >
                    <Typography variant="body2" sx={{ color: textSecondary, mb: 1 }}>
                      {TEXT.repository.willDelete}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <GitHub sx={{ color: colors.accent, fontSize: 24 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, color: textPrimary, fontFamily: 'monospace' }}>
                        {parseGitHubUrl(selectedPlugin?.gitRepo)?.owner + '/' + parseGitHubUrl(selectedPlugin?.gitRepo)?.repo}
                      </Typography>
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

                {/* Authentication Fields */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Security sx={{ mr: 1.5, color: colors.accent, fontSize: 28 }} />
                        <Box>
                          <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
                            {TEXT.authentication.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: textSecondary }}>
                            {TEXT.authentication.subtitle}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        startIcon={<GitHub />}
                        disabled={loading}
                        href="https://github.com/settings/tokens/new?scopes=repo,delete_repo"
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          ml: 1,
                          px: 0.5,
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
                        {TEXT.authentication.createTokenButton}
                      </Button>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          type="password"
                          label={TEXT.authentication.fields.token.label}
                          placeholder={TEXT.authentication.fields.token.placeholder}
                          value={deleteForm.githubToken}
                          onChange={(e) => setDeleteForm({ ...deleteForm, githubToken: e.target.value })}
                          helperText={TEXT.authentication.fields.token.helperText}
                          error={!!error && error.includes('token')}
                          sx={{
                            '& .MuiInputLabel-root': {
                              color: textSecondary
                            },
                            '& .MuiOutlinedInput-root': {
                              background: isLightTheme 
                                ? alpha(colors.glassWhite, 0.8)
                                : alpha(colors.glassWhite, 0.05),
                              backdropFilter: 'blur(10px)',
                              color: textPrimary,
                              '& fieldset': {
                                borderColor: borderColor
                              },
                              '&:hover fieldset': {
                                borderColor: alpha(colors.accent, 0.5)
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.accent
                              }
                            },
                            '& .MuiFormHelperText-root': {
                              color: textSecondary,
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label={TEXT.authentication.fields.repoName.label}
                          placeholder={TEXT.authentication.fields.repoName.placeholder}
                          value={deleteForm.repoName}
                          onChange={(e) => setDeleteForm({ ...deleteForm, repoName: e.target.value })}
                          helperText={<>
                            {TEXT.authentication.fields.repoName.helperText}
                            {repoName && (
                              <Typography component="span" sx={{ fontWeight: 600, ml: 0.5 }}>
                                { parseGitHubUrl(selectedPlugin?.gitRepo)?.owner + '/' + parseGitHubUrl(selectedPlugin?.gitRepo)?.repo }
                                {/*  makes pattern : repoOwner/repoName  */}
                              </Typography>
                            )}
                          </>}
                          error={!!error && error.includes('match')}
                          sx={{
                            '& .MuiInputLabel-root': {
                              color: textSecondary
                            },
                            '& .MuiOutlinedInput-root': {
                              background: isLightTheme 
                                ? alpha(colors.glassWhite, 0.8)
                                : alpha(colors.glassWhite, 0.05),
                              backdropFilter: 'blur(10px)',
                              color: textPrimary,
                              '& fieldset': {
                                borderColor: borderColor
                              },
                              '&:hover fieldset': {
                                borderColor: alpha('#ef4444', 0.5)
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#ef4444'
                              }
                            },
                            '& .MuiFormHelperText-root': {
                              color: textSecondary,
                              fontSize: '0.75rem'
                            }
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Alert 
                      severity="info"
                      icon={<Info />}
                      sx={{ 
                        mt: 2,
                        background: alpha(colors.accent, 0.1),
                        color: textPrimary,
                        '& .MuiAlert-icon': {
                          color: colors.accent
                        }
                      }}
                    >
                      <Typography variant="caption">
                        {TEXT.authentication.securityNote}
                      </Typography>
                    </Alert>
                  </GlassCard>
                </Grid>
              </Grid>
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: deletionComplete 
          ? `1px solid ${alpha('#10B981', 0.3)}`
          : `1px solid ${borderColor}`, 
        background: deletionComplete
          ? isLightTheme 
            ? alpha('#10B981', 0.05)
            : alpha('#10B981', 0.1)
          : isLightTheme 
            ? '#f8f9fa' 
            : alpha(colors.background, 0.5),
        transition: 'all 0.5s ease-in-out'
      }}>
        {!deletionComplete && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button 
                onClick={handleCloseAttempt} 
                sx={{ 
                  color: textSecondary,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {TEXT.actions.cancel}
              </Button>
              
              {/* Show loading messages when not using video */}
              {loading && userWantsVideo === false && (
                <>
                  <Fade in={true} key={currentMessageIndex}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: colors.accent }} />
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: textSecondary,
                          fontStyle: 'italic',
                          minWidth: '250px'
                        }}
                      >
                        {TEXT.loadingMessages[currentMessageIndex]}
                      </Typography>
                    </Box>
                  </Fade>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setUserWantsVideo(true);
                      setShowVideo(true);
                      setVideoHidden(false);
                    }}
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      px: 1,
                      py: 0.5,
                      mr: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: colors.accent,
                        background: alpha(colors.accent, 0.1),
                      }
                    }}
                  >
                    Watch ▶️
                  </Button>
                </>
              )}
            </Box>
            
            <Button
              variant="contained"
              onClick={handleDelete}
              disabled={loading || !deleteForm.githubToken || !deleteForm.repoName || deleteForm.repoName !== repoName}
              startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <DeleteIcon />}
              sx={{
                background: `linear-gradient(135deg, #ef4444, ${alpha('#ef4444', 0.8)})`,
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1,
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha('#ef4444', 0.9)}, #ef4444)`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 20px ${alpha('#ef4444', 0.3)}`
                },
                '&:disabled': {
                  background: alpha('#ef4444', 0.3),
                  color: alpha('#ffffff', 0.5),
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? TEXT.actions.deleting : TEXT.actions.delete}
            </Button>
          </Box>
        )}
      </DialogActions>
    </Dialog>

    {/* Video prompt */}
    <Fade in={showPreVideoMessage && userWantsVideo === null}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: alpha('#000', 0.8),
          backdropFilter: 'blur(10px)',
          zIndex: 2000,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            p: 4,
            background: isLightTheme
              ? alpha('#fff', 0.1)
              : alpha('#000', 0.2),
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: `1px solid ${alpha(isLightTheme ? '#000' : '#fff', 0.1)}`,
            boxShadow: `0 20px 60px ${alpha(colors.accent || '#6366f1', 0.3)}`,
            minWidth: '400px',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            Would you like to watch a video while we service your repo?
            <GitHub sx={{ fontSize: 32 }} />
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => {
                setUserWantsVideo(true);
                setShowPreVideoMessage(false);
                setShowVideo(true);
              }}
              sx={{
                background: colors.accent || '#6366f1',
                color: 'black',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  background: alpha(colors.accent || '#6366f1', 0.8),
                }
              }}
            >
              Yes, play video
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setUserWantsVideo(false);
                setShowPreVideoMessage(false);
              }}
              sx={{
                borderColor: '#fff',
                color: '#fff',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#fff',
                  background: alpha('#fff', 0.1),
                }
              }}
            >
              No thanks
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>

    {/* Video overlay while deleting - only shown if user wants it */}
    <VideoOverlay
      open={showVideo && userWantsVideo && (loading || deletionComplete) && !error && !videoHidden}
      onClose={() => setVideoHidden(true)}
      videoSrc="https://www.youtube.com/embed/1HTXbcj3gWE" // YouTube embed URL
      messages={deletionComplete ? ['Repository service complete...'] : TEXT.loadingMessages}
      messageInterval={deletionComplete ? 0 : 8000}  // Increased from 3000ms to 6000ms (6 seconds per message)
      showCloseButton={deletionComplete}
      isLightTheme={isLightTheme}
      colors={colors}
      glassmorphism={glassmorphism}
      autoPlay={true}
      loop={true}
      muted={false}
      overlay={true}
      maxWidth="400px"
      aspectRatio="1/1"
    />

<SimpleConfirm
      open={showCloseConfirm}
      onClose={() => setShowCloseConfirm(false)}
      onConfirm={handleConfirmClose}
      message="⚠️ Updating services... This is an idempotent operation, but it must complete uninterrupted. Please enjoy the video."
      shouldHideCloseButton={true}
    />
  </>
  );
};

export default DeleteProjectModal;