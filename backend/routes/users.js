const express = require('express');
const { getUsers } = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// This route should be protected and only accessible by admins
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
