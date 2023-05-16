const Slot = require('../models/slot');
const slotMiddleware = require('../middlewares/slot');
const Staff = require('../models/staff');
const store = require('../models/store');

exports.insertSlot = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
   
    // check same slot name exists on company level
    const insertValidateData = await slotMiddleware.slotValidation(
      req.body,
      req.user
    );
    if (Object.keys(insertValidateData).length > 0) {
      return res.status(400).json({
        error: insertValidateData.error,
        message: insertValidateData.message,
      });
    }
    // insert into slot table
    const newSlot = new slot({
      companyId: req.user.companyId,
      customerId: req.user._id,
      customer: req.body.customer,
      storeId: req.body.storeId,
      rateCardId: req.body.rateCardId,
      //timeSlotId: req.body.timeSlotId,
      couponCode: req.body.couponCode.toUpperCase(),
      slotTotal: req.body.slotTotal,
      revisedSlotTotal: req.body.revisedSlotTotal,
      deliveryCharge: req.body.deliveryCharge,
      express: req.body.express,
      discount: req.body.discount,
      cashback: req.body.cashback,
      //deliveryDate: req.body.deliveryDate,
      slotCategories: req.body.slotCategories,
      payments: req.body.payments,
    });
    let insertSlot = await newSlot.save();
    if (insertSlot) {
      res.status(200).json({
        error: false,
        message: 'Slot added successfully',
        data: {
          _id: insertSlot._id,
        },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Something went wrong. Please try again - slot',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.getSlots = async (req, res) => {
  try {
    
    let slotData = await slot.find({
      companyId: req.user.companyId,
    });
    if (slotData) {
      return res.json({
        error: false,
        data: slotData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Slots does not exist with company',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.getAvailableSlots = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized to access !',
      });
    }
    if (typeof req.query.storeId == 'undefined' || req.query.storeId == '' || req.query.storeId.length !== 24 ) {
      return res.status(400).json({
        error: true,
        message: 'Invalid store id',
      });
    }
    const storeId = req.query.storeId;
    const store = await store.findById(storeId);
    const deliveryStaffIds = store.storeDeliveryBoys;
    const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }}).populate('pickups');
    const timeSlots = store.masterSlots;

    let slotData = await Slot.find({
      companyId: req.user.companyId,
    });
    if (slotData) {
      return res.json({
        error: false,
        data: slotData,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Slots does not exist with company',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};
