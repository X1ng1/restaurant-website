import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connect.js';
import menuRoutes from './routes/menuRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Determine allowed CORS origin. If FRONTEND_URL contains a path (e.g.
// https://username.github.io/repo/), use only the origin (https://username.github.io).
let allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
try {
    // This will throw if FRONTEND_URL is not a valid URL, so we keep the raw value as a fallback
    allowedOrigin = new URL(allowedOrigin).origin;
} catch (e) {
    // keep allowedOrigin as provided
}

app.use(cors({
    origin: allowedOrigin,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/menu', menuRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Great NY Noodletown API Server',
        endpoints: {
            menu: '/api/menu',
            cart: '/api/cart',
            orders: '/api/orders',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

export default app;
