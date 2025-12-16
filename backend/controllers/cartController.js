import cartModel from '../models/cartModel.js';

// Get cart
export const getCart = async (req, res) => {
    try {
        let cart = await cartModel.findOne();
        
        if (!cart) {
            // Create a new cart if none exists
            cart = new cartModel({ items: [], total: 0 });
            await cart.save();
        }

        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cart', error: error.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    try {
        const { name, price, quantity = 1 } = req.body;

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Item name and price are required' });
        }

        let cart = await cartModel.findOne();

        if (!cart) {
            cart = new cartModel({ items: [], total: 0 });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.name === name);

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ name, price, quantity });
        }

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, data: cart, message: 'Item added to cart' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add item to cart', error: error.message });
    }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
    try {
        const { itemName } = req.params;
        const { quantity } = req.body;

        if (quantity < 0) {
            return res.status(400).json({ success: false, message: 'Quantity cannot be negative' });
        }

        const cart = await cartModel.findOne();

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.name === itemName);

        if (itemIndex === -1) {
            return res.status(404).json({ success: false, message: 'Item not found in cart' });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, data: cart, message: 'Cart updated' });
    } catch (error) {
        console.error('Error updating cart:', error);
        res.status(500).json({ success: false, message: 'Failed to update cart', error: error.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    try {
        const { itemName } = req.params;

        const cart = await cartModel.findOne();

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.name !== itemName);

        // Recalculate total
        cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        await cart.save();
        res.status(200).json({ success: true, data: cart, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ success: false, message: 'Failed to remove item from cart', error: error.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await cartModel.findOne();

        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        cart.items = [];
        cart.total = 0;

        await cart.save();
        res.status(200).json({ success: true, data: cart, message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ success: false, message: 'Failed to clear cart', error: error.message });
    }
};
