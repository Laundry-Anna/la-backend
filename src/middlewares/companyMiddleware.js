exports.isDuplicateCheckValidation = (json, postData, type) => {
  if (type === 'companyName') {
    return json.find(
      (company) =>
        company.companyName.toLowerCase() === postData.companyName.toLowerCase()
    );
  }
  if (type === 'mobile') {
    return json.find((company) => {
      return company.companyOwnerMobile === postData.companyOwnerMobile;
    });
  }
  if (type === 'code') {
    return json.find((company) => {
      return (
        company.companyCode.toLowerCase() === postData.companyCode.toLowerCase()
      );
    });
  }
};

exports.isDuplicateCheckValidationUpdate = (
  json,
  postData,
  type,
  dontCheck
) => {
  if (type === 'companyName') {
    return json.find(
      (company) =>
        company._id.toString() !== dontCheck &&
        company.companyName.toLowerCase() === postData.companyName.toLowerCase()
    );
  }
  if (type === 'mobile') {
    return json.find(
      (company) =>
        company._id.toString() !== dontCheck &&
        company.companyOwnerMobile === postData.companyOwnerMobile
    );
  }
  if (type === 'code') {
    return json.find(
      (company) =>
        company._id.toString() !== dontCheck &&
        company.companyCode.toLowerCase() === postData.companyCode.toLowerCase()
    );
  }
};
