exports.isDuplicateItemNameCheck = (json) => {
  var valueArr = json.map(function (item) {
    return item.itemName.toLowerCase();
  });
  var isDuplicate = valueArr.some(function (item, idx) {
    return valueArr.indexOf(item) != idx;
  });
  return isDuplicate;
};
