import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  TextField,
  alpha,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  RadioGroup,
  Radio,
  Checkbox,
  List,
  ListItem,
  Divider,
  Alert,
  Tooltip
} from '@mui/material';

// Icons
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExtensionIcon from '@mui/icons-material/Extension';
import ScheduleIcon from '@mui/icons-material/Schedule';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';
import InsightsIcon from '@mui/icons-material/Insights';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import MergeIcon from '@mui/icons-material/Merge';
import TimerIcon from '@mui/icons-material/Timer';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import WebhookIcon from '@mui/icons-material/Webhook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import BoltIcon from '@mui/icons-material/Bolt';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';

// Hooks
import { useTheme } from '../../../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Workflow Card Component
const WorkflowCard = ({ workflow }) => {
  const { theme, colors } = useTheme();
  const isDark = theme === 'dark';
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{
      height: '100%',
      background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
      backdropFilter: 'blur(10px)',
      border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: `0 8px 24px ${alpha(colors.primary, 0.2)}`
      }
    }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              {workflow.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workflow.description}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              size="small"
              icon={workflow.status === 'active' ? <CheckCircleIcon /> : <PauseIcon />}
              label={workflow.status === 'active' ? 'Active' : 'Paused'}
              color={workflow.status === 'active' ? 'success' : 'default'}
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Workflow Steps Preview */}
        <Box display="flex" alignItems="center" gap={1} mb={3} flexWrap="wrap">
          {workflow.plugins.map((plugin, idx) => (
            <React.Fragment key={plugin}>
              <Chip
                size="small"
                label={plugin}
                sx={{
                  background: alpha(colors.accent, 0.1),
                  border: `1px solid ${alpha(colors.accent, 0.3)}`
                }}
              />
              {idx < workflow.plugins.length - 1 && (
                <ChevronRightIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              )}
            </React.Fragment>
          ))}
        </Box>

        {/* Workflow Stats */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Runs</Typography>
              <Typography variant="body2" fontWeight="600">{workflow.runs}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Last Run</Typography>
              <Typography variant="body2" fontWeight="600">{workflow.lastRun}</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Success Rate</Typography>
              <Typography variant="body2" fontWeight="600">{workflow.successRate}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box>
              <Typography variant="caption" color="text.secondary">Avg Duration</Typography>
              <Typography variant="body2" fontWeight="600">{workflow.avgDuration}</Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Edit Workflow</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><InsightsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>View Analytics</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon><ScheduleIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Schedule</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

// Workflow Creation Modal Component
const CreateWorkflowModal = ({ open, onClose, onCreateWorkflow }) => {
  const { theme, colors, glassmorphism, gradients } = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Workflow form state
  const [workflowData, setWorkflowData] = useState({
    name: '',
    description: '',
    type: '',
    trigger: 'manual',
    schedule: '',
    plugins: [],
    conditions: [],
    errorHandling: 'stop',
    notifications: false,
    retryAttempts: 3
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedPlugins, setSelectedPlugins] = useState([]);

  const steps = ['Choose Template', 'Configure Workflow', 'Build Pipeline', 'Review & Activate'];

  // Available workflow templates
  const workflowTemplates = [
    {
      id: 'customer-support',
      name: 'Customer Support Automation',
      description: 'Analyze tickets, extract sentiment, translate, and respond',
      icon: '🎧',
      plugins: ['sentiment-analyzer', 'translator', 'auto-responder'],
      difficulty: 'beginner',
      popularity: 95,
      estimatedTime: '5 mins'
    },
    {
      id: 'code-review',
      name: 'Code Review Pipeline',
      description: 'Review PRs, scan security, generate summaries',
      icon: '🔍',
      plugins: ['code-reviewer', 'security-scanner', 'summary-generator'],
      difficulty: 'intermediate',
      popularity: 88,
      estimatedTime: '10 mins'
    },
    {
      id: 'content-moderation',
      name: 'Content Moderation',
      description: 'Scan content for toxicity and inappropriate material',
      icon: '🛡️',
      plugins: ['content-scanner', 'toxicity-detector', 'alert-system'],
      difficulty: 'beginner',
      popularity: 82,
      estimatedTime: '5 mins'
    },
    {
      id: 'data-pipeline',
      name: 'Data Processing ETL',
      description: 'Extract, transform, validate, and store data',
      icon: '📊',
      plugins: ['data-extractor', 'transformer', 'validator', 'db-writer'],
      difficulty: 'advanced',
      popularity: 76,
      estimatedTime: '15 mins'
    },
    {
      id: 'marketing-automation',
      name: 'Marketing Automation',
      description: 'Generate content, schedule posts, track engagement',
      icon: '📣',
      plugins: ['content-generator', 'social-scheduler', 'analytics-tracker'],
      difficulty: 'intermediate',
      popularity: 90,
      estimatedTime: '10 mins'
    },
    {
      id: 'custom',
      name: 'Custom Workflow',
      description: 'Build your own workflow from scratch',
      icon: '🔧',
      plugins: [],
      difficulty: 'expert',
      popularity: 70,
      estimatedTime: '20+ mins'
    }
  ];

  // Available plugins for workflow building
  const availablePlugins = [
    { id: 'sentiment-analyzer', name: 'Sentiment Analyzer', category: 'AI/ML', icon: '😊' },
    { id: 'translator', name: 'Language Translator', category: 'Language', icon: '🌐' },
    { id: 'code-reviewer', name: 'Code Reviewer', category: 'Development', icon: '👨‍💻' },
    { id: 'security-scanner', name: 'Security Scanner', category: 'Security', icon: '🔒' },
    { id: 'content-scanner', name: 'Content Scanner', category: 'Moderation', icon: '📝' },
    { id: 'data-extractor', name: 'Data Extractor', category: 'Data', icon: '📤' },
    { id: 'transformer', name: 'Data Transformer', category: 'Data', icon: '🔄' },
    { id: 'validator', name: 'Data Validator', category: 'Data', icon: '✅' },
    { id: 'auto-responder', name: 'Auto Responder', category: 'Communication', icon: '💬' },
    { id: 'summary-generator', name: 'Summary Generator', category: 'AI/ML', icon: '📋' }
  ];

  const handleClose = () => {
    if (!loading) {
      setActiveStep(0);
      setSelectedTemplate(null);
      setSelectedPlugins([]);
      setWorkflowData({
        name: '',
        description: '',
        type: '',
        trigger: 'manual',
        schedule: '',
        plugins: [],
        conditions: [],
        errorHandling: 'stop',
        notifications: false,
        retryAttempts: 3
      });
      onClose();
    }
  };

  const handleCreateWorkflow = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newWorkflow = {
      ...workflowData,
      id: Date.now(),
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    onCreateWorkflow(newWorkflow);
    setLoading(false);
    handleClose();
  };

  // Step 1: Template Selection
  const TemplateSelection = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Choose Your Workflow Type
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a pre-built template or create a custom workflow
      </Typography>

      <Grid container spacing={3}>
        {workflowTemplates.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template.id}>
            <Card
              onClick={() => {
                setSelectedTemplate(template);
                setWorkflowData({ ...workflowData, type: template.id });
              }}
              sx={{
                ...glassmorphism.card,
                cursor: 'pointer',
                border: selectedTemplate?.id === template.id 
                  ? `2px solid ${colors.accent}` 
                  : `1px solid ${colors.glassWhite}`,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'visible',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 32px ${alpha(colors.primary, 0.3)}`
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                {template.popularity > 90 && (
                  <Chip
                    icon={<StarIcon sx={{ fontSize: 14 }} />}
                    label="Popular"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: 10,
                      background: gradients.primaryGradient,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                )}

                <Typography variant="h2" sx={{ mb: 2 }}>{template.icon}</Typography>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  {template.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Chip 
                    label={template.difficulty}
                    size="small"
                    sx={{
                      backgroundColor: alpha(
                        template.difficulty === 'beginner' ? colors.lottieGreen :
                        template.difficulty === 'intermediate' ? colors.secondary :
                        template.difficulty === 'advanced' ? colors.primary : colors.purple,
                        0.2
                      ),
                      color: 
                        template.difficulty === 'beginner' ? colors.lottieGreen :
                        template.difficulty === 'intermediate' ? colors.secondary :
                        template.difficulty === 'advanced' ? colors.primary : colors.purple
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {template.estimatedTime}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={!selectedTemplate}
          onClick={() => setActiveStep(1)}
          sx={{
            background: gradients.primaryGradient,
            '&:hover': {
              background: gradients.primaryGradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
            }
          }}
        >
          Continue with {selectedTemplate?.name || 'Template'}
        </Button>
      </Box>
    </Box>
  );

  // Step 2: Configure Workflow
  const ConfigureWorkflow = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Configure Your Workflow
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Set up the basic configuration for your workflow
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Workflow Name"
            value={workflowData.name}
            onChange={(e) => setWorkflowData({ ...workflowData, name: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                ...glassmorphism.container
              }
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={workflowData.description}
            onChange={(e) => setWorkflowData({ ...workflowData, description: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                ...glassmorphism.container
              }
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
              Trigger Type
            </Typography>
            <RadioGroup
              value={workflowData.trigger}
              onChange={(e) => setWorkflowData({ ...workflowData, trigger: e.target.value })}
            >
              <FormControlLabel 
                value="manual" 
                control={<Radio />} 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <PlayArrowIcon sx={{ fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2">Manual Trigger</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Run workflow on demand
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel 
                value="webhook" 
                control={<Radio />} 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <WebhookIcon sx={{ fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2">Webhook</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Triggered by external events
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <FormControlLabel 
                value="schedule" 
                control={<Radio />} 
                label={
                  <Box display="flex" alignItems="center" gap={1}>
                    <ScheduleIcon sx={{ fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2">Scheduled</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Run at specific times
                      </Typography>
                    </Box>
                  </Box>
                }
              />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl component="fieldset">
            <Typography variant="subtitle2" fontWeight="600" sx={{ mb: 2 }}>
              Error Handling
            </Typography>
            <RadioGroup
              value={workflowData.errorHandling}
              onChange={(e) => setWorkflowData({ ...workflowData, errorHandling: e.target.value })}
            >
              <FormControlLabel 
                value="stop" 
                control={<Radio />} 
                label="Stop on error"
              />
              <FormControlLabel 
                value="continue" 
                control={<Radio />} 
                label="Continue on error"
              />
              <FormControlLabel 
                value="retry" 
                control={<Radio />} 
                label="Retry failed steps"
              />
            </RadioGroup>

            {workflowData.errorHandling === 'retry' && (
              <TextField
                type="number"
                label="Retry Attempts"
                value={workflowData.retryAttempts}
                onChange={(e) => setWorkflowData({ ...workflowData, retryAttempts: parseInt(e.target.value) })}
                sx={{ mt: 2, width: 200 }}
                InputProps={{ inputProps: { min: 1, max: 5 } }}
              />
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={workflowData.notifications}
                onChange={(e) => setWorkflowData({ ...workflowData, notifications: e.target.checked })}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Enable Notifications</Typography>
                <Typography variant="caption" color="text.secondary">
                  Get notified about workflow status changes
                </Typography>
              </Box>
            }
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setActiveStep(0)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => setActiveStep(2)}
          disabled={!workflowData.name || !workflowData.description}
          sx={{
            background: gradients.primaryGradient,
            '&:hover': {
              background: gradients.primaryGradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );

  // Step 3: Build Pipeline
  const BuildPipeline = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Build Your Workflow Pipeline
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Drag and drop plugins to create your workflow sequence
      </Typography>

      <Grid container spacing={3}>
        {/* Selected Plugins Pipeline */}
        <Grid item xs={12} md={7}>
          <Paper sx={{
            p: 3,
            ...glassmorphism.card,
            minHeight: 400,
            position: 'relative'
          }}>
            <Typography variant="h6" gutterBottom>
              Workflow Pipeline
            </Typography>
            
            {selectedPlugins.length === 0 ? (
              <Box sx={{
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px dashed ${colors.glassWhite}`,
                borderRadius: 2,
                mt: 2
              }}>
                <AccountTreeIcon sx={{ fontSize: 64, color: alpha(colors.accent, 0.3), mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Select plugins from the right to build your workflow
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                {selectedPlugins.map((plugin, index) => (
                  <Box key={plugin.id}>
                    <Paper sx={{
                      p: 2,
                      ...glassmorphism.container,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 2
                    }}>
                      <DragIndicatorIcon sx={{ color: 'text.secondary' }} />
                      <Typography variant="h5">{plugin.icon}</Typography>
                      <Box flex={1}>
                        <Typography variant="body1" fontWeight="500">
                          {plugin.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {plugin.category}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedPlugins(selectedPlugins.filter(p => p.id !== plugin.id))}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Paper>
                    {index < selectedPlugins.length - 1 && (
                      <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                        <ChevronRightIcon sx={{ color: colors.accent, transform: 'rotate(90deg)' }} />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Available Plugins */}
        <Grid item xs={12} md={5}>
          <Paper sx={{
            p: 3,
            ...glassmorphism.card,
            maxHeight: 500,
            overflow: 'auto'
          }}>
            <Typography variant="h6" gutterBottom>
              Available Plugins
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              {availablePlugins.map((plugin) => (
                <Paper
                  key={plugin.id}
                  sx={{
                    p: 2,
                    mb: 1,
                    ...glassmorphism.container,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: selectedPlugins.find(p => p.id === plugin.id) ? 0.5 : 1,
                    '&:hover': {
                      transform: 'translateX(4px)',
                      borderColor: colors.accent
                    }
                  }}
                  onClick={() => {
                    if (!selectedPlugins.find(p => p.id === plugin.id)) {
                      setSelectedPlugins([...selectedPlugins, plugin]);
                    }
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Typography variant="h6">{plugin.icon}</Typography>
                    <Box>
                      <Typography variant="body2" fontWeight="500">
                        {plugin.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {plugin.category}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setActiveStep(1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => {
            setWorkflowData({ ...workflowData, plugins: selectedPlugins.map(p => p.id) });
            setActiveStep(3);
          }}
          disabled={selectedPlugins.length === 0}
          sx={{
            background: gradients.primaryGradient,
            '&:hover': {
              background: gradients.primaryGradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
            }
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );

  // Step 4: Review & Activate
  const ReviewAndActivate = () => (
    <Box>
      <Typography variant="h5" fontWeight="600" gutterBottom>
        Review & Activate
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Review your workflow configuration before activation
      </Typography>

      <Paper sx={{ p: 4, ...glassmorphism.strong }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.secondary">
              Workflow Name
            </Typography>
            <Typography variant="h6">{workflowData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.secondary">
              Template
            </Typography>
            <Typography variant="h6">{selectedTemplate?.name}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="overline" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">{workflowData.description}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.secondary">
              Trigger Type
            </Typography>
            <Typography variant="body1">
              {workflowData.trigger.charAt(0).toUpperCase() + workflowData.trigger.slice(1)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" color="text.secondary">
              Error Handling
            </Typography>
            <Typography variant="body1">
              {workflowData.errorHandling === 'stop' ? 'Stop on error' :
               workflowData.errorHandling === 'continue' ? 'Continue on error' :
               `Retry ${workflowData.retryAttempts} times`}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Workflow Pipeline
        </Typography>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          {selectedPlugins.map((plugin, idx) => (
            <React.Fragment key={plugin.id}>
              <Chip
                icon={<Box component="span">{plugin.icon}</Box>}
                label={plugin.name}
                sx={{
                  background: alpha(colors.accent, 0.1),
                  border: `1px solid ${alpha(colors.accent, 0.3)}`
                }}
              />
              {idx < selectedPlugins.length - 1 && (
                <ChevronRightIcon sx={{ color: colors.accent }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Paper>

      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Ready to activate!</strong> Your workflow will be deployed and ready to use immediately.
        </Typography>
      </Alert>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setActiveStep(2)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          startIcon={loading ? <AutoFixHighIcon sx={{ animation: 'spin 1s linear infinite' }} /> : <BoltIcon />}
          onClick={handleCreateWorkflow}
          disabled={loading}
          sx={{
            background: gradients.glowGradient,
            px: 4,
            '&:hover': {
              background: gradients.glowGradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(colors.accent, 0.4)}`
            }
          }}
        >
          {loading ? 'Creating Workflow...' : 'Activate Workflow'}
        </Button>
      </Box>
    </Box>
  );

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <TemplateSelection />;
      case 1:
        return <ConfigureWorkflow />;
      case 2:
        return <BuildPipeline />;
      case 3:
        return <ReviewAndActivate />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          ...glassmorphism.strong,
          background: colors.background,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" fontWeight="600">
            Create New Workflow
          </Typography>
          <IconButton onClick={handleClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {getStepContent()}
      </DialogContent>
    </Dialog>
  );
};

// Main Workflow Builder View Component
const WorkflowBuilderView = () => {
  const { theme, colors, glassmorphism, gradients } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Mock workflows
  const [workflows, setWorkflows] = useState([
    {
      id: 1,
      name: 'Customer Feedback Pipeline',
      description: 'Analyze support tickets → Extract sentiment → Translate if needed → Summarize',
      plugins: ['sentiment-analyzer', 'translation-engine', 'doc-summarizer'],
      status: 'active',
      runs: 342,
      lastRun: '5 min ago',
      successRate: 98.5,
      avgDuration: '2.3s'
    },
    {
      id: 2,
      name: 'Code Review Automation',
      description: 'Review PR → Check security → Generate summary → Post comment',
      plugins: ['code-reviewer', 'security-scanner', 'github-commenter'],
      status: 'active',
      runs: 128,
      lastRun: '1 hour ago',
      successRate: 99.2,
      avgDuration: '5.7s'
    },
    {
      id: 3,
      name: 'Content Moderation Flow',
      description: 'Scan content → Detect toxicity → Flag inappropriate → Send alerts',
      plugins: ['content-scanner', 'toxicity-detector', 'alert-sender'],
      status: 'paused',
      runs: 89,
      lastRun: '2 days ago',
      successRate: 97.8,
      avgDuration: '1.8s'
    },
    {
      id: 4,
      name: 'Data Processing Pipeline',
      description: 'Extract data → Transform format → Validate → Store in database',
      plugins: ['data-extractor', 'transformer', 'validator', 'db-writer'],
      status: 'active',
      runs: 567,
      lastRun: '30 min ago',
      successRate: 96.3,
      avgDuration: '3.5s'
    }
  ]);

  const handleCreateWorkflow = (newWorkflow) => {
    // Add the new workflow to the list
    setWorkflows([newWorkflow, ...workflows]);
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="700">
          Workflow Builder
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{
            background: gradients.primaryGradient,
            '&:hover': {
              background: gradients.primaryGradient,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
            }
          }}
        >
          Create Workflow
        </Button>
      </Box>

      {/* Workflow Templates */}
      <Paper sx={{
        p: 3,
        mb: 4,
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <Typography variant="h6" fontWeight="600" gutterBottom>
          Quick Start Templates
        </Typography>
        <Grid container spacing={2}>
          {[
            { name: 'Customer Support', icon: '🎧', plugins: 3 },
            { name: 'Code Quality', icon: '🔍', plugins: 4 },
            { name: 'Content Pipeline', icon: '📝', plugins: 5 },
            { name: 'Data ETL', icon: '📊', plugins: 4 },
            { name: 'Security Scan', icon: '🔒', plugins: 3 },
            { name: 'Marketing Automation', icon: '📣', plugins: 6 }
          ].map((template) => (
            <Grid item xs={6} sm={4} md={2} key={template.name}>
              <Paper sx={{
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: colors.primary,
                  boxShadow: `0 4px 12px ${alpha(colors.primary, 0.2)}`
                }
              }}>
                <Typography variant="h4" sx={{ mb: 1 }}>{template.icon}</Typography>
                <Typography variant="body2" fontWeight="500">
                  {template.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {template.plugins} plugins
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Existing Workflows */}
      <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 2 }}>
        Your Workflows
      </Typography>
      <Grid container spacing={3}>
        {workflows.map((workflow) => (
          <Grid item xs={12} md={6} key={workflow.id}>
            <WorkflowCard workflow={workflow} />
          </Grid>
        ))}
      </Grid>

      {/* Visual Builder Placeholder */}
      <Paper sx={{
        mt: 4,
        p: 4,
        textAlign: 'center',
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `2px dashed ${isDark ? alpha('#ffffff', 0.2) : alpha('#000000', 0.2)}`
      }}>
        <AccountTreeIcon sx={{ fontSize: 64, color: alpha('#000000', 0.3), mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Visual Workflow Builder
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Drag and drop plugins to create custom workflows
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            background: colors.secondary,
            '&:hover': {
              background: alpha(colors.secondary, 0.8)
            }
          }}
        >
          Open Builder
        </Button>
      </Paper>

      {/* Create Workflow Modal */}
      <CreateWorkflowModal 
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateWorkflow={handleCreateWorkflow}
      />
    </Box>
  );
};

export default WorkflowBuilderView; 