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
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReview' }]
}, {
    timestamps: true
});

// Recalculate average rating when a review is added/removed
ProductSchema.statics.calculateAverageRating = async function(productId) {
    const obj = await this.aggregate([
        {
            $match: { _id: productId }
        },
        {
            $lookup: {
                from: 'productreviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        },
        {
            $project: {
                averageRating: { $avg: '$reviews.rating' },
                numOfReviews: { $size: '$reviews' }
            }
        }
    ]);

    try {
        await this.findByIdAndUpdate(productId, {
            ratings: {
                average: obj[0].averageRating ? obj[0].averageRating.toFixed(1) : 0,
                count: obj[0].numOfReviews
            }
        });
    } catch (error) {
        console.error(error);
    }
};

ProductSchema.post('save', function() {
    this.constructor.calculateAverageRating(this._id);
});

ProductSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    await this.model('ProductReview').deleteMany({ product: this._id });
    next();
});


module.exports = mongoose.model('Product', ProductSchema);
