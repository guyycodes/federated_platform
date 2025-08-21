// import React, { useState, useEffect } from 'react';
// import { 
//   Package, 
//   GitBranch, 
//   Upload,
//   Search,
//   Filter,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Play,
//   RefreshCw,
//   Globe,
//   Shield,
//   Star,
//   Users,
//   DollarSign,
//   Building2,
//   Zap,
//   Code,
//   Terminal,
//   ExternalLink,
//   Copy,
//   Settings,
//   MoreVertical,
//   TrendingUp,
//   Eye,
//   Lock,
//   Award,
//   Layers,
//   ArrowLeft,
//   Download,
//   RotateCcw,
//   Trash2,
//   ChevronDown,
//   Plus,
//   Tag,
//   BarChart3,
//   Activity,
//   Cpu,
//   Info,
//   Crown,
//   Heart
// } from 'lucide-react';

// // Theme configuration (matching your provided theme)
// const theme = {
//   colors: {
//     primary: '#F6511E',
//     accent: '#00FFFF',
//     secondary: '#3B82F6',
//     background: '#1E1E22',
//     surface: '#2A2A2E',
//     purple: '#9333EA',
//     pink: '#EC4899',
//     darkOrange: '#902F12',
//     lightBlue: '#1A6DED',
//     glassWhite: 'rgba(255,255,255,0.1)',
//     glassBlack: 'rgba(0,0,0,0.3)'
//   },
//   gradients: {
//     darkGlass: 'linear-gradient(135deg, #1E1E22, #2A2A2E)',
//     primaryGradient: 'linear-gradient(135deg, #F6511E, #902F12)',
//     accentGradient: 'linear-gradient(90deg, #00FFFF, #1A6DED)',
//     multiGradient: 'linear-gradient(135deg, #3B82F6, #9333EA, #EC4899)',
//     goldGradient: 'linear-gradient(135deg, #FFD700, #FFA500)',
//     heroOverlay: 'linear-gradient(135deg, rgba(246, 81, 30, 0.8), rgba(59, 130, 246, 0.6), rgba(147, 51, 234, 0.7))'
//   },
//   glassmorphism: {
//     container: {
//       background: 'rgba(255, 255, 255, 0.05)',
//       backdropFilter: 'blur(10px)',
//       borderRadius: '16px',
//       border: '1px solid rgba(255, 255, 255, 0.1)',
//     },
//     strong: {
//       background: 'rgba(255, 255, 255, 0.15)',
//       backdropFilter: 'blur(20px)',
//       border: '1px solid rgba(255, 255, 255, 0.3)',
//       borderRadius: '12px',
//     },
//     card: {
//       background: 'rgba(255, 255, 255, 0.1)',
//       backdropFilter: 'blur(15px)',
//       border: '1px solid rgba(255, 255, 255, 0.2)',
//       borderRadius: '12px',
//     }
//   },
//   fonts: {
//     heading: '"Playfair Display", "Georgia", serif',
//     body: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif'
//   }
// };

// // Plugin status types
// const PLUGIN_STATUS = {
//   PENDING: 'pending',
//   APPROVED: 'approved',
//   REJECTED: 'rejected',
//   DEPLOYING: 'deploying',
//   LIVE: 'live',
//   FAILED: 'failed'
// };

// // Badge component
// const Badge = ({ type, children }) => {
//   const badgeStyles = {
//     enterprise: {
//       background: theme.gradients.goldGradient,
//       color: '#000',
//       icon: Building2
//     },
//     whiteLabel: {
//       background: 'rgba(255,255,255,0.2)',
//       color: '#fff',
//       icon: Shield
//     },
//     community: {
//       background: `${theme.colors.accent}30`,
//       color: theme.colors.accent,
//       icon: Heart
//     },
//     vetted: {
//       background: `${theme.colors.secondary}30`,
//       color: theme.colors.secondary,
//       icon: CheckCircle
//     }
//   };

//   const style = badgeStyles[type] || badgeStyles.community;
//   const Icon = style.icon;

//   return (
//     <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
//           style={{ background: style.background, color: style.color }}>
//       <Icon size={12} />
//       {children}
//     </span>
//   );
// };

// // Status indicator component
// const StatusIndicator = ({ status }) => {
//   const statusConfig = {
//     [PLUGIN_STATUS.PENDING]: { icon: Clock, color: '#FFA500', text: 'Pending Review' },
//     [PLUGIN_STATUS.APPROVED]: { icon: CheckCircle, color: theme.colors.secondary, text: 'Approved' },
//     [PLUGIN_STATUS.REJECTED]: { icon: XCircle, color: '#FF4444', text: 'Rejected' },
//     [PLUGIN_STATUS.DEPLOYING]: { icon: RefreshCw, color: theme.colors.accent, text: 'Deploying', animate: true },
//     [PLUGIN_STATUS.LIVE]: { icon: CheckCircle, color: theme.colors.accent, text: 'Live' },
//     [PLUGIN_STATUS.FAILED]: { icon: AlertCircle, color: '#FF4444', text: 'Failed' }
//   };

//   const config = statusConfig[status];
//   const Icon = config.icon;

//   return (
//     <div className="flex items-center gap-2">
//       <Icon size={16} 
//             style={{ color: config.color }} 
//             className={config.animate ? 'animate-spin' : ''} />
//       <span style={{ color: config.color, fontSize: '14px' }}>{config.text}</span>
//     </div>
//   );
// };

// // Main Plugin Marketplace Component
// export default function PluginMarketplaceDashboard() {
//   const [activeView, setActiveView] = useState('catalog');
//   const [selectedPlugin, setSelectedPlugin] = useState(null);
//   const [showNewPluginModal, setShowNewPluginModal] = useState(false);
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isAdminMode, setIsAdminMode] = useState(false);
//   const [showVettedOnly, setShowVettedOnly] = useState(false);

//   // Mock plugins data
//   const [plugins, setPlugins] = useState([
//     {
//       id: 1,
//       name: 'GPT Code Reviewer',
//       slug: 'gpt-code-reviewer',
//       developer: 'TechCorp Solutions',
//       developerLogo: '🚀',
//       description: 'AI-powered code review assistant that analyzes pull requests',
//       category: 'development',
//       status: PLUGIN_STATUS.LIVE,
//       version: '2.1.0',
//       versions: ['2.1.0', '2.0.0', '1.5.0'],
//       endpoint: 'https://v2.gpt-code-reviewer.plugins.ai',
//       badges: ['enterprise', 'vetted'],
//       metrics: { requests: '45.2k', latency: '120ms', uptime: '99.9%' },
//       pricing: { model: 'revenue-share', percentage: 20 },
//       whiteLabel: true,
//       installs: 1250,
//       rating: 4.8,
//       lastUpdated: '2 days ago'
//     },
//     {
//       id: 2,
//       name: 'Document Summarizer Pro',
//       slug: 'doc-summarizer-pro',
//       developer: 'AI Labs Inc',
//       developerLogo: '📄',
//       description: 'Advanced document summarization with multiple languages',
//       category: 'productivity',
//       status: PLUGIN_STATUS.LIVE,
//       version: '3.0.0',
//       versions: ['3.0.0', '2.5.0', '2.0.0'],
//       endpoint: 'https://v3.doc-summarizer-pro.plugins.ai',
//       badges: ['whiteLabel', 'community'],
//       metrics: { requests: '28.5k', latency: '200ms', uptime: '98.5%' },
//       pricing: { model: 'flat-fee', amount: 99 },
//       whiteLabel: true,
//       installs: 892,
//       rating: 4.6,
//       lastUpdated: '1 week ago'
//     },
//     {
//       id: 3,
//       name: 'Sentiment Analyzer',
//       slug: 'sentiment-analyzer',
//       developer: 'EmotiTech',
//       developerLogo: '😊',
//       description: 'Real-time sentiment analysis for customer feedback',
//       category: 'analytics',
//       status: PLUGIN_STATUS.PENDING,
//       version: '1.0.0',
//       versions: ['1.0.0'],
//       endpoint: null,
//       badges: [],
//       metrics: { requests: '0', latency: '0ms', uptime: '0%' },
//       pricing: { model: 'freemium', freeRequests: 1000 },
//       whiteLabel: false,
//       installs: 0,
//       rating: 0,
//       lastUpdated: 'Just now'
//     },
//     {
//       id: 4,
//       name: 'Translation Engine Plus',
//       slug: 'translation-engine-plus',
//       developer: 'GlobalSpeak',
//       developerLogo: '🌍',
//       description: 'Neural translation supporting 100+ languages',
//       category: 'language',
//       status: PLUGIN_STATUS.DEPLOYING,
//       version: '1.5.0',
//       versions: ['1.5.0', '1.0.0'],
//       endpoint: null,
//       badges: ['vetted'],
//       metrics: { requests: '0', latency: '0ms', uptime: '0%' },
//       pricing: { model: 'usage-based', pricePerRequest: 0.001 },
//       whiteLabel: false,
//       installs: 567,
//       rating: 4.7,
//       lastUpdated: '5 minutes ago'
//     }
//   ]);

//   const categories = [
//     { id: 'all', name: 'All Plugins', icon: Package },
//     { id: 'development', name: 'Development', icon: Code },
//     { id: 'productivity', name: 'Productivity', icon: Zap },
//     { id: 'analytics', name: 'Analytics', icon: BarChart3 },
//     { id: 'language', name: 'Language', icon: Globe }
//   ];

//   // Filter plugins based on search and category
//   const filteredPlugins = plugins.filter(plugin => {
//     const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = filterCategory === 'all' || plugin.category === filterCategory;
//     const matchesVetted = !showVettedOnly || plugin.badges.includes('vetted');
//     return matchesSearch && matchesCategory && matchesVetted;
//   });

//   // New Plugin Modal
//   const NewPluginModal = () => {
//     const [formData, setFormData] = useState({
//       name: '',
//       description: '',
//       gitRepo: '',
//       category: 'development',
//       version: '1.0.0',
//       pricing: 'revenue-share',
//       revenueShare: 20,
//       whiteLabel: false
//     });

//     const handleSubmit = () => {
//       // Simulate plugin submission
//       const newPlugin = {
//         id: plugins.length + 1,
//         name: formData.name,
//         slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
//         developer: 'Your Company',
//         developerLogo: '🆕',
//         description: formData.description,
//         category: formData.category,
//         status: PLUGIN_STATUS.PENDING,
//         version: formData.version,
//         versions: [formData.version],
//         endpoint: null,
//         badges: [],
//         metrics: { requests: '0', latency: '0ms', uptime: '0%' },
//         pricing: { 
//           model: formData.pricing, 
//           percentage: formData.revenueShare 
//         },
//         whiteLabel: formData.whiteLabel,
//         installs: 0,
//         rating: 0,
//         lastUpdated: 'Just now'
//       };

//       setPlugins([...plugins, newPlugin]);
//       setShowNewPluginModal(false);

//       // Simulate deployment after 3 seconds
//       setTimeout(() => {
//         setPlugins(prev => prev.map(p => 
//           p.id === newPlugin.id 
//             ? { ...p, status: PLUGIN_STATUS.DEPLOYING }
//             : p
//         ));

//         // Simulate successful deployment after 5 more seconds
//         setTimeout(() => {
//           setPlugins(prev => prev.map(p => 
//             p.id === newPlugin.id 
//               ? { 
//                   ...p, 
//                   status: PLUGIN_STATUS.APPROVED,
//                   endpoint: `https://v1.${p.slug}.plugins.ai`
//                 }
//               : p
//           ));
//         }, 5000);
//       }, 3000);
//     };

//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
//            style={{ background: 'rgba(0,0,0,0.8)' }}>
//         <div style={{ ...theme.glassmorphism.strong, width: '600px', maxHeight: '90vh', overflow: 'auto' }}
//              className="p-8">
//           <h2 style={{ fontFamily: theme.fonts.heading, fontSize: '28px', color: '#fff', marginBottom: '24px' }}>
//             Submit New Plugin
//           </h2>

//           {/* Scarcity Notice */}
//           <div style={{
//             background: `${theme.colors.accent}20`,
//             border: `1px solid ${theme.colors.accent}40`,
//             borderRadius: '8px',
//             padding: '12px',
//             marginBottom: '24px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//           }}>
//             <Info size={16} style={{ color: theme.colors.accent }} />
//             <span style={{ color: theme.colors.accent, fontSize: '14px' }}>
//               Only 5 new plugins accepted this week. 3 slots remaining.
//             </span>
//           </div>

//           {/* Form Fields */}
//           <div className="space-y-6">
//             {/* Plugin Name */}
//             <div>
//               <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
//                 Plugin Name
//               </label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   background: 'rgba(255,255,255,0.1)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   borderRadius: '8px',
//                   color: '#fff',
//                   fontSize: '16px'
//                 }}
//                 placeholder="e.g., GPT Code Reviewer"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
//                 Description
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   background: 'rgba(255,255,255,0.1)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   borderRadius: '8px',
//                   color: '#fff',
//                   fontSize: '16px',
//                   minHeight: '80px',
//                   resize: 'vertical'
//                 }}
//                 placeholder="Brief description of your plugin's functionality"
//               />
//             </div>

//             {/* Git Repository */}
//             <div>
//               <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
//                 Git Repository URL
//               </label>
//               <input
//                 type="text"
//                 value={formData.gitRepo}
//                 onChange={(e) => setFormData({ ...formData, gitRepo: e.target.value })}
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   background: 'rgba(255,255,255,0.1)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   borderRadius: '8px',
//                   color: '#fff',
//                   fontSize: '16px'
//                 }}
//                 placeholder="https://github.com/yourusername/plugin-repo"
//               />
//             </div>

//             {/* Category & Version */}
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
//                   Category
//                 </label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     background: 'rgba(255,255,255,0.1)',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     borderRadius: '8px',
//                     color: '#fff',
//                     fontSize: '16px'
//                   }}
//                 >
//                   <option value="development">Development</option>
//                   <option value="productivity">Productivity</option>
//                   <option value="analytics">Analytics</option>
//                   <option value="language">Language</option>
//                 </select>
//               </div>

//               <div>
//                 <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
//                   Initial Version
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.version}
//                   onChange={(e) => setFormData({ ...formData, version: e.target.value })}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px',
//                     background: 'rgba(255,255,255,0.1)',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     borderRadius: '8px',
//                     color: '#fff',
//                     fontSize: '16px'
//                   }}
//                   placeholder="1.0.0"
//                 />
//               </div>
//             </div>

//             {/* Pricing Model */}
//             <div>
//               <label style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
//                 Pricing Model
//               </label>
//               <div className="space-y-3">
//                 <label className="flex items-center gap-3">
//                   <input
//                     type="radio"
//                     name="pricing"
//                     value="revenue-share"
//                     checked={formData.pricing === 'revenue-share'}
//                     onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
//                   />
//                   <span style={{ color: '#fff' }}>Revenue Share (20% platform fee)</span>
//                 </label>
//                 <label className="flex items-center gap-3">
//                   <input
//                     type="radio"
//                     name="pricing"
//                     value="flat-fee"
//                     checked={formData.pricing === 'flat-fee'}
//                     onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
//                   />
//                   <span style={{ color: '#fff' }}>Flat Monthly Fee</span>
//                 </label>
//                 <label className="flex items-center gap-3">
//                   <input
//                     type="radio"
//                     name="pricing"
//                     value="usage-based"
//                     checked={formData.pricing === 'usage-based'}
//                     onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
//                   />
//                   <span style={{ color: '#fff' }}>Usage-Based (per request)</span>
//                 </label>
//               </div>
//             </div>

//             {/* White Label Option */}
//             <div>
//               <label className="flex items-center gap-3">
//                 <input
//                   type="checkbox"
//                   checked={formData.whiteLabel}
//                   onChange={(e) => setFormData({ ...formData, whiteLabel: e.target.checked })}
//                 />
//                 <span style={{ color: '#fff' }}>Enable White-Label for Enterprise</span>
//               </label>
//               <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
//                 Allow enterprise customers to rebrand your plugin
//               </p>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4 mt-8">
//             <button
//               onClick={handleSubmit}
//               style={{
//                 flex: 1,
//                 padding: '12px',
//                 background: theme.gradients.primaryGradient,
//                 border: 'none',
//                 borderRadius: '8px',
//                 color: '#fff',
//                 fontWeight: '600',
//                 cursor: 'pointer'
//               }}
//             >
//               Submit for Review
//             </button>
//             <button
//               onClick={() => setShowNewPluginModal(false)}
//               style={{
//                 flex: 1,
//                 padding: '12px',
//                 background: 'rgba(255,255,255,0.1)',
//                 border: '1px solid rgba(255,255,255,0.2)',
//                 borderRadius: '8px',
//                 color: '#fff',
//                 cursor: 'pointer'
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Plugin Detail View
//   const PluginDetailView = ({ plugin }) => {
//     const [selectedVersion, setSelectedVersion] = useState(plugin.version);
//     const [showApiExample, setShowApiExample] = useState(false);

//     return (
//       <div>
//         {/* Back Button */}
//         <button
//           onClick={() => setSelectedPlugin(null)}
//           style={{
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px',
//             padding: '8px 16px',
//             background: 'rgba(255,255,255,0.1)',
//             border: '1px solid rgba(255,255,255,0.2)',
//             borderRadius: '8px',
//             color: '#fff',
//             marginBottom: '24px',
//             cursor: 'pointer'
//           }}
//         >
//           <ArrowLeft size={16} />
//           Back to Catalog
//         </button>

//         {/* Plugin Header */}
//         <div style={theme.glassmorphism.card} className="p-8 mb-6">
//           <div className="flex items-start justify-between">
//             <div className="flex items-start gap-6">
//               <div style={{
//                 width: '80px',
//                 height: '80px',
//                 background: theme.gradients.multiGradient,
//                 borderRadius: '20px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 fontSize: '36px'
//               }}>
//                 {plugin.developerLogo}
//               </div>
              
//               <div>
//                 <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '32px', color: '#fff', marginBottom: '8px' }}>
//                   {plugin.name}
//                 </h1>
//                 <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '12px' }}>
//                   {plugin.description}
//                 </p>
//                 <div className="flex items-center gap-4">
//                   <span style={{ color: 'rgba(255,255,255,0.6)' }}>by {plugin.developer}</span>
//                   <StatusIndicator status={plugin.status} />
//                   <div className="flex gap-2">
//                     {plugin.badges.map(badge => (
//                       <Badge key={badge} type={badge}>
//                         {badge.charAt(0).toUpperCase() + badge.slice(1).replace(/([A-Z])/g, ' $1')}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col gap-3">
//               {plugin.status === PLUGIN_STATUS.LIVE && (
//                 <button style={{
//                   padding: '10px 24px',
//                   background: theme.gradients.accentGradient,
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: '#000',
//                   fontWeight: '600',
//                   cursor: 'pointer'
//                 }}>
//                   Install Plugin
//                 </button>
//               )}
              
//               {isAdminMode && (
//                 <>
//                   {plugin.status === PLUGIN_STATUS.PENDING && (
//                     <>
//                       <button style={{
//                         padding: '10px 24px',
//                         background: theme.colors.accent,
//                         border: 'none',
//                         borderRadius: '8px',
//                         color: '#000',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                       }}
//                       onClick={() => {
//                         setPlugins(prev => prev.map(p => 
//                           p.id === plugin.id 
//                             ? { ...p, status: PLUGIN_STATUS.APPROVED }
//                             : p
//                         ));
//                       }}>
//                         Approve
//                       </button>
//                       <button style={{
//                         padding: '10px 24px',
//                         background: '#FF4444',
//                         border: 'none',
//                         borderRadius: '8px',
//                         color: '#fff',
//                         fontWeight: '600',
//                         cursor: 'pointer'
//                       }}>
//                         Reject
//                       </button>
//                     </>
//                   )}
                  
//                   {plugin.status === PLUGIN_STATUS.LIVE && (
//                     <button style={{
//                       padding: '10px 24px',
//                       background: 'rgba(255,255,255,0.1)',
//                       border: '1px solid rgba(255,255,255,0.2)',
//                       borderRadius: '8px',
//                       color: '#fff',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px'
//                     }}>
//                       <RotateCcw size={16} />
//                       Rollback
//                     </button>
//                   )}
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Metrics and API Info */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//           {/* Live Metrics */}
//           <div style={theme.glassmorphism.container} className="p-6">
//             <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>
//               Live Metrics
//             </h3>
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span style={{ color: 'rgba(255,255,255,0.7)' }}>API Requests</span>
//                 <span style={{ fontSize: '20px', fontWeight: '600', color: theme.colors.accent }}>
//                   {plugin.metrics.requests}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span style={{ color: 'rgba(255,255,255,0.7)' }}>Avg Latency</span>
//                 <span style={{ fontSize: '20px', fontWeight: '600', color: theme.colors.secondary }}>
//                   {plugin.metrics.latency}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span style={{ color: 'rgba(255,255,255,0.7)' }}>Uptime</span>
//                 <span style={{ fontSize: '20px', fontWeight: '600', color: '#4ADE80' }}>
//                   {plugin.metrics.uptime}
//                 </span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span style={{ color: 'rgba(255,255,255,0.7)' }}>Total Installs</span>
//                 <span style={{ fontSize: '20px', fontWeight: '600' }}>
//                   {plugin.installs.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* API Endpoint */}
//           <div style={theme.glassmorphism.container} className="p-6">
//             <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>
//               API Endpoint
//             </h3>
            
//             {plugin.endpoint ? (
//               <>
//                 <div style={{
//                   background: 'rgba(0,0,0,0.3)',
//                   padding: '12px',
//                   borderRadius: '8px',
//                   marginBottom: '16px',
//                   fontFamily: 'monospace',
//                   fontSize: '14px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'space-between'
//                 }}>
//                   <span style={{ color: theme.colors.accent }}>
//                     {plugin.endpoint}
//                   </span>
//                   <button
//                     onClick={() => navigator.clipboard.writeText(plugin.endpoint)}
//                     style={{
//                       background: 'none',
//                       border: 'none',
//                       color: 'rgba(255,255,255,0.6)',
//                       cursor: 'pointer'
//                     }}
//                   >
//                     <Copy size={16} />
//                   </button>
//                 </div>

//                 <button
//                   onClick={() => setShowApiExample(!showApiExample)}
//                   style={{
//                     width: '100%',
//                     padding: '10px',
//                     background: 'rgba(255,255,255,0.1)',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     borderRadius: '8px',
//                     color: '#fff',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     gap: '8px'
//                   }}
//                 >
//                   <Code size={16} />
//                   {showApiExample ? 'Hide' : 'Show'} API Example
//                 </button>

//                 {showApiExample && (
//                   <div style={{
//                     background: 'rgba(0,0,0,0.5)',
//                     padding: '16px',
//                     borderRadius: '8px',
//                     marginTop: '16px',
//                     fontFamily: 'monospace',
//                     fontSize: '12px',
//                     color: theme.colors.accent,
//                     overflow: 'auto'
//                   }}>
//                     <pre>{`curl -X POST ${plugin.endpoint}/api/v1/analyze \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "text": "Your input text here",
//     "options": {
//       "language": "en",
//       "format": "json"
//     }
//   }'`}</pre>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p style={{ color: 'rgba(255,255,255,0.6)' }}>
//                 Endpoint will be available once the plugin is deployed.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Version Control */}
//         <div style={theme.glassmorphism.container} className="p-6">
//           <h3 style={{ fontSize: '20px', marginBottom: '16px', fontWeight: '600' }}>
//             Version Control
//           </h3>
//           <div className="flex items-center gap-4">
//             <select
//               value={selectedVersion}
//               onChange={(e) => setSelectedVersion(e.target.value)}
//               style={{
//                 padding: '10px 16px',
//                 background: 'rgba(255,255,255,0.1)',
//                 border: '1px solid rgba(255,255,255,0.2)',
//                 borderRadius: '8px',
//                 color: '#fff',
//                 fontSize: '16px'
//               }}
//             >
//               {plugin.versions.map(version => (
//                 <option key={version} value={version}>
//                   v{version} {version === plugin.version && '(current)'}
//                 </option>
//               ))}
//             </select>

//             {selectedVersion !== plugin.version && (
//               <button style={{
//                 padding: '10px 20px',
//                 background: theme.colors.secondary,
//                 border: 'none',
//                 borderRadius: '8px',
//                 color: '#fff',
//                 fontWeight: '600',
//                 cursor: 'pointer'
//               }}>
//                 Deploy v{selectedVersion}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div style={{ 
//       minHeight: '100vh', 
//       background: theme.colors.background,
//       color: '#fff',
//       fontFamily: theme.fonts.body
//     }}>
//       {/* Header */}
//       <header style={{ ...theme.glassmorphism.container, borderRadius: 0 }}>
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-3">
//                 <div style={{ 
//                   width: '40px', 
//                   height: '40px', 
//                   background: theme.gradients.multiGradient,
//                   borderRadius: '10px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center'
//                 }}>
//                   <Layers size={24} color="#fff" />
//                 </div>
//                 <h1 style={{ fontFamily: theme.fonts.heading, fontSize: '24px' }}>
//                   Plugin Marketplace
//                 </h1>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <button
//                 onClick={() => setIsAdminMode(!isAdminMode)}
//                 style={{
//                   padding: '8px 16px',
//                   background: isAdminMode ? theme.colors.purple : 'rgba(255,255,255,0.1)',
//                   border: '1px solid rgba(255,255,255,0.2)',
//                   borderRadius: '8px',
//                   color: '#fff',
//                   cursor: 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}
//               >
//                 <Shield size={16} />
//                 Admin Mode
//               </button>
              
//               <button
//                 onClick={() => setShowNewPluginModal(true)}
//                 style={{
//                   padding: '10px 20px',
//                   background: theme.gradients.primaryGradient,
//                   border: 'none',
//                   borderRadius: '8px',
//                   color: '#fff',
//                   fontWeight: '600',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                   cursor: 'pointer'
//                 }}
//               >
//                 <Plus size={18} />
//                 Submit Plugin
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Competitive Positioning Banner */}
//       <div style={{
//         background: theme.gradients.heroOverlay,
//         padding: '24px'
//       }}>
//         <div className="max-w-7xl mx-auto">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
//                 The Only Plugin Marketplace with True Independence
//               </h2>
//               <p style={{ color: 'rgba(255,255,255,0.9)' }}>
//                 Unlike Hugging Face (no custom domains), OpenAI Store (centralized), or LangChain Hub (code-only) — 
//                 we give you full control with isolated subdomains, white-label options, and instant deployment.
//               </p>
//             </div>
//             <div style={{
//               background: 'rgba(255,255,255,0.2)',
//               padding: '16px 24px',
//               borderRadius: '8px',
//               textAlign: 'center'
//             }}>
//               <div style={{ fontSize: '24px', fontWeight: '700' }}>3/5</div>
//               <div style={{ fontSize: '14px', opacity: 0.9 }}>Slots Available</div>
//               <div style={{ fontSize: '12px', opacity: 0.7 }}>This Week</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 py-8">
//         {selectedPlugin ? (
//           <PluginDetailView plugin={selectedPlugin} />
//         ) : (
//           <>
//             {/* Search and Filters */}
//             <div className="flex flex-col lg:flex-row gap-4 mb-8">
//               <div className="flex-1 relative">
//                 <Search size={20} style={{
//                   position: 'absolute',
//                   left: '16px',
//                   top: '50%',
//                   transform: 'translateY(-50%)',
//                   color: 'rgba(255,255,255,0.5)'
//                 }} />
//                 <input
//                   type="text"
//                   placeholder="Search plugins..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   style={{
//                     width: '100%',
//                     padding: '12px 16px 12px 48px',
//                     background: 'rgba(255,255,255,0.1)',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     borderRadius: '8px',
//                     color: '#fff',
//                     fontSize: '16px'
//                   }}
//                 />
//               </div>

//               <div className="flex gap-4">
//                 <button
//                   onClick={() => setShowVettedOnly(!showVettedOnly)}
//                   style={{
//                     padding: '12px 24px',
//                     background: showVettedOnly ? theme.colors.secondary : 'rgba(255,255,255,0.1)',
//                     border: '1px solid rgba(255,255,255,0.2)',
//                     borderRadius: '8px',
//                     color: '#fff',
//                     cursor: 'pointer',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px'
//                   }}
//                 >
//                   <Award size={18} />
//                   Vetted Only
//                 </button>
//               </div>
//             </div>

//             {/* Category Tabs */}
//             <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
//               {categories.map(category => {
//                 const Icon = category.icon;
//                 const isActive = filterCategory === category.id;
                
//                 return (
//                   <button
//                     key={category.id}
//                     onClick={() => setFilterCategory(category.id)}
//                     style={{
//                       padding: '10px 20px',
//                       background: isActive ? theme.colors.primary + '20' : 'rgba(255,255,255,0.05)',
//                       border: `1px solid ${isActive ? theme.colors.primary : 'rgba(255,255,255,0.1)'}`,
//                       borderRadius: '8px',
//                       color: isActive ? theme.colors.primary : '#fff',
//                       cursor: 'pointer',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       whiteSpace: 'nowrap'
//                     }}
//                   >
//                     <Icon size={18} />
//                     {category.name}
//                   </button>
//                 );
//               })}
//             </div>

//             {/* Plugin Grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {filteredPlugins.map(plugin => (
//                 <div key={plugin.id} 
//                      style={theme.glassmorphism.card} 
//                      className="p-6 cursor-pointer hover:scale-[1.02] transition-transform"
//                      onClick={() => setSelectedPlugin(plugin)}>
//                   <div className="flex items-start justify-between mb-4">
//                     <div className="flex items-start gap-4">
//                       <div style={{
//                         width: '56px',
//                         height: '56px',
//                         background: theme.gradients.accentGradient,
//                         borderRadius: '12px',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center',
//                         fontSize: '24px'
//                       }}>
//                         {plugin.developerLogo}
//                       </div>
                      
//                       <div className="flex-1">
//                         <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
//                           {plugin.name}
//                         </h3>
//                         <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>
//                           {plugin.description}
//                         </p>
//                         <div className="flex items-center gap-4 text-sm">
//                           <span style={{ color: 'rgba(255,255,255,0.6)' }}>
//                             by {plugin.developer}
//                           </span>
//                           <div className="flex items-center gap-1">
//                             <Star size={14} style={{ color: '#FFD700' }} />
//                             <span>{plugin.rating || 'N/A'}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <StatusIndicator status={plugin.status} />
//                   </div>

//                   {/* Badges */}
//                   {plugin.badges.length > 0 && (
//                     <div className="flex gap-2 mb-4">
//                       {plugin.badges.map(badge => (
//                         <Badge key={badge} type={badge}>
//                           {badge.charAt(0).toUpperCase() + badge.slice(1).replace(/([A-Z])/g, ' $1')}
//                         </Badge>
//                       ))}
//                     </div>
//                   )}

//                   {/* Stats */}
//                   <div className="grid grid-cols-3 gap-4">
//                     <div>
//                       <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Installs</div>
//                       <div style={{ fontSize: '16px', fontWeight: '600' }}>
//                         {plugin.installs.toLocaleString()}
//                       </div>
//                     </div>
//                     <div>
//                       <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Version</div>
//                       <div style={{ fontSize: '16px', fontWeight: '600' }}>v{plugin.version}</div>
//                     </div>
//                     <div>
//                       <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Updated</div>
//                       <div style={{ fontSize: '16px', fontWeight: '600' }}>{plugin.lastUpdated}</div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}
//       </main>

//       {/* Modals */}
//       {showNewPluginModal && <NewPluginModal />}
//     </div>
//   );
// }