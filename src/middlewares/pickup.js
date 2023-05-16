const store = require('../models/store');

exports.pickupValidation = async (postData, regUser) => {
  var returnVal = {};
  
  if (typeof postData.storeId == 'undefined' || postData.storeId == '' || postData.storeId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Store Id is empty or Invalid';
    return returnVal;
  }

  if (typeof postData.companyId == 'undefined' || postData.companyId == '' || postData.companyId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Company Id is empty or Invalid';
    return returnVal;
  }
   
  if (typeof postData.orderId == 'undefined' || postData.orderId == '' || postData.orderId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Order Id is empty or Invalid';
    return returnVal;
  }
  
  if (typeof postData.staffId == 'undefined' || postData.staffId == '' || postData.staffId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Staff Id is empty or Invalid';
    return returnVal;
  }
  
  if (typeof postData.slotId == 'undefined' || postData.slotId == '' || postData.slotId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Slot Id is empty or Invalid';
    return returnVal;
  }

  return returnVal;
  
};
