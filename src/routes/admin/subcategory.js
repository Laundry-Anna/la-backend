const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/auth');

const {
  getSubcatById,
  insertSubcat,
  getAllSubcat,
  getSubcat,
  updateSubcat,
} = require('../../controllers/admin/subcategory');

router.param('id', getSubcatById);

// insert new category
router.post('/', verifyToken, insertSubcat);

// get all categories
router.get('/', verifyToken, getAllSubcat);

// get single categories
router.get('/:id', verifyToken, getSubcat);

// update category
router.put('/', verifyToken, updateSubcat);

// delete sub category
//router.delete("/:id", deleteSubcat);

module.exports = router;
