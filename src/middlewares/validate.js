const Store = require('../models/store');
const Customer = require('../models/customer');
const commonValidation = require('./commonvalidation');

exports.validateCustomerId = async (customerId) => {
  let returnVal = {error: false};
  console.log('customerId', customerId)
  if (typeof customerId == 'undefined' || customerId == '' || customerId.length !== 24 ) {
    returnVal.error = true;
    returnVal.message = 'Please enter a valid customer id';
    return returnVal;
  }

  const validateObjectId = await commonValidation.isObjectId(
    customerId
  );
  if (!validateObjectId) {
    returnVal.error = true;
    returnVal.message = 'Please enter a valid input - customerId';
    return returnVal;
  }

  let customerData = await Customer.findById(customerId);
  if (!customerData) {
   
    returnVal.error = true;
    returnVal.message = 'Customer not exist';
    return returnVal;
    
  }

  return returnVal;
  
};
