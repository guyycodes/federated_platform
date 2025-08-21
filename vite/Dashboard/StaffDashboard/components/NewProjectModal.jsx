// NewProjectModal.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlugins } from '../../../hooks/usePlugins';
import { useUsers } from '../../../hooks/useUsers';
import { useUser } from '@clerk/clerk-react';
import { 
  Box, 
  Typography, 
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  TextField,
  IconButton,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CardContent,
  alpha,
  useTheme,

  CircularProgress
} from '@mui/material';
import { 
  Close,
  Add,
  ArrowForward,
  ArrowBack,
  Star,
  Info,
  Refresh,
  RocketLaunch,
  GitHub,
  Code,
  CloudUpload,
  Security,
  Speed,
  AttachMoney,
  ContentCopy,
  Psychology,
  Description,
  Analytics,
  Language,
  ExpandMore
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, PrimaryButton, AccentButton } from './Buttons';
import projectTemplatesData from './projectTemplates.json';
import { useTheme as useCustomTheme } from '../../../Context/ThemeContext';
import { useDataLayer } from '../../../Context/DataLayer';
import { useGitHub } from '../../../hooks/useGitHub';
import { githubConfig } from '../../../config/github';
import NeuralNetwork from './NeuralNetwork';
import { SimpleConfirm } from './SimpleConfirm';

// API-only templates that don't support Node.js backend
const API_ONLY_TEMPLATES = ['doc-analyzer', 'audio-transcription', 'content-creator'];

// Text content - easy to edit here
const MODAL_TEXT = {
  title: 'Create New Plugin',
  
  // Step 1: Template Selection
  step1: {
    title: 'Choose Your Starting Point',
    subtitle: 'Select a pre-configured template or start from scratch',
    popularChip: 'Popular',
    continueButton: 'Build'
  },
  
  // Step 2: Configure Plugin
  step2: {
    title: 'Configure Your Plugin',
    subtitle: 'Setup information about your ML/LLM plugin',
    nameLabel: 'Plugin Name',
    descriptionLabel: 'Description',
    categoryLabel: 'Category',
    projectTypes: 'Project Template',
    pricingTitle: 'Pricing Model',
    pricingOptions: {
      freemium: 'Freemium (Free with optional paid features)',
      oneTime: 'One-time Purchase',
      subscription: 'Monthly Subscription',
      usageBased: 'Usage-Based (per 1M tokens)',
    },
    oneTimePriceLabel: 'One-time Price ($)',
    oneTimePricePlaceholder: 'e.g., 1.99',
    subscriptionTierLabel: 'Subscription Tier',
    subscriptionTiers: {
      individual: 'Individual',
      pro: 'Pro',
      enterprise: 'Enterprise'
    },
    tokenCostLabel: 'Cost per 1M Tokens ($)',
    tokenCostPlaceholder: 'e.g., 0.02',
    projectTypesOptions: {
      frontend: 'Frontend',
      backend: 'Backend',
      frontendOptions: {
        typescript: 'React Typescript',
        javascript: 'React Javascript',
      },
      backendOptions: {
        node: 'Node.js (API only)',
        python: 'Python (LLM\'s + API)',
      },
    },
    whiteLabelTitle: 'Enable White-Label for Enterprise',
    whiteLabelSubtitle: 'Allow enterprise customers to rebrand your plugin',
    whiteLabelComingSoon: 'Coming Soon',
    whiteLabelNotify: 'Get notified when available',
    categories: {
      development: 'Development',
      productivity: 'Productivity',
      analytics: 'Analytics',
      language: 'Language Processing',
      ai_ml: 'AI/ML',
      automation: 'Automation',
      integration: 'Integration',
      other: 'Other'
    }
  },
  
  // Step 3: Repository Setup
  step3: {
    title: 'Repository Destination',
    subtitle: 'Choose where to create your federated plugin template',
    createNewTitle: 'Create New Repository',
    createNewSubtitle: 'We\'ll create a new repository with your plugin template',
    useExistingTitle: 'Use Existing Empty Repository',
    useExistingSubtitle: 'Select an empty repository to populate with the template',
    projectNameLabel: 'Project Name',
    projectNamePlaceholder: 'my-awesome-plugin',
    projectNameHelper: 'This will be used as your repository name and plugin identifier',
    usernameLabel: 'GitHub Username',
    usernamePlaceholder: 'Enter your GitHub username',
    fetchReposButton: 'Find Repos',
    fetchingReposButton: 'Searching...',
    selectRepoText: 'Select an empty repository to use:',
    noEmptyReposFound: 'No empty repositories found for this user.',
    repoNotEmpty: 'This repository is not empty. Please select an empty repository.',
    templateNote: 'We\'ll generate a complete federated plugin template using your selected {template} template',
    includesTitle: 'Your generated template will include:',
    includes: [
      'Pre-configured federated plugin architecture',
      'Automated CI/CD pipeline (GitHub Actions)',
      'API authentication & rate limiting',
      'Performance monitoring & analytics',
      'Built-in billing integration'
    ]
  },
  
  // Step 4: Review & Deploy
  step4: {
    title: 'Review & Deploy',
    subtitle: 'Confirm your plugin details & add secrets',
    labels: {
      pluginName: 'Plugin Name',
      category: 'Category',
      description: 'Description',
      template: 'Template',
      pricingModel: 'Pricing Model',
      repository: 'Repository',
      whiteLabel: 'White-Label'
    },
    successFeatures: [
      'Isolated sandbox environment',
      'Auto-scaling infrastructure',
      'SSL certificate & custom subdomain',
      'API gateway with built-in monitoring'
    ],
    pluginConfigurationTitle: 'Plugin Configuration',
    frontendStackLabel: 'Frontend Stack',
    backendStackLabel: 'Backend Stack',
    pluginSecurityNote: 'Each App/Plugin is sandboxed, secured and encrypted.',
    secretsTitle: 'GitHub Authentication',
    secretsSubtitle: 'Required to interact with your repository',
    secretsFields: {
      token: {
        label: 'GitHub Personal Access Token',
        placeholder: 'ghp_xxxxxxxxxxxxxxxxxxxx',
        helper: `Required scopes: ${githubConfig.tokenScopes.join(', ')}`
      },
      email: {
        label: 'Git Email',
        placeholder: 'your-email@example.com',
        helper: 'Used for commit author'
      }
    },
    deployButton: 'Deploy Plugin',
    deployingButton: 'Deploying...',
    securityNote: 'Your credentials are encrypted, never stored, and only used for the creation of the plugin'
  },
  
  // Common buttons
  buttons: {
    back: 'Back',
    continue: 'Continue',
    close: 'Close'
  }
};

// Icon mapping from string names to components
const iconMap = {
  Psychology: Psychology,
  Description: Description,
  Analytics: Analytics,
  Code: Code,
  ContentCopy: ContentCopy,
  Language: Language,
};

export const NewProjectModal = ({ 
  open, 
  onClose,
  setIsFirstTime,
  onboardingSteps = [
    'Choose a Template',
    'Configure Plugin',
    'Setup Repository',
    'Deploy & Test'
  ]
}) => {
  const { remoteTrigger, setRemoteTrigger } = useDataLayer();
  const muiTheme = useTheme();
  const { theme, colors, gradients, glassmorphism } = useCustomTheme();
  const isLightTheme = theme === 'light';
  const navigate = useNavigate();
  
  // Get Clerk user
  const { user } = useUser();
  
  // GitHub integration hook
  const {
    fetchUserRepos,
    validateRepository,
    currentRepo,
    isLoading: githubLoading,
    error: githubError,
    clearError,
    triggerPluginCreation,
    checkCallbackStatus
  } = useGitHub();
  
  // Plugin management hook
  const { createNewPlugin } = usePlugins();
 

  // Add dark scrollbar styles and animations
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes rotateHourglass {
        0%, 10% {
          transform: rotate(0deg);
        }
        20%, 50% {
          transform: rotate(180deg);
        }
        60%, 100% {
          transform: rotate(360deg);
        }
      }
      .rotating-hourglass {
        display: inline-block;
        animation: rotateHourglass 10s ease-in-out infinite;
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

  
  // Theme-aware colors
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const backgroundPaper = isLightTheme ? '#ffffff' : colors.background;
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);
  
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [availableRepos, setAvailableRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoChoice, setRepoChoice] = useState('create'); // 'create' or 'existing'
  const [projectName, setProjectName] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [deploymentCompleted, setDeploymentCompleted] = useState(false);
  const [error, setError] = useState(null);
  
  // WebSocket stream URL
  const [streamUrl, setStreamUrl] = useState(null);
  const [showConsole, setShowConsole] = useState(false);
  const wsRef = React.useRef(null);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const [dots, setDots] = useState('');
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    category: '',
    gitRepo: '',
    pricing: 'freemium',
    oneTimePrice: '',
    subscriptionTier: '',
    usagePrice: '',
    whiteLabel: false,
    githubToken: '',
    gitEmail: '',
    templateId: '', // Selected template from step 1
    template: {
      Frontend: '',  // No default - user must select
      Backend: ''    // No default - user must select
    }
  });

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


  // Animate dots for "Waiting for deployment..."
  React.useEffect(() => {
    if (!deploymentCompleted && showConsole) {
      const dotsSequence = ['', '.', '..', '...'];
      let index = 0;
      
      const interval = setInterval(() => {
        setDots(dotsSequence[index]);
        index = (index + 1) % dotsSequence.length;
      }, 500); // Change dots every 500ms
      
      return () => clearInterval(interval);
    }
  }, [deploymentCompleted, showConsole]);

  // Transform projectTemplates to include actual icon components
  const projectTemplates = projectTemplatesData.map(template => ({
    ...template,
    icon: iconMap[template.icon] ? 
      React.createElement(iconMap[template.icon], { sx: { fontSize: template.iconSize } }) : 
      <Code sx={{ fontSize: template.iconSize }} />
  }));

  const handleClose = () => {
    if(loading || showConsole) {
      setShowConfirmClose(true);
    } else {
      resetAndClose()
    }
  };
  
  const resetAndClose = async () => {
    // Clean up WebSocket
    if (wsRef.current) {
      wsRef.current.close();
        wsRef.current = null;
      }
      
      setLoading(false);

      await sleep(200);
      setActiveStep(0);
      setSelectedTemplate(null);
      setGithubUsername('');
      setAvailableRepos([]);
      setSelectedRepo(null);
      setRepoChoice('create');
      setProjectName('');
      setStreamUrl(null);
      setShowConsole(false);
      await sleep(200);
      setDeploymentCompleted(false);
      setDots('');
      setProjectForm({
        name: '',
        description: '',
        category: '',
        gitRepo: '',
        pricing: 'freemium',
        oneTimePrice: '',
        subscriptionTier: '',
        usagePrice: '',
        whiteLabel: false,
        githubToken: '',
        gitEmail: '',
        templateId: '',
        template: {
          Frontend: '',  // No default - user must select
          Backend: ''    // No default - user must select
        }
      });
      clearError();
      onClose();
  };

  // Fetch GitHub repositories for username (empty repos only)
  const handleFetchRepos = async (username) => {
    if (!username.trim()) {
      setAvailableRepos([]);
      return;
    }

    try {
      const repos = await fetchUserRepos(username); // Fetches ALL repos from GitHub
      // Filter for empty repositories
      const emptyRepos = repos.filter(repo => {
        // GitHub reports size as 0 for repos with only boilerplate files (README, LICENSE, .gitignore)
        // This is perfect for our use case - we want repos ready to receive plugin templates
        return repo.size === 0;
      });
      setAvailableRepos(emptyRepos);
      return emptyRepos;
    } catch (error) {
      console.error('Error fetching repos:', error);
      setAvailableRepos([]);
      return [];
    }
  };

  // Handle repository selection
  const handleSelectRepo = (repo) => {
    setSelectedRepo(repo);
    setProjectForm({ 
      ...projectForm, 
      gitRepo: repo.html_url 
    });
  };

  // Get the final repository configuration
  const getRepoConfig = () => {
    if (repoChoice === 'create') {
      return {
        type: 'create',
        projectName: projectName,
        repoName: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      };
    } else {
      return {
        type: 'existing',
        repo: selectedRepo,
        repoName: selectedRepo?.name
      };
    }
  };

  // Connect to WebSocket stream
  const connectToStream = (wsUrl) => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    const consoleOutput = document.getElementById('console-output');
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
      
      // When the WebSocket connection is opened
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
  
  const handleCreateProject = async () => {
    setLoading(true);
    setShowConsole(false);
    
    try {
      let repoData = null;
      const repoConfig = getRepoConfig();
      
      // Prepare plugin configuration for GitHub Actions workflow
      const pluginConfig = {
        name: projectForm.name,
        description: projectForm.description,
        category: projectForm.category,
        pricing: projectForm.pricing,
        oneTimePrice: projectForm.oneTimePrice,
        subscriptionTier: projectForm.subscriptionTier,
        usagePrice: projectForm.usagePrice,
        whiteLabel: projectForm.whiteLabel,
        template: projectForm.template,
        templateId: projectForm.templateId,  // Add the selected template ID
        repo_choice: repoConfig.type,
        ...(repoConfig.type === 'create' 
          ? { repo_name: repoConfig.repoName }
          : { existing_repo: selectedRepo?.full_name }
        )
      };
      console.log('Triggering GitHub Actions workflow with config:', pluginConfig);
      console.log('projectForm', projectForm);
      
      // Trigger the GitHub Actions workflow
      const dispatchResult = await triggerPluginCreation({
        githubToken: projectForm.githubToken,
        gitEmail: projectForm.gitEmail,
        pluginConfig,
        dispatchOwner: githubConfig.dispatchOwner,
        dispatchRepo: githubConfig.dispatchRepo,
        enableCallback: true  // Enable callback URL generation
      });
      
      console.log('Workflow triggered successfully:', dispatchResult);

      // Show console immediately and start polling for stream URL
      let streamReady = false;
      if (dispatchResult.callbackId) {
        setShowConsole(true);
        await sleep(3000);
        // Poll for stream URL
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
        }, 1000); // Check every second
        
        // Stop polling after 20 seconds
        setTimeout(() => clearInterval(pollInterval), 20000);
      }

      if(dispatchResult.success) {
        await sleep(3000);
        const deploymentResult = await new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 20; 
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
          }, 12000); // Check every 12 seconds;
          // Stop polling after 250 seconds
          setTimeout(() => clearInterval(checkDeployment), 200000);
        });

        // Create plugin in database repository_url
        try {
          console.log('deploymentResult...', deploymentResult);
          // return is handled in the hook
          const plugin = await createNewPlugin({
            action: 'create',
            clerkUserId: user?.id,
            name: projectForm.name,
            description: projectForm.description,
            category: projectForm.category,
            pricingModel: projectForm.pricing,
            oneTimePrice: projectForm.oneTimePrice,
            subscriptionTier: projectForm.subscriptionTier,
            usagePrice: projectForm.usagePrice,
            whiteLabel: projectForm.whiteLabel,
            template: projectForm.template,
            templateId: projectForm.templateId,
            gitRepo: deploymentResult.repository_url,
            deploymentUrl: dispatchResult.deploymentUrl,
            apiEndpoint: dispatchResult.apiEndpoint,
            deploymentStatus: 'NEW',
          }); 
          // Check if plugin creation was successful
          if(!plugin?.success) {
            throw new Error(plugin?.message || 'Failed to create plugin in database');
          }
          
          // Plugin created successfully
          console.log('Plugin created successfully:', plugin.plugin);
          
          // setUserProjects([newProject, ...userProjects]);
          setIsFirstTime(false);
          setLoading(false); // Stop loading when completed
          setDeploymentCompleted(true); // Mark deployment as completed
          
          // Clear any previous errors
          setError(null);
          
          // DONE: THIS IS THE END OF THE NEW PROJEC MODAL EXECUTION
          
        } catch (dbError) {
          console.error('Failed to create plugin in database:', dbError);
          setError(`Plugin deployed but failed to save to database: ${dbError.message}`);
          setLoading(false);
          setStreamUrl(null);
          // Don't set deploymentCompleted to true since the database save failed
        }
      } else {
        // If no success, close modal
        handleClose();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError(`Failed to create project: ${error.message}`);
      setLoading(false);
    }
  };

  // Template selection step
  const TemplateSelection = () => (
    <Box>
      {/* Title and Continue button inline */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: textPrimary }}>
          {MODAL_TEXT.step1.title}
        </Typography>
        <PrimaryButton
          endIcon={<ArrowForward />}
          disabled={!selectedTemplate}
          onClick={() => {
            // Check if this is an API-only template
            const isApiOnly = API_ONLY_TEMPLATES.includes(selectedTemplate.id);
            
            // Update form with template ID and auto-select Python for API-only templates
            setProjectForm(prev => ({
              ...prev,
              templateId: selectedTemplate.id,
              template: {
                ...prev.template,
                // If API-only and Node.js was selected, switch to Python
                Backend: (isApiOnly && prev.template.Backend === 'nodejs') ? 'python' : prev.template.Backend
              }
            }));
            setActiveStep(1);
          }}
        >
          {MODAL_TEXT.step1.continueButton} {selectedTemplate?.name || 'Template'}
        </PrimaryButton>
      </Box>
      
      <Typography variant="body1" sx={{ color: textSecondary, mb: 4 }}>
        {MODAL_TEXT.step1.subtitle}
      </Typography>

      <Grid container spacing={3}>
        {projectTemplates.map((template) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <GlassCard
                variant={selectedTemplate?.id === template.id ? 'highlight' : 'default'}
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'visible',
                  // Add more noticeable border for selected template
                  border: selectedTemplate?.id === template.id 
                    ? `2px solid ${colors.accent}` 
                    : '1px solid transparent',
                  boxShadow: selectedTemplate?.id === template.id
                    ? `0 0 20px ${alpha(colors.accent, 0.4)}, 0 0 40px ${alpha(colors.accent, 0.2)}`
                    : 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: selectedTemplate?.id === template.id 
                      ? `2px solid ${colors.accent}`
                      : `1px solid ${alpha(colors.accent, 0.5)}`
                  }
                }}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  {template.popularityScore > 90 && (
                    <Chip
                      label={MODAL_TEXT.step1.popularChip}
                      size="small"
                      icon={<Star sx={{ fontSize: 16 }} />}
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: 10,
                        background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                        color: '#000',
                        fontWeight: 600
                      }}
                    />
                  )}

                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      background: isLightTheme 
                        ? alpha(colors.accent, 0.15)
                        : alpha(colors.accent, 0.1),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(colors.accent, 0.3)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: colors.accent
                    }}
                  >
                    {template.icon}
                  </Box>

                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: textPrimary }}>
                    {template.name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: textSecondary, mb: 2 }}>
                    {template.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={template.difficulty} 
                      size="small"
                      sx={{
                        background: alpha(
                          template.difficulty === 'beginner' ? '#4ADE80' : 
                          template.difficulty === 'intermediate' ? '#3B82F6' : '#F6511E',
                          0.2
                        ),
                        color: 
                          template.difficulty === 'beginner' ? '#4ADE80' : 
                          template.difficulty === 'intermediate' ? '#3B82F6' : '#F6511E',
                        border: 'none'
                      }}
                    />
                    <Typography variant="caption" sx={{ color: textSecondary }}>
                      {template.estimatedTime}
                    </Typography>
                  </Box>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>

    </Box>
  );

  const stepContent = () => {
    switch (activeStep) {
      case 0:
        return <TemplateSelection />;
      
      case 1:
        return (
          <Box>
            {/* Title and White-Label option inline */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: textPrimary }}>
                  {MODAL_TEXT.step2.title}
                </Typography>
                <Typography variant="body1" sx={{ color: textSecondary }}>
                  {MODAL_TEXT.step2.subtitle}
                </Typography>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={projectForm.whiteLabel}
                    onChange={(e) => setProjectForm({ ...projectForm, whiteLabel: e.target.checked })}
                    sx={{ color: textSecondary }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: textPrimary }}>{MODAL_TEXT.step2.whiteLabelTitle}</Typography>
                      <Typography variant="caption" sx={{ color: textSecondary }}>
                        {projectForm.whiteLabel ? MODAL_TEXT.step2.whiteLabelNotify : MODAL_TEXT.step2.whiteLabelSubtitle}
                      </Typography>
                    </Box>
                    <Chip
                      label={MODAL_TEXT.step2.whiteLabelComingSoon}
                      size="small"
                      sx={{
                        background: alpha(colors.accent, 0.1),
                        color: colors.accent,
                        border: `1px solid ${alpha(colors.accent, 0.3)}`,
                        fontSize: '0.7rem',
                        height: 20
                      }}
                    />
                  </Box>
                }
              />
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => setActiveStep(0)}
                sx={{ color: textPrimary }}
              >
                {MODAL_TEXT.buttons.back}
              </Button>
              <PrimaryButton
                endIcon={<ArrowForward />}
                onClick={() => setActiveStep(2)}
                disabled={!projectForm.name || !projectForm.description || !projectForm.category || 
                  !projectForm.template.Frontend || !projectForm.template.Backend ||
                  (projectForm.pricing === 'one-time' && !projectForm.oneTimePrice) || 
                  (projectForm.pricing === 'subscription' && !projectForm.subscriptionTier) ||
                  (projectForm.pricing === 'usage' && !projectForm.usagePrice)}
              >
                {MODAL_TEXT.buttons.continue}
              </PrimaryButton>
            </Box>

            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label={MODAL_TEXT.step2.nameLabel}
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  helperText="Only letters, numbers, underscores and dashes allowed"
                  onKeyPress={(e) => {
                    // Prevent input of any character that's not alphanumeric, underscore, or dash
                    if (!/[a-zA-Z0-9_-]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  onPaste={(e) => {
                    // Handle paste events to filter out invalid characters
                    e.preventDefault();
                    const pastedText = e.clipboardData.getData('text');
                    const filteredText = pastedText.replace(/[^a-zA-Z0-9_-]/g, '');
                    
                    // Insert filtered text at cursor position
                    const input = e.target;
                    const start = input.selectionStart;
                    const end = input.selectionEnd;
                    const currentValue = projectForm.name;
                    const newValue = currentValue.slice(0, start) + filteredText + currentValue.slice(end);
                    setProjectForm({ ...projectForm, name: newValue });
                  }}
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
                    }
                  }}
                />
              </Grid>

              {/* Description and Project Templates on same line */}
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={MODAL_TEXT.step2.descriptionLabel}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
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
                    }
                  }}
                />
              </Grid>

              {/* Project Template Selection */}
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Frontend Template */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: textSecondary }}>Frontend Template</InputLabel>
                    <Select
                      value={projectForm.template.Frontend}
                      onChange={(e) => setProjectForm({ 
                        ...projectForm, 
                        template: { ...projectForm.template, Frontend: e.target.value } 
                      })}
                      sx={{
                        background: isLightTheme 
                          ? alpha(colors.glassWhite, 0.8)
                          : alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        color: textPrimary,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: borderColor
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(colors.accent, 0.5)
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.accent
                        }
                      }}
                    >
                      <MenuItem value="typescript">{MODAL_TEXT.step2.projectTypesOptions.frontendOptions.typescript}</MenuItem>
                      <MenuItem value="javascript">{MODAL_TEXT.step2.projectTypesOptions.frontendOptions.javascript}</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Backend Template */}
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: textSecondary }}>Backend Template</InputLabel>
                    <Select
                      value={projectForm.template.Backend}
                      onChange={(e) => setProjectForm({ 
                        ...projectForm, 
                        template: { ...projectForm.template, Backend: e.target.value } 
                      })}
                      sx={{
                        background: isLightTheme 
                          ? alpha(colors.glassWhite, 0.8)
                          : alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        color: textPrimary,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: borderColor
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(colors.accent, 0.5)
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.accent
                        }
                      }}
                    >
                      <MenuItem 
                        value="nodejs" 
                        disabled={
                          // Disable Node.js for API-only templates
                          API_ONLY_TEMPLATES.includes(selectedTemplate?.id)
                        }
                      >
                        {MODAL_TEXT.step2.projectTypesOptions.backendOptions.node}
                        {API_ONLY_TEMPLATES.includes(selectedTemplate?.id) && 
                          ' (Unavaliablefor API-only templates)'
                        }
                      </MenuItem>
                      <MenuItem value="python">{MODAL_TEXT.step2.projectTypesOptions.backendOptions.python}</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: textSecondary }}>{MODAL_TEXT.step2.categoryLabel}</InputLabel>
                  <Select
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    sx={{
                      background: isLightTheme 
                        ? alpha(colors.glassWhite, 0.8)
                        : alpha(colors.glassWhite, 0.05),
                      backdropFilter: 'blur(10px)',
                      color: textPrimary,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: borderColor
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(colors.accent, 0.5)
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.accent
                      }
                    }}
                  >
                    <MenuItem value="development">{MODAL_TEXT.step2.categories.development}</MenuItem>
                    <MenuItem value="productivity">{MODAL_TEXT.step2.categories.productivity}</MenuItem>
                    <MenuItem value="analytics">{MODAL_TEXT.step2.categories.analytics}</MenuItem>
                    <MenuItem value="language">{MODAL_TEXT.step2.categories.language}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Price input or Tier selection inline with category */}
              <Grid size={{ xs: 12, sm: 6 }}>
                {projectForm.pricing === 'one-time' && (
                  <TextField
                    fullWidth
                    type="number"
                    label={MODAL_TEXT.step2.oneTimePriceLabel}
                    placeholder={MODAL_TEXT.step2.oneTimePricePlaceholder}
                    value={projectForm.oneTimePrice}
                    onChange={(e) => setProjectForm({ 
                      ...projectForm, 
                      oneTimePrice: e.target.value 
                    })}
                    InputProps={{
                      startAdornment: '$',
                    }}
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
                      }
                    }}
                  />
                )}
                {projectForm.pricing === 'subscription' && (
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: textSecondary }}>{MODAL_TEXT.step2.subscriptionTierLabel}</InputLabel>
                    <Select
                      value={projectForm.subscriptionTier}
                      onChange={(e) => setProjectForm({ 
                        ...projectForm, 
                        subscriptionTier: e.target.value 
                      })}
                      sx={{
                        background: isLightTheme 
                          ? alpha(colors.glassWhite, 0.8)
                          : alpha(colors.glassWhite, 0.05),
                        backdropFilter: 'blur(10px)',
                        color: textPrimary,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: borderColor
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(colors.accent, 0.5)
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: colors.accent
                        }
                      }}
                    >
                      <MenuItem value="individual">{MODAL_TEXT.step2.subscriptionTiers.individual}</MenuItem>
                      <MenuItem value="pro">{MODAL_TEXT.step2.subscriptionTiers.pro}</MenuItem>
                      <MenuItem value="enterprise">{MODAL_TEXT.step2.subscriptionTiers.enterprise}</MenuItem>
                    </Select>
                  </FormControl>
                )}
                {projectForm.pricing === 'usage' && (
                  <TextField
                    fullWidth
                    type="number"
                    label={MODAL_TEXT.step2.tokenCostLabel}
                    placeholder={MODAL_TEXT.step2.tokenCostPlaceholder}
                    value={projectForm.usagePrice}
                    onChange={(e) => setProjectForm({ 
                      ...projectForm, 
                      usagePrice: e.target.value 
                    })}
                    InputProps={{
                      startAdornment: '$',
                    }}
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
                      }
                    }}
                  />
                )}
              </Grid>

              {/* Pricing Model in 2 columns */}
              <Grid size={12}>
                <FormControl fullWidth>
                  <Typography variant="body2" sx={{ mb: 1, color: textPrimary }}>
                    {MODAL_TEXT.step2.pricingTitle}
                  </Typography>
                  <RadioGroup
                    value={projectForm.pricing}
                    onChange={(e) => setProjectForm({ 
                      ...projectForm, 
                      pricing: e.target.value,
                      oneTimePrice: '',
                      subscriptionTier: '',
                      usagePrice: ''
                    })}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                      gap: 1
                    }}
                  >
                    <FormControlLabel 
                      value="freemium" 
                      control={<Radio sx={{ color: textSecondary }} />} 
                      label={<Typography sx={{ color: textPrimary }}>{MODAL_TEXT.step2.pricingOptions.freemium}</Typography>}
                    />
                    <FormControlLabel 
                      value="one-time" 
                      control={<Radio sx={{ color: textSecondary }} />} 
                      label={<Typography sx={{ color: textPrimary }}>{MODAL_TEXT.step2.pricingOptions.oneTime}</Typography>}
                    />
                    <FormControlLabel 
                      value="subscription" 
                      control={<Radio sx={{ color: textSecondary }} />} 
                      label={<Typography sx={{ color: textPrimary }}>{MODAL_TEXT.step2.pricingOptions.subscription}</Typography>}
                    />
                    <FormControlLabel 
                      value="usage" 
                      control={<Radio sx={{ color: textSecondary }} />} 
                      label={<Typography sx={{ color: textPrimary }}>{MODAL_TEXT.step2.pricingOptions.usageBased}</Typography>}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

            </Grid>

          </Box>
        );

            case 2:
        return (
          <Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600, color: textPrimary }}>
                  {MODAL_TEXT.step3.title}
                </Typography>
                <Typography variant="body1" sx={{ color: textSecondary, mb: 2 }}>
                  {MODAL_TEXT.step3.subtitle}
                </Typography>
              </Box>
              {/* Template Generation Note */}
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  background: alpha(colors.accent, 0.1),
                  color: colors.accent,
                  '& .MuiAlert-icon': {
                    color: colors.accent
                  }
                }}
              >
                {MODAL_TEXT.step3.templateNote.replace('{template}', selectedTemplate?.name || 'selected')}
              </Alert>
            </Box>
            {/* Navigation buttons at top */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => setActiveStep(1)}
                sx={{ color: textPrimary }}
              >
                {MODAL_TEXT.buttons.back}
              </Button>
              <PrimaryButton
                endIcon={<ArrowForward />}
                onClick={() => setActiveStep(3)}
                disabled={repoChoice === 'create' ? !projectName.trim() : !selectedRepo}
              >
                {MODAL_TEXT.buttons.continue}
              </PrimaryButton>
            </Box>


            <Grid container spacing={3}>
              {/* Option 1: Create New Repository */}
              <Grid size={{ xs: 12, md: 6 }}>
                <GlassCard 
                  variant={repoChoice === 'create' ? 'highlight' : 'default'}
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => setRepoChoice('create')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Add sx={{ fontSize: 32, mr: 2, color: colors.accent }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
                        {MODAL_TEXT.step3.createNewTitle}
                      </Typography>
                      <Typography variant="body2" sx={{ color: textSecondary }}>
                        {MODAL_TEXT.step3.createNewSubtitle}
                      </Typography>
                    </Box>
                  </Box>

                  {repoChoice === 'create' && (
                    <TextField
                      fullWidth
                      label={MODAL_TEXT.step3.projectNameLabel}
                      placeholder={MODAL_TEXT.step3.projectNamePlaceholder}
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      helperText={MODAL_TEXT.step3.projectNameHelper}
                      sx={{
                        mt: 2,
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
                          color: textSecondary
                        }
                      }}
                    />
                  )}
                </GlassCard>
              </Grid>

              {/* Option 2: Use Existing Empty Repository */}
              <Grid size={{ xs: 12, md: 6 }}>
                <GlassCard 
                  variant={repoChoice === 'existing' ? 'highlight' : 'default'}
                  sx={{ 
                    p: 3, 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => setRepoChoice('existing')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <GitHub sx={{ fontSize: 32, mr: 2, color: colors.accent }} />
                    <Box>
                      <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
                        {MODAL_TEXT.step3.useExistingTitle}
                      </Typography>
                      <Typography variant="body2" sx={{ color: textSecondary }}>
                        {MODAL_TEXT.step3.useExistingSubtitle}
                      </Typography>
                    </Box>
                  </Box>

                  {repoChoice === 'existing' && (
                    <Box sx={{ mt: 2 }}>
                      {/* Username Input and Find Repos Button */}
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label={MODAL_TEXT.step3.usernameLabel}
                          placeholder={MODAL_TEXT.step3.usernamePlaceholder}
                          value={githubUsername}
                          onChange={(e) => {
                            setGithubUsername(e.target.value);
                            // Clear repos when username changes
                            if (availableRepos.length > 0) {
                              setAvailableRepos([]);
                              setSelectedRepo(null);
                            }
                          }}
                          onKeyDown={(e) => {
                            // Trigger fetch on Enter key
                            if (e.key === 'Enter' && githubUsername.trim()) {
                              handleFetchRepos(githubUsername);
                            }
                          }}
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
                            }
                          }}
                        />
                        
                        <Button
                          variant="contained"
                          size="small"
                          disabled={!githubUsername.trim() || githubLoading}
                          onClick={() => handleFetchRepos(githubUsername)}
                          sx={{
                            minWidth: 80,
                            height: 40,
                            borderRadius: 1,
                            background: `linear-gradient(135deg, ${colors.accent}, ${alpha(colors.accent, 0.8)})`,
                            color: '#ffffff',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${alpha(colors.accent, 0.9)}, ${colors.accent})`
                            },
                            '&:disabled': {
                              background: alpha(colors.accent, 0.3),
                              color: alpha('#ffffff', 0.5)
                            }
                          }}
                          startIcon={
                            githubLoading ? (
                              <Refresh sx={{ 
                                fontSize: 16,
                                animation: 'spin 1s linear infinite' 
                              }} />
                            ) : null
                          }
                        >
                          {githubLoading ? MODAL_TEXT.step3.fetchingReposButton : MODAL_TEXT.step3.fetchReposButton}
                        </Button>
                      </Box>

                      {/* Repository List */}
                      {availableRepos.length > 0 && (
                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                          {availableRepos.map((repo) => (
                            <Box
                              key={repo.id}
                              sx={{
                                p: 1.5,
                                mb: 1,
                                border: `1px solid ${selectedRepo?.id === repo.id ? colors.accent : borderColor}`,
                                borderRadius: 1,
                                cursor: 'pointer',
                                background: selectedRepo?.id === repo.id 
                                  ? alpha(colors.accent, 0.1) 
                                  : 'transparent',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: colors.accent,
                                  background: alpha(colors.accent, 0.05)
                                }
                              }}
                              onClick={() => handleSelectRepo(repo)}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body2" sx={{ color: textPrimary, fontWeight: 600 }}>
                                    {repo.name}
                                  </Typography>
                                  {repo.description && (
                                    <Typography variant="caption" sx={{ color: textSecondary }}>
                                      {repo.description}
                                    </Typography>
                                  )}
                                </Box>
                                {selectedRepo?.id === repo.id && (
                                  <Star sx={{ color: colors.accent, fontSize: 20 }} />
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* No repos found message */}
                      {!githubLoading && githubUsername && availableRepos.length === 0 && (
                        <Typography variant="caption" sx={{ color: textSecondary, fontStyle: 'italic' }}>
                          {MODAL_TEXT.step3.noEmptyReposFound}
                        </Typography>
                      )}
                    </Box>
                  )}
                </GlassCard>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, mt: 4, color: textPrimary }}>
              {MODAL_TEXT.step3.includesTitle}
            </Typography>
            
            <Grid container spacing={2}>
              {[
                { icon: <Code />, text: MODAL_TEXT.step3.includes[0] },
                { icon: <CloudUpload />, text: MODAL_TEXT.step3.includes[1] },
                { icon: <Security />, text: MODAL_TEXT.step3.includes[2] },
                { icon: <Speed />, text: MODAL_TEXT.step3.includes[3] },
                { icon: <AttachMoney />, text: MODAL_TEXT.step3.includes[4] }
              ].map((item, index) => (
                <Grid size={{ xs: 12, sm: 6 }} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
                    <Box sx={{ color: colors.accent, minWidth: 40, mr: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2" sx={{ color: textPrimary }}>
                      {item.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

          </Box>
        );

      case 3:
        return (
          <Box>
            {/* Title section with success features */}
            <Box sx={{ display: 'flex'}}>
            <Box sx={{ mb: 0 }}>
              <Typography variant="h5" sx={{ mb: 0, fontWeight: 600, color: textPrimary }}>
                {MODAL_TEXT.step4.title}
              </Typography>
              <Typography variant="body1" sx={{ color: textSecondary, mb: 0 }}>
                {MODAL_TEXT.step4.subtitle}
              </Typography>
              </Box>
              {/* Success features chips */}
              <Box sx={{ flexWrap: 'wrap', display: 'flex', justifyContent: 'right', my: 1 }}>
                {MODAL_TEXT.step4.successFeatures.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    size="small"
                    icon={<Star sx={{ fontSize: 16 }} />}
                    sx={{
                      mr: 1,
                      background: alpha(colors.accent, 0.1),
                      color: colors.accent,
                      border: `1px solid ${alpha(colors.accent, 0.3)}`,
                      '& .MuiChip-icon': {
                        color: colors.accent
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Navigation buttons */}
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => setActiveStep(2)}
                disabled={streamUrl || loading}
                sx={{ color: textPrimary }}
              >
                {MODAL_TEXT.buttons.back}
              </Button>
              <AccentButton
                size="large"
                startIcon={loading ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : deploymentCompleted ? null : <RocketLaunch />}
                onClick={() => {
                  if (deploymentCompleted) {
                    setRemoteTrigger(remoteTrigger + 1);
                    resetAndClose();
                    navigate('/staff/dash');
                  } else {
                    handleCreateProject();
                  }
                }}
                disabled={loading || error || (!deploymentCompleted && (!projectForm.githubToken || !projectForm.gitEmail)) || streamUrl}
                sx={{ px: 4 }}
              >
                {loading ? MODAL_TEXT.step4.deployingButton : deploymentCompleted ? 'View Plugin 🧩' : MODAL_TEXT.step4.deployButton}
              </AccentButton>
            </Box>

            {/* Error Display */}
            {error && (
              <Box sx={{ mt: 2 }}>
                <Alert 
                  severity="error" 
                  onClose={() => setError(null)}
                  sx={{ 
                    backgroundColor: isLightTheme ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.2)',
                    color: textPrimary
                  }}
                >
                  {error}
                </Alert>
              </Box>
            )}

            {/* Streaming Console */}
            {showConsole && (
              <Box
                sx={{
                  mb: 2,
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
                  overflow: 'hidden', // Prevent absolute content from overflowing
                }}>
                  {/* Header content */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 2, // Ensure text is above neural network
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: textPrimary }}>
                        🖥️
                      </Typography>
                      {streamUrl && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CircularProgress size={14} thickness={5} sx={{ color: colors.accent }} />
                          <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 500 }}>
                            Connected
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  
                  {/* Neural Network - Always in the same position */}
                  <Box sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px', // Fixed width
                    height: '80px', // Fixed height
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    zIndex: 1, // Behind the text
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
                       'Visit your Dashboard to view your new plugin...🧩'
                     ) : (
                       <>
                         Waiting for deployment
                         <Box component="span" sx={{ width: '20px', display: 'inline-block', textAlign: 'left' }}>
                           {dots}
                         </Box>
                       </>
                     )}
                   </Typography>
                  </Box>
                </Box>
                <Box
                  id="console-output"
                  sx={{
                    height: '300px',
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
                    <span className="rotating-hourglass">⏳</span> Waiting for deployment to start...
                  </div>
                </Box>
              </Box>
            )}

            {/* Two Column Layout: Review & GitHub Auth */}
            <Grid container spacing={3}>
              {/* Review Section - Left Column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <GlassCard variant="strong" sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: textPrimary }}>
                    {MODAL_TEXT.step4.pluginConfigurationTitle}
                  </Typography>
                  
                  {/* Plugin Name - Full Width */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1 }}>
                    <Box sx={{ flex: '0 0 auto' }}>
                      <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                        {MODAL_TEXT.step4.labels.pluginName}
                      </Typography>
                      <Typography variant="body1" sx={{ color: textPrimary, fontWeight: 600 }}>
                        {projectForm.name}
                      </Typography>
                    </Box>

                    {/* Security Note */}
                    <Alert 
                      severity="info"
                      icon={<Info />}
                      sx={{ 
                        flex: 1,
                        py: 0.5,
                        background: alpha(colors.accent, 0.1),
                        color: textPrimary,
                        '& .MuiAlert-icon': {
                          color: colors.accent,
                          fontSize: '18px'
                        },
                        '& .MuiAlert-message': {
                          padding: '4px 0'
                        }
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                        {MODAL_TEXT.step4.pluginSecurityNote}
                      </Typography>
                    </Alert>
                  </Box>
                  {/* Two Column Grid for Details */}
                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                          {MODAL_TEXT.step4.labels.template}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {selectedTemplate?.name}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                          {MODAL_TEXT.step4.labels.category}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {projectForm.category}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                          {MODAL_TEXT.step4.frontendStackLabel}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {projectForm.template.Frontend === 'typescript' ? 'React TypeScript' : 'React JavaScript'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                          {MODAL_TEXT.step4.backendStackLabel}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {projectForm.template.Backend === 'nodejs' ? 'Node.js' : 'Python FastAPI'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                          {MODAL_TEXT.step4.labels.pricingModel}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {projectForm.pricing.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                          {MODAL_TEXT.step4.labels.repository}
                        </Typography>
                        <Typography variant="body2" sx={{ color: textPrimary }}>
                          {repoChoice === 'create' ? projectName : selectedRepo?.name || 'Not selected'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Description - Full Width */}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" sx={{ color: textSecondary, display: 'block', mb: 0.5 }}>
                      {MODAL_TEXT.step4.labels.description}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textPrimary, lineHeight: 1.6 }}>
                      {projectForm.description || 'No description provided'}
                    </Typography>
                  </Box>
                </GlassCard>
              </Grid>

              {/* GitHub Authentication Section - Right Column */}
              <Grid size={{ xs: 12, md: 6 }}>
                <GlassCard variant="default" sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GitHub sx={{ mr: 1.5, color: colors.accent, fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" sx={{ color: textPrimary, fontWeight: 600 }}>
                          {MODAL_TEXT.step4.secretsTitle}
                        </Typography>
                        <Typography variant="caption" sx={{ color: textSecondary }}>
                          {MODAL_TEXT.step4.secretsSubtitle}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<GitHub />}
                      href={githubConfig.getTokenUrl}
                      target="_blank"
                      disabled={loading || streamUrl || deploymentCompleted}
                      rel="noopener noreferrer"
                      sx={{
                        pr:0,
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
                      Create Token
                    </Button>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        type="password"
                        label={MODAL_TEXT.step4.secretsFields.token.label}
                        placeholder={MODAL_TEXT.step4.secretsFields.token.placeholder}
                        value={projectForm.githubToken || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, githubToken: e.target.value })}
                        helperText={MODAL_TEXT.step4.secretsFields.token.helper}
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
                        type="email"
                        label={MODAL_TEXT.step4.secretsFields.email.label}
                        placeholder={MODAL_TEXT.step4.secretsFields.email.placeholder}
                        value={projectForm.gitEmail || ''}
                        onChange={(e) => setProjectForm({ ...projectForm, gitEmail: e.target.value })}
                        helperText={MODAL_TEXT.step4.secretsFields.email.helper}
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

                  <Alert 
                    severity="info"
                    icon={<Security />}
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
                      {MODAL_TEXT.step4.securityNote}
                    </Typography>
                  </Alert>
                </GlassCard>
              </Grid>
            </Grid>

            

          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: isLightTheme ? backgroundPaper : alpha(colors.glassWhite, 0.1),
          backgroundImage: 'none',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${borderColor}`,
          boxShadow: isLightTheme 
            ? `0 20px 60px ${alpha(colors.primary, 0.1)}` 
            : `0 20px 60px ${alpha(colors.primary, 0.3)}`,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: textPrimary }}>
            {MODAL_TEXT.title}
          </Typography>
          <IconButton 
            onClick={handleClose}
            disabled={loading}
            sx={{ color: textSecondary }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {onboardingSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {stepContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
    
    {/* 
    🚨🚨🚨 CRITICAL TODO 🚨🚨🚨
    ================================
    1. ATTACH POSTHOG ANALYTICS to track:
       - Modal open/close events
       - Template selection
       - Deployment success/failure
       - User exits during deployment
    
    2. HANDLE "EXIT ANYWAYS" CASE:
       - If user exits after repo creation but before DB entry
       - They've used our platform to create a GitHub repo for FREE
       - Need to either:
         a) Track these "incomplete" deployments
         b) Clean up orphaned repos
         c) Prevent exit after certain point
         d) Create DB entry immediately after repo creation
    
    3. POTENTIAL SOLUTIONS:
       - Create "pending" DB entry BEFORE GitHub actions
       - Add webhook to track repo creation status
       - Implement cleanup job for orphaned repos
       - Add billing/usage tracking for incomplete deployments
    ================================
    🚨🚨🚨 CRITICAL TODO 🚨🚨🚨
    */}
    
    <SimpleConfirm
      open={showConfirmClose}
      onClose={() => setShowConfirmClose(false)}
      onConfirm={() => {
        setShowConfirmClose(false);
        // TODO: Log this exit event to PostHog with deployment stage info
        resetAndClose();
      }}
      message="⚠️ Updating services... This is an idempotent operation, but it must complete uninterrupted. Please wait."
      shouldHideCloseButton={false}
      confirmText="Exit Anyways"
    />
    </>
  );
};