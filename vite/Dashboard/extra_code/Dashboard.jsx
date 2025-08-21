// import React, { useEffect, useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Grid, 
//   Paper, 
//   Card, 
//   CardContent,
//   CardHeader,
//   Divider,
//   Button,
//   Skeleton,
//   LinearProgress,
//   Chip
// } from '@mui/material';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import PeopleIcon from '@mui/icons-material/People';
// import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
// import HealingIcon from '@mui/icons-material/Healing';

// // Import the facility data
// import { currentFacility, getRecentVerifications } from '../../data/facilitiesData';

// // Sample facility dashboard component that will display subscription plan info
// const FacilityDashboard = () => {
//   const [facilityData, setFacilityData] = useState(null);
//   const [loading, setLoading] = useState(true);
  
//   useEffect(() => {
//     // In a real app, you'd fetch this from your backend
//     // For now, we'll use our pre-generated data
    
//     // Simulate loading delay
//     const timer = setTimeout(() => {
//       setFacilityData(currentFacility);
//       setLoading(false);
//     }, 800);
    
//     return () => clearTimeout(timer);
//   }, []);

//   // Summary cards with key stats
//   const StatCard = ({ title, value, icon, color, loading }) => (
//     <Card>
//       <CardContent sx={{ p: 3 }}>
//         {loading ? (
//           <>
//             <Skeleton animation="wave" height={24} width="40%" />
//             <Skeleton animation="wave" height={40} width="60%" sx={{ mt: 1 }} />
//           </>
//         ) : (
//           <>
//             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
//               <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
//               <Box sx={{ bgcolor: `${color}20`, p: 1, borderRadius: '50%' }}>
//                 {icon}
//               </Box>
//             </Box>
//             <Typography variant="h4" fontWeight="bold">{value}</Typography>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );

//   // Provider Type Card Component
//   const ProviderTypeCard = ({ type, count, icon, color, loading }) => (
//     <Box sx={{ 
//       display: 'flex', 
//       justifyContent: 'space-between', 
//       alignItems: 'center',
//       p: 2,
//       borderRadius: 1,
//       border: '1px solid #eee',
//       mb: 2
//     }}>
//       {loading ? (
//         <Box sx={{ width: '100%' }}>
//           <Skeleton animation="wave" height={24} width="40%" />
//           <Skeleton animation="wave" height={20} width="30%" sx={{ mt: 1 }} />
//         </Box>
//       ) : (
//         <>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <Box sx={{ 
//               bgcolor: `${color}20`, 
//               p: 1, 
//               borderRadius: '50%',
//               mr: 2
//             }}>
//               {icon}
//             </Box>
//             <Box>
//               <Typography variant="body1" fontWeight="medium">{type}</Typography>
//               <Typography variant="caption" color="text.secondary">Active providers</Typography>
//             </Box>
//           </Box>
//           <Typography variant="h6" fontWeight="bold">{count}</Typography>
//         </>
//       )}
//     </Box>
//   );

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <DashboardIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 1 }}>
//           Facility Dashboard
//         </Typography>
//       </Box>
      
//       {!loading && (
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//           <Typography variant="h6" sx={{ mr: 1 }}>
//             {facilityData.name}
//           </Typography>
//           <Typography variant="body1" color="text.secondary">
//             • {facilityData.location} • {facilityData.type}
//           </Typography>
//         </Box>
//       )}
      
//       <Typography variant="body1" color="text.secondary" paragraph>
//         Welcome to your facility dashboard. Manage your healthcare provider credentials and verification workflow here.
//       </Typography>
      
//       {/* Summary Statistics */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Total Providers" 
//             value={loading ? '' : facilityData.statistics.totalProviders} 
//             icon={<PeopleIcon sx={{ color: '#218838' }} />} 
//             color="#218838"
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Active Providers" 
//             value={loading ? '' : facilityData.statistics.activeProviders} 
//             icon={<VerifiedUserIcon sx={{ color: '#4caf50' }} />} 
//             color="#4caf50"
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Pending Verification" 
//             value={loading ? '' : facilityData.statistics.pendingVerifications} 
//             icon={<AssignmentLateIcon sx={{ color: '#ff9800' }} />} 
//             color="#ff9800"
//             loading={loading}
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Expiring Soon" 
//             value={loading ? '' : facilityData.statistics.expiringCredentials} 
//             icon={<AssignmentLateIcon sx={{ color: '#f44336' }} />} 
//             color="#f44336"
//             loading={loading}
//           />
//         </Grid>
//       </Grid>
      
//       <Grid container spacing={3}>
//         {/* Provider Type Breakdown */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3, height: '100%' }}>
//             <Typography variant="h6" gutterBottom>
//               Providers by Type
//             </Typography>
            
//             {loading ? (
//               <>
//                 <Skeleton animation="wave" height={80} width="100%" />
//                 <Skeleton animation="wave" height={80} width="100%" sx={{ mt: 2 }} />
//                 <Skeleton animation="wave" height={80} width="100%" sx={{ mt: 2 }} />
//               </>
//             ) : (
//               <>
//                 <ProviderTypeCard
//                   type="Doctors"
//                   count={facilityData.statistics.providersByType.doctor}
//                   icon={<LocalHospitalIcon sx={{ color: '#2196f3' }} />}
//                   color="#2196f3"
//                   loading={loading}
//                 />
//                 <ProviderTypeCard
//                   type="Nurses"
//                   count={facilityData.statistics.providersByType.nurse}
//                   icon={<HealingIcon sx={{ color: '#9c27b0' }} />}
//                   color="#9c27b0"
//                   loading={loading}
//                 />
//                 <ProviderTypeCard
//                   type="Therapists"
//                   count={facilityData.statistics.providersByType.therapist}
//                   icon={<AccessibilityNewIcon sx={{ color: '#009688' }} />}
//                   color="#009688"
//                   loading={loading}
//                 />
                
//                 <Button 
//                   variant="outlined" 
//                   fullWidth
//                   sx={{ 
//                     mt: 2,
//                     color: '#218838', 
//                     borderColor: '#218838',
//                     '&:hover': { borderColor: '#1e7e34', backgroundColor: 'rgba(33, 136, 56, 0.04)' }
//                   }}
//                 >
//                   View All Providers
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Grid>
        
//         {/* Verification Activity */}
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 3, height: '100%' }}>
//             <Typography variant="h6" gutterBottom>
//               Recent Credential Verifications
//             </Typography>
//             {loading ? (
//               <>
//                 <Skeleton animation="wave" height={40} width="100%" />
//                 <Skeleton animation="wave" height={40} width="100%" />
//                 <Skeleton animation="wave" height={40} width="100%" />
//               </>
//             ) : (
//               <>
//                 <Box sx={{ mb: 3 }}>
//                   {getRecentVerifications(facilityData, 3).map((verification) => (
//                     <Box key={verification.id} sx={{ py: 2, borderBottom: '1px solid #eee' }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
//                         <Typography variant="body1" fontWeight="medium">{verification.providerName}</Typography>
//                         <Typography variant="body2" color="text.secondary">{verification.date}</Typography>
//                       </Box>
//                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
//                         <Typography variant="body2" color="text.secondary">{verification.credential}</Typography>
//                         <Chip
//                           label={verification.status}
//                           size="small"
//                           color={verification.status === 'Verified' ? 'success' : verification.status === 'Pending' ? 'warning' : 'error'}
//                           variant="outlined"
//                         />
//                       </Box>
//                     </Box>
//                   ))}
//                 </Box>
//                 <Button 
//                   variant="outlined" 
//                   fullWidth
//                   sx={{ 
//                     color: '#218838', 
//                     borderColor: '#218838',
//                     '&:hover': { borderColor: '#1e7e34', backgroundColor: 'rgba(33, 136, 56, 0.04)' }
//                   }}
//                 >
//                   View All Verifications
//                 </Button>
//               </>
//             )}
//           </Paper>
//         </Grid>
        
//         {/* Subscription Info */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ height: '100%' }}>
//             <CardHeader 
//               title="Subscription Plan" 
//               titleTypographyProps={{ variant: 'h6' }} 
//             />
//             <Divider />
//             <CardContent>
//               {loading ? (
//                 <>
//                   <Skeleton animation="wave" height={40} width="70%" />
//                   <Skeleton animation="wave" height={20} width="40%" />
//                   <Box sx={{ mt: 3 }}>
//                     <Typography variant="body2" gutterBottom>Credential Usage</Typography>
//                     <Skeleton animation="wave" height={15} />
//                     <Skeleton animation="wave" height={36} width="100%" sx={{ mt: 2 }} />
//                   </Box>
//                 </>
//               ) : (
//                 <>
//                   <Typography variant="h5" gutterBottom>
//                     {facilityData.subscription.planTitle}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     Billing: {facilityData.subscription.isAnnual ? 'Annual' : 'Monthly'}
//                   </Typography>
                  
//                   <Box sx={{ mt: 3, mb: 3 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                       <Typography variant="body2">Provider Usage</Typography>
//                       <Typography variant="body2" fontWeight="medium">
//                         {facilityData.statistics.providerUsage.used}/{facilityData.statistics.providerUsage.total}
//                       </Typography>
//                     </Box>
//                     <LinearProgress 
//                       variant="determinate" 
//                       value={facilityData.statistics.providerUsage.percentage} 
//                       sx={{ 
//                         height: 8, 
//                         borderRadius: 1,
//                         bgcolor: 'rgba(33, 136, 56, 0.1)',
//                         '& .MuiLinearProgress-bar': {
//                           bgcolor: '#218838'
//                         }
//                       }} 
//                     />
//                   </Box>
                  
//                   <Box sx={{ mt: 3 }}>
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
//                       <Typography variant="body2">Credential Usage</Typography>
//                       <Typography variant="body2" fontWeight="medium">
//                         {facilityData.statistics.credentialUsage.used}/{facilityData.statistics.credentialUsage.total}
//                       </Typography>
//                     </Box>
//                     <LinearProgress 
//                       variant="determinate" 
//                       value={facilityData.statistics.credentialUsage.percentage} 
//                       sx={{ 
//                         height: 8, 
//                         borderRadius: 1,
//                         bgcolor: 'rgba(33, 136, 56, 0.1)',
//                         '& .MuiLinearProgress-bar': {
//                           bgcolor: '#218838'
//                         }
//                       }} 
//                     />
//                   </Box>
                  
//                   <Button 
//                     variant="outlined"
//                     fullWidth
//                     sx={{ 
//                       mt: 4,
//                       color: '#218838',
//                       borderColor: '#218838',
//                       '&:hover': {
//                         borderColor: '#1e7e34',
//                         backgroundColor: 'rgba(33, 136, 56, 0.04)'
//                       }
//                     }}
//                   >
//                     Manage Subscription
//                   </Button>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default FacilityDashboard; 