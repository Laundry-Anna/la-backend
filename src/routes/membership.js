const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/auth');
const {
  insertMembership,
  getmembership,
  updateMembership,
} = require('../controllers/membership');

router.post('/', verifyToken, insertMembership);

router.get('/', verifyToken, getmembership);

router.put('/', verifyToken, updateMembership);

module.exports = router;
