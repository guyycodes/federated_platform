// License Plans for BlackCore AI Audit Platform
export const membershipPlans = [
  {
    id: 'commercial',
    title: 'Commercial License',
    priceMonthly: '$599',
    priceAnnual: '$5,990',
    period: {
      monthly: '/ month',
      annual: '/ year'
    },
    popularFeature: true,
    description: 'AI-powered audit automation for commercial entities',
    features: [
      'Unlimited automated audits',
      'Commercial compliance templates',
      'Risk assessment dashboard',
      'Standard integrations',
      'Email & chat support',
      '97% automation rate',
      'Export to PDF/Excel',
    ],
    savings: {
      monthly: 'Flexible monthly billing',
      annual: 'Save $1,198 per year'
    },
    button: { label: 'Get Commercial Access', variant: 'contained' },
  },
  {
    id: 'federal',
    title: 'Federal License',
    priceMonthly: '$1,299',
    priceAnnual: '$12,990',
    period: {
      monthly: '/ month',
      annual: '/ year'
    },
    popularFeature: false,
    description: 'FedRAMP compliant solution for government contractors',
    features: [
      'Everything in Commercial',
      'FedRAMP & FISMA compliant',
      'Government audit frameworks',
      'Secure GovCloud hosting',
      'Priority support with SLA',
      '99.8% accuracy guarantee',
      'CMMC preparation tools',
      'CAC/PIV authentication',
    ],
    savings: {
      monthly: 'Month-to-month flexibility',
      annual: 'Save $2,598 per year'
    },
    button: { label: 'Get Federal Access', variant: 'contained' },
  },
  {
    id: 'international',
    title: 'International License',
    priceMonthly: '$1,999',
    priceAnnual: '$19,990',
    period: {
      monthly: '/ month',
      annual: '/ year'
    },
    popularFeature: false,
    description: 'Global compliance across multiple jurisdictions',
    features: [
      'Everything in Federal',
      'Multi-language support',
      'International compliance frameworks',
      'Multi-currency reporting',
      'Global data residency options',
      'White-label capabilities',
      'Dedicated success manager',
      '24/7 phone support',
      'Custom training programs',
    ],
    savings: {
      monthly: 'Pay as you grow',
      annual: 'Save $3,998 per year'
    },
    button: { label: 'Request Access', variant: 'contained' },
  },
];

// Billing periods for toggle
export const billingPeriods = {
  monthly: {
    label: 'Monthly',
    value: 'monthly',
    description: 'Cancel anytime'
  },
  annual: {
    label: 'Annual',
    value: 'annual', 
    description: 'Best value'
  }
};

// Helper function to get plan by ID
export const getPlanById = (planId) => {
  return membershipPlans.find(plan => plan.id === planId);
};

// Helper function to get price by billing period
export const getPriceByPeriod = (plan, period) => {
  switch(period) {
    case 'monthly': return plan.priceMonthly;
    case 'annual': return plan.priceAnnual;
    default: return plan.priceMonthly;
  }
};

// Helper function to calculate savings for annual billing
export const calculateAnnualSavings = (planId) => {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  
  const monthlyPrice = parseInt(plan.priceMonthly.replace(/[$,]/g, ''));
  const annualPrice = parseInt(plan.priceAnnual.replace(/[$,]/g, ''));
  const yearlyFromMonthly = monthlyPrice * 12;
  
  return yearlyFromMonthly - annualPrice;
};

// Helper function to get savings text
export const getSavingsText = (plan, period) => {
  if (period === 'annual') {
    const savings = calculateAnnualSavings(plan.id);
    return `Save $${savings.toLocaleString()} per year`;
  }
  return plan.savings.monthly;
};