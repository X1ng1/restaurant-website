import menuModel from '../models/menuModel.js';

// Get all menu items
export const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await menuModel.find({});
        res.status(200).json({ success: true, data: menuItems });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch menu items', error: error.message });
    }
};

// Get menu items by category
export const getMenuByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const menuItems = await menuModel.find({ category });
        res.status(200).json({ success: true, data: menuItems });
    } catch (error) {
        console.error('Error fetching menu items by category:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch menu items', error: error.message });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const { name, price, category, description } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
        }

        const newItem = new menuModel({
            name,
            price,
            category,
            description
        });

        await newItem.save();
        res.status(201).json({ success: true, data: newItem, message: 'Menu item added successfully' });
    } catch (error) {
        console.error('Error adding menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to add menu item', error: error.message });
    }
};

// Update menu item
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedItem = await menuModel.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.status(200).json({ success: true, data: updatedItem, message: 'Menu item updated successfully' });
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to update menu item', error: error.message });
    }
};

// Delete menu item
export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedItem = await menuModel.findByIdAndDelete(id);
        
        if (!deletedItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ success: false, message: 'Failed to delete menu item', error: error.message });
    }
};
