const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');

const {
  getCustomerById,
  insertCustomer,
  //getAllCustomers,
  getCustomer,
  updateCustomer,
} = require('../controllers/customer');

router.param('id', getCustomerById);

// insert new customer
router.post('/', verifyToken, insertCustomer);

// get all customer
//router.get('/',verifyToken, getAllCustomers);

// get single customer
router.get('/', verifyToken, getCustomer);

// update customer
router.put('/', verifyToken, updateCustomer);

module.exports = router;
