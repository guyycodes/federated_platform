// Carousel Data for BlackCore AI Audit Automation
export const carouselData = [
  {
    id: 1,
    title: 'Reduced Audit Time by 75%',
    content: 'BlackCore AI transformed our SOX compliance process. What used to take 3 months now takes 3 weeks with better accuracy and coverage.',
    author: 'Jennifer Chen',
    authorTitle: 'Chief Audit Executive, Fortune 500',
    cta: 'Schedule Your Demo',
    ctaAction: 'booking',
    backgroundColor: '#E8F5E8', // Light green
    accentColor: '#4CAF50',
  },
  {
    id: 2,
    title: 'Seamless FedRAMP Compliance',
    content: 'The automated OSCAL exports and continuous monitoring features saved us thousands of hours on our federal audit engagements.',
    author: 'Michael Thompson',
    authorTitle: 'Director of Federal Compliance',
    cta: 'Explore Federal Module',
    ctaAction: 'modules',
    backgroundColor: '#FFF3E0', // Light orange
    accentColor: '#FF9800',
  },
  {
    id: 3,
    title: 'ROI Within First Quarter',
    content: 'Our audit team productivity increased dramatically. The AI handles evidence collection and workpaper generation flawlessly.',
    author: 'Sarah Williams',
    authorTitle: 'VP of Internal Audit',
    cta: 'View Pricing Plans',
    ctaAction: 'booking',
    backgroundColor: '#E3F2FD', // Light blue
    accentColor: '#2196F3',
  },
  {
    id: 4,
    title: 'Game-Changer for External Audits',
    content: 'As auditors, we now focus on review and judgment calls while BlackCore handles the repetitive testing. Clients love the efficiency.',
    author: 'Robert Martinez',
    authorTitle: 'Partner, Big Four Firm',
    cta: 'Learn More',
    ctaAction: 'about',
    backgroundColor: '#F3E5F5', // Light purple
    accentColor: '#9C27B0',
  },
];

// Helper function to get CTA navigation path
export const getCtaPath = (ctaAction) => {
  const pathMap = {
    'booking': '/booking',
    'modules': '/',  // Goes to home where modules are displayed
    'about': '/about',
    'resources': '/resources',
    'contact': '/contact',
    'demo': '/booking',
  };
  
  return pathMap[ctaAction] || '/';
};

// Helper function to get testimonial by ID
export const getTestimonialById = (id) => {
  return carouselData.find(item => item.id === id);
};

// Get random testimonials for variety
export const getRandomTestimonials = (count = 3) => {
  const shuffled = [...carouselData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};