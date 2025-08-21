// Service Pillars for Dog Grooming Business
export const serviceItems = [
  {
    title: 'Professional Grooming Services',
    description: 'Full grooming, wash & dry, nail trimming, and de-shedding services for dogs of all sizes.',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1350&q=80',
    imageAlt: 'Dog getting bathed)',  
    prices: {
      smallDogWash: '$30',
      largeDogWash: '$40',
      smallDogFull: '$75',
      largeDogFull: '$105'
    }
  },
  {
    title: 'Monthly Membership Plans',
    description: 'Save money with our Rockies Bath Club, Rowdies Grooming Club, and Busters VIP Plan membership options.',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1350&q=80',
    imageAlt: 'Happy groomed dog',  
    prices: {
      rockiesSmall: '$50/month',
      rockiesLarge: '$75/month',
      rowdiesSmall: '$70/month',
      rowdiesLarge: '$95/month',
      bustersSmall: '$120/month',
      bustersLarge: '$160/month'
    }
  },
  {
    title: 'Gift Cards & Retail',
    description: 'Premium shampoos, grooming tools, accessories, and gift cards for the pet lovers in your life.',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1350&q=80',
    imageAlt: 'Dog grooming services',  
    giftCardAmounts: ['$25', '$50', '$75', '$100', 'Custom'],
    retailItems: [
      { name: 'Premium Dog Shampoo', price: '$12' },
      { name: 'Conditioner Spray', price: '$10' },
      { name: 'Grooming Brush', price: '$8' },
      { name: 'Pet Cologne', price: '$9' },
      { name: 'Bandanas & Accessories', price: '$5-$15' }
    ]
  }
];

// Add-on services
export const addOnServices = [
  { name: 'Nail Trimming', price: '$15' },
  { name: 'Doggy Daycare', price: '$8/hour', note: 'if your pup stays more than 1 hour after service completion' }
]; 