const motherCategory = require('../../models/mothercategory');
const commonValidation = require('../../middlewares/commonvalidation');

exports.getMCById = async (req, res, next, id) => {
  try {
    await motherCategory.findById(id).exec((error, mc) => {
      if (error || !mc) {
        return res.status(400).json({
          error: true,
          message: 'Mothercategory does not exist',
        });
      }
      req.mcData = mc;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.insertMC = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    const { mcName } = req.body;
    // check if same mothercategory already exists for the company
    let getCategories = await motherCategory.find(
      {
        companyId: req.user.companyId,
      },
      { mcName: 1, _id: 0 }
    );
    if (getCategories) {
      // check if same category name exists in the company
      const hasValue = await commonValidation.insertMCvalueExistsInJSON(
        getCategories,
        mcName
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Mothercategory already exists',
        });
      }
    }
    // insert into mothercategory table
    const newMC = new motherCategory({
      mcName: req.body.mcName,
      mcSmallDesc: req.body.mcSmallDesc,
      mcDesc: req.body.mcDesc,
      mcMinOrderValue: req.body.mcMinOrderValue,
      mcDeliveryCharge: req.body.mcDeliveryCharge,
      mcDeliveryDuration: req.body.mcDeliveryDuration,
      mcDeliveryDurationText: req.body.mcDeliveryDurationText,
      mcExpressMultiplier: req.body.mcExpressMultiplier,
      mcExpressDeliveryDuration: req.body.mcExpressDeliveryDuration,
      mcExpressDeliveryDurationText: req.body.mcExpressDeliveryDurationText,
      mcImage: req.body.mcImage,
      companyId: req.user.companyId,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
    });
    //console.log(newMC);
    newMC.save((error, mc) => {
      if (error) {
        return res.status(400).json({
          error: true,
          message: 'Not able to insert in DB - MC',
        });
      }
      res.status(201).json({
        error: false,
        message: 'Mothercategory added successfully',
      });
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getAllMC = async (req, res) => {
  try {
    await motherCategory
      .find({ companyId: req.user.companyId })
      .exec((error, mc) => {
        if (error || !mc) {
          return res.status(400).json({
            error: true,
            message: 'Mothercategories not found',
          });
        }
        res.json({
          error: false,
          data: {
            mc,
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

exports.getMC = async (req, res) => {
  try {
    return res.json({
      error: false,
      data: req.mcData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateMC = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    // check if same mother category name exists in company
    const { mcName } = req.body;
    // check if same mothercategory already exists for the company
    let getCategories = await motherCategory.find(
      {
        companyId: req.user.companyId,
      },
      {
        mcName: 1,
        _id: 1,
      }
    );
    if (getCategories) {
      // check if same category name exists in the company
      const hasValue = await commonValidation.updateMCupdateValueExistsInJson(
        getCategories,
        mcName,
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
    if (typeof req.body._id !== 'undefined' && req.body._id !== '') {
      delete req.body._id;
    }
    let updateMC = await motherCategory.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateMC) {
      res.status(201).json({
        error: false,
        data: updateMC,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Mothercategory not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

// exports.deleteMC = async (req, res) => {
//   try {
//     await motherCategory.findByIdAndUpdate(
//       { _id: req.mcData._id },
//       { $set: req.body },
//       { new: true, useFindAndModify: true },
//       (error, mc) => {
//         if (error) {
//           return res.status(400).json({
//             error: "Mothercategory not updated. Please try again",
//           });
//         }
//         res.json({
//           error: null,
//           data: mc,
//         });
//       }
//     );
//   } catch (error) {
//     return res.status(500).json({
//       error: error.message,
//     });
//   }
// };
