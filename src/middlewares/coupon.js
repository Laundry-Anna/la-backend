const store = require('../models/store');

exports.couponValidation = async (postData, regUser) => {
  var returnVal = {};
  if (
    typeof postData.pickupTime !== 'undefined' &&
    postData.pickupTime !== ''
  ) {
    if (postData.pickupTime.selected === true) {
      if (
        typeof postData.pickupTime.fromDate === 'undefined' ||
        postData.pickupTime.fromDate === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Pickup from-date is required';
        return returnVal;
      }
      if (
        typeof postData.pickupTime.toDate === 'undefined' ||
        postData.pickupTime.toDate === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Pickup to-date is required';
        return returnVal;
      }
      // check pickupTime - fromdate should be less than enddate
      var fromDate = new Date(postData.pickupTime.fromDate);
      var toDate = new Date(postData.pickupTime.toDate);
      if (fromDate > toDate) {
        returnVal.error = true;
        returnVal.message = 'Pickup time FromDate must be less than toDate';
        return returnVal;
      }
    }
    if (postData.pickupTime.timeSelected === true) {
      if (
        typeof postData.pickupTime.fromTime === 'undefined' ||
        postData.pickupTime.fromTime === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Pickup from time is required';
        return returnVal;
      }
      if (
        typeof postData.pickupTime.toTime === 'undefined' ||
        postData.pickupTime.toTime === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Pickup to time is required';
        return returnVal;
      }
      // check pickupTime - fromtime should be less than toTime
      var fromTime = new Date(postData.pickupTime.fromTime);
      var toTime = new Date(postData.pickupTime.toTime);
      if (fromTime > toTime) {
        returnVal.error = true;
        returnVal.message = 'Pickup time Fromtime must be less than toTime';
        return returnVal;
      }
    }
  }
  if (
    typeof postData.bookingTime !== 'undefined' &&
    postData.bookingTime !== ''
  ) {
    if (postData.bookingTime.selected === true) {
      if (
        typeof postData.bookingTime.fromDate === 'undefined' ||
        postData.bookingTime.fromDate === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Booking from-date is required';
        return returnVal;
      }
      if (
        typeof postData.bookingTime.toDate === 'undefined' ||
        postData.bookingTime.toDate === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Booking to-date is required';
        return returnVal;
      }
      // check bookingTime - fromdate should be less than enddate
      var fromDate = new Date(postData.bookingTime.fromDate);
      var toDate = new Date(postData.bookingTime.toDate);
      if (fromDate > toDate) {
        returnVal.error = true;
        returnVal.message = 'Booking From-Date must be less than to-Date';
        return returnVal;
      }
    }
    if (postData.bookingTime.timeSelected === true) {
      if (
        typeof postData.bookingTime.fromTime === 'undefined' ||
        postData.bookingTime.fromTime === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Booking from-time is required';
        return returnVal;
      }
      if (
        typeof postData.bookingTime.toTime === 'undefined' ||
        postData.bookingTime.toTime === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Booking to-time is required';
        return returnVal;
      }
      // check bookingTime - fromtime should be less than toTime
      var fromTime = new Date(postData.bookingTime.fromTime);
      var toTime = new Date(postData.bookingTime.toTime);
      if (fromTime > toTime) {
        returnVal.error = true;
        returnVal.message = 'Booking time Fromtime must be less than toTime';
        return returnVal;
      }
    }
  }

  // orderMode
  if (typeof postData.orderMode !== 'undefined' && postData.orderMode !== '') {
    if (postData.orderMode.selected === true) {
      if (!Array.isArray(postData.orderMode.value)) {
        returnVal.error = true;
        returnVal.message = 'Order mode is empty';
        return returnVal;
      }
      if (postData.orderMode.value.length === 0) {
        returnVal.error = true;
        returnVal.message = 'Order mode is empty';
        return returnVal;
      }
    }
  }
  // serviceType
  if (
    typeof postData.serviceType !== 'undefined' &&
    postData.serviceType !== ''
  ) {
    if (postData.serviceType.selected === true) {
      if (!Array.isArray(postData.serviceType.value)) {
        returnVal.error = true;
        returnVal.message = 'Service type is empty';
        return returnVal;
      }
      if (postData.serviceType.value.length === 0) {
        returnVal.error = true;
        returnVal.message = 'Service type is empty';
        return returnVal;
      }
    }
  }
  // coupon code
  if (
    typeof postData.couponName === 'undefined' ||
    postData.couponName === ''
  ) {
    returnVal.error = true;
    returnVal.message = 'Coupon name is empty';
    return returnVal;
  }
  //category
  if (typeof postData.category !== 'undefined' && postData.category !== '') {
    if (postData.category.selected) {
      // check if criteriaType is defined or not
      if (
        typeof postData.category.criteriaType === 'undefined' &&
        postData.category.criteriaType === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Please select category criteria type';
        return returnVal;
      }
      // check if selectionArray empty or not
      if (
        typeof postData.category.selectionArray === 'undefined' &&
        postData.category.selectionArray === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Please select mothercategories or categories';
        return returnVal;
      }
      // check if selecttionArray is empty or not
      if (postData.category.selectionArray.length === 0) {
        returnVal.error = true;
        returnVal.message = 'Please select mothercategories or categories';
        return returnVal;
      }
    }
  }
  //Geo area  store we need to check
  if (typeof postData.geoArea !== 'undefined' && postData.geoArea !== '') {
    if (postData.geoArea.selected) {
      // check if selectionArray empty or not
      if (
        typeof postData.geoArea.selectionArray === 'undefined' &&
        postData.geoArea.selectionArray === ''
      ) {
        returnVal.error = true;
        returnVal.message = 'Please select stores to apply coupon';
        return returnVal;
      }
      // check if selecttionArray is empty or not
      if (postData.geoArea.selectionArray.length === 0) {
        returnVal.error = true;
        returnVal.message = 'Please select stores to apply coupon';
        return returnVal;
      }
      postData.geoArea.couponCheck = postData.geoArea.selectionArray;
    } else {
      // check if  geoArea selected is false
      // if company owner insert dont insert any store ids
      // if store owner insert all stores he is handling
      let storeIds;
      if (regUser.isCompanyOwner) {
        // get storeIds based on companyId
        storeIds = await this.getStoresByStaff(regUser.companyId);
        //postData.geoArea.couponCheck = [];
      } else {
        // get storeIds based on login
        storeIds = await this.getStoresByStaff(regUser.companyId, regUser._id);
      }
      if (Object.keys(storeIds).length > 0) {
        let newArray = [];
        storeIds.map((c) => {
          newArray.push(c._id.toString());
        });
        postData.geoArea.couponCheck = newArray;
      } else {
        returnVal.error = true;
        returnVal.message = 'Please select stores to apply coupon';
        return returnVal;
      }
    }
  }
  return returnVal;
};

// get staff stores based on companyId
exports.getStoresByStaff = (companyId, staffId = '') => {
  let getStores;
  if (companyId !== '' && staffId !== '') {
    getStores = store.find(
      {
        $and: [
          {
            companyId: companyId,
          },
          {
            storeOwners: staffId,
          },
        ],
      },
      { _id: 1 }
    );
  } else {
    getStores = store.find(
      {
        companyId: companyId,
      },
      { _id: 1 }
    );
  }
  return getStores;
};
