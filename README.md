# 🛍️ E-Commerce Full-Stack Application

A modern, responsive e-commerce website built with **Node.js**, **Express.js**, **MongoDB**, and **vanilla HTML/CSS/JavaScript**.

## ✨ Features

### 🎨 Frontend
- **Modern UI Design**: Clean, responsive design with smooth animations
- **Product Catalog**: Browse products with category filtering
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Add/remove items, quantity management
- **User Authentication**: Login and registration with JWT
- **Checkout Process**: Complete order placement with form validation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### ⚙️ Backend
- **RESTful API**: Well-structured API endpoints
- **JWT Authentication**: Secure user authentication and authorization
- **MongoDB Integration**: Database with Mongoose ODM
- **Data Validation**: Input validation and error handling
- **CORS Support**: Cross-origin resource sharing enabled

### 📊 Database Models
- **Products**: Name, price, image, description, category, stock
- **Users**: Name, email, hashed password
- **Orders**: User reference, items, total amount, shipping address

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Python (for fallback frontend server)

### 🎯 One-Click Launch (Recommended)

**For Windows Users:**
```bash
# Double-click this file to start everything
start-app.bat
```

This script will automatically:
- ✅ Check all dependencies
- ✅ Install missing packages  
- ✅ Start backend server (port 5000)
- ✅ Seed database with sample products
- ✅ Start frontend server (port 8080)
- ✅ Open browser automatically

### 🔧 Manual Setup (Alternative)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce
   ```

2. **Run setup script**
   ```bash
   # Windows
   setup.bat
   
   # Mac/Linux
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   # Update MONGO_URI in backend/.env file
   ```

4. **Start the application**
   ```bash
   # Option 1: Use the startup script
   start-app.bat
   
   # Option 2: Manual start
   cd backend && npm start
   cd frontend && npm start
   ```

### 🌐 Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
e-commerce/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── productController.js # Product API logic
│   │   ├── userController.js    # User API logic
│   │   └── orderController.js   # Order API logic
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── models/
│   │   ├── Product.js           # Product schema
│   │   ├── User.js              # User schema
│   │   └── Order.js             # Order schema
│   ├── routes/
│   │   ├── productRoutes.js    # Product routes
│   │   ├── userRoutes.js        # User routes
│   │   └── orderRoutes.js       # Order routes
│   ├── server.js                # Main server file
│   ├── seed.js                  # Database seeding script
│   ├── package.json             # Backend dependencies
│   └── env.example              # Environment variables template
├── frontend/
│   ├── css/
│   │   └── style.css            # Main stylesheet
│   ├── js/
│   │   ├── api.js               # API utility functions
│   │   ├── cart.js              # Shopping cart management
│   │   ├── main.js              # Home page functionality
│   │   ├── product.js           # Product details page
│   │   ├── checkout.js          # Checkout functionality
│   │   └── auth.js              # Authentication logic
│   ├── index.html               # Home page
│   ├── product.html             # Product details page
│   ├── cart.html                # Shopping cart page
│   ├── login.html               # Login page
│   └── register.html            # Registration page
└── README.md                    # This file
```

## 🔗 API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination and filtering)
- `GET /api/products/:id` - Get single product details

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Orders
- `POST /api/orders` - Create new order (requires authentication)
- `GET /api/orders` - Get user orders (requires authentication)

## 🎯 Usage Examples

### Frontend Development
```javascript
// Add product to cart
cart.addItem(product, quantity);

// Show toast notification
Toast.show('Product added to cart!');

// Make API call
const products = await API.getProducts('electronics');
```

### Backend Development
```javascript
// Protected route middleware
router.post('/orders', authenticateToken, createOrder);

// JWT token generation
const token = generateToken(userId);
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon
```

### Frontend Development
```bash
cd frontend
# Use any local server or open HTML files directly
npx serve -s . -l 3000
```

### Database Management
```bash
# Seed database with sample products
npm run seed

# Clear database (manual)
# Connect to MongoDB and drop collections
```

## 🔧 Configuration

### Environment Variables
- `PORT`: Server port (default: 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `FRONTEND_URL`: Frontend URL for CORS

### MongoDB Setup
- Local: `mongodb://localhost:27017/ecommerce`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`

## 🎨 Customization

### Styling
- Modify `frontend/css/style.css` for custom styling
- Update color scheme by changing CSS variables
- Add new animations and effects

### Functionality
- Extend API endpoints in `backend/routes/`
- Add new features in `frontend/js/`
- Modify database schemas in `backend/models/`

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or cloud database
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build static files
2. Deploy to Netlify, Vercel, or GitHub Pages
3. Update API URLs for production

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access (for Atlas)

2. **CORS Errors**
   - Update `FRONTEND_URL` in backend `.env`
   - Check frontend is running on correct port

3. **JWT Token Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration

4. **Product Images Not Loading**
   - Verify image URLs in seed data
   - Check CORS settings for external images

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the code comments for implementation details

---

**Happy Shopping! 🛍️**
