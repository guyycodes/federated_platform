const chatbotResponses = {
  // Greeting responses for natural conversation
  greetings: {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'],
    responses: [
      "Hello! Nice to meet you! 😊",
      "Hi there! Great to chat with you today!",
      "Hey! Hope you're having a wonderful day!",
      "Hello! Thanks for reaching out!"
    ],
    followUp: "How can I help you today?"
  },

  // Casual conversation starters
  casualResponses: {
    'how are you': "I'm doing great, thank you for asking! I'm here and ready to help you with whatever you need.",
    'what can you do': "I can help you with several things! I can assist with scheduling grooming appointments, help you find pet products in our shop, set up gift cards, or help with any other questions you might have.",
    'who are you': "I'm your Buster & Co. assistant! I'm here to help you navigate our services and get you the information or assistance you need.",
    'thanks': "You're very welcome! Is there anything else I can help you with?",
    'thank you': "My pleasure! Let me know if you need anything else!"
  },

  // Main service categories that we can directly help with
  primaryServices: [
    {
      id: 'appointment',
      label: 'Schedule Appointment',
      description: 'Book a grooming appointment for your pet',
      definitiveKeywords: ['appointment','schedule appointment', 'book appointment', 'make appointment', 'appointment booking', 'need appointment', 'grooming appointment', 'need to schedule', 'want to schedule', 'schedule an appointment', 'book an appointment', 'make an appointment', 'set up appointment', 'set appointment'],
      supportiveKeywords: ['grooming', 'groom', 'bath', 'bathing', 'nail trim', 'pet grooming', 'dog grooming', 'cat grooming', 'wash my dog', 'wash my cat', 'wash', 'cut my dog', 'cut my cat', 'groom my pet', 'full', 'basic', 'complete', 'estimate', 'quote', 'pricing', 'price', 'cost', 'how much', 'service', 'services', 'clean', 'cleaned', 'cleaning', 'dirty', 'messy', 'smelly', 'stinky', 'muddy', 'get cleaned', 'needs cleaning', 'needs a bath', 'needs washing', 'pet cleaned', 'clean my pet', 'wash my pet', 'bathe my pet', 'shedding', 'shed', 'sheds', 'fur', 'hair', 'loose hair', 'fur everywhere', 'hair everywhere', 'de-shed', 'deshed', 'brushing', 'brush', 'appointment'],
      petWords: ['pet', 'dog', 'cat', 'puppy', 'kitten', 'animal'],
      cleaningWords: ['clean', 'cleaned', 'cleaning', 'wash', 'bath', 'dirty', 'messy', 'smelly', 'muddy', 'shedding', 'shed', 'sheds', 'fur', 'hair'],
      minKeywordMatches: 1, // Reduced to 1 to catch more cases
      confirmationMessage: 'Great! I can help you with a grooming appointment.',
      actionMessage: 'I\'ll direct you to our appointment booking page where you can select your preferred date, time, and services.',
      redirectPath: '/booking',
      buttonText: 'Book Appointment'
    },
    {
      id: 'shop',
      label: 'Shop Products',
      description: 'Browse and purchase pet care products',
      definitiveKeywords: ['buy products', 'shop products', 'purchase items', 'pet products', 'pet supplies', 'want to buy', 'looking to purchase', 'need to buy'],
      supportiveKeywords: ['shampoo', 'collar', 'leash', 'toy', 'pet food', 'treats', 'accessories', 'merchandise', 'products', 'supplies'],
      minKeywordMatches: 1,
      confirmationMessage: 'Great! I can help you find and purchase pet products.',
      actionMessage: 'Perfect! I\'ll direct you to our shop where you can browse all our pet care products and accessories.',
      redirectPath: '/shop',
      buttonText: 'Visit Shop'
    },
    {
      id: 'giftcard',
      label: 'Gift Cards',
      description: 'Purchase gift cards for pet lovers',
      definitiveKeywords: ['gift card', 'gift certificate', 'buy gift card', 'purchase gift card'],
      supportiveKeywords: ['gift', 'present', 'birthday gift', 'holiday gift'],
      minKeywordMatches: 1,
      confirmationMessage: 'Great! I can help you purchase a gift card.',
      actionMessage: 'Perfect! I\'ll direct you to our gift card page where you can select the amount and purchase options.',
      redirectPath: '/gift-cards',
      buttonText: 'Buy Gift Card'
    }
  ],

  // Clarifying questions to ask when intent is unclear
  clarifyingQuestions: {
    initial: "I'd love to help! What specifically are you looking for today?",
    whenUnclear: "I want to make sure I point you in the right direction. Could you tell me a bit more about what you need help with?",
    options: [
      {
        id: 'appointment_clarify',
        label: 'Pet Grooming Services',
        description: 'Schedule an appointment for bathing, grooming, nail trimming, etc.',
        leadToService: 'appointment'
      },
      {
        id: 'products_clarify', 
        label: 'Pet Products & Supplies',
        description: 'Browse and buy shampoos, toys, accessories, food, etc.',
        leadToService: 'shop'
      },
      {
        id: 'giftcard_clarify',
        label: 'Gift Cards',
        description: 'Purchase gift cards for friends and family',
        leadToService: 'giftcard'
      },
      {
        id: 'other_clarify',
        label: 'Something Else',
        description: 'I need help with something not listed above',
        leadToService: 'support_ticket'
      }
    ]
  },

  // Follow-up questions for appointment scheduling
  appointmentQuestions: {
    petType: {
      question: "What type of pet do you need grooming for?",
      options: [
        { id: 'dog', label: 'Dog', description: 'Dog grooming services' },
        { id: 'cat', label: 'Cat', description: 'Cat grooming services' },
        { id: 'other_pet', label: 'Other Pet', description: 'Other pet grooming services' }
      ]
    },
    serviceType: {
      question: "What type of grooming service are you interested in?",
      options: [
        { id: 'full_groom', label: 'Full Grooming', description: 'Complete wash, cut, and style' },
        { id: 'bath_brush', label: 'Bath & Brush', description: 'Wash and brush only' },
        { id: 'nail_trim', label: 'Nail Trim', description: 'Nail trimming service' },
        { id: 'not_sure', label: 'Not Sure', description: 'I need help deciding' }
      ]
    }
  },

  // Support ticket collection for other requests
  supportTicket: {
    introduction: "I'd be happy to help you with your request. To ensure you get the right assistance, I'll need to collect some information and create a support ticket for you.",
    complaintIntroduction: "I'm sorry you're experiencing this issue. To ensure we address your concerns properly and get this resolved quickly, I'll need to collect some information for our support team.",
    fields: [
      {
        id: 'name',
        label: 'Your Name',
        type: 'text',
        required: true,
        placeholder: 'Enter your full name'
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'Enter your email address'
      },
      {
        id: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: false,
        placeholder: 'Enter your phone number (optional)'
      },
      {
        id: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        placeholder: 'Brief description of your request'
      },
      {
        id: 'description',
        label: 'Detailed Description',
        type: 'textarea',
        required: true,
        placeholder: 'Please provide detailed information about your request or question'
      },
      {
        id: 'priority',
        label: 'Priority Level',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Low - General inquiry' },
          { value: 'medium', label: 'Medium - Need response within 24 hours' },
          { value: 'high', label: 'High - Urgent, need immediate attention' }
        ]
      }
    ],
    confirmationMessage: "Thank you! I've created a support ticket for you. You should receive a confirmation email shortly, and our team will respond based on your selected priority level.",
    complaintConfirmationMessage: "Thank you for bringing this to our attention. I've created a high-priority support ticket for your complaint. Our team will review this promptly and get back to you as soon as possible."
  },

  // Check if message is a greeting
  isGreeting: (message) => {
    const lowerMessage = message.toLowerCase().trim();
    return chatbotResponses.greetings.keywords.some(keyword => 
      lowerMessage === keyword || lowerMessage.includes(keyword)
    );
  },

  // Check if message is a casual conversation starter
  getCasualResponse: (message) => {
    const lowerMessage = message.toLowerCase().trim();
    for (const [key, response] of Object.entries(chatbotResponses.casualResponses)) {
      if (lowerMessage.includes(key)) {
        return response;
      }
    }
    return null;
  },

  // Get random greeting response
  getGreetingResponse: () => {
    const responses = chatbotResponses.greetings.responses;
    return responses[Math.floor(Math.random() * responses.length)];
  },

  // Intent detection with stricter matching
  detectIntent: (userMessage) => {
    const message = userMessage.toLowerCase();
    const detectedServices = [];

    chatbotResponses.primaryServices.forEach(service => {
      let score = 0;
      let matchedKeywords = [];

      // Check definitive keywords (higher weight)
      service.definitiveKeywords.forEach(keyword => {
        if (message.includes(keyword.toLowerCase())) {
          score += 3;
          matchedKeywords.push(keyword);
        }
      });

      // Check supportive keywords (lower weight)
      service.supportiveKeywords.forEach(keyword => {
        if (message.includes(keyword.toLowerCase())) {
          score += 1;
          matchedKeywords.push(keyword);
        }
      });

      // Special logic for appointment service - check for pet + cleaning combinations
      if (service.id === 'appointment' && service.petWords && service.cleaningWords) {
        const hasPetWord = service.petWords.some(word => message.includes(word));
        const hasCleaningWord = service.cleaningWords.some(word => message.includes(word));
        
        if (hasPetWord && hasCleaningWord) {
          score += 3; // High score for pet + cleaning combination
          matchedKeywords.push('pet cleaning combination');
        }
      }

      // Only consider it a match if it meets minimum criteria
      if (score >= service.minKeywordMatches * 2 || matchedKeywords.length >= service.minKeywordMatches) {
        detectedServices.push({
          ...service,
          matchScore: score,
          matchedKeywords: matchedKeywords
        });
      }
    });

    return detectedServices.sort((a, b) => b.matchScore - a.matchScore);
  },

  // Generate appropriate response based on intent detection
  generateResponse: (userMessage) => {
    // Check for complaints first (high priority)
    const complaintKeywords = ['complaint', 'complain', 'problem', 'issue', 'wrong', 'bad', 'terrible', 'awful', 'disappointed', 'unhappy', 'unsatisfied', 'poor service', 'bad experience', 'not happy', 'upset', 'angry', 'frustrated', 'dissatisfied'];
    const isComplaint = complaintKeywords.some(keyword => userMessage.toLowerCase().includes(keyword));

    if (isComplaint) {
      return {
        type: 'complaint',
        message: "I'm sorry to hear you're having an issue. I want to make sure we address your concerns properly.",
        followUp: "Let me create a support ticket so our team can look into this and get back to you quickly."
      };
    }

    // Then check if it's a greeting (but only if no other important keywords)
    if (chatbotResponses.isGreeting(userMessage)) {
      return {
        type: 'greeting',
        message: chatbotResponses.getGreetingResponse(),
        followUp: chatbotResponses.greetings.followUp
      };
    }

    // Check for casual conversation
    const casualResponse = chatbotResponses.getCasualResponse(userMessage);
    if (casualResponse) {
      return {
        type: 'casual',
        message: casualResponse
      };
    }

    // Check for very vague requests that need options
    const vaguePhrases = ['help', 'i need help', 'can you help me', 'i need assistance', 'assistance', 'support', 'what do you do', 'services'];
    const isVague = vaguePhrases.some(phrase => userMessage.toLowerCase().trim().includes(phrase));

    // Now check for service intents
    const detectedIntents = chatbotResponses.detectIntent(userMessage);
    
    if (detectedIntents.length === 1 && detectedIntents[0].matchScore >= 2) {
      // High confidence in single intent - lowered threshold
      return {
        type: 'definitive',
        service: detectedIntents[0],
        message: detectedIntents[0].confirmationMessage
      };
    } else if (detectedIntents.length > 0) {
      // Some intent detected but not definitive
      return {
        type: 'clarification_with_suggestions',
        suggestions: detectedIntents.slice(0, 2),
        message: "I think I understand what you're looking for, but let me clarify to make sure I help you correctly."
      };
    } else if (isVague) {
      // Vague request - show options to help them
      return {
        type: 'clarification',
        message: chatbotResponses.clarifyingQuestions.whenUnclear,
        showOptions: true
      };
    } else {
      // No clear intent but not obviously vague - ask for more info conversationally
      return {
        type: 'clarification',
        message: "I'd love to help you with that! Could you tell me a bit more about what you're looking for so I can point you in the right direction?",
        showOptions: false
      };
    }
  },

  // Get service by ID
  getServiceById: (id) => {
    return chatbotResponses.primaryServices.find(service => service.id === id);
  },

  // Get clarifying option by ID
  getClarifyingOptionById: (id) => {
    return chatbotResponses.clarifyingQuestions.options.find(option => option.id === id);
  },

  // Validate support ticket data
  validateSupportTicket: (ticketData) => {
    const errors = [];
    
    chatbotResponses.supportTicket.fields.forEach(field => {
      if (field.required && (!ticketData[field.id] || ticketData[field.id].trim() === '')) {
        errors.push(`${field.label} is required`);
      }
      
      if (field.type === 'email' && ticketData[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(ticketData[field.id])) {
          errors.push('Please enter a valid email address');
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  },

  // Create support ticket (simulate API call)
  createSupportTicket: async (ticketData) => {
    // In a real implementation, this would make an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketId = 'RC' + Date.now().toString().slice(-6);
        resolve({
          success: true,
          ticketId: ticketId,
          message: `Support ticket ${ticketId} has been created successfully.`
        });
      }, 1000);
    });
  }
};

export default chatbotResponses;