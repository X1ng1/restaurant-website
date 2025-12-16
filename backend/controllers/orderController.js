import orderModel from '../models/orderModel.js';
import cartModel from '../models/cartModel.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const { sessionId, customerInfo } = req.body;

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Session ID is required' });
        }

        // Get cart items
        const cart = await cartModel.findOne();

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create order
        const newOrder = new orderModel({
            orderNumber,
            sessionId,
            items: cart.items,
            total: cart.total,
        });

        await newOrder.save();

        // Clear the cart after order is placed
        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(201).json({ 
            success: true, 
            data: newOrder, 
            message: 'Order placed successfully' 
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    }
};

// Get all orders (admin)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
};

// Get order by order number
export const getOrderByNumber = async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const order = await orderModel.findOne({ orderNumber });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch order', error: error.message });
    }
};

// Get orders by session ID
export const getOrdersBySession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const orders = await orderModel.find({ sessionId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { orderNumber } = req.params;

        const order = await orderModel.findOne({ orderNumber });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        if (order.status === 'completed') {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot cancel a completed order' 
            });
        }

        order.status = 'cancelled';
        await order.save();

        res.status(200).json({ 
            success: true, 
            data: order, 
            message: 'Order cancelled successfully' 
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
    }
};
