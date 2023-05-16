const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth');

const {
  insertOrder,
  getOrder,
  getOrders,
  updateOrder,
  getOrderId,
  assignPickupStaff,
  getPickupStaffsForOrder
} = require('../../controllers/order');

//router.param('id', getOrderId);

// insert new order
router.post('/', verifyToken, insertOrder);

// get single order
router.get('/:orderId', verifyToken, getOrder);

// get orders
router.get('/', verifyToken, getOrders);

// update order
router.put('/:orderId', verifyToken, updateOrder);




/**
 * This function comment is parsed by doctrine
 * @route POST /:orderId/pickup
 * @group timeslot - Operations about timeslots
 * @param {string} orderId.param.optional - Order Id
 * @param {string} companyId.query.optional - company Id
 * @param {string} latitude.query.required - location latitude.
 * @param {string} longitude.query.required - location longitude.
 * @returns {object} 200 - Available store details in the provided location
 * @returns {Error}  default - Unexpected error
 */
// assign pickup order
router.put('/:orderId/pickup', verifyToken, assignPickupStaff);


/**
 * This function comment is parsed by doctrine
 * @route GET /:orderId/:timeslotId/staffs
 * @group timeslot - Operations about timeslots
 * @param {string} orderId.param.required - Order Id
 * @param {string} timeslotId.param.required - Timeslot Id
 * @returns {object} 200 - Available staffs
 * @returns {Error}  default - Unexpected error
 */
// assign pickup order
router.get('/:orderId/:timeslotId/staffs', verifyToken, getPickupStaffsForOrder);

module.exports = router;
