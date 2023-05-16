exports.insertStaffValueExistsInJSON = (json, postData, type) => {
  if (type === 'mobile') {
    return json.find(
      (staff) =>
        staff.staffMobile.toLowerCase() === postData.staffMobile.toLowerCase()
    );
  }
  if (type === 'email') {
    return json.find((staff) => {
      return staff.staffEmailId === postData.staffEmailId;
    });
  }
};

exports.updateStaffValueExistsInJSON = (json, postData, type, dontCheck) => {
  if (type === 'mobile') {
    return json.find(
      (staff) =>
        staff._id.toString() !== dontCheck &&
        staff.staffMobile.toLowerCase() === postData.staffMobile.toLowerCase()
    );
  }
  if (type === 'email') {
    return json.find(
      (staff) =>
        staff._id.toString() !== dontCheck &&
        staff.staffEmailId === postData.staffEmailId
    );
  }
};
