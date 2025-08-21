// import React, { useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Tabs,
//   Tab,
//   Grid,
//   TextField,
//   Switch,
//   FormControlLabel,
//   Button,
//   Divider,
//   Card,
//   CardContent,
//   CardHeader,
//   Alert,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Chip,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   Tooltip,
//   IconButton,
//   FormHelperText
// } from '@mui/material';
// import SettingsIcon from '@mui/icons-material/Settings';
// import SecurityIcon from '@mui/icons-material/Security';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import SaveIcon from '@mui/icons-material/Save';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import InfoIcon from '@mui/icons-material/Info';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import PeopleIcon from '@mui/icons-material/People';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
// import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
// import LockIcon from '@mui/icons-material/Lock';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import RemoveIcon from '@mui/icons-material/Remove';
// import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import VpnKeyIcon from '@mui/icons-material/VpnKey';

// const FacilitySettings = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [saved, setSaved] = useState(false);
//   const [userType, setUserType] = useState('superAdmin');

//   // Role permissions for RBAC tab - Now defined per user type
//   const modulesList = [
//     { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
//     { id: 'providers', name: 'Providers', icon: <PeopleIcon /> },
//     { id: 'credentials', name: 'Facility Credentials', icon: <VerifiedUserIcon /> },
//     { id: 'notifications', name: 'Notifications', icon: <NotificationsIcon /> },
//     { id: 'settings', name: 'Settings', icon: <SettingsIcon /> },
//     { id: 'reports', name: 'Reports & Analytics', icon: <SettingsApplicationsIcon /> },
//     { id: 'audit', name: 'Audit Logs', icon: <InfoIcon /> },
//     { id: 'billing', name: 'Billing', icon: <SettingsApplicationsIcon /> }
//   ];

//   // Permission levels definitions
//   const accessLevels = {
//     fullAccess: { id: 'fullAccess', label: 'Full Access', description: 'Can view, edit, create and delete' },
//     editAccess: { id: 'editAccess', label: 'Edit Access', description: 'Can view, edit and create' },
//     viewEdit: { id: 'viewEdit', label: 'View & Edit', description: 'Can view and edit but not create new' },
//     viewOnly: { id: 'viewOnly', label: 'View Only', description: 'Can only view information' },
//     noAccess: { id: 'noAccess', label: 'No Access', description: 'Cannot access this module' }
//   };

//   // Define permissions for each user type
//   const [userPermissions, setUserPermissions] = useState({
//     superAdmin: {
//       name: 'Super Admin',
//       description: 'Highest level of access with complete control over the system',
//       hipaaWarning: 'Super Admins have access to all PHI. This role should be limited to authorized personnel only.',
//       icon: <SupervisorAccountIcon />,
//       color: '#8c1a54',
//       permissions: {
//         dashboard: accessLevels.fullAccess.id,
//         providers: accessLevels.fullAccess.id,
//         credentials: accessLevels.fullAccess.id,
//         notifications: accessLevels.fullAccess.id,
//         settings: accessLevels.fullAccess.id,
//         reports: accessLevels.fullAccess.id,
//         audit: accessLevels.fullAccess.id,
//         billing: accessLevels.fullAccess.id
//       }
//     },
//     provider: {
//       name: 'Provider',
//       description: 'Medical providers who need access to credential management',
//       hipaaWarning: 'Providers should only have access to their own credentials and limited patient data.',
//       icon: <LocalHospitalIcon />,
//       color: '#218838',
//       permissions: {
//         dashboard: accessLevels.viewOnly.id,
//         providers: accessLevels.noAccess.id,
//         credentials: accessLevels.viewEdit.id,
//         notifications: accessLevels.viewOnly.id,
//         settings: accessLevels.viewOnly.id,
//         reports: accessLevels.noAccess.id,
//         audit: accessLevels.noAccess.id,
//         billing: accessLevels.noAccess.id
//       }
//     },
//     lora: {
//       name: 'LoRa',
//       description: 'Limited operational role with specialized access',
//       hipaaWarning: 'LoRa roles have restricted access to PHI and should only access necessary functionality.',
//       icon: <VpnKeyIcon />,
//       color: '#0056b3',
//       permissions: {
//         dashboard: accessLevels.viewOnly.id,
//         providers: accessLevels.viewOnly.id,
//         credentials: accessLevels.editAccess.id,
//         notifications: accessLevels.viewEdit.id,
//         settings: accessLevels.noAccess.id,
//         reports: accessLevels.viewOnly.id,
//         audit: accessLevels.viewOnly.id,
//         billing: accessLevels.noAccess.id
//       }
//     }
//   });

//   // Account settings state
//   const [accountSettings, setAccountSettings] = useState({
//     twoFactorEnabled: true,
//     emailNotifications: true
//   });

//   const handleToggleChange = (setting) => (event) => {
//     setAccountSettings({
//       ...accountSettings,
//       [setting]: event.target.checked
//     });
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     setSaved(false);
//   };

//   const handleUserTypeChange = (event) => {
//     setUserType(event.target.value);
//   };

//   const handlePermissionChange = (moduleId, newLevel) => {
//     setUserPermissions({
//       ...userPermissions,
//       [userType]: {
//         ...userPermissions[userType],
//         permissions: {
//           ...userPermissions[userType].permissions,
//           [moduleId]: newLevel
//         }
//       }
//     });
//   };

//   const handleSave = () => {
//     // In a real app, this would save the settings to the backend
//     setSaved(true);
    
//     // Reset the saved message after 3 seconds
//     setTimeout(() => {
//       setSaved(false);
//     }, 3000);
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <SettingsIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Facility Settings
//         </Typography>
//       </Box>
      
//       <Paper sx={{ mb: 3, width: '100%' }}>
//         <Tabs 
//           value={activeTab} 
//           onChange={handleTabChange}
//           variant="scrollable"
//           scrollButtons="auto"
//           sx={{ 
//             borderBottom: 1, 
//             borderColor: 'divider',
//             '& .MuiTab-root': {
//               py: 2,
//               px: 3
//             },
//             '& .Mui-selected': {
//               color: '#218838',
//             },
//             '& .MuiTabs-indicator': {
//               backgroundColor: '#218838',
//             }
//           }}
//         >
//           <Tab 
//             icon={<AccountCircleIcon />} 
//             label="Facility" 
//             iconPosition="start"
//           />
//           <Tab 
//             icon={<SecurityIcon />} 
//             label="Security" 
//             iconPosition="start"
//           />
//           <Tab 
//             icon={<AdminPanelSettingsIcon />} 
//             label="RBAC" 
//             iconPosition="start"
//           />
//           <Tab 
//             icon={<NotificationsIcon />} 
//             label="Notifications" 
//             iconPosition="start"
//           />
//         </Tabs>
        
//         {/* Facility settings */}
//         {activeTab === 0 && (
//           <Box p={4}>
//             {saved && <Alert severity="success" sx={{ mb: 3 }}>Facility settings saved successfully!</Alert>}
            
//             <Typography variant="h6" gutterBottom>Facility Information</Typography>
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Facility Name"
//                   fullWidth
//                   defaultValue="MedCredPro Medical Center"
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="License Number"
//                   fullWidth
//                   defaultValue="MC-12345-F"
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Tax ID"
//                   fullWidth
//                   defaultValue="81-2345678"
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="NPI Number"
//                   fullWidth
//                   defaultValue="1234567890"
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   label="Facility Address"
//                   fullWidth
//                   defaultValue="123 Healthcare Way, Medical City, MC 12345"
//                   variant="outlined"
//                   multiline
//                   rows={2}
//                 />
//               </Grid>
//             </Grid>
            
//             <Typography variant="h6" gutterBottom>Contact Information</Typography>
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Primary Contact Name"
//                   fullWidth
//                   defaultValue="John Smith"
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Primary Contact Email"
//                   fullWidth
//                   defaultValue="admin@medcredpro.com"
//                   variant="outlined"
//                   type="email"
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Phone Number"
//                   fullWidth
//                   defaultValue="(555) 123-4567"
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Alternative Phone"
//                   fullWidth
//                   defaultValue="(555) 765-4321"
//                   variant="outlined"
//                 />
//               </Grid>
//             </Grid>
            
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//               <Button 
//                 variant="contained" 
//                 startIcon={<SaveIcon />}
//                 onClick={handleSave}
//                 sx={{ 
//                   bgcolor: '#218838',
//                   '&:hover': {
//                     bgcolor: '#1e7e34'
//                   }
//                 }}
//               >
//                 Save Changes
//               </Button>
//             </Box>
//           </Box>
//         )}
        
//         {/* Security settings */}
//         {activeTab === 1 && (
//           <Box p={4}>
//             {saved && <Alert severity="success" sx={{ mb: 3 }}>Security settings saved successfully!</Alert>}
            
//             <Typography variant="h6" gutterBottom>Account Security</Typography>
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               <Grid item xs={12} md={6}>
//                 <Card variant="outlined">
//                   <CardHeader title="Password Settings" />
//                   <Divider />
//                   <CardContent>
//                     <Box sx={{ mb: 2 }}>
//                       <Button 
//                         variant="outlined" 
//                         color="primary"
//                         sx={{ mb: 2 }}
//                       >
//                         Change Password
//                       </Button>
//                       <FormControlLabel
//                         control={<Switch defaultChecked />}
//                         label="Require password change every 90 days"
//                       />
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
              
//               <Grid item xs={12} md={6}>
//                 <Card variant="outlined">
//                   <CardHeader title="Two-Factor Authentication" />
//                   <Divider />
//                   <CardContent>
//                     <FormControlLabel
//                       control={<Switch defaultChecked />}
//                       label="Enable two-factor authentication"
//                     />
//                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                       Two-factor authentication adds an extra layer of security to your account
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
              
//               <Grid item xs={12}>
//                 <Card variant="outlined">
//                   <CardHeader title="Login Sessions" />
//                   <Divider />
//                   <CardContent>
//                     <FormControlLabel
//                       control={<Switch defaultChecked />}
//                       label="Automatically log out after 30 minutes of inactivity"
//                     />
//                     <Box sx={{ mt: 2 }}>
//                       <Button variant="outlined" color="error">
//                         Log Out All Devices
//                       </Button>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
            
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//               <Button 
//                 variant="contained" 
//                 startIcon={<SaveIcon />}
//                 onClick={handleSave}
//                 sx={{ 
//                   bgcolor: '#218838',
//                   '&:hover': {
//                     bgcolor: '#1e7e34'
//                   }
//                 }}
//               >
//                 Save Changes
//               </Button>
//             </Box>
//           </Box>
//         )}
        
//         {/* RBAC settings */}
//         {activeTab === 2 && (
//           <Box p={4}>
//             {saved && <Alert severity="success" sx={{ mb: 3 }}>RBAC settings saved successfully!</Alert>}
            
//             {/* User Type Selection */}
//             <Paper sx={{ p: 3, mb: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Role-Based Access Control (RBAC)
//               </Typography>
              
//               <Alert severity="info" sx={{ mb: 3 }}>
//                 Configure access controls for different user types in your facility. HIPAA compliance requires that users only have access to the minimum necessary information to perform their job functions.
//               </Alert>
              
//               <Box sx={{ mb: 4 }}>
//                 <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
//                   <InputLabel id="user-type-select-label">Configure User Type</InputLabel>
//                   <Select
//                     labelId="user-type-select-label"
//                     id="user-type-select"
//                     value={userType}
//                     onChange={handleUserTypeChange}
//                     label="Configure User Type"
//                   >
//                     {Object.keys(userPermissions).map((type) => (
//                       <MenuItem key={type} value={type}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Box sx={{ 
//                             mr: 1.5, 
//                             bgcolor: `${userPermissions[type].color}15`, 
//                             borderRadius: '50%',
//                             p: 1,
//                             display: 'flex'
//                           }}>
//                             {React.cloneElement(userPermissions[type].icon, { sx: { color: userPermissions[type].color } })}
//                           </Box>
//                           {userPermissions[type].name}
//                         </Box>
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
                
//                 <Box sx={{ p: 2, bgcolor: `${userPermissions[userType].color}10`, borderRadius: 1, mb: 3 }}>
//                   <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//                     <Box sx={{ 
//                       mr: 1.5, 
//                       bgcolor: `${userPermissions[userType].color}15`, 
//                       borderRadius: '50%',
//                       p: 1,
//                       display: 'flex'
//                     }}>
//                       {React.cloneElement(userPermissions[userType].icon, { sx: { color: userPermissions[userType].color } })}
//                     </Box>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
//                       {userPermissions[userType].name} Role
//                     </Typography>
//                   </Box>
//                   <Typography variant="body2" sx={{ mb: 1 }}>
//                     {userPermissions[userType].description}
//                   </Typography>
//                   <Alert severity="warning" sx={{ mt: 1 }} icon={<LockIcon />}>
//                     <Typography variant="body2">
//                       <strong>HIPAA Consideration:</strong> {userPermissions[userType].hipaaWarning}
//                     </Typography>
//                   </Alert>
//                 </Box>
//               </Box>
              
//               <Divider sx={{ mb: 3 }} />
              
//               <Typography variant="h6" gutterBottom>
//                 Permission Matrix
//               </Typography>
              
//               <Grid container spacing={2} sx={{ mb: 3 }}>
//                 {modulesList.map((module) => (
//                   <Grid item xs={12} sm={6} md={4} key={module.id}>
//                     <Card variant="outlined" sx={{ height: '100%' }}>
//                       <CardContent>
//                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//                           <Box sx={{ 
//                             mr: 1.5, 
//                             bgcolor: 'rgba(33, 136, 56, 0.1)', 
//                             borderRadius: '50%',
//                             p: 1,
//                             display: 'flex'
//                           }}>
//                             {React.cloneElement(module.icon, { sx: { color: '#218838' } })}
//                           </Box>
//                           <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
//                             {module.name}
//                           </Typography>
//                         </Box>
                        
//                         <FormControl fullWidth size="small" sx={{ mb: 1 }}>
//                           <Select
//                             value={userPermissions[userType].permissions[module.id]}
//                             onChange={(event) => handlePermissionChange(module.id, event.target.value)}
//                             displayEmpty
//                             renderValue={(selected) => {
//                               const level = Object.values(accessLevels).find(level => level.id === selected);
//                               return (
//                                 <Chip 
//                                   size="small" 
//                                   label={level.label} 
//                                   color={selected === 'fullAccess' 
//                                     ? 'success' 
//                                     : selected === 'noAccess' 
//                                       ? 'error' 
//                                       : 'primary'}
//                                   variant="outlined"
//                                   sx={{ fontWeight: 'medium' }}
//                                 />
//                               );
//                             }}
//                             sx={{
//                               '& .MuiSelect-select': {
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 p: 0.5
//                               }
//                             }}
//                           >
//                             {Object.values(accessLevels).map((level) => (
//                               <MenuItem key={level.id} value={level.id}>
//                                 <Box>
//                                   <Typography variant="body2">{level.label}</Typography>
//                                   <Typography variant="caption" color="text.secondary">
//                                     {level.description}
//                                   </Typography>
//                                 </Box>
//                               </MenuItem>
//                             ))}
//                           </Select>
//                         </FormControl>
                        
//                         <Tooltip title={
//                           <Box>
//                             <Typography variant="caption" sx={{ fontWeight: 'bold' }}>HIPAA Guidance</Typography>
//                             <Typography variant="caption" display="block">
//                               {module.id === 'providers' ? 
//                                 'Contains PHI. Restrict access based on job requirements.' :
//                                 module.id === 'credentials' ?
//                                 'Contains credential verification info. Restrict appropriately.' :
//                                 'Set permissions based on minimum necessary principle.'}
//                             </Typography>
//                           </Box>
//                         } arrow>
//                           <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
//                             <InfoIcon color="action" sx={{ fontSize: 16, mr: 0.5 }} />
//                             <Typography variant="caption" color="text.secondary">
//                               HIPAA compliance info
//                             </Typography>
//                           </Box>
//                         </Tooltip>
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
              
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
//                 <Button
//                   variant="outlined"
//                   color="secondary"
//                   onClick={() => {
//                     // Reset to default permissions for selected user type
//                     const defaultPermissions = {
//                       superAdmin: {
//                         dashboard: 'fullAccess',
//                         providers: 'fullAccess',
//                         credentials: 'fullAccess',
//                         notifications: 'fullAccess',
//                         settings: 'fullAccess',
//                         reports: 'fullAccess',
//                         audit: 'fullAccess',
//                         billing: 'fullAccess'
//                       },
//                       provider: {
//                         dashboard: 'viewOnly',
//                         providers: 'noAccess',
//                         credentials: 'viewEdit',
//                         notifications: 'viewOnly',
//                         settings: 'viewOnly',
//                         reports: 'noAccess',
//                         audit: 'noAccess',
//                         billing: 'noAccess'
//                       },
//                       lora: {
//                         dashboard: 'viewOnly',
//                         providers: 'viewOnly',
//                         credentials: 'editAccess',
//                         notifications: 'viewEdit',
//                         settings: 'noAccess',
//                         reports: 'viewOnly',
//                         audit: 'viewOnly',
//                         billing: 'noAccess'
//                       }
//                     };

//                     setUserPermissions({
//                       ...userPermissions,
//                       [userType]: {
//                         ...userPermissions[userType],
//                         permissions: defaultPermissions[userType]
//                       }
//                     });
//                   }}
//                 >
//                   Reset to Defaults
//                 </Button>
                
//                 <Tooltip title="These settings will apply to all users with this role" arrow>
//                   <IconButton size="small" color="info">
//                     <HelpOutlineIcon />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Paper>
            
//             {/* User Management */}
//             <Paper sx={{ p: 3, mb: 3 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                 <Typography variant="h6">
//                   Role Assignments
//                 </Typography>
//                 <Button 
//                   variant="outlined" 
//                   startIcon={<AddIcon />}
//                   size="small"
//                 >
//                   Add User
//                 </Button>
//               </Box>
              
//               <Alert severity="info" sx={{ mb: 3 }}>
//                 Manage which users have each role. For HIPAA compliance, regularly audit user permissions.
//               </Alert>
              
//               <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
//                 <ListItem 
//                   secondaryAction={
//                     <Box>
//                       <Chip 
//                         label="Super Admin" 
//                         size="small"
//                         sx={{ 
//                           bgcolor: `${userPermissions.superAdmin.color}15`,
//                           color: userPermissions.superAdmin.color,
//                           mr: 1 
//                         }} 
//                       />
//                       <IconButton edge="end" aria-label="edit">
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   }
//                 >
//                   <ListItemIcon>
//                     <AccountCircleIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="John Smith" 
//                     secondary="admin@medcredpro.com" 
//                   />
//                 </ListItem>
                
//                 <Divider component="li" />
                
//                 <ListItem 
//                   secondaryAction={
//                     <Box>
//                       <Chip 
//                         label="Provider" 
//                         size="small" 
//                         sx={{ 
//                           bgcolor: `${userPermissions.provider.color}15`,
//                           color: userPermissions.provider.color,
//                           mr: 1 
//                         }} 
//                       />
//                       <IconButton edge="end" aria-label="edit">
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   }
//                 >
//                   <ListItemIcon>
//                     <AccountCircleIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Dr. Sarah Johnson" 
//                     secondary="sjohnson@medcredpro.com" 
//                   />
//                 </ListItem>
                
//                 <Divider component="li" />
                
//                 <ListItem 
//                   secondaryAction={
//                     <Box>
//                       <Chip 
//                         label="LoRa" 
//                         size="small" 
//                         sx={{ 
//                           bgcolor: `${userPermissions.lora.color}15`,
//                           color: userPermissions.lora.color,
//                           mr: 1 
//                         }} 
//                       />
//                       <IconButton edge="end" aria-label="edit">
//                         <EditIcon fontSize="small" />
//                       </IconButton>
//                     </Box>
//                   }
//                 >
//                   <ListItemIcon>
//                     <AccountCircleIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Alex Rodriguez" 
//                     secondary="arodriguez@medcredpro.com" 
//                   />
//                 </ListItem>
//               </List>
              
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                 <Button 
//                   variant="outlined" 
//                   size="small"
//                   startIcon={<SettingsApplicationsIcon />}
//                 >
//                   Audit User Access
//                 </Button>
//               </Box>
//             </Paper>
            
//             {/* Account Settings - kept from previous implementation */}
//             <Paper sx={{ p: 3 }}>
//               <Typography variant="h6" gutterBottom>
//                 Account Settings
//               </Typography>
              
//               <List>
//                 <ListItem 
//                   secondaryAction={
//                     <Switch
//                       edge="end"
//                       checked={accountSettings.twoFactorEnabled}
//                       onChange={handleToggleChange('twoFactorEnabled')}
//                     />
//                   }
//                 >
//                   <ListItemIcon>
//                     <SecurityIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Two-Factor Authentication" 
//                     secondary="Enable extra security for your account" 
//                   />
//                 </ListItem>
                
//                 <Divider variant="inset" component="li" />
                
//                 <ListItem 
//                   secondaryAction={
//                     <Switch
//                       edge="end"
//                       checked={accountSettings.emailNotifications}
//                       onChange={handleToggleChange('emailNotifications')}
//                     />
//                   }
//                 >
//                   <ListItemIcon>
//                     <NotificationsIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Email Notifications" 
//                     secondary="Receive updates about credential status changes" 
//                   />
//                 </ListItem>
                
//                 <Divider variant="inset" component="li" />
                
//                 <ListItem>
//                   <ListItemIcon>
//                     <InfoIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Application Version" 
//                     secondary="v1.2.3" 
//                   />
//                 </ListItem>
                
//                 <Divider variant="inset" component="li" />
                
//                 <ListItem>
//                   <ListItemIcon>
//                     <InfoIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Data Last Synced" 
//                     secondary="2023-12-15 08:30 AM" 
//                   />
//                 </ListItem>
//               </List>
//             </Paper>
            
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
//               <Button 
//                 variant="contained" 
//                 startIcon={<SaveIcon />}
//                 onClick={handleSave}
//                 sx={{ 
//                   bgcolor: '#218838',
//                   '&:hover': {
//                     bgcolor: '#1e7e34'
//                   }
//                 }}
//               >
//                 Save Changes
//               </Button>
//             </Box>
//           </Box>
//         )}
        
//         {/* Notification settings */}
//         {activeTab === 3 && (
//           <Box p={4}>
//             {saved && <Alert severity="success" sx={{ mb: 3 }}>Notification settings saved successfully!</Alert>}
            
//             <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
//             <Grid container spacing={3} sx={{ mb: 4 }}>
//               <Grid item xs={12}>
//                 <Card variant="outlined">
//                   <CardHeader title="Email Notifications" />
//                   <Divider />
//                   <CardContent>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12}>
//                         <FormControlLabel
//                           control={<Switch defaultChecked />}
//                           label="Provider credential updates"
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <FormControlLabel
//                           control={<Switch defaultChecked />}
//                           label="Approaching credential expirations"
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <FormControlLabel
//                           control={<Switch defaultChecked />}
//                           label="New verification requests"
//                         />
//                       </Grid>
//                       <Grid item xs={12}>
//                         <FormControlLabel
//                           control={<Switch defaultChecked />}
//                           label="System notifications and updates"
//                         />
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>
              
//               <Grid item xs={12}>
//                 <Card variant="outlined">
//                   <CardHeader title="Notification Schedule" />
//                   <Divider />
//                   <CardContent>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           select
//                           label="Notification Frequency"
//                           fullWidth
//                           defaultValue="Daily"
//                           SelectProps={{
//                             native: true,
//                           }}
//                         >
//                           <option value="Immediate">Immediate</option>
//                           <option value="Daily">Daily Digest</option>
//                           <option value="Weekly">Weekly Digest</option>
//                         </TextField>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <TextField
//                           label="Notification Email Address"
//                           fullWidth
//                           defaultValue="admin@medcredpro.com"
//                           type="email"
//                         />
//                       </Grid>
//                     </Grid>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             </Grid>
            
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//               <Button 
//                 variant="contained" 
//                 startIcon={<SaveIcon />}
//                 onClick={handleSave}
//                 sx={{ 
//                   bgcolor: '#218838',
//                   '&:hover': {
//                     bgcolor: '#1e7e34'
//                   }
//                 }}
//               >
//                 Save Changes
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// };

// export default FacilitySettings; 