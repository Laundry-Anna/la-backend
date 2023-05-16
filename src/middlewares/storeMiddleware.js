exports.isDuplicateCheckValidation = (json, postData, type) => {
  if (type === 'name') {
    return json.find(
      (store) =>
        store.storeName.toLowerCase() === postData.storeName.toLowerCase()
    );
  }
  if (type === 'mobile') {
    return json.find((store) => {
      return store.storeMobile === postData.storeMobile;
    });
  }
  if (type === 'code') {
    return json.find((store) => {
      return store.storeCode.toLowerCase() === postData.storeCode.toLowerCase();
    });
  }
};

exports.isDuplicateCheckValidationUpdate = (
  json,
  postData,
  type,
  dontCheck
) => {
  if (type === 'name') {
    return json.find(
      (store) =>
        store._id.toString() !== dontCheck &&
        store.storeName.toLowerCase() === postData.storeName.toLowerCase()
    );
  }
  if (type === 'mobile') {
    return json.find(
      (store) =>
        store._id.toString() !== dontCheck &&
        store.storeMobile === postData.storeMobile
    );
  }
  if (type === 'code') {
    return json.find(
      (store) =>
        store._id.toString() !== dontCheck &&
        store.storeCode.toLowerCase() === postData.storeCode.toLowerCase()
    );
  }
};
