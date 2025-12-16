import express from 'express';
import {
    getAllMenuItems,
    getMenuByCategory,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
} from '../controllers/menuController.js';

const router = express.Router();

// Get all menu items
router.get('/', getAllMenuItems);

// Get menu items by category
router.get('/category/:category', getMenuByCategory);

// Add new menu item (admin)
router.post('/', addMenuItem);

// Update menu item (admin)
router.put('/:id', updateMenuItem);

// Delete menu item (admin)
router.delete('/:id', deleteMenuItem);

export default router;
