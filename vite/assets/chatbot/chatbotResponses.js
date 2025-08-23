const chatbotResponses = {
  // Greeting responses for natural conversation
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'],
    responses: [
      "Hello! Welcome to BlackCore AI! 👋",
      "Hi there! Ready to revolutionize your audit process?",
      "Hey! Great to have you here today!",
      "Hello! Thanks for reaching out!"
    ],
    followUp: "How can I help you with your audit automation needs today?"
  },

  // Casual conversation starters
  casualResponses: {
    'how are you': "I'm doing great, thank you for asking! I'm here to help you explore our audit automation platform.",
    'what can you do': "I can help you schedule a demo, learn about our audit modules, explore licensing options, or answer any questions about our platform.",
    'who are you': "I'm your BlackCore AI assistant! I'm here to help you navigate our audit automation solutions and get you the information you need.",
    'thanks': "You're very welcome! Is there anything else I can help you with?",
    'thank you': "My pleasure! Let me know if you need anything else!"
  },

  // Main service categories that we can directly help with
  primaryServices: [
    {
      id: 'demo',
      label: 'Schedule Demo',
      description: 'Book a personalized demo of our audit automation platform',
      definitiveKeywords: ['demo', 'schedule demo', 'book demo', 'demonstration', 'show me', 'see platform', 'see how it works', 'product demo', 'live demo', 'walkthrough'],
      supportiveKeywords: ['platform', 'software', 'system', 'features', 'capabilities', 'see', 'show', 'watch', 'presentation'],
      minKeywordMatches: 1,
      confirmationMessage: 'Great! I can help you schedule a demo of our platform.',
      actionMessage: 'I\'ll direct you to our demo booking page where you can select your preferred date and time.',
      redirectPath: '/booking',
      buttonText: 'Schedule Demo'
    },
    {
      id: 'modules',
      label: 'Explore Modules',
      description: 'Learn about our Internal and External Audit modules',
      definitiveKeywords: ['modules', 'audit modules', 'internal audit', 'external audit', 'features', 'capabilities', 'what modules'],
      supportiveKeywords: ['federal', 'commercial', 'international', 'sox', 'fisma', 'hipaa', 'compliance', 'frameworks'],
      minKeywordMatches: 1,
      confirmationMessage: 'I\'d be happy to show you our audit modules.',
      actionMessage: 'Let me direct you to our modules page where you can explore both Internal and External Audit capabilities.',
      redirectPath: '/',
      buttonText: 'View Modules'
    },
    {
      id: 'licensing',
      label: 'Licensing & Pricing',
      description: 'View licensing options and pricing plans',
      definitiveKeywords: ['license', 'licensing', 'pricing', 'cost', 'price', 'plans', 'subscription', 'how much'],
      supportiveKeywords: ['enterprise', 'team', 'professional', 'monthly', 'annual', 'yearly', 'payment'],
      minKeywordMatches: 1,
      confirmationMessage: 'I can help you explore our licensing options.',
      actionMessage: 'I\'ll take you to our licensing page where you can compare plans and pricing.',
      redirectPath: '/booking',
      buttonText: 'View Licensing'
    }
  ],

  // Clarifying questions to ask when intent is unclear
  clarifyingQuestions: {
    initial: "I'd love to help! What specifically are you looking for today?",
    whenUnclear: "I want to make sure I point you in the right direction. Could you tell me a bit more about what you need help with?",
    options: [
      {
        id: 'demo_clarify',
        label: 'Product Demo',
        description: 'Schedule a live demonstration of our audit automation platform',
        leadToService: 'demo'
      },
      {
        id: 'modules_clarify', 
        label: 'Audit Modules & Features',
        description: 'Explore Internal and External Audit capabilities',
        leadToService: 'modules'
      },
      {
        id: 'licensing_clarify',
        label: 'Licensing & Pricing',
        description: 'View pricing plans and licensing options',
        leadToService: 'licensing'
      },
      {
        id: 'other_clarify',
        label: 'Something Else',
        description: 'I need help with something not listed above',
        leadToService: 'support_ticket'
      }
    ]
  },

  // Support ticket configuration
  supportTicket: {
    introduction: "I'll help you create a support ticket so our team can assist you directly.",
    complaintIntroduction: "I'm sorry to hear you're experiencing issues. Let me help you create a priority support ticket so our team can address this right away.",
    confirmationMessage: "Thank you! Your support ticket has been created. Our team will contact you within 24 hours.",
    complaintConfirmationMessage: "Your priority support ticket has been created. Our team will reach out to you as soon as possible to resolve this issue.",
    fields: [
      {
        id: 'name',
        label: 'Your Name',
        type: 'text',
        placeholder: 'Enter your full name',
        required: true
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your@email.com',
        required: true
      },
      {
        id: 'company',
        label: 'Company',
        type: 'text',
        placeholder: 'Your company name',
        required: false
      },
      {
        id: 'topic',
        label: 'Topic',
        type: 'select',
        required: true,
        options: [
          { value: 'technical', label: 'Technical Support' },
          { value: 'licensing', label: 'Licensing Questions' },
          { value: 'demo', label: 'Demo Request' },
          { value: 'integration', label: 'Integration Help' },
          { value: 'other', label: 'Other' }
        ]
      },
      {
        id: 'message',
        label: 'How can we help?',
        type: 'textarea',
        placeholder: 'Please describe what you need help with...',
        required: true
      }
    ]
  },

  // Complaint detection keywords
  complaintKeywords: ['problem', 'issue', 'not working', 'broken', 'error', 'bug', 'wrong', 'terrible', 'awful', 'disappointed', 'frustrated', 'upset'],

  // Generate response based on user input
  generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const words = lowerMessage.split(/\s+/);

    // Check for greetings
    const isGreeting = this.greetings.keywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isGreeting) {
      const randomResponse = this.greetings.responses[Math.floor(Math.random() * this.greetings.responses.length)];
      return {
        type: 'greeting',
        message: randomResponse,
        followUp: this.greetings.followUp
      };
    }

    // Check for casual responses
    for (const [key, response] of Object.entries(this.casualResponses)) {
      if (lowerMessage.includes(key)) {
        return {
          type: 'casual',
          message: response
        };
      }
    }

    // Check for complaints
    const isComplaint = this.complaintKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );

    if (isComplaint) {
      return {
        type: 'complaint',
        message: "I understand you're experiencing difficulties.",
        followUp: "Let me help you get this resolved right away."
      };
    }

    // Check for definitive service matches
    for (const service of this.primaryServices) {
      // Check for definitive keywords
      const hasDefinitiveKeyword = service.definitiveKeywords.some(keyword => 
        lowerMessage.includes(keyword)
      );

      if (hasDefinitiveKeyword) {
        return {
          type: 'definitive',
          service: service,
          message: service.confirmationMessage
        };
      }

      // Check for supportive keywords
      const supportiveMatches = service.supportiveKeywords.filter(keyword => 
        lowerMessage.includes(keyword)
      ).length;

      if (supportiveMatches >= service.minKeywordMatches) {
        return {
          type: 'clarification_with_suggestions',
          message: this.clarifyingQuestions.initial,
          suggestions: [{
            id: service.id + '_clarify',
            label: service.label,
            description: service.description,
            leadToService: service.id
          }]
        };
      }
    }

    // If no clear intent, ask for clarification
    if (words.length < 5) {
      return {
        type: 'clarification',
        message: this.clarifyingQuestions.whenUnclear,
        showOptions: false
      };
    }

    return {
      type: 'clarification',
      message: this.clarifyingQuestions.initial,
      showOptions: true
    };
  },

  // Get service by ID
  getServiceById(serviceId) {
    return this.primaryServices.find(service => service.id === serviceId);
  },

  // Validate support ticket
  validateSupportTicket(formData) {
    const errors = [];
    
    // Check required fields
    this.supportTicket.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        errors.push(`${field.label} is required`);
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Create support ticket (mock implementation)
  async createSupportTicket(formData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate ticket ID
    const ticketId = 'TCK' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    return {
      success: true,
      ticketId: ticketId
    };
  }
};

export default chatbotResponses;