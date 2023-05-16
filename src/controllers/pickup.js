const Pickup = require('../models/pickup');
const pickupMiddleware = require('../middlewares/pickup');
const storeController = require('./admin/store');
const TimeSlotHelper = require('../middlewares/timeslot');
const Order = require('../models/order')

exports.createPickup = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
   
    const insertValidateData = await pickupMiddleware.pickupValidation(
      req.body,
      req.user
    );
    if (Object.keys(insertValidateData).length > 0) {
      return res.status(400).json({
        error: insertValidateData.error,
        message: insertValidateData.message,
      });
    }
    // insert into pickup table
    const newPickup = new Pickup({
      companyId: req.user.companyId,
      storeId: req.body.storeId,
      orderId: req.body.orderId,
      staffId: req.body.staffId,
      slotId: req.body.slotId,
      timeslot: {
        date: req.body.date,
        type: 'mater',
        slotId: req.body.slotId
      },
      type: req.body.type,
      status: req.body.status,
      notes: req.body.notes,
      createdBy: req.user._id
    });
    let insertPickup = await newPickup.save();
    if (insertPickup) {
      res.status(200).json({
        error: false,
        message: 'Created Pickup successfully',
        data: {
          _id: insertPickup._id,
        },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Something went wrong. Please try again - pickup',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.getPickup = async (req, res) => {
  try {
    
    let query = {};
    if(req.query.orderId) {
      query['orderId'] = req.query.orderId;
    }
    if(req.query.companyId) {
      query['companyId'] = req.query.companyId;
    }

    if(req.query.slotId) {
      query['slotId'] = req.query.slotId;
    }
    
    if(req.query.staffId) {
      query['staffId'] = req.query.staffId;
    }
    
    let pickupData = await Pickup.find(query);
    if (pickupData) {
      return res.json({
        error: false,
        data: pickupData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Pickups does not exist',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.updatePickup= async (req, res) => {
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
    
    
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.getPickupBoys = async (req, res) => {
  try {
    
    let storeId = null;
    if(req.query.orderId) {
      let orderData  = await Order.findById(req.query.orderId);
      storeId = orderData.storeId;

    } else if(req.query.storeId) {
      storeId = req.query.storeId;
    } else {
      return res.status(400).json({
        error: true,
        message: 'StoreId/OrderId is missing',
      });
    }

    let pickupStaffList = await TimeSlotHelper.getPickupBoys(storeId);

    if (pickupStaffList) {
      return res.json({
        error: false,
        data: pickupStaffList,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'No staffs available for the pickup',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: 'Internal error occured. Please try again',
    });
  }
};