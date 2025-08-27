const ProductReview = require('../models/ProductReview');
const Product = require('../models/Product');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
exports.getReviews = async (req, res, next) => {
    try {
        const reviews = await ProductReview.find().populate('product', 'name').populate('user', 'fullName');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get reviews for a single product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getProductReviews = async (req, res, next) => {
    try {
        const reviews = await ProductReview.find({ product: req.params.productId, status: 'approved' }).populate('user', 'fullName');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Create a review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;

    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const existingReview = await ProductReview.findOne({ product: req.params.productId, user: req.user.id });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }

        const review = await ProductReview.create(req.body);
        res.status(201).json({ success: true, data: review });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};


// @desc    Update review status
// @route   PUT /api/reviews/:id
// @access  Private/Admin
exports.updateReviewStatus = async (req, res, next) => {
    try {
        let review = await ProductReview.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }
        
        review.status = req.body.status;
        await review.save();

        // Recalculate product rating after status change
        await ProductReview.calculateAverageRating(review.product);

        res.status(200).json({ success: true, data: review });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
exports.deleteReview = async (req, res, next) => {
    try {
        const review = await ProductReview.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Optional: Check if user is admin or owner of review
        // if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        //     return res.status(401).json({ success: false, message: 'Not authorized' });
        // }

        const productId = review.product;
        await review.deleteOne();

        // Recalculate product rating
        await ProductReview.calculateAverageRating(productId);

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
