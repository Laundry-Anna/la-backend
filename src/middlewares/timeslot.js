const Order = require('../models/order');
const mongoose = require('mongoose');
const Staff = require('../models/staff');
const Store = require('../models/store');
const Pickup = require('../models/pickup');
const Customer = require('../models/customer');
const Coupon = require('../models/coupon');
const Category = require('../models/category');
const MotherCategory = require('../models/mothercategory');
const LocationUtils = require('../utils/locationUtils');

exports.getTimeSlots = async function(storeId) {
    /* Find Available Time slots */
    const store = await Store.findById(storeId).populate('tempSlots.timeslot').populate('masterSlots.timeslot');
    const deliveryStaffIds = store.storeDeliveryBoys.map(s =>  typeof s == 'object' ? s.staffId : s);
    const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }}).populate('pickups');
    const timeSlots = store.masterSlots.toJSON();
    const tempTimeSlots = store.tempSlots
    //console.log('Staff Details', deliveryStaffs)

    let slots = [];
    var today = new Date();
    
    var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    

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
                console.log('Pickups', deliveryStaffs[i].pickups)
                let filled = deliveryStaffs[i].pickups.filter(p => {
                  return p.pickup.timeslotId.toString() == slot.timeslot._id.toString()  && s.date == new Date(p.pickup.date.toString()).toISOString().split('T')[0]
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
      Object.keys(slot.slots).forEach(s => {
        for(let i=0;i<deliveryStaffs.length; i++){
          if(Array.isArray(deliveryStaffs[i].pickups)) {
            console.log('ssss', s)
            let filled = deliveryStaffs[i].pickups.filter(p => p.pickup.timeslotId.toString() == slot._id.toString() && p.pickup.date == new Date(s.toString()).toISOString().split('T')[0]);
            //console.log('Filled slots', filled, p.timeslot.slotId)
            if(filled < 10) { //TODO Check with actual capacity
              available= true;
              slot.status = 'available';
              availableTempSlots.push(slot.timeslot);
              if(slots[new Date(s).toISOString().split('T')[0]] && slots[new Date(s).toISOString().split('T')[0]].slots)
              slots[new Date(s).toISOString().split('T')[0]].slots.push(slot.timeslot);
              break;
            }
          }
        }
      });
      /*
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
      */
    });
    //let data = orderData.toJSON();
    //data['slots'] = Object.values(slots);
    return Object.values(slots);

}


exports.getPickupBoys = async function(storeId) {
  const store = await Store.findById(storeId).populate('tempSlots').populate('masterSlots.timeslot');
  const deliveryStaffIds = store.storeDeliveryBoys.map(s =>  typeof s == 'object' ? s.staffId : s);
  const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }, 'staffStatus': 'Active'}).select('-staffEmployeeType -workdays -password  -staffProof -staffAlternateMobile -staffBankDetails -createdBy  -createdAt -updatedAt -roles -updatedType -updatedBy -isEmployeeStoreOwner')
  .populate({
    path: 'pickups',
    //match: { age: { $gte: 21 }},
  });
  return deliveryStaffs;
};

exports.getPickupBoysForTimeSlot = async function(timeslotId, storeId, date) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let day = days[new Date(date).getDay()];
  const store = await Store.findById(storeId).populate('tempSlots').populate('masterSlots.timeslot');
  const deliveryStaffIds = store.storeDeliveryBoys.map(s =>  typeof s == 'object' ? s.staffId : s);
  const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }, 'workdays': day, 'staffStatus': 'Active'}).select('-staffEmployeeType -password  -staffProof -staffAlternateMobile -staffBankDetails -createdBy  -createdAt -updatedAt -roles -updatedType -updatedBy -isEmployeeStoreOwner')
  .populate({
    path: 'pickups',
    match: { 'timeslotId': timeslotId},
  });
  let availableStaffs = [];
  //console.log('Day of slot', day, new Date(date), new Date(date).getDay(), date)
  //TODO: Filter the staffs based on current pickup limit

  for(let i=0;i<deliveryStaffs.length; i++) {
    console.log('workdays', deliveryStaffs[i].workdays)
    let s = deliveryStaffs[i].toJSON();
    delete s.__v;
    delete s.isCompanyOwner;
    delete s.pickups;
    delete s.staffStatus
    delete s.staffEmailId;
    delete s.companyId;
    delete s.staffMobile;
    availableStaffs.push(s);
  }
  return availableStaffs;
};

exports.getAllTimeSlots = async function(companyId, latitude, longitude ) {
  let filter = {};
  if(companyId !== null){
    filter['companyId'] = companyId;
  }
  //Find all stores of the company
  let stores = await Store.find(filter)
  .select('companyId ratecardOffline ratecardOnline storeName storeCode storePolygon storeDeliveryBoys masterSlots tempSlots')
  .populate('masterSlots.timeslot')
  .populate('tempSlots.timeslot')
  .populate('onlineRateCard')
  .populate('motherCategories');

 
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
  //console.log('store', store)
  /* Find Available Time slots */
  //const store = await Store.findById(storeId).populate('tempSlots').populate('masterSlots.timeslot');
  if(store == null) {
    let resp = {
      store: null
    }
    return resp;
  }
  const deliveryStaffIds = store.storeDeliveryBoys.map(s =>  typeof s == 'object' ? s.staffId : s);
  const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }}).populate('pickups');
  const timeSlots = store.masterSlots.toJSON();
  const tempTimeSlots = store.tempSlots;
  //console.log('Staff Details', deliveryStaffs)
  //console.log('TimeSlots', timeSlots, tempTimeSlots)
  
  let slots = [];
  var today = new Date();
  
  var days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  

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
  if(timeSlots && timeSlots.length) {
    timeSlots.forEach(slot => {
      //console.log('looping out', timeSlots.length)
      //let filled = deliveryStaffs.filter(s=> s.)
      let available = false;
      console.log('Slots', slot)
      slots.forEach(s => {
        //console.log('slot', slot, s.day)
        if(slot.slots[s.day].selected) {
          for(let i=0;i<deliveryStaffs.length; i++){
            
              if(Array.isArray(deliveryStaffs[i].pickups)) {
                //console.log('Pickups', deliveryStaffs[i].pickups, slot.timeslot)
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
  }
  console.log('Slots1', slots)
  slots = slots.reduce((obj, s) => {
    obj[s.date] = s;
    return obj;
  },{});
  
  let availableTempSlots = [];
  if(tempTimeSlots && tempTimeSlots.length) {
    tempTimeSlots.forEach(slot => {
      let available = false;
        Object.keys(slot.slots).forEach(s => {
          for(let i=0;i<deliveryStaffs.length; i++){
            if(Array.isArray(deliveryStaffs[i].pickups)) {
              ///console.log('ssss', s)
              let filled = deliveryStaffs[i].pickups.filter(p => p.timeslot.slotId.toString() == slot._id.toString() && p.timeslot.date == new Date(s.toString()).toISOString().split('T')[0]);
              //console.log('Filled slots', filled, p.timeslot.slotId)
              if(filled < 10) { //TODO Check with actual capacity
                available= true;
                if(availableTempSlots.filter(s => s._id.toString() == slot.timeslot.toString()).length == 0) {
                  slot.status = 'available';
                  availableTempSlots.push(slot.timeslot);
                  if(slots[new Date(s).toISOString().split('T')[0]] && slots[new Date(s).toISOString().split('T')[0]].slots)
                  slots[new Date(s).toISOString().split('T')[0]].slots.push(slot.timeslot);
               
                }
                break;
              }
            }
          }
      });
    });
  }
  console.log('Slots2', tempTimeSlots[0])
  let storeData = store.toJSON();
  delete storeData.tempSlots;
  delete storeData.storePolygon;
  delete storeData.masterSlots;

  const onlineRateCard = store.toJSON().onlineRateCard;
  let catIds = [];
  const mcId = onlineRateCard.rateCardServices[0].mcId;
  for(let i=0;i<onlineRateCard.rateCardServices.length; i++){
    catIds.push(onlineRateCard.rateCardServices[i].catId);
  }
  let categories = await Category.find({"_id": {'$in':catIds }}).select('catName mcId').populate({path: 'mc', model: 'motherCategory', select: 'mcName'});;
  let mc = await MotherCategory.findById(mcId).select('mcName')
  const services = {
    //'motherCategory': mc,
    'categories': categories
  }
  //let data = orderData.toJSON();
  //data['slots'] = Object.values(slots);
  let couponQuery = {status: 'Active'};

  let coupons = await Coupon.find(couponQuery).select('couponName');

  let resp = {
    store: storeData,
    slots: Object.values(slots),
    services: services,
    coupons: coupons
  }
  return resp;
  //return Object.values(slots);

}

exports.getAvailableStaff = async function(storeId, timeslotId, date) {
  let availableStaff = {};
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let day = days[date.getDay()];

  const store = await Store.findById(storeId).populate('tempSlots').populate('masterSlots.timeslot');
  const deliveryStaffIds = store.storeDeliveryBoys.map(s =>  typeof s == 'object' ? s.staffId : s);
  const deliveryStaffs = await Staff.find({'_id': { $in: deliveryStaffIds }, 'staffStatus': 'Active', 'workday': day}).select('-staffEmployeeType -workdays -password  -staffProof -staffAlternateMobile -staffBankDetails -createdBy  -createdAt -updatedAt -roles -updatedType -updatedBy -isEmployeeStoreOwner')
  .populate({
    path: 'pickups',
    match: {'pickup.date': date, type: 'pickup', 'pickup.timeslotId': timeslotId}
    //options: { match: { deleted: { $ne: true } } },
    //match: { age: { $gte: 21 }},
  });
  
  let staffs = deliveryStaffs.forEach(s => {
    let staff = s.toJSON();
    return {
      staffId: staff._id,
      pickups: staff.pickups.length,
      //capacity: staff.workdays[day]
    }
  });
  staffs = staffs.sort((a,b) => a.pickups - b.pickups);
  availableStaff = staffs[0];
  return availableStaff;
}