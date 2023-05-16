const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth');
const {
  getServiceById,
  insertService,
  getAllService,
  getService,
  updateService,
} = require('../../controllers/admin/service');

router.param('id', getServiceById);

// insert new service
router.post('/', verifyToken, insertService);

// get all services
router.get('/', verifyToken, getAllService);

// get single service
router.get('/:id', verifyToken, getService);

// update service
router.put('/:id', verifyToken, updateService);

// delete service
//router.delete("/:id", deleteService);

module.exports = router;
