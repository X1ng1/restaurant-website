import express from 'express';
import {
    createOrder,
    getAllOrders,
    getOrderByNumber,
    getOrdersBySession,
    cancelOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', createOrder);

// Get all orders
router.get('/', getAllOrders);

// Get orders by session ID
router.get('/session/:sessionId', getOrdersBySession);

// Get order by order number
router.get('/number/:orderNumber', getOrderByNumber);

// Cancel order
router.put('/cancel/:orderNumber', cancelOrder);

export default router;
