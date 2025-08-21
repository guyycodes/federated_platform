import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Activity,
  DollarSign,
  Users,
  Settings,
  Zap,
  Shield,
  Code,
  GitBranch,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Layers,
  Play,
  Pause,
  RefreshCw,
  Globe,
  Lock,
  Key,
  CreditCard,
  Building2,
  Folder,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Terminal,
  MessageCircle,
  HelpCircle,
  ExternalLink,
  Copy,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Cpu,
  Gauge,
  Workflow,
  GitMerge,
  Eye,
  EyeOff,
  Mail,
  Slack,
  Calendar,
  Video,
  BookOpen,
  Lightbulb,
  ShoppingCart,
  Tag,
  AlertTriangle,
  XCircle,
  Banknote,
  Receipt,
  FileText,
  Share2,
  Router,
  Sparkles
} from 'lucide-react';

// Theme configuration (matching previous dashboards)
const theme = {
  colors: {
    primary: '#F6511E',
    accent: '#00FFFF',
    secondary: '#3B82F6',
    background: '#1E1E22',
    surface: '#2A2A2E',
    purple: '#9333EA',
    pink: '#EC4899',
    darkOrange: '#902F12',
    lightBlue: '#1A6DED',
    glassWhite: 'rgba(255,255,255,0.1)',
    glassBlack: 'rgba(0,0,0,0.3)',
    success: '#4ADE80',
    warning: '#FFA500',
    error: '#FF4444'
  },
  gradients: {
    darkGlass: 'linear-gradient(135deg, #1E1E22, #2A2A2E)',
    primaryGradient: 'linear-gradient(135deg, #F6511E, #902F12)',
    accentGradient: 'linear-gradient(90deg, #00FFFF, #1A6DED)',
    multiGradient: 'linear-gradient(135deg, #3B82F6, #9333EA, #EC4899)',
    goldGradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
    successGradient: 'linear-gradient(135deg, #4ADE80, #22C55E)',
    errorGradient: 'linear-gradient(135deg, #FF4444, #DC2626)'
  },
  glassmorphism: {
    container: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    strong: {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
    },
    card: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
    }
  },
  fonts: {
    heading: '"Playfair Display", "Georgia", serif',
    body: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif'
  }
};

// Plugin health status component
const PluginHealthBadge = ({ status }) => {
  const statusConfig = {
    healthy: { color: theme.colors.success, icon: CheckCircle, text: 'Healthy' },
    degraded: { color: theme.colors.warning, icon: AlertTriangle, text: 'Degraded' },
    down: { color: theme.colors.error, icon: XCircle, text: 'Down' },
    rateLimited: { color: theme.colors.purple, icon: Zap, text: 'Rate Limited' }
  };

  const config = statusConfig[status] || statusConfig.down;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-1">
      <Icon size={14} style={{ color: config.color }} />
      <span style={{ color: config.color, fontSize: '12px' }}>{config.text}</span>
    </div>
  );
};

// Metric card component
const MetricCard = ({ icon: Icon, label, value, trend, color }) => (
  <div style={theme.glassmorphism.card} className="p-4">
    <div className="flex items-center justify-between mb-2">
      <Icon size={20} style={{ color: color || theme.colors.accent }} />
      {trend !== undefined && (
        <div className="flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp size={16} style={{ color: theme.colors.success }} />
          ) : (
            <TrendingDown size={16} style={{ color: theme.colors.error }} />
          )}
          <span style={{ 
            color: trend > 0 ? theme.colors.success : theme.colors.error,
            fontSize: '12px'
          }}>
            {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
    <div style={{ fontSize: '24px', fontWeight: '600', color: '#fff' }}>{value}</div>
    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{label}</div>
  </div>
);

// Main Customer Dashboard Component
export default function CustomerPluginDashboard() {
  const [activeView, setActiveView] = useState('portfolio');
  const [selectedWorkspace, setSelectedWorkspace] = useState('production');
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [showAPIPlayground, setShowAPIPlayground] = useState(false);

  // Mock data for installed plugins
  const [installedPlugins, setInstalledPlugins] = useState([
    {
      id: 1,
      name: 'GPT Code Reviewer',
      vendor: 'TechCorp Solutions',
      status: 'healthy',
      workspace: 'production',
      version: '2.1.0',
      endpoint: 'code-review',
      metrics: {
        rps: 45,
        latency: 120,
        errorRate: 0.1,
        monthlyUsage: 68,
        cost: 1250
      },
      lastUsed: '2 min ago',
      whiteLabel: true
    },
    {
      id: 2,
      name: 'Document Summarizer Pro',
      vendor: 'AI Labs Inc',
      status: 'degraded',
      workspace: 'production',
      version: '3.0.0',
      endpoint: 'doc-summary',
      metrics: {
        rps: 28,
        latency: 200,
        errorRate: 2.5,
        monthlyUsage: 45,
        cost: 890
      },
      lastUsed: '10 min ago',
      whiteLabel: false
    },
    {
      id: 3,
      name: 'Translation Engine Plus',
      vendor: 'GlobalSpeak',
      status: 'rateLimited',
      workspace: 'development',
      version: '1.5.0',
      endpoint: 'translate',
      metrics: {
        rps: 150,
        latency: 95,
        errorRate: 0.05,
        monthlyUsage: 92,
        cost: 2100
      },
      lastUsed: 'Just now',
      whiteLabel: false
    }
  ]);

  // Mock workspaces
  const workspaces = [
    { id: 'production', name: 'Production', pluginCount: 12, budget: 10000, spent: 6500 },
    { id: 'development', name: 'Development', pluginCount: 8, budget: 5000, spent: 2100 },
    { id: 'customer-support', name: 'Customer Support', pluginCount: 5, budget: 3000, spent: 1800 }
  ];

  // Navigation items
  const navItems = [
    { id: 'portfolio', name: 'Plugin Portfolio', icon: Package },
    { id: 'analytics', name: 'Analytics & Usage', icon: BarChart3 },
    { id: 'gateway', name: 'API Gateway', icon: Router },
    { id: 'workflows', name: 'Workflows', icon: Workflow },
    { id: 'team', name: 'Team & Access', icon: Users },
    { id: 'billing', name: 'Billing & Costs', icon: CreditCard },
    { id: 'marketplace', name: 'Marketplace', icon: ShoppingCart },
    { id: 'support', name: 'Support', icon: HelpCircle }
  ];

  // Plugin Portfolio View
  const PluginPortfolioView = () => {
    const [viewMode, setViewMode] = useState('grid');
    const workspacePlugins = installedPlugins.filter(p => p.workspace === selectedWorkspace);

    return (
      <div>
        {/* Workspace Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
              style={{
                padding: '10px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px'
              }}
            >
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>
                  {ws.name} ({ws.pluginCount} plugins)
                </option>
              ))}
            </select>

            <button style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <Folder size={16} />
              Manage Workspaces
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={{
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>

            <button style={{
              padding: '10px 20px',
              background: theme.gradients.primaryGradient,
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <Plus size={18} />
              Browse Marketplace
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard 
            icon={Activity} 
            label="Total RPS" 
            value="223" 
            trend={12}
            color={theme.colors.accent}
          />
          <MetricCard 
            icon={Gauge} 
            label="Avg Latency" 
            value="138ms" 
            trend={-8}
            color={theme.colors.secondary}
          />
          <MetricCard 
            icon={DollarSign} 
            label="Monthly Cost" 
            value="$4,240" 
            trend={5}
            color={theme.colors.primary}
          />
          <MetricCard 
            icon={AlertCircle} 
            label="Error Rate" 
            value="0.8%" 
            trend={-15}
            color={theme.colors.purple}
          />
        </div>

        {/* Plugin Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
          {workspacePlugins.map(plugin => (
            <div key={plugin.id} 
                 style={theme.glassmorphism.card} 
                 className="p-6">
              {/* Plugin Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {plugin.name}
                    {plugin.whiteLabel && (
                      <Shield size={16} style={{ 
                        display: 'inline-block', 
                        marginLeft: '8px', 
                        color: theme.colors.accent 
                      }} />
                    )}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
                    by {plugin.vendor} • v{plugin.version}
                  </p>
                </div>
                <PluginHealthBadge status={plugin.status} />
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '8px 12px', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>RPS</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{plugin.metrics.rps}</div>
                </div>
                <div style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '8px 12px', 
                  borderRadius: '8px' 
                }}>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Latency</div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>{plugin.metrics.latency}ms</div>
                </div>
              </div>

              {/* Usage Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    Monthly Usage
                  </span>
                  <span style={{ fontSize: '12px', color: '#fff' }}>
                    {plugin.metrics.monthlyUsage}% • ${plugin.metrics.cost}
                  </span>
                </div>
                <div style={{ 
                  height: '6px', 
                  background: 'rgba(255,255,255,0.1)', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${plugin.metrics.monthlyUsage}%`,
                    height: '100%',
                    background: plugin.metrics.monthlyUsage > 80 
                      ? theme.colors.warning 
                      : theme.colors.accent,
                    borderRadius: '3px'
                  }} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Last used {plugin.lastUsed}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPlugin(plugin)}
                    style={{
                      padding: '6px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Configure
                  </button>
                  <button style={{
                    padding: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer'
                  }}>
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Analytics View
  const AnalyticsView = () => {
    const [timeRange, setTimeRange] = useState('24h');

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '24px' }}>
            Usage Analytics & Cost Management
          </h2>
          
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff'
              }}
            >
              <option value="1h">Last Hour</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>

            <button style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Cost Burn Rate Alert */}
        <div style={{
          background: `${theme.colors.warning}20`,
          border: `1px solid ${theme.colors.warning}40`,
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={20} style={{ color: theme.colors.warning }} />
          <div className="flex-1">
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              High Usage Alert
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
              Current burn rate projects $8,420 monthly spend (84% of budget). 
              Translation Engine Plus is consuming 45% of total costs.
            </div>
          </div>
          <button style={{
            padding: '8px 16px',
            background: theme.colors.warning,
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Set Limits
          </button>
        </div>

        {/* Live Request Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div style={theme.glassmorphism.container} className="p-6">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Live Request Feed
            </h3>
            <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} 
                     className="py-2" 
                     style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: theme.colors.accent }}>
                      POST /api/gateway/code-review/analyze
                    </span>
                    <span style={{ color: theme.colors.success }}>200 OK</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                      workspace: production • user: john.doe
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                      {120 + i * 15}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Allocation */}
          <div style={theme.glassmorphism.container} className="p-6">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Cost Allocation by Department
            </h3>
            <div className="space-y-4">
              {[
                { dept: 'Engineering', cost: 2450, percentage: 58 },
                { dept: 'Customer Support', cost: 1100, percentage: 26 },
                { dept: 'Marketing', cost: 520, percentage: 12 },
                { dept: 'Sales', cost: 170, percentage: 4 }
              ].map(dept => (
                <div key={dept.dept}>
                  <div className="flex justify-between mb-2">
                    <span>{dept.dept}</span>
                    <span style={{ fontWeight: '600' }}>${dept.cost}</span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${dept.percentage}%`,
                      height: '100%',
                      background: theme.gradients.accentGradient,
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div style={theme.glassmorphism.container} className="p-6">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Performance Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['P50', 'P95', 'P99'].map(percentile => (
              <div key={percentile} 
                   style={{ 
                     background: 'rgba(255,255,255,0.05)', 
                     padding: '16px', 
                     borderRadius: '8px',
                     textAlign: 'center'
                   }}>
                <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px' }}>
                  {percentile} Latency
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: theme.colors.accent }}>
                  {percentile === 'P50' ? '95' : percentile === 'P95' ? '180' : '420'}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // API Gateway View
  const APIGatewayView = () => {
    const [showExample, setShowExample] = useState('curl');

    return (
      <div>
        <div className="mb-8">
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '24px', marginBottom: '16px' }}>
            Unified API Gateway
          </h2>
          
          <div style={theme.glassmorphism.strong} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Your Gateway Endpoint
                </h3>
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontFamily: 'monospace',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <code style={{ color: theme.colors.accent }}>
                    https://api.your-company.plugins.ai
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText('https://api.your-company.plugins.ai')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.6)',
                      cursor: 'pointer'
                    }}
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowAPIPlayground(true)}
                style={{
                  padding: '10px 20px',
                  background: theme.gradients.primaryGradient,
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Terminal size={18} />
                Open Playground
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <Zap size={20} style={{ color: theme.colors.accent, marginBottom: '8px' }} />
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Auto Load Balancing</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  Requests automatically routed to best performing instances
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <RefreshCw size={20} style={{ color: theme.colors.secondary, marginBottom: '8px' }} />
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Built-in Retry Logic</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  Exponential backoff with configurable retry policies
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
                <Lock size={20} style={{ color: theme.colors.purple, marginBottom: '8px' }} />
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>mTLS Security</div>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  End-to-end encryption with mutual TLS authentication
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SDK Examples */}
        <div style={theme.glassmorphism.container} className="p-6">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Quick Start Examples
          </h3>
          
          <div className="flex gap-2 mb-4">
            {['curl', 'javascript', 'python', 'go'].map(lang => (
              <button
                key={lang}
                onClick={() => setShowExample(lang)}
                style={{
                  padding: '6px 16px',
                  background: showExample === lang ? theme.colors.primary + '20' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${showExample === lang ? theme.colors.primary : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '6px',
                  color: showExample === lang ? theme.colors.primary : '#fff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </button>
            ))}
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.5)',
            padding: '16px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            overflow: 'auto'
          }}>
            {showExample === 'curl' && (
              <pre style={{ color: theme.colors.accent }}>{`curl -X POST https://api.your-company.plugins.ai/code-review/analyze \\
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
  }'`}</pre>
            )}
            {showExample === 'javascript' && (
              <pre style={{ color: theme.colors.accent }}>{`import { PluginClient } from '@your-company/plugin-sdk';

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

console.log(result.summary);`}</pre>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Workflow Builder View
  const WorkflowBuilderView = () => {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '24px' }}>
            Intelligent Plugin Orchestration
          </h2>
          
          <button
            onClick={() => setShowWorkflowBuilder(true)}
            style={{
              padding: '10px 20px',
              background: theme.gradients.primaryGradient,
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            Create Workflow
          </button>
        </div>

        {/* Existing Workflows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            {
              name: 'Customer Feedback Pipeline',
              description: 'Analyze support tickets → Extract sentiment → Translate if needed → Summarize',
              plugins: ['sentiment-analyzer', 'translation-engine', 'doc-summarizer'],
              status: 'active',
              runs: 342,
              lastRun: '5 min ago'
            },
            {
              name: 'Code Review Automation',
              description: 'Review PR → Check security → Generate summary → Post comment',
              plugins: ['code-reviewer', 'security-scanner', 'github-commenter'],
              status: 'active',
              runs: 128,
              lastRun: '1 hour ago'
            }
          ].map((workflow, i) => (
            <div key={i} style={theme.glassmorphism.card} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                    {workflow.name}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                    {workflow.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: theme.colors.success
                  }} />
                  <span style={{ fontSize: '12px', color: theme.colors.success }}>Active</span>
                </div>
              </div>

              {/* Workflow Steps */}
              <div className="flex items-center gap-2 mb-4">
                {workflow.plugins.map((plugin, idx) => (
                  <React.Fragment key={plugin}>
                    <div style={{
                      padding: '4px 12px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      {plugin}
                    </div>
                    {idx < workflow.plugins.length - 1 && (
                      <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.4)' }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {workflow.runs} runs
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Last: {workflow.lastRun}
                  </span>
                </div>
                <button style={{
                  padding: '6px 16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}>
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Builder Preview */}
        <div style={theme.glassmorphism.container} className="p-6 mt-6">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            Visual Workflow Builder
          </h3>
          <div style={{
            height: '300px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed rgba(255,255,255,0.2)'
          }}>
            <div className="text-center">
              <Workflow size={48} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }} />
              <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                Drag and drop plugins to create workflows
              </p>
              <button
                onClick={() => setShowWorkflowBuilder(true)}
                style={{
                  marginTop: '16px',
                  padding: '8px 20px',
                  background: theme.colors.secondary,
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                Open Builder
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Team Management View
  const TeamManagementView = () => {
    const teamMembers = [
      { name: 'John Doe', email: 'john@company.com', role: 'Admin', plugins: 'All', lastActive: '2 min ago' },
      { name: 'Jane Smith', email: 'jane@company.com', role: 'Developer', plugins: 'Code Review, Testing', lastActive: '1 hour ago' },
      { name: 'Mike Johnson', email: 'mike@company.com', role: 'Analyst', plugins: 'Analytics Only', lastActive: '3 hours ago' },
      { name: 'Sarah Williams', email: 'sarah@company.com', role: 'Billing', plugins: 'None', lastActive: '1 day ago' }
    ];

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '24px' }}>
            Team & Access Management
          </h2>
          
          <button style={{
            padding: '10px 20px',
            background: theme.gradients.primaryGradient,
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}>
            <Plus size={18} />
            Invite Member
          </button>
        </div>

        {/* SSO Configuration */}
        <div style={theme.glassmorphism.card} className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>
                Single Sign-On (SSO)
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                Configure SAML 2.0 with your identity provider
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.colors.success
                }} />
                <span style={{ fontSize: '14px', color: theme.colors.success }}>
                  Active with Okta
                </span>
              </div>
              <button style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                color: '#fff',
                cursor: 'pointer'
              }}>
                Configure
              </button>
            </div>
          </div>
        </div>

        {/* Team Members Table */}
        <div style={theme.glassmorphism.container} className="overflow-hidden">
          <table style={{ width: '100%' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Member</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Plugin Access</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Last Active</th>
                <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '16px' }}>
                    <div>
                      <div style={{ fontWeight: '500' }}>{member.name}</div>
                      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                        {member.email}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      background: member.role === 'Admin' 
                        ? theme.colors.purple + '20' 
                        : 'rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '14px',
                      color: member.role === 'Admin' ? theme.colors.purple : '#fff'
                    }}>
                      {member.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>{member.plugins}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    {member.lastActive}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <button style={{
                      padding: '6px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '6px',
                      color: 'rgba(255,255,255,0.6)',
                      cursor: 'pointer'
                    }}>
                      <Settings size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* API Keys */}
        <div style={theme.glassmorphism.container} className="p-6 mt-6">
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            API Keys
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Production API Key', created: '2024-01-15', lastUsed: 'Today', scopes: 'All plugins' },
              { name: 'Development API Key', created: '2024-02-01', lastUsed: '3 days ago', scopes: 'Dev workspace only' }
            ].map((key, i) => (
              <div key={i} 
                   style={{ 
                     background: 'rgba(255,255,255,0.05)', 
                     padding: '16px', 
                     borderRadius: '8px',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'space-between'
                   }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>{key.name}</div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    Created {key.created} • Last used {key.lastUsed} • {key.scopes}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    Regenerate
                  </button>
                  <button style={{
                    padding: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    color: theme.colors.error,
                    cursor: 'pointer'
                  }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.colors.background,
      color: '#fff',
      fontFamily: theme.fonts.body
    }}>
      {/* Header */}
      <header style={{ ...theme.glassmorphism.container, borderRadius: 0 }}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: theme.gradients.multiGradient,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={24} color="#fff" />
                </div>
                <div>
                  <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '24px' }}>
                    Plugin Control Center
                  </h1>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
                    Your Company, Inc.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <DollarSign size={16} />
                <span>Budget: $6,500 / $10,000</span>
              </div>
              
              <button style={{
                padding: '8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <MessageCircle size={20} />
              </button>
              
              <button style={{
                padding: '8px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside style={{
          width: '240px',
          height: 'calc(100vh - 73px)',
          background: theme.colors.surface,
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          <nav className="p-4">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '4px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          {activeView === 'portfolio' && <PluginPortfolioView />}
          {activeView === 'analytics' && <AnalyticsView />}
          {activeView === 'gateway' && <APIGatewayView />}
          {activeView === 'workflows' && <WorkflowBuilderView />}
          {activeView === 'team' && <TeamManagementView />}
          {activeView === 'billing' && (
            <div style={theme.glassmorphism.container} className="p-8 text-center">
              <Receipt size={48} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Billing & Invoices</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Manage your subscription, view invoices, and update payment methods
              </p>
            </div>
          )}
          {activeView === 'marketplace' && (
            <div style={theme.glassmorphism.container} className="p-8 text-center">
              <ShoppingCart size={48} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Browse Marketplace</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Discover new plugins to enhance your workflow
              </p>
            </div>
          )}
          {activeView === 'support' && (
            <div style={theme.glassmorphism.container} className="p-8 text-center">
              <HelpCircle size={48} style={{ color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Support Center</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Get help from our team and plugin developers
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}