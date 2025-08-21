// DeploymentsModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  alpha,
  Chip,
  Tooltip
} from '@mui/material';
import {
  GitHub,
  CloudUpload,
  Close,
  Terminal,
  Commit,
  Schedule,
  Person,
  ArrowForward,
  CheckCircle,
  RadioButtonUnchecked,
  Info,
  Security
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralNetwork from '../components/NeuralNetwork';
import { useGitHub } from '../../../hooks/useGitHub';
import { SimpleConfirm } from '../components/SimpleConfirm';
import { usePlugins } from '../../../hooks/usePlugins';


// Text constants for internationalization and easy maintenance
const TEXT = {
  dialog: {
    title: (pluginName) => `Deploy ${pluginName}`,
    subtitle: {
      advance: 'Advance your plugin from',
      to: 'to'
    }
  },
  
  console: {
    header: '🖥️ Deployment Console',
    connected: 'Connected',
    completed: '✅ Deployment Completed',
    completedMessage: 'Deployment completed! You can close this window.',
    waiting: 'Waiting for deployment',
    initialMessage: '⏳ Waiting for deployment to start...',
    connectionMessages: {
      connected: '🔗 Connected to deployment stream',
      error: '❌ Connection error:',
      disconnected: '🔌 Stream disconnected'
    }
  },
  
  repository: {
    noRepo: 'No repository linked',
    clickToView: 'Click to view on GitHub'
  },
  
  authentication: {
    title: 'GitHub Authentication',
    subtitle: 'Required to deploy your plugin',
    createTokenButton: 'Create Token',
    fields: {
      token: {
        label: 'GitHub Personal Access Token',
        placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
        helperText: (scopes) => `Required scopes: ${scopes || 'repo, workflow'}`
      },
      repoName: {
        label: 'Confirm Repository Name',
        placeholder: 'owner/repository-name',
        helperText: 'Type the repository name exactly as shown:'
      },
      branch: {
        label: 'Branch',
        helperText: 'Target branch for deployment'
      }
    },
    securityNote: 'Your credentials are encrypted and never stored'
  },
  
  commits: {
    title: 'Select Commit',
    subtitle: 'Choose the commit to deploy',
    loading: 'Loading commits...',
    noCommits: 'No commits found',
    failedToLoad: 'Failed to load commits'
  },
  
  errors: {
    invalidRepo: 'Invalid GitHub repository URL',
    repoNotFound: 'Repository not found',
    repoNameMismatch: 'Repository name does not match',
    rateLimitExceeded: 'API rate limit exceeded. Please try again later.',
    fetchCommitsFailed: (statusText) => `Failed to fetch commits: ${statusText}`,
    deploymentFailed: (message) => `Deployment failed: ${message}`,
    missingCredentials: 'Please provide all required fields including API keys'
  },
  
  actions: {
    cancel: 'Cancel',
    close: 'Close',
    deploy: (stage) => `Deploy to ${stage}`,
    deploying: 'Deploying...',
    viewDeployments: 'View Deployments',
    deploymentSuccess: '🎉 Deployment completed successfully!',
    pleaseWait: 'Please wait for deployment to complete...'
  }
};

// Glass Card Component (matching NewProjectModal style)
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

const DeploymentsModal = ({
  open,
  onClose,
  selectedPlugin,
  actionType,
  onConfirm,
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
  // For navigation
  navigate,
  user
}) => {
  // Form state
  const [deploymentForm, setDeploymentForm] = useState({
    githubToken: '',
    repoName: '',
    selectedCommit: '',
    branch: 'main',
    openaiApiKey: '',
    tavilyApiKey: '',
    langchainApiKey: ''
  });
  
  // Commits state
  const [commits, setCommits] = useState([]);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [commitError, setCommitError] = useState(null);
  
  // Deployment state
  const [loading, setLoading] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [streamUrl, setStreamUrl] = useState(null);
  const [deploymentCompleted, setDeploymentCompleted] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const [dots, setDots] = useState('');
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const { 
    triggerPluginPush, 
    checkCallbackStatus,
    fetchSpecificRepo,
    parseGitHubUrl 
  } = useGitHub();

  const { updatePlugin } = usePlugins();
  
  // Memoize parsed repo data to avoid recalculating on every render
  const parsedRepo = React.useMemo(() => {
    if (!selectedPlugin?.gitRepo) return null;
    return parseGitHubUrl(selectedPlugin.gitRepo);
  }, [selectedPlugin?.gitRepo]);
  
  // Derive repo name from parsed data
  const repoName = parsedRepo ? `${parsedRepo.owner}/${parsedRepo.repo}` : '';

  // Cleanup WebSocket on component unmount
  React.useEffect(() => {
    return () => {
      if (wsRef.current) {
        console.log('Cleaning up WebSocket connection on unmount');
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs only on unmount

  // Add scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
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
      .MuiDialogContent-root::-webkit-scrollbar {
        width: 8px;
      }
      .MuiDialogContent-root::-webkit-scrollbar-track {
        background: ${isLightTheme ? '#f1f1f1' : 'rgba(255, 255, 255, 0.1)'};
        border-radius: 4px;
      }
      .MuiDialogContent-root::-webkit-scrollbar-thumb {
        background: ${isLightTheme ? '#c1c1c1' : 'rgba(255, 255, 255, 0.3)'};
        border-radius: 4px;
      }
      .MuiDialogContent-root::-webkit-scrollbar-thumb:hover {
        background: ${isLightTheme ? '#a8a8a8' : 'rgba(255, 255, 255, 0.5)'};
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [isLightTheme]);

  // Animate dots for "Waiting for deployment..."
  useEffect(() => {
    if (!deploymentCompleted && showConsole) {
      const dotsSequence = ['', '.', '..', '...'];
      let index = 0;
      
      const interval = setInterval(() => {
        setDots(dotsSequence[index]);
        index = (index + 1) % dotsSequence.length;
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [deploymentCompleted, showConsole]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setDeploymentForm({
        githubToken: '',
        repoName: '',
        selectedCommit: '',
        branch: 'main',
        openaiApiKey: '',
        tavilyApiKey: '',
        langchainApiKey: ''
      });
      setCommits([]);
      setCommitError(null);
      setShowConsole(false);
      setStreamUrl(null);
      setDeploymentCompleted(false);
      setLoading(false);
      setDots('');
      
      // Fetch commits if repo exists
      if (selectedPlugin?.gitRepo) {
        fetchCommitsForRepo(selectedPlugin.gitRepo);
      }
    }
    
    // Cleanup WebSocket on close
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [open, selectedPlugin]);

  // Fetch commits for a repository
  const fetchCommitsForRepo = async (repoUrl) => {
    setLoadingCommits(true);
    setCommitError(null);
    
    try {
      // Parse repo URL to get owner/repo
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error(TEXT.errors.invalidRepo);
      }
      
      const [, owner, repo] = match;
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(TEXT.errors.repoNotFound);
        } else if (response.status === 403) {
          throw new Error(TEXT.errors.rateLimitExceeded);
        }
        throw new Error(TEXT.errors.fetchCommitsFailed(response.statusText));
      }
      
      const data = await response.json();
      // Get last 10 commits
      const recentCommits = data.slice(0, 10).map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date)
      }));
      setCommits(recentCommits);
    } catch (error) {
      console.error('Error fetching commits:', error);
      setCommitError(error.message || 'Failed to fetch commits');
      setCommits([]);
    } finally {
      setLoadingCommits(false);
    }
  };

  // Connect to WebSocket stream
  const connectToStream = async (wsUrl) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    const consoleOutput = document.getElementById('deployment-console-output');
    if (!consoleOutput) return;
    
    // Clear initial message
    consoleOutput.innerHTML = '';
    
    const addLog = (message, color = '#d4d4d4') => {
      const line = document.createElement('div');
      line.style.color = color;
      line.style.marginBottom = '2px';
      
      const timestamp = new Date().toLocaleTimeString();
      line.innerHTML = `<span style="color: #666; font-size: 11px">[${timestamp}]</span> ${message}`;
      
      consoleOutput.appendChild(line);
      consoleOutput.scrollTop = consoleOutput.scrollHeight;
    };
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        addLog('🔗 Connected to deployment stream', colors.accent);
        setLoading(false); // Stop loading when connected
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          addLog(message.data || event.data);
        } catch (e) {
          addLog(event.data);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error details:', error);
        addLog(`❌ Connection error: ${error.type || 'Unknown error'}`, '#ef4444');
        wsRef.current = null;
        setStreamUrl(null);
      };
      
      ws.onclose = async (closeEvent) => {
        await sleep(3000);
        console.error('WebSocket close details:', {
          code: closeEvent.code,
          reason: closeEvent.reason,
          wasClean: closeEvent.wasClean
        });
        addLog(`🔌 Stream disconnected (Code: ${closeEvent.code}, Reason: ${closeEvent.reason || 'None'})`, '#888');
        wsRef.current = null;
        setStreamUrl(null);
      };
    } catch (error) {
      console.error('WebSocket creation error:', error);
      addLog(`❌ Failed to connect: ${error.message}`, '#ef4444');
      wsRef.current = null;
      setStreamUrl(null);
    }
  };

  // Handle deployment submission
  const handleDeploy = async () => {
    // Validate inputs
    if (!deploymentForm.githubToken || !deploymentForm.repoName || !deploymentForm.selectedCommit || 
        !deploymentForm.openaiApiKey || !deploymentForm.tavilyApiKey || !deploymentForm.langchainApiKey) {
      setCommitError(TEXT.errors.missingCredentials);
      return;
    }
    
    // Validate repo name matches
    if (deploymentForm.repoName !== repoName) {
      setCommitError(TEXT.errors.repoNameMismatch);
      return;
    }
    
    setLoading(true);
    setShowConsole(false);
    setDeploymentCompleted(false);
    
    try {
      const nextStage = actionType?.split('-')[1];
      
      // Use memoized parsed repo data
      if (!parsedRepo) {
        throw new Error(TEXT.errors.invalidRepo);
      }
      
      const { owner, repo } = parsedRepo;
      
      // Trigger deployment workflow with repository info for CI cloning
      const dispatchResult = await triggerPluginPush({
        githubToken: deploymentForm.githubToken,
        pluginConfig: {
          id: selectedPlugin.id,
          name: selectedPlugin.name,
          deploymentStatus: nextStage,
          repo_name: repo.replace(/\.git$/, ''),  // Just the repo name without .git (e.g., "my-plugin")
          repo_owner: owner,  // The GitHub username/org (e.g., "octocat")
          full_repo: `${owner}/${repo.replace(/\.git$/, '')}`  // Format: "owner/repo" without .git (e.g., "octocat/my-plugin")
        },
        dispatchOwner: githubConfig.dispatchOwner,
        dispatchRepo: githubConfig.dispatchRepo,
        enableCallback: true,
        commitSHA: deploymentForm.selectedCommit,
        currentDeploymentStatus: selectedPlugin.deploymentStatus,
        branch: deploymentForm.branch,
        // Pass environment variables for CI to use
        envVars: {
          OPENAI_API_KEY: deploymentForm.openaiApiKey,
          TAVILY_API_KEY: deploymentForm.tavilyApiKey,
          LANGCHAIN_API_KEY: deploymentForm.langchainApiKey
        }
      });
      
      console.log('Deployment triggered:', dispatchResult);
      
      // Poll for stream URL
      let streamReady = false;
      if (dispatchResult.callbackId) {
        setShowConsole(true);
        await sleep(3000);
        const pollInterval = setInterval(async () => {
          try {
            const status = await checkCallbackStatus(dispatchResult.callbackId);
            console.log('Callback status:', status);

            if (status?.stream?.stream_url) {
              streamReady = true;
              console.log('Stream URL received:', status.stream.stream_url);
              setStreamUrl(status.stream.stream_url);
              clearInterval(pollInterval);

              // Connect to WebSocket
              connectToStream(status.stream.stream_url);
            } else if (status?.status === 'pending') {
              console.log('Callback pending, continuing to poll...');
            }
          } catch (err) {
            console.error('Error checking callback:', err);
            // Don't stop polling on error - the callback might not exist yet
            if (err.message.includes('404')) {
              console.log('Callback not found yet, continuing to poll...');
            }
          }
        }, 1000);
        
        // Stop polling after 20 seconds
        setTimeout(() => clearInterval(pollInterval), 20000);
      }
      
      if(dispatchResult.success) {
        // update the plugin in the database
        console.log("dispatchResult line 472: ", dispatchResult)
        await sleep(3000);
        const deploymentResult = await new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 40; 
          const checkDeployment = setInterval(async () => {
            attempts++;
            console.log('attempting deployment check...')
            try {
              const callBackStatus = await checkCallbackStatus(dispatchResult.callbackId);
              console.log(`Checking deployment callBackStatus (attempt ${attempts}/${maxAttempts}):`, callBackStatus);
              
              // Check if deployment is complete
              if (callBackStatus?.repository_url) {
                console.log('Deployment successful! Repository URL:', callBackStatus.repository_url);
                clearInterval(checkDeployment);
                resolve(callBackStatus);
              } else if (attempts >= maxAttempts) {
                console.log('Timeout reached, proceeding without full validation');
                clearInterval(checkDeployment);
                resolve(callBackStatus); // Return whatever status we have
              }
            } catch(err) {
              console.log('Error checking deployment:', err);
              // Keep trying unless we've hit max attempts
              if (attempts >= maxAttempts) {
                clearInterval(checkDeployment);
                resolve(null);
              }
            }
          }, 15000); // Check every 15 seconds;
          // Stop polling after 10 minutes
          setTimeout(() => clearInterval(checkDeployment), 600000);
        });

        console.log("deploymentResult: ", deploymentResult)

        try{
          console.log('updating plugin in database...')
          // Update plugin in database
          const updatedPlugin = await updatePlugin(
          selectedPlugin.id, {
            deploymentStatus: nextStage
          }, 
          user?.id);

          console.log('Plugin updated successfully:', updatedPlugin);

          if(updatedPlugin.success){
          // Update local state
            const updatedPlugins = projects.map(p => 
              p.id === selectedPlugin.id 
                ? { ...p, deploymentStatus: nextStage }
                : p
            );
            updateUserPlugins(updatedPlugins);
            
            // Mark deployment as completed
            setDeploymentCompleted(true);
          }
          setLoading(false);

        }catch(err){
          console.error('Error updating plugin:', err);
          setError(`Failed to update plugin status: ${err.message}`);
          setLoading(false);
        }

      }
    } catch (error) {
      console.error('Error deploying:', error);
      setError(TEXT.errors.deploymentFailed(error.message));
      setCommitError(TEXT.errors.deploymentFailed(error.message));
      setLoading(false);
      setShowConsole(false);
    }
  };

  // Handle close - show confirmation if deployment is in progress
  const handleClose = () => {
    if (loading || showConsole || (streamUrl && !deploymentCompleted)) {
      setShowConfirmClose(true);
    } else {
      resetAndClose();
    }
  };

  // Reset and close modal
  const resetAndClose = async () => {
    // Clean up WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setLoading(false);
    
    await sleep(200);
    setDeploymentForm({
      githubToken: '',
      repoName: '',
      selectedCommit: '',
      branch: 'main',
      openaiApiKey: '',
      tavilyApiKey: '',
      langchainApiKey: ''
    });
    setCommits([]);
    setCommitError(null);
    setStreamUrl(null);
    setShowConsole(false);
    await sleep(200);
    setDeploymentCompleted(false);
    setError(null);
    setDots('');
    onClose();
  };

  // Get target stage from actionType
  const targetStage = actionType?.split('-')[1];

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
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
            {/* Deploy {selectedPlugin?.name} */}
              {TEXT.dialog.title(selectedPlugin?.name)}
            </Typography>
            <Typography variant="body2" component="div" sx={{ color: textSecondary }}>
              {TEXT.dialog.subtitle.advance} <Chip label={selectedPlugin?.deploymentStatus || 'Unknown'} size="small" sx={{ mx: 0.5 }} /> {TEXT.dialog.subtitle.to}{' '}
              <Chip 
                label={targetStage} 
                size="small" 
                sx={{ 
                  mx: 0.5,
                  background: alpha(colors.accent, 0.1),
                  color: colors.accent,
                  border: `1px solid ${alpha(colors.accent, 0.3)}`
                }} 
              />
            </Typography>
          </Box>
          <IconButton 
            onClick={handleClose} 
            size="small"
            // disabled={loading && !showConfirmClose}
            sx={{ color: textSecondary }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, overflow: 'auto', maxHeight: 'calc(90vh - 200px)' }}>
        {/* Show console if deployment has started */}
        {showConsole ? (
          <Box>
            <Box
              sx={{
                backgroundColor: isLightTheme ? '#f8f9fa' : '#0d1117',
                border: `1px solid ${borderColor}`,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: isLightTheme 
                  ? '0 1px 3px rgba(0,0,0,0.08)' 
                  : '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              <Box sx={{ 
                position: 'relative',
                backgroundColor: isLightTheme ? '#f1f3f4' : '#161b22',
                borderBottom: `1px solid ${borderColor}`,
                p: 2,
                overflow: 'hidden',
              }}>
                {/* Header content */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 2,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: textPrimary }}>
                      {TEXT.console.header}
                    </Typography>
                    {streamUrl && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CircularProgress size={14} thickness={5} sx={{ color: colors.accent }} />
                        <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 500 }}>
                          {TEXT.console.connected}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {deploymentCompleted && (
                    <Typography variant="caption" sx={{ color: colors.success || '#10B981', fontWeight: 500 }}>
                      {TEXT.console.completed}
                    </Typography>
                  )}
                </Box>
                
                {/* Neural Network Animation */}
                <Box sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '300px',
                  height: '80px',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  zIndex: 1,
                }}>
                  <Box sx={{ 
                    opacity: streamUrl ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <NeuralNetwork />
                  </Box>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      position: 'absolute',
                      color: textSecondary,
                      whiteSpace: 'nowrap',
                      opacity: streamUrl ? 0 : 1,
                      transition: 'opacity 0.5s ease-in-out',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {deploymentCompleted ? (
                      TEXT.console.completedMessage
                    ) : (
                      <>
                        {TEXT.console.waiting}
                        <Box component="span" sx={{ width: '20px', display: 'inline-block', textAlign: 'left' }}>
                          {dots}
                        </Box>
                      </>
                    )}
                  </Typography>
                </Box>
              </Box>
              
              <Box
                id="deployment-console-output"
                sx={{
                  height: '400px',
                  overflowY: 'auto',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  fontFamily: 'SF Mono, Monaco, Inconsolata, "Courier New", monospace',
                  p: 2,
                  backgroundColor: isLightTheme ? '#ffffff' : '#0d1117',
                  color: isLightTheme ? '#24292e' : '#c9d1d9',
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
                <div style={{ color: colors.accent }}>
                  {TEXT.console.initialMessage}
                </div>
              </Box>
            </Box>
          </Box>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Grid sx={{ mt: 1 }} container spacing={1}>
                {/* Repository Info Box - Vercel Style */}
                <Grid size={12}>
                  <GlassCard 
                    variant="default" 
                    sx={{ 
                      p: 1.5,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 20px ${alpha(colors.accent, 0.15)}`
                      }
                    }}
                    onClick={() => window.open(selectedPlugin?.gitRepo, '_blank')}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            background: isLightTheme 
                              ? alpha(colors.accent, 0.1)
                              : alpha(colors.accent, 0.15),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${alpha(colors.accent, 0.3)}`
                          }}
                        >
                          <GitHub sx={{ color: colors.accent, fontSize: 28 }} />
                        </Box>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: textPrimary }}>
                            {selectedPlugin?.gitRepo ? 
                              selectedPlugin.gitRepo.split('/').slice(-2).join('/') : 
                              TEXT.repository.noRepo
                            }
                          </Typography>
                          <Typography variant="caption" sx={{ color: textSecondary }}>
                            {TEXT.repository.clickToView}
                          </Typography>
                        </Box>
                      </Box>
                      <ArrowForward sx={{ color: textSecondary }} />
                    </Box>
                  </GlassCard>
                </Grid>

                {/* Error Alert */}
                {(commitError || error) && (
                  <Grid size={12}>
                    <Alert 
                      severity="error" 
                      onClose={() => {
                        setCommitError(null);
                        setError(null);
                      }}
                      sx={{ 
                        background: alpha('#ef4444', 0.1),
                        color: '#ef4444',
                        border: `1px solid ${alpha('#ef4444', 0.3)}`,
                        '& .MuiAlert-icon': {
                          color: '#ef4444'
                        }
                      }}
                    >
                      {commitError || error}
                    </Alert>
                  </Grid>
                )}



                {/* Two Column Layout: Authentication & Commit Selection */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <GlassCard variant="default" sx={{ p: 2, height: '100%' }}>
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
                        href={githubConfig?.getTokenUrl || "https://github.com/settings/tokens/new"}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          pr: 0,
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
                          value={deploymentForm.githubToken}
                          onChange={(e) => setDeploymentForm({ ...deploymentForm, githubToken: e.target.value })}
                          helperText={TEXT.authentication.fields.token.helperText(githubConfig?.tokenScopes?.join(', '))}
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
                          value={deploymentForm.repoName}
                          onChange={(e) => setDeploymentForm({ ...deploymentForm, repoName: e.target.value })}
                          helperText={<>
                            {TEXT.authentication.fields.repoName.helperText}
                            {repoName && (
                              <Typography component="span" sx={{ fontWeight: 600, ml: 0.5 }}>
                                {repoName}
                              </Typography>
                            )}
                          </>}
                          error={!!commitError && commitError.includes('match')}
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
                          label={TEXT.authentication.fields.branch.label}
                          value={deploymentForm.branch}
                          onChange={(e) => setDeploymentForm({ ...deploymentForm, branch: e.target.value })}
                          helperText={TEXT.authentication.fields.branch.helperText}
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
                    </Grid>

                    {/* <Alert 
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
                    </Alert> */}
                  </GlassCard>
                </Grid>

                {/* Commit Selection - GitGraph Style */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <GlassCard variant="default" sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Commit sx={{ mr: 1.5, color: colors.accent, fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
                          {TEXT.commits.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: textSecondary }}>
                          {TEXT.commits.subtitle}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Commit List */}
                    <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                      {loadingCommits ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
                          <CircularProgress size={32} sx={{ color: colors.accent }} />
                        </Box>
                      ) : commits.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" sx={{ color: textSecondary }}>
                            {commitError ? TEXT.commits.failedToLoad : TEXT.commits.noCommits}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          {commits.map((commit, index) => (
                            <Box key={commit.sha}>
                              <Box
                                sx={{
                                  position: 'relative',
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  cursor: 'pointer',
                                  p: 2,
                                  ml: 3,
                                  borderRadius: 1,
                                  border: `1px solid ${deploymentForm.selectedCommit === commit.sha ? colors.accent : 'transparent'}`,
                                  background: deploymentForm.selectedCommit === commit.sha 
                                    ? alpha(colors.accent, 0.1)
                                    : 'transparent',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    background: alpha(colors.accent, 0.05),
                                    borderColor: alpha(colors.accent, 0.3)
                                  }
                                }}
                                onClick={() => setDeploymentForm({ ...deploymentForm, selectedCommit: commit.sha })}
                              >
                                {/* Git Graph Node */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    left: -12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    background: deploymentForm.selectedCommit === commit.sha 
                                      ? colors.accent 
                                      : isLightTheme ? '#6b7280' : '#9ca3af',
                                    border: `2px solid ${isLightTheme ? '#ffffff' : colors.background}`,
                                    zIndex: 2
                                  }}
                                />
                                
                                {/* Git Graph Line */}
                                {index < commits.length - 1 && (
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      left: -7,
                                      top: '50%',
                                      width: 2,
                                      height: 'calc(100% + 16px)',
                                      background: isLightTheme ? '#e5e7eb' : '#374151',
                                      zIndex: 1
                                    }}
                                  />
                                )}

                                {/* Commit Content */}
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        fontFamily: 'SF Mono, Monaco, monospace',
                                        fontWeight: 600,
                                        color: colors.accent,
                                        background: alpha(colors.accent, 0.1),
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 0.5
                                      }}
                                    >
                                      {commit.sha.substring(0, 7)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <Person sx={{ fontSize: 14, color: textSecondary }} />
                                      <Typography variant="caption" sx={{ color: textSecondary }}>
                                        {commit.author}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      <Schedule sx={{ fontSize: 14, color: textSecondary }} />
                                      <Typography variant="caption" sx={{ color: textSecondary }}>
                                        {new Date(commit.date).toLocaleDateString()}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      color: textPrimary,
                                      fontWeight: deploymentForm.selectedCommit === commit.sha ? 600 : 400
                                    }}
                                  >
                                    {commit.message}
                                  </Typography>
                                </Box>

                                {/* Selection Indicator */}
                                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                                  {deploymentForm.selectedCommit === commit.sha ? (
                                    <CheckCircle sx={{ color: colors.accent }} />
                                  ) : (
                                    <RadioButtonUnchecked sx={{ color: textSecondary }} />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </GlassCard>
                </Grid>
              </Grid>
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: `1px solid ${borderColor}`, background: isLightTheme ? '#f8f9fa' : alpha(colors.background, 0.5) }}>
        {deploymentCompleted ? (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography variant="body2" sx={{ color: textSecondary }}>
              {TEXT.actions.deploymentSuccess}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                onClick={handleClose} 
                sx={{ 
                  color: textSecondary,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {TEXT.actions.close}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  onClose();
                  navigate('/staff/dash');
                }}
                sx={{
                  background: `linear-gradient(135deg, ${colors.accent}, ${alpha(colors.accent, 0.8)})`,
                  color: '#ffffff',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(colors.accent, 0.9)}, ${colors.accent})`,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px ${alpha(colors.accent, 0.3)}`
                  }
                }}
              >
                {TEXT.actions.viewDeployments}
              </Button>
            </Box>
          </Box>
        ) : showConsole ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Typography variant="body2" sx={{ color: textSecondary, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} thickness={5} sx={{ color: colors.accent }} />
              {TEXT.actions.pleaseWait}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            {/* Environment Variables Input */}
            <Box
              sx={{ 
                mb: 1.5,
                p: 1.5,
                background: alpha(colors.accent, 0.05),
                border: `1px solid ${alpha(colors.accent, 0.2)}`,
                borderRadius: 1
              }}
            >
              <Typography variant="caption" sx={{ color: textSecondary, mb: 0.5, display: 'block', fontSize: '0.7rem' }}>
                Required API Keys:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  size="small"
                  type="password"
                  placeholder="OPENAI_API_KEY"
                  value={deploymentForm.openaiApiKey}
                  onChange={(e) => setDeploymentForm({ ...deploymentForm, openaiApiKey: e.target.value })}
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': { 
                      padding: '4px 8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiOutlinedInput-root': {
                      minHeight: 0
                    }
                  }}
                />
                <TextField
                  size="small"
                  type="password"
                  placeholder="TAVILY_API_KEY"
                  value={deploymentForm.tavilyApiKey}
                  onChange={(e) => setDeploymentForm({ ...deploymentForm, tavilyApiKey: e.target.value })}
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': { 
                      padding: '4px 8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiOutlinedInput-root': {
                      minHeight: 0
                    }
                  }}
                />
                <TextField
                  size="small"
                  type="password"
                  placeholder="LANGCHAIN_API_KEY"
                  value={deploymentForm.langchainApiKey}
                  onChange={(e) => setDeploymentForm({ ...deploymentForm, langchainApiKey: e.target.value })}
                  sx={{ 
                    flex: 1,
                    '& .MuiInputBase-input': { 
                      padding: '4px 8px',
                      fontSize: '0.75rem'
                    },
                    '& .MuiOutlinedInput-root': {
                      minHeight: 0
                    }
                  }}
                />
              </Box>
            </Box>
            
            {/* Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <Button 
                onClick={handleClose} 
                sx={{ 
                  color: textSecondary,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {TEXT.actions.cancel}
              </Button>
              <Button
                variant="contained"
                onClick={handleDeploy}
                disabled={loading || !deploymentForm.githubToken || !deploymentForm.selectedCommit || (deploymentForm.repoName !== repoName) || !deploymentForm.openaiApiKey || !deploymentForm.tavilyApiKey || !deploymentForm.langchainApiKey}
                startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <CloudUpload />}
                sx={{
                background: `linear-gradient(135deg, ${colors.accent}, ${alpha(colors.accent, 0.8)})`,
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                px: { xs: 2, sm: 3 },
                py: 1,
                '&:hover': {
                  opacity: 0.9,
                  transform: 'translateY(-2px)'
                },
                '&:disabled': {
                  background: alpha(colors.accent, 0.3),
                  color: alpha('#ffffff', 0.5),
                  transform: 'none',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? TEXT.actions.deploying : TEXT.actions.deploy(targetStage)}
            </Button>
            </Box>
          </Box>
        )}
      </DialogActions>
    </Dialog>

    <SimpleConfirm
      open={showConfirmClose}
      onClose={() => setShowConfirmClose(false)}
      onConfirm={() => {
        setShowConfirmClose(false);
        resetAndClose();
      }}
      message="⚠️ Deployment in progress. This operation must complete uninterrupted. Please wait for the deployment to finish."
      shouldHideCloseButton={false}
      confirmText="Exit Anyway"
    />
    </>
  );
};

export default DeploymentsModal;