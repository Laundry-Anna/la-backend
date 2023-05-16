const order = require('../models/order');
const orderMiddleware = require('../middlewares/order');
const Staff = require('../models/staff');
const Store = require('../models/store');
const Pickup = require('../models/pickup');
const timeSlotHelper = require('../middlewares/timeslot');
const SMSUtils = require('../utils/smsUtils');

exports.insertOrder = async (req, res) => {
  //try {
    if (!req.user) {
      return res.status(401).json({
        error: true,
        message: 'Not authorized to access !',
      });
    }
   
    // check same order name exists on company level
    const insertValidateData = await orderMiddleware.orderValidation(
      req.body,
      req.user
    );
    if (Object.keys(insertValidateData).length > 0) {
      return res.status(400).json({
        error: insertValidateData.error,
        message: insertValidateData.message,
      });
    }
    let type = req.body.type || 'order';
    let orderObj = {
      companyId: req.user.companyId,
      customerId: req.body.customerId,
      //customer: req.body.customer,
      addressId:req.body.address._id ? req.body.address._id : null,
      address: req.body.address,
      //storeId: req.body.storeId,
      //rateCardId: req.body.rateCardId,
      type: type,
      //timeSlotId: req.body.timeSlotId,
      couponCode: req.body.couponCode ? req.body.couponCode.toUpperCase() : '',
      couponList: req.body.couponList && Array.isArray(req.body.couponList) ? req.body.couponList : [],
      orderTotal: req.body.orderTotal || 0,
      revisedOrderTotal: req.body.revisedOrderTotal || 0,
      deliveryCharge: req.body.deliveryCharge || 0,
      express: req.body.express,
      discount: req.body.discount,
      cashback: req.body.cashback,
      orderCategories: req.body.orderCategories ? req.body.orderCategories : '',
      payments: req.body.payments || [],
    };
    if(req.body.storeId && req.body.storeId.length == 24) {
      orderObj.storeId = req.body.storeId;
    }
    if(req.body.rateCardId && req.body.rateCardId.length == 24) {
      orderObj.rateCardId = req.body.rateCardId;
    }
    if(type == 'pickup' && req.body.pickup && typeof req.body.pickup =='object' && Object.keys(req.body.pickup).length >=2) {
      let pickup = {
        staffId: req.body.pickup.staffId ? req.body.pickup.staffId: null,
        timeslotId: req.body.pickup.timeslotId,
        date: req.body.pickup.date
      }
      orderObj.pickup = pickup;
      orderObj.status = 'PICKUP_SCHEDULED';

      let availableStaffs = await timeSlotHelper.getPickupBoysForTimeSlot(req.body.pickup.timeslotId, req.body.storeId, req.body.pickup.date);
      //TODO Get staff with lower pickups and auto assign = true
      console.log('availableStaffs.length', availableStaffs.length)
      if((!orderObj.pickup.staffId || orderObj.pickup.staffId == '') && availableStaffs.length){
        orderObj.pickup.staffId = availableStaffs[0]._id;
      }
    }
    
    // insert into order table
    const newOrder = new order(orderObj);
    let insertOrder = await newOrder.save();
    if (insertOrder) {
      res.status(200).json({
        error: false,
        message: 'Order created successfully',
        data: {
          _id: insertOrder._id,
        },
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Something went wrong. Please try again - order',
      });
    }
  // } catch (error) {
  //   return res.status(500).json({
  //     error: true,
  //     message: error.message,
  //   });
  // }
};


exports.getOrders = async (req, res) => {
  try {
    
    let limit = req.query.limit || 10;
    let query = {companyId: req.user.companyId};
    if(req.query.type && req.query.type !== '') {
      query['type'] = req.query.type;
    }
    let orderData = await order.find(query)
    .select('-tracking')
    .populate('customer')
    .populate('pickup.timeslot')
    .limit(limit);
    let result = [];
    if (orderData) {
      for(let i=0;i<orderData.length; i++){
        let data = orderData[i].toJSON();
        let slots = await timeSlotHelper.getTimeSlots(orderData[i].storeId);
        data['slots'] = slots;
        let availableStaffs = [];
        if(orderData[i].pickup && orderData[i].pickup.timeslotId) {
          availableStaffs = await timeSlotHelper.getPickupBoysForTimeSlot(orderData[i].pickup.timeslotId, orderData[i].storeId, orderData[i].pickup.date);
        }
        data['pickupStaffs'] = availableStaffs;
        result.push(data);
      }
     
     
      return res.json({
        error: false,
        data: result,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Orders does not exist with company',
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized to access !',
      });
    }
    
    //check if the record exist
    let orderData = await order.findById(req.params.orderId);
    if(orderData == null) {
      return res.status(400).json({
        error: 'The order does not exist',
      });
    }

    const updateObj = await orderMiddleware.prepareOrderUpdateObject(req.body,req.user, orderData);
    console.log('Order update object',updateObj );
    let updateOrder= await order.findByIdAndUpdate(
      { _id: req.params.orderId },
      updateObj,
      { new: true, useFindAndModify: false }
    );
    if (updateOrder) { 
      res.status(200).json({
        error: null,
        message: 'Order updated successfully',
        data: updateOrder,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Order not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

/*else if(autoAssignPickup) {
  const pickupInfo = await timeSlotHelper.getAvailableStaff(req.body.storeId);

}
*/

exports.assignPickupStaff = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'Not authorized to access !',
      });
    }
    
    //check if the record exist
    let orderData = await order.findById(req.params.orderId);
    const payload = req.body;
    if(orderData == null) {
      return res.status(400).json({
        error: 'The order does not exist',
      });
    }
    if(typeof payload.timeslotId == 'undefined' || payload.timeslotId == '' || payload.timeslotId.length !== 24 ) {
      return res.status(400).json({
        error: 'Timeslot Id is missing in the payload',
      });
    }
    if(typeof payload.date == 'undefined' || payload.date == '') {
      return res.status(400).json({
        error: 'Date is missing in the payload',
      });
    }
    const pickupInfo = await timeSlotHelper.getAvailableStaff(orderData.storeId, payload.timeslotId, payload.date);

    const updateObj = {
      pickup: {
        staffId: pickupInfo.staffId,
        timeslotId: payload.timeslotId,
        date: payload.date
      }
    }
    console.log('Order update object',updateObj );
    let updateOrder= await order.findByIdAndUpdate(
      { _id: req.params.orderId },
      updateObj,
      { new: true, useFindAndModify: false }
    );
    if (updateOrder) {
      res.status(200).json({
        error: null,
        message: 'Assigned staff for the order successfully',
        data: updateOrder,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Order not updated. Please try again',
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    
    if (typeof req.params.orderId == 'undefined' || req.params.orderId == '' || req.params.orderId.length !== 24 ) {
      return res.status(400).json({
        error: true,
        message: 'Invalid order id',
      });
    }

    let orderData = await order.findById(req.params.orderId).select('-tracking').populate('customer').populate('pickup.timeslot');
    if (orderData) {

      /* Find Available Time slots */
      /*
      const storeId = orderData.storeId;
      const store = await Store.findById(storeId).populate('tempSlots').populate('masterSlots.timeslot');
      const deliveryStaffIds = store.storeDeliveryBoys;
      const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }}).populate('pickups');
      const timeSlots = store.masterSlots.toJSON();
      const tempTimeSlots = store.tempSlots;
      //console.log('Staff Details', deliveryStaffs)

      let slots = [];
      var today = new Date();
      
      var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      //var d = new Date(dateString);
      //var dayName = days[d.getDay()];

      for(let i=0;i<7;i++) {
        let day = days[today.getDay()];
        const date = today.toISOString().split('T')[0];
        slots.push({date, slots: [], day})
        //slots[date] = {date, slots: [], day};
        today.setDate(today.getDate() + 1);
      }

      //console.log('slots', slots)

      //find available master slots
      let availableMasterSlots = [];
      timeSlots.forEach(slot => {
        //let filled = deliveryStaffs.filter(s=> s.)
        let available = false;
        slots.forEach(s => {
          //console.log('slot', slot, s.day)
          if(slot.slots[s.day].selected) {
            for(let i=0;i<deliveryStaffs.length; i++){
                if(Array.isArray(deliveryStaffs[i].pickups)) {
                  //console.log('Pickups', deliveryStaffs[i].pickups)
                  let filled = deliveryStaffs[i].pickups.filter(p => {
                    return p.timeslot.slotId.toString() == slot.timeslot._id.toString()  && s.date == new Date(p.timeslot.date.toString()).toISOString().split('T')[0]
                  });
                  //console.log('Filled slots',filled.length)
                  if(filled < 10) { //TODO Check with actual capacity
                    available= true;
                    slot.status = 'available';
                    availableMasterSlots.push(slot);
                    s.slots.push(slot.timeslot);
                    break;
                  }
                } else {
                    available= true;
                    slot.status = 'available';
                    availableMasterSlots.push(slot);
                    s.slots.push(slot.timeslot);
                    break;
                }
              }
            }
          });
      });
      slots = slots.reduce((obj, s) => {
        obj[s.date] = s;
        return obj;
      },{});
      
      let availableTempSlots = [];
      tempTimeSlots.forEach(slot => {
        let available = false;
        slot.slots.forEach(s => {
            for(let i=0;i<deliveryStaffs.length; i++){
              if(Array.isArray(deliveryStaffs[i].pickups)) {
                let filled = deliveryStaffs[i].pickups.filter(p => p.timeslot.slotId.toString() == slot._id.toString() && p.timeslot.date == new Date(s.date.toString()).toISOString().split('T')[0]);
                //console.log('Filled slots', filled, p.timeslot.slotId)
                if(filled < 10) { //TODO Check with actual capacity
                  available= true;
                  slot.status = 'available';
                  availableTempSlots.push(slot);
                  slots[s.date.toISOString().split('T')[0]].slots.push(slot);
                  break;
                }
              }
            }
        });
      });
      
      */
     let data = orderData.toJSON();
     let slots = await timeSlotHelper.getTimeSlots(data.storeId);
      data['slots'] = slots;
      return res.json({
        error: false,
        data: data
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Order does not exist',
      });
    }
  } catch (error) {
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};


exports.getPickupStaffsForOrder = async (req, res) => {
  try {
    if (typeof req.params.orderId == 'undefined' || req.params.orderId == '' || req.params.orderId.length !== 24 ) {
      return res.status(400).json({
        error: true,
        message: 'Invalid order id',
      });
    }
    if (typeof req.params.timeslotId == 'undefined' || req.params.timeslotId == '' || req.params.timeslotId.length !== 24 ) {
      return res.status(400).json({
        error: true,
        message: 'Invalid timeslot id',
      });
    }
    if (typeof req.query.date == 'undefined' || req.query.date == '') {
      return res.status(400).json({
        error: true,
        message: 'Invalid date',
      });
    }

    let query = {_id: req.params.orderId};
    let orderData = await order.findOne(query)

    let availableStaffs = await timeSlotHelper.getPickupBoysForTimeSlot(req.params.timeslotId, orderData.storeId, req.query.date);
        
    if (orderData) {
      return res.json({
        error: false,
        data: availableStaffs,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: 'Orders does not exist',
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};