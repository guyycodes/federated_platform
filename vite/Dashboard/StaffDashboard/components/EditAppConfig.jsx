// EditAppConfig.jsx

import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  Skeleton,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Autocomplete,
  Collapse,
  Tooltip
} from '@mui/material';
import {
  GitHub,
  Close,
  Save,
  Info,
  Settings,
  ExpandMore,
  ExpandLess,
  Lock,
  Edit,
  Add,
  Remove,
  Warning
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useGitHub } from '../../../hooks/useGitHub';
import { usePlugins } from '../../../hooks/usePlugins';
import { useDataLayer } from '../../../Context/DataLayer';

// Text constants
const TEXT = {
  dialog: {
    title: (pluginName) => `Edit Configuration: ${pluginName}`,
    subtitle: 'Modify app.config.json settings'
  },
  
  sections: {
    general: 'General Information',
    gpu: 'GPU Configuration',
    models: 'AI Models',
    agent: 'Agent Settings',
    api: 'API Configuration',
    pluginConfig: 'Plugin Configuration',
    integrations: 'Integrations',
    ui: 'User Interface',
    permissions: 'Permissions',
    categories: 'Categories & Keywords'
  },
  
  fields: {
    description: 'Description',
    version: 'Version',
    license: 'License',
    homepage: 'Homepage',
    author: 'Author Information',
    debug: 'Debug Mode',
    region: 'Region',
    gpuType: 'GPU Instance Type',
    gpuCount: 'GPU Count',
    gpuMemory: 'GPU Memory (MB)',
    maxTokensPerRequest: 'Max Tokens Per Request',
    responseTimeout: 'Response Timeout (seconds)',
    enableMemory: 'Enable Memory',
    autoSync: 'Auto Sync',
    syncInterval: 'Sync Interval (minutes)',
    readOnly: 'Read Only Mode'
  },
  
  tooltips: {
    locked: 'This field is managed by the platform and cannot be edited',
    required: 'This field is required',
    gpuType: 'Select the GPU instance type for deployment',
    models: 'Configure AI models available in your plugin',
    integrations: 'Select integrations to enable for your plugin'
  },
  
  errors: {
    fetchFailed: 'Failed to fetch configuration',
    saveFailed: 'Failed to save configuration',
    invalidJson: 'Invalid configuration format',
    missingRequired: 'Please fill in all required fields'
  },
  
  actions: {
    cancel: 'Cancel',
    save: 'Save Changes',
    saving: 'Saving...',
    discard: 'Discard Changes'
  },
  
  warnings: {
    unsavedChanges: 'You have unsaved changes. Are you sure you want to close?'
  }
};

// Non-editable fields
const LOCKED_FIELDS = [
  'server-name',
  'environment',
  'backendTag',
  'gpu.host',
  'gpu.supportedRegions',
  'langsmith.apiUrl',
  'deployment',
  'ui.expose'
];

// Glass Card Component
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

// Section Header Component
const SectionHeader = ({ title, icon: Icon, expanded, onToggle, isLightTheme, colors }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      cursor: 'pointer',
      py: 1.5,
      px: 2,
      borderRadius: 1,
      '&:hover': {
        background: alpha(colors.accent, 0.05)
      }
    }}
    onClick={onToggle}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Icon sx={{ color: colors.accent, fontSize: 24 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, color: colors.text }}>
        {title}
      </Typography>
    </Box>
    <IconButton size="small">
      {expanded ? <ExpandLess /> : <ExpandMore />}
    </IconButton>
  </Box>
);

// Field Component with Lock Indicator
const ConfigField = ({ 
  label, 
  value, 
  onChange, 
  locked = false, 
  type = 'text',
  required = false,
  tooltip,
  options = [],
  multiline = false,
  rows = 1,
  isLightTheme,
  colors,
  textPrimary,
  textSecondary,
  borderColor
}) => {
  const fieldContent = (
    <Box sx={{ width: '100%' }}>
      <FormLabel 
        sx={{ 
          color: textSecondary, 
          mb: 0.5, 
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        {label}
        {required && <Typography component="span" sx={{ color: '#ef4444' }}>*</Typography>}
        {locked && <Lock sx={{ fontSize: 16, color: alpha(textSecondary, 0.5) }} />}
      </FormLabel>
      
      {type === 'select' ? (
        <Select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          fullWidth
          size="small"
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: borderColor
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: !locked && alpha(colors.accent, 0.5)
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: !locked && colors.accent
            },
            '& .MuiSelect-select': {
              color: textPrimary
            },
            background: isLightTheme 
              ? alpha(colors.glassWhite, 0.8)
              : alpha(colors.glassWhite, 0.05),
            backdropFilter: 'blur(10px)'
          }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ) : type === 'boolean' ? (
        <FormControlLabel
          control={
            <Switch
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              disabled={locked}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: colors.accent
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: colors.accent
                }
              }}
            />
          }
          label=""
        />
      ) : (
        <TextField
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={locked}
          type={type}
          multiline={multiline}
          rows={rows}
          fullWidth
          size="small"
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
                borderColor: !locked && alpha(colors.accent, 0.5)
              },
              '&.Mui-focused fieldset': {
                borderColor: !locked && colors.accent
              },
              '&.Mui-disabled': {
                background: alpha(colors.glassWhite, 0.02),
                '& fieldset': {
                  borderColor: alpha(borderColor, 0.3)
                }
              }
            }
          }}
        />
      )}
    </Box>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {fieldContent}
    </Tooltip>
  ) : fieldContent;
};

const EditAppConfig = ({
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
  // Hooks
  const { fetchSpecificRepo, parseGitHubUrl, triggerPluginPush, checkCallbackStatus } = useGitHub();
  const { updatePlugin } = usePlugins();
  const { user } = useDataLayer();
  
  // State
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [configData, setConfigData] = useState(null);
  const [editedConfig, setEditedConfig] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    gpu: false,
    models: false,
    agent: false,
    api: false,
    pluginConfig: false,
    integrations: false,
    ui: false,
    permissions: false,
    categories: false
  });
  
  // Add scrollbar styles
  useEffect(() => {
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

  // Fetch config when modal opens
  useEffect(() => {
    if (open && selectedPlugin?.gitRepo) {
      fetchConfiguration();
    }
    
    // Reset state when closing
    if (!open) {
      setConfigData(null);
      setEditedConfig(null);
      setError(null);
      setHasChanges(false);
      setExpandedSections({
        general: true,
        gpu: false,
        models: false,
        agent: false,
        api: false,
        pluginConfig: false,
        integrations: false,
        ui: false,
        permissions: false,
        categories: false
      });
    }
  }, [open, selectedPlugin]);

  // Track changes
  useEffect(() => {
    if (configData && editedConfig) {
      setHasChanges(JSON.stringify(configData) !== JSON.stringify(editedConfig));
    }
  }, [configData, editedConfig]);

  // Fetch app.config.json
  const fetchConfiguration = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const repo = await fetchSpecificRepo(selectedPlugin.gitRepo);
      if (!repo) throw new Error('Failed to fetch repository details');
      
      // Fetch app.config.json
      const apiUrl = `https://api.github.com/repos/${repo.full_name}/contents/app.config.json`;
      const response = await fetch(apiUrl, {
        headers: { 'Accept': 'application/vnd.github.v3+json' }
      });
      
      if (!response.ok) {
        throw new Error(TEXT.errors.fetchFailed);
      }
      
      const data = await response.json();
      const content = atob(data.content);
      const config = JSON.parse(content);
      
      setConfigData(config);
      setEditedConfig(JSON.parse(JSON.stringify(config))); // Deep clone
    } catch (err) {
      console.error('Error fetching config:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update nested object values
  const updateNestedValue = (path, value) => {
    setEditedConfig(prev => {
      const newConfig = { ...prev };
      const pathParts = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      return newConfig;
    });
  };

  // Check if field is locked
  const isFieldLocked = (path) => {
    return LOCKED_FIELDS.includes(path) || 
           LOCKED_FIELDS.some(locked => path.startsWith(locked + '.'));
  };

  // Toggle section
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // For now, just log the changes
      console.log('Saving configuration:', editedConfig);
      
      // TODO: Implement actual save via GitHub API
      // This would involve:
      // 1. Getting the current file SHA
      // 2. Creating a commit with the updated content
      // 3. Pushing to the repository
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Close modal on success
      onClose();
    } catch (err) {
      console.error('Error saving config:', err);
      setError(TEXT.errors.saveFailed);
    } finally {
      setSaving(false);
    }
  };

  // Handle array operations
  const addArrayItem = (path, defaultValue = '') => {
    setEditedConfig(prev => {
      const newConfig = { ...prev };
      const pathParts = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const arrayKey = pathParts[pathParts.length - 1];
      if (!Array.isArray(current[arrayKey])) {
        current[arrayKey] = [];
      }
      current[arrayKey] = [...current[arrayKey], defaultValue];
      
      return newConfig;
    });
  };

  const removeArrayItem = (path, index) => {
    setEditedConfig(prev => {
      const newConfig = { ...prev };
      const pathParts = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const arrayKey = pathParts[pathParts.length - 1];
      current[arrayKey] = current[arrayKey].filter((_, i) => i !== index);
      
      return newConfig;
    });
  };

  const updateArrayItem = (path, index, value) => {
    setEditedConfig(prev => {
      const newConfig = { ...prev };
      const pathParts = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        current = current[pathParts[i]];
      }
      
      const arrayKey = pathParts[pathParts.length - 1];
      current[arrayKey][index] = value;
      
      return newConfig;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (hasChanges) {
          if (confirm(TEXT.warnings.unsavedChanges)) {
            onClose();
          }
        } else {
          onClose();
        }
      }}
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
        {loading ? (
          <Box>
            <Skeleton variant="text" width="100%" height={40} />
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ mt: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ mt: 2, borderRadius: 1 }} />
          </Box>
        ) : error ? (
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
        ) : editedConfig ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              
            >
              <Grid container spacing={3} sx={{ mt:1 }}>
                {/* General Information Section */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ overflow: 'hidden' }}>
                    <SectionHeader
                      title={TEXT.sections.general}
                      icon={Info}
                      expanded={expandedSections.general}
                      onToggle={() => toggleSection('general')}
                      isLightTheme={isLightTheme}
                      colors={colors}
                    />
                    <Collapse in={expandedSections.general}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={2}>
                          <Grid size={12}>
                            <ConfigField
                              label={TEXT.fields.description}
                              value={editedConfig.description}
                              onChange={(value) => updateNestedValue('description', value)}
                              multiline
                              rows={2}
                              required
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.version}
                              value={editedConfig.version}
                              onChange={(value) => updateNestedValue('version', value)}
                              required
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.license}
                              value={editedConfig.license}
                              onChange={(value) => updateNestedValue('license', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.debug}
                              type="boolean"
                              value={editedConfig.debug}
                              onChange={(value) => updateNestedValue('debug', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={12}>
                            <ConfigField
                              label={TEXT.fields.homepage}
                              value={editedConfig.homepage}
                              onChange={(value) => updateNestedValue('homepage', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          
                          {/* Author Information */}
                          <Grid size={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle2" sx={{ color: textSecondary, mb: 1 }}>
                              {TEXT.fields.author}
                            </Typography>
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label="Name"
                              value={editedConfig.author?.name}
                              onChange={(value) => updateNestedValue('author.name', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label="Email"
                              value={editedConfig.author?.email}
                              onChange={(value) => updateNestedValue('author.email', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label="URL"
                              value={editedConfig.author?.url}
                              onChange={(value) => updateNestedValue('author.url', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </GlassCard>
                </Grid>

                {/* GPU Configuration Section */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ overflow: 'hidden' }}>
                    <SectionHeader
                      title={TEXT.sections.gpu}
                      icon={Settings}
                      expanded={expandedSections.gpu}
                      onToggle={() => toggleSection('gpu')}
                      isLightTheme={isLightTheme}
                      colors={colors}
                    />
                    <Collapse in={expandedSections.gpu}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={2}>
                          <Grid size={6}>
                            <ConfigField
                              label={TEXT.fields.region}
                              value={editedConfig.region}
                              onChange={(value) => updateNestedValue('region', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={6}>
                            <ConfigField
                              label="Support GPU"
                              type="boolean"
                              value={editedConfig.gpu?.supportGPU}
                              onChange={(value) => updateNestedValue('gpu.supportGPU', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={12}>
                            <ConfigField
                              label={TEXT.fields.gpuType}
                              type="select"
                              value={editedConfig.gpu?.gpuType}
                              onChange={(value) => updateNestedValue('gpu.gpuType', value)}
                              options={editedConfig.gpu?.types || []}
                              tooltip={TEXT.tooltips.gpuType}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={6}>
                            <ConfigField
                              label={TEXT.fields.gpuCount}
                              type="number"
                              value={editedConfig.gpu?.gpuCount}
                              onChange={(value) => updateNestedValue('gpu.gpuCount', parseInt(value) || 1)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={6}>
                            <ConfigField
                              label={TEXT.fields.gpuMemory}
                              type="number"
                              value={editedConfig.gpu?.gpuMemory}
                              onChange={(value) => updateNestedValue('gpu.gpuMemory', parseInt(value) || 0)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          
                          {/* Locked fields */}
                          <Grid size={6}>
                            <ConfigField
                              label="GPU Host"
                              value={editedConfig.gpu?.host}
                              locked
                              tooltip={TEXT.tooltips.locked}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={6}>
                            <ConfigField
                              label="Supported Regions"
                              value={editedConfig.gpu?.supportedRegions?.join(', ')}
                              locked
                              tooltip={TEXT.tooltips.locked}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </GlassCard>
                </Grid>

                {/* Agent Settings Section */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ overflow: 'hidden' }}>
                    <SectionHeader
                      title={TEXT.sections.agent}
                      icon={Settings}
                      expanded={expandedSections.agent}
                      onToggle={() => toggleSection('agent')}
                      isLightTheme={isLightTheme}
                      colors={colors}
                    />
                    <Collapse in={expandedSections.agent}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={2}>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.maxTokensPerRequest}
                              type="number"
                              value={editedConfig.agent?.maxTokensPerRequest}
                              onChange={(value) => updateNestedValue('agent.maxTokensPerRequest', parseInt(value) || 0)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.responseTimeout}
                              type="number"
                              value={editedConfig.agent?.responseTimeout}
                              onChange={(value) => updateNestedValue('agent.responseTimeout', parseInt(value) || 30)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.enableMemory}
                              type="boolean"
                              value={editedConfig.agent?.enableMemory}
                              onChange={(value) => updateNestedValue('agent.enableMemory', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </GlassCard>
                </Grid>

                {/* API Configuration Section */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ overflow: 'hidden' }}>
                    <SectionHeader
                      title={TEXT.sections.api}
                      icon={Settings}
                      expanded={expandedSections.api}
                      onToggle={() => toggleSection('api')}
                      isLightTheme={isLightTheme}
                      colors={colors}
                    />
                    <Collapse in={expandedSections.api}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={2}>
                          <Grid size={12}>
                            <ConfigField
                              label="Base URL"
                              value={editedConfig.api?.base}
                              onChange={(value) => updateNestedValue('api.base', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          
                          {/* Ports Array */}
                          <Grid size={12}>
                            <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2" sx={{ color: textSecondary }}>
                                API Ports
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<Add />}
                                onClick={() => addArrayItem('api.ports', 3000)}
                                sx={{ textTransform: 'none', color: colors.accent }}
                              >
                                Add Port
                              </Button>
                            </Box>
                            {editedConfig.api?.port?.map((port, index) => (
                              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <ConfigField
                                  label=""
                                  type="number"
                                  value={port}
                                  onChange={(value) => updateArrayItem('api.port', index, parseInt(value) || 3000)}
                                  locked={index === 0} // First port (3000) is mandatory
                                  tooltip={index === 0 ? 'Port 3000 is mandatory' : ''}
                                  isLightTheme={isLightTheme}
                                  colors={colors}
                                  textPrimary={textPrimary}
                                  textSecondary={textSecondary}
                                  borderColor={borderColor}
                                />
                                {index > 0 && (
                                  <IconButton 
                                    onClick={() => removeArrayItem('api.port', index)}
                                    size="small"
                                    sx={{ color: '#ef4444' }}
                                  >
                                    <Remove />
                                  </IconButton>
                                )}
                              </Box>
                            ))}
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </GlassCard>
                </Grid>

                {/* Integrations Section */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ overflow: 'hidden' }}>
                    <SectionHeader
                      title={TEXT.sections.integrations}
                      icon={Settings}
                      expanded={expandedSections.integrations}
                      onToggle={() => toggleSection('integrations')}
                      isLightTheme={isLightTheme}
                      colors={colors}
                    />
                    <Collapse in={expandedSections.integrations}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={2}>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.autoSync}
                              type="boolean"
                              value={editedConfig.integrations?.autoSync}
                              onChange={(value) => updateNestedValue('integrations.autoSync', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.syncInterval}
                              type="number"
                              value={editedConfig.integrations?.syncInterval}
                              onChange={(value) => updateNestedValue('integrations.syncInterval', parseInt(value) || 15)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          <Grid size={4}>
                            <ConfigField
                              label={TEXT.fields.readOnly}
                              type="boolean"
                              value={editedConfig.integrations?.readOnly}
                              onChange={(value) => updateNestedValue('integrations.readOnly', value)}
                              isLightTheme={isLightTheme}
                              colors={colors}
                              textPrimary={textPrimary}
                              textSecondary={textSecondary}
                              borderColor={borderColor}
                            />
                          </Grid>
                          
                          {/* App Integrations */}
                          <Grid size={12}>
                            <FormLabel sx={{ color: textSecondary, mb: 1, fontSize: '0.875rem' }}>
                              App Integrations
                            </FormLabel>
                            <Autocomplete
                              multiple
                              value={editedConfig.integrations?.appIntegrations || []}
                              onChange={(_, newValue) => updateNestedValue('integrations.appIntegrations', newValue)}
                              options={['shopify', 'woocommerce', 'quickbooks', 'stripe', 'square', 'paypal', 'xero']}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Select integrations"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      background: isLightTheme 
                                        ? alpha(colors.glassWhite, 0.8)
                                        : alpha(colors.glassWhite, 0.05),
                                      backdropFilter: 'blur(10px)',
                                      '& fieldset': {
                                        borderColor: borderColor
                                      }
                                    }
                                  }}
                                />
                              )}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                    sx={{
                                      borderColor: colors.accent,
                                      color: colors.accent
                                    }}
                                  />
                                ))
                              }
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </GlassCard>
                </Grid>

                {/* Categories & Keywords Section */}
                <Grid size={12}>
                  <GlassCard variant="default" sx={{ overflow: 'hidden' }}>
                    <SectionHeader
                      title={TEXT.sections.categories}
                      icon={Settings}
                      expanded={expandedSections.categories}
                      onToggle={() => toggleSection('categories')}
                      isLightTheme={isLightTheme}
                      colors={colors}
                    />
                    <Collapse in={expandedSections.categories}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <Grid container spacing={2}>
                          <Grid size={6}>
                            <FormLabel sx={{ color: textSecondary, mb: 1, fontSize: '0.875rem' }}>
                              Categories
                            </FormLabel>
                            <Autocomplete
                              multiple
                              value={editedConfig.categories || []}
                              onChange={(_, newValue) => updateNestedValue('categories', newValue)}
                              options={['inventory', 'analytics', 'e-commerce', 'automation', 'finance', 'marketing', 'sales']}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Add categories"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      background: isLightTheme 
                                        ? alpha(colors.glassWhite, 0.8)
                                        : alpha(colors.glassWhite, 0.05),
                                      backdropFilter: 'blur(10px)',
                                      '& fieldset': {
                                        borderColor: borderColor
                                      }
                                    }
                                  }}
                                />
                              )}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                    sx={{
                                      borderColor: colors.primary,
                                      color: colors.primary
                                    }}
                                  />
                                ))
                              }
                            />
                          </Grid>
                          <Grid size={6}>
                            <FormLabel sx={{ color: textSecondary, mb: 1, fontSize: '0.875rem' }}>
                              Keywords
                            </FormLabel>
                            <Autocomplete
                              multiple
                              value={editedConfig.keywords || []}
                              onChange={(_, newValue) => updateNestedValue('keywords', newValue)}
                              options={[]}
                              freeSolo
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Add keywords"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      background: isLightTheme 
                                        ? alpha(colors.glassWhite, 0.8)
                                        : alpha(colors.glassWhite, 0.05),
                                      backdropFilter: 'blur(10px)',
                                      '& fieldset': {
                                        borderColor: borderColor
                                      }
                                    }
                                  }}
                                />
                              )}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                    sx={{
                                      borderColor: colors.secondary,
                                      color: colors.secondary
                                    }}
                                  />
                                ))
                              }
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </GlassCard>
                </Grid>
              </Grid>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ 
        p: 3, 
        borderTop: `1px solid ${borderColor}`, 
        background: isLightTheme ? '#f8f9fa' : alpha(colors.background, 0.5),
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        {hasChanges && (
          <Alert 
            severity="warning" 
            icon={<Warning />}
            sx={{ 
              py: 0.5,
              px: 2,
              background: alpha(colors.warning || '#f59e0b', 0.1),
              color: colors.warning || '#f59e0b',
              border: `1px solid ${alpha(colors.warning || '#f59e0b', 0.3)}`,
              '& .MuiAlert-icon': {
                color: colors.warning || '#f59e0b'
              }
            }}
          >
            You have unsaved changes
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
          <Button 
            onClick={onClose} 
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
            onClick={handleSave}
            disabled={!hasChanges || saving}
            startIcon={saving ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Save />}
            sx={{
              background: `linear-gradient(135deg, ${colors.primary}, ${alpha(colors.primary, 0.8)})`,
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
              py: 1,
              '&:hover': {
                background: `linear-gradient(135deg, ${alpha(colors.primary, 0.9)}, ${colors.primary})`,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 20px ${alpha(colors.primary, 0.3)}`
              },
              '&:disabled': {
                background: alpha(colors.primary, 0.3),
                color: alpha('#ffffff', 0.5),
                transform: 'none',
                boxShadow: 'none'
              }
            }}
          >
            {saving ? TEXT.actions.saving : TEXT.actions.save}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EditAppConfig;
