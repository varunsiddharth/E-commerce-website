const Product = require('./models/Product');
const mongoose = require('mongoose');
require('dotenv').config();

// Sample products data
const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "electronics",
    stock: 50
  },
  {
    name: "Smartphone Case - Clear",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500",
    description: "Protective clear case for your smartphone with raised edges for screen protection.",
    category: "electronics",
    stock: 100
  },
  {
    name: "Cotton T-Shirt",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "Comfortable 100% cotton t-shirt available in multiple colors and sizes.",
    category: "clothing",
    stock: 75
  },
  {
    name: "Denim Jeans",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500",
    description: "Classic blue denim jeans with a comfortable fit and modern styling.",
    category: "clothing",
    stock: 40
  },
  {
    name: "Programming Book - JavaScript",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
    description: "Comprehensive guide to modern JavaScript programming with practical examples.",
    category: "books",
    stock: 30
  },
  {
    name: "Coffee Table Book",
    price: 35.99,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
    description: "Beautiful coffee table book featuring stunning photography and design inspiration.",
    category: "books",
    stock: 25
  },
  {
    name: "Ceramic Coffee Mug",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=500",
    description: "Handcrafted ceramic coffee mug perfect for your morning brew.",
    category: "home",
    stock: 60
  },
  {
    name: "Yoga Mat",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
    description: "Non-slip yoga mat with excellent grip and cushioning for all yoga practices.",
    category: "sports",
    stock: 35
  },
  {
    name: "Face Moisturizer",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500",
    description: "Hydrating face moisturizer with natural ingredients for all skin types.",
    category: "beauty",
    stock: 45
  },
  {
    name: "Wireless Mouse",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    description: "Ergonomic wireless mouse with precision tracking and long battery life.",
    category: "electronics",
    stock: 80
  }
];

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted successfully');

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
