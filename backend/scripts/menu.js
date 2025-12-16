import mongoose from 'mongoose';
import dotenv from 'dotenv';
import menuModel from '../models/menuModel.js';
import connectDB from '../config/connect.js';

dotenv.config();

const menuData = [
    // Rice Plates
    { name: "Eggplant with Chicken on Rice", price: 9.50, category: "Rice Plates"},
    { name: "Braised Bean Curd on Rice", price: 8.50, category: "Rice Plates"},
    { name: "Beef with Broccoli on Rice", price: 9.50, category: "Rice Plates"},
    { name: "Chop Suey on Rice", price: 9.95, category: "Rice Plates"},
    { name: "Beef with Vegetables on Rice", price: 9.50, category: "Rice Plates"},
    { name: "Chopped Beef with Beans on Rice", price: 9.50, category: "Rice Plates"},
    { name: "Beef with Bean Curd on Rice", price: 9.50, category: "Rice Plates"},
    { name: "Squid with Pickled Vegetables on Rice", price: 9.50, category: "Rice Plates"},
    { name: "Spareribs in Black Bean Sauce on Rice", price: 9.50, category: "Rice Plates"},
    
    // Rice Congee
    { name: "Plain Congee", price: 3.95, category: "Rice Congee"},
    { name: "Pork Stomach Porridge", price: 7.50, category: "Rice Congee"},
    { name: "Sliced Fish Congee", price: 7.95, category: "Rice Congee"},
    { name: "Fishball and Lettuce Porridge", price: 7.95, category: "Rice Congee"},
    { name: "Sampan Porridge", price: 7.50, category: "Rice Congee"},
    { name: "Meat Ball Porridge", price: 7.50, category: "Rice Congee"},
    { name: "Sliced Fish and Beef Porridge", price: 9.25, category: "Rice Congee"},
    { name: "Sliced Pork and Thousand Egg Porridge", price: 7.50, category: "Rice Congee"},
    { name: "Beef Porridge", price: 8.25, category: "Rice Congee"}
];

const seedMenu = async () => {
    try {
        console.log('Starting menu seed...');
        
        await connectDB();
        
        // Clear existing menu items
        await menuModel.deleteMany({});
        console.log('Cleared existing menu items');
        
        // Insert new menu items
        const insertedItems = await menuModel.insertMany(menuData);
        console.log(`Inserted ${insertedItems.length} menu items`);
        
        console.log('\nMenu seeding completed successfully!\n');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding menu:', error);
        process.exit(1);
    }
};

seedMenu();
