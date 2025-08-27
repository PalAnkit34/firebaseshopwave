const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
    },
});

const OrderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        orderItems: [OrderItemSchema],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            line1: { type: String, required: true },
            line2: { type: String },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            landmark: { type: String },
        },
        paymentMethod: {
            type: String,
            required: true,
            default: 'COD',
        },
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', OrderSchema);
