// import React, { useState, useEffect } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Grid,
//   Card,
//   CardContent,
//   CardActionArea,
//   TextField,
//   MenuItem,
//   Button,
//   Divider,
//   Alert,
//   Stepper,
//   Step,
//   StepLabel,
//   FormControl,
//   FormHelperText,
//   InputLabel,
//   Select,
//   IconButton,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle
// } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import CloseIcon from '@mui/icons-material/Close';
// import { useNavigate } from 'react-router-dom';
// import { currentFacility, facilityCredentialTypes, addCredentialToFacility } from '../../data/facilitiesData';

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

// const AddFacilityCredential = () => {
//   const [facilityData, setFacilityData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeStep, setActiveStep] = useState(0);
//   const [selectedCredentialType, setSelectedCredentialType] = useState(null);
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
//   const [successDialogOpen, setSuccessDialogOpen] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
  
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

//   // Group credential types by category
//   const groupedCredentialTypes = facilityCredentialTypes.reduce((acc, type) => {
//     if (!acc[type.category]) {
//       acc[type.category] = [];
//     }
//     acc[type.category].push(type);
//     return acc;
//   }, {});

//   // Handle credential type selection
//   const handleCredentialTypeSelect = (type) => {
//     setSelectedCredentialType(type);
//     setFormData({
//       ...formData,
//       name: type.name,
//       type: type.category,
//       number: '',
//       issuingAuthority: '',
//       issueDate: '',
//       expiryDate: '',
//       notes: '',
//       documentUrl: null,
//       file: null
//     });
//     setActiveStep(1);
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
//       documentUrl: null
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
    
//     if (selectedCredentialType?.documentRequired && !formData.file) {
//       newErrors.file = 'Document upload is required for this credential type';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = () => {
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
      
//       // Create credential object
//       const newCredential = {
//         id: Date.now(),
//         name: formData.name,
//         type: formData.type,
//         number: formData.number,
//         issuingAuthority: formData.issuingAuthority,
//         issueDate: formData.issueDate,
//         expiryDate: formData.expiryDate,
//         status,
//         documentUrl: formData.documentUrl ? formData.documentUrl : null,
//         notes: formData.notes,
//         createdAt: new Date().toISOString().split('T')[0],
//         updatedAt: new Date().toISOString().split('T')[0]
//       };
      
//       // In a real app, you'd upload the file here and get a URL back
      
//       // Add credential to facility
//       const updatedFacility = addCredentialToFacility(facilityData, newCredential);
//       setFacilityData(updatedFacility);
      
//       // Show success dialog
//       setSuccessDialogOpen(true);
//     }
//   };

//   // Handle navigation
//   const handleBack = () => {
//     if (activeStep === 0) {
//       navigate('/facility/credentials');
//     } else {
//       setActiveStep(0);
//       setSelectedCredentialType(null);
//     }
//   };
  
//   const handleNext = () => {
//     if (activeStep === 1) {
//       handleSubmit();
//     } else {
//       setActiveStep(1);
//     }
//   };
  
//   const handleSuccessDialogClose = () => {
//     setSuccessDialogOpen(false);
//     navigate('/facility/credentials');
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <VerifiedUserIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Add Facility Credential
//         </Typography>
//       </Box>
      
//       {/* Stepper */}
//       <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
//         <Step>
//           <StepLabel>Select Credential Type</StepLabel>
//         </Step>
//         <Step>
//           <StepLabel>Enter Credential Details</StepLabel>
//         </Step>
//       </Stepper>
      
//       {/* Step 1: Select Credential Type */}
//       {activeStep === 0 && (
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             Select Credential Type
//           </Typography>
//           <Typography variant="body2" color="text.secondary" paragraph>
//             Select the type of credential you want to add to your facility.
//           </Typography>
          
//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             {Object.entries(groupedCredentialTypes).map(([category, types]) => (
//               <React.Fragment key={category}>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
//                     {category}
//                   </Typography>
//                   <Divider />
//                 </Grid>
                
//                 {types.map(type => (
//                   <Grid item xs={12} sm={6} md={4} key={type.id}>
//                     <Card 
//                       variant="outlined"
//                       sx={{
//                         border: selectedCredentialType?.id === type.id ? '2px solid #218838' : '1px solid #e0e0e0',
//                         transition: 'all 0.2s ease-in-out',
//                         '&:hover': {
//                           borderColor: '#218838',
//                           boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
//                         }
//                       }}
//                     >
//                       <CardActionArea onClick={() => handleCredentialTypeSelect(type)}>
//                         <CardContent>
//                           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//                             <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
//                               {type.name}
//                             </Typography>
//                             {selectedCredentialType?.id === type.id && (
//                               <CheckCircleIcon sx={{ color: '#218838' }} />
//                             )}
//                           </Box>
//                           <Typography variant="body2" color="text.secondary">
//                             {type.documentRequired ? 'Document upload required' : 'No document required'}
//                           </Typography>
//                         </CardContent>
//                       </CardActionArea>
//                     </Card>
//                   </Grid>
//                 ))}
//               </React.Fragment>
//             ))}
//           </Grid>
//         </Paper>
//       )}
      
//       {/* Step 2: Enter Credential Details */}
//       {activeStep === 1 && selectedCredentialType && (
//         <Paper sx={{ p: 3, mb: 3 }}>
//           <Typography variant="h6" gutterBottom>
//             Enter Credential Details
//           </Typography>
//           <Typography variant="body2" color="text.secondary" paragraph>
//             Please provide the details for your {selectedCredentialType.name} credential.
//           </Typography>
          
//           <Grid container spacing={3} sx={{ mt: 1 }}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Credential Name"
//                 fullWidth
//                 name="name"
//                 value={formData.name}
//                 onChange={handleFormChange}
//                 disabled
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Credential Type"
//                 fullWidth
//                 name="type"
//                 value={formData.type}
//                 onChange={handleFormChange}
//                 disabled
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Credential Number"
//                 fullWidth
//                 name="number"
//                 value={formData.number}
//                 onChange={handleFormChange}
//                 required
//                 error={!!errors.number}
//                 helperText={errors.number}
//               />
//             </Grid>
            
//             <Grid item xs={12}>
//               <FormControl fullWidth required error={!!errors.issuingAuthority}>
//                 <InputLabel id="issuing-authority-label">Issuing Authority</InputLabel>
//                 <Select
//                   labelId="issuing-authority-label"
//                   id="issuingAuthority"
//                   name="issuingAuthority"
//                   value={formData.issuingAuthority}
//                   onChange={handleFormChange}
//                   label="Issuing Authority"
//                 >
//                   {[
//                     'State Department of Health',
//                     'The Joint Commission',
//                     'Centers for Medicare & Medicaid Services',
//                     'Drug Enforcement Administration',
//                     'Department of Public Health',
//                     'Centers for Disease Control',
//                     'College of American Pathologists',
//                     'Occupational Safety and Health Administration',
//                     'Local Fire Department',
//                     'American College of Radiology',
//                     'State Board of Pharmacy',
//                     'Environmental Protection Agency',
//                     'Other'
//                   ].map(authority => (
//                     <MenuItem key={authority} value={authority}>
//                       {authority}
//                     </MenuItem>
//                   ))}
//                 </Select>
//                 {errors.issuingAuthority && (
//                   <FormHelperText>{errors.issuingAuthority}</FormHelperText>
//                 )}
//               </FormControl>
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Issue Date"
//                 type="date"
//                 fullWidth
//                 name="issueDate"
//                 value={formData.issueDate}
//                 onChange={handleFormChange}
//                 required
//                 error={!!errors.issueDate}
//                 helperText={errors.issueDate}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Grid>
            
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 label="Expiry Date"
//                 type="date"
//                 fullWidth
//                 name="expiryDate"
//                 value={formData.expiryDate}
//                 onChange={handleFormChange}
//                 required
//                 error={!!errors.expiryDate}
//                 helperText={errors.expiryDate}
//                 InputLabelProps={{
//                   shrink: true,
//                 }}
//               />
//             </Grid>
            
//             <Grid item xs={12}>
//               <TextField
//                 label="Notes"
//                 fullWidth
//                 multiline
//                 rows={3}
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleFormChange}
//               />
//             </Grid>
            
//             {selectedCredentialType.documentRequired && (
//               <Grid item xs={12}>
//                 <Box sx={{ mb: 1 }}>
//                   <Typography variant="subtitle2" gutterBottom>
//                     Document Upload
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
//                     Please upload a copy of your credential document.
//                   </Typography>
//                 </Box>
                
//                 {!selectedFile ? (
//                   <Button
//                     component="label"
//                     variant="outlined"
//                     startIcon={<UploadFileIcon />}
//                     sx={{ mt: 1 }}
//                   >
//                     Upload Document
//                     <VisuallyHiddenInput 
//                       type="file" 
//                       onChange={handleFileUpload}
//                       accept=".pdf,.jpg,.jpeg,.png"
//                     />
//                   </Button>
//                 ) : (
//                   <Box sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     p: 2, 
//                     border: '1px solid #e0e0e0',
//                     borderRadius: 1
//                   }}>
//                     <UploadFileIcon sx={{ color: '#218838', mr: 1 }} />
//                     <Box sx={{ flexGrow: 1 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
//                         {selectedFile.name}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {(selectedFile.size / 1024).toFixed(1)} KB
//                       </Typography>
//                     </Box>
//                     <IconButton onClick={handleRemoveFile} size="small">
//                       <CloseIcon fontSize="small" />
//                     </IconButton>
//                   </Box>
//                 )}
                
//                 {errors.file && (
//                   <FormHelperText error>{errors.file}</FormHelperText>
//                 )}
//               </Grid>
//             )}
//           </Grid>
//         </Paper>
//       )}
      
//       {/* Action Buttons */}
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
//         <Button 
//           variant="outlined"
//           onClick={handleBack}
//         >
//           {activeStep === 0 ? 'Cancel' : 'Back'}
//         </Button>
        
//         <Button
//           variant="contained"
//           onClick={handleNext}
//           disabled={activeStep === 0 && !selectedCredentialType}
//           sx={{ 
//             bgcolor: '#218838',
//             '&:hover': {
//               bgcolor: '#1e7e34'
//             }
//           }}
//         >
//           {activeStep === 1 ? 'Add Credential' : 'Next'}
//         </Button>
//       </Box>
      
//       {/* Success Dialog */}
//       <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
//         <DialogTitle>
//           Credential Added Successfully
//         </DialogTitle>
//         <DialogContent>
//           <Alert severity="success" sx={{ mb: 2 }}>
//             Your {formData.name} credential has been added to your facility.
//           </Alert>
//           <Typography variant="body2">
//             The credential details have been saved and your facility's credential list has been updated.
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleSuccessDialogClose} autoFocus>
//             Return to Credentials
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default AddFacilityCredential; 