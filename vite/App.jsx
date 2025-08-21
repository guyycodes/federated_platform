import { Route, Routes, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';

import Home from './HomeScreen';
import { Box, Typography } from '@mui/material';
import { useDataLayer } from './Context/DataLayer';
import { useEffect } from 'react';

// Route Guards
// import { AdminRoute } from './Components/auth/AdminRoute';
// import { CustomerRoute } from './Components/auth/CustomerRoute';

// Main Pages
import Login from './views/Login';
import AdminLogin from './views/AdminLogin';
import About from './views/About';
import Contact from './views/Contact';
import Spotlight from './views/Spotlight';
import Shop from './views/Shop';
import CareGuide from './views/CareGuide';
import Booking from './views/Booking';
import Checkout from './Components/Checkout/Checkout';
// import PluginsPage from './Dashboard/PluginsPage';
import StaffDash from './Dashboard/StaffDashboard/StaffLayout';
import DashboardContent from './Dashboard/StaffDashboard/views/DashboardContent';
import BrowseTemplates from './Dashboard/StaffDashboard/views/BrowseTemplates';

// Plugins
import ViewAll from './Dashboard/StaffDashboard/Plugins/ViewAll';
import BrowseCatalog from './Dashboard/StaffDashboard/Plugins/BrowseCatalog';
import CommunityPlugins from './Dashboard/StaffDashboard/Plugins/CommunityPlugins';

// Platform
import Deployments from './Dashboard/StaffDashboard/Platform/Deployments';
import Rollback from './Dashboard/StaffDashboard/Platform/Rollback';
import Monitoring from './Dashboard/StaffDashboard/Platform/Monitoring';
import ReviewQueue from './Dashboard/StaffDashboard/Platform/ReviewQueue';

// Analytics
import Usage from './Dashboard/StaffDashboard/Analytics/Usage';
import Performance from './Dashboard/StaffDashboard/Analytics/Performance';
import Telemetry from './Dashboard/StaffDashboard/Analytics/Telemetry';
import Revenue from './Dashboard/StaffDashboard/Analytics/Revenue';

// API Gateway
import ApiKeys from './Dashboard/StaffDashboard/ApiGateway/ApiKeys';
import RateLimits from './Dashboard/StaffDashboard/ApiGateway/RateLimits';
import Endpoints from './Dashboard/StaffDashboard/ApiGateway/Endpoints';

// Admin Panel
import Settings from './Dashboard/StaffDashboard/AdminPanel/Settings';
import Payouts from './Dashboard/StaffDashboard/AdminPanel/Payouts';
import WhiteLabel from './Dashboard/StaffDashboard/AdminPanel/White-Label';

// Auth/Account Pages
import Register from './views/Register';
import ForgotPassword from './views/ForgotPassword';
import VerifyEmail from './views/VerifyEmail';
import RegistrationSSOCallback from './Components/auth/RegistrationSSOCallback';

import GoogleOAuthCallback from './Components/auth/GoogleOAuthCallback';

// Legal Pages
import Privacy from './views/Privacy';
import Terms from './views/Terms';
import Cookies from './views/Cookies';

// Error/Fallback Pages
import NotFound from './views/NotFound';
import ServerError from './views/ServerError';
import AccessDenied from './views/AccessDenied';
import Maintenance from './views/Maintenance';


// Authenticated Components for Customers
import { ProfileContainer as Layout } from './Dashboard/Layout';
import CustomerLayout from './Dashboard/CustomerDashboard/CustomerLayout';
// import CustomerSettings from './Dashboard/CustomerDashboard/CustomerSettings';
// import CustomerSupport from './Dashboard/CustomerDashboard/CustomerSupport';
// import CustomerProfile from './Dashboard/CustomerDashboard/CustomerProfile';


// Simple subscriptions page component
const Subscriptions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlan } = useDataLayer();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const planId = params.get('plan');
    const size = params.get('size');
    
    if (planId) {
      // Redirect to checkout with plan info
      navigate(`/checkout?plan=${planId}&size=${size}`);
    } else if (currentPlan) {
      // Use current plan from context
      navigate(`/checkout?plan=${currentPlan.id}&size=${currentPlan.selectedSize || 'small'}`);
    } else {
      // No plan selected, redirect to home
      navigate('/layout/dashboard');
    }
  }, [location, currentPlan, navigate]);
  
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography>Preparing your subscription...</Typography>
    </Box>
  );
};

function App() {
  // For demonstration, you can set this to true when maintenance is needed
  const isMaintenance = false;

  // If site is in maintenance mode, show the maintenance page
  if (isMaintenance) {
    return <Maintenance />;
  }

  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" index element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/admin-login" element={  <AdminLogin /> } />

      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route path="/registration-sso-callback" element={<RegistrationSSOCallback />} />
      <Route path="/google-oauth-callback" element={<GoogleOAuthCallback />} />

      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/spotlight" element={<Spotlight />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/care-guide" element={<CareGuide />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<Checkout />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Legal Routes */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/cookies" element={<Cookies />} />
      
      
      {/* Authenticated Routes for Clients/App users */}
      <Route path="/layout/*" element={ <Layout isStaff={false} /> }>
        <Route path="*" element={<CustomerLayout />} />
      </Route>

      {/* Authenticated Routes for Staff */}
      <Route path="/staff" element={<Layout isStaff={true} />}>
        {/* Dashboard */}
        <Route path="dash/start" element={<StaffDash />} />
        <Route path="dash" element={<DashboardContent />} />
        <Route path="dash/new" element={<StaffDash />} />
        <Route path="templates" element={<BrowseTemplates />} />
        
        {/* Plugins */}
        <Route path="plugins" element={<ViewAll />} />
        <Route path="plugins/catalog" element={<BrowseCatalog />} />
        <Route path="plugins/community" element={<CommunityPlugins />} />
        
        {/* API Gateway */}
        <Route path="api/keys" element={<ApiKeys />} />
        <Route path="api/limits" element={<RateLimits />} />
        <Route path="api/endpoints" element={<Endpoints />} />
        
        {/* Analytics */}
        <Route path="analytics/usage" element={<Usage />} />
        <Route path="analytics/performance" element={<Performance />} />
        <Route path="analytics/telemetry" element={<Telemetry />} />
        <Route path="analytics/revenue" element={<Revenue />} />
        
        {/* Platform */}
        <Route path="platform/deployments" element={<Deployments />} />
        <Route path="platform/rollback" element={<Rollback />} />
        <Route path="platform/monitoring" element={<Monitoring />} />
        <Route path="platform/review" element={<ReviewQueue />} />
        
        {/* Admin Panel */}
        <Route path="admin/settings" element={<Settings />} />
        <Route path="admin/payouts" element={<Payouts />} />
        <Route path="admin/whitelabel" element={<WhiteLabel />} />
      </Route>
      

      {/* Dashboard redirect for easier navigation */}
      {/* <Route path="/dashboard" element={<Navigate to="/layout/dashboard" replace />} /> */}
      
      {/* Error Routes */}
      <Route path="/server-error" element={<ServerError />} />
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="/maintenance" element={<Maintenance />} />
      
      {/* 404 Route - Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App