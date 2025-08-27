const mongoose = require('mongoose');

const ProductReviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide a rating'],
    },
    title: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
    },
}, { timestamps: true });

ProductReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
ProductReviewSchema.statics.calculateAverageRating = async function (productId) {
    const stats = await this.aggregate([
        { $match: { product: productId, status: 'approved' } },
        {
            $group: {
                _id: '$product',
                averageRating: { $avg: '$rating' },
                numOfReviews: { $sum: 1 },
            },
        },
    ]);

    try {
        await this.model('Product').findByIdAndUpdate(productId, {
            ratings: {
                average: stats[0]?.averageRating.toFixed(1) || 0,
                count: stats[0]?.numOfReviews || 0,
            },
        });
    } catch (error) {
        console.error(error);
    }
};

ProductReviewSchema.post('save', function () {
    this.constructor.calculateAverageRating(this.product);
});

ProductReviewSchema.post('deleteOne', { document: true, query: false }, async function () {
    await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('ProductReview', ProductReviewSchema);
