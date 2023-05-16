const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth');

const {
  getCompanyById,
  insertCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
} = require('../../controllers/admin/company');

router.param('id', getCompanyById);

// insert new category
router.post('/',  insertCompany);

// get all categories
router.get('/', verifyToken, getAllCompanies);

// get single categories
router.get('/:id', verifyToken, getCompany);

// update category
router.put('/', verifyToken, updateCompany);

// delete category
//router.delete("/:id", deleteCat);

module.exports = router;
