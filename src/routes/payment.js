const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

const { generatePaymentLink, updatePayment} = require('../controllers/payment');


/**
 * This function comment is parsed by doctrine
 * @route GET /payment
 * @group payments - Operations about payments
 * @returns {object} 200 - Payment details
 * @returns {Error}  default - Unexpected error
 */
//get timeslots by address
//router.get('/', verifyToken, getAllTimeSlots);


// generate payment link
/**
 * This function comment is parsed by doctrine
 * @route POST /payment/generate
 * @group payments - Operations about payments
 * 
 * @param {number} amount.body.required - amount to be paid
 * @param {string} customerId.body.required - Customer Id
 * @param {string} orderId.body.optional - Order Id for which payment is initiated
 * @param {string} type.body.optional - Payment Type: ORDER_PAYMENT,WALLET_TOPUP
 * @returns {object} 200 - Payment details
 * @returns {Error}  default - Unexpected error
 */
router.post('/generate', verifyToken, generatePaymentLink);


//webhook api for razorpay

router.post('/update', updatePayment);

module.exports = router;
