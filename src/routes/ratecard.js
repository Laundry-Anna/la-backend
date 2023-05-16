const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth');
const {
  //getRatecardById,
  insertRateCard,
  getRateCard,
  updateRateCard,
} = require('../controllers/ratecard');
// validation

// insert ratecard
router.post('/', verifyToken, insertRateCard);
// get ratecard
router.get('/', verifyToken, getRateCard); // query params - id, name, mobile, store
// update ratecard
router.put('/', verifyToken, updateRateCard);

module.exports = router;
