// // Deployments.jsx

// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useTheme as useCustomTheme } from '../../../Context/ThemeContext';
// import { useDataLayer } from '../../../Context/DataLayer';
// import { useGitHub } from '../../../hooks/useGitHub';
// import { 
//   Box, 
//   Typography, 
//   Button,
//   Chip,
//   IconButton,
//   Alert,
//   Tooltip,
//   Menu,
//   MenuItem,
//   LinearProgress,
//   alpha,
//   useTheme,
//   Divider,
//   Collapse,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Select,
//   FormControl,
//   InputLabel,
//   FormHelperText,
//   CircularProgress,
//   Grid
// } from '@mui/material';
// import { 
//   RocketLaunch,
//   Code,
//   CloudUpload,
//   CheckCircle,
//   Warning,
//   MoreVert,
//   ArrowForward,
//   GitHub,
//   Link as LinkIcon,
//   Schedule,
//   PlayArrow,
//   Visibility,
//   Settings,
//   Delete,
//   Refresh,
//   AutoAwesome,
//   TrendingUp,
//   Science,
//   Public,
//   Commit,
//   Terminal,
//   Security,
//   Close
// } from '@mui/icons-material';
// import { motion, AnimatePresence } from 'framer-motion';
// import { GlassCard } from '../components/Buttons';
// import { SimpleConfirm } from '../components/SimpleConfirm';
// import NeuralNetwork from '../components/NeuralNetwork';
// import { githubConfig } from '../../../config/github';

// // Deployment stage configuration
// const DEPLOYMENT_STAGES = {
//   NEW: {
//     label: 'New Projects',
//     icon: AutoAwesome,
//     color: '#9333EA',
//     nextStage: 'DEVELOPMENT',
//     nextAction: 'Deploy to Development',
//     description: 'Ready to start development'
//   },
//   DEVELOPMENT: {
//     label: 'Development',
//     icon: Code,
//     color: '#3B82F6',
//     nextStage: 'STAGING',
//     nextAction: 'Push to Staging',
//     description: 'Active development environment'
//   },
//   STAGING: {
//     label: 'Staging',
//     icon: Science,
//     color: '#F59E0B',
//     nextStage: 'PRODUCTION',
//     nextAction: 'Submit for Production',
//     description: 'Testing and validation'
//   },
//   PRODUCTION: {
//     label: 'Production',
//     icon: Public,
//     color: '#10B981',
//     nextStage: null,
//     nextAction: null,
//     description: 'Live and serving users'
//   }
// };

// // Plugin card component
// const PluginCard = ({ plugin, onDeploy, onAction, isLightTheme, colors, glassmorphism }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [expanded, setExpanded] = useState(false);
//   const stage = DEPLOYMENT_STAGES[plugin.deploymentStatus];
  
//   const handleMenuOpen = (event) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//   };
  
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       whileHover={{ y: -2 }}
//       transition={{ duration: 0.2 }}
//     >
//       <GlassCard
//         variant="default"
//         sx={{
//           p: 2.5,
//           mb: 2,
//           cursor: 'pointer',
//           transition: 'all 0.2s ease',
//           border: `1px solid ${alpha(stage.color, 0.3)}`,
//           '&:hover': {
//             borderColor: alpha(stage.color, 0.5),
//             boxShadow: `0 8px 32px ${alpha(stage.color, 0.15)}`
//           }
//         }}
//         onClick={() => setExpanded(!expanded)}
//       >
//         {/* Main Content */}
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
//             {/* Status Icon */}
//             <Box
//               sx={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 2,
//                 background: alpha(stage.color, 0.1),
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 color: stage.color,
//                 flexShrink: 0
//               }}
//             >
//               <stage.icon sx={{ fontSize: 24 }} />
//             </Box>

//             {/* Plugin Info */}
//             <Box sx={{ flex: 1 }}>
//               <Typography 
//                 variant="h6" 
//                 sx={{ 
//                   fontWeight: 600, 
//                   color: isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)',
//                   mb: 0.5
//                 }}
//               >
//                 {plugin.name}
//               </Typography>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//                 <Typography 
//                   variant="caption" 
//                   sx={{ 
//                     color: isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'
//                   }}
//                 >
//                   {plugin.category}
//                 </Typography>
//                 {plugin.gitRepo && (
//                   <Typography 
//                     variant="caption" 
//                     sx={{ 
//                       color: isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 0.5
//                     }}
//                   >
//                     <GitHub sx={{ fontSize: 14 }} />
//                     {plugin.gitRepo.split('/').pop()}
//                   </Typography>
//                 )}
//                 <Typography 
//                   variant="caption" 
//                   sx={{ 
//                     color: isLightTheme ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 0.5
//                   }}
//                 >
//                   <Schedule sx={{ fontSize: 14 }} />
//                   {formatDate(plugin.updatedAt)}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           {/* Actions */}
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             {stage.nextStage && (
//               <Button
//                 variant="contained"
//                 size="small"
//                 startIcon={<ArrowForward />}
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onDeploy(plugin, stage.nextStage);
//                 }}
//                 sx={{
//                   background: `linear-gradient(135deg, ${stage.color}, ${alpha(stage.color, 0.8)})`,
//                   color: '#ffffff',
//                   textTransform: 'none',
//                   fontWeight: 600,
//                   px: 2,
//                   '&:hover': {
//                     background: `linear-gradient(135deg, ${alpha(stage.color, 0.9)}, ${stage.color})`
//                   }
//                 }}
//               >
//                 {stage.nextAction}
//               </Button>
//             )}
            
//             <IconButton
//               size="small"
//               onClick={handleMenuOpen}
//               sx={{ 
//                 color: isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)'
//               }}
//             >
//               <MoreVert />
//             </IconButton>
//           </Box>
//         </Box>

//         {/* Expanded Details */}
//         <Collapse in={expanded}>
//           <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(colors.accent, 0.1)}` }}>
//             <Typography 
//               variant="body2" 
//               sx={{ 
//                 color: isLightTheme ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)',
//                 mb: 2
//               }}
//             >
//               {plugin.description}
//             </Typography>
            
//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               {plugin.gitRepo && (
//                 <Chip
//                   icon={<GitHub />}
//                   label="View Repository"
//                   size="small"
//                   component="a"
//                   href={plugin.gitRepo}
//                   target="_blank"
//                   clickable
//                   sx={{
//                     background: alpha(colors.accent, 0.1),
//                     color: colors.accent,
//                     '&:hover': {
//                       background: alpha(colors.accent, 0.2)
//                     }
//                   }}
//                 />
//               )}
//               {plugin.deploymentUrl && (
//                 <Chip
//                   icon={<LinkIcon />}
//                   label="View Deployment"
//                   size="small"
//                   component="a"
//                   href={plugin.deploymentUrl}
//                   target="_blank"
//                   clickable
//                   sx={{
//                     background: alpha(stage.color, 0.1),
//                     color: stage.color,
//                     '&:hover': {
//                       background: alpha(stage.color, 0.2)
//                     }
//                   }}
//                 />
//               )}
//               <Chip
//                   icon={<TrendingUp />}
//                   label={`${plugin.totalInstalls || 0} installs`}
//                   size="small"
//                   sx={{
//                     background: alpha('#10B981', 0.1),
//                     color: '#10B981'
//                   }}
//                 />
//             </Box>
//           </Box>
//         </Collapse>

//         {/* Context Menu */}
//         <Menu
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//           PaperProps={{
//             sx: {
//               ...glassmorphism,
//               border: `1px solid ${alpha(colors.accent, 0.2)}`
//             }
//           }}
//         >
//           <MenuItem onClick={() => {
//             handleMenuClose();
//             onAction('view', plugin);
//           }}>
//             <Visibility sx={{ mr: 1, fontSize: 20 }} /> View Details
//           </MenuItem>
//           <MenuItem onClick={() => {
//             handleMenuClose();
//             onAction('settings', plugin);
//           }}>
//             <Settings sx={{ mr: 1, fontSize: 20 }} /> Settings
//           </MenuItem>
//           <Divider />
//           <MenuItem 
//             onClick={() => {
//               handleMenuClose();
//               onAction('delete', plugin);
//             }}
//             sx={{ color: '#EF4444' }}
//           >
//             <Delete sx={{ mr: 1, fontSize: 20 }} /> Delete
//           </MenuItem>
//         </Menu>
//       </GlassCard>
//     </motion.div>
//   );
// };

// // Main Deployments component
// export default function Deployments() {
//   const navigate = useNavigate();
//   const muiTheme = useTheme();
//   const { theme, colors, gradients, glassmorphism } = useCustomTheme();
//   const isLightTheme = theme === 'light';
  
//   // Use DataLayer for plugin data
//   const { userPlugins, userPluginsDataRef, updateUserPlugins } = useDataLayer();
//   const [projects, setProjects] = useState([]);
  
//   // GitHub hook for operations
//   const { 
//     triggerPluginPush, 
//     checkCallbackStatus,
//     fetchSpecificRepo 
//   } = useGitHub();
  
//   const [loading, setLoading] = useState(true);
//   const [selectedPlugin, setSelectedPlugin] = useState(null);
//   const [actionType, setActionType] = useState(null);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
  
//   // Deployment dialog state
//   const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);
//   const [deploymentForm, setDeploymentForm] = useState({
//     githubToken: '',
//     gitEmail: '',
//     selectedCommit: '',
//     branch: 'main'
//   });
//   const [commits, setCommits] = useState([]);
//   const [loadingCommits, setLoadingCommits] = useState(false);
  
//   // Console state
//   const [showConsole, setShowConsole] = useState(false);
//   const [streamUrl, setStreamUrl] = useState(null);
//   const [deploymentCompleted, setDeploymentCompleted] = useState(false);
//   const wsRef = useRef(null);

//   // Theme-aware colors
//   const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
//   const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
//   const borderColor = isLightTheme ? '#e0e0e0' : 'rgba(255,255,255,0.12)';

//   // Update projects when userPluginsDataRef changes
//   useEffect(() => {
//     if (userPlugins) {
//       setProjects(userPlugins);
//       setLoading(false);
//     }
//   }, [userPlugins, userPluginsDataRef]);

//   const handleRefresh = () => {
//     setRefreshing(true);
//     // Just trigger a re-render to pick up any changes from the ref
//     setProjects([...userPluginsDataRef.current || []]);
//     setTimeout(() => setRefreshing(false), 500);
//   };

//   // Group plugins by deployment status
//   const groupedPlugins = projects.reduce((acc, plugin) => {
//     const status = plugin.deploymentStatus || 'NEW';
//     if (!acc[status]) acc[status] = [];
//     acc[status].push(plugin);
//     return acc;
//   }, {});

//   // Handle deployment push - opens deployment dialog
//   const handleDeploy = async (plugin, nextStage) => {
//     setSelectedPlugin(plugin);
//     setActionType(`deploy-${nextStage}`);
    
//     // Reset deployment form
//     setDeploymentForm({
//       githubToken: '',
//       gitEmail: '',
//       selectedCommit: '',
//       branch: 'main'
//     });
    
//     // Fetch commits if repo exists
//     if (plugin.gitRepo) {
//       await fetchCommitsForRepo(plugin.gitRepo);
//     }
    
//     setShowDeploymentDialog(true);
//   };
  
//   // Fetch commits for a repository
//   const fetchCommitsForRepo = async (repoUrl) => {
//     setLoadingCommits(true);
//     try {
//       // Parse repo URL to get owner/repo
//       const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
//       if (match) {
//         const [, owner, repo] = match;
//         const apiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
        
//         const response = await fetch(apiUrl);
//         if (response.ok) {
//           const data = await response.json();
//           // Get last 10 commits
//           const recentCommits = data.slice(0, 10).map(commit => ({
//             sha: commit.sha,
//             message: commit.commit.message,
//             author: commit.commit.author.name,
//             date: new Date(commit.commit.author.date)
//           }));
//           setCommits(recentCommits);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching commits:', error);
//       setCommits([]);
//     } finally {
//       setLoadingCommits(false);
//     }
//   };

//   // Handle other actions
//   const handleAction = (action, plugin) => {
//     setSelectedPlugin(plugin);
//     setActionType(action);
    
//     if (action === 'delete') {
//       setShowConfirm(true);
//     } else if (action === 'view') {
//       // Navigate to plugin details
//       navigate(`/staff/plugins/${plugin.id}`);
//     } else if (action === 'settings') {
//       // Navigate to plugin settings
//       navigate(`/staff/plugins/${plugin.id}/settings`);
//     }
//   };

//   // Connect to WebSocket stream
//   const connectToStream = (wsUrl) => {
//     if (wsRef.current) {
//       wsRef.current.close();
//     }
    
//     const consoleOutput = document.getElementById('deployment-console-output');
//     if (!consoleOutput) return;
    
//     // Clear initial message
//     consoleOutput.innerHTML = '';
    
//     const addLog = (message, color = '#d4d4d4') => {
//       const line = document.createElement('div');
//       line.style.color = color;
//       line.style.marginBottom = '2px';
      
//       const timestamp = new Date().toLocaleTimeString();
//       line.innerHTML = `<span style="color: #666; font-size: 11px">[${timestamp}]</span> ${message}`;
      
//       consoleOutput.appendChild(line);
//       consoleOutput.scrollTop = consoleOutput.scrollHeight;
//     };
    
//     try {
//       const ws = new WebSocket(wsUrl);
//       wsRef.current = ws;
      
//       ws.onopen = () => {
//         addLog('🔗 Connected to deployment stream', colors.accent);
//       };
      
//       ws.onmessage = (event) => {
//         try {
//           const message = JSON.parse(event.data);
//           addLog(message.data || event.data);
//         } catch (e) {
//           addLog(event.data);
//         }
//       };
      
//       ws.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         addLog(`❌ Connection error: ${error.type || 'Unknown error'}`, '#ef4444');
//       };
      
//       ws.onclose = (closeEvent) => {
//         addLog(`🔌 Stream disconnected (Code: ${closeEvent.code})`, '#888');
//         setStreamUrl(null);
//         setDeploymentCompleted(true);
//       };
//     } catch (error) {
//       console.error('WebSocket creation error:', error);
//       addLog(`❌ Failed to connect: ${error.message}`, '#ef4444');
//     }
//   };
  
//   // Handle deployment action
//   const handleDeploymentConfirm = async () => {
//     if (!selectedPlugin || !deploymentForm.githubToken || !deploymentForm.selectedCommit) {
//       alert('Please fill in all required fields');
//       return;
//     }
    
//     setShowDeploymentDialog(false);
//     setShowConsole(true);
//     setDeploymentCompleted(false);
    
//     try {
//       // Parse repo URL
//       const match = selectedPlugin.gitRepo.match(/github\.com\/([^\/]+)\/([^\/]+)/);
//       if (!match) {
//         throw new Error('Invalid repository URL');
//       }
      
//       const [, owner, repo] = match;
//       const nextStage = actionType.split('-')[1];
      
//       // Trigger deployment workflow
//       const dispatchResult = await triggerPluginPush({
//         githubToken: deploymentForm.githubToken,
//         gitEmail: deploymentForm.gitEmail,
//         pluginConfig: {
//           id: selectedPlugin.id,
//           name: selectedPlugin.name,
//           deploymentStatus: nextStage
//         },
//         dispatchOwner: githubConfig.dispatchOwner,
//         dispatchRepo: githubConfig.dispatchRepo,
//         enableCallback: true,
//         commitSHA: deploymentForm.selectedCommit,
//         currentDeploymentStatus: selectedPlugin.deploymentStatus,
//         branch: deploymentForm.branch
//       });
      
//       console.log('Deployment triggered:', dispatchResult);
      
//       // Poll for stream URL
//       if (dispatchResult.callbackId) {
//         const pollInterval = setInterval(async () => {
//           try {
//             const status = await checkCallbackStatus(dispatchResult.callbackId);
            
//             if (status?.stream?.stream_url) {
//               console.log('Stream URL received:', status.stream.stream_url);
//               setStreamUrl(status.stream.stream_url);
//               clearInterval(pollInterval);
//               connectToStream(status.stream.stream_url);
//             }
//           } catch (err) {
//             console.error('Error checking callback:', err);
//           }
//         }, 2000);
        
//         // Stop polling after 30 seconds
//         setTimeout(() => clearInterval(pollInterval), 30000);
//       }
      
//       // Update local state
//       const updatedPlugins = projects.map(p => 
//         p.id === selectedPlugin.id 
//           ? { ...p, deploymentStatus: nextStage }
//           : p
//       );
//       updateUserPlugins(updatedPlugins);
      
//     } catch (error) {
//       console.error('Error deploying:', error);
//       alert(`Deployment failed: ${error.message}`);
//       setShowConsole(false);
//     }
//   };
  
//   // Confirm action (for delete)
//   const confirmAction = async () => {
//     if (!selectedPlugin || !actionType) return;

//     try {
//       if (actionType === 'delete') {
//         // Remove from local state
//         const updatedPlugins = projects.filter(p => p.id !== selectedPlugin.id);
//         updateUserPlugins(updatedPlugins);
//       }
//     } catch (error) {
//       console.error('Error performing action:', error);
//     } finally {
//       setShowConfirm(false);
//       setSelectedPlugin(null);
//       setActionType(null);
//     }
//   };

//   // Get confirmation message
//   const getConfirmMessage = () => {
//     if (!actionType || !selectedPlugin) return '';
    
//     if (actionType === 'delete') {
//       return `Are you sure you want to delete "${selectedPlugin.name}"? This action cannot be undone.`;
//     } else if (actionType.startsWith('deploy-')) {
//       const nextStage = actionType.split('-')[1];
//       const stageInfo = DEPLOYMENT_STAGES[nextStage];
//       return `Deploy "${selectedPlugin.name}" to ${stageInfo.label}? ${
//         nextStage === 'PRODUCTION' 
//           ? 'This will submit your plugin for review before going live.' 
//           : 'You can rollback this change later if needed.'
//       }`;
//     }
//     return '';
//   };

//   if (loading) {
//     return (
//       <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <RocketLaunch sx={{ fontSize: 48, color: colors.accent, mb: 2 }} />
//           <Typography variant="h6" sx={{ color: textPrimary }}>Loading deployments...</Typography>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <Box>
//           <Typography variant="h4" sx={{ fontWeight: 700, color: textPrimary, mb: 1 }}>
//             Deployments
//           </Typography>
//           <Typography variant="body1" sx={{ color: textSecondary }}>
//             Manage your plugin deployments across different environments
//           </Typography>
//         </Box>
        
//         <Button
//           variant="outlined"
//           startIcon={refreshing ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : <Refresh />}
//           onClick={handleRefresh}
//           disabled={refreshing}
//           sx={{
//             borderColor: alpha(colors.accent, 0.5),
//             color: colors.accent,
//             '&:hover': {
//               borderColor: colors.accent,
//               background: alpha(colors.accent, 0.1)
//             }
//           }}
//         >
//           Refresh
//         </Button>
//       </Box>

//       {/* Empty State */}
//       {(!userPlugins || userPlugins.length === 0) ? (
//         <GlassCard variant="strong" sx={{ p: 6, textAlign: 'center' }}>
//           <RocketLaunch sx={{ fontSize: 64, color: colors.accent, mb: 2 }} />
//           <Typography variant="h5" sx={{ fontWeight: 600, color: textPrimary, mb: 1 }}>
//             No plugins yet
//           </Typography>
//           <Typography variant="body1" sx={{ color: textSecondary, mb: 3 }}>
//             Create your first plugin to start deploying
//           </Typography>
//           <Button
//             variant="contained"
//             size="large"
//             startIcon={<PlayArrow />}
//             onClick={() => navigate('/staff/plugins/new')}
//             sx={{
//               background: `linear-gradient(135deg, ${colors.accent}, ${alpha(colors.accent, 0.8)})`,
//               color: '#ffffff',
//               textTransform: 'none',
//               fontWeight: 600,
//               px: 4,
//               py: 1.5,
//               '&:hover': {
//                 background: `linear-gradient(135deg, ${alpha(colors.accent, 0.9)}, ${colors.accent})`
//               }
//             }}
//           >
//             Create New Plugin
//           </Button>
//         </GlassCard>
//       ) : (
//         /* Deployment Stages */
//         <Box sx={{ display: 'grid', gap: 4 }}>
//           {Object.entries(DEPLOYMENT_STAGES).map(([status, stageInfo]) => {
//             const plugins = groupedPlugins[status] || [];
            
//             return (
//               <Box key={status}>
//                 {/* Stage Header */}
//                 <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
//                   <Box
//                     sx={{
//                       width: 40,
//                       height: 40,
//                       borderRadius: 2,
//                       background: alpha(stageInfo.color, 0.1),
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       color: stageInfo.color
//                     }}
//                   >
//                     <stageInfo.icon />
//                   </Box>
//                   <Box sx={{ flex: 1 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 600, color: textPrimary }}>
//                       {stageInfo.label}
//                     </Typography>
//                     <Typography variant="caption" sx={{ color: textSecondary }}>
//                       {stageInfo.description}
//                     </Typography>
//                   </Box>
//                   <Chip 
//                     label={plugins.length} 
//                     size="small"
//                     sx={{
//                       background: alpha(stageInfo.color, 0.1),
//                       color: stageInfo.color,
//                       fontWeight: 600
//                     }}
//                   />
//                 </Box>

//                 {/* Plugin List */}
//                 {plugins.length > 0 ? (
//                   <AnimatePresence mode="popLayout">
//                     {plugins.map((plugin) => (
//                       <PluginCard
//                         key={plugin.id}
//                         plugin={plugin}
//                         onDeploy={handleDeploy}
//                         onAction={handleAction}
//                         isLightTheme={isLightTheme}
//                         colors={colors}
//                         glassmorphism={glassmorphism}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 ) : (
//                   <Box
//                     sx={{
//                       p: 4,
//                       textAlign: 'center',
//                       border: `2px dashed ${alpha(stageInfo.color, 0.3)}`,
//                       borderRadius: 2,
//                       background: alpha(stageInfo.color, 0.05)
//                     }}
//                   >
//                     <Typography variant="body2" sx={{ color: textSecondary }}>
//                       No plugins in {stageInfo.label.toLowerCase()}
//                     </Typography>
//                   </Box>
//                 )}
//               </Box>
//             );
//           })}
//         </Box>
//       )}

//       {/* Progress Indicator */}
//       {userPlugins && userPlugins.length > 0 && (
//         <Box sx={{ mt: 6, p: 3 }}>
//           <Typography variant="subtitle2" sx={{ color: textSecondary, mb: 2 }}>
//             Deployment Pipeline Progress
//           </Typography>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//             {Object.entries(DEPLOYMENT_STAGES).map(([status, stageInfo], index) => {
//               const count = (groupedPlugins[status] || []).length;
//               const hasPlugins = count > 0;
              
//               return (
//                 <React.Fragment key={status}>
//                   <Tooltip title={`${count} plugin${count !== 1 ? 's' : ''} in ${stageInfo.label}`}>
//                     <Box
//                       sx={{
//                         width: 40,
//                         height: 40,
//                         borderRadius: '50%',
//                         background: hasPlugins ? stageInfo.color : alpha(stageInfo.color, 0.2),
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         color: hasPlugins ? '#ffffff' : stageInfo.color,
//                         cursor: 'pointer',
//                         transition: 'all 0.3s ease',
//                         '&:hover': {
//                           transform: 'scale(1.1)'
//                         }
//                       }}
//                     >
//                       {hasPlugins ? count : <stageInfo.icon sx={{ fontSize: 20 }} />}
//                     </Box>
//                   </Tooltip>
//                   {index < Object.keys(DEPLOYMENT_STAGES).length - 1 && (
//                     <Box
//                       sx={{
//                         flex: 1,
//                         height: 2,
//                         background: alpha(colors.accent, 0.2),
//                         position: 'relative',
//                         overflow: 'hidden'
//                       }}
//                     >
//                       <Box
//                         sx={{
//                           position: 'absolute',
//                           top: 0,
//                           left: '-100%',
//                           width: '100%',
//                           height: '100%',
//                           background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
//                           animation: 'slide 3s linear infinite'
//                         }}
//                       />
//                     </Box>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </Box>
//         </Box>
//       )}

//       {/* Confirmation Dialog */}
//       <SimpleConfirm
//         open={showConfirm}
//         onClose={() => {
//           setShowConfirm(false);
//           setSelectedPlugin(null);
//           setActionType(null);
//         }}
//         onConfirm={confirmAction}
//         message={getConfirmMessage()}
//       />

//       {/* Animation keyframes */}
//       <style>
//         {`
//           @keyframes slide {
//             from { left: -100%; }
//             to { left: 100%; }
//           }
//           @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//           }
//         `}
//       </style>

//       {/* Deployment Dialog */}
//       <Dialog
//         open={showDeploymentDialog}
//         onClose={() => setShowDeploymentDialog(false)}
//         maxWidth="md"
//         fullWidth
//         PaperProps={{
//           sx: {
//             ...glassmorphism,
//             background: isLightTheme ? 'rgba(255,255,255,0.95)' : 'rgba(18,18,18,0.95)',
//             border: `1px solid ${alpha(colors.accent, 0.2)}`
//           }
//         }}
//       >
//         <DialogTitle sx={{ borderBottom: `1px solid ${borderColor}` }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
//               Deploy {selectedPlugin?.name} to {actionType?.split('-')[1]}
//             </Typography>
//             <IconButton onClick={() => setShowDeploymentDialog(false)} size="small">
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
        
//         <DialogContent sx={{ p: 3 }}>
//           <Grid container spacing={3}>
//             {/* Repository Info */}
//             <Grid size={12}>
//               <Alert severity="info" icon={<GitHub />} sx={{ mb: 2 }}>
//                 <Typography variant="body2">
//                   Repository: <strong>{selectedPlugin?.gitRepo || 'No repository linked'}</strong>
//                 </Typography>
//               </Alert>
//             </Grid>

//             {/* GitHub Token */}
//             <Grid size={12}>
//               <TextField
//                 fullWidth
//                 type="password"
//                 label="GitHub Personal Access Token"
//                 placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
//                 value={deploymentForm.githubToken}
//                 onChange={(e) => setDeploymentForm({ ...deploymentForm, githubToken: e.target.value })}
//                 helperText="Required for authentication. Needs 'repo' and 'workflow' scopes."
//                 sx={{
//                   '& .MuiInputLabel-root': { color: textSecondary },
//                   '& .MuiOutlinedInput-root': {
//                     background: alpha(colors.glassWhite, 0.05),
//                     color: textPrimary,
//                     '& fieldset': { borderColor: borderColor },
//                     '&:hover fieldset': { borderColor: alpha(colors.accent, 0.5) },
//                     '&.Mui-focused fieldset': { borderColor: colors.accent }
//                   },
//                   '& .MuiFormHelperText-root': { color: textSecondary }
//                 }}
//               />
//               <Box sx={{ mt: 1 }}>
//                 <Button
//                   size="small"
//                   href="https://github.com/settings/tokens/new"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   sx={{
//                     color: colors.accent,
//                     textTransform: 'none',
//                     fontSize: '0.75rem',
//                     '&:hover': { background: alpha(colors.accent, 0.1) }
//                   }}
//                 >
//                   Create Token →
//                 </Button>
//               </Box>
//             </Grid>

//             {/* Git Email */}
//             <Grid size={12}>
//               <TextField
//                 fullWidth
//                 type="email"
//                 label="Git Email"
//                 placeholder="your.email@example.com"
//                 value={deploymentForm.gitEmail}
//                 onChange={(e) => setDeploymentForm({ ...deploymentForm, gitEmail: e.target.value })}
//                 helperText="Email associated with your GitHub account"
//                 sx={{
//                   '& .MuiInputLabel-root': { color: textSecondary },
//                   '& .MuiOutlinedInput-root': {
//                     background: alpha(colors.glassWhite, 0.05),
//                     color: textPrimary,
//                     '& fieldset': { borderColor: borderColor },
//                     '&:hover fieldset': { borderColor: alpha(colors.accent, 0.5) },
//                     '&.Mui-focused fieldset': { borderColor: colors.accent }
//                   },
//                   '& .MuiFormHelperText-root': { color: textSecondary }
//                 }}
//               />
//             </Grid>

//             {/* Commit Selection */}
//             <Grid size={12}>
//               <FormControl fullWidth>
//                 <InputLabel sx={{ color: textSecondary }}>Select Commit</InputLabel>
//                 <Select
//                   value={deploymentForm.selectedCommit}
//                   onChange={(e) => setDeploymentForm({ ...deploymentForm, selectedCommit: e.target.value })}
//                   label="Select Commit"
//                   sx={{
//                     background: alpha(colors.glassWhite, 0.05),
//                     color: textPrimary,
//                     '& .MuiOutlinedInput-notchedOutline': { borderColor: borderColor },
//                     '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: alpha(colors.accent, 0.5) },
//                     '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.accent }
//                   }}
//                 >
//                   {loadingCommits ? (
//                     <MenuItem disabled>
//                       <CircularProgress size={20} sx={{ mr: 1 }} />
//                       Loading commits...
//                     </MenuItem>
//                   ) : commits.length === 0 ? (
//                     <MenuItem disabled>No commits found</MenuItem>
//                   ) : (
//                     commits.map((commit) => (
//                       <MenuItem key={commit.sha} value={commit.sha}>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                             {commit.sha.substring(0, 7)} - {commit.message.substring(0, 50)}
//                             {commit.message.length > 50 && '...'}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: textSecondary }}>
//                             {commit.author} • {new Date(commit.date).toLocaleDateString()}
//                           </Typography>
//                         </Box>
//                       </MenuItem>
//                     ))
//                   )}
//                 </Select>
//                 <FormHelperText>Select the commit to deploy</FormHelperText>
//               </FormControl>
//             </Grid>

//             {/* Branch */}
//             <Grid size={12}>
//               <TextField
//                 fullWidth
//                 label="Branch"
//                 value={deploymentForm.branch}
//                 onChange={(e) => setDeploymentForm({ ...deploymentForm, branch: e.target.value })}
//                 helperText="Target branch for deployment"
//                 sx={{
//                   '& .MuiInputLabel-root': { color: textSecondary },
//                   '& .MuiOutlinedInput-root': {
//                     background: alpha(colors.glassWhite, 0.05),
//                     color: textPrimary,
//                     '& fieldset': { borderColor: borderColor },
//                     '&:hover fieldset': { borderColor: alpha(colors.accent, 0.5) },
//                     '&.Mui-focused fieldset': { borderColor: colors.accent }
//                   },
//                   '& .MuiFormHelperText-root': { color: textSecondary }
//                 }}
//               />
//             </Grid>
//           </Grid>
//         </DialogContent>

//         <DialogActions sx={{ p: 2, borderTop: `1px solid ${borderColor}` }}>
//           <Button onClick={() => setShowDeploymentDialog(false)} sx={{ color: textSecondary }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleDeploymentConfirm}
//             disabled={!deploymentForm.githubToken || !deploymentForm.gitEmail || !deploymentForm.selectedCommit}
//             startIcon={<CloudUpload />}
//             sx={{
//               background: `linear-gradient(135deg, ${colors.accent}, ${alpha(colors.accent, 0.8)})`,
//               color: '#ffffff',
//               textTransform: 'none',
//               fontWeight: 600,
//               '&:hover': {
//                 background: `linear-gradient(135deg, ${alpha(colors.accent, 0.9)}, ${colors.accent})`
//               },
//               '&:disabled': {
//                 background: alpha(colors.accent, 0.3),
//                 color: alpha('#ffffff', 0.5)
//               }
//             }}
//           >
//             Advance Project
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Deployment Console Dialog */}
//       <Dialog
//         open={showConsole}
//         onClose={() => setShowConsole(false)}
//         maxWidth="lg"
//         fullWidth
//         PaperProps={{
//           sx: {
//             ...glassmorphism,
//             background: isLightTheme ? 'rgba(255,255,255,0.95)' : 'rgba(18,18,18,0.95)',
//             border: `1px solid ${alpha(colors.accent, 0.2)}`,
//             height: '80vh'
//           }
//         }}
//       >
//         <DialogTitle sx={{ borderBottom: `1px solid ${borderColor}` }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//               <Terminal sx={{ color: colors.accent }} />
//               <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
//                 Deployment Console
//               </Typography>
//               {streamUrl && (
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//                   <CircularProgress size={14} thickness={5} sx={{ color: colors.accent }} />
//                   <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 500 }}>
//                     Connected
//                   </Typography>
//                 </Box>
//               )}
//             </Box>
//             <IconButton onClick={() => setShowConsole(false)} size="small">
//               <Close />
//             </IconButton>
//           </Box>
//         </DialogTitle>
        
//         <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
//           <Box
//             sx={{
//               position: 'relative',
//               backgroundColor: isLightTheme ? '#f1f3f4' : '#161b22',
//               borderBottom: `1px solid ${borderColor}`,
//               p: 2,
//               overflow: 'hidden',
//             }}
//           >
//             {/* Neural Network Animation */}
//             <Box sx={{ 
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               width: '300px',
//               height: '80px',
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center',
//               zIndex: 1,
//             }}>
//               <Box sx={{ 
//                 opacity: streamUrl ? 1 : 0,
//                 transition: 'opacity 0.5s ease-in-out',
//                 position: 'absolute',
//                 width: '100%',
//                 height: '100%',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//                 <NeuralNetwork />
//               </Box>
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   position: 'absolute',
//                   color: textSecondary,
//                   whiteSpace: 'nowrap',
//                   opacity: streamUrl ? 0 : 1,
//                   transition: 'opacity 0.5s ease-in-out',
//                   fontSize: '0.95rem',
//                   fontWeight: 500,
//                 }}
//               >
//                 {deploymentCompleted 
//                   ? 'Deployment completed successfully! 🎉' 
//                   : 'Waiting for deployment stream...'}
//               </Typography>
//             </Box>
//           </Box>
          
//           {/* Console Output */}
//           <Box
//             id="deployment-console-output"
//             sx={{
//               flex: 1,
//               overflowY: 'auto',
//               fontSize: '13px',
//               lineHeight: '1.6',
//               fontFamily: 'SF Mono, Monaco, Inconsolata, "Courier New", monospace',
//               p: 2,
//               backgroundColor: isLightTheme ? '#ffffff' : '#0d1117',
//               color: isLightTheme ? '#24292e' : '#c9d1d9',
//               '&::-webkit-scrollbar': {
//                 width: '8px',
//               },
//               '&::-webkit-scrollbar-track': {
//                 backgroundColor: isLightTheme ? '#e1e4e8' : '#30363d',
//               },
//               '&::-webkit-scrollbar-thumb': {
//                 backgroundColor: isLightTheme ? '#afb8c1' : '#484f58',
//                 borderRadius: '4px',
//                 '&:hover': {
//                   backgroundColor: isLightTheme ? '#8b949e' : '#58636d',
//                 }
//               },
//             }}
//           >
//             <div style={{ color: colors.accent }}>
//               Ready to receive deployment logs...
//             </div>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </Box>
//   );
// }
