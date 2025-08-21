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
//   Chip,
//   Button,
//   TextField,
//   InputAdornment,
//   Card,
//   CardContent,
//   Grid,
//   IconButton,
//   Menu,
//   MenuItem,
//   ListItemIcon,
//   ListItemText,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle
// } from '@mui/material';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DownloadIcon from '@mui/icons-material/Download';
// import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
// import DescriptionIcon from '@mui/icons-material/Description';
// import { useNavigate } from 'react-router-dom';
// import { currentFacility, deleteFacilityCredential } from '../../data/facilitiesData';

// const Appointments = () => {
//   const [facilityData, setFacilityData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [selectedCredential, setSelectedCredential] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
//   const navigate = useNavigate();

//   // Load facility data
//   useEffect(() => {
//     // In a real app, you'd fetch the latest data here
//     const timer = setTimeout(() => {
//       setFacilityData(currentFacility);
//       setLoading(false);
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, []);

//   // Handle pagination
//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   // Handle search
//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//     setPage(0);
//   };

//   // Handle menu open/close
//   const handleMenuOpen = (event, credential) => {
//     setAnchorEl(event.currentTarget);
//     setSelectedCredential(credential);
//   };
  
//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   // Handle actions
//   const handleAddCredential = () => {
//     navigate('/facility/credentials/add');
//   };
  
//   const handleEditCredential = () => {
//     handleMenuClose();
//     navigate(`/facility/credentials/templates?id=${selectedCredential.id}`);
//   };
  
//   const handleDeleteClick = () => {
//     handleMenuClose();
//     setOpenDeleteDialog(true);
//   };
  
//   const handleDeleteConfirm = () => {
//     // In a real app, you'd make an API call here
//     const updatedFacility = deleteFacilityCredential(facilityData, selectedCredential.id);
//     setFacilityData(updatedFacility);
//     setOpenDeleteDialog(false);
//   };
  
//   const handleDeleteCancel = () => {
//     setOpenDeleteDialog(false);
//   };
  
//   const handleDownloadDocument = () => {
//     handleMenuClose();
//     // In a real app, this would trigger a download
//     alert(`Downloading document: ${selectedCredential.name}`);
//   };

//   // Get status chip properties
//   const getStatusChip = (status) => {
//     switch(status) {
//       case 'Active':
//         return { 
//           color: 'success', 
//           bgcolor: 'rgba(46, 125, 50, 0.15)', 
//           textColor: '#2e7d32', 
//           border: '1px solid rgba(46, 125, 50, 0.3)' 
//         };
//       case 'Expiring Soon':
//         return { 
//           color: 'warning', 
//           bgcolor: 'rgba(237, 108, 2, 0.15)', 
//           textColor: '#ed6c02',
//           border: '1px solid rgba(237, 108, 2, 0.3)'
//         };
//       case 'Expired':
//         return { 
//           color: 'error', 
//           bgcolor: 'rgba(211, 47, 47, 0.15)', 
//           textColor: '#d32f2f',
//           border: '1px solid rgba(211, 47, 47, 0.3)'
//         };
//       default:
//         return { 
//           color: 'default', 
//           bgcolor: 'rgba(0, 0, 0, 0.12)', 
//           textColor: 'text.primary',
//           border: '1px solid rgba(0, 0, 0, 0.23)'
//         };
//     }
//   };

//   // Filter credentials based on search term
//   const filteredCredentials = facilityData?.facilityCredentials?.filter(
//     credential => 
//       credential.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       credential.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       credential.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   // Get current page of credentials
//   const currentCredentials = filteredCredentials.slice(
//     page * rowsPerPage,
//     page * rowsPerPage + rowsPerPage
//   );

//   // Count credentials by status
//   const stats = facilityData?.statistics?.facilityCredentials || {
//     total: 0,
//     active: 0,
//     expiring: 0,
//     expired: 0
//   };

//   // Summary cards with key stats
//   const StatCard = ({ title, value, icon, color }) => (
//     <Card>
//       <CardContent sx={{ p: 2 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
//             <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{loading ? '-' : value}</Typography>
//           </Box>
//           <Box sx={{ bgcolor: `${color}20`, p: 1, borderRadius: '50%' }}>
//             {icon}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <VerifiedUserIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Facility Credentials
//         </Typography>
//       </Box>
      
//       {/* Stats Row */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Total Credentials" 
//             value={stats.total} 
//             icon={<DescriptionIcon sx={{ color: '#218838' }} />} 
//             color="#218838"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Active Credentials" 
//             value={stats.active} 
//             icon={<VerifiedUserIcon sx={{ color: '#4caf50' }} />} 
//             color="#4caf50"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Expiring Soon" 
//             value={stats.expiring} 
//             icon={<AssignmentLateIcon sx={{ color: '#ff9800' }} />} 
//             color="#ff9800"
//           />
//         </Grid>
//         <Grid item xs={12} sm={6} md={3}>
//           <StatCard 
//             title="Expired" 
//             value={stats.expired} 
//             icon={<AssignmentLateIcon sx={{ color: '#f44336' }} />} 
//             color="#f44336"
//           />
//         </Grid>
//       </Grid>
      
//       {/* Search & Actions Row */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
//           <TextField
//             placeholder="Search credentials..."
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
        
//         <Button
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={handleAddCredential}
//           sx={{ 
//             bgcolor: '#218838',
//             '&:hover': {
//               bgcolor: '#1e7e34'
//             }
//           }}
//         >
//           Add New Credential
//         </Button>
//       </Box>
      
//       {/* Credentials Table */}
//       <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//         <TableContainer>
//           <Table sx={{ minWidth: 650 }} aria-label="credentials table">
//             <TableHead>
//               <TableRow sx={{ bgcolor: 'rgba(33, 136, 56, 0.05)' }}>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Credential Name</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>ID Number</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Issuing Authority</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Expiry Date</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
//                 <TableCell sx={{ fontWeight: 'bold' }} align="center">Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {!loading && currentCredentials.map((credential) => (
//                 <TableRow 
//                   key={credential.id}
//                   sx={{ 
//                     '&:last-child td, &:last-child th': { border: 0 },
//                     '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
//                   }}
//                 >
//                   <TableCell component="th" scope="row">
//                     {credential.name}
//                   </TableCell>
//                   <TableCell>{credential.type}</TableCell>
//                   <TableCell>{credential.number}</TableCell>
//                   <TableCell>{credential.issuingAuthority}</TableCell>
//                   <TableCell>{credential.expiryDate}</TableCell>
//                   <TableCell>
//                     <Chip 
//                       label={credential.status} 
//                       size="small"
//                       sx={{ 
//                         bgcolor: getStatusChip(credential.status).bgcolor,
//                         color: getStatusChip(credential.status).textColor,
//                         border: getStatusChip(credential.status).border,
//                         fontWeight: 500
//                       }} 
//                     />
//                   </TableCell>
//                   <TableCell align="center">
//                     <IconButton
//                       aria-label="more"
//                       aria-controls="credential-menu"
//                       aria-haspopup="true"
//                       onClick={(e) => handleMenuOpen(e, credential)}
//                     >
//                       <MoreVertIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
              
//               {!loading && currentCredentials.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
//                     <Typography variant="body1" color="text.secondary">
//                       No credentials found
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               )}
              
//               {loading && Array.from(new Array(3)).map((_, index) => (
//                 <TableRow key={index}>
//                   <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
//                     <Typography variant="body2" color="text.secondary">
//                       Loading credentials...
//                     </Typography>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={filteredCredentials.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
      
//       {/* Credential Actions Menu */}
//       <Menu
//         id="credential-menu"
//         anchorEl={anchorEl}
//         keepMounted
//         open={Boolean(anchorEl)}
//         onClose={handleMenuClose}
//       >
//         <MenuItem onClick={handleEditCredential}>
//           <ListItemIcon>
//             <EditIcon fontSize="small" />
//           </ListItemIcon>
//           <ListItemText primary="Edit" />
//         </MenuItem>
//         {selectedCredential?.documentUrl && (
//           <MenuItem onClick={handleDownloadDocument}>
//             <ListItemIcon>
//               <DownloadIcon fontSize="small" />
//             </ListItemIcon>
//             <ListItemText primary="Download" />
//           </MenuItem>
//         )}
//         <MenuItem onClick={handleDeleteClick}>
//           <ListItemIcon>
//             <DeleteIcon fontSize="small" color="error" />
//           </ListItemIcon>
//           <ListItemText primary="Delete" primaryTypographyProps={{ color: 'error' }} />
//         </MenuItem>
//       </Menu>
      
//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={handleDeleteCancel}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//           {"Delete Credential?"}
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete this credential? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleDeleteCancel}>Cancel</Button>
//           <Button onClick={handleDeleteConfirm} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Appointments; 