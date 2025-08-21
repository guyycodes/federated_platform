// BrowseTemplates.jsx

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container,
  useTheme,
  alpha,
  Chip,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { 
  RocketLaunch,
  Code,
  Business,
  Speed,
  GitHub,
  Terminal,
  ContentCopy,
  Check,
  Psychology,
  Payments,
  ShoppingCart,
  Email,
  CalendarMonth,
  Analytics,
  ArrowForward,
  FolderOpen,
  AutoAwesome,
  IntegrationInstructions,
  Language,
  Image,
  AudioFile,
  DataObject,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../../Context/ThemeContext';
import { motion } from 'framer-motion';
import { GlassCard, PrimaryButton, AccentButton } from '../components/Buttons';
import { useNavigate } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

const BrowseTemplates = () => {
  const { gradients, theme, colors, glassmorphism } = useCustomTheme();
  const muiTheme = useTheme();
  const isLightTheme = theme === 'light';
  const navigate = useNavigate();
  
  const [copiedCommand, setCopiedCommand] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Theme-aware colors
  const textPrimary = isLightTheme ? 'rgba(0,0,0,0.87)' : 'rgba(255,255,255,0.9)';
  const textSecondary = isLightTheme ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
  const borderColor = isLightTheme ? 'rgba(0,0,0,0.12)' : alpha(colors.accent, 0.2);
  
  const copyToClipboard = (text, command) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(command);
    setTimeout(() => setCopiedCommand(''), 2000);
  };

  // Feature cards data
  const features = [
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'AI-Powered',
      description: 'Pre-configured with 7+ AI models (GPT-4, Qwen, DeepHermes, Flux, Phi-4)',
      color: colors.accent
    },
    {
      icon: <IntegrationInstructions sx={{ fontSize: 40 }} />,
      title: '50+ Business Integrations',
      description: 'QuickBooks, Stripe, Shopify, Slack, HubSpot, and more',
      color: colors.primary
    },
    {
      icon: <Code sx={{ fontSize: 40 }} />,
      title: 'Modern Frontend',
      description: 'React + TypeScript/JavaScript with Vite',
      color: colors.secondary
    },
    {
      icon: <Speed sx={{ fontSize: 40 }} />,
      title: 'Production Ready',
      description: 'Docker support, CI/CD pipelines, WebSocket real-time features',
      color: '#4ADE80'
    },
    {
      icon: <DataObject sx={{ fontSize: 40 }} />,
      title: 'Flexible Backend',
      description: 'Choose between Python (FastAPI) or Node.js (Express)',
      color: '#F6511E'
    },
    {
      icon: <Language sx={{ fontSize: 40 }} />,
      title: 'Multi-Modal Support',
      description: 'Handle text, images, audio, and code',
      color: '#9333EA'
    }
  ];

  // AI Models data
  const aiModels = [
    { name: 'GPT-4o-mini', description: 'General purpose, web search, tool use' },
    { name: 'Qwen2.5-Math', description: 'Mathematical reasoning and calculations' },
    { name: 'DeepHermes-3', description: 'Advanced reasoning and instruction following' },
    { name: 'Phi-4', description: 'Multimodal (text, image, audio)' },
    { name: 'FLUX', description: 'Text-to-image generation' },
    { name: 'FluxKontext', description: 'Image editing and modification' },
    { name: 'Qwen2.5-Coder', description: 'Code generation and analysis' }
  ];

  // Integration categories
  const integrationCategories = [
    { icon: <Payments />, title: 'Payments', items: 'Stripe, Square, QuickBooks' },
    { icon: <ShoppingCart />, title: 'E-commerce', items: 'Shopify, WooCommerce' },
    { icon: <Email />, title: 'Marketing', items: 'Mailchimp, HubSpot' },
    { icon: <Business />, title: 'Communication', items: 'Slack, email' },
    { icon: <CalendarMonth />, title: 'Scheduling', items: 'Calendly' },
    { icon: <Analytics />, title: 'Analytics', items: 'Looker Studio' }
  ];

  // Theme-aware background
  const backgroundGradient = isLightTheme 
    ? `linear-gradient(135deg, ${alpha(colors.primary, 0.02)}, ${alpha(colors.secondary, 0.02)}, ${muiTheme.palette.grey[50]})`
    : gradients.darkGlass;

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      background: backgroundGradient,
      position: 'relative',
      py: 4,
      px: { xs: 2, sm: 3, md: 4 },
      '&::before': isLightTheme ? {} : {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 20% 50%, ${alpha(colors.accent, 0.05)}, transparent 50%), 
                     radial-gradient(circle at 80% 80%, ${alpha(colors.primary, 0.05)}, transparent 50%)`,
        pointerEvents: 'none',
      }
    }}>
      <Container maxWidth="xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  background: gradients.primaryGradient,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: `drop-shadow(0 2px 4px ${alpha(colors.primary, 0.3)})`,
                }}
              >
                Plugin SDK Templates
              </Typography>
              <Typography variant="h6" sx={{ color: textSecondary, mb: 4 }}>
                A powerful scaffolding tool for creating full-stack AI-powered plugin applications with business integrations
              </Typography>
              
              {/* Quick Start Button */}
              <PrimaryButton
                size="large"
                startIcon={<RocketLaunch />}
                onClick={() => navigate('/staff/dash/new', { state: { fromCreateNew: true } })}
                sx={{ px: 4, py: 1.5, fontSize: '18px' }}
              >
                Start with a Template
              </PrimaryButton>
            </motion.div>
          </Box>

          {/* Features Grid */}
          <motion.div variants={itemVariants}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: textPrimary }}>
              ✨ Features
            </Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <GlassCard sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            background: alpha(feature.color, 0.15),
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${alpha(feature.color, 0.3)}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            color: feature.color
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: textPrimary }}>
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: textSecondary }}>
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </GlassCard>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Installation Section */}
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ mb: 6 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: textPrimary }}>
                  📦 Installation
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, color: textSecondary }}>
                    Install globally via npm:
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      background: alpha(colors.glassWhite, 0.05),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <code style={{ color: colors.accent, fontFamily: 'monospace' }}>
                      npm install -g plugin-sdk
                    </code>
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard('npm install -g plugin-sdk', 'npm')}
                      sx={{ color: copiedCommand === 'npm' ? '#4ADE80' : textSecondary }}
                    >
                      {copiedCommand === 'npm' ? <Check /> : <ContentCopy />}
                    </IconButton>
                  </Paper>
                </Box>

                <Box>
                  <Typography variant="body1" sx={{ mb: 2, color: textSecondary }}>
                    Or use directly with npx:
                  </Typography>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      background: alpha(colors.glassWhite, 0.05),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${borderColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <code style={{ color: colors.accent, fontFamily: 'monospace' }}>
                      npx plugin-sdk init
                    </code>
                    <IconButton 
                      size="small" 
                      onClick={() => copyToClipboard('npx plugin-sdk init', 'npx')}
                      sx={{ color: copiedCommand === 'npx' ? '#4ADE80' : textSecondary }}
                    >
                      {copiedCommand === 'npx' ? <Check /> : <ContentCopy />}
                    </IconButton>
                  </Paper>
                </Box>
              </CardContent>
            </GlassCard>
          </motion.div>

          {/* Tabs for AI Models and Integrations */}
          <motion.div variants={itemVariants}>
            <GlassCard sx={{ mb: 6 }}>
              <CardContent sx={{ p: 0 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ 
                    borderBottom: `1px solid ${borderColor}`,
                    '& .MuiTab-root': {
                      color: textSecondary,
                      '&.Mui-selected': {
                        color: colors.primary
                      }
                    }
                  }}
                >
                  <Tab label="🤖 AI Models" />
                  <Tab label="🔌 Business Integrations" />
                  <Tab label="🏗️ Project Structure" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                  {/* AI Models Tab */}
                  {activeTab === 0 && (
                    <Grid container spacing={2}>
                      {aiModels.map((model, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 2,
                            background: alpha(colors.glassWhite, 0.05),
                            border: `1px solid ${borderColor}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              background: alpha(colors.accent, 0.1),
                              borderColor: alpha(colors.accent, 0.3),
                              transform: 'translateY(-2px)'
                            }
                          }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.accent, mb: 0.5 }}>
                              {model.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: textSecondary }}>
                              {model.description}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}

                  {/* Business Integrations Tab */}
                  {activeTab === 1 && (
                    <Grid container spacing={3}>
                      {integrationCategories.map((category, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                background: alpha(colors.secondary, 0.15),
                                backdropFilter: 'blur(10px)',
                                border: `1px solid ${alpha(colors.secondary, 0.3)}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 2,
                                color: colors.secondary
                              }}
                            >
                              {category.icon}
                            </Box>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: textPrimary }}>
                                {category.title}
                              </Typography>
                              <Typography variant="body2" sx={{ color: textSecondary }}>
                                {category.items}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ color: textSecondary, mt: 2 }}>
                          And many more integrations available...
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {/* Project Structure Tab */}
                  {activeTab === 2 && (
                    <Box>
                      <Paper 
                        sx={{ 
                          p: 3, 
                          background: alpha(colors.glassWhite, 0.03),
                          backdropFilter: 'blur(10px)',
                          border: `1px solid ${borderColor}`,
                          fontFamily: 'monospace',
                          fontSize: '14px',
                          color: textSecondary,
                          overflowX: 'auto'
                        }}
                      >
                        <pre style={{ margin: 0 }}>
{`my-plugin/
├── src/
│   ├── client/          # React frontend with Vite
│   │   ├── src/
│   │   │   ├── pages/   # Pre-built UI pages
│   │   │   ├── components/
│   │   │   └── api/     # API client
│   │   └── package.json
│   │
│   └── server/          # Backend server
│       ├── agent/       # LangGraph agent system
│       ├── models/      # AI model configurations
│       ├── integrations/# Business tool integrations
│       ├── tools/       # Agent tools
│       └── main.py/js   # Server entry point
│
├── .github/workflows/   # CI/CD pipelines
├── Dockerfile          # Production deployment
├── app.config.json     # Plugin configuration
└── README.md          # Project documentation`}
                        </pre>
                      </Paper>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </GlassCard>
          </motion.div>

          {/* Quick Start Section */}
          <motion.div variants={itemVariants}>
            <GlassCard>
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: textPrimary }}>
                  🚀 Ready to Build?
                </Typography>
                <Typography variant="body1" sx={{ color: textSecondary, mb: 4 }}>
                  Create your first AI-powered plugin with business integrations in minutes
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <AccentButton
                    size="large"
                    startIcon={<Terminal />}
                    onClick={() => navigate('/staff/dash/new', { state: { fromCreateNew: true } })}
                  >
                    Create New Plugin
                  </AccentButton>
                  <Button
                    size="large"
                    variant="outlined"
                    startIcon={<GitHub />}
                    sx={{
                      borderColor: borderColor,
                      color: textPrimary,
                      '&:hover': {
                        borderColor: alpha(colors.primary, 0.5),
                        background: alpha(colors.primary, 0.05)
                      }
                    }}
                    href="https://github.com/your-org/plugin-sdk"
                    target="_blank"
                  >
                    View on GitHub
                  </Button>
                </Box>
              </CardContent>
            </GlassCard>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default BrowseTemplates; 