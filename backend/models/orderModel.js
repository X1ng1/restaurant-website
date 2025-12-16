import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    sessionId: { type: String, required: true },
    items: [{
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }],
    total: { type: Number, required: true },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
