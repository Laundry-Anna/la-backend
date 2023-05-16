const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/auth');
const {
  getAllStaffTypes,
  insertStaffType,
} = require('../../controllers/admin/stafftypes');

router.get('/', verifyToken, getAllStaffTypes);
router.post('/', verifyToken, insertStaffType);
module.exports = router;
