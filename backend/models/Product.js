const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema({
    original: { type: Number, required: true },
    discounted: { type: Number },
    currency: { type: String, default: '₹' },
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true,
        default: () => `P${Date.now()}`
    },
    slug: {
        type: String,
        required: [true, 'Please add a slug'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand'],
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL'],
    },
    extraImages: [String],
    quantity: {
        type: Number,
        required: [true, 'Please add quantity'],
    },
    price: {
        type: MoneySchema,
        required: true
    },
    shortDescription: String,
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    features: [String],
    tags: [String],
    ratings: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
