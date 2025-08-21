import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert
} from '@mui/material';

// Icons
import RouterIcon from '@mui/icons-material/Router';
import TerminalIcon from '@mui/icons-material/Terminal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BoltIcon from '@mui/icons-material/Bolt';
import RefreshCwIcon from '@mui/icons-material/Refresh';
import LockIcon from '@mui/icons-material/Lock';
import CodeIcon from '@mui/icons-material/Code';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ApiIcon from '@mui/icons-material/Api';
import KeyIcon from '@mui/icons-material/Key';
import HttpsIcon from '@mui/icons-material/Https';
import SpeedIcon from '@mui/icons-material/Speed';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import BookIcon from '@mui/icons-material/Book';
import DownloadIcon from '@mui/icons-material/Download';

// Hooks
import { useTheme } from '../../../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';

// Code Example Component
const CodeExample = ({ language, code }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper sx={{
      position: 'relative',
      background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.02)',
      border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`,
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 1,
        borderBottom: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`,
        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)'
      }}>
        <Typography variant="caption" sx={{ fontFamily: 'monospace', textTransform: 'uppercase' }}>
          {language}
        </Typography>
        <IconButton size="small" onClick={handleCopy}>
          {copied ? <CheckCircleIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
        </IconButton>
      </Box>
      <Box sx={{ p: 2, overflowX: 'auto' }}>
        <pre style={{
          margin: 0,
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: 1.6,
          color: isDark ? '#00FFFF' : '#0066CC'
        }}>
          {code}
        </pre>
      </Box>
    </Paper>
  );
};

// Main API Gateway View Component
const APIGatewayView = () => {
  const { theme, colors } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';
  
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('curl');
  const [testEndpoint, setTestEndpoint] = useState('code-review/analyze');
  const [testMethod, setTestMethod] = useState('POST');
  const [testResponse, setTestResponse] = useState(null);

  // Code examples
  const codeExamples = {
    curl: `curl -X POST https://api.your-company.plugins.ai/code-review/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "X-Workspace: production" \\
  -H "Content-Type: application/json" \\
  -d '{
    "repository": "github.com/company/repo",
    "pullRequest": 123,
    "options": {
      "checkStyle": true,
      "securityScan": true
    }
  }'`,
    javascript: `import { PluginClient } from '@your-company/plugin-sdk';

const client = new PluginClient({
  apiKey: process.env.PLUGIN_API_KEY,
  workspace: 'production'
});

const result = await client.codeReview.analyze({
  repository: 'github.com/company/repo',
  pullRequest: 123,
  options: {
    checkStyle: true,
    securityScan: true
  }
});

console.log(result.summary);`,
    python: `from plugin_sdk import PluginClient

client = PluginClient(
    api_key=os.environ['PLUGIN_API_KEY'],
    workspace='production'
)

result = client.code_review.analyze(
    repository='github.com/company/repo',
    pull_request=123,
    options={
        'check_style': True,
        'security_scan': True
    }
)

print(result['summary'])`,
    go: `package main

import (
    "github.com/your-company/plugin-sdk-go"
)

func main() {
    client := sdk.NewClient(
        sdk.WithAPIKey(os.Getenv("PLUGIN_API_KEY")),
        sdk.WithWorkspace("production"),
    )
    
    result, err := client.CodeReview.Analyze(sdk.AnalyzeRequest{
        Repository:  "github.com/company/repo",
        PullRequest: 123,
        Options: sdk.AnalyzeOptions{
            CheckStyle:   true,
            SecurityScan: true,
        },
    })
    
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Println(result.Summary)
}`
  };

  const handleTestAPI = () => {
    // Simulate API test
    setTestResponse({
      status: 200,
      latency: 125,
      body: {
        success: true,
        data: {
          message: "Test successful",
          timestamp: new Date().toISOString()
        }
      }
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="700">
          API Gateway
        </Typography>
        
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<BookIcon />}
            sx={{ borderColor: alpha('#000000', 0.2) }}
          >
            View Docs
          </Button>
          <Button
            variant="contained"
            startIcon={<TerminalIcon />}
            onClick={() => setSelectedTab(1)}
            sx={{
              background: colors.primary,
              '&:hover': {
                background: alpha(colors.primary, 0.8),
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(colors.primary, 0.4)}`
              }
            }}
          >
            Open Playground
          </Button>
        </Box>
      </Box>

      {/* Gateway Endpoint Card */}
      <Card sx={{
        mb: 4,
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight="600" gutterBottom>
                Your Gateway Endpoint
              </Typography>
              <Paper sx={{
                p: 2,
                mb: 3,
                background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <RouterIcon sx={{ color: colors.accent }} />
                <Typography variant="body1" sx={{ fontFamily: 'monospace', flex: 1 }}>
                  https://api.your-company.plugins.ai
                </Typography>
                <IconButton onClick={() => navigator.clipboard.writeText('https://api.your-company.plugins.ai')}>
                  <ContentCopyIcon />
                </IconButton>
              </Paper>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <BoltIcon sx={{ color: colors.accent, fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="600">Auto Load Balancing</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Requests automatically routed to best performing instances
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <RefreshCwIcon sx={{ color: colors.secondary, fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="600">Built-in Retry Logic</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Exponential backoff with configurable retry policies
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LockIcon sx={{ color: '#9333EA', fontSize: 20 }} />
                    <Typography variant="subtitle2" fontWeight="600">mTLS Security</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    End-to-end encryption with mutual TLS authentication
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{
                p: 3,
                height: '100%',
                background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
              }}>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Gateway Stats
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><SpeedIcon /></ListItemIcon>
                    <ListItemText primary="Avg Latency" secondary="12ms" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><CloudUploadIcon /></ListItemIcon>
                    <ListItemText primary="Requests Today" secondary="482,320" />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                    <ListItemText primary="Success Rate" secondary="99.97%" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Paper sx={{
        background: isDark ? alpha('#ffffff', 0.05) : alpha('#ffffff', 0.9),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
      }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Quick Start" icon={<CodeIcon />} iconPosition="start" />
          <Tab label="API Playground" icon={<TerminalIcon />} iconPosition="start" />
          <Tab label="API Keys" icon={<KeyIcon />} iconPosition="start" />
          <Tab label="SDK Downloads" icon={<DownloadIcon />} iconPosition="start" />
        </Tabs>

        <Box p={3}>
          {/* Quick Start Tab */}
          {selectedTab === 0 && (
            <Box>
              <Box display="flex" gap={2} mb={3}>
                <ToggleButtonGroup
                  value={selectedLanguage}
                  exclusive
                  onChange={(e, newLang) => newLang && setSelectedLanguage(newLang)}
                  size="small"
                >
                  <ToggleButton value="curl">cURL</ToggleButton>
                  <ToggleButton value="javascript">JavaScript</ToggleButton>
                  <ToggleButton value="python">Python</ToggleButton>
                  <ToggleButton value="go">Go</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <CodeExample
                language={selectedLanguage}
                code={codeExamples[selectedLanguage]}
              />
              
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  Replace <code>YOUR_API_KEY</code> with your actual API key from the API Keys tab.
                  For production use, always store your API key in environment variables.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* API Playground Tab */}
          {selectedTab === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Request</Typography>
                  
                  <Box display="flex" gap={2} mb={2}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={testMethod}
                        onChange={(e) => setTestMethod(e.target.value)}
                      >
                        <MenuItem value="GET">GET</MenuItem>
                        <MenuItem value="POST">POST</MenuItem>
                        <MenuItem value="PUT">PUT</MenuItem>
                        <MenuItem value="DELETE">DELETE</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      size="small"
                      value={testEndpoint}
                      onChange={(e) => setTestEndpoint(e.target.value)}
                      placeholder="Enter endpoint path"
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    placeholder="Request body (JSON)"
                    sx={{ mb: 2, fontFamily: 'monospace' }}
                    defaultValue={JSON.stringify({
                      repository: "github.com/company/repo",
                      pullRequest: 123,
                      options: {
                        checkStyle: true,
                        securityScan: true
                      }
                    }, null, 2)}
                  />
                  
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleTestAPI}
                    sx={{
                      background: colors.primary,
                      '&:hover': {
                        background: alpha(colors.primary, 0.8)
                      }
                    }}
                  >
                    Send Request
                  </Button>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Response</Typography>
                  
                  {testResponse ? (
                    <Box>
                      <Box display="flex" gap={2} mb={2}>
                        <Chip
                          label={`Status: ${testResponse.status}`}
                          color={testResponse.status === 200 ? 'success' : 'error'}
                          size="small"
                        />
                        <Chip
                          label={`Latency: ${testResponse.latency}ms`}
                          size="small"
                        />
                      </Box>
                      
                      <Paper sx={{
                        p: 2,
                        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
                        border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`
                      }}>
                        <pre style={{
                          margin: 0,
                          fontFamily: 'monospace',
                          fontSize: '13px',
                          color: testResponse.status === 200 ? '#4ADE80' : '#FF4444'
                        }}>
                          {JSON.stringify(testResponse.body, null, 2)}
                        </pre>
                      </Paper>
                    </Box>
                  ) : (
                    <Paper sx={{
                      p: 4,
                      textAlign: 'center',
                      background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.1)}`
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Response will appear here
                      </Typography>
                    </Paper>
                  )}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* API Keys Tab */}
          {selectedTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">API Keys</Typography>
                <Button
                  variant="contained"
                  startIcon={<KeyIcon />}
                  size="small"
                >
                  Generate New Key
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {[
                  { name: 'Production API Key', created: '2024-01-15', lastUsed: 'Today', scopes: 'All plugins' },
                  { name: 'Development API Key', created: '2024-02-01', lastUsed: '3 days ago', scopes: 'Dev workspace only' }
                ].map((key, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper sx={{
                      p: 3,
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`
                    }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">{key.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Created {key.created} • Last used {key.lastUsed} • {key.scopes}
                          </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                          <Button size="small" variant="outlined">
                            Regenerate
                          </Button>
                          <Button size="small" variant="outlined" color="error">
                            Revoke
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* SDK Downloads Tab */}
          {selectedTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Available SDKs</Typography>
              <Grid container spacing={3}>
                {[
                  { lang: 'JavaScript/TypeScript', version: '2.1.0', icon: '🟨' },
                  { lang: 'Python', version: '2.1.0', icon: '🐍' },
                  { lang: 'Go', version: '2.1.0', icon: '🐹' },
                  { lang: 'Java', version: '2.1.0', icon: '☕' },
                  { lang: 'Ruby', version: '2.1.0', icon: '💎' },
                  { lang: 'PHP', version: '2.1.0', icon: '🐘' }
                ].map((sdk) => (
                  <Grid item xs={12} sm={6} md={4} key={sdk.lang}>
                    <Paper sx={{
                      p: 3,
                      textAlign: 'center',
                      background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${isDark ? alpha('#ffffff', 0.1) : alpha('#000000', 0.05)}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${alpha(colors.primary, 0.2)}`
                      }
                    }}>
                      <Typography variant="h3" sx={{ mb: 2 }}>{sdk.icon}</Typography>
                      <Typography variant="subtitle1" fontWeight="600">
                        {sdk.lang}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                        v{sdk.version}
                      </Typography>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        sx={{ textTransform: 'none' }}
                      >
                        Download
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default APIGatewayView; 