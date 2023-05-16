const subCategory = require('../../models/subcategory');
const commonValidation = require('../../middlewares/commonvalidation');

exports.getSubcatById = async (req, res, next, id) => {
  try {
    await subCategory.findById(id).exec((error, subcat) => {
      if (error || !subcat) {
        return res.status(400).json({
          error: true,
          message: 'Something went wrong. Please try again',
        });
      }
      req.subcatData = subcat;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.insertSubcat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    const { subcatName } = req.body;
    // check if same subcategory already exists
    let getCategories = await category.find(
      {
        $and: [
          {
            companyId: req.user.companyId,
          },
          {
            mcId: req.body.mcId,
          },
          {
            catId: req.body.catId,
          },
        ],
      },
      { subcatName: 1, _id: 0 }
    );
    if (getCategories) {
      // check if same sub category name exists in the company
      const hasValue = await commonValidation.insertSubcatvalueExistsInJSON(
        getCategories,
        subcatName
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Sub category already exists',
        });
      }
    }
    // insert into subcategory table
    const newSubcat = new subCategory({
      subcatName: req.body.subcatName,
      mcId: req.body.mcId,
      subcatId: req.body.subcatId,
      subcatSmallDesc: req.body.subcatSmallDesc,
      subcatDesc: req.body.subcatDesc,
      subcatImage: req.body.subcatImage,
      companyId: req.user.companyId,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
    });
    newSubcat.save((error, subcat) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert user in DB - subcat',
        });
      }
      res.status(201).json({
        error: false,
        message: 'Subcategory added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getAllSubcat = async (req, res) => {
  try {
    await subCategory.find().exec((error, subcat) => {
      if (error || !subcat) {
        return res.status(400).json({
          error: true,
          message: 'Subcategories not found',
        });
      }
      res.json({
        error: false,
        data: {
          subcat,
        },
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getSubcat = async (req, res) => {
  try {
    return res.json({
      error: false,
      data: req.subcatData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateSubcat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    if (typeof req.body._id !== 'undefined' && req.body._id !== '') {
      delete req.body._id;
    }
    // check if same subcategory already exists
    let getCategories = await category.find(
      {
        $and: [
          {
            companyId: req.user.companyId,
          },
          {
            mcId: req.body.mcId,
          },
          {
            catId: req.body.catId,
          },
        ],
      },
      { subcatName: 1, _id: 1 }
    );
    if (getCategories) {
      // check if same sub category name exists in the company
      const hasValue = await commonValidation.updateSubcatupdateValueExistsInJson(
        getCategories,
        subcatName,
        req.query.id
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Sub category already exists',
        });
      }
    }
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updateSubCat = await subCategory.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: true }
    );
    if (updateSubCat) {
      res.status(201).json({
        error: false,
        data: updateSubCat,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
