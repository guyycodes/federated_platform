import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  IconButton, 
  Avatar,
  List,
  ListItem,
  ListItemText,
  Fab,
  Zoom,
  Collapse,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Fade,
  Grow,
  alpha
} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Star, Bolt, TrendingUp } from '@mui/icons-material';
import chatbotResponses from '../../assets/chatbot/chatbotResponses';
import { useTheme } from '../../Context/ThemeContext';

const ChatBot = () => {
  const { fonts, gradients, colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { sender: 'bot', text: 'Hello! I\'m the BlackCore AI assistant. How can I help you with your audit automation needs today?', type: 'text' }
  ]);
  const [currentStage, setCurrentStage] = useState('initial'); // initial, clarifying, definitive, support_ticket, form_collection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplaintTicket, setIsComplaintTicket] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Generate random thinking delay between 600ms and 1400ms
  const getThinkingDelay = () => {
    return Math.floor(Math.random() * 800) + 600;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to conversation
    setConversation(prev => [...prev, { sender: 'user', text: message, type: 'text' }]);
    const userMessage = message;
    setMessage('');

    if (currentStage === 'initial') {
      // Show thinking indicator
      setIsThinking(true);
      
      // Process initial user input with random delay
      setTimeout(() => {
        setIsThinking(false);
        const response = chatbotResponses.generateResponse(userMessage);
        handleBotResponse(response);
      }, getThinkingDelay());
    } else {
      // Show thinking indicator
      setIsThinking(true);
      
      // Handle follow-up messages with random delay
      setTimeout(() => {
        setIsThinking(false);
        const botResponse = "I understand you have additional questions. If you'd like to start over with a new request, please click the 'Start Over' button, or if you need further assistance, I can create a support ticket for you.";
        setConversation(prev => [...prev, { 
          sender: 'bot', 
          text: botResponse,
          type: 'text'
        }]);
      }, getThinkingDelay());
    }
  };

  const handleBotResponse = (response) => {
    const newMessages = [
      { sender: 'bot', text: response.message, type: 'text' }
    ];

    if (response.type === 'greeting') {
      // Handle greeting - add follow-up but stay conversational
      newMessages.push({
        sender: 'bot',
        text: response.followUp,
        type: 'text'
      });
      // Don't change stage, let them respond naturally
      
    } else if (response.type === 'casual') {
      // Handle casual conversation - just the response, stay conversational
      // Don't change stage, let them respond naturally
      
    } else if (response.type === 'complaint') {
      // Handle complaint - go directly to support ticket
      setCurrentStage('support_ticket');
      setIsComplaintTicket(true);
      
      newMessages.push({
        sender: 'bot',
        text: response.followUp,
        type: 'text'
      });
      
      newMessages.push({
        sender: 'bot',
        text: chatbotResponses.supportTicket.complaintIntroduction,
        type: 'text'
      });
      
      newMessages.push({
        sender: 'bot',
        text: 'Please fill out the following information:',
        type: 'support_form'
      });
      
    } else if (response.type === 'definitive') {
      // Definitive service identified
      setCurrentStage('definitive');
      
      newMessages.push({
        sender: 'bot',
        text: response.service.actionMessage,
        type: 'action',
        service: response.service
      });
      
    } else if (response.type === 'clarification_with_suggestions') {
      // Some intent detected but needs clarification
      setCurrentStage('clarifying');
      
      // Add the detected suggestions plus the full clarification options
      const allOptions = [
        ...response.suggestions,
        ...chatbotResponses.clarifyingQuestions.options.filter(
          option => !response.suggestions.find(s => s.id === option.leadToService)
        )
      ];
      
      newMessages.push({
        sender: 'bot',
        text: 'Please select the option that best matches what you need:',
        type: 'clarification_options',
        options: allOptions
      });
      
    } else if (response.type === 'clarification') {
      // No clear intent detected - ask for more info first
      if (response.showOptions) {
        // Only show options if they still haven't given us enough info after follow-up
        setCurrentStage('clarifying');
        
        newMessages.push({
          sender: 'bot',
          text: 'If it helps, here are the main things I can assist with:',
          type: 'clarification_options', 
          options: chatbotResponses.clarifyingQuestions.options
        });
      }
      // Otherwise just the conversational message asking for more info
    }

    setConversation(prev => [...prev, ...newMessages]);
  };

  const handleClarificationClick = (option) => {
    // Add user selection to conversation
    setConversation(prev => [...prev, { 
      sender: 'user', 
      text: option.label, 
      type: 'selection',
      description: option.description 
    }]);

    // Show thinking indicator
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      
      if (option.leadToService === 'support_ticket') {
        // Start support ticket process (not a complaint)
        setCurrentStage('support_ticket');
        setIsComplaintTicket(false);
        
        const newMessages = [
          { sender: 'bot', text: chatbotResponses.supportTicket.introduction, type: 'text' },
          { sender: 'bot', text: 'Please fill out the following information:', type: 'support_form' }
        ];
        
        setConversation(prev => [...prev, ...newMessages]);
      } else {
        // Lead to a specific service
        const service = chatbotResponses.getServiceById(option.leadToService);
        if (service) {
          setCurrentStage('definitive');
          
          const newMessages = [
            { sender: 'bot', text: service.confirmationMessage, type: 'text' },
            { sender: 'bot', text: service.actionMessage, type: 'action', service: service }
          ];
          
          setConversation(prev => [...prev, ...newMessages]);
        }
      }
    }, getThinkingDelay());
  };

  const handleRedirect = (path) => {
    if (path) {
      navigate(path);
      setIsOpen(false);
    }
  };

  const handleSupportTicketSubmit = async (formData) => {
    setIsSubmitting(true);
    
    const validation = chatbotResponses.validateSupportTicket(formData);
    
    if (!validation.isValid) {
      setConversation(prev => [...prev, {
        sender: 'bot',
        text: 'Please correct the following errors:\n' + validation.errors.join('\n'),
        type: 'error'
      }]);
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await chatbotResponses.createSupportTicket(formData);
      
      if (result.success) {
        const confirmationMsg = isComplaintTicket 
          ? chatbotResponses.supportTicket.complaintConfirmationMessage
          : chatbotResponses.supportTicket.confirmationMessage;
          
        setConversation(prev => [...prev, {
          sender: 'bot',
          text: confirmationMsg,
          type: 'success'
        }, {
          sender: 'bot',
          text: `Your ticket ID is: ${result.ticketId}`,
          type: 'ticket_confirmation',
          ticketId: result.ticketId
        }]);
        
        setCurrentStage('completed');
      }
    } catch (_) {
      setConversation(prev => [...prev, {
        sender: 'bot',
        text: 'Sorry, there was an error creating your support ticket. Please try again or contact us directly.',
        type: 'error'
      }]);
    }
    
    setIsSubmitting(false);
  };

  const resetConversation = () => {
    setConversation([
      { sender: 'bot', text: 'Hello! I\'m the BlackCore AI assistant. How can I help you with your audit automation needs today?', type: 'text' }
    ]);
    setCurrentStage('initial');
    setIsComplaintTicket(false);
    setIsThinking(false);
    setMessage('');
  };

  const SupportTicketForm = () => {
    const [formData, setFormData] = useState(
      isComplaintTicket ? { priority: 'high' } : {}
    );
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      handleSupportTicketSubmit(formData);
    };

    const handleInputChange = (fieldId, value) => {
      setFormData(prev => ({
        ...prev,
        [fieldId]: value
      }));
    };

    return (
      <Box 
        component="form" 
        onSubmit={handleFormSubmit} 
        sx={{ 
          p: 2, 
          background: alpha(colors.glassWhite, 0.15),
          backdropFilter: 'blur(15px)',
          borderRadius: 3, 
          mb: 1,
          border: `1px solid ${alpha(colors.primary, 0.3)}`,
          boxShadow: `0 8px 32px ${alpha(colors.primary, 0.2)}`,
        }}
      >
        {chatbotResponses.supportTicket.fields.map((field) => (
          <Box key={field.id} sx={{ mb: 2 }}>
            {field.type === 'select' ? (
              <FormControl fullWidth size="small" required={field.required}>
                <InputLabel 
                  sx={{ 
                    color: '#666666',
                    '&.Mui-focused': {
                      color: '#1A2238'
                    },
                    '&.MuiInputLabel-shrink': {
                      color: '#666666'
                    }
                  }}
                >
                  {field.label}
                </InputLabel>
                <Select
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  label={field.label}
                  sx={{
                    '& .MuiSelect-select': {
                      color: '#333333'
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#cccccc'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1A2238'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1A2238'
                    }
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        '& .MuiMenuItem-root': {
                          color: '#ffffff',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff'
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.3)'
                            }
                          }
                        }
                      }
                    }
                  }}
                >
                  {field.options.map((option) => (
                    <MenuItem 
                      key={option.value} 
                      value={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                type={field.type}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                multiline={field.type === 'textarea'}
                rows={field.type === 'textarea' ? 3 : 1}
                value={formData[field.id] || ''}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                sx={{ 
                  '& .MuiInputBase-input': {
                    color: '#ffffff'
                  },
                  '& .MuiInputLabel-root': {
                    color: alpha('#ffffff', 0.7)
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: colors.accent
                  },
                  '& .MuiOutlinedInput-root': {
                    background: alpha(colors.glassWhite, 0.1),
                    backdropFilter: 'blur(5px)',
                    '& fieldset': {
                      borderColor: alpha(colors.accent, 0.3)
                    },
                    '&:hover fieldset': {
                      borderColor: alpha(colors.accent, 0.5)
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: colors.accent,
                      boxShadow: `0 0 10px ${alpha(colors.accent, 0.3)}`,
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: alpha('#ffffff', 0.5),
                    opacity: 1
                  }
                }}
              />
            )}
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? null : <Bolt />}
            sx={{
              background: isSubmitting ? alpha(colors.glassWhite, 0.1) : gradients.accentGradient,
              color: '#ffffff',
              borderRadius: 2,
              px: 3,
              fontWeight: 'bold',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              '&:hover': { 
                background: isSubmitting ? alpha(colors.glassWhite, 0.1) : gradients.multiGradient,
                transform: isSubmitting ? 'none' : 'scale(1.05)',
                boxShadow: isSubmitting ? 'none' : `0 0 20px ${alpha(colors.accent, 0.5)}`,
              },
              '&:disabled': {
                color: alpha('#ffffff', 0.6),
              },
              transition: 'all 0.3s ease',
            }}
          >
            {isSubmitting ? <CircularProgress size={20} sx={{ color: alpha('#ffffff', 0.6) }} /> : 'Submit Ticket'}
          </Button>
          <Button
            variant="outlined"
            onClick={resetConversation}
            sx={{
              borderColor: alpha('#ffffff', 0.3),
              color: '#ffffff',
              background: alpha(colors.glassWhite, 0.1),
              backdropFilter: 'blur(5px)',
              borderRadius: 2,
              '&:hover': {
                borderColor: colors.primary,
                color: colors.primary,
                background: alpha(colors.glassWhite, 0.2),
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    );
  };

  const ThinkingIndicator = () => {
    return (
      <Fade in={isThinking} timeout={300}>
        <ListItem
          sx={{
            justifyContent: 'flex-start',
            mb: 1,
            padding: 0
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              maxWidth: '80%',
              background: alpha(colors.glassWhite, 0.15),
              backdropFilter: 'blur(15px)',
              color: '#ffffff',
              borderRadius: 3,
              border: `1px solid ${alpha(colors.accent, 0.3)}`,
              boxShadow: `0 4px 20px ${alpha(colors.accent, 0.2)}`,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              position: 'relative',
              overflow: 'hidden',
              animation: 'thinking-glow 2s ease-in-out infinite',
              '@keyframes thinking-glow': {
                '0%, 100%': { 
                  boxShadow: `0 4px 20px ${alpha(colors.accent, 0.2)}`,
                },
                '50%': { 
                  boxShadow: `0 6px 30px ${alpha(colors.accent, 0.4)}`,
                },
              },
            }}
          >
            <Bolt sx={{ fontSize: 16, color: colors.accent }} />
            <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 500 }}>
              Thinking
            </Typography>
            <Box sx={{ display: 'flex', gap: '3px' }}>
              {[0, 1, 2].map((dot) => (
                <Box
                  key={dot}
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: gradients.accentGradient,
                    animation: 'thinkingDots 1.4s infinite ease-in-out',
                    animationDelay: `${dot * 0.16}s`,
                    '@keyframes thinkingDots': {
                      '0%, 80%, 100%': {
                        transform: 'scale(0.8)',
                        opacity: 0.4
                      },
                      '40%': {
                        transform: 'scale(1.2)',
                        opacity: 1
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Paper>
        </ListItem>
      </Fade>
    );
  };

  const renderMessage = (msg, index) => {
    const isBotMessage = msg.sender === 'bot';
    
    if (msg.type === 'clarification_options') {
      return (
        <Grow in={true} timeout={500} style={{ transformOrigin: 'top left' }}>
          <ListItem
            sx={{
              justifyContent: 'flex-start',
              mb: 2,
              padding: 0,
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={1}>
                {msg.options.map((option) => (
                  <Grid item xs={12} key={option.id}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        cursor: 'pointer',
                        background: alpha(colors.glassWhite, 0.1),
                        backdropFilter: 'blur(15px)',
                        border: `1px solid ${alpha(colors.primary, 0.3)}`,
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-4px) scale(1.02)',
                          boxShadow: `0 8px 32px ${alpha(colors.primary, 0.3)}`,
                          border: `1px solid ${alpha(colors.primary, 0.6)}`,
                          background: alpha(colors.glassWhite, 0.15),
                        },
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: gradients.shimmerGradient,
                          transition: 'left 0.6s',
                        },
                        '&:hover::before': {
                          left: '100%',
                        },
                      }}
                      onClick={() => handleClarificationClick(option)}
                    >
                      <CardContent sx={{ py: 1.5, position: 'relative', zIndex: 1 }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold"
                          sx={{ 
                            color: '#ffffff',
                            mb: 0.5,
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                          }}
                        >
                          {option.label}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '0.8rem',
                            color: alpha('#ffffff', 0.8),
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                          }}
                        >
                          {option.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </ListItem>
        </Grow>
      );
    }

    if (msg.type === 'action') {
      return (
        <Fade in={true} timeout={600}>
          <ListItem
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              padding: 0,
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: '90%',
                bgcolor: 'white',
                color: 'black',
                borderRadius: 2,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                mb: 1
              }}
            >
              <Typography variant="body2">{msg.text}</Typography>
            </Paper>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleRedirect(msg.service.redirectPath)}
                startIcon={<Bolt />}
                sx={{
                  background: gradients.multiGradient,
                  backgroundSize: '200% 200%',
                  color: '#ffffff',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  px: 3,
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                  animation: 'gradient-shift 4s ease infinite',
                  '&:hover': { 
                    background: gradients.glowGradient,
                    transform: 'scale(1.05)',
                    boxShadow: `0 0 20px ${alpha(colors.secondary, 0.5)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {msg.service.buttonText}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={resetConversation}
                startIcon={<RefreshIcon />}
                sx={{
                  borderColor: alpha('#ffffff', 0.3),
                  color: '#ffffff',
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(5px)',
                  borderRadius: 2,
                  '&:hover': {
                    borderColor: colors.accent,
                    color: colors.accent,
                    background: alpha(colors.glassWhite, 0.2),
                    transform: 'scale(1.05)',
                    boxShadow: `0 0 15px ${alpha(colors.accent, 0.3)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Over
              </Button>
            </Box>
          </ListItem>
        </Fade>
      );
    }

    if (msg.type === 'support_form') {
      return (
        <Grow in={true} timeout={500}>
          <ListItem
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              padding: 0,
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <SupportTicketForm />
          </ListItem>
        </Grow>
      );
    }

    if (msg.type === 'success') {
      return (
        <Fade in={true} timeout={600}>
          <ListItem
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              padding: 0
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                maxWidth: '80%',
                background: `linear-gradient(135deg, ${alpha(colors.lottieGreen, 0.2)}, ${alpha(colors.accent, 0.1)})`,
                backdropFilter: 'blur(15px)',
                color: '#ffffff',
                borderRadius: 3,
                border: `1px solid ${alpha(colors.lottieGreen, 0.5)}`,
                boxShadow: `0 8px 32px ${alpha(colors.lottieGreen, 0.3)}`,
                animation: 'success-glow 2s ease-in-out infinite',
                '@keyframes success-glow': {
                  '0%, 100%': { 
                    boxShadow: `0 8px 32px ${alpha(colors.lottieGreen, 0.3)}`,
                  },
                  '50%': { 
                    boxShadow: `0 12px 40px ${alpha(colors.lottieGreen, 0.5)}`,
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon 
                  fontSize="small" 
                  sx={{ color: colors.lottieGreen, filter: `drop-shadow(0 0 5px ${colors.lottieGreen})` }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#ffffff',
                    fontWeight: 500,
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            </Paper>
          </ListItem>
        </Fade>
      );
    }

    if (msg.type === 'ticket_confirmation') {
      return (
        <Fade in={true} timeout={600}>
          <ListItem
            sx={{
              justifyContent: 'flex-start',
              mb: 1,
              padding: 0,
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: '80%',
                bgcolor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: 2,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                border: '1px solid #64b5f6',
                mb: 1
              }}
            >
              <Typography variant="body2" fontWeight="bold">{msg.text}</Typography>
            </Paper>
            <Button
              variant="outlined"
              size="small"
              onClick={resetConversation}
              startIcon={<RefreshIcon />}
              sx={{
                borderColor: '#1A2238',
                color: '#1A2238',
                '&:hover': {
                  borderColor: '#1A2238',
                  bgcolor: 'rgba(26, 34, 56, 0.04)'
                }
              }}
            >
              Start New Conversation
            </Button>
          </ListItem>
        </Fade>
      );
    }

    // Regular text message
    const MessageWrapper = isBotMessage ? Fade : 'div';
    const messageProps = isBotMessage ? { in: true, timeout: 500 } : {};

    return (
      <MessageWrapper {...messageProps}>
        <ListItem
          sx={{
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
            mb: 1,
            padding: 0
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              maxWidth: '80%',
              background: msg.sender === 'user' 
                ? gradients.primaryGradient
                : alpha(colors.glassWhite, 0.15),
              backdropFilter: 'blur(15px)',
              color: '#ffffff',
              borderRadius: 3,
              border: msg.sender === 'user'
                ? `1px solid ${alpha(colors.darkOrange, 0.5)}`
                : `1px solid ${alpha(colors.accent, 0.3)}`,
              boxShadow: msg.sender === 'user'
                ? `0 4px 20px ${alpha(colors.primary, 0.3)}`
                : `0 4px 20px ${alpha(colors.accent, 0.2)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': msg.sender === 'user' ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: gradients.shimmerGradient,
                transition: 'left 0.6s',
              } : {},
              '&:hover::before': msg.sender === 'user' ? {
                left: '100%',
              } : {},
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#ffffff',
                position: 'relative',
                zIndex: 1,
                textShadow: msg.sender === 'user' 
                  ? '0 1px 2px rgba(0,0,0,0.3)' 
                  : '0 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              {msg.text}
            </Typography>
            {msg.type === 'selection' && msg.description && (
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  mt: 0.5, 
                  opacity: 0.8,
                  color: alpha('#ffffff', 0.8),
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {msg.description}
              </Typography>
            )}
          </Paper>
        </ListItem>
      </MessageWrapper>
    );
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1100 }}>
      {/* Chat Bubble Button */}
      <Zoom in={!isOpen} timeout={300}>
        <Fab
          onClick={toggleChat}
          sx={{
            background: gradients.multiGradient,
            backgroundSize: '200% 200%',
            color: '#ffffff',
            width: 64,
            height: 64,
            animation: 'gradient-shift 4s ease infinite, pulse-glow 2s ease-in-out infinite',
            '@keyframes gradient-shift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            },
            '@keyframes pulse-glow': {
              '0%, 100%': { 
                boxShadow: `0 0 20px ${alpha(colors.primary, 0.4)}`,
                transform: 'scale(1)',
              },
              '50%': { 
                boxShadow: `0 0 30px ${alpha(colors.secondary, 0.6)}`,
                transform: 'scale(1.05)',
              },
            },
            '&:hover': {
              background: gradients.glowGradient,
              transform: 'scale(1.1)',
              boxShadow: `0 0 40px ${alpha(colors.accent, 0.8)}`,
            },
            border: `2px solid ${alpha('#ffffff', 0.2)}`,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: gradients.shimmerGradient,
              transition: 'left 0.6s',
            },
            '&:hover::before': {
              left: '100%',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* <Star sx={{ fontSize: 18, color: colors.accent }} /> */}
            <ChatIcon sx={{ fontSize: 24, transform: 'scaleX(-1)' }} />
            {/* <Star sx={{ fontSize: 16, color: colors.primary }} /> */}
          </Box>
        </Fab>
      </Zoom>

      {/* Chat Window */}
      <Zoom in={isOpen}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: { xs: '340px', sm: '400px' },
            height: '550px',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              overflow: 'hidden',
              background: alpha(colors.background, 0.9),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(colors.primary, 0.3)}`,
              boxShadow: `0 20px 60px ${alpha(colors.primary, 0.4)}`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -20,
                right: -20,
                width: 60,
                height: 60,
                background: gradients.primaryGradient,
                borderRadius: '50%',
                opacity: 0.3,
                filter: 'blur(20px)',
                animation: 'pulse 4s ease-in-out infinite',
                zIndex: -1,
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: -10,
                width: 40,
                height: 40,
                background: gradients.accentGradient,
                borderRadius: '50%',
                opacity: 0.2,
                filter: 'blur(15px)',
                animation: 'pulse 6s ease-in-out infinite',
                zIndex: -1,
              },
            }}
          >
          {/* Chat Header */}
          <Box
            sx={{
              p: 2,
              background: alpha(colors.surface, 0.8),
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${alpha(colors.primary, 0.2)}`,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  background: gradients.accentGradient,
                  color: '#ffffff',
                  mr: 1, 
                  width: 32, 
                  height: 32,
                  border: `2px solid ${alpha('#ffffff', 0.3)}`,
                  boxShadow: `0 0 15px ${alpha(colors.accent, 0.5)}`,
                }}
              >
                <Star fontSize="small" />
              </Avatar>
              <Box>
                <Typography 
                  variant="h6" 
                  sx={{
                    background: gradients.primaryGradient,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 'bold',
                  }}
                >
                  BlackCore AI Assistant
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: alpha('#ffffff', 0.7),
                    display: 'block',
                    lineHeight: 1,
                  }}
                >
                  AI-Powered Support
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton 
                onClick={resetConversation} 
                size="small" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    color: colors.accent,
                    background: alpha(colors.glassWhite, 0.2),
                    transform: 'scale(1.1)',
                    boxShadow: `0 0 15px ${alpha(colors.accent, 0.4)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
                title="Reset conversation"
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
              <IconButton 
                onClick={toggleChat} 
                size="small" 
                sx={{ 
                  color: alpha('#ffffff', 0.8),
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(5px)',
                  '&:hover': {
                    color: colors.primary,
                    background: alpha(colors.glassWhite, 0.2),
                    transform: 'scale(1.1)',
                    boxShadow: `0 0 15px ${alpha(colors.primary, 0.4)}`,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box
            sx={{
              p: 1,
              flexGrow: 1,
              background: `linear-gradient(135deg, ${alpha(colors.background, 0.3)}, ${alpha(colors.surface, 0.2)})`,
              backdropFilter: 'blur(10px)',
              overflowY: 'auto',
              position: 'relative',
              zIndex: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: alpha(colors.glassWhite, 0.1),
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: gradients.primaryGradient,
                borderRadius: '10px',
                '&:hover': {
                  background: gradients.accentGradient,
                },
              },
            }}
          >
            <List sx={{ py: 0 }}>
              {conversation.map((msg, index) => (
                <React.Fragment key={`msg-${index}`}>
                  {renderMessage(msg, index)}
                </React.Fragment>
              ))}
              {isThinking && <ThinkingIndicator key="thinking-indicator" />}
              <div ref={messagesEndRef} key="messages-end" />
            </List>
          </Box>

          {/* Chat Input - only show if not in support ticket or completed stage */}
          {currentStage !== 'support_ticket' && currentStage !== 'completed' && (
          <Box 
            component="form" 
            onSubmit={handleSendMessage}
            sx={{
              p: 2,
              background: alpha(colors.surface, 0.8),
              backdropFilter: 'blur(15px)',
              borderTop: `1px solid ${alpha(colors.primary, 0.2)}`,
              display: 'flex',
              gap: 1,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder={currentStage === 'initial' ? "Ask about demos, modules, or licensing..." : "Any additional questions?"}
              value={message}
              onChange={handleMessageChange}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: alpha(colors.glassWhite, 0.1),
                  backdropFilter: 'blur(10px)',
                  '& fieldset': {
                    borderColor: alpha(colors.accent, 0.3),
                    borderWidth: '1px'
                  },
                  '&:hover fieldset': {
                    borderColor: alpha(colors.accent, 0.5),
                    boxShadow: `0 0 10px ${alpha(colors.accent, 0.2)}`,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.accent,
                    borderWidth: '2px',
                    boxShadow: `0 0 15px ${alpha(colors.accent, 0.4)}`,
                  },
                  transition: 'all 0.3s ease',
                },
                '& .MuiInputBase-input': {
                  color: '#ffffff',
                  '&::placeholder': {
                    color: alpha('#ffffff', 0.6),
                    opacity: 1
                  }
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ 
                borderRadius: 3,
                minWidth: 'auto',
                px: 2,
                background: gradients.multiGradient,
                backgroundSize: '200% 200%',
                color: '#ffffff',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                animation: 'gradient-shift 4s ease infinite',
                '&:hover': {
                  background: gradients.glowGradient,
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 20px ${alpha(colors.accent, 0.6)}`,
                },
                '&:disabled': {
                  background: alpha(colors.glassWhite, 0.1),
                  color: alpha('#ffffff', 0.5),
                },
                transition: 'all 0.3s ease',
              }}
            >
              <SendIcon />
            </Button>
          </Box>
          )}
          </Paper>
        </Box>
      </Zoom>
    </Box>
  );
};

export default ChatBot; 