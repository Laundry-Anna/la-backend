const store = require('../../models/store');
const storeMiddleware = require('../../middlewares/storeMiddleware');
const Customer = require('../../models/customer');
const LocationUtils = require('../../utils/locationUtils');

exports.getStoreById = async (req, res, next, id) => {
  try {
    await store.findById(id).exec((error, store) => {
      if (error || !store) {
        return res.status(400).json({
          error: true,
          message: 'Store not exist',
        });
      }
      req.storeData = store;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.insertStore = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    // check if same store already exists in company
    let stores = await store.find(
      {
        companyId: req.user.companyId,
      },
      { storeName: 1, _id: 0, storeCode: 1, storeMobile: 1 }
    );
    if (stores) {
      // check if same store name exists in the company
      const isDuplicateName = await storeMiddleware.isDuplicateCheckValidation(
        stores,
        req.body,
        'storeName'
      );
      if (isDuplicateName) {
        return res.status(400).json({
          error: true,
          message: 'Store name already exists',
        });
      }
      // check if same store mobile exists or not
      const isDuplicateMobile = await storeMiddleware.isDuplicateCheckValidation(
        stores,
        req.body,
        'mobile'
      );
      if (isDuplicateMobile) {
        return res.status(400).json({
          error: true,
          message: 'Mobile number already exists',
        });
      }
      // check if same store code exists or not
      const isDuplicateCode = await storeMiddleware.isDuplicateCheckValidation(
        stores,
        req.body,
        'code'
      );
      if (typeof isDuplicateCode !== 'undefined') {
        return res.status(400).json({
          error: true,
          message: 'Store code already exists',
        });
      }
    }
    // insert into store table
    const newstore = new store({
      storeName: req.body.storeName,
      storeCode: req.body.storeCode,
      companyId: req.user.companyId,
      cityId: req.body.cityId,
      storeAddress: req.body.storeAddress,
      isVirtual: req.body.isVirtual,
      showInStoreLocator: req.body.showInStoreLocator,
      //parentStore : req.body.parentStore,
      //storePincode: req.body.storePincode,
      //storeLocation: geoLocation,
      //storePolygon: storePolygon,
      storeMobile: req.body.storeMobile,
      storeMobileAlternate: req.body.storeMobileAlternate,
      isFranchise: req.body.isFranchise,
      royalityOnlinePercentage: req.body.royalityOnlinePercentage,
      royalityOfflinePercentage: req.body.royalityOfflinePercentage,
      storeOwners: req.body.storeOwners,
      storeDeliveryBoys: req.body.storeDeliveryBoys,
      storeStaffBoys: req.body.storeStaffBoys,
      storeStatus: req.body.storeStatus,
      createdBy: req.user._id,
      createdType: req.user.userType, // staff, customer
      inTime: req.body.inTime,
      outTime: req.body.outTime,
    });
    if (req.body.parentStore) {
      newstore.parentStore = req.body.parentStore;
    }
    if (req.body.ratecardOnline) {
      newstore.ratecardOnline = req.body.ratecardOnline;
    }
    if (req.body.ratecardOffline) {
      // check if ratecard others is array or not
      if (!Array.isArray(req.body.ratecardOffline)) {
        return res.status(400).json({
          error: true,
          message: 'Please enter valid offline ratecards',
        });
      }
      newstore.ratecardOffline = req.body.ratecardOffline;
    }
    if (req.body.storeCoordinates) {
      const storePolygon = {
        type: 'Polygon',
        coordinates: req.body.storeCoordinates,
      };
      newstore.storePolygon = storePolygon;
    }
    let insertStore = await newstore.save();
    if (insertStore) {
      res.status(200).json({
        error: false,
        message: 'Store added successfully',
        data: {
          _id: insertStore._id,
        },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Something went wrong. Please try again - Add Store',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getAllStores = async (req, res) => {
  try {
    console.log('req : ' + req);
    await store.find({ companyId: req.user.companyId }).exec((error, store) => {
      if (error || !store) {
        return res.status(400).json({
          error: true,
          message: 'Stores not found',
        });
      }
      res.json({
        error: false,
        data: {
          store,
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

exports.getStore = async (req, res) => {
  try {
    return res.json({
      error: false,
      data: req.storeData,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.updateStore = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
    // check if same store already exists in company
    let stores = await store.find(
      {
        companyId: req.user.companyId,
      },
      { storeName: 1, _id: 1, storeCode: 1, storeMobile: 1 }
    );
    if (stores) {
      if (
        typeof req.body.storeName !== 'undefined' &&
        req.body.storeName !== ''
      ) {
        // check if same store name exists in the company
        const isDuplicateName = await storeMiddleware.isDuplicateCheckValidationUpdate(
          stores,
          req.body,
          'name',
          req.query.id
        );
        if (isDuplicateName) {
          return res.status(400).json({
            error: true,
            message: 'Store name already exists',
          });
        }
      }
      if (
        typeof req.body.storeMobile !== 'undefined' &&
        req.body.storeMobile !== ''
      ) {
        // check if same store mobile exists or not
        const isDuplicateMobile = await storeMiddleware.isDuplicateCheckValidationUpdate(
          stores,
          req.body,
          'mobile',
          req.query.id
        );
        if (isDuplicateMobile) {
          return res.status(400).json({
            error: true,
            message: 'Mobile number already exists',
          });
        }
      }
      if (
        typeof req.body.storeCode !== 'undefined' &&
        req.body.storeCode !== ''
      ) {
        // check if same store code exists or not
        const isDuplicateCode = await storeMiddleware.isDuplicateCheckValidationUpdate(
          stores,
          req.body,
          'code',
          req.query.id
        );
        if (typeof isDuplicateCode !== 'undefined') {
          return res.status(400).json({
            error: true,
            message: 'Store code already exists',
          });
        }
      }
    }
    req.body.updatedBy = req.user._id;
    req.body.updatedType = req.user.userType; // staff, customer
    if (req.body.storeCoordinates) {
      const { storeCoordinates } = req.body;
      //const geoLocation = { type: 'Point', coordinates: [longitude, latitude] };
      const storePolygon = { type: 'Polygon', coordinates: storeCoordinates };
      //console.log(storePolygon);
      //req.body.storeLocation = geoLocation;
      req.body.storePolygon = storePolygon;
      //delete req.body.latitude;
      //delete req.body.longitude;
      //delete req.body.storeCoordinates;
    }
    if (!req.body.parentStore) {
      delete req.body.parentStore;
    }
    if (!req.body.ratecardOnline) {
      delete req.body.ratecardOnline;
    }
    // if (!req.body.ratecardOffline) {
    //   delete req.body.ratecardOffline;
    // }
    if (req.body.ratecardOffline) {
      // check if ratecard others is array or not
      if (!Array.isArray(req.body.ratecardOffline)) {
        return res.status(400).json({
          error: true,
          message: 'Please enter valid offline ratecards',
        });
      }
    } else {
      delete req.body.ratecardOffline;
    }
    let updateStore = await store.findByIdAndUpdate(
      { _id: req.query.id },
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    if (updateStore) {
      res.status(201).json({
        error: false,
        data: updateStore,
        message: 'Store updated successfully',
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Store not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.searchStoreByLocation = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.customerId);
  let customer = await Customer.findById(id);
  //Find all stores of the company
  let stores = await Store.find({'companyId': customer.companyId});
 
  let store = null;
  for(let i=0;i<stores.length;i++) {
    let s = stores[i].toJSON();
    if(LocationUtils.checkCoordinates(latitude, longitude, s.storePolygon.coordinates[0])) {
      store = stores[i];
      break;
    }
    store = stores[i];
    break;
  }
  if(store) {
    return res.status(400).json({
      error: false,
      data: store
    });
  } else {
    return res.status(400).json({
      error: true,
      message: 'No service available in your location',
    });
  }
  console.log('store', store)
};