import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    total: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const cartModel = mongoose.models.cart || mongoose.model('cart', cartSchema);

export default cartModel;