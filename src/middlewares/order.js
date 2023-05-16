const store = require('../models/store');

exports.orderValidation = async (postData, regUser) => {
  var returnVal = {};
  console.log('regUser', regUser)
  const orderType = postData.type ? postData.type : 'order';
  /*
  
  
  if (typeof postData.companyId == 'undefined' || postData.companyId == '' || postData.companyId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Company Id is empty or Invalid';
    return returnVal;
  }
  */
  if(postData.customer && postData.customer.id !== '') {
    postData.customerId = postData.customer.id;
  }

  if (typeof postData.customerId == 'undefined' || postData.customerId == '') {
    returnVal.error = true;
    returnVal.message = 'Customer Id is empty or Invalid';
    return returnVal;
  }
  if (typeof postData.storeId == 'undefined' || postData.storeId == '' || postData.storeId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Store Id is empty or Invalid';
    return returnVal;
  }

  
  if (typeof postData.rateCardId == 'undefined' || postData.rateCardId == '' || postData.rateCardId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Rate Card Id is empty or Invalid';
    return returnVal;
  }
 
  //Pickup/Delivery Object validation
  /*
  if (typeof postData.timeSlotId == 'undefined' || postData.timeSlotId == '' || postData.timeSlotId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Time Slot Id is empty or Invalid';
    return returnVal;
  }
  */
  let validateObjects = ['Pickup', 'Delivery'];
  for(let i=0;i<2;i++){
    if (typeof postData[validateObjects[i].toLowerCase()] == 'object') {
      const field = validateObjects[i];
      let data = postData[validateObjects[i].toLowerCase()];
      /*
      if(Object.keys(data).length < 2) {
        returnVal.error = true;
        returnVal.message = `${field} object missing required data`;
        return returnVal;
      }
     
      if(typeof data.staffId == 'undefined' || data.staffId == '' || data.staffId.length !== 24 ) {
        returnVal.error = true;
        returnVal.message = `${field} object missing staffId`;
        return returnVal;
      }
      */
      if(typeof data.timeslotId == 'undefined' || data.timeslotId == '' || data.timeslotId.length !== 24 ) {
        returnVal.error = true;
        returnVal.message = `${field} object missing timeslotId`;
        return returnVal;
      }
      if(typeof data.date == 'undefined' || data.date == '') {
        returnVal.error = true;
        returnVal.message = `${field} object missing pickup date`;
        return returnVal;
      }
    }
  }
  
  
  if(!postData.mcId || postData.mcId.length !== 24) {
    returnVal.error = true;
    returnVal.message = 'Mother Category Id is empty or Invalid';
    return returnVal;
  }
  let error = false, message = '';
  if(orderType == 'order') {

    if (typeof postData.orderTotal == 'undefined' || postData.orderTotal == '' || isNaN(postData.rateCardId.length)) {
      returnVal.error = true;
      returnVal.message = 'Order Total is empty or Invalid';
      return returnVal;
    }

    if (typeof postData.address == 'undefined' || postData.address == '') {
      returnVal.error = true;
      returnVal.message = 'Address is missing/invalid';
      return returnVal;
    }

    if (typeof postData.orderCategories == 'undefined' || postData.orderCategories == '' || postData.orderCategories.length == 0) {
      returnVal.error = true;
      returnVal.message = 'Order Details is empty or Invalid';
      return returnVal;
    } else {
     

      for(let i=0;i<postData.orderCategories.length; i++) {
        let order = postData.orderCategories[i];
        let keys = Object.keys(postData.orderCategories[i]);
        if(!order.categoryId || order.categoryId.length !== 24) {
          error = true;
          message='Category Id is invalid or empty';
          break;
        } else if(!order.subOrderTotal || order.subOrderTotal == '' || isNaN(order.subOrderTotal)) {
          error = true;
          message='Sub order total is invalid';
          break;
        } else if(!order.subOrderServices || order.subOrderServices.length == 0) {
          error = true;
          message='Sub order detailsare required';
          break;
        }
        //Validate sub order details
        let subOrderError = false;
        for(let j=0;j<order.subOrderServices.length;j++){
          let subOrder = order.subOrderServices[j];
          if(!subOrder.catId || subOrder.catId.length !== 24) {
            subOrderError = true;
            message='Sub Order Category Id is invalid or empty';
            break;
          } else if(!subOrder.perUnitPrice || subOrder.perUnitPrice == '' || isNaN(subOrder.perUnitPrice)) {
            subOrderError = true;
            message='Sub order Unit Prize is invalid';
            break;
          }
        }
        if(subOrderError) {
          error=true;
          break;
        }
      }
    }
  }

  if(error) {
    returnVal.error = true;
    returnVal.message = message;
    return returnVal;
  } else {
    return returnVal;
  }
  
};

exports.validateOrder =  async (req, res, next) => {
  let result = {};
  result.error = true;
  result.message = 'Please select stores to apply order';
  next();
  //return res.status(401).json(result);
};

exports.validateUpdateOrder =  async (req, res, next) => {
  let result = {};
  result.error = true;
  result.message = 'Please select stores to apply order';
  next();
  //return res.status(401).json(result);
};

exports.prepareOrderUpdateObject =  async (payload, user, orderData) => {
  let updateObj = {};
  updateObj.updatedBy = user._id;
  //updateObj.updatedType = user.userType; 
  if(payload.addressId) {
    updateObj['addressId'] = payload.addressId;
  }
  if(payload.pickup) {
    updateObj['pickup'] = payload.pickup;
  }
  if(payload.delivery) {
    updateObj['delivery'] = payload.delivery;
  }
  if(payload.couponCode) {
    updateObj['couponCode'] = payload.couponCode;
  }
  if(payload.type) {
    updateObj['type'] = payload.type;
  }
  if(payload.orderTotal) {
    updateObj['orderTotal'] = payload.orderTotal;
  }
  if(payload.revisedOrderTotal) {
    updateObj['revisedOrderTotal'] = payload.revisedOrderTotal;
  }
  if(payload.deliveryCharge) {
    updateObj['deliveryCharge'] = payload.deliveryCharge;
  }
  if(payload.hasOwnProperty('express')) {
    updateObj['express'] = payload.express;
  }
  if(payload.discount) {
    updateObj['discount'] = payload.discount;
  }
  if(payload.cashback) {
    updateObj['cashback'] = payload.cashback;
  }
  if(payload.status && orderData.status !== payload.status) {
    let tracking = orderData.tracking || [];
    tracking.push({
      date: Date.now(),
      status: payload.status,
      updatedBy: user._id
    });
    updateObj['tracking'] = tracking;
    updateObj['status'] = payload.status;
  }

  if(payload.payments) {
    updateObj['payments'] = payload.payments;
  }
  if(payload.balance) {
    updateObj['balance'] = payload.balance;
  }
  if(payload.cashback) {
    updateObj['cashback'] = payload.cashback;
  }
  return updateObj;
};
