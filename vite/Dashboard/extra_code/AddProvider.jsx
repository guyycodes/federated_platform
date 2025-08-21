// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   TextField,
//   InputAdornment,
//   Button,
//   Paper,
//   Grid,
//   Card,
//   CardContent,
//   Divider,
//   List,
//   ListItem,
//   ListItemText,
//   Avatar,
//   Chip,
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   Alert,
//   Tooltip
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import PersonAddIcon from '@mui/icons-material/PersonAdd';
// import BusinessIcon from '@mui/icons-material/Business';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import CancelIcon from '@mui/icons-material/Cancel';
// import QrCodeIcon from '@mui/icons-material/QrCode';
// import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
// import { useNavigate } from 'react-router-dom';
// import { generateProviderDetails, statisticsCategories, sampleProviders } from '../../data/providerDetails';
// import { currentFacility, addProviderToFacility } from '../../data/facilitiesData';

// const AddProvider = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProvider, setSelectedProvider] = useState(null);
//   const [detailedProviders, setDetailedProviders] = useState([]);
//   const [displaySearchResults, setDisplaySearchResults] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Generate detailed provider data
//     const details = generateProviderDetails(sampleProviders);
//     setDetailedProviders(details);
//   }, []);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     if (event.target.value.length > 0) {
//       setDisplaySearchResults(true);
//     } else {
//       setDisplaySearchResults(false);
//     }
//     setSelectedProvider(null);
//   };

//   const handleProviderSelect = (provider) => {
//     const detailedProvider = detailedProviders.find(p => p.id === provider.id);
//     setSelectedProvider(detailedProvider);
//     setDisplaySearchResults(false);
//   };

//   const handleApproveProvider = () => {
//     // Add the provider to the facility
//     const updatedFacility = addProviderToFacility(currentFacility, selectedProvider);
    
//     // In a real app, you would save this updated facility data to your backend
//     // For now, we'll just show an alert and navigate back
//     alert(`Provider ${selectedProvider.name} has been approved and added to your facility.`);
//     navigate('/facility/providers');
//   };

//   const handleRejectProvider = () => {
//     // Here you would implement the logic to reject the provider
//     setSelectedProvider(null);
//     setSearchTerm('');
//   };

//   // Filter providers based on search term
//   const filteredProviders = sampleProviders.filter(
//     provider => 
//       provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       provider.specialty.toLowerCase().includes(searchTerm.toLowerCase())
//   );

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

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <PersonAddIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Add Provider
//         </Typography>
//       </Box>
      
//       <Alert severity="info" sx={{ mb: 3 }}>
//         Search for providers in the database to review their credentials and add them to your facility.
//       </Alert>
      
//       {/* Search Box */}
//       <Paper sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Search for Providers
//         </Typography>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <TextField
//             placeholder="Search by name or specialty..."
//             variant="outlined"
//             fullWidth
//             value={searchTerm}
//             onChange={handleSearch}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon color="action" />
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Box>
        
//         {/* Search Results */}
//         {displaySearchResults && searchTerm && (
//           <Paper elevation={3} sx={{ mt: 2, maxHeight: '300px', overflow: 'auto' }}>
//             <List>
//               {filteredProviders.length > 0 ? (
//                 filteredProviders.map((provider) => (
//                   <ListItem 
//                     key={provider.id} 
//                     button 
//                     onClick={() => handleProviderSelect(provider)}
//                     sx={{
//                       '&:hover': { bgcolor: 'rgba(33, 136, 56, 0.04)' }
//                     }}
//                   >
//                     <ListItemText 
//                       primary={provider.name} 
//                       secondary={`${provider.specialty} • ${provider.status}`}
//                     />
//                     <Chip 
//                       label={provider.verificationStatus} 
//                       size="small"
//                       color={
//                         provider.verificationStatus === 'Verified' 
//                           ? 'success' 
//                           : provider.verificationStatus === 'Pending' 
//                             ? 'warning' 
//                             : 'error'
//                       }
//                       variant="outlined"
//                     />
//                   </ListItem>
//                 ))
//               ) : (
//                 <ListItem>
//                   <ListItemText primary="No providers found" />
//                 </ListItem>
//               )}
//             </List>
//           </Paper>
//         )}
//       </Paper>
      
//       {/* Selected Provider Details */}
//       {selectedProvider && (
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <Grid container spacing={3}>
//             {/* Provider Profile */}
//             <Grid item xs={12} md={8}>
//               <Box sx={{ display: 'flex', mb: 3 }}>
//                 <Avatar 
//                   sx={{ 
//                     width: 80, 
//                     height: 80, 
//                     bgcolor: '#218838',
//                     color: 'white',
//                     fontSize: '1.8rem',
//                     mr: 2
//                   }}
//                 >
//                   {selectedProvider.name.split(' ').map(n => n[0]).join('')}
//                 </Avatar>
//                 <Box>
//                   <Typography variant="h5" gutterBottom>
//                     {selectedProvider.name}
//                     <Chip 
//                       label={selectedProvider.status} 
//                       size="small"
//                       sx={{ 
//                         ml: 2,
//                         bgcolor: selectedProvider.status === 'Active' ? '#e6f4ea' : '#fdeded',
//                         color: selectedProvider.status === 'Active' ? '#1e7e34' : '#d32f2f',
//                         fontWeight: 500
//                       }} 
//                     />
//                   </Typography>
//                   <Typography variant="subtitle1" color="text.secondary" gutterBottom>
//                     {selectedProvider.specialty}
//                   </Typography>
//                   <Typography variant="body1">
//                     {selectedProvider.bio}
//                   </Typography>
//                 </Box>
//               </Box>
              
//               <Divider sx={{ my: 3 }} />
              
//               {/* Career Statistics */}
//               <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
//                 Career Statistics
//               </Typography>
//               <Box sx={{ bgcolor: 'rgba(33, 136, 56, 0.05)', p: 2, borderRadius: 1, mb: 3 }}>
//                 <Grid container spacing={2}>
//                   {selectedProvider && selectedProvider.providerType && getStatCategories(selectedProvider.providerType).map((stat) => (
//                     <Grid item xs={6} sm={4} md={4} key={stat.id}>
//                       <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
//                         <Typography variant="caption" color="text.secondary">
//                           {stat.label}
//                         </Typography>
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
//                           {renderStatValue(stat.id, selectedProvider.careerStats || {})}
//                         </Typography>
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
              
//               {/* Employment History */}
//               <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
//                 Employment History
//               </Typography>
              
//               {selectedProvider.facilities && selectedProvider.facilities.map((facility) => (
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
//                       {selectedProvider && selectedProvider.providerType && getStatCategories(selectedProvider.providerType).map((stat) => (
//                         <Grid item xs={6} sm={4} md={4} key={stat.id}>
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
//                   </AccordionDetails>
//                 </Accordion>
//               ))}
//             </Grid>
            
//             {/* QR Code and Verification Section */}
//             <Grid item xs={12} md={4}>
//               <Card variant="outlined">
//                 <CardContent>
//                   <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
//                     Credential Verification
//                   </Typography>
                  
//                   {/* QR Code Placeholder */}
//                   <Box 
//                     sx={{ 
//                       display: 'flex', 
//                       flexDirection: 'column', 
//                       alignItems: 'center',
//                       border: '1px dashed #ccc',
//                       borderRadius: 1,
//                       p: 4,
//                       mb: 3
//                     }}
//                   >
//                     {selectedProvider.qrCode.isShared ? (
//                       <>
//                         <QrCodeIcon sx={{ fontSize: 100, color: '#218838', mb: 2 }} />
//                         <Typography variant="subtitle2" align="center">
//                           QR Code for credential verification and HIPAA logs
//                         </Typography>
//                         <Chip 
//                           label="Shared by Provider" 
//                           color="success" 
//                           size="small"
//                           sx={{ mt: 1 }}
//                         />
//                         <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
//                           Shared on: {selectedProvider.qrCode.sharedDate}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           Valid until: {selectedProvider.qrCode.expiryDate}
//                         </Typography>
//                       </>
//                     ) : (
//                       <>
//                         <QrCodeIcon sx={{ fontSize: 100, color: '#218838', opacity: 0.3, mb: 2 }} />
//                         <Typography variant="subtitle2" color="text.secondary" align="center">
//                           Provider has not shared their QR code yet
//                         </Typography>
//                         <Chip 
//                           label="Not Shared" 
//                           color="warning" 
//                           size="small"
//                           sx={{ mt: 1 }}
//                         />
//                       </>
//                     )}
//                   </Box>
                  
//                   {/* HIPAA Logs - only shown if QR is shared */}
//                   {selectedProvider.qrCode.isShared && (
//                     <Box sx={{ mb: 3 }}>
//                       <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'medium' }}>
//                         HIPAA Compliance Logs
//                       </Typography>
//                       <List sx={{ bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: 1 }}>
//                         {selectedProvider.hipaaLogs && selectedProvider.hipaaLogs.map((log, index) => (
//                           <React.Fragment key={index}>
//                             <ListItem alignItems="flex-start">
//                               <ListItemText
//                                 primary={log.action}
//                                 secondary={
//                                   <>
//                                     <Typography component="span" variant="body2" color="text.primary">
//                                       {log.actor}
//                                     </Typography>
//                                     {` — ${log.date}`}
//                                   </>
//                                 }
//                               />
//                             </ListItem>
//                             {index < selectedProvider.hipaaLogs.length - 1 && <Divider component="li" />}
//                           </React.Fragment>
//                         ))}
//                       </List>
//                     </Box>
//                   )}
                  
//                   {/* Verification Summary */}
//                   <List>
//                     <ListItem>
//                       <ListItemText 
//                         primary="Credential Status" 
//                         secondary={selectedProvider.verificationStatus} 
//                         secondaryTypographyProps={{
//                           component: 'span',
//                           sx: { 
//                             display: 'inline-flex',
//                             alignItems: 'center',
//                             color: selectedProvider.verificationStatus === 'Verified' ? '#1e7e34' : '#d32f2f'
//                           }
//                         }}
//                       />
//                       {selectedProvider.verificationStatus === 'Verified' ? 
//                         <CheckCircleIcon color="success" /> : 
//                         <CancelIcon color="error" />
//                       }
//                     </ListItem>
//                     <Divider component="li" />
//                     <ListItem>
//                       <ListItemText 
//                         primary="Last Verification" 
//                         secondary={selectedProvider.lastUpdated} 
//                       />
//                     </ListItem>
//                     <Divider component="li" />
//                     <ListItem>
//                       <ListItemText 
//                         primary="QR Code Status" 
//                         secondary={selectedProvider.qrCode.isShared ? "Shared by provider" : "Not shared"} 
//                         secondaryTypographyProps={{
//                           sx: { 
//                             color: selectedProvider.qrCode.isShared ? '#1e7e34' : '#d32f2f'
//                           }
//                         }}
//                       />
//                       {selectedProvider.qrCode.isShared ? 
//                         <CheckCircleIcon color="success" /> : 
//                         <CancelIcon color="error" />
//                       }
//                     </ListItem>
//                     <Divider component="li" />
//                     <ListItem>
//                       <ListItemText 
//                         primary="HIPAA Compliance" 
//                         secondary={selectedProvider.qrCode.isShared ? 
//                           `${selectedProvider.hipaaLogs.length} logged activities` : 
//                           "Logs unavailable until QR shared"
//                         } 
//                       />
//                       <HealthAndSafetyIcon 
//                         color={selectedProvider.qrCode.isShared ? "primary" : "disabled"} 
//                       />
//                     </ListItem>
//                   </List>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
          
//           {/* Action Buttons */}
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
//             <Button
//               variant="outlined"
//               color="error"
//               startIcon={<CancelIcon />}
//               onClick={handleRejectProvider}
//               sx={{ px: 4 }}
//             >
//               Reject
//             </Button>
//             <Tooltip 
//               title={!selectedProvider.qrCode.isShared ? "Provider must share QR code with credential information before approval" : ""}
//               arrow
//             >
//               <span>
//                 <Button
//                   variant="contained"
//                   startIcon={<PersonAddIcon />}
//                   onClick={handleApproveProvider}
//                   disabled={!selectedProvider.qrCode.isShared}
//                   sx={{ 
//                     bgcolor: '#218838',
//                     '&:hover': {
//                       bgcolor: '#1e7e34'
//                     },
//                     px: 4
//                   }}
//                 >
//                   Approve & Add to Facility
//                 </Button>
//               </span>
//             </Tooltip>
//           </Box>
//         </Paper>
//       )}
      
//       {/* Empty State - No Provider Selected */}
//       {!selectedProvider && !displaySearchResults && (
//         <Paper sx={{ p: 5, mb: 3, textAlign: 'center' }}>
//           <PersonAddIcon sx={{ fontSize: 100, color: '#21883840', mb: 2 }} />
//           <Typography variant="h5" gutterBottom>
//             Search for a Provider
//           </Typography>
//           <Typography variant="body1" color="text.secondary" paragraph>
//             Enter a provider's name or specialty in the search box above to find and review their credentials.
//           </Typography>
//         </Paper>
//       )}
//     </Box>
//   );
// };

// export default AddProvider; 