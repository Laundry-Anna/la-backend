const express = require('express');
const router = express.Router();

const { verifyToken } = require('../../middlewares/auth');
const {
  validateInsertStore,
  storeValidationResult,
  validate,
  validateSearchStore
} = require('../../validators/store');

const {
  getStoreById,
  insertStore,
  getAllStores,
  getStore,
  updateStore,
  searchStoreByLocation
} = require('../../controllers/admin/store');

router.param('id', getStoreById);

// insert new category
router.post(
  '/',
  verifyToken,
  validateInsertStore,
  storeValidationResult,
  insertStore
);

// get all categories
router.get('/', verifyToken, getAllStores);

// get single categories
router.get('/:id', verifyToken, getStore);

// update category
router.put('/', verifyToken, updateStore);


/**
 * This function comment is parsed by doctrine
 * @route GET /store/search
 * @group store - Store related APIs
 * @param {string} customerId.query.required - customer Id
 * @param {string} latitude.query.required - location latitude.
 * @param {string} longitude.query.required - location longitude.
 * @returns {object} 200 - An array of timselots and store details
 * @returns {Error}  default - Unexpected error
 */
//get timeslots by address
router.get('/search', verifyToken, validateSearchStore(), validate, searchStoreByLocation);

// delete category
//router.delete("/:id", deleteCat);

module.exports = router;
