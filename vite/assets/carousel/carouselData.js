// Carousel Data for Buster & Co. Dog Grooming
export const carouselData = [
  {
    id: 1,
    title: 'Transformed My Anxious Pup',
    content: 'Buster & Co. turned my nervous rescue into a confident, beautiful dog. The patience and expertise they showed was incredible.',
    author: 'Sarah M.',
    authorTitle: 'Golden Retriever Mom',
    cta: 'Book Your Appointment',
    ctaAction: 'membership',
    backgroundColor: '#E8F5E8', // Light green
    accentColor: '#4CAF50',
  },
  {
    id: 2,
    title: 'Love Their Products!',
    content: 'The premium shampoo and grooming tools I bought keep Buddy looking fresh between appointments. Quality products that really work!',
    author: 'Tom K.',
    authorTitle: 'Labrador Dad',
    cta: 'Shop Products',
    ctaAction: 'shop',
    backgroundColor: '#FFF3E0', // Light orange
    accentColor: '#FF9800',
  },
  {
    id: 3,
    title: 'Worth Every Penny',
    content: 'The monthly membership saves me so much time and money. Max always looks amazing and the staff treats him like family.',
    author: 'David L.',
    authorTitle: 'VIP Plan Member',
    cta: 'View Membership Plans',
    ctaAction: 'membership',
    backgroundColor: '#E3F2FD', // Light blue
    accentColor: '#2196F3',
  },
  {
    id: 4,
    title: 'Perfect Gift Idea',
    content: 'Bought a gift card for my daughter\'s new puppy. She was thrilled and Bella looked absolutely adorable after her first grooming!',
    author: 'Maria C.',
    authorTitle: 'Proud Grandma',
    cta: 'Buy Gift Cards',
    ctaAction: 'membership',
    backgroundColor: '#F3E5F5', // Light purple
    accentColor: '#9C27B0',
  },
];

// Helper function to get CTA navigation path
export const getCtaPath = (ctaAction) => {
  const pathMap = {
    'book-appointment': '/book-appointment',
    'membership': '/booking',
    'gift-cards': '/gift-cards',
    'shop': '/shop',
    'services': '/services',
    'spotlight': '/spotlight',
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