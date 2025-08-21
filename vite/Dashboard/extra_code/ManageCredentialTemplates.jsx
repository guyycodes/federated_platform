// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Grid,
//   Button,
//   TextField,
//   MenuItem,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   Select,
//   IconButton,
//   Divider,
//   Alert,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   DialogContentText,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   ListItemSecondaryAction,
//   Tabs,
//   Tab
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import CloseIcon from '@mui/icons-material/Close';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import SaveIcon from '@mui/icons-material/Save';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { 
//   currentFacility, 
//   updateFacilityCredential, 
//   deleteFacilityCredential
// } from '../../data/facilitiesData';

// // Custom file upload input
// const VisuallyHiddenInput = styled('input')({
//   clip: 'rect(0 0 0 0)',
//   clipPath: 'inset(50%)',
//   height: 1,
//   overflow: 'hidden',
//   position: 'absolute',
//   bottom: 0,
//   left: 0,
//   whiteSpace: 'nowrap',
//   width: 1,
// });

// const ManageCredentialTemplates = () => {
//   const [facilityData, setFacilityData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedCredential, setSelectedCredential] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     type: '',
//     number: '',
//     issuingAuthority: '',
//     issueDate: '',
//     expiryDate: '',
//     notes: '',
//     documentUrl: null,
//     file: null // For document upload
//   });
//   const [errors, setErrors] = useState({});
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [tabValue, setTabValue] = useState(0);
  
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const credentialIdFromUrl = searchParams.get('id');

//   // Load facility data
//   useEffect(() => {
//     // In a real app, you'd fetch the latest data here
//     const timer = setTimeout(() => {
//       setFacilityData(currentFacility);
//       setLoading(false);
      
//       // If there's an ID in the URL, select that credential
//       if (credentialIdFromUrl) {
//         const credential = currentFacility.facilityCredentials.find(
//           c => c.id === parseInt(credentialIdFromUrl)
//         );
        
//         if (credential) {
//           setSelectedCredential(credential);
//           setFormData({
//             ...credential,
//             file: null
//           });
//           setEditMode(true);
//         }
//       }
//     }, 500);
    
//     return () => clearTimeout(timer);
//   }, [credentialIdFromUrl]);

//   // Handle tab change
//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue);
//   };

//   // Group credentials by type
//   const groupedCredentials = facilityData?.facilityCredentials.reduce((acc, credential) => {
//     if (!acc[credential.type]) {
//       acc[credential.type] = [];
//     }
//     acc[credential.type].push(credential);
//     return acc;
//   }, {}) || {};

//   // Handle credential selection
//   const handleCredentialSelect = (credential) => {
//     setSelectedCredential(credential);
//     setFormData({
//       ...credential,
//       file: null
//     });
//     setEditMode(false);
//     setErrors({});
//     setSuccessMessage('');
//   };

//   // Handle edit mode toggle
//   const handleEditToggle = () => {
//     setEditMode(!editMode);
//     if (!editMode) {
//       // Entering edit mode, keep current values
//     } else {
//       // Cancelling edit, revert to original values
//       setFormData({
//         ...selectedCredential,
//         file: null
//       });
//       setErrors({});
//     }
//   };

//   // Handle form field changes
//   const handleFormChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear error when field is updated
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null
//       });
//     }
//   };

//   // Handle file upload
//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setFormData({
//         ...formData,
//         file,
//         documentUrl: URL.createObjectURL(file) // Create temporary URL
//       });
//     }
//   };

//   // Remove uploaded file
//   const handleRemoveFile = () => {
//     setSelectedFile(null);
//     setFormData({
//       ...formData,
//       file: null,
//       documentUrl: selectedCredential.documentUrl // Revert to original URL
//     });
//   };

//   // Validate form data
//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.number.trim()) {
//       newErrors.number = 'Credential number is required';
//     }
    
//     if (!formData.issuingAuthority.trim()) {
//       newErrors.issuingAuthority = 'Issuing authority is required';
//     }
    
//     if (!formData.issueDate) {
//       newErrors.issueDate = 'Issue date is required';
//     }
    
//     if (!formData.expiryDate) {
//       newErrors.expiryDate = 'Expiry date is required';
//     } else if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
//       newErrors.expiryDate = 'Expiry date must be after issue date';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle save changes
//   const handleSaveChanges = () => {
//     if (validateForm()) {
//       // Determine status based on expiry date
//       const today = new Date();
//       const expiryDate = new Date(formData.expiryDate);
//       const thirtyDaysFromNow = new Date();
//       thirtyDaysFromNow.setDate(today.getDate() + 30);
      
//       let status;
//       if (expiryDate < today) {
//         status = 'Expired';
//       } else if (expiryDate <= thirtyDaysFromNow) {
//         status = 'Expiring Soon';
//       } else {
//         status = 'Active';
//       }
      
//       // Create updated credential object
//       const updatedCredential = {
//         ...formData,
//         status,
//         updatedAt: new Date().toISOString().split('T')[0]
//       };
      
//       // In a real app, you'd upload the file here and get a URL back
      
//       // Update credential in facility
//       const updatedFacility = updateFacilityCredential(facilityData, updatedCredential);
//       setFacilityData(updatedFacility);
      
//       // Update selected credential and exit edit mode
//       setSelectedCredential(updatedCredential);
//       setEditMode(false);
//       setSuccessMessage('Credential updated successfully!');
      
//       // Clear success message after 3 seconds
//       setTimeout(() => {
//         setSuccessMessage('');
//       }, 3000);
//     }
//   };

//   // Handle delete click
//   const handleDeleteClick = () => {
//     setOpenDeleteDialog(true);
//   };
  
//   const handleDeleteConfirm = () => {
//     // Delete credential from facility
//     const updatedFacility = deleteFacilityCredential(facilityData, selectedCredential.id);
//     setFacilityData(updatedFacility);
    
//     // Close dialog and reset selected credential
//     setOpenDeleteDialog(false);
//     setSelectedCredential(null);
    
//     // Navigate back to credentials list
//     navigate('/facility/credentials');
//   };
  
//   const handleDeleteCancel = () => {
//     setOpenDeleteDialog(false);
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <VerifiedUserIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Manage Credential Templates
//         </Typography>
//       </Box>
      
//       <Typography variant="body1" color="text.secondary" paragraph>
//         View, edit, or delete your facility's credential information. Select a credential from the list to manage it.
//       </Typography>
      
//       <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
//         {/* Credential List */}
//         <Box sx={{ 
//           width: { xs: '100%', md: '350px' },
//           flexShrink: 0
//         }}>
//           <Paper sx={{ mb: 3 }}>
//             <Tabs
//               value={tabValue}
//               onChange={handleTabChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               sx={{ 
//                 borderBottom: 1, 
//                 borderColor: 'divider',
//                 '& .MuiTab-root': {
//                   color: 'text.secondary',
//                   '&.Mui-selected': {
//                     color: '#218838',
//                   }
//                 }
//               }}
//             >
//               <Tab label="All" />
//               <Tab label="Active" />
//               <Tab label="Expiring" />
//               <Tab label="Expired" />
//             </Tabs>
            
//             {loading ? (
//               <Box sx={{ p: 3, textAlign: 'center' }}>
//                 <Typography variant="body2" color="text.secondary">
//                   Loading credentials...
//                 </Typography>
//               </Box>
//             ) : (
//               <List sx={{ p: 0, maxHeight: '60vh', overflow: 'auto' }}>
//                 {Object.entries(groupedCredentials).map(([type, credentials]) => {
//                   // Filter credentials based on selected tab
//                   let filteredCredentials = credentials;
//                   if (tabValue === 1) {
//                     filteredCredentials = credentials.filter(c => c.status === 'Active');
//                   } else if (tabValue === 2) {
//                     filteredCredentials = credentials.filter(c => c.status === 'Expiring Soon');
//                   } else if (tabValue === 3) {
//                     filteredCredentials = credentials.filter(c => c.status === 'Expired');
//                   }
                  
//                   if (filteredCredentials.length === 0) {
//                     return null;
//                   }
                  
//                   return (
//                     <React.Fragment key={type}>
//                       <ListItem sx={{ 
//                         bgcolor: 'action.hover', 
//                         py: 1,
//                         borderTop: '1px solid',
//                         borderColor: 'divider'
//                       }}>
//                         <ListItemText 
//                           primary={type} 
//                           primaryTypographyProps={{ 
//                             fontWeight: 'medium',
//                             color: 'text.primary'
//                           }}
//                         />
//                       </ListItem>
//                       {filteredCredentials.map((credential) => (
//                         <ListItemButton
//                           key={credential.id}
//                           selected={selectedCredential?.id === credential.id}
//                           onClick={() => handleCredentialSelect(credential)}
//                           sx={{ 
//                             borderLeft: selectedCredential?.id === credential.id ? 
//                               '4px solid #218838' : '4px solid transparent',
//                             '&.Mui-selected': {
//                               bgcolor: 'rgba(33, 136, 56, 0.08)',
//                             }
//                           }}
//                         >
//                           <ListItemText
//                             primary={credential.name}
//                             secondary={`Expires: ${credential.expiryDate}`}
//                             primaryTypographyProps={{ 
//                               color: 'text.primary' 
//                             }}
//                             secondaryTypographyProps={{
//                               color: 
//                                 credential.status === 'Expired' ? 'error.main' :
//                                 credential.status === 'Expiring Soon' ? 'warning.main' : 
//                                 'text.secondary'
//                             }}
//                           />
//                         </ListItemButton>
//                       ))}
//                     </React.Fragment>
//                   );
//                 })}
                
//                 {Object.keys(groupedCredentials).length === 0 && (
//                   <ListItem>
//                     <ListItemText 
//                       primary="No credentials found" 
//                       secondary="Add credentials from the 'Add Credential' page"
//                       primaryTypographyProps={{ color: 'text.primary' }}
//                       secondaryTypographyProps={{ color: 'text.secondary' }}
//                     />
//                   </ListItem>
//                 )}
//               </List>
//             )}
//           </Paper>
          
//           <Button
//             variant="outlined"
//             fullWidth
//             onClick={() => navigate('/facility/credentials/add')}
//             sx={{ mt: 2 }}
//           >
//             Add New Credential
//           </Button>
//         </Box>
        
//         {/* Credential Details */}
//         <Box sx={{ flexGrow: 1 }}>
//           {selectedCredential ? (
//             <Paper sx={{ p: 3 }}>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
//                 <Typography variant="h6">
//                   {selectedCredential.name}
//                 </Typography>
//                 <Box>
//                   {!editMode ? (
//                     <>
//                       <Button
//                         startIcon={<EditIcon />}
//                         onClick={handleEditToggle}
//                         sx={{ mr: 1 }}
//                       >
//                         Edit
//                       </Button>
//                       <Button
//                         startIcon={<DeleteIcon />}
//                         color="error"
//                         onClick={handleDeleteClick}
//                       >
//                         Delete
//                       </Button>
//                     </>
//                   ) : (
//                     <>
//                       <Button
//                         onClick={handleEditToggle}
//                         sx={{ mr: 1 }}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         startIcon={<SaveIcon />}
//                         variant="contained"
//                         onClick={handleSaveChanges}
//                         sx={{ 
//                           bgcolor: '#218838',
//                           '&:hover': {
//                             bgcolor: '#1e7e34'
//                           }
//                         }}
//                       >
//                         Save Changes
//                       </Button>
//                     </>
//                   )}
//                 </Box>
//               </Box>
              
//               {successMessage && (
//                 <Alert severity="success" sx={{ mb: 3 }}>
//                   {successMessage}
//                 </Alert>
//               )}
              
//               <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Credential Name"
//                     fullWidth
//                     name="name"
//                     value={formData.name}
//                     onChange={handleFormChange}
//                     disabled={!editMode}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Credential Type"
//                     fullWidth
//                     name="type"
//                     value={formData.type}
//                     onChange={handleFormChange}
//                     disabled={!editMode}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Credential Number"
//                     fullWidth
//                     name="number"
//                     value={formData.number}
//                     onChange={handleFormChange}
//                     disabled={!editMode}
//                     required={editMode}
//                     error={!!errors.number}
//                     helperText={errors.number}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <FormControl fullWidth required={editMode} error={!!errors.issuingAuthority} disabled={!editMode}>
//                     <InputLabel id="issuing-authority-label">Issuing Authority</InputLabel>
//                     <Select
//                       labelId="issuing-authority-label"
//                       id="issuingAuthority"
//                       name="issuingAuthority"
//                       value={formData.issuingAuthority}
//                       onChange={handleFormChange}
//                       label="Issuing Authority"
//                     >
//                       {[
//                         'State Department of Health',
//                         'The Joint Commission',
//                         'Centers for Medicare & Medicaid Services',
//                         'Drug Enforcement Administration',
//                         'Department of Public Health',
//                         'Centers for Disease Control',
//                         'College of American Pathologists',
//                         'Occupational Safety and Health Administration',
//                         'Local Fire Department',
//                         'American College of Radiology',
//                         'State Board of Pharmacy',
//                         'Environmental Protection Agency',
//                         'Other'
//                       ].map(authority => (
//                         <MenuItem key={authority} value={authority}>
//                           {authority}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                     {errors.issuingAuthority && (
//                       <FormHelperText>{errors.issuingAuthority}</FormHelperText>
//                     )}
//                   </FormControl>
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Issue Date"
//                     type="date"
//                     fullWidth
//                     name="issueDate"
//                     value={formData.issueDate}
//                     onChange={handleFormChange}
//                     disabled={!editMode}
//                     required={editMode}
//                     error={!!errors.issueDate}
//                     helperText={errors.issueDate}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     label="Expiry Date"
//                     type="date"
//                     fullWidth
//                     name="expiryDate"
//                     value={formData.expiryDate}
//                     onChange={handleFormChange}
//                     disabled={!editMode}
//                     required={editMode}
//                     error={!!errors.expiryDate}
//                     helperText={errors.expiryDate}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <TextField
//                     label="Notes"
//                     fullWidth
//                     multiline
//                     rows={3}
//                     name="notes"
//                     value={formData.notes}
//                     onChange={handleFormChange}
//                     disabled={!editMode}
//                   />
//                 </Grid>
                
//                 {/* Document Upload/View */}
//                 <Grid item xs={12}>
//                   <Divider sx={{ mb: 2 }} />
//                   <Typography variant="subtitle2" gutterBottom>
//                     Credential Document
//                   </Typography>
                  
//                   {formData.documentUrl ? (
//                     editMode ? (
//                       <Box sx={{ 
//                         display: 'flex', 
//                         alignItems: 'center', 
//                         p: 2, 
//                         border: '1px solid #e0e0e0',
//                         borderRadius: 1
//                       }}>
//                         <UploadFileIcon sx={{ color: '#218838', mr: 1 }} />
//                         <Box sx={{ flexGrow: 1 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
//                             {selectedFile?.name || 'Current Document'}
//                           </Typography>
//                           {selectedFile && (
//                             <Typography variant="caption" color="text.secondary">
//                               {(selectedFile.size / 1024).toFixed(1)} KB
//                             </Typography>
//                           )}
//                         </Box>
//                         <IconButton onClick={handleRemoveFile} size="small">
//                           <CloseIcon fontSize="small" />
//                         </IconButton>
//                       </Box>
//                     ) : (
//                       <Button
//                         startIcon={<UploadFileIcon />}
//                         variant="outlined"
//                         component="a"
//                         href={formData.documentUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         View Document
//                       </Button>
//                     )
//                   ) : (
//                     <Typography variant="body2" color="text.secondary">
//                       No document available
//                     </Typography>
//                   )}
                  
//                   {editMode && (
//                     <Button
//                       component="label"
//                       variant="outlined"
//                       startIcon={<UploadFileIcon />}
//                       sx={{ mt: 2 }}
//                     >
//                       {formData.documentUrl ? 'Replace Document' : 'Upload Document'}
//                       <VisuallyHiddenInput 
//                         type="file" 
//                         onChange={handleFileUpload}
//                         accept=".pdf,.jpg,.jpeg,.png"
//                       />
//                     </Button>
//                   )}
//                 </Grid>
//               </Grid>
//             </Paper>
//           ) : (
//             <Paper sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//               <Typography variant="h6" color="text.secondary" sx={{ mt: 4, mb: 2 }}>
//                 Select a credential to view or edit
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
//                 Choose a credential from the list on the left to view its details and manage it.
//               </Typography>
//             </Paper>
//           )}
//         </Box>
//       </Box>
      
//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDeleteDialog}
//         onClose={handleDeleteCancel}
//         aria-labelledby="delete-dialog-title"
//         aria-describedby="delete-dialog-description"
//       >
//         <DialogTitle id="delete-dialog-title">
//           Delete Credential?
//         </DialogTitle>
//         <DialogContent>
//           <DialogContentText id="delete-dialog-description">
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

// export default ManageCredentialTemplates; 