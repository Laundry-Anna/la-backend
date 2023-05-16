const item = require('../../models/item');
const itemMiddleware = require('../../middlewares/itemMiddleware');

exports.insertItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    // check if same item name exists
    const isDuplicate = await itemMiddleware.isDuplicateItemNameCheck(
      req.body.itemList
    );
    if (isDuplicate) {
      return res.status(400).json({
        error: true,
        message: 'Same Item name exists. Please check',
      });
    }
    // check if item already exists for companyid
    let validateCheck = await item.find({ companyId: req.user.companyId });
    if (validateCheck && validateCheck.length > 0) {
      return res.status(400).json({
        error: true,
        message: 'Item for the company already exists',
      });
    }
    // insert into item table
    const newItem = new item({
      itemList: req.body.itemList,
      companyId: req.user.companyId,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
    });
    //console.log(newCat);
    newItem.save((error, item) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert user in DB - item list',
        });
      }
      res.json({
        error: false,
        message: 'Items added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getItem = async (req, res) => {
  try {
    let itemData = await item.find({
      companyId: req.user.companyId,
    });
    if (itemData) {
      return res.json({
        error: false,
        data: itemData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Itemlist does not exist with company',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
exports.updateItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    // check if same item name exists
    if (typeof req.body.itemList !== 'undefined' && req.body.itemList !== '') {
      const isDuplicate = await itemMiddleware.isDuplicateItemNameCheck(
        req.body.itemList
      );
      if (isDuplicate) {
        return res.status(400).json({
          error: true,
          message: 'Same Item name exists. Please check',
        });
      }
    }
    // check if item already exists for companyid
    let validateCheck = await item.find({ companyId: req.user.companyId });
    if (!validateCheck) {
      return res.status(400).json({
        error: true,
        message:
          'Item for the company not exists. Please create item list for the company',
      });
    }
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updateItemList = await item.findOneAndUpdate(
      { companyId: req.user.companyId },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateItemList) {
      res.status(200).json({
        error: false,
        data: updateItemList,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Item list not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
