const express = require('express');
const { 
    getProducts, 
    getProductBySlug, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/products');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), createProduct);

router.route('/:id')
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.get('/slug/:slug', getProductBySlug);

module.exports = router;
