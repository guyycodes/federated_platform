// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   Button,
//   TextField,
//   InputAdornment,
//   Chip,
//   Card,
//   CardContent,
//   Grid,
//   Collapse,
//   IconButton,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Avatar,
//   LinearProgress,
//   Stack,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails
// } from '@mui/material';
// import PeopleIcon from '@mui/icons-material/People';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
// import PendingActionsIcon from '@mui/icons-material/PendingActions';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import BusinessIcon from '@mui/icons-material/Business';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { useNavigate } from 'react-router-dom';
// import { generateProviderDetails, statisticsCategories, sampleProviders } from '../../data/providerDetails';

// // Provider Row with expandable details
// const ProviderRow = ({ provider, detailedProvider }) => {
//   const [open, setOpen] = useState(false);
//   const navigate = useNavigate();

//   // Determine chip color based on verification status
//   const getStatusChipColor = (status) => {
//     switch(status) {
//       case 'Verified':
//         return { color: 'success', bgcolor: '#e6f4ea' };
//       case 'Pending':
//         return { color: 'warning', bgcolor: '#fff8e1' };
//       case 'Expired':
//         return { color: 'error', bgcolor: '#fdeded' };
//       default:
//         return { color: 'default', bgcolor: '#f5f5f5' };
//     }
//   };

//   // Get the correct stat categories based on provider type
//   const getStatCategories = (type) => {
//     if (!type || !statisticsCategories[type]) {
//       return [];
//     }
//     return statisticsCategories[type] || [];
//   };

//   // Determine if a provider has a specific statistic
//   const hasStatistic = (statId, stats) => {
//     return stats && typeof stats[statId] !== 'undefined';
//   };

//   // Renders the value of a statistic
//   const renderStatValue = (statId, stats, isBadge = false) => {
//     if (!hasStatistic(statId, stats)) return '-';
    
//     const value = stats[statId];
    
//     if (isBadge) {
//       let color = 'primary';
//       if (statId === 'patientSatisfaction' && value >= 4.5) color = 'success';
//       if (statId === 'caseClosureRate' && parseFloat(value) >= 85) color = 'success';
      
//       return (
//         <Chip 
//           label={value} 
//           color={color} 
//           size="small" 
//           variant="outlined"
//           sx={{ fontWeight: 500 }}
//         />
//       );
//     }
    
//     return value;
//   };

//   // Handle row click
//   const handleRowClick = (event) => {
//     // Don't navigate if clicking the expand button
//     if (event.target.closest('button')) {
//       return;
//     }
//     navigate(`/facility/providers/${provider.id}`);
//   };

//   return (
//     <>
//       <TableRow 
//         hover
//         sx={{ 
//           '&:last-child td, &:last-child th': { border: 0 },
//           cursor: 'pointer',
//           '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
//         }}
//       >
//         <TableCell padding="checkbox">
//           <IconButton
//             aria-label="expand row"
//             size="small"
//             onClick={() => setOpen(!open)}
//           >
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row" onClick={handleRowClick}>
//           {provider.name}
//         </TableCell>
//         <TableCell onClick={handleRowClick}>{provider.specialty}</TableCell>
//         <TableCell onClick={handleRowClick}>
//           <Chip 
//             label={provider.status} 
//             size="small"
//             sx={{ 
//               bgcolor: provider.status === 'Active' ? '#e6f4ea' : '#fdeded',
//               color: provider.status === 'Active' ? '#1e7e34' : '#d32f2f',
//               fontWeight: 500
//             }} 
//           />
//         </TableCell>
//         <TableCell onClick={handleRowClick}>{provider.lastUpdated}</TableCell>
//       </TableRow>
      
//       {/* Expanded Details Row */}
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ py: 3, px: 2 }}>
//               {/* Provider Bio Section */}
//               <Box sx={{ display: 'flex', mb: 3 }}>
//                 <Avatar 
//                   sx={{ 
//                     width: 64, 
//                     height: 64, 
//                     bgcolor: '#218838',
//                     color: 'white',
//                     fontSize: '1.5rem',
//                     mr: 2
//                   }}
//                 >
//                   {provider.name.split(' ').map(n => n[0]).join('')}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h6" gutterBottom>
//                     {provider.name}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {detailedProvider.bio}
//                   </Typography>
//                 </Box>
//               </Box>
              
//               {/* Career Highlights */}
//               <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', mt: 2 }}>
//                 Career Statistics
//               </Typography>
//               <Box sx={{ bgcolor: 'rgba(33, 136, 56, 0.05)', p: 2, borderRadius: 1, mb: 3 }}>
//                 <Grid container spacing={2}>
//                   {detailedProvider && detailedProvider.providerType && getStatCategories(detailedProvider.providerType).map((stat) => (
//                     <Grid item xs={6} sm={4} md={2} key={stat.id}>
//                       <Box sx={{ textAlign: 'center' }}>
//                         <Typography variant="caption" color="text.secondary">
//                           {stat.label}
//                         </Typography>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                           {renderStatValue(stat.id, detailedProvider.careerStats || {})}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
              
//               {/* Employment History */}
//               <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
//                 Employment History
//               </Typography>
              
//               {detailedProvider.facilities && detailedProvider.facilities.map((facility) => (
//                 <Accordion key={facility.facilityId} sx={{ mb: 1 }}>
//                   <AccordionSummary
//                     expandIcon={<ExpandMoreIcon />}
//                     aria-controls={`facility-${facility.facilityId}-content`}
//                     id={`facility-${facility.facilityId}-header`}
//                     sx={{ 
//                       bgcolor: facility.isCurrent ? 'rgba(33, 136, 56, 0.05)' : 'transparent',
//                       '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
//                     }}
//                   >
//                     <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
//                       <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <BusinessIcon sx={{ color: facility.isCurrent ? '#218838' : 'text.secondary', mr: 1 }} />
//                           <Typography sx={{ fontWeight: facility.isCurrent ? 'bold' : 'regular' }}>
//                             {facility.facilityName}
//                             {facility.isCurrent && (
//                               <Chip 
//                                 label="Current" 
//                                 size="small" 
//                                 color="primary" 
//                                 sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
//                               />
//                             )}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <CalendarMonthIcon sx={{ color: 'text.secondary', fontSize: 'small', mr: 0.5 }} />
//                           <Typography variant="body2" color="text.secondary">
//                             {new Date(facility.startDate).getFullYear()} - {facility.endDate ? new Date(facility.endDate).getFullYear() : 'Present'}
//                           </Typography>
//                         </Box>
//                       </Box>
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                         {facility.facilityType} • {facility.facilityLocation}
//                       </Typography>
//                     </Box>
//                   </AccordionSummary>
//                   <AccordionDetails sx={{ bgcolor: 'rgba(0, 0, 0, 0.01)' }}>
//                     <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
//                       Facility Statistics
//                     </Typography>
//                     <Grid container spacing={2} sx={{ mb: 2 }}>
//                       {detailedProvider && detailedProvider.providerType && getStatCategories(detailedProvider.providerType).map((stat) => (
//                         <Grid item xs={6} sm={4} md={2} key={stat.id}>
//                           <Box sx={{ p: 1, border: '1px solid #eee', borderRadius: 1, textAlign: 'center' }}>
//                             <Typography variant="caption" color="text.secondary">
//                               {stat.label}
//                             </Typography>
//                             <Typography variant="body1" sx={{ fontWeight: 'medium', mt: 0.5 }}>
//                               {renderStatValue(stat.id, facility.statistics || {})}
//                             </Typography>
//                           </Box>
//                         </Grid>
//                       ))}
//                     </Grid>
                    
//                     <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
//                       <Button 
//                         size="small" 
//                         variant="outlined"
//                         sx={{ 
//                           borderColor: '#218838',
//                           color: '#218838',
//                           '&:hover': {
//                             borderColor: '#1e7e34',
//                             bgcolor: 'rgba(33, 136, 56, 0.04)'
//                           }
//                         }}
//                       >
//                         View Full Record
//                       </Button>
//                     </Box>
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// };

// const FacilityProviders = () => {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [detailedProviders, setDetailedProviders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Generate detailed provider data
//     const details = generateProviderDetails(sampleProviders);
//     setDetailedProviders(details);
//   }, []);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     setPage(0);
//   };

//   const handleAddProvider = () => {
//     navigate('/facility/providers/add');
//   };

//   // Filter providers based on search term
//   const filteredProviders = sampleProviders.filter(
//     provider => 
//       provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Get current page of providers
//   const currentProviders = filteredProviders.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   // Count providers by status
//   const activeProviders = sampleProviders.filter(p => p.status === 'Active').length;
//   const pendingVerifications = sampleProviders.filter(p => p.verificationStatus === 'Pending').length;

//   // Summary cards with key stats
//   const StatCard = ({ title, value, icon, color }) => (
//     <Card>
//       <CardContent sx={{ p: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
//             <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{value}</Typography>
//           </Box>
//           <Box sx={{ bgcolor: `${color}20`, p: 1, borderRadius: '50%' }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   // Find the detailed provider for a given provider
//   const getDetailedProvider = (provider) => {
//     const detailedProvider = detailedProviders.find(p => p.id === provider.id);
//     if (!detailedProvider) {
//       // Create a basic structure if no detailed provider found
//       return {
//         ...provider,
//         bio: `${provider.name} is a healthcare provider specializing in ${provider.specialty}.`,
//         providerType: 'doctor', // Default type
//         careerStats: {},
//         facilities: []
//       };
//     }
//     return detailedProvider;
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <PeopleIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Providers
//         </Typography>
//       </Box>
      
//       {/* Stats Row */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard 
//             title="Total Providers" 
//             value={sampleProviders.length} 
//             icon={<PeopleIcon sx={{ color: '#218838' }} />} 
//             color="#218838"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard 
//             title="Active Providers" 
//             value={activeProviders} 
//             icon={<HealthAndSafetyIcon sx={{ color: '#4caf50' }} />} 
//             color="#4caf50"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={4}>
//           <StatCard 
//             title="Pending Verifications" 
//             value={pendingVerifications} 
//             icon={<PendingActionsIcon sx={{ color: '#ff9800' }} />} 
//             color="#ff9800"
//           />
//         </Grid>
//       </Grid>
      
//       {/* Search & Actions Row */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <TextField
//             placeholder="Search providers..."
//             variant="outlined"
//             size="small"
//             value={searchTerm}
//             onChange={handleSearch}
//             sx={{ width: { xs: '100%', sm: '300px' } }}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//           <Button
//             variant="outlined"
//             startIcon={<FilterListIcon />}
//             sx={{ 
//               borderColor: '#c4c4c4',
//               color: 'text.primary',
//               '&:hover': {
//                 borderColor: '#888',
//                 bgcolor: 'rgba(0, 0, 0, 0.04)'
//               }
//             }}
//           >
//             Filter
//           </Button>
//         </Box>
        
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="outlined"
//             startIcon={<PersonAddIcon />}
//             sx={{ 
//               borderColor: '#218838',
//               color: '#218838',
//               '&:hover': {
//                 borderColor: '#1e7e34',
//                 bgcolor: 'rgba(33, 136, 56, 0.04)'
//               },
//               display: { xs: 'none', md: 'flex' }
//             }}
//           >
//             Invite Provider
//           </Button>
//         </Box>
//       </Box>
      
//       {/* Providers Table */}
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer>
//           <Table sx={{ minWidth: 650 }} aria-label="providers table">
//             <TableHead>
//               <TableRow sx={{ bgcolor: 'rgba(33, 136, 56, 0.05)' }}>
//                 <TableCell padding="checkbox" />
//                 <TableCell sx={{ fontWeight: 'bold' }}>Provider Name</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Specialty</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Last Updated</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {currentProviders.map((provider) => (
//                 <ProviderRow 
//                   key={provider.id} 
//                   provider={provider} 
//                   detailedProvider={getDetailedProvider(provider)}
//                 />
//               ))}
              
//               {currentProviders.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       No providers found
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={filteredProviders.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </Box>
//   );
// };

// export default FacilityProviders; 