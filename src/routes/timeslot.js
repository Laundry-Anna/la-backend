const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');

const { getTimeslot, updateTimeslot, getAllTimeSlots } = require('../controllers/timeslot');

// get single timeslot
router.get('/', verifyToken, getTimeslot);


/**
 * This function comment is parsed by doctrine
 * @route GET /timeslot/search
 * @group timeslot - Operations about timeslots
 * @param {string} customerId.query.optional - customer Id
 * @param {string} companyId.query.optional - company Id
 * @param {string} latitude.query.required - location latitude.
 * @param {string} longitude.query.required - location longitude.
 * @returns {object} 200 - Available store details in the provided location
 * @returns {Error}  default - Unexpected error
 */
//get timeslots by address
router.get('/search', verifyToken, getAllTimeSlots);


// update timeslot
router.put('/', verifyToken, updateTimeslot);

module.exports = router;
