const express = require('express');
const { 
    getProducts, 
    getProductBySlug, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/products');
const { createReview, getProductReviews } = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), createProduct);

router.route('/:id')
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.get('/slug/:slug', getProductBySlug);

// Reviews for a specific product
router.route('/:productId/reviews')
    .post(protect, createReview)
    .get(getProductReviews);

module.exports = router;
