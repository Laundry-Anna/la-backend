const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');
const { validateOrder } = require('../middlewares/order');

const {
  insertCoupon,
  getCoupon,
  updateCoupon,
  applyCoupon
} = require('../controllers/coupon');

// insert new coupon
router.post('/', verifyToken, insertCoupon);

// apply coupon to order
router.post('/apply', verifyToken, validateOrder, applyCoupon);

// get single coupon
router.get('/', verifyToken, getCoupon);

// update customer
router.put('/', verifyToken, updateCoupon);

module.exports = router;
