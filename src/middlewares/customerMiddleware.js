exports.insertIsDuplicateCheckValidation = (json, postData, type) => {
  if (type === 'mobile') {
    return json.find(
      (customer) => customer.mobileNumber === postData.mobileNumber
    );
  }
  if (type === 'email') {
    return json.find(
      (customer) =>
        customer.email.toLowerCase() === postData.email.toLowerCase()
    );
  }
  if (type === 'referarCode') {
    return json.find(
      (customer) =>
        customer.referralCode.toLowerCase() ===
        postData.referarCode.toLowerCase()
    );
  }
};

exports.updateIsDuplicateCheckValidation = (
  json,
  postData,
  type,
  dontCheck
) => {
  if (type === 'mobile') {
    return json.find(
      (customer) =>
        customer._id.toString() !== dontCheck &&
        customer.mobileNumber === postData.mobileNumber
    );
  }
  if (type === 'email') {
    return json.find(
      (customer) =>
        customer._id.toString() !== dontCheck &&
        customer.email.toLowerCase() === postData.email.toLowerCase()
    );
  }
  // if (type === 'referarCode') {
  //   return json.find(
  //     (customer) =>
  //       customer.referralCode.toLowerCase() ===
  //       postData.referarCode.toLowerCase()
  //   );
  // }
};
