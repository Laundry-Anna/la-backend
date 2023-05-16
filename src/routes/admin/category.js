const express = require('express');
const router = express.Router();

const {
  validateInsertCat,
  CatValidationResult,
} = require('../../validators/category');

const { verifyToken } = require('../../middlewares/auth');

const {
  getCatById,
  insertCat,
  getAllCat,
  getCat,
  updateCat,
} = require('../../controllers/admin/category');

router.param('id', getCatById);
//router.use();
// insert new category
router.post('/', verifyToken, insertCat);

// get all categories
router.get('/', verifyToken, getAllCat);

// get single categories
router.get('/:id', verifyToken, getCat);

// update category
router.put('/', verifyToken, updateCat);

// delete category
//router.delete("/:id", deleteCat);

module.exports = router;
