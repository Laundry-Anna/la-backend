exports.checkRatecardAssignedToStore = (ratecards, ratecardId) => {
  return ratecards.find(
    (ratecard) =>
      ratecard.ratecardOnline.toString() === ratecardId ||
      ratecard.ratecardOffline.includes(ratecardId)
  );
};
