import express from 'express';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from '../controllers/cartController.js';

const router = express.Router();

// Get cart
router.get('/', getCart);

// Add item to cart
router.post('/', addToCart);

// Update item quantity
router.put('/:itemName', updateCartItem);

// Remove item from cart
router.delete('/:itemName', removeFromCart);

// Clear cart
router.delete('/', clearCart);

export default router;
