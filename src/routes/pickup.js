const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');

const {
  getPickupBoys
} = require('../controllers/pickup');



// insert new order
//router.post('/', verifyToken, createPickup);


//router.get('/:id', verifyToken, getPickup);

// get pickup boys list

/**
 * This function comment is parsed by doctrine
 * @route GET /pickup/boys
 * @group pickup - Operations about pickup
 * @param {string} orderId.query.optional - Order Id
 * @param {string} storeId.query.optional - Store Id
 * @returns {object} 200 - Available staffs for the pickup
 * @returns {Error}  default - Unexpected error
 */

router.get('/boys', verifyToken, getPickupBoys);

// update customer
//router.put('/', verifyToken, updatePickup);

module.exports = router;
