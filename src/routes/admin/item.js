const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth');

const {
  insertItem,
  getItem,
  updateItem,
} = require('../../controllers/admin/item');

//router.use(); // this can be used for verifytoken. Check google
// insert new item
router.post('/', verifyToken, insertItem);

// get single item based on company id
router.get('/', verifyToken, getItem);

// update item
router.put('/', verifyToken, updateItem);

module.exports = router;
