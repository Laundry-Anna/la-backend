const category = require('../../models/category');
const commonValidation = require('../../middlewares/commonvalidation');

exports.getCatById = async (req, res, next, id) => {
  try {
    await category.findById(id).exec((error, cat) => {
      if (error || !cat) {
        return res.status(400).json({
          error: true,
          message: 'Category does not exist.',
        });
      }
      req.catData = cat;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.insertCat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    const { catName } = req.body;
    // check if same category already exists
    let getCategories = await category.find(
      {
        $and: [
          {
            companyId: req.user.companyId,
          },
          {
            mcId: req.body.mcId,
          },
        ],
      },
      { catName: 1, _id: 0 }
    );
    if (getCategories) {
      // check if same category name exists in the company
      const hasValue = await commonValidation.insertCatvalueExistsInJSON(
        getCategories,
        catName
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Category already exists',
        });
      }
    }
    // insert into category table
    const newCat = new category({
      catName: req.body.catName,
      mcId: req.body.mcId,
      catSmallDesc: req.body.catSmallDesc,
      catDesc: req.body.catDesc,
      catDeliveryCharge: req.body.catDeliveryCharge,
      catDeliveryDuration: req.body.catDeliveryDuration,
      catDeliveryDurationText: req.body.catDeliveryDurationText,
      catExpressDeliveryDuration: req.body.catExpressDeliveryDuration,
      catExpressDeliveryDurationText: req.body.catExpressDeliveryDurationText,
      catImage: req.body.catImage,
      companyId: req.user.companyId,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
    });
    newCat.save((error, cat) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert user in DB - cat',
        });
      }
      res.json({
        error: false,
        message: 'Category added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getAllCat = async (req, res) => {
  try {
    await category
      .find({ companyId: req.user.companyId })
      .exec((error, cat) => {
        if (error || !category) {
          return res.status(400).json({
            error: true,
            message: 'Categories not found',
          });
        }
        res.json({
          error: false,
          data: {
            cat,
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

exports.getCat = async (req, res) => {
  try {
    return res.json({
      error: false,
      data: req.catData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateCat = async (req, res) => {
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
    const { catName } = req.body;
    // check if same category already exists
    let getCategories = await category.find(
      {
        $and: [
          {
            companyId: req.user.companyId,
          },
          {
            mcId: req.body.mcId,
          },
        ],
      },
      { catName: 1, _id: 1 }
    );
    if (getCategories) {
      // check if same category name exists in the company
      const hasValue = await commonValidation.updateCatupdateValueExistsInJson(
        getCategories,
        catName,
        req.query.id
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Mothercategory already exists',
        });
      }
    }
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updateCat = await category.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateCat) {
      res.status(200).json({
        error: false,
        data: updateCat,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Category not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
