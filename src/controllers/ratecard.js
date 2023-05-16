const ratecard = require('../models/ratecard');
const store = require('../models/store');
const commonValidation = require('../middlewares/commonvalidation');
const ratecardMiddleware = require('../middlewares/ratecardMiddleware');

// exports.getRatecardById = async (req, res, next, id) => {
//     try {
//       await ratecard.findById(id).exec((error, ratecard) => {
//         if (error || !ratecard) {
//           return res.status(400).json({
//             error: 'Ratecard not exist',
//           });
//         }
//         req.ratecardData = ratecard;
//         next();
//       });
//     } catch (error) {
//       return res.status(500).json({
//         error: error.message,
//       });
//     }
//   };
exports.insertRateCard = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    const { rateCardName } = req.body;
    // check if rateCardName already exists for company
    let getRateCards = await ratecard.find(
      {
        companyId: req.user.companyId,
      },
      { rateCardName: 1, _id: 0 }
    );
    if (getRateCards) {
      // check if same ratecard name exists in the company
      const hasValue = await commonValidation.insertRatecardvalueExistsInJSON(
        getRateCards,
        rateCardName
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Ratecard already exists',
        });
      }
    }
    const newRatecard = new ratecard({
      rateCardName: req.body.rateCardName,
      companyId: req.user.companyId,
      rateCardServices: req.body.rateCardServices, // JSON
      storeId: req.body.storeId,
      //rateCardType: req.body.rateCardType, // Online , Offline, Others, empty
      rateCardStatus: req.body.rateCardStatus,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
    });
    let insertRatecard = await newRatecard.save();
    if (insertRatecard) {
      res.status(200).json({
        error: false,
        message: 'Ratecard added successfully',
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Something went wrong. Please try again - add rate card',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateRateCard = async (req, res) => {
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
    const { rateCardName } = req.body;
    // check if rateCardName already exists for company
    let getRateCards = await ratecard.find(
      {
        companyId: req.user.companyId,
      },
      { rateCardName: 1, _id: 1 }
    );
    if (getRateCards) {
      // check if same ratecard name exists in the company
      const hasValue = await commonValidation.updateRatecardupdateValueExistsInJson(
        getRateCards,
        rateCardName,
        req.query.id
      );
      if (typeof hasValue !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Ratecard already exists',
        });
      }
    }
    // if ratecard is making inactive, check if ratecard is assigned to a store or not.
    if (
      typeof req.body.rateCardStatus !== 'undefined' &&
      req.body.rateCardStatus !== '' &&
      req.body.rateCardStatus === 'Inactive'
    ) {
      let getStoreRatecards = await store.find(
        {
          companyId: req.user.companyId,
        },
        { ratecardOnline: 1, ratecardOffline: 1, _id: 0, storeName: 1 }
      );
      // Send error message that ratecard is assigned to store
      const hasAssignedToStore = await ratecardMiddleware.checkRatecardAssignedToStore(
        getStoreRatecards,
        req.query.id
      );
      if (typeof hasAssignedToStore !== 'undefined') {
        return res.status(400).json({
          error: true,
          message:
            'Ratecard is assigned to store ' +
            hasAssignedToStore.storeName +
            '. Please check',
        });
      }
    }
    // check if same service name exists in ratecard

    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    let updateRateCard = await ratecard.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateRateCard) {
      res.status(200).json({
        error: false,
        data: updateRateCard,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Ratecard not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getRateCard = async (req, res) => {
  try {
    //console.log("aaaaaa");
    // if (typeof req.query === 'undefined') {
    //   return res.status(400).json({
    //     error:
    //       'Please enter a valid input to fetch ratecards. Please check the parameters',
    //   });
    // }
    if (typeof req.query.id !== 'undefined' && req.query.id !== '') {
      //console.log("bbbbb");
      // get staff details
      let companyData = await ratecard.findById(req.query.id);
      if (companyData) {
        return res.json({
          error: false,
          data: companyData,
        });
      } else {
        return res.status(400).json({
          error: true,
          message: 'Ratecard not exist',
        });
      }
    }
    //console.log("cccccc");
    //console.log("comapany : "+req.query.companyId);
    //console.log("store : "+req.query.storeId);
    // if (typeof req.query.storeId !== 'undefined' && req.query.storeId !== '') {
    //   //console.log("iffffff");
    //   let storeData = await ratecard.find({
    //     //storeId: { $regex: req.query.storeId, $options: 'i' },
    //     storeId: req.query.storeId,
    //   });
    //   // TODO limit staff
    //   if (storeData) {
    //     return res.json({
    //       error: null,
    //       data: storeData,
    //     });
    //   } else {
    //     return res.status(400).json({
    //       error: 'Ratecards does not exist with store',
    //     });
    //   }
    // }
    // TODO companyId must be fetched based on login
    //console.log("aaa "+req.query.companyId);
    // if (
    //   typeof req.query.companyId !== 'undefined' &&
    //   req.query.companyId !== ''
    // ) {
    //console.log("elseee   iffffff");
    //console.log(req.user.companyId);
    let companyData = await ratecard.find({
      companyId: req.user.companyId,
    });
    if (companyData) {
      return res.json({
        error: false,
        data: companyData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Ratecards does not exist with company',
      });
    }
    //}
    // if (
    //   typeof req.query.storeId !== 'undefined' &&
    //   req.query.storeId !== '' &&
    //   typeof req.query.companyId !== 'undefined' &&
    //   req.query.companyId !== ''
    // ) {
    //   //console.log("elseeeee");
    //   let storeData = await ratecard.find({
    //     $or: [
    //       {
    //         companyId: req.query.companyId,
    //       },
    //       {
    //         storeId: req.query.storeId,
    //       },
    //     ],
    //   });
    //   // TODO limit staff
    //   if (storeData) {
    //     return res.json({
    //       error: null,
    //       data: storeData,
    //     });
    //   } else {
    //     return res.status(400).json({
    //       error: 'Ratecards does not exist with store and company',
    //     });
    //   }
    // }
    //console.log("end of api");
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
