const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth');

const {
  insertSlot,
  getSlot,
  getSlots,
  updateSlot,
  getSlotId,
  getAvailableSlots
} = require('../controllers/slot');

//router.param('id', getSlotId);

// insert new slot
router.post('/', verifyToken, insertSlot);


//router.get('/:id', verifyToken, getSlot);

// get single slot
router.get('/available', verifyToken, getAvailableSlots);

// update customer
//router.put('/', verifyToken, updateSlot);

module.exports = router;
