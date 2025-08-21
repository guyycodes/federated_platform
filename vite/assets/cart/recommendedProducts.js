const recommendedProducts = {
  // Configuration for recommended products in cart
  settings: {
    maxDisplay: 4, // Maximum number of products to show
    rotationInterval: 24, // Hours between rotation
    algorithm: 'popular', // 'popular', 'related', 'trending', 'personalized'
  },
  
  // Product recommendations
  products: [
    {
      id: 'rc-collar-001',
      title: 'Premium Leather Collar',
      description: 'Handcrafted genuine leather collar with custom name tag',
      image: 'https://images.unsplash.com/photo-1583512603805-3cc6b41f3edb?w=800&q=80',
      price: 3999,
      originalPrice: 4999,
      discount: 20,
      currency: 'USD',
      category: 'accessories',
      rating: 4.8,
      reviews: 127,
      badge: 'Best Seller',
      features: ['Adjustable', 'Waterproof', 'Name Tag Included'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Brown', 'Black', 'Tan']
    },
    {
      id: 'rc-toy-001',
      title: 'Interactive Puzzle Toy',
      description: 'Mental stimulation toy for smart dogs',
      image: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=800&q=80',
      price: 2499,
      originalPrice: null,
      discount: 0,
      currency: 'USD',
      category: 'toys',
      rating: 4.6,
      reviews: 89,
      badge: 'New Arrival',
      features: ['BPA Free', 'Dishwasher Safe', 'All Sizes'],
      colors: ['Blue', 'Red', 'Green']
    },
    {
      id: 'rc-shampoo-001',
      title: 'Organic Dog Shampoo',
      description: 'Natural ingredients for sensitive skin',
      image: 'https://images.unsplash.com/photo-1625794084867-8ddd239946b1?w=800&q=80',
      price: 1899,
      originalPrice: 2199,
      discount: 14,
      currency: 'USD',
      category: 'grooming',
      rating: 4.9,
      reviews: 234,
      badge: 'Vet Recommended',
      features: ['Organic', 'Hypoallergenic', 'Fresh Scent']
    },
    {
      id: 'rc-treats-001',
      title: 'Training Treats Bundle',
      description: 'High-value rewards for training sessions',
      image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=800&q=80',
      price: 1599,
      originalPrice: null,
      discount: 0,
      currency: 'USD',
      category: 'treats',
      rating: 4.7,
      reviews: 156,
      badge: 'Customer Favorite',
      features: ['All Natural', 'Grain Free', 'Made in USA']
    },
    {
      id: 'rc-bed-001',
      title: 'Orthopedic Dog Bed',
      description: 'Memory foam comfort for better sleep',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
      price: 7999,
      originalPrice: 9999,
      discount: 20,
      currency: 'USD',
      category: 'furniture',
      rating: 4.9,
      reviews: 312,
      badge: 'Premium Choice',
      features: ['Memory Foam', 'Washable Cover', 'Non-Slip Base'],
      sizes: ['Small', 'Medium', 'Large', 'XL'],
      colors: ['Gray', 'Brown', 'Blue']
    },
    {
      id: 'rc-leash-001',
      title: 'Retractable LED Leash',
      description: 'Safety and visibility for night walks',
      image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80',
      price: 3499,
      originalPrice: null,
      discount: 0,
      currency: 'USD',
      category: 'accessories',
      rating: 4.5,
      reviews: 78,
      badge: 'Innovation',
      features: ['LED Light', '16ft Range', 'Ergonomic Grip'],
      colors: ['Black', 'Blue', 'Pink']
    }
  ],
  
  // Recommendations by category
  categoryRecommendations: {
    apparel: ['rc-collar-001', 'rc-leash-001'],
    accessories: ['rc-toy-001', 'rc-bed-001'],
    grooming: ['rc-shampoo-001', 'rc-treats-001'],
    default: ['rc-collar-001', 'rc-toy-001', 'rc-shampoo-001', 'rc-treats-001']
  }
};

export default recommendedProducts; 