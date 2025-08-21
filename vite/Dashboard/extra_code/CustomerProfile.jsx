// import React, { useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper,
//   Avatar,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemIcon,
//   Chip,
//   Button,
//   Grid,
//   Switch,
//   FormControlLabel,
//   IconButton,
//   Card,
//   CardContent,
//   Alert
// } from '@mui/material';
// import PersonIcon from '@mui/icons-material/Person';
// import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
// import SecurityIcon from '@mui/icons-material/Security';
// import EmailIcon from '@mui/icons-material/Email';
// import PhoneIcon from '@mui/icons-material/Phone';
// import BusinessIcon from '@mui/icons-material/Business';
// import EditIcon from '@mui/icons-material/Edit';
// import InfoIcon from '@mui/icons-material/Info';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import PeopleIcon from '@mui/icons-material/People';
// import SettingsIcon from '@mui/icons-material/Settings';
// import NotificationsIcon from '@mui/icons-material/Notifications';
// import DashboardIcon from '@mui/icons-material/Dashboard';

// // Profile component
// const FacilityProfile = () => {
//   // User profile data - in a real app, this would come from an API/context
//   const [profile, setProfile] = useState({
//     firstName: 'Michael',
//     lastName: 'Chen',
//     avatarText: 'MC',
//     email: 'admin@metropolitanmedical.com',
//     phone: '+1 (555) 123-4567',
//     facility: 'Metropolitan Medical Center',
//     role: 'Facility Administrator',
//     lastLogin: '2023-12-15 09:23 AM',
//     accessLevel: 'Full Access',
//     twoFactorEnabled: true,
//     emailNotifications: true,
//     appVersion: '1.2.3',
//     dataLastSynced: '2023-12-15 08:30 AM'
//   });

//   // Role-based permissions
//   const rolePermissions = [
//     { name: 'Dashboard', icon: <DashboardIcon />, access: 'View & Edit' },
//     { name: 'Providers', icon: <PeopleIcon />, access: 'Full Access' },
//     { name: 'Facility Credentials', icon: <VerifiedUserIcon />, access: 'Full Access' },
//     { name: 'Notifications', icon: <NotificationsIcon />, access: 'View Only' },
//     { name: 'Settings', icon: <SettingsIcon />, access: 'Full Access' }
//   ];

//   // Toggle settings
//   const handleToggleChange = (setting) => (event) => {
//     setProfile({
//       ...profile,
//       [setting]: event.target.checked
//     });
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <PersonIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Profile
//         </Typography>
//       </Box>
      
//       <Grid container spacing={3}>
//         {/* Profile Summary */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3, height: '100%' }}>
//             <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//               <Avatar
//                 sx={{
//                   width: 100,
//                   height: 100,
//                   bgcolor: '#218838',
//                   fontSize: '2rem',
//                   mb: 2
//                 }}
//               >
//                 {profile.avatarText}
//               </Avatar>
//               <Typography variant="h5" gutterBottom>
//                 {profile.firstName} {profile.lastName}
//               </Typography>
//               <Chip 
//                 icon={<AdminPanelSettingsIcon />} 
//                 label={profile.role} 
//                 color="primary" 
//                 sx={{ 
//                   bgcolor: '#218838', 
//                   mb: 2,
//                   '& .MuiChip-icon': {
//                     color: 'white'
//                   }
//                 }} 
//               />
              
//               <List sx={{ width: '100%' }}>
//                 <ListItem>
//                   <ListItemIcon>
//                     <EmailIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="Email" secondary={profile.email} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemIcon>
//                     <PhoneIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="Phone" secondary={profile.phone} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemIcon>
//                     <BusinessIcon />
//                   </ListItemIcon>
//                   <ListItemText primary="Facility" secondary={profile.facility} />
//                 </ListItem>
//                 <ListItem>
//                   <ListItemIcon>
//                     <SecurityIcon />
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary="Last Login" 
//                     secondary={profile.lastLogin} 
//                   />
//                 </ListItem>
//               </List>
              
//               <Button 
//                 variant="outlined" 
//                 startIcon={<EditIcon />}
//                 sx={{ 
//                   mt: 2,
//                   color: '#218838',
//                   borderColor: '#218838',
//                   '&:hover': {
//                     borderColor: '#1e7e34',
//                     bgcolor: 'rgba(33, 136, 56, 0.04)'
//                   }
//                 }}
//               >
//                 Edit Profile
//               </Button>
//             </Box>
//           </Paper>
//         </Grid>
        

//       </Grid>
//     </Box>
//   );
// };

// export default FacilityProfile; 