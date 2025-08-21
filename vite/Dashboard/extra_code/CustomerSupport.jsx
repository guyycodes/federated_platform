// import React, { useState } from 'react';
// import { 
//   Box, 
//   Typography, 
//   Paper, 
//   Button, 
//   TextField, 
//   FormControl, 
//   InputLabel, 
//   Select, 
//   MenuItem, 
//   Grid, 
//   Card, 
//   CardContent, 
//   CardActionArea,
//   IconButton,
//   Alert,
//   Divider,
//   CircularProgress,
//   Avatar,
//   List,
//   ListItem,
//   ListItemText,
//   ListItemAvatar
// } from '@mui/material';
// import SupportIcon from '@mui/icons-material/Support';
// import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
// import ChatIcon from '@mui/icons-material/Chat';
// import CloseIcon from '@mui/icons-material/Close';
// import SendIcon from '@mui/icons-material/Send';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import HelpIcon from '@mui/icons-material/Help';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import PersonIcon from '@mui/icons-material/Person';

// const FacilitySupport = () => {
//   const [supportOption, setSupportOption] = useState(null); // 'ticket' or 'chat'
//   const [ticketData, setTicketData] = useState({
//     subject: '',
//     category: '',
//     priority: 'medium',
//     description: '',
//     email: 'admin@metropolitanmedical.com' // Pre-filled
//   });
//   const [ticketSubmitted, setTicketSubmitted] = useState(false);
//   const [ticketId, setTicketId] = useState('');
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState('');
//   const [chatConnecting, setChatConnecting] = useState(false);
//   const [chatConnected, setChatConnected] = useState(false);
//   const [errors, setErrors] = useState({});

//   // Handle option selection
//   const handleOptionSelect = (option) => {
//     setSupportOption(option);
    
//     // If chat is selected, simulate connecting
//     if (option === 'chat') {
//       setChatConnecting(true);
//       // Simulate connection delay
//       setTimeout(() => {
//         setChatConnecting(false);
//         setChatConnected(true);
//         setChatMessages([
//           {
//             id: 1,
//             sender: 'system',
//             text: 'Connected to MedCredPro Support',
//             timestamp: new Date().toISOString()
//           },
//           {
//             id: 2,
//             sender: 'agent',
//             name: 'Sarah',
//             text: 'Hello! I\'m Sarah from MedCredPro support. How can I help you today?',
//             timestamp: new Date().toISOString()
//           }
//         ]);
//       }, 2000);
//     }
//   };

//   // Reset to initial state
//   const handleReset = () => {
//     setSupportOption(null);
//     setTicketSubmitted(false);
//     setTicketId('');
//     setChatMessages([]);
//     setChatInput('');
//     setChatConnecting(false);
//     setChatConnected(false);
//     setErrors({});
//   };

//   // Handle ticket form input changes
//   const handleTicketChange = (e) => {
//     const { name, value } = e.target;
//     setTicketData({
//       ...ticketData,
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

//   // Validate ticket form
//   const validateTicketForm = () => {
//     const newErrors = {};
    
//     if (!ticketData.subject.trim()) {
//       newErrors.subject = 'Subject is required';
//     }
    
//     if (!ticketData.category) {
//       newErrors.category = 'Category is required';
//     }
    
//     if (!ticketData.description.trim()) {
//       newErrors.description = 'Description is required';
//     } else if (ticketData.description.trim().length < 20) {
//       newErrors.description = 'Description should be at least 20 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle ticket submission
//   const handleTicketSubmit = () => {
//     if (validateTicketForm()) {
//       // Simulate ticket submission
//       // In a real app, you'd make an API call here
//       setTimeout(() => {
//         const randomId = Math.floor(100000 + Math.random() * 900000);
//         setTicketId(`TKT-${randomId}`);
//         setTicketSubmitted(true);
//       }, 1000);
//     }
//   };

//   // Handle chat input changes
//   const handleChatInputChange = (e) => {
//     setChatInput(e.target.value);
//   };

//   // Handle chat message submission
//   const handleSendMessage = () => {
//     if (!chatInput.trim()) return;
    
//     // Add user message
//     const userMessage = {
//       id: chatMessages.length + 1,
//       sender: 'user',
//       text: chatInput,
//       timestamp: new Date().toISOString()
//     };
    
//     setChatMessages([...chatMessages, userMessage]);
//     setChatInput('');
    
//     // Simulate agent response after a delay
//     setTimeout(() => {
//       const agentResponses = [
//         "I understand. Let me check that for you.",
//         "Thank you for providing that information. I'll look into it right away.",
//         "I'd be happy to help you with that issue.",
//         "Let me connect you with our specialized team for further assistance.",
//         "I've made a note of your concern. We'll prioritize this issue."
//       ];
      
//       const randomResponse = agentResponses[Math.floor(Math.random() * agentResponses.length)];
      
//       const agentMessage = {
//         id: chatMessages.length + 2,
//         sender: 'agent',
//         name: 'Sarah',
//         text: randomResponse,
//         timestamp: new Date().toISOString()
//       };
      
//       setChatMessages(prevMessages => [...prevMessages, agentMessage]);
//     }, 2000);
//   };

//   // Format timestamp for chat
//   const formatChatTime = (timestamp) => {
//     const date = new Date(timestamp);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <Box>
//       <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
//         <SupportIcon sx={{ color: '#218838', mr: 1 }} />
//         <Typography variant="h4" component="h1" gutterBottom>
//           Support Center
//         </Typography>
//       </Box>
      
//       {!supportOption ? (
//         // Initial option selection screen
//         <>
//           <Typography variant="body1" color="text.secondary" paragraph>
//             How can we help you today? Choose from the options below to get started.
//           </Typography>
          
//           <Grid container spacing={3} sx={{ mt: 2 }}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Card 
//                 sx={{ 
//                   height: '100%',
//                   transition: 'transform 0.2s, box-shadow 0.2s',
//                   '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: 4
//                   }
//                 }}
//               >
//                 <CardActionArea 
//                   onClick={() => handleOptionSelect('ticket')}
//                   sx={{ height: '100%', p: 2 }}
//                 >
//                   <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
//                     <ConfirmationNumberIcon sx={{ fontSize: 80, color: '#218838', mb: 2 }} />
//                     <Typography variant="h5" component="div" gutterBottom>
//                       Submit a Ticket
//                     </Typography>
//                     <Typography variant="body1" paragraph>
//                       Create a support ticket for issues that don't require immediate attention.
//                     </Typography>
//                     <Box sx={{ 
//                       display: 'inline-block', 
//                       borderRadius: 2, 
//                       bgcolor: 'rgba(33, 136, 56, 0.1)', 
//                       px: 2, 
//                       py: 1,
//                       mt: 'auto'
//                     }}>
//                       <Typography variant="body2" color="#218838">
//                         Response within 72 hours
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             </Grid>
            
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Card 
//                 sx={{ 
//                   height: '100%',
//                   transition: 'transform 0.2s, box-shadow 0.2s',
//                   '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: 4
//                   }
//                 }}
//               >
//                 <CardActionArea 
//                   onClick={() => handleOptionSelect('chat')}
//                   sx={{ height: '100%', p: 2 }}
//                 >
//                   <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
//                     <ChatIcon sx={{ fontSize: 80, color: '#218838', mb: 2 }} />
//                     <Typography variant="h5" component="div" gutterBottom>
//                       Live Chat
//                     </Typography>
//                     <Typography variant="body1" paragraph>
//                       Connect with a support representative for immediate assistance.
//                     </Typography>
//                     <Box sx={{ 
//                       display: 'inline-block', 
//                       borderRadius: 2, 
//                       bgcolor: 'rgba(33, 136, 56, 0.1)', 
//                       px: 2, 
//                       py: 1,
//                       mt: 'auto'
//                     }}>
//                       <Typography variant="body2" color="#218838">
//                         Real-time support
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             </Grid>
//           </Grid>
          
//           <Box sx={{ mt: 4 }}>
//             <Typography variant="h6" gutterBottom>
//               Frequently Asked Questions
//             </Typography>
//             <Grid container spacing={2}>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Paper sx={{ p: 2 }}>
//                   <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
//                     How do I update my facility credentials?
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Go to Facility Credentials → All Credentials to view your existing credentials. 
//                     You can add new ones using the "Add New Credential" button.
//                   </Typography>
//                 </Paper>
//               </Grid>
//               <Grid size={{ xs: 12, md: 6 }}>
//                 <Paper sx={{ p: 2 }}>
//                   <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
//                     How do I add providers to my facility?
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     Navigate to Providers → Add Provider to search for and add healthcare providers 
//                     to your facility with full credential verification.
//                   </Typography>
//                 </Paper>
//               </Grid>
//             </Grid>
//           </Box>
//         </>
//       ) : (
//         // Selected option content with back button
//         <Box sx={{ position: 'relative' }}>
//           <Button 
//             startIcon={<ArrowBackIcon />} 
//             onClick={handleReset}
//             sx={{ position: 'absolute', top: 0, right: 0 }}
//           >
//             Start Over
//           </Button>
          
//           {supportOption === 'ticket' && (
//             <Box sx={{ mt: 3 }}>
//               {!ticketSubmitted ? (
//                 // Ticket submission form
//                 <Paper sx={{ p: 3 }}>
//                   <Typography variant="h5" gutterBottom>
//                     Submit a Support Ticket
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     Please fill out the form below with details about your issue. 
//                     Our support team will respond within 72 hours.
//                   </Typography>
                  
//                   <Grid container spacing={3}>
//                     <Grid size={{ xs: 12 }}>
//                       <TextField
//                         label="Subject"
//                         fullWidth
//                         name="subject"
//                         value={ticketData.subject}
//                         onChange={handleTicketChange}
//                         required
//                         error={!!errors.subject}
//                         helperText={errors.subject}
//                       />
//                     </Grid>
                    
//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <FormControl fullWidth required error={!!errors.category}>
//                         <InputLabel>Category</InputLabel>
//                         <Select
//                           name="category"
//                           value={ticketData.category}
//                           onChange={handleTicketChange}
//                           label="Category"
//                         >
//                           <MenuItem value="account">Account Management</MenuItem>
//                           <MenuItem value="billing">Billing & Subscription</MenuItem>
//                           <MenuItem value="providers">Provider Management</MenuItem>
//                           <MenuItem value="credentials">Credential Issues</MenuItem>
//                           <MenuItem value="technical">Technical Issues</MenuItem>
//                           <MenuItem value="other">Other</MenuItem>
//                         </Select>
//                         {errors.category && (
//                           <Typography variant="caption" color="error">
//                             {errors.category}
//                           </Typography>
//                         )}
//                       </FormControl>
//                     </Grid>
                    
//                     <Grid size={{ xs: 12, sm: 6 }}>
//                       <FormControl fullWidth>
//                         <InputLabel>Priority</InputLabel>
//                         <Select
//                           name="priority"
//                           value={ticketData.priority}
//                           onChange={handleTicketChange}
//                           label="Priority"
//                         >
//                           <MenuItem value="low">Low</MenuItem>
//                           <MenuItem value="medium">Medium</MenuItem>
//                           <MenuItem value="high">High</MenuItem>
//                         </Select>
//                       </FormControl>
//                     </Grid>
                    
//                     <Grid size={{ xs: 12 }}>
//                       <TextField
//                         label="Description"
//                         fullWidth
//                         multiline
//                         rows={6}
//                         name="description"
//                         value={ticketData.description}
//                         onChange={handleTicketChange}
//                         placeholder="Please provide as much detail as possible about your issue..."
//                         required
//                         error={!!errors.description}
//                         helperText={errors.description}
//                       />
//                     </Grid>
                    
//                     <Grid size={{ xs: 12 }}>
//                       <TextField
//                         label="Contact Email"
//                         fullWidth
//                         type="email"
//                         name="email"
//                         value={ticketData.email}
//                         onChange={handleTicketChange}
//                         disabled
//                         helperText="We'll use your account email for correspondence"
//                       />
//                     </Grid>
                    
//                     <Grid size={{ xs: 12 }}>
//                       <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
//                         <Button
//                           variant="contained"
//                           onClick={handleTicketSubmit}
//                           sx={{ 
//                             bgcolor: '#218838',
//                             '&:hover': {
//                               bgcolor: '#1e7e34'
//                             }
//                           }}
//                         >
//                           Submit Ticket
//                         </Button>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </Paper>
//               ) : (
//                 // Ticket submission confirmation
//                 <Paper sx={{ p: 4, textAlign: 'center' }}>
//                   <CheckCircleIcon sx={{ fontSize: 64, color: '#218838', mb: 2 }} />
//                   <Typography variant="h5" gutterBottom>
//                     Ticket Submitted Successfully
//                   </Typography>
//                   <Typography variant="body1" paragraph>
//                     Your ticket number is <strong>{ticketId}</strong>
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" paragraph>
//                     We've received your support request and will respond within 72 hours. 
//                     A confirmation has been sent to your email.
//                   </Typography>
//                   <Box sx={{ mt: 3 }}>
//                     <Button
//                       variant="outlined"
//                       onClick={handleReset}
//                       sx={{ 
//                         color: '#218838',
//                         borderColor: '#218838',
//                         '&:hover': {
//                           borderColor: '#1e7e34',
//                           bgcolor: 'rgba(33, 136, 56, 0.04)'
//                         }
//                       }}
//                     >
//                       Return to Support Center
//                     </Button>
//                   </Box>
//                 </Paper>
//               )}
//             </Box>
//           )}
          
//           {supportOption === 'chat' && (
//             <Box sx={{ mt: 3 }}>
//               <Paper sx={{ 
//                 p: 3, 
//                 display: 'flex', 
//                 flexDirection: 'column', 
//                 height: '70vh',
//                 border: '1px solid',
//                 borderColor: 'divider',
//                 bgcolor: 'background.paper'
//               }}>
//                 <Typography variant="h5" gutterBottom>
//                   Live Support Chat
//                 </Typography>
                
//                 {chatConnecting ? (
//                   // Connecting state
//                   <Box sx={{ 
//                     display: 'flex', 
//                     flexDirection: 'column', 
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     flexGrow: 1
//                   }}>
//                     <CircularProgress sx={{ color: '#218838', mb: 2 }} />
//                     <Typography variant="body1">
//                       Connecting to support...
//                     </Typography>
//                   </Box>
//                 ) : (
//                   // Chat interface
//                   <>
//                     <Box 
//                       sx={{ 
//                         flexGrow: 1, 
//                         overflowY: 'auto',
//                         bgcolor: 'background.paper',
//                         borderRadius: 1,
//                         p: 2,
//                         mb: 2,
//                         border: '1px solid',
//                         borderColor: 'divider'
//                       }}
//                     >
//                       {chatMessages.map((message) => (
//                         <Box 
//                           key={message.id} 
//                           sx={{ 
//                             display: 'flex',
//                             flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
//                             mb: 2,
//                             alignItems: 'flex-start'
//                           }}
//                         >
//                           {message.sender === 'agent' && (
//                             <Avatar 
//                               sx={{ 
//                                 bgcolor: '#218838',
//                                 mr: 1,
//                                 width: 36,
//                                 height: 36,
//                                 fontSize: '0.875rem'
//                               }}
//                             >
//                               {message.name.charAt(0)}
//                             </Avatar>
//                           )}
                          
//                           {message.sender === 'user' && (
//                             <Avatar 
//                               sx={{ 
//                                 bgcolor: '#3f51b5',
//                                 ml: 1,
//                                 width: 36,
//                                 height: 36
//                               }}
//                             >
//                               <PersonIcon fontSize="small" />
//                             </Avatar>
//                           )}
                          
//                           <Box>
//                             {message.sender === 'agent' && (
//                               <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
//                                 {message.name} • {formatChatTime(message.timestamp)}
//                               </Typography>
//                             )}
                            
//                             <Box 
//                               sx={{ 
//                                 bgcolor: message.sender === 'user' 
//                                   ? '#3f51b5' 
//                                   : message.sender === 'system'
//                                     ? 'rgba(255, 255, 255, 0.15)'
//                                     : 'rgba(33, 136, 56, 0.9)',
//                                 p: 1.5,
//                                 borderRadius: 2,
//                                 maxWidth: '80%',
//                                 color: message.sender === 'user' 
//                                   ? 'white' 
//                                   : 'text.primary',
//                                 border: message.sender !== 'user' ? '1px solid' : 'none',
//                                 borderColor: message.sender === 'system' 
//                                   ? 'divider'
//                                   : 'rgba(33, 136, 56, 0.3)',
//                                 whiteSpace: 'pre-wrap',
//                                 wordBreak: 'break-word'
//                               }}
//                             >
//                               <Typography variant="body2" sx={{ 
//                                 color: message.sender === 'user' 
//                                   ? 'white' 
//                                   : message.sender === 'system'
//                                     ? 'text.primary'
//                                     : 'white'
//                               }}>
//                                 {message.text}
//                               </Typography>
//                             </Box>
                            
//                             {message.sender === 'user' && (
//                               <Typography variant="caption" color="text.secondary" sx={{ 
//                                 display: 'block', 
//                                 mb: 0.5,
//                                 mt: 0.5,
//                                 textAlign: 'right'
//                               }}>
//                                 {formatChatTime(message.timestamp)}
//                               </Typography>
//                             )}
//                           </Box>
//                         </Box>
//                       ))}
//                     </Box>
                    
//                     <Box sx={{ display: 'flex', gap: 1 }}>
//                       <TextField
//                         fullWidth
//                         placeholder="Type your message here..."
//                         value={chatInput}
//                         onChange={handleChatInputChange}
//                         variant="outlined"
//                         size="small"
//                         sx={{
//                           '& .MuiOutlinedInput-root': {
//                             backgroundColor: 'background.paper',
//                             '&:hover .MuiOutlinedInput-notchedOutline': {
//                               borderColor: '#218838'
//                             },
//                             '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//                               borderColor: '#218838'
//                             }
//                           }
//                         }}
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter') {
//                             handleSendMessage();
//                           }
//                         }}
//                       />
//                       <Button
//                         variant="contained"
//                         endIcon={<SendIcon />}
//                         onClick={handleSendMessage}
//                         disabled={!chatInput.trim()}
//                         sx={{ 
//                           bgcolor: '#218838',
//                           '&:hover': {
//                             bgcolor: '#1e7e34'
//                           },
//                           '&.Mui-disabled': {
//                             bgcolor: 'action.disabledBackground'
//                           }
//                         }}
//                       >
//                         Send
//                       </Button>
//                     </Box>
//                   </>
//                 )}
//               </Paper>
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default FacilitySupport; 