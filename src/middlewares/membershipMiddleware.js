exports.insertMembershipExistsInJSON = (json, findValue) => {
  return json.find(
    (plan) => plan.planName.toLowerCase() === findValue.toLowerCase()
  );
};

exports.updateMembershipExistsInJSON = (json, findValue, dontCheck) => {
  return json.find(
    (plan) =>
      plan._id.toString() !== dontCheck &&
      plan.planName.toLowerCase() === findValue.toLowerCase()
  );
};
