// Membership Plans for Dog Grooming Business
export const membershipPlans = [
  {
    id: 'Rockies',
    title: 'Rockies Bath Club',
    priceSmall: '$50',
    priceMedium: '$65',
    priceLarge: '$75',
    period: '/ month',
    popularFeature: false,
    description: 'Two wash & dry sessions per month with savings',
    features: [
      'Two Wash & Dry sessions/month',
      'Free Nail Trim during one visit',
      'Save $5-10 monthly',
      'Flexible scheduling',
    ],
    savings: {
      small: 'Save $10/month',
      medium: 'Save $10/month', 
      large: 'Save $5/month'
    },
    button: { label: 'Join Bath Club', variant: 'outlined' },
  },
  {
    id: 'Rowdies',
    title: 'Rowdies Grooming Club',
    priceSmall: '$70',
    priceMedium: '$85',
    priceLarge: '$95',
    period: '/ month',
    popularFeature: true,
    description: 'One full groom monthly with exclusive perks',
    features: [
      'One Full Groom/month',
      'Free Nail Trim included',
      'Priority scheduling',
      'Save up to $15 monthly',
    ],
    savings: {
      small: 'Save $5/month',
      medium: 'Save $10/month',
      large: 'Save $10/month'
    },
    button: { label: 'Start Membership', variant: 'contained' },
  },
  {
    id: 'Busters',
    title: 'Busters VIP Plan',
    priceSmall: '$120',
    priceMedium: '$140',
    priceLarge: '$160',
    period: '/ month',
    popularFeature: false,
    description: 'Ultimate care package for pampered pups',
    features: [
      'Two Bath & Brush sessions/month',
      'Full Groom every 6 weeks',
      'Free Nail Trimming always',
      'Priority scheduling',
      'Free Doggy Daycare (up to 1hr/session)',
    ],
    savings: {
      small: 'Best value!',
      medium: 'Best value!',
      large: 'Best value!'
    },
    button: { label: 'Go VIP', variant: 'outlined' },
  },
];

// One-time service options
export const oneTimeServices = [
  {
    id: 'in-&-out',
    title: 'In-&-Out',
    description: 'Quick service wash and dry only',
    priceSmall: '$30',
    priceMedium: '$35',
    priceLarge: '$40',
    features: ['Wash', 'Dry', 'Basic brush out']
  },
  {
    id: 'pop-in',
    title: 'Pop-in Groom',
    description: 'Complete grooming package',
    priceSmall: '$75',
    priceMedium: '$90',
    priceLarge: '$105',
    features: ['Wash', 'Dry', 'Brush', 'Trim/De-shedding', 'Nail trim available (+$15)']
  }
];

// Gift card options
export const giftCardOptions = [
  {
    id: 'gift-50',
    value: '$50',
    description: 'Great for a full wash & dry session',
    popular: false,
    features: ['Digital or physical card', 'Never expires', 'Can be combined']
  },
  {
    id: 'gift-100',
    value: '$100',
    description: 'Perfect for multiple services or large dogs',
    popular: false,
    features: ['Digital or physical card', 'Never expires', 'Can be combined']
  },
  {
    id: 'gift-custom',
    value: 'Custom',
    description: 'Choose any amount $25 and up',
    popular: false,
    features: ['Digital or physical card', 'Never expires', 'Can be combined', 'You choose the amount']
  }
];

// Size categories for easy reference
export const sizeCategories = {
  small: {
    label: 'Small',
    description: 'Up to 25 lbs',
  },
  medium: {
    label: 'Medium',
    description: '26-60 lbs',
  },
  large: {
    label: 'Large', 
    description: '61+ lbs',
  },
};

// Helper function to get plan by ID
export const getPlanById = (planId) => {
  return membershipPlans.find(plan => plan.id === planId);
};

// Helper function to get price by size
export const getPriceBySize = (plan, size) => {
  switch(size) {
    case 'small': return plan.priceSmall;
    case 'medium': return plan.priceMedium;
    case 'large': return plan.priceLarge;
    default: return plan.priceSmall;
  }
};

// Helper function to calculate annual savings
export const calculateAnnualSavings = (planId, size) => {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  
  const savings = {
    'Rockies': { small: 120, medium: 120, large: 60 }, // $10, $10, $5 x 12 months
    'Rowdies': { small: 60, medium: 120, large: 120 }, // $5, $10, $10 x 12 months
    'Busters': { small: 300, medium: 360, large: 400 }, // Estimated value
  };
  
  return savings[planId]?.[size] || 0;
}; 